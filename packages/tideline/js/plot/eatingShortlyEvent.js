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
import * as d3 from 'd3'
import eatingShortlyEventIcon from 'eating-shortly.svg'
import utils from './util/utils'

function plotEatingShortlyEvent(pool, opts) {
  var defaults = {
    r: 14,
    padding: 4
  }

  _.defaults(opts, defaults)

  var xPos = function (d) {
    return opts.xScale(d.epoch)
  }


  /**
   * Renders eating shortly event icons on the plot.
   * @param {d3.Selection} selection - The D3 selection to render the eating shortly events into.
   * Uses opts.tidelineData.medicalData.eatingShortlyEvents for data.
   * Adds SVG circles and images for each event, and sets up mouseover/mouseout handlers.
   * @returns {void}
   */
  function eatingShortlyEvent(selection) {
    var yPos = opts.r + opts.padding
    opts.xScale = pool.xScale().copy()
    const height = 24
    const width = 24
    const imageCenterY = 6

    selection.each(function () {
      const filteredData = opts.tidelineData.medicalData.eatingShortlyEvents

      if (filteredData.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-eating-shortly-group').remove()
        return
      }

      const allEatingShortly = d3
        .select(this)
        .selectAll('circle.d3-eating-shortly')
        .data(filteredData, (d) => d.id)
      const eatingShortlyGroup = allEatingShortly.enter()
        .append('g')
        .classed('d3-eating-shortly-group', true)
        .attr('id', (d) => `eating_shortly_event_${d.id}`)
        .attr('data-testid', (d) => `eating_shortly_event_${d.id}`)

      eatingShortlyGroup
        .append('circle')
        .classed('d3-circle-eating-shortly', true)
        .attr('id', (d) => `eating_shortly_circle_${d.id}`)
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', opts.r)
        .attr('stroke-width', 0)

      eatingShortlyGroup.append('image')
        .attr('x', (d) => xPos(d) - (width / 2))
        .attr('y', imageCenterY)
        .attr('width', width)
        .attr('height', height)
        .attr('href', eatingShortlyEventIcon)

      selection.selectAll('.d3-eating-shortly-group').on('mouseover', function () {
        opts.onEatingShortlyHover({
          data: d3.select(this).datum(),
          rect: utils.getTooltipContainer(this)
        })
      })

      selection.selectAll('.d3-eating-shortly-group').on('mouseout', function () {
        opts.onEatingShortlyOut()
      })
    })
  }

  return eatingShortlyEvent
}

export default plotEatingShortlyEvent
