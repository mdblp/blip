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

import picto from '../../img/parameter.png'
import utils from './util/utils'
import { DEFAULT_IMAGE_MARGIN, DEFAULT_OPTIONS_SIZE } from './util/eventsConstants'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

/**
 *
 * @param {Pool} pool
 * @param {{r: number, padding: number, onParameterHover: (p: any) => void, onParameterOut: () => void, tidelineData: MedicalDataService, xScale: (d: number) => number }} opts
 * @returns {(data: Datum[]) => void}
 */
function plotDeviceParameterChange(pool, opts) {
  const d3 = window.d3
  const defaults = {
    r: 14,
    padding: 4,
    xScale: pool.xScale().copy(),
    size: DEFAULT_OPTIONS_SIZE
  }

  _.defaults(opts, defaults)

  const offset = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  const xPos = (/** @type {Datum} */ d) => utils.xPos(d, opts) - (width / 2)

  function parameter(selection) {
    opts.xScale = pool.xScale().copy()
    selection.each(function() {
      /*We are always cleaning param-group because of multiple rendering when navigating between days*/
      d3.select(this).selectAll('g.d3-param-group').remove()
      const deviceParameters = pool.filterDataForRender(opts.tidelineData.medicalData.deviceParametersChanges)
      if (deviceParameters.length < 1) {
        return
      }

      const allParameters = d3
        .select(this)
        .selectAll('circle.d3-param-only')
        .data(deviceParameters, (d) => d.id)

      const parameterGroup = allParameters.enter()
        .append('g')
        // .attr({
        //   'class': 'd3-param-group',
        //   'id': (d) => `param_group_${d.id}`,
        //   'data-testid': (d) => `param_group_${d.id}`
        // })
        .classed('d3-param-group', true)
        .attr('id', (d) => `param_group_${d.id}`)
        .attr('data-testid', (d) => `param_group_${d.id}`)

      parameterGroup.append('image')
        // .attr({
        //   'x': xPos,
        //   'y': pool.height() / 2 - opts.size / 2,
        //   width,
        //   'height': offset,
        //   'xlink:href': picto,
        //   'data-testid': `param_group_img`
        // })
        .attr('x', xPos)
        .attr('y', pool.height() / 2 - opts.size / 2)
        .attr('width', width)
        .attr('height', offset)
        .attr('xlink:href', picto)
        .attr('data-testid', `param_group_img`)

      allParameters.exit().remove()

      // tooltips
      selection.selectAll('.d3-param-group').on('mouseover', function() {
        parameter.addTooltip(d3.select(this).datum(), utils.getTooltipContainer(this))
      })

      selection.selectAll('.d3-param-group').on('mouseout', function() {
        if (_.get(opts, 'onParameterOut', false)) {
          opts.onParameterOut()
        }
      })
    })
  }

  parameter.addTooltip = function(d, rect) {
    if (_.get(opts, 'onParameterHover', false)) {
      opts.onParameterHover({
        data: d,
        rect: rect
      })
    }
  }

  return parameter
}

export default plotDeviceParameterChange
