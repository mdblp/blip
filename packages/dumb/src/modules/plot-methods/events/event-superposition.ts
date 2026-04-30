/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { type Pool } from '../../../models/pool.model'
import { drawCircle, drawText, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { type SuperpositionEvent } from '../../../models/superposition-event.model'
import { SuperpositionEventSeverity } from '../../../models/enums/superposition-event-severity.enum'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.EventSuperposition)

const SEVERITY_CLASS_MAP: Record<SuperpositionEventSeverity, string> = {
  [SuperpositionEventSeverity.Red]: 'd3-superposition-circle-red',
  [SuperpositionEventSeverity.Orange]: 'd3-superposition-circle-orange',
  [SuperpositionEventSeverity.Grey]: 'd3-superposition-circle-grey'
}

type EventSuperpositionOptions = PlotOptions<SuperpositionEvent> & {
  eventSuperpositionItems: SuperpositionEvent[]
  onEventSuperpositionClick?: (data: {
    data: SuperpositionEvent
    rect: DOMRect
    htmlEvent: MouseEvent
  }) => void
}

const defaults: Partial<EventSuperpositionOptions> = {
  xScale: null
}

/**
 * Plot event superposition (overlapping events) in the diabetes management timeline
 *
 * Event superposition occurs when multiple diabetes device events happen within
 * a short time window (typically 30 minutes). Instead of displaying all events
 * separately (which would clutter the visualization), they are grouped together
 * and shown as a single numbered circle.
 *
 * The circle color indicates the severity of the grouped events:
 * - Red: Critical events (e.g., hypoglycemia alarms)
 * - Orange: Warning events (e.g., sensor issues)
 * - Grey: Informational events (e.g., device changes)
 *
 * Clicking on a superposition circle reveals the individual events.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, superposition items, and event handlers
 * @returns A function that renders event superposition when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotEventSuperposition(pool, {
 *   tidelineData,
 *   eventSuperpositionItems: superpositionEvents,
 *   onEventSuperpositionClick: (event) => showEventDetails(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotEventSuperposition = (
  pool: Pool<SuperpositionEvent>,
  opts: Partial<EventSuperpositionOptions> = {}
): PlotFunction<SuperpositionEvent> => {
  const options = _.defaults(opts, defaults) as EventSuperpositionOptions

  return (selection: PlotSelection<SuperpositionEvent>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()
    const offset = height / 2

    // Helper functions using closure variables
    const xPos = (d: SuperpositionEvent): number =>
      xScale(new Date(d.normalTime).valueOf())

    /**
     * Create new event superposition visual elements
     */
    const createSuperpositionElements = (
      enter: d3.Selection<d3.EnterElement, SuperpositionEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, SuperpositionEvent, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', (d: SuperpositionEvent) => `${idGen.prefix}_group_${d.firstEventId}`)
        .attr('data-testid', (d: SuperpositionEvent) => `${idGen.prefix}_group_${d.firstEventId}`)

      // Circle with severity-based color
      const circleCx = (d: SuperpositionEvent): number => xPos(d)
      const circleClass = (d: SuperpositionEvent): string => SEVERITY_CLASS_MAP[d.severity]
      const circleId = (): string => 'superposition_circle'

      drawCircle(group, circleCx, offset, circleClass, circleId)

      // Text showing count of events
      const getText = (d: SuperpositionEvent): string => d.eventsCount.toString()
      const textX = (d: SuperpositionEvent): number => xPos(d)
      const textId = (): string => 'superposition_text'

      drawText(group, getText, textX, offset, 'd3-superposition-text', textId)

      return group
    }

    /**
     * Update existing event superposition visual elements
     */
    const updateSuperpositionElements = (
      update: d3.Selection<SVGGElement, SuperpositionEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, SuperpositionEvent, SVGGElement, unknown> => {
      update
        .select('circle')
        .attr('cx', (d: SuperpositionEvent) => xPos(d))
        .attr('cy', offset)
        .attr('r', PLOT_DIMENSIONS.COMMON_RADIUS)
        .attr('class', (d: SuperpositionEvent) => SEVERITY_CLASS_MAP[d.severity])

      update
        .select('text')
        .text((d: SuperpositionEvent) => d.eventsCount.toString())
        .attr('x', (d: SuperpositionEvent) => xPos(d))
        .attr('y', offset)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get superposition items from options
      const eventSuperpositionItems = options.eventSuperpositionItems

      // Step 2: Early exit if no data
      if (!eventSuperpositionItems || eventSuperpositionItems.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allEventSuperpositionItems = d3.select(this)
        .selectAll<SVGGElement, SuperpositionEvent>(`g.${idGen.groupSelector()}`)
        .data(eventSuperpositionItems, (data: SuperpositionEvent) => data.firstEventId)

      const eventSuperpositionGroup = allEventSuperpositionItems.join(
        createSuperpositionElements,
        updateSuperpositionElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      if (options.onEventSuperpositionClick) {
        eventSuperpositionGroup
          .on('click', function (this: SVGGElement, event: MouseEvent) {
            if (options.onEventSuperpositionClick) {
              const datum = d3.select(this).datum() as SuperpositionEvent
              options.onEventSuperpositionClick({
                data: datum,
                rect: getTooltipContainer(this),
                htmlEvent: event
              })
            }
          })
      }
    })
  }
}

