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

import { AlarmEvent } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { getAlarmEventIcon } from '../../../utils/alarm-event/alarm-event.util'

const D3_ALARM_EVENT_ID = 'alarmEvent'
const DEFAULT_OPTIONS_SIZE = 30
const DEFAULT_IMAGE_MARGIN = 8

type AlarmEventOptions = PlotOptions<AlarmEvent> & {
  alarmEvents: AlarmEvent[]
}

const defaults: Partial<AlarmEventOptions> = {
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
): PlotFunction<AlarmEvent> => {
  const options = _.defaults(opts, defaults) as AlarmEventOptions

  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  const xPos = (d: AlarmEvent): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  return (selection: PlotSelection<AlarmEvent>): void => {
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

          const imageX = (d: AlarmEvent) => xPos(d) - width / 2
          const imageY = pool.height() / 2 - (DEFAULT_OPTIONS_SIZE) / 2
          const imageHref = (alarmEvent: AlarmEvent) => getAlarmEventIcon(alarmEvent.alarmEventType)

          drawImage(group, imageX, imageY, height, width, imageHref)

          return group
        },
        update => {
          // Update existing elements
          update
            .select('image')
            .attr('x', (d: AlarmEvent) => xPos(d) - width / 2)
            .attr('href', (alarmEvent: AlarmEvent) => getAlarmEventIcon(alarmEvent.alarmEventType))

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

