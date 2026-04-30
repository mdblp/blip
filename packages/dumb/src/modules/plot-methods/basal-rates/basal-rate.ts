/*
 * Copyright (c) 2014-2026, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import _ from 'lodash'
import * as d3 from 'd3'
import { type Basal, BasalDeliveryType } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Basal)

type BasalOptions = PlotOptions<Basal> & {
  defaultSource: string
}

type BasalPlotFunction = PlotFunction<Basal> & {
  addRectToPool: (selection: d3.Selection<SVGGElement, Basal, SVGGElement, unknown>, invisible?: boolean) => void
  updatePath: (selection: d3.Selection<SVGPathElement, string, SVGGElement, unknown>, data: Basal[]) => void
  pathData: (data: Basal[]) => string
  xPosition: (d: Basal) => number
  segmentEndXPosition: (d: Basal) => number
  yPosition: (d: Basal) => number
  pathYPosition: (d: Basal) => number
  invisibleRectYPosition: () => number
  width: (d: Basal) => number
  height: (d: Basal) => number
  invisibleRectHeight: () => number
}

// Visual constants for basal rendering
const DEFAULT_OPACITY = 0.6
const DEFAULT_OPACITY_DELTA = 0.2
const DEFAULT_PATH_STROKE = 1.5

const defaults: Partial<BasalOptions> = {
  defaultSource: 'default',
  xScale: null
}

/**
 * Get the basal path group type
 * @param datum - Single basal datum
 * @returns The path group type ('automated' or 'manual')
 */
function getBasalPathGroupType(datum: Basal): 'automated' | 'manual' {
  return datum.deliveryType === BasalDeliveryType.Automated ? 'automated' : 'manual'
}

/**
 * Group basal segments by delivery type
 * @param basals - Array of preprocessed Tidepool basal objects
 * @returns Groups of alternating 'automated' and 'manual' datums
 */
function getBasalPathGroups(basals: Basal[]): Basal[][] {
  const basalPathGroups: Basal[][] = []
  let currentPathType = ''

  _.forEach(basals, (datum) => {
    const pathType = getBasalPathGroupType(datum)
    if (pathType !== currentPathType) {
      currentPathType = pathType
      basalPathGroups.push([])
    }
    _.last(basalPathGroups)!.push(datum)
  })

  return basalPathGroups
}

