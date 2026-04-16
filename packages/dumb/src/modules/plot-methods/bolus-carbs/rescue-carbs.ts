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

import { type Meal } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawCircle, drawText, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.RescueCarbs)

type RescueCarbOptions = PlotOptions<Meal>

const defaults: Partial<RescueCarbOptions> = {
  xScale: null
}

// Helper function for extracting carb amount from meal data
const getCarbAmount = (data: Meal): string => (data.nutrition?.carbohydrate?.net ?? 0).toString()

/**
 * Plot rescue carbohydrate data in the diabetes management timeline
 *
 * Rescue carbs are carbohydrates consumed to treat or prevent hypoglycemia (low blood sugar).
 * These are displayed as circles with the carbohydrate amount shown as text overlay.
 *
 * Visual Features:
 * - Circle background for visibility
 * - Text showing carbohydrate amount in grams
 * - Positioned on timeline based on consumption timestamp
 * - Only meals with carbohydrate data are displayed
 *
 * Medical Context:
 * - Rescue carbs are critical for diabetes management
 * - They help patients recover from low blood sugar events
 * - Tracking them helps identify patterns and adjust therapy
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders rescue carbohydrate data when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotRescueCarbs(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotRescueCarbs = (
  pool: Pool<Meal>,
  opts: Partial<RescueCarbOptions> = {}
): PlotFunction<Meal> => {
  const options = _.defaults(opts, defaults) as RescueCarbOptions

  return (selection: PlotSelection<Meal>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yPos = PLOT_DIMENSIONS.COMMON_RADIUS + PLOT_DIMENSIONS.COMMON_PADDING

    // Helper functions using closure variables
    const getXPos = (d: Meal): number => xScale(d.epoch)

    // Enter callback: create new elements
    const createRescueCarbElements = (
      enter: d3.Selection<d3.EnterElement, Meal, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Meal, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed('d3-carb-group', true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: Meal) => idGen.testId(d))

      // Draw background circle for visibility
      drawCircle<Meal>(
        group,
        getXPos,
        yPos,
        'd3-circle-rescuecarbs',
        (d: Meal) => idGen.elementId(d, 'circle')
      )

      // Draw carbohydrate amount text
      drawText<Meal>(
        group,
        getCarbAmount,
        getXPos,
        yPos,
        'd3-carbs-text',
        (d: Meal) => idGen.elementId(d, 'text')
      )

      return group
    }

    // Update callback: update existing elements
    const updateRescueCarbElements = (
      update: d3.Selection<SVGGElement, Meal, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Meal, SVGGElement, unknown> => {
      // Update circle position and size
      update.select('circle')
        .attr('cx', getXPos)
        .attr('cy', yPos)
        .attr('r', PLOT_DIMENSIONS.COMMON_RADIUS)

      // Update text content and position
      update.select('text')
        .text(getCarbAmount)
        .attr('x', getXPos)
        .attr('y', yPos)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const rescueCarbs = pool.filterDataForRender(options.tidelineData.medicalData.meals)

      // Step 2: Apply domain-specific filtering - only meals with carbohydrate data
      const filteredData: Meal[] = _.filter(rescueCarbs, (data: Meal) => {
        return _.get(data, 'nutrition.carbohydrate.net', false)
      }) as Meal[]

      // Step 3: Early exit if no data
      if (filteredData.length < 1) {
        d3.select(this).selectAll('g.d3-carb-group').remove()
        return
      }

      // Step 4: Data join with enter/update/exit pattern
      const allCarbs = d3.select(this)
        .selectAll<SVGGElement, Meal>('g.d3-carb-group')
        .data(filteredData, (d: Meal) => d.id)

      const carbGroup = allCarbs.join(
        enter => createRescueCarbElements(enter),
        update => updateRescueCarbElements(update),
        exit => exit.remove()
      )

      // Step 5: Set up event handlers
      carbGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Meal) {
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement) {
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}


