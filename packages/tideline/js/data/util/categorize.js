/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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
import { MGDL_UNITS, DEFAULT_BG_BOUNDS } from './constants'

function categorizer(bgClasses = {}, bgUnits = MGDL_UNITS) {
  var classes = _.cloneDeep(bgClasses)
  var defaults = {
    veryLow: DEFAULT_BG_BOUNDS[bgUnits].veryLow,
    low: DEFAULT_BG_BOUNDS[bgUnits].targetLower,
    target: DEFAULT_BG_BOUNDS[bgUnits].targetUpper,
    high: DEFAULT_BG_BOUNDS[bgUnits].veryHigh
  }

  _.defaults(classes, defaults)

  return function (d) {
    if (d.value < classes.veryLow) {
      return 'verylow'
    }
    if (d.value >= classes.veryLow && d.value < classes.low) {
      return 'low'
    }
    if (d.value >= classes.low && d.value <= classes.target) {
      return 'target'
    }
    if (d.value > classes.target && d.value <= classes.high) {
      return 'high'
    }
    if (d.value > classes.high) {
      return 'veryhigh'
    }
  }
}

export default categorizer
