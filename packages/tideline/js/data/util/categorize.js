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
import { MGDL_UNITS, defaultBgClasses, classifyBgValue } from 'medical-domain'


function categorizer(bgClasses = {}, bgUnits = MGDL_UNITS) {
  const finalBgBounds = {
    veryLowThreshold: bgClasses.veryLow ? bgClasses.veryLow : defaultBgClasses[bgUnits].veryLow,
    targetLowerBound: bgClasses.low ? bgClasses.low : defaultBgClasses[bgUnits].low,
    targetUpperBound: bgClasses.target ? bgClasses.target : defaultBgClasses[bgUnits].target,
    veryHighThreshold: bgClasses.high ? bgClasses.high : defaultBgClasses[bgUnits].high
  }

  return function (d) {
    return classifyBgValue(finalBgBounds, d.value, 'fiveWay').toLowerCase()
  }
}

export default categorizer
