/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2022, Diabeloop
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
 * not, you can obtain one from Diabeloop at diabeloop.com.
 * == BSD2 LICENSE ==
 */

import _ from 'lodash'
import utils from './util/utils'
import { DEFAULT_OPTIONS_SIZE } from './util/eventsConstants'
import * as d3 from 'd3'

const D3_SUPERPOSITION_ID = 'eventSuperposition'

function plotEventSuperposition(pool, opts = {}) {
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

      if (!eventSuperpositionItems || eventSuperpositionItems.length < 1) {
        d3.select(this).selectAll(`g.${eventSuperpositionSelector}`).remove()
        return
      }

      const allEventSuperpositionItems = d3.select(this)
        .selectAll(`g.d3-${D3_SUPERPOSITION_ID}`)
        .data(eventSuperpositionItems, d => d.id)

      const eventSuperpositionPlotPrefixId = `${D3_SUPERPOSITION_ID}_group`
      const eventSuperpositionGroup = allEventSuperpositionItems
        .enter()
        .append('g')
        .attr('class', eventSuperpositionSelector)
        .attr('data-testid', d => `${eventSuperpositionPlotPrefixId}_${d.firstEventId}`)

      eventSuperpositionGroup.append('circle')
        .attr('cx', d => xPos(d))
        .attr('cy', offset)
        .attr('r', opts.r)
        .attr('stroke-width', 0)
        .attr('class', (d) => {
          if (d.severity === 'red') {
            return 'd3-superposition-circle-red'
          }
          if (d.severity === 'orange') {
            return 'd3-superposition-circle-orange'
          }
          if (d.severity === 'grey') {
            return 'd3-superposition-circle-grey'
          }
        })

      eventSuperpositionGroup.append('text')
        .text(d => d.eventsCount)
        .attr('x', d => xPos(d))
        .attr('y', offset)
        .attr('class', 'd3-superposition-text')

      allEventSuperpositionItems.exit().remove()

      d3.select(this)
        .selectAll(`.${eventSuperpositionSelector}`)
        .on('click', function (event) {
          opts.onEventSuperpositionClick({
            data: d3.select(this).datum(),
            rect: utils.getTooltipContainer(this),
            htmlEvent: event
          })
        })
    })
  }
}

export default plotEventSuperposition
