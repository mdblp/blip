/*
 * Copyright (c) 2026, Diabeloop
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

import * as d3 from 'd3'
import moment from 'moment-timezone'

import { type Fill } from 'medical-domain'
import { DailyPlotElement } from '../../../../models/enums/daily-plot-element.enum'
import { type PlotFunction } from '../../../../models/plot-function.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'
import { type Pool } from '../../../../models/pool.model'
import { getDayFormat, getHourMinuteFormat } from '../../../../utils/datetime/datetime.util'
import { createIdGenerator } from '../../../../utils/id-generator/id-generator.util'

const TICK_LENGTH = 15
const MIDNIGHT_TICK_LENGTH = TICK_LENGTH * 2.5
const TEXT_SHIFT = { x: 5, y: 5 }

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.DailyXAxis)

/**
 * Plot the x axis of the daily chart
 *
 * Each time slot bound by the pool (see `MedicalDataService.fills`) gets a tick and its hour.
 * A slot starting at midnight gets a longer tick and the day label.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @returns A function that renders the axis when called with a D3 selection
 *
 * @example
 * ```typescript
 * pool.addPlotType({ type: 'fill' }, plotDailyXAxis(pool))
 * ```
 */
export const plotDailyXAxis = (pool: Pool<Fill>): PlotFunction<Fill> => {
  const ids = idGen.scoped(pool.id())

  return (selection: PlotSelection<Fill>): void => {
    const xScale = pool.xScale().copy()
    const height = pool.height()
    const hourFormat = getHourMinuteFormat()
    const dayFormat = getDayFormat()

    // Helper functions using closure variables
    const getXPos = (d: Fill): number => xScale(d.epoch)
    const getTextXPos = (d: Fill): number => getXPos(d) + TEXT_SHIFT.x
    const getTickTop = (d: Fill): number => height - (d.startsAtMidnight ? MIDNIGHT_TICK_LENGTH : TICK_LENGTH)
    const formatSlotStart = (d: Fill, format: string): string => moment.tz(d.epoch, d.timezone).format(format)

    /**
     * Create new tick visual elements
     */
    const createTickElements = (
      enter: d3.Selection<d3.EnterElement, Fill, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Fill, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .attr('class', `${idGen.groupSelector()} d3-axis`)
        .attr('id', ids.groupId)
        .attr('data-testid', ids.groupId)

      group.append('line')
        .attr('id', (d: Fill) => ids.elementId(d, 'tick'))

      group.append('text')
        .classed('d3-hour-label', true)
        .attr('id', (d: Fill) => ids.elementId(d, 'hour'))

      return group
    }

    /**
     * Draw the day label of the slots starting at midnight, and remove it from the others
     */
    const drawDayLabels = (
      groups: d3.Selection<SVGGElement, Fill, SVGGElement, unknown>
    ): void => {
      groups
        .selectAll<SVGTextElement, Fill>('text.d3-day-label')
        .data((d: Fill) => d.startsAtMidnight ? [d] : [])
        .join('text')
        .classed('d3-day-label', true)
        .attr('id', (d: Fill) => ids.elementId(d, 'day'))
        .attr('x', getTextXPos)
        .attr('y', getTickTop)
        .text((d: Fill) => formatSlotStart(d, dayFormat))
    }

    selection.each(function (this: SVGGElement) {
      const container = d3.select(this)
      const fills = container.datum() as Fill[]

      // Data join, the DOM follows the chronological order of the data
      const tickGroups = container
        .selectAll<SVGGElement, Fill>(`g.${idGen.groupSelector()}`)
        .data(fills, (d: Fill) => d.id)
        .join(createTickElements)

      tickGroups.select('line')
        .attr('x1', getXPos)
        .attr('x2', getXPos)
        .attr('y1', height)
        .attr('y2', getTickTop)

      tickGroups.select('text.d3-hour-label')
        .attr('x', getTextXPos)
        .attr('y', height - TEXT_SHIFT.y)
        .text((d: Fill) => formatSlotStart(d, hourFormat))

      drawDayLabels(tickGroups)
    })
  }
}
