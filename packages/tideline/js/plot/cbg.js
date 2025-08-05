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
import categorizer from '../data/util/categorize'
import { MGDL_UNITS, DEFAULT_BG_BOUNDS } from 'medical-domain'

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
 * Plot continuous blood glucose data points
 * @param {Pool} pool - The pool to render into
 * @param {typeof defaults} opts - Configuration options
 * @returns {Function} - The CBG plotting function
 */
function plotCbg(pool, opts = {}) {
  _.defaults(opts, defaults)
  opts.classes = _.omit(opts.classes, ['veryLow', 'veryHigh'])

  const categorize = categorizer(opts.classes, opts.bgUnits)

  function cbg(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function(currentData) {
      const allCBG = d3.select(this)
        .selectAll('circle.d3-cbg')
        .data(currentData, d => d.id)

      // Using join pattern for enter/update/exit
      const cbgGroups = allCBG.join(
        enter => enter.append('circle')
          .classed('d3-cbg', true)
          .attr('id', d => `cbg_${d.id}`)
          .attr('data-testid', d => `cbg_${d.guid}`)
          .attr('cx', cbg.xPosition)
          .attr('cy', cbg.yPosition)
          .attr('r', opts.radius),
        update => update
          .attr('cx', cbg.xPosition)
          .attr('cy', cbg.yPosition)
          .attr('r', opts.radius),
        exit => exit.remove()
      )

      // Filter and apply classes for different BG categories
      const cbgVeryLow = cbgGroups.filter(d => categorize(d) === 'verylow')
      const cbgLow = cbgGroups.filter(d => categorize(d) === 'low')
      const cbgTarget = cbgGroups.filter(d => categorize(d) === 'target')
      const cbgHigh = cbgGroups.filter(d => categorize(d) === 'high')
      const cbgVeryHigh = cbgGroups.filter(d => categorize(d) === 'veryhigh')

      cbgVeryLow.classed('d3-circle-cbg d3-bg-very-low', true)
      cbgLow.classed('d3-circle-cbg d3-bg-low', true)
      cbgTarget.classed('d3-circle-cbg d3-bg-target', true)
      cbgHigh.classed('d3-circle-cbg d3-bg-high', true)
      cbgVeryHigh.classed('d3-circle-cbg d3-bg-very-high', true)

      const highlight = pool.highlight(allCBG)

      // Set up mouseover and mouseout event handlers
      selection.selectAll('.d3-circle-cbg')
        .on('mouseover', function(event, d) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          d3Select.attr('r', opts.radius + 1)

          switch (categorize(d)) {
            case 'low':
            case 'verylow':
              d3Select.classed('d3-bg-low-focus', true)
              break
            case 'target':
              d3Select.classed('d3-bg-target-focus', true)
              break
            case 'high':
            case 'veryhigh':
              d3Select.classed('d3-bg-high-focus', true)
              break
            default:
              break
          }

          cbg.addTooltip(d, utils.getTooltipContainer(this))
        })
        .on('mouseout', function() {
          highlight.off()
          d3.select(this)
            .attr('r', opts.radius)
            .classed('d3-bg-low-focus', false)
            .classed('d3-bg-target-focus', false)
            .classed('d3-bg-high-focus', false)

          if (_.get(opts, 'onCBGOut', false)) {
            opts.onCBGOut()
          }
        })
    })
  }

  /**
   * Calculate the x position for a data point
   * @param {Object} d - The data point
   * @returns {number} - The x coordinate
   */
  cbg.xPosition = function(d) {
    return opts.xScale(d.epoch)
  }

  /**
   * Calculate the y position for a data point
   * @param {Object} d - The data point
   * @returns {number} - The y coordinate
   */
  cbg.yPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  /**
   * Add tooltip for a data point
   * @param {Object} d - The data point
   * @param {HTMLElement} rect - The container element
   */
  cbg.addTooltip = function(d, rect) {
    if (_.get(opts, 'onCBGHover', false)) {
      opts.onCBGHover({
        data: d,
        rect: rect,
        class: categorizer(opts.classes, opts.bgUnits)(d)
      })
    }
  }

  return cbg
}

export default plotCbg
