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

import { DblParameter, type Iob, type MedicalData } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'


// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Iob)

// Default maximum IOB value when TDD is not available
const DEFAULT_MAX_IOB_VALUE_U = 45

/**
 * Calculate the maximum IOB value based on Total Daily Insulin (TDD)
 *
 * The maximum IOB display value is set to half of the total daily insulin dose,
 * which is a common clinical guideline for safe insulin therapy.
 *
 * @param medicalData - The medical data containing pump settings
 * @returns Maximum IOB value in units (half of TDD or default)
 */
export const getMaxIobValue = (medicalData: MedicalData): number => {
  if (!medicalData.pumpSettings || medicalData.pumpSettings.length === 0) {
    return DEFAULT_MAX_IOB_VALUE_U
  }

  const totalDailyInsulinParameter = medicalData.pumpSettings[0]?.payload?.parameters?.find((parameter) => parameter.name === DblParameter.TotalDailyInsulin)
  const totalDailyInsulinValue = totalDailyInsulinParameter && Number.parseFloat(totalDailyInsulinParameter.value)

  // The max IOB value is set to half of the total daily insulin, or a default max if that value is not available
  return totalDailyInsulinValue && Number.isFinite(totalDailyInsulinValue) ? totalDailyInsulinValue / 2 : DEFAULT_MAX_IOB_VALUE_U
}

type IobOptions = PlotOptions<Iob>

type IobPlotFunction = PlotFunction<Iob> & {
  xPosition: (d: Iob) => number
  yPosition: (d: Iob) => number
}

const defaults: Partial<IobOptions> = {
  xScale: null
}

/**
 * Plot Insulin On Board (IOB) data in the diabetes management timeline
 *
 * Insulin On Board (IOB) represents the amount of active insulin currently in the body
 * from previous bolus doses. This helps prevent insulin stacking and guides dosing decisions.
 *
 * Visual Features:
 * - Circles positioned on timeline based on timestamp
 * - Circle height (y-position) represents IOB amount
 * - Hover interaction increases radius and shows tooltip
 * - Values filtered to maximum safe IOB (50% of Total Daily Insulin)
 *
 * Medical Context:
 * - IOB accumulates from recent bolus doses
 * - Decays over time based on insulin action curve (typically 3-6 hours)
 * - Critical for preventing insulin stacking (too much active insulin)
 * - Maximum safe IOB is typically set to half of Total Daily Insulin dose
 * - Used by bolus calculators to recommend appropriate insulin doses
 *
 * Calculation:
 * - IOB is calculated based on insulin action time and decay curves
 * - Maximum display value = TDD / 2 (or 45 units if TDD unavailable)
 * - Values exceeding maximum are filtered out for safety
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders IOB data when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotIob(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data),
 *   onElementOut: () => hideTooltip()
 * })
 * selection.call(plot)
 * ```
 */
export const plotIob = (pool: Pool<Iob>, opts: Partial<IobOptions> = {}): IobPlotFunction => {
  const options = _.defaults(opts, defaults) as IobOptions

  const iob = (selection: PlotSelection<Iob>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const medicalData = options.tidelineData.medicalData
      const iobValues = pool.filterDataForRender(medicalData.iob)

      // Step 2: Apply domain-specific filtering - only IOB values below maximum safe level
      const maxIobValue = getMaxIobValue(medicalData)
      const filteredIobValues = iobValues.filter(d => d.value <= maxIobValue)

      // Step 3: Data join with enter/update/exit pattern
      const allIobPoints = d3.select(this)
        .selectAll<SVGCircleElement, Iob>('circle.d3-iob')
        .data(filteredIobValues, (d: Iob) => d.id)

      allIobPoints.join(
        enter => enter.append('circle')
          .attr('id', idGen.groupId)
          .attr('data-testid', idGen.groupId)
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS)
          .classed('d3-iob', true),
        update => update
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS),
        exit => exit.remove()
      )

      // Step 4: Set up highlight behavior
      const highlight = pool.highlight(allIobPoints)

      // Step 5: Set up event handlers
      selection.selectAll<SVGCircleElement, Iob>('.d3-iob')
        .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, d: Iob) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          // Increase radius on hover for visual feedback
          d3Select.attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS + PLOT_DIMENSIONS.HOVER_RADIUS_INCREASE)

          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          // Restore default radius
          d3.select(this)
            .attr('r', PLOT_DIMENSIONS.CBG_IOB_RADIUS)

          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }

  iob.xPosition = (datum: Iob): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(datum.epoch)
  }

  iob.yPosition = (datum: Iob): number => {
    const yScale = pool.yScale()
    return yScale(datum.value)
  }

  return iob
}
