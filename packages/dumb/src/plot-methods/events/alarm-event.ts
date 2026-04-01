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

import deviceEventIcon from 'device-event.svg'
import hyperglycemiaEventIcon from 'hyperglycemia-event.svg'
import hypoglycemiaEventIcon from 'hypoglycemia-event.svg'

import { AlarmEvent, AlarmEventType } from 'medical-domain'
import { Pool } from '../../models/pool.model'
import { getTooltipContainer } from '../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../models/plot-function.model'
import { PlotSelection } from '../../models/plot-selection.model'
import { PlotOptions } from '../../models/plot-options.model'

const D3_ALARM_EVENT_ID = 'alarmEvent'
const DEFAULT_OPTIONS_SIZE = 30
const DEFAULT_IMAGE_MARGIN = 8

/**
 * Get the appropriate icon for an alarm event based on its type
 * @param alarmEventType - The type of alarm event
 * @returns The SVG icon for the alarm event type
 */
const getAlarmEventImage = (alarmEventType: AlarmEventType): string => {
  switch (alarmEventType) {
    case AlarmEventType.Device:
      return deviceEventIcon
    case AlarmEventType.Hyperglycemia:
      return hyperglycemiaEventIcon
    case AlarmEventType.Hypoglycemia:
      return hypoglycemiaEventIcon
    case AlarmEventType.Unknown:
    default:
      return deviceEventIcon
  }
}

type AlarmEventOptions = PlotOptions<AlarmEvent> & {
  size?: number
  alarmEvents: AlarmEvent[]
}

const defaults: Partial<AlarmEventOptions> = {
  size: DEFAULT_OPTIONS_SIZE,
  xScale: null
}

/**
 * Plot alarm events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The alarm event plotting function
 */
export const plotAlarmEvent = (
  pool: Pool<AlarmEvent>,
  opts: Partial<AlarmEventOptions> = {}
): PlotFunction => {
  const options = _.defaults(opts, defaults) as AlarmEventOptions

  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  const xPos = (d: AlarmEvent): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  return (selection: PlotSelection): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      const alarmEvents = pool.filterDataForRender(options.alarmEvents)
      const alarmEventGroupSelector = `d3-${D3_ALARM_EVENT_ID}-group`

      if (alarmEvents.length < 1) {
        d3.select(this).selectAll(`g.${alarmEventGroupSelector}`).remove()
        return
      }

      const allAlarmEvents = d3
        .select(this)
        .selectAll<SVGGElement, AlarmEvent>(`g.d3-${D3_ALARM_EVENT_ID}`)
        .data(alarmEvents, (data: AlarmEvent) => data.id)

      const alarmEventPlotPrefixId = `${D3_ALARM_EVENT_ID}_group`

      // Using join pattern for enter/update/exit
      const alarmEventGroup = allAlarmEvents.join(
        enter => {
          const group = enter
            .append('g')
            .classed(alarmEventGroupSelector, true)
            .attr('id', (data: AlarmEvent) => `${alarmEventPlotPrefixId}_${data.id}`)
            .attr('data-testid', (data: AlarmEvent) => `${alarmEventPlotPrefixId}_${data.guid}`)

          // Add alarm event icon
          group
            .append('image')
            .attr('x', (d: AlarmEvent) => xPos(d) - width / 2)
            .attr('y', pool.height() / 2 - (options.size ?? DEFAULT_OPTIONS_SIZE) / 2)
            .attr('width', width)
            .attr('height', height)
            .attr('href', (alarmEvent: AlarmEvent) => getAlarmEventImage(alarmEvent.alarmEventType))

          return group
        },
        update => {
          // Update existing elements
          update
            .select('image')
            .attr('x', (d: AlarmEvent) => xPos(d) - width / 2)
            .attr('href', (alarmEvent: AlarmEvent) => getAlarmEventImage(alarmEvent.alarmEventType))

          return update
        },
        exit => exit.remove()
      )

      // Set up event handlers
      alarmEventGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: AlarmEvent) {
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

