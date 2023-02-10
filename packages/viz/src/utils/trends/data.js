/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2016, Tidepool Project
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

/**
 * findDatesIntersectingWithCbgSliceSegment
 * @param {Array} cbgData - Array of Tidepool cbg events
 * @param {Object} focusedSlice - the current focused cbg slice/segment
 * @param {Array} focusedSliceKeys - Array of 2 keys representing
 *                                   the top & bottom of focused slice segment
 *
 * @return {Array} dates - Array of String dates in YYYY-MM-DD format
 */
export function findDatesIntersectingWithCbgSliceSegment(cbgData, focusedSlice, focusedSliceKeys) {
  const { data } = focusedSlice
  return _.uniq(
    _.map(
      _.filter(
        cbgData,
        (d) => {
          if (d.msPer24 >= data.msFrom && d.msPer24 < data.msTo) {
            return (d.value >= data[focusedSliceKeys[0]] &&
              d.value <= data[focusedSliceKeys[1]])
          }
          return false
        }
      ),
      'localDate'
    )
  ).sort()
}

