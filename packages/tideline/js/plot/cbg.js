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
import categorizer from '../data/util/categorize'
import { MGDL_UNITS, DEFAULT_BG_BOUNDS } from '../data/util/constants'

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
 *
 * @param {Pool} pool
 * @param {typeof defaults} opts
 * @returns
 */
function plotCbg(pool, opts = defaults) {
  const d3 = window.d3

  _.defaults(opts, defaults)
  opts.classes = _.omit(opts.classes, ['very-low', 'very-high'])

  const categorize = categorizer(opts.classes, opts.bgUnits)
  const mainGroup = pool.parent()

  function cbg(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function(currentData) {
      cbg.addAnnotations(_.filter(currentData, 'annotations'))

      const allCBG = d3.select(this).selectAll('circle.d3-cbg').data(currentData, (d) => d.id)
      const cbgGroups = allCBG.enter()
        .append('circle')
        .attr('class', 'd3-cbg')
        .attr({
          'cx': cbg.xPosition,
          'cy': cbg.yPosition,
          'r': opts.radius,
          'id': (d) => `cbg_${d.id}`,
          'data-testid': (d) => `cbg_${d.id}`
        })
      const cbgVeryLow = cbgGroups.filter((d) => categorize(d) === 'verylow')
      const cbgLow = cbgGroups.filter((d) => categorize(d) === 'low')
      const cbgTarget = cbgGroups.filter((d) => categorize(d) === 'target')
      const cbgHigh = cbgGroups.filter((d) => categorize(d) === 'high')
      const cbgVeryHigh = cbgGroups.filter((d) => categorize(d) === 'veryhigh')
      cbgVeryLow.classed({'d3-circle-cbg': true, 'd3-bg-very-low': true})
      cbgLow.classed({'d3-circle-cbg': true, 'd3-bg-low': true})
      cbgTarget.classed({'d3-circle-cbg': true, 'd3-bg-target': true})
      cbgHigh.classed({'d3-circle-cbg': true, 'd3-bg-high': true})
      cbgVeryHigh.classed({'d3-circle-cbg': true, 'd3-bg-very-high': true})
      allCBG.exit().remove()

      var highlight = pool.highlight(allCBG)

      // tooltips
      selection.selectAll('.d3-circle-cbg').on('mouseover', function () {
        var d3Select = d3.select(this)
        highlight.on(d3Select)
        d3Select.attr({ r: opts.radius + 1 })
        switch (categorize(d3Select.datum())) {
          case 'low':
          case 'verylow':
            d3Select.classed({ 'd3-bg-low-focus': true })
            break
          case 'target':
            d3Select.classed({ 'd3-bg-target-focus': true })
            break
          case 'high':
          case 'veryhigh':
            d3Select.classed({ 'd3-bg-high-focus': true })
            break
          default:
            break
        }
        cbg.addTooltip(d3.select(this).datum(), utils.getTooltipContainer(this))
      })
      selection.selectAll('.d3-circle-cbg').on('mouseout', function () {
        highlight.off()
        d3.select(this).attr({ r: opts.radius })
        d3.select(this).classed({
          'd3-bg-low-focus': false,
          'd3-bg-target-focus': false,
          'd3-bg-high-focus': false
        })
        if (_.get(opts, 'onCBGOut', false)) {
          opts.onCBGOut()
        }
      })
    })
  }

  cbg.xPosition = function(d) {
    return opts.xScale(d.epoch)
  }

  cbg.yPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  cbg.addTooltip = function(d, rect) {
    if (_.get(opts, 'onCBGHover', false)) {
      opts.onCBGHover({
        data: d,
        rect: rect,
        class: categorizer(opts.classes, opts.bgUnits)(d)
      })
    }
  }

  cbg.addAnnotations = function(data) {
    const yScale = pool.yScale()
    for (var i = 0; i < data.length; ++i) {
      var d = data[i]
      var annotationOpts = {
        x: cbg.xPosition(d),
        y: yScale(d.value),
        xMultiplier: 0,
        yMultiplier: 2,
        orientation: {
          down: true
        },
        d: d
      }
      if (_.isNil(mainGroup.select('#annotation_for_' + d.id)[0][0])) {
        mainGroup.select('#tidelineAnnotations_cbg')
          .call(pool.annotations(), annotationOpts)
      }
    }
  }

  return cbg
}

export default plotCbg
