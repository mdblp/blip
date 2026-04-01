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
import { Basal, BasalDeliveryType } from 'medical-domain'
import { Pool } from '../../models/pool.model'
import { getTooltipContainer } from '../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../models/plot-function.model'
import { PlotSelection } from '../../models/plot-selection.model'
import { PlotOptions } from '../../models/plot-options.model'

type BasalOptions = PlotOptions<Basal> & {
  opacity: number
  opacityDelta: number
  pathStroke: number
  tooltipPadding: number
  defaultSource: string
}

type BasalPlotFunction = PlotFunction & {
  addRectToPool: (selection: d3.Selection<d3.BaseType, Basal, SVGGElement, any>, invisible?: boolean) => void
  updatePath: (selection: d3.Selection<SVGPathElement, string, SVGGElement, any>, data: Basal[], isUndelivered?: boolean) => void
  pathData: (data: Basal[], isUndelivered?: boolean) => string
  xPosition: (d: Basal) => number
  segmentEndXPosition: (d: Basal) => number
  yPosition: (d: Basal) => number
  pathYPosition: (d: Basal) => number
  invisibleRectYPosition: () => number
  width: (d: Basal) => number
  height: (d: Basal) => number
  invisibleRectHeight: () => number
}

const defaults: Partial<BasalOptions> = {
  opacity: 0.6,
  opacityDelta: 0.2,
  pathStroke: 1.5,
  tooltipPadding: 20,
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
 * Plot basal insulin data
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The basal plotting function
 */
export const plotBasal = (pool: Pool<Basal>, opts: Partial<BasalOptions> = {}): BasalPlotFunction => {
  const options = _.defaults(opts, defaults) as BasalOptions

  /**
   * Get the scheduled or automated delivery that was suppressed
   * @param supp - The suppressed data
   * @returns The suppressed scheduled or automated delivery
   */
  function getDeliverySuppressed(supp: any): Basal | undefined {
    if (_.includes([BasalDeliveryType.Scheduled, BasalDeliveryType.Automated], supp.deliveryType)) {
      return supp as Basal
    } else if (supp.suppressed) {
      return getDeliverySuppressed(supp.suppressed)
    }
    return undefined
  }

  /**
   * Get undelivered basal segments
   * @param data - Array of basal data
   * @returns Undelivered segments
   */
  function getUndelivereds(data: Basal[]): Basal[] {
    const undelivereds: Basal[] = []

    for (const element of data) {
      const d = element as any
      if (d.suppressed) {
        const scheduled = getDeliverySuppressed(d.suppressed)
        if (scheduled) {
          undelivereds.push(scheduled)
        }
      }
    }
    return undelivereds
  }

  const basal: PlotFunction & any = function (selection: PlotSelection): void {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement, data: Basal[]) {
      const currentData = _.filter(data, (d) => d.type === 'basal' && d.duration > 0)
      d3.select(this).selectAll('g.d3-basal-path-group').remove()

      if (currentData.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-basal-group').remove()
        return
      }

      // Select all basal groups and bind data
      const basalSegments = d3.select(this)
        .selectAll<SVGGElement, Basal>('.d3-basal-group')
        .data(currentData, (d: Basal) => d.id)

      // Handle exit selection first
      basalSegments.exit().remove()

      // Create new basal groups for entering data
      const basalSegmentGroups = basalSegments.enter()
        .append('g')
        .classed('d3-basal-group', true)
        .attr('id', (d: Basal) => `basal_group_${d.id}`)
        .attr('data-testid', (d: Basal) => `basal_group_${d.id}`)

      // Add rectangles to non-zero rate basal segments
      const nonZero = basalSegmentGroups.filter((d: Basal) => d.rate > 0)
      basal.addRectToPool(nonZero)

      // Add invisible hover target rectangles for all basal segments
      basal.addRectToPool(basalSegmentGroups, true)

      // Split data into groups by delivery type for path generation
      const basalPathGroups = getBasalPathGroups(currentData)

      // Create or select the path group container
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

        // Update path data
        basal.updatePath(path, pathData)
      })

      // Handle undelivered path separately
      const undeliveredPathClass = 'd3-basal d3-path-basal d3-path-basal-undelivered'
      const undeliveredPath = basalPathsGroup
        .selectAll<SVGPathElement, string>(`.${undeliveredPathClass.replace(/ /g, '.')}`)
        .data([undeliveredPathClass])
        .join('path')
        .attr('class', (d: string) => d)

      // Update undelivered path data
      basal.updatePath(undeliveredPath, getUndelivereds(currentData), true)

      // Set up event handlers
      selection.selectAll<SVGGElement, Basal>(`.d3-basal-group`)
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Basal) {
          // Set hover state
          d3.select(this).selectAll('.d3-basal.d3-rect-basal')
            .attr('opacity', options.opacity + options.opacityDelta)

          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement, _event: MouseEvent, d: Basal) {
          // Remove hover state
          if (d.deliveryType === BasalDeliveryType.Temporary && d.rate > 0) {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', options.opacity - options.opacityDelta)
          } else {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', options.opacity)
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
    selection: d3.Selection<d3.BaseType, Basal, SVGGElement, any>,
    invisible: boolean = false
  ): void => {
    options.xScale = pool.xScale().copy()

    const heightFn = invisible ? basal.invisibleRectHeight : basal.height
    const yPosFn = invisible ? basal.invisibleRectYPosition : basal.yPosition

    selection.append('rect')
      .attr('id', (d: Basal) => `basal_element_${invisible ? 'invisible' : 'visible'}_${d.id}`)
      .attr('x', basal.xPosition)
      .attr('y', yPosFn)
      .attr('opacity', (d: Basal) => {
        if (invisible) {
          return null
        }
        if (d.deliveryType === BasalDeliveryType.Temporary && d.rate > 0) {
          return options.opacity - options.opacityDelta
        }
        return options.opacity
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
   * @param isUndelivered - Whether this is undelivered data
   */
  basal.updatePath = (
    selection: d3.Selection<SVGPathElement, string, SVGGElement, any>,
    data: Basal[],
    isUndelivered: boolean = false
  ): void => {
    options.xScale = pool.xScale().copy()

    const pathDef = basal.pathData(data, isUndelivered)

    if (pathDef !== '') {
      selection.attr('d', pathDef)
    }
  }

  /**
   * Generate SVG path data string
   * @param data - The data to visualize
   * @param isUndelivered - Whether this is undelivered data
   * @returns The SVG path data string
   */
  basal.pathData = (data: Basal[], isUndelivered: boolean = false): string => {
    options.xScale = pool.xScale().copy()

    function stringCoords(datum: Basal): string {
      return basal.xPosition(datum) + ',' + basal.pathYPosition(datum) + ' '
    }

    let d = ''
    for (let i = 0; i < data.length; ++i) {
      if (i === 0) {
        // start with a moveto command
        d += 'M' + stringCoords(data[i])
      } else if (isUndelivered && data[i].deliveryType === BasalDeliveryType.Automated) {
        // For automated suppressed delivery, we always render at the baseline
        const suppressed = _.clone(data[i])
        suppressed.rate = 0
        d += 'M' + stringCoords(suppressed)
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
    return yScale(d.rate) - options.pathStroke / 2
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

