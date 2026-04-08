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

type RescueCarbOptions = PlotOptions<Meal>

const defaults: Partial<RescueCarbOptions> = {
  xScale: null
}

const DEFAULT_RADIUS = 14
const DEFAULT_PADDING = 4

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

  const xPos = (d: Meal): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  return (selection: PlotSelection<Meal>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const yPos = DEFAULT_RADIUS + DEFAULT_PADDING

    selection.each(function (this: SVGGElement) {
      const rescueCarbs = pool.filterDataForRender(options.tidelineData.medicalData.meals)
      const filteredData: Meal[] = _.filter(rescueCarbs, (data: Meal) => {
        return _.get(data, 'nutrition.carbohydrate.net', false)
      }) as Meal[]

      if (filteredData.length < 1) {
        d3.select(this).selectAll('g.d3-carb-group').remove()
        return
      }

      const allCarbs = d3
        .select(this)
        .selectAll<SVGGElement, Meal>('g.d3-carb-group')
        .data(filteredData, (d: Meal) => d.id)

      // Using join pattern for enter/update/exit
      const carbGroup = allCarbs.join(
        enter => {
          const group = enter
            .append('g')
            .classed('d3-carb-group', true)
            .attr('id', getCarbGroupId)
            .attr('data-testid', getCarbGroupId)

          drawCircle(group, xPos, yPos, 'd3-circle-rescuecarbs', getCarbCircleId)

          drawText(group, getCarbAmount, xPos, yPos, 'd3-carbs-text', getCarbTextId)

          return group
        },
        update => {
          // Update existing elements
          update
            .select('circle')
            .attr('cx', xPos)
            .attr('cy', yPos)
            .attr('r', DEFAULT_RADIUS)

          update
            .select('text')
            .text(getCarbAmount)
            .attr('x', xPos)
            .attr('y', yPos)

          return update
        },
        exit => exit.remove()
      )

      // Set up tooltip event handlers
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


