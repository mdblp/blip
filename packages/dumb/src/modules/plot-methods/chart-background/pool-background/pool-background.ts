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

import { type Fill } from 'medical-domain'
import { DailyPlotElement } from '../../../../models/enums/daily-plot-element.enum'
import { type PlotFunction } from '../../../../models/plot-methods/plot-function.model'
import { type PlotOptions } from '../../../../models/plot-methods/plot-options.model'
import { type PlotSelection } from '../../../../models/plot-methods/plot-selection.model'
import { type Pool } from '../../../../models/plot-methods/pool.model'
import { drawVerticalRectangle } from '../../../../utils/daily-chart/daily-chart.util'
import { createIdGenerator } from '../../../../utils/id-generator/id-generator.util'

const HOUR_LINE_WIDTH = 0.5
const MIDNIGHT_LINE_WIDTH = 1

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.PoolBackground)

type PoolBackgroundOptions = Pick<PlotOptions<Fill>, 'xScale' | 'tidelineData'> & {
  onBackgroundClick?: (date: Date) => void
}

const defaults: Partial<PoolBackgroundOptions> = {
  xScale: null
}

/**
 * Plot the background of a daily chart pool
 *
 * The background is made of one rectangle per time slot (see `MedicalDataService.fills`),
 * a thin vertical line at the start of each slot and a thicker one at midnight.
 * When `onBackgroundClick` is provided, the background becomes clickable and the callback
 * receives the date matching the clicked position.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders the pool background when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotPoolBackground(pool, {
 *   tidelineData,
 *   onBackgroundClick: (date) => createNote(date)
 * })
 * selection.call(plot)
 * ```
 */
export const plotPoolBackground = (
  pool: Pool<Fill>,
  opts: Partial<PoolBackgroundOptions> = {}
): PlotFunction<Fill> => {
  const options = { ...defaults, ...opts } as PoolBackgroundOptions
  // Every pool renders the same fills, so the pool id keeps element ids unique in the page
  const ids = idGen.scoped(pool.id())

  return (selection: PlotSelection<Fill>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()
    const { onBackgroundClick } = options

    // Helper functions using closure variables
    const getXPos = (d: Fill): number => xScale(d.epoch)
    const getWidth = (d: Fill): number => xScale(d.epochEnd) - xScale(d.epoch)
    const getLineXPos = (lineWidth: number) => (d: Fill): number => getXPos(d) - lineWidth / 2
    const getHourLineXPos = getLineXPos(HOUR_LINE_WIDTH)
    const getMidnightLineXPos = getLineXPos(MIDNIGHT_LINE_WIDTH)

    /**
     * Create new background visual elements
     */
    const createBackgroundElements = (
      enter: d3.Selection<d3.EnterElement, Fill, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Fill, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', ids.groupId)
        .attr('data-testid', ids.groupId)

      drawVerticalRectangle(group, getXPos, 0, height, getWidth, 'd3-rect-fill d3-fill-background', (d: Fill) => ids.elementId(d, 'background'))

      drawVerticalRectangle(group, getHourLineXPos, 0, height, HOUR_LINE_WIDTH, 'd3-rect-fill d3-fill-vertical-line d3-fill-hour', (d: Fill) => ids.elementId(d, 'hour'))

      return group
    }

    /**
     * Update existing background visual elements
     */
    const updateBackgroundElements = (
      update: d3.Selection<SVGGElement, Fill, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Fill, SVGGElement, unknown> => {
      update.select('rect.d3-fill-background')
        .attr('x', getXPos)
        .attr('width', getWidth)
        .attr('height', height)

      update.select('rect.d3-fill-hour')
        .attr('x', getHourLineXPos)
        .attr('height', height)

      return update
    }

    /**
     * Draw the midnight line of the slots starting at midnight, and remove it from the others
     */
    const drawMidnightLines = (
      groups: d3.Selection<SVGGElement, Fill, SVGGElement, unknown>
    ): void => {
      groups
        .selectAll<SVGRectElement, Fill>('rect.d3-fill-midnight')
        .data((d: Fill) => d.startsAtMidnight ? [d] : [])
        .join('rect')
        .attr('class', 'd3-rect-fill d3-fill-vertical-line d3-fill-midnight')
        .attr('id', (d: Fill) => ids.elementId(d, 'midnight'))
        .attr('x', getMidnightLineXPos)
        .attr('y', 0)
        .attr('width', MIDNIGHT_LINE_WIDTH)
        .attr('height', height)
    }

    selection.each(function (this: SVGGElement) {
      const container = d3.select(this)

      // Step 1: Get filtered data from pool. Unlike the data bound by the pool, it includes
      // the slot overlapping the start of the rendered range
      const fills = pool.filterDataForRender(options.tidelineData.fills)

      // Step 2: Early exit if no data
      if (fills.length < 1) {
        container.selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join, the DOM follows the chronological order of the data so each slot
      // is drawn above the previous one
      const backgroundGroup = container
        .selectAll<SVGGElement, Fill>(`g.${idGen.groupSelector()}`)
        .data(fills, (d: Fill) => d.id)
        .join(createBackgroundElements, updateBackgroundElements)

      // Step 4: Midnight lines follow the current data of each slot
      drawMidnightLines(backgroundGroup)

      // Step 5: One click handler for the whole background
      if (onBackgroundClick) {
        container
          .style('cursor', 'cell')
          .on('click', function (this: SVGGElement, event: MouseEvent) {
            const [x] = d3.pointer(event, this)
            onBackgroundClick(xScale.invert(x))
          })
      }
    })
  }
}
