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

import categorizer from '../../data/util/categorize'
import { MGDL_UNITS } from 'medical-domain'

function bgBoundary(bgClasses, bgUnits = MGDL_UNITS) {
  var categorizeBg = categorizer(bgClasses, bgUnits)
  if (Object.keys(bgClasses).length > 3) {
    return function(datum) {
      var category = categorizeBg(datum)
      if (category === 'verylow') {
        return 'd3-bg-very-low'
      }
      else if (category === 'low') {
        return 'd3-bg-low'
      }
      else if (category === 'target') {
        return 'd3-bg-target'
      }
      else if (category === 'high') {
        return 'd3-bg-high'
      }
      else if (category === 'veryhigh') {
        return 'd3-bg-very-high'
      }
    }
  }

  return function(datum) {
    var category = categorizeBg(datum)
    if (category === 'low' || category === 'verylow') {
      return 'd3-bg-low'
    }
    else if (category === 'target') {
      return 'd3-bg-target'
    }
    else if (category === 'high' || category === 'veryhigh') {
      return 'd3-bg-high'
    }
  }
}

export default bgBoundary
