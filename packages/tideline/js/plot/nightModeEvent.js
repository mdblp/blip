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
import nightModeIcon from 'night-mode.svg'

import utils from './util/utils'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

const D3_NIGHT_MODE_ID = 'nightMode'

/**
 * Plots night mode events in the diabetes management timeline
 * @param {Pool} pool - The pool to render into
 * @param {{ tidelineData: MedicalDataService, r: number, xScale: (d: number) => number, onNightModeHover: Function, onNightModeOut: Function }} opts - Configuration options
 * @returns {Function} - The night mode plotting function
 */
function plotNightMode(pool, opts = {}) {
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

      // Select all night mode event groups and bind data
      const allNightModes = d3.select(this)
        .selectAll(`g.d3-${D3_NIGHT_MODE_ID}`)
        .data(nightModeEvents, (d) => d.id)

      // Handle exit selection
      allNightModes.exit().remove()

      // Create new night mode groups for entering data
      const nightModePlotPrefixId = `${D3_NIGHT_MODE_ID}_group`
      const nightModeGroup = allNightModes
        .join('g')
        .classed(nightModeGroupSelector, true)
        .attr('id', (d) => `${nightModePlotPrefixId}_${d.id}`)
        .attr('data-testid', (d) => `${nightModePlotPrefixId}_${d.guid}`)

      // Add background rectangle
      nightModeGroup.append('rect')
        .classed('d3-rect-night d3-night', true)
        .attr('x', xPos)
        .attr('y', 0)
        .attr('width', calculateWidth)
        .attr('height', height)

      // Add night mode icon
      nightModeGroup.append('image')
        .attr('x', (d) => xPos(d) + calculateWidth(d) / 2 - width / 2)
        .attr('y', offset)
        .attr('width', width)
        .attr('height', height / 2)
        .attr('href', nightModeIcon)

      // Set up event handlers
      selection.selectAll(`.${nightModeGroupSelector}`)
        .on('mouseover', function(event, d) {
          opts.onNightModeHover({
            data: d,
            rect: utils.getTooltipContainer(this)
          })
        })
        .on('mouseout', opts.onNightModeOut)
    })
  }
}

export default plotNightMode
