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
import drawPhysicalActivity from './util/drawphysicalactivity'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

/**
 * Plots physical activity events in the diabetes management timeline
 * @param {Pool} pool - The pool to render into
 * @param {{ tidelineData: MedicalDataService}} opts - Configuration options
 * @returns {Function} - The physical activity plotting function
 */
function plotPhysicalActivity(pool, opts) {
  return function physicalActivityEvent(selection) {
    opts.xScale = pool.xScale().copy()
    const drawPa = drawPhysicalActivity(pool, opts)

    selection.each(function () {
      const physicalActivities = pool.filterDataForRender(opts.tidelineData.medicalData.physicalActivities)
      if (physicalActivities.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-pa-group').remove()
        return
      }

      // Select all physical activity groups and bind data
      const physicalActivity = d3.select(this)
        .selectAll('g.d3-pa-group')
        .data(physicalActivities, d => d.id)

      // Handle exit selection
      physicalActivity.exit().remove()

      // Create new physical activity groups for entering data
      const paGroups = physicalActivity
        .join('g')
        .classed('d3-pa-group', true)
        .attr('id', d => `pa_group_${d.id}`)
        .attr('data-testid', d => `pa_group_${d.id}`)

      // Filter for activities with reported intensity
      const intensity = paGroups.filter(d => !_.isEmpty(d.reportedIntensity))
      drawPa.picto(intensity)
      drawPa.activity(intensity)

      // Set up tooltip event handlers
      selection.selectAll('.d3-pa-group')
        .on('mouseover', function(event, d) {
          if (d.reportedIntensity) {
            drawPa.tooltip.add(d, utils.getTooltipContainer(this))
          }
        })
        .on('mouseout', function(event, d) {
          if (d.reportedIntensity) {
            drawPa.tooltip.remove(d)
          }
        })
    })
  }
}

export default plotPhysicalActivity
