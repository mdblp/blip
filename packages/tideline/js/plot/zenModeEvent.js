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

import _ from 'lodash'

import utils from './util/utils'

const D3_ZEN_MODE_ID = 'event'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

/**
 * @param {Pool} pool
 * @param {{ tidelineData: MedicalDataService, r: number, xScale: (d: number) => number }} opts
 * @returns
 */
function plotZenMode(pool, opts = {}) {
  const d3 = window.d3
  const defaults = {
    r: 14,
    xScale: pool.xScale().copy()
  }

  _.defaults(opts, defaults)

  const xPos = (/** @type {Datum} */ d) => utils.xPos(d, opts)
  const calculateWidth = (d) => utils.calculateWidth(d, opts)

  const height = pool.height()
  const offset = height / 2

  function zenModeEvent(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function () {
      const zenEvents = pool.filterDataForRender(opts.tidelineData.medicalData.zenModes)
      const zenModeGroupSelector = `d3-${D3_ZEN_MODE_ID}-group`

      if (zenEvents.length < 1) {
        d3.select(this).selectAll(`g.${zenModeGroupSelector}`).remove()
        return
      }

      const zenModeEvent = d3.select(this)
        .selectAll('g.d3-event-group')
        .data(zenEvents, (d) => d.id)

      const zenModePlotPrefixId = `${D3_ZEN_MODE_ID}_group`
      const zenGroup = zenModeEvent.enter()
        .append('g')
        .attr({
          'class': zenModeGroupSelector,
          'id': (d) => `${zenModePlotPrefixId}_${d.id}`,
          'data-testid': (data) => `${zenModePlotPrefixId}_${data.guid}`
        })

      zenGroup.append('rect')
        .attr({
          x: xPos,
          y: 0,
          width: calculateWidth,
          height,
          class: 'd3-rect-zen d3-zen',
          id: (d) => `zen_${d.id}`
        })
      zenGroup.append('circle')
        .attr({
          'cx': (d) => xPos(d) + calculateWidth(d) / 2,
          'cy': offset,
          'r': opts.r,
          'stroke-width': 0,
          'class': 'd3-circle-zen',
          'id': (d) => `zen_circle_${d.id}`
        })
      zenGroup.append('text')
        .text('ZEN')
        .attr({
          x: (d) => xPos(d) + calculateWidth(d) / 2,
          y: offset,
          class: 'd3-zen-text',
          id: (d) => `zen_text_${d.id}`
        })

      zenModeEvent.exit().remove()

      selection.selectAll(`.${zenModeGroupSelector}`).on('mouseover', function () {
        opts.onZenModeHover({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this)
        })
      })

      selection.selectAll(`.${zenModeGroupSelector}`).on('mouseout', opts.onZenModeOut)
    })
  }

  return zenModeEvent
}

export default plotZenMode
