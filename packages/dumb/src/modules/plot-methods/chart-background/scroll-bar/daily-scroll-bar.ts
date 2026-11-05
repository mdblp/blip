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

import { DailyPlotElement } from '../../../../models/enums/daily-plot-element.enum'

const GUTTER_HEIGHT = 20
const THUMB_RADIUS = 24

const GUTTER_ID = `${DailyPlotElement.ScrollBar}_gutter`
const THUMB_ID = `${DailyPlotElement.ScrollBar}_thumb`

export interface DailyScrollBarOptions {
  /** Oldest date the view can reach: the thumb is at the left end of the bar */
  start: Date
  /** Most recent date the view can reach: the thumb is at the right end of the bar */
  end: Date
  width: number
  axisGutter: number
  /** The thumb can't be dragged while this returns false */
  canDrag: () => boolean
  onDragStart: () => void
  /** Called with the date matching the thumb position */
  onDrag: (date: Date) => void
  onDragEnd: () => void
}

/** The datum is the left edge of the view */
export type DailyScrollBarSelection = d3.Selection<SVGGElement, Date, d3.BaseType, unknown>

/**
 * Plot the scroll bar below the daily chart
 *
 * A gutter line and a draggable thumb positioned at the date bound to the selection.
 * The caller re-renders the bar with the new date whenever the view moves, including while
 * the thumb is dragged.
 *
 * @param options - The dates the bar spans, its dimensions and the drag callbacks
 * @returns A function that renders the bar when called with a D3 selection
 *
 * @example
 * ```typescript
 * const renderScrollBar = plotDailyScrollBar({ start, end, width, axisGutter, canDrag, onDragStart, onDrag, onDragEnd })
 * scrollBarGroup.datum(viewStart).call(renderScrollBar)
 * ```
 */
export const plotDailyScrollBar = (options: DailyScrollBarOptions): ((selection: DailyScrollBarSelection) => void) => {
  const { start, end, width, axisGutter, canDrag, onDragStart, onDrag, onDragEnd } = options

  const scale = d3.scaleUtc()
    .domain([start, end])
    .range([axisGutter + THUMB_RADIUS, width - THUMB_RADIUS])
    .clamp(true)
  const [minX, maxX] = scale.range()

  const drag = d3.drag<SVGRectElement, Date>()
    .subject((_event, date: Date) => ({ x: scale(date), y: 0 }))
    .on('start', (event: d3.D3DragEvent<SVGRectElement, Date, unknown>) => {
      // Keep the pan behaviour of the chart from handling the same gesture
      (event.sourceEvent as Event).stopPropagation()
      onDragStart()
    })
    .on('drag', (event: d3.D3DragEvent<SVGRectElement, Date, unknown>) => {
      if (!canDrag()) {
        return
      }
      const x = Math.min(Math.max(event.x, minX), maxX)
      onDrag(scale.invert(x))
    })
    .on('end', () => onDragEnd())

  return (selection: DailyScrollBarSelection): void => {
    selection.each(function (this: SVGGElement) {
      const container = d3.select(this)
      const date = container.datum() as Date

      container
        .selectAll<SVGLineElement, null>(`#${GUTTER_ID}`)
        .data([null])
        .join('line')
        .attr('id', GUTTER_ID)
        .attr('data-testid', GUTTER_ID)
        .attr('stroke-width', GUTTER_HEIGHT)
        .attr('x1', axisGutter + GUTTER_HEIGHT / 2)
        .attr('x2', width - GUTTER_HEIGHT / 2)
        .attr('y1', 0)
        .attr('y2', 0)

      container
        .selectAll<SVGRectElement, Date>(`#${THUMB_ID}`)
        .data([date])
        .join((enter) => enter
          .append('rect')
          .classed('scrollThumb', true)
          .attr('id', THUMB_ID)
          .attr('data-testid', THUMB_ID)
          .call(drag)
        )
        .attr('x', (d: Date) => scale(d) - THUMB_RADIUS)
        .attr('y', -THUMB_RADIUS / 3)
        .attr('rx', THUMB_RADIUS / 3)
        .attr('width', THUMB_RADIUS * 2)
        .attr('height', THUMB_RADIUS * 2 / 3)
    })
  }
}
