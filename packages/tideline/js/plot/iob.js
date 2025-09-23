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
import * as d3 from 'd3'

import utils from './util/utils'
import { DEFAULT_BG_BOUNDS, MGDL_UNITS } from 'medical-domain'

const defaults = {
  bgUnits: MGDL_UNITS,
  classes: {
    low: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower,
    target: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper,
    high: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh
  },
  radius: 2.5,
  /** @type {ScaleContinuousNumeric} */
  xScale: null
}

/**
 * Plot Insulin On Board (IOB) points
 * @param {Pool} pool - The pool to render into
 * @param {typeof defaults} opts - Configuration options
 * @returns {Function} - The IOB plotting function
 */
function plotIob(pool, opts = {}) {
  _.defaults(opts, defaults)

  function iob(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function () {
      const iobValues = pool.filterDataForRender(opts.tidelineData.medicalData.iob)
      const allIobPoints = d3.select(this)
        .selectAll('circle.d3-iob')
        .data(iobValues, d => d.id)

      // Using join pattern for enter/update/exit
      allIobPoints.join(
        enter => enter.append('circle')
          .attr('id', d => `iob_${d.id}`)
          .attr('data-testid', d => `iob_${d.id}`)
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', opts.radius)
          .classed('d3-iob', true),
        update => update
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', opts.radius),
        exit => exit.remove()
      )

      const highlight = pool.highlight(allIobPoints)

      // Set up mouseover and mouseout event handlers
      selection.selectAll('.d3-iob')
        .on('mouseover', function (event, d) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          d3Select.attr('r', opts.radius + 1)

          iob.addTooltip(d, utils.getTooltipContainer(this))
        })
        .on('mouseout', function () {
          highlight.off()
          d3.select(this)
            .attr('r', opts.radius)

          if (_.get(opts, 'onIobOut', false)) {
            opts.onIobOut()
          }
        })
    })
  }

  /**
   * Calculate the x position for a data point
   * @param {Object} d - The data point
   * @returns {number} - The x coordinate
   */
  iob.xPosition = function (d) {
    return opts.xScale(d.epoch)
  }

  /**
   * Calculate the y position for a data point
   * @param {Object} d - The data point
   * @returns {number} - The y coordinate
   */
  iob.yPosition = function (d) {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  /**
   * Add tooltip for a data point
   * @param {Object} d - The data point
   * @param {HTMLElement} rect - The container element
   */
  iob.addTooltip = function (d, rect) {
    if (_.get(opts, 'onIobHover', false)) {
      opts.onIobHover({
        data: d,
        rect: rect,
        class: 'd3-iob-hover'
      })
    }
  }

  return iob
}

export default plotIob
