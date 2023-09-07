import deviceEventIcon from 'device-event.svg'
import hyperglycemiaEventIcon from 'hyperglycemia-event.svg'
import hypoglycemiaEventIcon from 'hypoglycemia-event.svg'
import utils from './util/utils'
import { AlarmEventType } from 'medical-domain'

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
  const d3 = window.d3
  const height = pool.height() / 5
  const width = 40

  const xPos = (d) => opts.xScale(d.epoch)

  return (selection) => {
    opts.xScale = pool.xScale().copy()

    selection.each(function() {
      const alarmEvents = pool.filterDataForRender(opts.tidelineData.medicalData.alarmEvents)
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
        .attr({
          'class': alarmEventGroupSelector,
          'id': (data) => `${alarmEventPlotPrefixId}_${data.id}`,
          'data-testid': (data) => `${alarmEventPlotPrefixId}_${data.guid}`
        })

      alarmEventGroup.append('image').attr({
        'x': (d) => xPos(d) - (width / 2),
        'y': 0,
        width,
        height,
        'xlink:href': (alarmEvent) => getAlarmEventImage(alarmEvent.alarmEventType)
      })

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
