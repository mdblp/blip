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
import { Pool } from '../../../models/pool.model'
import { drawCircle, drawText, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { COMMON_PADDING, COMMON_RADIUS } from '../common-display-values'

type RescueCarbOptions = PlotOptions<Meal>

const defaults: Partial<RescueCarbOptions> = {
  xScale: null
}

// Helper functions to reduce nesting
const getCarbAmount = (data: Meal): string => (data.nutrition?.carbohydrate?.net ?? 0).toString()
const getCarbGroupId = (data: Meal): string => `carb_group_${data.id}`
const getCarbCircleId = (data: Meal): string => `carbs_circle_${data.id}`
const getCarbTextId = (data: Meal): string => `carbs_text_${data.id}`

/**
 * Plot rescue carbohydrate data in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The rescue carb plotting function
 */
export const plotRescueCarbs = (
  pool: Pool<Meal>,
  opts: Partial<RescueCarbOptions> = {}
): PlotFunction<Meal> => {
  const options = _.defaults(opts, defaults) as RescueCarbOptions

  return (selection: PlotSelection<Meal>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yPos = COMMON_RADIUS + COMMON_PADDING

    // Helper functions that use xScale from closure
    const getXPos = (d: Meal): number => xScale(d.epoch)

    // Enter callback: create new elements
    const createRescueCarbElements = (
      enter: d3.Selection<d3.EnterElement, Meal, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Meal, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed('d3-carb-group', true)
        .attr('id', getCarbGroupId)
        .attr('data-testid', getCarbGroupId)

      drawCircle<Meal>(group, getXPos, yPos, 'd3-circle-rescuecarbs', getCarbCircleId)

      drawText<Meal>(group, getCarbAmount, getXPos, yPos, 'd3-carbs-text', getCarbTextId)

      return group
    }

    // Update callback: update existing elements
    const updateRescueCarbElements = (
      update: d3.Selection<SVGGElement, Meal, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Meal, SVGGElement, unknown> => {
      update.select('circle')
        .attr('cx', getXPos)
        .attr('cy', yPos)
        .attr('r', COMMON_RADIUS)

      update.select('text')
        .text(getCarbAmount)
        .attr('x', getXPos)
        .attr('y', yPos)

      return update
    }

    selection.each(function (this: SVGGElement) {
      const rescueCarbs = pool.filterDataForRender(options.tidelineData.medicalData.meals)
      const filteredData: Meal[] = _.filter(rescueCarbs, (data: Meal) => {
        return _.get(data, 'nutrition.carbohydrate.net', false)
      }) as Meal[]

      if (filteredData.length < 1) {
        d3.select(this).selectAll('g.d3-carb-group').remove()
        return
      }

      const allCarbs = d3.select(this)
        .selectAll<SVGGElement, Meal>('g.d3-carb-group')
        .data(filteredData, (d: Meal) => d.id)

      // Using join pattern for enter/update/exit
      const carbGroup = allCarbs.join(
        enter => createRescueCarbElements(enter),
        update => updateRescueCarbElements(update),
        exit => exit.remove()
      )

      // Set up event handlers
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


