// == BSD2 LICENSE ==
// Copyright (C) 2014 Tidepool Project
//
// This program is free software; you can redistribute it and/or modify it under
// the terms of the associated License, which is identical to the BSD 2-Clause
// License as published by the Open Source Initiative at opensource.org.
//
// This program is distributed in the hope that it will be useful, but WITHOUT
// ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
// FOR A PARTICULAR PURPOSE. See the License for more details.
//
// You should have received a copy of the License along with this program; if
// not, you can obtain one at http://tidepool.org/licenses/
// == BSD2 LICENSE ==

/* * * * */
// NB: DO NOT RETURN MOMENT OBJECTS FROM ANY METHOD IN THIS MODULE
// DO NOT PASS GO, DO NOT COLLECT $200
/* * * * */

const moment = require('moment-timezone')

const datetimeWrapper = function() {
  const timezoneNames = {}
  moment.tz.names().forEach(function(name) {
    timezoneNames[name] = true
  })

  return {
    /*
     * Apply an offset to a timestamp (timezone-naive or Zulu)
     *
     * @param {String} timestamp
     * @param {Number} offset mins ~from~ UTC
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    applyOffset: function(timestamp, offset) {
      if (!timestamp) {
        throw new Error('No timestamp provided as first argument!')
      }
      return moment.utc(timestamp).add(offset, 'minutes').toDate()
    }
  }
}

module.exports = datetimeWrapper()
