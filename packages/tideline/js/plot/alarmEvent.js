/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import * as d3 from 'd3'

import deviceEventIcon from 'device-event.svg'
import hyperglycemiaEventIcon from 'hyperglycemia-event.svg'
import hypoglycemiaEventIcon from 'hypoglycemia-event.svg'
import utils from './util/utils'
import { AlarmEventType } from 'medical-domain'
import { DEFAULT_IMAGE_MARGIN, DEFAULT_OPTIONS_SIZE } from './util/eventsConstants'

const D3_ALARM_EVENT_ID = 'alarmEvent'

const getAlarmEventImage = (alarmEventType) => {
  switch (alarmEventType) {
    case AlarmEventType.Device:
      return deviceEventIcon
    case AlarmEventType.Hyperglycemia:
      return hyperglycemiaEventIcon
    case AlarmEventType.Hypoglycemia:
      return hypoglycemiaEventIcon
  }
}

function plotAlarmEvent(pool, opts) {
  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  const xPos = (d) => opts.xScale(d.epoch)

  opts.size = opts.size ?? DEFAULT_OPTIONS_SIZE

  return (selection) => {
    opts.xScale = pool.xScale().copy()

    selection.each(function() {
      const alarmEvents = pool.filterDataForRender(opts.alarmEvents)
      const alarmEventGroupSelector = `d3-${D3_ALARM_EVENT_ID}-group`

      if (alarmEvents.length < 1) {
        d3.select(this).selectAll(`g.${alarmEventGroupSelector}`).remove()
        return
      }

      const allAlarmEvents = d3
        .select(this)
        .selectAll(`circle.d3-${D3_ALARM_EVENT_ID}`)
        .data(alarmEvents, (data) => data.id)

      const alarmEventPlotPrefixId = `${D3_ALARM_EVENT_ID}_group`
      const alarmEventGroup = allAlarmEvents
        .enter()
        .append('g')
        .classed(alarmEventGroupSelector, true)
        .attr('id', (data) => `${alarmEventPlotPrefixId}_${data.id}`)
        .attr('data-testid', (data) => `${alarmEventPlotPrefixId}_${data.guid}`)

      alarmEventGroup
        .append('image')
        .attr('x', (d) => xPos(d) - (width / 2))
        .attr('y', pool.height() / 2 - opts.size / 2)
        .attr('width', width)
        .attr('height', height)
        .attr('xlink:href', (alarmEvent) => getAlarmEventImage(alarmEvent.alarmEventType))

      allAlarmEvents.exit().remove()

      selection.selectAll(`.${alarmEventGroupSelector}`).on('mouseover', function () {
        opts.onAlarmEventHover({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this)
        })
      })

      selection.selectAll(`.${alarmEventGroupSelector}`).on('mouseout', opts.onAlarmEventOut)
    })
  }
}

export default plotAlarmEvent