/**
 * Plot basal insulin data in the diabetes management timeline
 *
 * Basal insulin is background insulin delivered continuously throughout the day to maintain
 * stable blood glucose levels between meals and overnight. This plotter visualizes basal
 * rates as rectangles with heights proportional to the rate, connected by paths showing
 * transitions between different rates.
 *
 * Visual Features:
 * - Rectangles representing basal segments (height = rate, width = duration)
 * - Connecting paths showing rate changes over time
 * - Different visual styles for delivery types (scheduled, automated, temporary)
 * - Undelivered/suppressed basal shown with special styling
 * - Invisible hover target rectangles for better interactivity
 *
 * Delivery Types:
 * - **Scheduled**: Pre-programmed basal rates
 * - **Automated**: Algorithm-adjusted rates (e.g., closed-loop systems)
 * - **Temporary**: Manual temporary rate adjustments
 *
 * Medical Context:
 * - Basal insulin provides 40-60% of total daily insulin needs
 * - Proper basal rates prevent blood sugar drift between meals
 * - Automated basal adjustments help optimize glucose control
 * - Temporary basals used for exercise, illness, etc.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders basal insulin data when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotBasal(pool, {
 *   tidelineData,
 *   defaultSource: 'Medtronic',
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotBasal = (pool: Pool<Basal>, opts: Partial<BasalOptions> = {}): BasalPlotFunction => {
  const options = _.defaults(opts, defaults) as BasalOptions

  const basal: BasalPlotFunction = function (selection: PlotSelection<Basal>): void {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const medicalData = options.tidelineData.medicalData
      const basalValues = pool.filterDataForRender(medicalData.basal)

      // Step 2: Apply domain-specific filtering - only valid basal segments with duration > 0
      const currentData = _.filter(basalValues, (d) => d.type === 'basal' && d.duration > 0)

      // Clean up old path groups
      d3.select(this).selectAll('g.d3-basal-path-group').remove()

      // Step 3: Early exit if no data
      if (currentData.length < 1) {
        d3.select(this).selectAll('g.d3-basal-group').remove()
        return
      }

      // Step 4: Data join with enter/update/exit pattern for basal segments
      const basalSegments = d3.select(this)
        .selectAll<SVGGElement, Basal>('.d3-basal-group')
        .data(currentData, (d: Basal) => d.id)

      basalSegments.exit().remove()

      // Create new basal segment groups
      const basalSegmentGroups: d3.Selection<SVGGElement, Basal, SVGGElement, unknown> = basalSegments.enter()
        .append('g')
        .classed('d3-basal-group', true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: Basal) => idGen.testId(d))

      // Add visible rectangles for non-zero rate segments
      const nonZero = basalSegmentGroups.filter((d: Basal) => d.rate > 0)
      basal.addRectToPool(nonZero)

      // Add invisible hover target rectangles for all segments
      basal.addRectToPool(basalSegmentGroups, true)

      // Step 5: Create connecting paths grouped by delivery type
      const basalPathGroups = getBasalPathGroups(currentData)

      const basalPathsGroup = selection
        .selectAll<SVGGElement, string>('.d3-basal-path-group')
        .data(['d3-basal-path-group'])
        .join('g')
        .attr('class', 'd3-basal-path-group')

      // Create paths for each delivery type group
      _.forEach(basalPathGroups, (pathData) => {
        const id = pathData[0].id
        const pathType = getBasalPathGroupType(pathData[0])
        const pathClass = `d3-basal d3-path-basal d3-path-basal-${pathType}-${id}`

        const path = basalPathsGroup
          .selectAll<SVGPathElement, string>(`.${pathClass.replace(/ /g, '.')}`)
          .data([pathClass])
          .join('path')
          .attr('class', (d: string) => d)

        basal.updatePath(path, pathData)
      })

      // Step 6: Set up event handlers
      selection.selectAll<SVGGElement, Basal>(`.d3-basal-group`)
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Basal) {
          // Increase opacity on hover
          d3.select(this).selectAll('.d3-basal.d3-rect-basal')
            .attr('opacity', DEFAULT_OPACITY + DEFAULT_OPACITY_DELTA)

          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement, _event: MouseEvent, d: Basal) {
          // Restore default opacity
          if (d.deliveryType === BasalDeliveryType.Temporary && d.rate > 0) {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', DEFAULT_OPACITY - DEFAULT_OPACITY_DELTA)
          } else {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', DEFAULT_OPACITY)
          }

          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }

  /**
   * Add rectangle to pool
   * @param selection - The D3 selection to add rectangles to
   * @param invisible - Whether to create invisible hover target rectangles
   */
  basal.addRectToPool = (
    selection: d3.Selection<SVGGElement, Basal, SVGGElement, unknown>,
    invisible: boolean = false
  ): void => {
    options.xScale = pool.xScale().copy()

    const heightFn = invisible ? basal.invisibleRectHeight : basal.height
    const yPosFn = invisible ? basal.invisibleRectYPosition : basal.yPosition

    selection.append('rect')
      .attr('id', (d: Basal) => idGen.elementId(d, invisible ? 'invisible' : 'visible'))
      .attr('x', basal.xPosition)
      .attr('y', yPosFn)
      .attr('opacity', (d: Basal) => {
        if (invisible) {
          return null
        }
        if (d.deliveryType === BasalDeliveryType.Temporary && d.rate > 0) {
          return DEFAULT_OPACITY - DEFAULT_OPACITY_DELTA
        }
        return DEFAULT_OPACITY
      })
      .attr('width', basal.width)
      .attr('height', heightFn)
      .attr('class', (d: Basal) =>
        invisible
          ? 'd3-basal d3-basal-invisible'
          : `d3-basal d3-rect-basal d3-basal-${d.deliveryType}`
      )
  }

  /**
   * Update path with new data
   * @param selection - The path selection to update
   * @param data - The data to visualize
   */
  basal.updatePath = (
    selection: d3.Selection<SVGPathElement, string, SVGGElement, unknown>,
    data: Basal[],
  ): void => {
    options.xScale = pool.xScale().copy()

    const pathDef = basal.pathData(data)

    if (pathDef !== '') {
      selection.attr('d', pathDef)
    }
  }

  /**
   * Generate SVG path data string
   * @param data - The data to visualize
   * @returns The SVG path data string
   */
  basal.pathData = (data: Basal[]): string => {
    options.xScale = pool.xScale().copy()

    function stringCoords(datum: Basal): string {
      return basal.xPosition(datum) + ',' + basal.pathYPosition(datum) + ' '
    }

    let d = ''
    for (let i = 0; i < data.length; ++i) {
      if (i === 0) {
        // start with a moveto command
        d += 'M' + stringCoords(data[i])
      } else if (data[i].normalTime === data[i - 1].normalEnd) {
        // if segment is contiguous with previous, draw a vertical line connecting their values
        d += 'V' + basal.pathYPosition(data[i]) + ' '
      }
      else if (data[i].normalTime !== data[i - 1].normalEnd) {
        // if segment is not contiguous with previous, skip to beginning of segment
        d += 'M' + stringCoords(data[i])
      }
      // always add a horizontal line corresponding to current segment
      d += 'H' + basal.segmentEndXPosition(data[i]) + ' '
    }
    return d
  }

  /**
   * Calculate x position for a data point
   * @param d - The data point
   * @returns The x position
   */
  basal.xPosition = (d: Basal): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  /**
   * Calculate end x position for a segment
   * @param d - The data point
   * @returns The end x position
   */
  basal.segmentEndXPosition = (d: Basal): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epochEnd)
  }

  /**
   * Calculate y position for a data point
   * @param d - The data point
   * @returns The y position
   */
  basal.yPosition = (d: Basal): number => {
    const yScale = pool.yScale()
    return yScale(d.rate)
  }

  /**
   * Calculate path y position (adjusted for stroke width)
   * @param d - The data point
   * @returns The path y position
   */
  basal.pathYPosition = (d: Basal): number => {
    const yScale = pool.yScale()
    return yScale(d.rate) - DEFAULT_PATH_STROKE / 2
  }

  /**
   * Calculate y position for invisible rectangles
   * @returns The y position
   */
  basal.invisibleRectYPosition = (): number => 0

  /**
   * Calculate width for a segment
   * @param d - The data point
   * @returns The width
   */
  basal.width = (d: Basal): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epochEnd) - options.xScale(d.epoch)
  }

  /**
   * Calculate height for a segment
   * @param d - The data point
   * @returns The height
   */
  basal.height = (d: Basal): number => {
    const yScale = pool.yScale()
    return pool.height() - yScale(d.rate)
  }

  /**
   * Calculate height for invisible rectangles
   * @returns The height
   */
  basal.invisibleRectHeight = (): number => {
    return pool.height()
  }

  return basal
}

