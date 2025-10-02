/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2015, Tidepool Project
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
import * as d3 from 'd3'
import timeChangeImage from '../../img/timechange/timechange.svg'
import utils from './util/utils'

/**
 * Default configuration for this component
 */
const defaults = {
  tooltipPadding: 20
}

/**
 * Module for adding timechange markers to a chart pool
 *
 * @param  {object} pool the chart pool
 * @param  {typeof defaults} opts configuration options
 * @return {object}      time change object
 */
function plotTimeChange(pool, opts = {}) {
  _.defaults(opts, defaults)

  function timechange(selection) {
    selection.each(function (currentData) {
      const filteredData = _.filter(currentData, { subType: 'timeChange' })

      const timechanges = d3
        .select(this)
        .selectAll('g.d3-timechange-group')
        .data(filteredData, (d) => d.id)

      const timechangeGroup = timechanges
        .enter()
        .append('g')
        .classed('d3-timechange-group', true)
        .attr('id', d => `timechange_${d.id}`)
        .attr('data-testid', d => `timechange_${d.id}`)

      timechange.addTimeChangeToPool(timechangeGroup)

      timechanges.exit().remove()
    })
  }

  timechange.addTimeChangeToPool = (selection) => {
    opts.xScale = pool.xScale().copy()
    selection
      .append('image')
      .classed('d3-image', true)
      .classed('d3-timechange', true)
      .attr('xlink:href', timeChangeImage)
      .attr('x', timechange.xPositionCorner)
      .attr('y', timechange.yPositionCorner)
      .attr('width', opts.size)
      .attr('height', opts.size)

    selection.on('mouseover', function (event, d) {
      opts.onTimeChangeHover({
        data: d,
        rect: utils.getTooltipContainer(this)
      })
    })

    selection.on('mouseout', function () {
      opts.onTimeChangeOut()
    })
  }

  timechange.xPositionCorner = (d) => {
    return opts.xScale(d.epoch) - opts.size / 2
  }

  timechange.yPositionCorner = (/* d */) => {
    return pool.height() / 2 - opts.size / 2
  }

  timechange.xPositionCenter = (d) => {
    return opts.xScale(d.epoch)
  }

  timechange.yPositionCenter = (/* d */) => {
    return pool.height() / 2
  }

  return timechange
}

export default plotTimeChange
