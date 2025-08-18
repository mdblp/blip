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

import picto from '../../../img/physicalactivity.png'
import { DEFAULT_IMAGE_MARGIN, DEFAULT_OPTIONS_SIZE } from './eventsConstants'

/**
 * @typedef {import("../../tidelinedata").Datum} Datum
 * @typedef {import("../../pool").default} Pool
 */

/**
 * Creates drawing functions for physical activity events
 * @param {Pool} pool - The pool to render into
 * @param {Object} opts - Configuration options
 * @returns {Object} - Drawing functions for physical activity visualization
 */
function drawPhysicalActivity(pool, opts) {
  const height = pool.height() - 20
  const offset = height / 5

  const calculateWidth = (/** @type {Datum} */ d) => opts.xScale(d.epochEnd) - opts.xScale(d.epoch)
  const xPos = (/** @type {Datum} */ d) => opts.xScale(d.epoch)

  opts.size = opts.size ?? DEFAULT_OPTIONS_SIZE

  return {
    /**
     * Draw pictogram for physical activity
     * @param {d3.Selection} pa - D3 selection of physical activity elements
     */
    picto: function(pa) {
      pa.append('rect')
        .classed('d3-rect-pa d3-pa', true)
        .attr('id', (d) => `pa_img_${d.id}`)
        .attr('x', xPos)
        .attr('y', _.constant(0))
        .attr('width', calculateWidth)
        .attr('height', _.constant(offset))

      pa.append('image')
        .attr('x', xPos)
        .attr('y', pool.height() / 2 - opts.size / 2)
        .attr('width', calculateWidth)
        .attr('height', pool.height() - DEFAULT_IMAGE_MARGIN)
        .attr('href', picto)
    },

    /**
     * Draw activity rectangle for physical activity
     * @param {d3.Selection} pa - D3 selection of physical activity elements
     */
    activity: function(pa) {
      pa.append('rect')
        .classed('d3-rect-pa d3-pa', true)
        .attr('id', (d) => `pa_rect_${d.id}`)
        .attr('x', xPos)
        .attr('y', _.constant(offset))
        .attr('width', calculateWidth)
        .attr('height', _.constant(pool.height() - offset))
    },

    /**
     * Tooltip handling functions
     */
    tooltip: {
      /**
       * Add tooltip to physical activity
       * @param {Datum} d - Physical activity data
       * @param {HTMLElement} rect - Container element for tooltip positioning
       */
      add: function(d, rect) {
        if (_.get(opts, 'onPhysicalHover', false)) {
          opts.onPhysicalHover({
            data: d,
            rect: rect
          })
        }
      },

      /**
       * Remove tooltip from physical activity
       * @param {Datum} d - Physical activity data
       */
      remove: function(d) {
        if (_.get(opts, 'onPhysicalOut', false)) {
          opts.onPhysicalOut({
            data: d
          })
        }
      }
    }
  }
}

export default drawPhysicalActivity
