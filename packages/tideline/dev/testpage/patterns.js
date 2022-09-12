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

import * as types from'./types'
import { Intervaler } from'./utils'


// constants
var MS_IN_24HRS = 86400000

var naiveTimestamp = function() {
  return new Date().toISOString().slice(0, -5)
}

function patterns() {
  return {
    basal: {
      constant: function(opts) {
        opts = opts || {}
        var defaults = {
          days: 1,
          rate: 1.0,
          start: naiveTimestamp()
        }
        _.defaults(opts, defaults)

        var dur = MS_IN_24HRS/4
        var basals = []
        var next = new Intervaler(opts.start, dur)
        for (var i = 0; i < opts.days * 4; ++i) {
          basals.push(new types.Basal({
            rate: opts.rate,
            duration: MS_IN_24HRS/4,
            deviceTime: next()
          }))
        }
        return basals
      }
    }
  }
}

export default patterns
