import _ from 'lodash'
import hypoglycemiaEventIcon from 'hypoglycemia-event.svg'
import utils from './util/utils'

const D3_ALARM_EVENT_ID = 'alarmEvent'

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

      const alarmEventGroup = allAlarmEvents
        .enter()
        .append('g')
        .attr({
          class: alarmEventGroupSelector,
          id: (data) => `${D3_ALARM_EVENT_ID}_group_${data.id}`
        })

      alarmEventGroup.append('image').attr({
        'x': (d) => xPos(d) - (width / 2),
        'y': 0,
        width,
        height,
        // TODO Update image
        // 'xlink:href': hypoglycemiaEventIcon
        'xlink:href': hypoglycemiaEventIcon
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
