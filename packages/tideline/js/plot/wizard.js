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
 * @typedef {import("../tidelinedata").Datum} Datum
 */

import _ from 'lodash'
import * as d3 from 'd3'

import utils from './util/utils'
import commonbolus from './util/commonbolus'
import drawbolus from './util/drawbolus'

const defaults = {
  width: 12
}

const MINIMAL_OVERRIDE = 0.1 // Minimum override value to be considered an override

/**
 * Plot wizard data (bolus with carb input)
 * @param {Pool} pool - The pool to render into
 * @param {typeof defaults} opts - Configuration options
 * @returns {Function} - The wizard plotting function
 */
function plotWizard(pool, opts = defaults) {
  _.defaults(opts, defaults)

  function wizard(selection) {
    const drawBolus = drawbolus(pool, {
      ...opts,
      yScale: pool.yScale(),
      xScale: pool.xScale().copy()
    })

    selection.each(function (/** @type {Datum[]} */ currentData) {
      if (currentData.length < 1) {
        d3.select(this).selectAll('g.d3-wizard-group').remove()
        return
      }

      // Select all wizard groups and bind data
      const wizards = d3.select(this)
        .selectAll('g.d3-wizard-group')
        .data(currentData, d => d.id)

      // Handle exit selection
      wizards.exit().remove()

      // Create new wizard groups for entering data
      const wizardGroups = wizards
        .join('g')
        .classed('d3-wizard-group', true)
        .attr('id', d => `wizard_group_${d.id}`)
        .attr('data-testid', d => `wizard_group_${d.id}`)<
        .sort((/** @type {Datum} */ a, /** @type {Datum} */ b) => {
          // Sort by size so smaller boluses are drawn last
          const bolusA = a.bolus ?? a
          const bolusB = b.bolus ?? b
          return d3.descending(commonbolus.getMaxValue(bolusA), commonbolus.getMaxValue(bolusB))
        })

      // Filter for elements with carb input
      const carbs = wizardGroups.filter(/** @type {Datum} */ d => d.carbInput)
      drawBolus.carb(carbs)

      // Filter for elements with bolus data
      const boluses = wizardGroups.filter(/** @type {Datum} */ d => _.isObject(d.bolus))
      drawBolus.bolus(boluses)

      // Filter for boluses where programmed differs from delivered
      const undelivered = boluses.filter(bolus => {
        const d = commonbolus.getDelivered(bolus)
        const p = commonbolus.getProgrammed(bolus)
        return Number.isFinite(d) && Number.isFinite(p) && p > d
      })
      drawBolus.undelivered(undelivered)

      // Filter for boluses where recommended > delivered (underride)
      const underride = boluses.filter(d => {
        const r = commonbolus.getRecommended(d)
        const p = commonbolus.getProgrammed(d)
        const underrideValue = Math.abs(p - r)
        return Number.isFinite(r) && Number.isFinite(p) && p < r && underrideValue >= MINIMAL_OVERRIDE
      })
      drawBolus.underride(underride)

      // Filter for boluses where delivered > recommended (override)
      const override = boluses.filter(d => {
        const r = commonbolus.getRecommended(d)
        const p = commonbolus.getProgrammed(d)
        const overrideValue = Math.abs(p - r)
        return Number.isFinite(r) && Number.isFinite(p) && p > r && overrideValue >= MINIMAL_OVERRIDE
      })
      drawBolus.override(override)

      // Set up highlight behavior
      const highlight = pool.highlight('.d3-wizard-group, .d3-bolus-group', opts)

      // Set up tooltip event handlers
      selection.selectAll('.d3-wizard-group')
        .on('mouseover', function (event, d) {
          drawBolus.tooltip.add(d, utils.getTooltipContainer(this))
          highlight.on(d3.select(this))
        })
        .on('mouseout', function (event, d) {
          drawBolus.tooltip.remove(d)
          highlight.off()
        })
    })
  }

  return wizard
}

export default plotWizard
