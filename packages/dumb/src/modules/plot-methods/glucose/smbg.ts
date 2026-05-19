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

import { BgClass, BgClasses, BgUnit, ClassificationType, MGDL_UNITS, type Smbg } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { convertBgClassesToBgBounds, getBgClass } from '../../../utils/blood-glucose/blood-glucose.util'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Smbg)

// SMBG circle size (diameter is 16, radius is 7 accounting for 1px stroke)
const SMBG_SIZE = 16
const SMBG_RADIUS = SMBG_SIZE / 2 - 1

type SmbgOptions = PlotOptions<Smbg> & {
  bgUnits: BgUnit
  bgClasses: BgClasses
}


const defaults: Partial<SmbgOptions> = {
  bgUnits: MGDL_UNITS,
  xScale: null
}

/**
 * Get CSS class name based on BG category
 */
const getBgCategoryClass = (bgClass: BgClass): string => {
  switch (bgClass) {
    case BgClass.VeryLow:
      return 'd3-bg-very-low'
    case BgClass.Low:
      return 'd3-bg-low'
    case BgClass.Target:
      return 'd3-bg-target'
    case BgClass.High:
      return 'd3-bg-high'
    case BgClass.VeryHigh:
      return 'd3-bg-very-high'
    default:
      return ''
  }
}

/**
 * Plot self-monitored blood glucose (SMBG) data points in the diabetes management timeline
 *
 * SMBG data represents fingerstick blood glucose readings manually taken by patients.
 * The visualization categorizes values into different ranges (very low, low, target,
 * high, very high) using color-coded circles with a stroke.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, BG units, and event handlers
 * @returns A function that renders SMBG points when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotSmbg(pool, {
 *   tidelineData,
 *   bgUnits: MGDL_UNITS,
 *   bgClasses: { low: 70, target: 180, high: 250 },
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotSmbg = (
  pool: Pool<Smbg>,
  opts: Partial<SmbgOptions> = {}
): PlotFunction<Smbg> => {
  const options = _.defaults(opts, defaults) as SmbgOptions
  const bgUnits = options.bgUnits
  const bgClasses = options.bgClasses

  const bgBounds = convertBgClassesToBgBounds(bgClasses, bgUnits)

  // Helper function: Categorize glucose value into BG class
  const categorize = (d: Smbg): BgClass => {
    return getBgClass(bgBounds, d.value, ClassificationType.FiveWay)
  }

  return (selection: PlotSelection<Smbg>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yScale = pool.yScale()

    // Helper functions using closure variables
    const xPosition = (d: Smbg): number => xScale(d.epoch)
    const yPosition = (d: Smbg): number => yScale(d.value)

    /**
     * Create new SMBG circle elements
     */
    const createSmbgElements = (
      enter: d3.Selection<d3.EnterElement, Smbg, SVGGElement, unknown>
    ): d3.Selection<SVGCircleElement, Smbg, SVGGElement, unknown> => {
      const circles = enter
        .append('circle')
        .classed('d3-smbg', true)
        .attr('id', (d: Smbg) => idGen.elementId(d, 'circle'))
        .attr('data-testid', (d: Smbg) => idGen.testId(d))
        .attr('cx', xPosition)
        .attr('cy', yPosition)
        .attr('r', SMBG_RADIUS)

      // Apply category-specific classes on creation
      circles.each(function (this: SVGCircleElement, d: Smbg) {
        const bgClass = categorize(d)
        const categoryClass = getBgCategoryClass(bgClass)
        d3.select(this).attr('class', `d3-circle-smbg ${categoryClass}`)
      })

      return circles
    }

    /**
     * Update existing SMBG circle elements
     */
    const updateSmbgElements = (
      update: d3.Selection<SVGCircleElement, Smbg, SVGGElement, unknown>
    ): d3.Selection<SVGCircleElement, Smbg, SVGGElement, unknown> => {
      update
        .attr('cx', xPosition)
        .attr('cy', yPosition)
        .attr('r', SMBG_RADIUS)

      // Update category-specific classes
      update.each(function (this: SVGCircleElement, d: Smbg) {
        const bgClass = categorize(d)
        const categoryClass = getBgCategoryClass(bgClass)
        d3.select(this).attr('class', `d3-smbg ${categoryClass}`)
      })

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get the data bound to this element
      const currentData = d3.select(this).datum() as Smbg[]

      // Step 2: Early exit if no data
      if (currentData.length < 1) {
        d3.select(this).selectAll('circle.d3-smbg').remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allSmbg = d3.select(this)
        .selectAll<SVGCircleElement, Smbg>('circle.d3-smbg')
        .data(currentData, (d: Smbg) => d.id)

      const smbgCircles = allSmbg.join(
        createSmbgElements,
        updateSmbgElements,
        exit => exit.remove()
      )

      // Step 4: Set up highlight behavior
      const highlight = pool.highlight<SVGCircleElement>(smbgCircles)

      // Step 5: Set up event handlers
      smbgCircles
        .on('mouseover', function (this: SVGCircleElement, _event: MouseEvent, d: Smbg) {
          highlight.on(d3.select(this))
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this as unknown as SVGGElement),
              class: categorize(d)
            })
          }
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

