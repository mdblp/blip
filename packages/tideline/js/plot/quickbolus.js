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
import commonbolus from './util/commonbolus'
import drawbolus from './util/drawbolus'
import { BolusSubtype, Prescriptor } from 'medical-domain'

const defaults = {
  width: 12
}

/**
 * Get the data-testid attribute value based on bolus type
 * @param {object} d - The bolus data
 * @returns {string} - The data-testid value
 */
const getDataTestId = (d) => {
  if (d.subType === BolusSubtype.Pen) {
    return `bolus_pen_${d.id}`
  }
  if (d.prescriptor === Prescriptor.Manual) {
    return `bolus_manual_${d.id}`
  }
  return 'd3-bolus-group'
}

/**
 * Plot quick boluses (boluses without wizard data)
 * @param {Pool} pool - The pool to render into
 * @param {typeof defaults} opts - Configuration options
 * @returns {Function} - The bolus plotting function
 */
function plotQuickBolus(pool, opts = defaults) {
  _.defaults(opts, defaults)

  function bolus(selection) {
    const drawBolus = drawbolus(pool, {
      ...opts,
      yScale: pool.yScale(),
      xScale: pool.xScale().copy()
    })

    selection.each(function(data) {
      // filter out boluses with wizard
      const currentData = _.filter(data, (d) => _.isEmpty(d.wizard))

      // Select all bolus groups and bind data
      const boluses = d3.select(this)
        .selectAll('g.d3-bolus-group')
        .data(currentData, (d) => d.id)

      const bolusGroups = boluses
        .join('g')
        .classed('d3-bolus-group', true)
        .attr('id', (d) => `bolus_group_${d.id}`)
        .attr('data-testid', (d) => getDataTestId(d))
        .sort((a, b) => {
          // sort by size so smaller boluses are drawn last
          return d3.descending(commonbolus.getMaxValue(a), commonbolus.getMaxValue(b))
        })
        .merge(boluses) // Merge enter and update selections

      // Handle exit selection
      boluses.exit().remove()

      // Draw normal boluses (with delivered > 0)
      const normal = bolusGroups.filter((bolus) => {
        const d = commonbolus.getDelivered(bolus)
        return Number.isFinite(d) && d > 0
      })
      drawBolus.bolus(normal)

      // Draw boluses where programmed differs from delivered
      const undelivered = bolusGroups.filter((bolus) => {
        const d = commonbolus.getDelivered(bolus)
        const p = commonbolus.getProgrammed(bolus)
        return Number.isFinite(d) && Number.isFinite(p) && p > d
      })
      drawBolus.undelivered(undelivered)

      // Set up highlight behavior
      const highlight = pool.highlight('.d3-wizard-group, .d3-bolus-group', opts)

      // Set up tooltip event handlers
      selection.selectAll('.d3-bolus-group')
        .on('mouseover', function(event, d) {
          highlight.on(d3.select(this))
          drawBolus.tooltip.add(d, utils.getTooltipContainer(this))
        })
        .on('mouseout', function(event, d) {
          highlight.off()
          drawBolus.tooltip.remove(d)
        })
    })
  }

  return bolus
}

export default plotQuickBolus
