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
import nightModeIcon from 'night-mode.svg'

import utils from './util/utils'

const D3_NIGHT_MODE_ID = 'nightMode'

function plotNightMode(pool, opts = {}) {
  const d3 = window.d3
  const defaults = {
    r: 14,
    xScale: pool.xScale().copy()
  }

  _.defaults(opts, defaults)

  const xPos = (/** @type {Datum} */ d) => utils.xPos(d, opts)
  const calculateWidth = (d) => utils.calculateWidth(d, opts)

  const height = pool.height()
  const width = 40
  const offset = height / 4

  return (selection) => {
    opts.xScale = pool.xScale().copy()

    selection.each(function () {
      const nightModeEvents = pool.filterDataForRender(opts.tidelineData.medicalData.nightModes)
      const nightModeGroupSelector = `d3-${D3_NIGHT_MODE_ID}-group`

      if (nightModeEvents.length < 1) {
        d3.select(this).selectAll(`g.${nightModeGroupSelector}`).remove()
        return
      }

      const allNightModes = d3
        .select(this)
        .selectAll(`g.d3-${D3_NIGHT_MODE_ID}`)
        .data(nightModeEvents, (d) => d.id)

      const nightModePlotPrefixId = `${D3_NIGHT_MODE_ID}_group`
      const nightModeGroup = allNightModes
        .enter()
        .append('g')
        .attr({
          'class': nightModeGroupSelector,
          'id': (d) => `${nightModePlotPrefixId}_${d.id}`,
          'data-testid': (data) => `${nightModePlotPrefixId}_${data.guid}`
        })

      nightModeGroup.append('rect')
        .attr({
          x: xPos,
          y: 0,
          width: calculateWidth,
          height,
          class: 'd3-rect-night d3-night'
        })

      nightModeGroup.append('image')
        .attr({
          'x': (d) => xPos(d) + calculateWidth(d) / 2 - width / 2,
          'y': offset,
          width,
          'height': height / 2,
          'xlink:href': nightModeIcon
        })

      allNightModes.exit().remove()

      selection.selectAll(`.${nightModeGroupSelector}`).on('mouseover', function () {
        opts.onNightModeHover({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this)
        })
      })

      selection.selectAll(`.${nightModeGroupSelector}`).on('mouseout', opts.onNightModeOut)
    })
  }
}

export default plotNightMode
