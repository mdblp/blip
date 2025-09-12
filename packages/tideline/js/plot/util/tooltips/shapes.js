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

// when adding a shape from an image supplied by designer
// viewBox attribute should be copied exactly from svg image
import shapeutil from '../shapeutil'

const shapes = {
  generic: {
    fixed: false,
    els: [
      {
        el: 'polygon',
        attrs: {
          pointsFn: function(opts) {
            var offset = 8
            var y = 16
            var x = 12
            return shapeutil.pointString(offset, -opts.h - offset) +
              shapeutil.pointString(opts.w + offset, -opts.h - offset) +
              shapeutil.pointString(opts.w + offset, -offset) +
              shapeutil.pointString(offset+x, -offset) +
              shapeutil.pointString(0, 0) +
              shapeutil.pointString(offset, -y - offset) +
              shapeutil.pointString(offset, -opts.h - offset).trim()
          }
        }
      },
      {
        el: 'polygon',
        attrs: {
          pointsFn: function(opts) {
            var offset = 8
            var y = 16
            var x = 12
            return shapeutil.pointString(offset, -opts.h - offset) +
              shapeutil.pointString(opts.w + offset, -opts.h - offset) +
              shapeutil.pointString(opts.w + offset, -offset) +
              shapeutil.pointString(offset+x, -offset) +
              shapeutil.pointString(0, 0) +
              shapeutil.pointString(offset, -y - offset) +
              shapeutil.pointString(offset, -opts.h - offset).trim()
          },
          class: 'no-stroke'
        }
      }
    ],
    mainClass: 'svg-tooltip-generic',
    orientations: {
      normal: function(pointStr) {
        return pointStr
      },
      leftAndDown: function(str) {
        return shapeutil.mirrorImageX(shapeutil.mirrorImageY(str))
      },
      leftAndUp: function(str) {
        return shapeutil.mirrorImageY(str)
      },
      rightAndDown: function(str) {
        return shapeutil.mirrorImageX(str)
      }
    },
    offset: function(selection, opts) {
      if (!arguments.length) return 8
      selection
        .attr('x', opts.x)
        .attr('y', opts.y)
    }
  }
}

export default shapes
