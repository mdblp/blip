import _ from 'lodash'
import utils from './util/utils'
import { DEFAULT_OPTIONS_SIZE } from './util/eventsConstants'

const D3_SUPERPOSITION_ID = 'eventSuperposition'

function plotEventSuperposition(pool, opts = {}) {
  const d3 = window.d3
  const defaults = {
    r: 14,
    xScale: pool.xScale().copy()
  }

  _.defaults(opts, defaults)

  const xPos = (/** @type {Datum} */ d) => utils.xPos(d, opts)

  const height = pool.height()
  const offset = height / 2

  opts.size = opts.size ?? DEFAULT_OPTIONS_SIZE

  return (selection) => {
    opts.xScale = pool.xScale().copy()

    selection.each(function () {
      const eventSuperpositionItems = opts.eventSuperpositionItems
      const eventSuperpositionSelector = `d3-${D3_SUPERPOSITION_ID}-group`

      if (eventSuperpositionItems.length < 1) {
        d3.select(this).selectAll(`g.${eventSuperpositionSelector}`).remove()
        return
      }

      const allEventSuperpositionItems = d3
        .select(this)
        .selectAll(`g.d3-${D3_SUPERPOSITION_ID}`)
        .data(eventSuperpositionItems, (d) => d.id)

      const eventSuperpositionPlotPrefixId = `${D3_SUPERPOSITION_ID}_group`
      const eventSuperpositionGroup = allEventSuperpositionItems
        .enter()
        .append('g')
        .attr({
          'class': eventSuperpositionSelector,
          'id': (d) => `${eventSuperpositionPlotPrefixId}_${d.id}`,
          'data-testid': (data) => `${eventSuperpositionPlotPrefixId}_${data.guid}`
        })

      eventSuperpositionGroup.append('circle')
        .attr({
          'cx': (d) => xPos(d),
          'cy': offset,
          'r': opts.r,
          'stroke-width': 0,
          'class': 'd3-superposition-circle',
          'id': (d) => `event_superposition_circle_${d.events[0].id}`
        })
      eventSuperpositionGroup.append('text')
        .text((d) => d.eventsCount)
        .attr({
          x: (d) => xPos(d),
          y: offset,
          class: 'd3-superposition-text',
          id: (d) => `event_superposition_text_${d.events[0].id}`
        })

      allEventSuperpositionItems.exit().remove()

      selection.selectAll(`.${eventSuperpositionSelector}`).on('click', function (event) {
        console.log({ event })
        opts.onEventSuperpositionClick({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this),
          htmlEvent: event
        })
      })

      // selection.selectAll(`.${eventSuperpositionSelector}`).on('mouseout', opts.onEventSuperpositionOut)
    })
  }
}

export default plotEventSuperposition
