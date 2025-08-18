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

import utils from './util/utils'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

/**
 * Plots zen mode events in the diabetes management timeline
 * @param {Pool} pool - The pool to render into
 * @param {{ tidelineData: MedicalDataService, r: number, xScale: (d: number) => number }} opts - Configuration options
 * @returns {Function} - The zen mode plotting function
 */
function plotZenMode(pool, opts = {}) {
  const defaults = {
    r: 14,
    xScale: pool.xScale().copy()
  }

  _.defaults(opts, defaults)

  const xPos = (/** @type {Datum} */ d) => utils.xPos(d, opts)
  const calculateWidth = (d) => utils.calculateWidth(d, opts)

  const height = pool.height()
  const offset = height / 2

  function zenModeEvent(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function () {
      const zenEvents = pool.filterDataForRender(opts.tidelineData.medicalData.zenModes)
      if (zenEvents.length < 1) {
        d3.select(this).selectAll('g.d3-event-group').remove()
        return
      }

      // Select all zen mode event groups and bind data
      const zenModeEvent = d3.select(this)
        .selectAll('g.d3-event-group')
        .data(zenEvents, (d) => d.id)

      // Handle exit selection
      zenModeEvent.exit().remove()

      // Create new zen mode groups for entering data
      const zenGroup = zenModeEvent
        .join('g')
        .classed('d3-event-group', true)
        .attr('id', (d) => `event_group_${d.id}`)

      // Add background rectangle
      zenGroup.append('rect')
        .classed('d3-rect-zen d3-zen', true)
        .attr('id', (d) => `zen_${d.id}`)
        .attr('x', xPos)
        .attr('y', 0)
        .attr('width', calculateWidth)
        .attr('height', height)

      // Add zen mode circle indicator
      zenGroup.append('circle')
        .classed('d3-circle-zen', true)
        .attr('id', (d) => `zen_circle_${d.id}`)
        .attr('cx', (d) => xPos(d) + calculateWidth(d) / 2)
        .attr('cy', offset)
        .attr('r', opts.r)
        .attr('stroke-width', 0)

      // Add "ZEN" text
      zenGroup.append('text')
        .text('ZEN')
        .classed('d3-zen-text', true)
        .attr('id', (d) => `zen_text_${d.id}`)
        .attr('x', (d) => xPos(d) + calculateWidth(d) / 2)
        .attr('y', offset)
        .attr('text-anchor', 'middle') // Center text horizontally
        .attr('dominant-baseline', 'central') // Center text vertically
    })
  }

  return zenModeEvent
}

export default plotZenMode
