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

import { BgClass, BgClasses, BgUnit, type Cbg, ClassificationType, MGDL_UNITS } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { convertBgClassesToBgBounds, getBgClass } from '../../../utils/blood-glucose/blood-glucose.util'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { CSS_CLASSES, PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Cbg)

type CbgOptions = PlotOptions<Cbg> & {
  bgUnits: BgUnit
  bgClasses: BgClasses
}


const defaults: Partial<CbgOptions> = {
  bgUnits: MGDL_UNITS,
  xScale: null
}

/**
 * Plot continuous blood glucose (CBG) data points in the diabetes management timeline
 *
 * CBG data represents continuous glucose monitoring readings, typically collected
 * every 5 minutes. The visualization categorizes values into different ranges
 * (very low, low, target, high, very high) using color-coded circles.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, BG units, and event handlers
 * @returns A function that renders CBG points when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotCbg(pool, {
 *   tidelineData,
 *   bgUnits: MGDL_UNITS,
 *   bgClasses: { low: 70, target: 180, high: 250 },
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotCbg = (
  pool: Pool<Cbg>,
  opts: Partial<CbgOptions> = {}
): PlotFunction<Cbg> => {
  const options = _.defaults(opts, defaults) as CbgOptions
  const bgUnits = options.bgUnits
  const bgClasses = options.bgClasses

  const bgBounds = convertBgClassesToBgBounds(bgClasses, bgUnits)

  // Helper function: Categorize glucose value into BG class
  const categorize = (d: Cbg): BgClass => {
    return getBgClass(bgBounds, d.value, ClassificationType.FiveWay)
  }

  return (selection: PlotSelection<Cbg>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yScale = pool.yScale()

    // Helper functions using closure variables
    const xPosition = (d: Cbg): number => xScale(d.epoch)
    const yPosition = (d: Cbg): number => yScale(d.value)

    const addTooltip = (d: Cbg, rect: DOMRect): void => {
      if (options.onElementHover) {
        options.onElementHover({
          data: d,
          rect: rect,
          class: categorize(d)
        })
      }
    }

    /**
     * Create new CBG circle elements
     */
    const createCbgElements = (
      enter: d3.Selection<d3.EnterElement, Cbg, SVGGElement, unknown>
    ): d3.Selection<SVGCircleElement, Cbg, SVGGElement, unknown> => {
      return enter
        .append('circle')
        .classed(CSS_CLASSES.CBG, true)
        .attr('id', (d: Cbg) => idGen.elementId(d, 'circle'))
        .attr('data-testid', (d: Cbg) => idGen.testId(d))
        .attr('cx', xPosition)
        .attr('cy', yPosition)
        .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS)
    }

    /**
     * Update existing CBG circle elements
     */
    const updateCbgElements = (
      update: d3.Selection<SVGCircleElement, Cbg, SVGGElement, unknown>
    ): d3.Selection<SVGCircleElement, Cbg, SVGGElement, unknown> => {
      return update
        .attr('cx', xPosition)
        .attr('cy', yPosition)
        .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS)
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const medicalData = options.tidelineData.medicalData
      const cbgValues = pool.filterDataForRender(medicalData.cbg)

      // Step 2: Early exit if no data
      if (cbgValues.length < 1) {
        d3.select(this).selectAll(`circle.${CSS_CLASSES.CBG}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allCBG = d3.select(this)
        .selectAll<SVGCircleElement, Cbg>(`circle.${CSS_CLASSES.CBG}`)
        .data(cbgValues, (d: Cbg) => d.id)

      const cbgGroups = allCBG.join(
        createCbgElements,
        updateCbgElements,
        exit => exit.remove()
      )

      // Step 4: Apply category-specific CSS classes
      const cbgVeryLow = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.VeryLow)
      const cbgLow = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.Low)
      const cbgTarget = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.Target)
      const cbgHigh = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.High)
      const cbgVeryHigh = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.VeryHigh)

      cbgVeryLow.classed(`${CSS_CLASSES.CBG_CIRCLE} ${CSS_CLASSES.BG_VERY_LOW}`, true)
      cbgLow.classed(`${CSS_CLASSES.CBG_CIRCLE} ${CSS_CLASSES.BG_LOW}`, true)
      cbgTarget.classed(`${CSS_CLASSES.CBG_CIRCLE} ${CSS_CLASSES.BG_TARGET}`, true)
      cbgHigh.classed(`${CSS_CLASSES.CBG_CIRCLE} ${CSS_CLASSES.BG_HIGH}`, true)
      cbgVeryHigh.classed(`${CSS_CLASSES.CBG_CIRCLE} ${CSS_CLASSES.BG_VERY_HIGH}`, true)

      // Step 5: Set up highlight behavior
      const highlight = pool.highlight(allCBG)

      // Step 6: Set up event handlers
      d3.select(this)
        .selectAll<SVGCircleElement, Cbg>(`.${CSS_CLASSES.CBG_CIRCLE}`)
        .on('mouseover', function (this: SVGCircleElement, _event: MouseEvent, d: Cbg) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          d3Select.attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS + PLOT_DIMENSIONS.HOVER_RADIUS_INCREASE)

          const bgCategory = categorize(d)
          switch (bgCategory) {
            case BgClass.Low:
            case BgClass.VeryLow:
              d3Select.classed(CSS_CLASSES.BG_LOW_FOCUS, true)
              break
            case BgClass.Target:
              d3Select.classed(CSS_CLASSES.BG_TARGET_FOCUS, true)
              break
            case BgClass.High:
            case BgClass.VeryHigh:
              d3Select.classed(CSS_CLASSES.BG_HIGH_FOCUS, true)
              break
            default:
              break
          }

          addTooltip(d, getTooltipContainer(this as unknown as SVGGElement))
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          d3.select(this)
            .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS)
            .classed(CSS_CLASSES.BG_LOW_FOCUS, false)
            .classed(CSS_CLASSES.BG_TARGET_FOCUS, false)
            .classed(CSS_CLASSES.BG_HIGH_FOCUS, false)

          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

