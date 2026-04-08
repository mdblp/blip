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

import { Pool } from '../../../models/pool.model'
import { drawCircle, drawText, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { SuperpositionEvent } from '../../../models/superposition-event.model'
import { SuperpositionEventSeverity } from '../../../models/enums/superposition-event-severity.enum'

const D3_SUPERPOSITION_ID = 'eventSuperposition'

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

const DEFAULT_RADIUS = 14

/**
 * Plot superposition events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The event superposition plotting function
 */
export const plotEventSuperposition = (
  pool: Pool<SuperpositionEvent>,
  opts: Partial<EventSuperpositionOptions> = {}
): PlotFunction<SuperpositionEvent> => {
  const options = _.defaults(opts, defaults) as EventSuperpositionOptions

  const height = pool.height()
  const offset = height / 2

  const xPos = (d: SuperpositionEvent): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(new Date(d.normalTime).valueOf())
  }

  return (selection: PlotSelection<SuperpositionEvent>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      const eventSuperpositionItems = options.eventSuperpositionItems
      const eventSuperpositionSelector = `d3-${D3_SUPERPOSITION_ID}-group`

      if (!eventSuperpositionItems || eventSuperpositionItems.length < 1) {
        d3.select(this).selectAll(`g.${eventSuperpositionSelector}`).remove()
        return
      }

      const allEventSuperpositionItems = d3
        .select(this)
        .selectAll<SVGGElement, SuperpositionEvent>(`g.d3-${D3_SUPERPOSITION_ID}`)
        .data(eventSuperpositionItems, (data: SuperpositionEvent) => data.firstEventId)

      const eventSuperpositionPlotPrefixId = `${D3_SUPERPOSITION_ID}_group`

      // Using join pattern for enter/update/exit
      const eventSuperpositionGroup = allEventSuperpositionItems.join(
        enter => {
          const group = enter
            .append('g')
            .classed(eventSuperpositionSelector, true)
            .attr('data-testid', (data: SuperpositionEvent) =>
              `${eventSuperpositionPlotPrefixId}_${data.firstEventId}`)

          const circleCx = (d: SuperpositionEvent) => xPos(d)
          const circleClass = (d: SuperpositionEvent) => SEVERITY_CLASS_MAP[d.severity]
          const circleId = () => 'superposition_circle'

          drawCircle(group, circleCx, offset, circleClass, circleId)

          const getText = (d: SuperpositionEvent): string => (d.eventsCount).toString()
          const textX = (d: SuperpositionEvent) => xPos(d)
          const textId = () => 'superposition_text'

          drawText(group, getText, textX, offset, 'd3-superposition-text', textId)

          return group
        },
        update => {
          // Update existing elements
          update
            .select('circle')
            .attr('cx', (d: SuperpositionEvent) => xPos(d))
            .attr('cy', offset)
            .attr('r', DEFAULT_RADIUS)
            .attr('class', (d: SuperpositionEvent) => SEVERITY_CLASS_MAP[d.severity])

          update
            .select('text')
            .text((d: SuperpositionEvent) => d.eventsCount)
            .attr('x', (d: SuperpositionEvent) => xPos(d))
            .attr('y', offset)

          return update
        },
        exit => exit.remove()
      )

      // Set up event handlers
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

