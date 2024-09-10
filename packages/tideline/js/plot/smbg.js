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

/**
 * @typedef { import('../pool').default } Pool
 * @typedef { import('d3').ScaleContinuousNumeric<number, number> } ScaleContinuousNumeric
 */

import _ from 'lodash'

import utils from './util/utils'
import bgBoundaryClass from './util/bgboundary'
import categorizer from '../data/util/categorize'
import { MGDL_UNITS, DEFAULT_BG_BOUNDS } from 'medical-domain'

const defaults = {
  bgUnits: MGDL_UNITS,
  classes: {
    veryLow: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryLow,
    low: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower,
    target: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper,
    high: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh
  },
  size: 16,
  timezoneAware: false,
  tooltipPadding: 20
}

/**
 *
 * @param {Pool} pool
 * @param {typeof defaults} opts
 * @returns
 */
function plotSmbg(pool, opts = defaults) {
  const d3 = window.d3

  _.defaults(opts, defaults)

  var getBgBoundaryClass = bgBoundaryClass(opts.classes, opts.bgUnits)

  function smbg(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function(currentData) {
      var circles = d3.select(this)
        .selectAll('circle.d3-smbg')
        .data(currentData, function(d) {
          return d.id
        })
      circles.enter()
        .append('circle')
        .attr({
          'cx': smbg.xPosition,
          'cy': smbg.yPosition,
          'r': smbg.radius,
          'id': smbg.id,
          'data-testid': smbg.dataTestId,
          'class': getBgBoundaryClass
        })
        .classed({'d3-smbg': true, 'd3-circle-smbg': true})

      circles.exit().remove()

      var highlight = pool.highlight(circles)

      // tooltips
      selection.selectAll('.d3-circle-smbg').on('mouseover', function() {
        highlight.on(d3.select(this))
        smbg.addTooltip(d3.select(this).datum(), utils.getTooltipContainer(this))
      })
      selection.selectAll('.d3-circle-smbg').on('mouseout', function() {
        highlight.off()
        if (_.get(opts, 'onSMBGOut', false)){
          opts.onSMBGOut()
        }
      })
    })
  }

  smbg.radius = function() {
    // size is the total diameter of an smbg
    // radius is half that, minus one because of the 1px stroke for open circles
    return opts.size/2 - 1
  }

  smbg.xPosition = function(d) {
    return opts.xScale(d.epoch)
  }

  smbg.yPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  smbg.id = function(d) {
    return 'smbg_' + d.id
  }

  smbg.dataTestId = function(d) {
    return `smbg_group_${d.id}`
  }

  smbg.addTooltip = function(d, rect) {
    if (_.get(opts, 'onSMBGHover', false)) {
      opts.onSMBGHover({
        data: d,
        rect: rect,
        class: categorizer(opts.classes, opts.bgUnits)(d)
      })
    }
  }

  return smbg
}

export default plotSmbg
