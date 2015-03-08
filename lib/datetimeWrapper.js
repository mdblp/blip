// == BDS2 LICENSE ==
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
// == BDS2 LICENSE ==

/* * * * */
// NB: DO NOT RETURN MOMENT OBJECTS FROM ANY METHOD IN THIS MODULE
// DO NOT PASS GO, DO NOT COLLECT $200
/* * * * */

'use strict';

var timezones = require('./timezones');
var detectTimezone = require('./timezoneDetect');

var datetimeWrapper = function(moment) {
  var DEFAULT_DISPLAY_MASK = 'MMMM D [at] h:mm a';

  function _applyMask(moment, mask) {
    return moment.format(mask);
  }

  var timezoneNames = {};
  moment.tz.names().forEach(function(name) {
    timezoneNames[name] = true;
  });

  return {
    /*
     * Apply an offset to a timestamp (timezone-naive or Zulu)
     *
     * @param {String} timestamp
     * @param {Number|String} offset mins ~from~ UTC
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    applyOffset: function(timestamp, offset) {
      return moment.utc(timestamp).add(offset, 'minutes').toDate();
    },
    /*
     * Apply a timezone to a timezone-naive timestamp
     *
     * @param {String} timestamp
     * @param {String} timezone a valid timezone name as per moment-timezone
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    applyTimezone: function(timestamp, timezone) {
      this.checkTimezoneName(timezone);
      // NB: the result of this method will *not* yield the correct timezone offset from .getTimezoneOffset()
      // that is, the offset corresponding to the passed in timezone
      // because JavaScript Date doesn't do arbitrary timezones, only browser local
      if (timezone == null) {
        // some browsers assume no timezone offset means local time and others assume it means UTC
        // we explicitly make them all act like it is UTC
        return moment.utc(timestamp).toDate();
      } else {
        if (timestamp instanceof Date) {
          return moment.tz(timestamp.toISOString().slice(0,-5), timezone).toDate();
        }
        return moment.tz(timestamp, timezone).toDate();
      }
    },
    /*
     * Construct a Date from canonically-named time fields in the provided object
     *
     * @param {Object} with time fields 'year', 'month', 'day', etc.
     * @return {Object} JavaScript Date
     */
    buildTimestamp: function(o) {
      // months are (annoyingly) zero-indexed in JavaScript (i.e., January is 0, not 1)
      var d = Date.UTC(o.year, o.month - 1, o.day, o.hours, o.minutes, o.seconds);
      if (isNaN(d)) {
        return null;
      }
      return new Date(d);
    },
    /*
     * Get the ceiling for a date (see D3's time functions)
     *
     * @param {String} timestamp
     * @param {String} units a valid units identifier per moment
     * @param {String} timezone a valid timezone name as per moment-timezone
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    ceil: function(time, units, timezone) {
      this.checkTimezoneName(timezone);
      if (timezone == null) {
        timezone = 'UTC';
      }
      return moment.utc(time).tz(timezone).startOf(units).add(1, units).toDate();
    },
    /*
     * Check a timezone name against moment's database
     *
     * @param {String} timezone timezone name
     */
    checkTimezoneName: function(timezone) {
      // actually want truthiness here; all of null, undefined, and '' should *not* throw Error
      // only check actual strings to see if recognized by moment
      if (timezone && timezoneNames[timezone] !== true) {
        throw new Error('Unrecognized timezone name!');
      }
    },
    /*
     * Get the floor for a date (see D3's time functions)
     *
     * @param {String} timestamp
     * @param {String} units a valid units identifier per moment
     * @param {String} timezone a valid timezone name as per moment-timezone
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    floor: function(time, units, timezone) {
      this.checkTimezoneName(timezone);
      if (timezone == null) {
        timezone = 'UTC';
      }
      return moment.utc(time).tz(timezone).startOf(units).toDate();
    },
    /*
     * Format the input datetime as a deviceTime
     *
     * @param {Object|String|Number} JavaScript Date object, string timestamp, or integer timestamp
     *
     * @return {String} timezone-naive timestamp
     */
    formatDeviceTime: function(dt) {
      // use of .utc() here is for cross-browser consistency
      return _applyMask(moment.utc(dt), 'YYYY-MM-DDTHH:mm:ss');
    },
    /*
     * Format the given timestamp for display after applying the given offset
     *
     * @param {String} UTC timestamp
     * @param {Number} offset mins ~from~ UTC
     * @param {String} mask [mask='MMMM D [at] h:mm a'] the date format mask to apply
     *
     * @return {String} the formatted datetime
     */
    formatFromOffset: function(timestamp, offset, mask) {
      mask = mask || DEFAULT_DISPLAY_MASK;
      return _applyMask(moment(timestamp).zone(-offset), mask);
    },
    /*
     * Format the given timestamp for storage
     *
     * @param {String} timestamp
     * @param {Number} offset mins ~from~ UTC
     *
     * @return {String} an ISO8601-formatted timestamp
     */
    formatForStorage: function(timestamp, offset) {
      console.warn('Warning! This method used to expect an offset ~to~ UTC, but now it expects and offset ~from~ UTC. Double-check your usage.');
      // we use -offset here because moment deals in offsets that are ~to~ UTC
      // but we store JavaScript Date-style offsets that are ~from~ UTC
      return moment(timestamp).zone(-offset).format();
    },
    /*
     * Format the given timestamp for display in the given named timezone
     *
     * @param {String} UTC timestamp
     * @param {String} timezone a valid timezone name as per moment-timezone
     * @param {String} mask [mask='MMMM D [at] h:mm a'] the date format mask to apply
     *
     * @return {String} the formatted datetime
     */
    formatInTimezone: function(timestamp, timezone, mask) {
      this.checkTimezoneName(timezone);
      timezone = timezone || '';
      mask = mask || DEFAULT_DISPLAY_MASK;
      return _applyMask(moment(timestamp).tz(timezone), mask);
    },
    /*
     * Try to detect current device's timezone
     *
     * @return {Object} a timezone object
     */
    getDeviceTimezone: function() {
      return detectTimezone();
    },
    /*
     * Get how many milliseconds you are into a day
     *
     * @param {Object|String} JavaScript Date object or string timestamp
     * @param {Number} offset mins ~from~ UTC
     *
     * @return {Number} milliseconds in current day
     */
    getMsFromMidnight: function(dt, offset) {
      // this function is used mainly for deciding when an event matches a device setting
      // since devices report setting start times in milliseconds from midnight, device's local time
      // i.e., a basal rate that starts at midnight device local time has a `start` of 0
      // since we translate device local time into a UTC `time` and a `timezoneOffset` ~from~ UTC
      // we need to translate back to local time then subtract midnight in local time
      // to yield the number of milliseconds from midnight for the event
      dt = moment(dt);
      if (offset == null) {
        offset = 0;
      }
      // we use -offset here because moment deals in offsets that are ~to~ UTC
      // but we store JavaScript Date-style offsets that are ~from~ UTC
      return dt.zone(-offset) - dt.clone().zone(-offset).startOf('day');
    },
    /*
     * Get the offset from the current date
     *
     * @return {String} number of minutes offset ~from~ UTC
     */
    getOffset: function() {
      return -moment().zone();
    },
    /*
     * Get the offset from the given date
     *
     * @return {String} number of minutes offset ~from~ UTC
     */
    getOffsetFromTime: function(timestamp) {
      console.warn('Warning! This method used to return the offset ~to~ UTC, but now it returns the offset ~from~ UTC. Double-check your usage.');
      function containsZone() {
        var zonePattern = /^([+-][0-2]\d:[0-5]\d)$/;
        return zonePattern.test(timestamp.slice(-6));
      }
      if (containsZone()) {
        return -moment.parseZone(timestamp).zone();
      }
      return -moment(timestamp).zone();
    },
    /*
     * Get the offset from the given UTC date plus named timezone
     *
     * @return {String} number of minutes offset ~from~ UTC
     */
    getOffsetFromZone: function(timestamp, timezone) {
      this.checkTimezoneName(timezone);
      return -moment.utc(timestamp).tz(timezone).zone();
    },
    /*
     * Get all timezone objects
     *
     * @return {Array} a list of available timezone objects
     */
    getTimezones: function() {
      return timezones;
    },
    /*
     * Is this an ISO8601-formatted timestamp?
     *
     * @param {String} timestamp
     *
     * @return {Boolean}
     */
    isISODate: function(timestamp) {
      return (/^(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))$/).test(timestamp);
    },
    /*
     * Is this a valid date?
     *
     * @param {String} timestamp
     *
     * @return {Boolean}
     */
    isValidDate: function(timestamp) {
      var m = moment(timestamp);
      // Be careful, if `value` is empty, `m` can be null
      return m && m.isValid();
    },
    /*
     * Parse a timestamp string using provided format and (optionally) timezone into a JavaScript Date
     *
     * @param {String} timestamp
     * @param {String} format to parse the string with
     * @param {String} timezone a valid timezone specifier as per moment-timezone
     *
     * @return {Object} JavaScript Date yielding accurate UTC string from .toISOString()
     */
    parseFromFormat: function(timestamp, format, timezone) {
      this.checkTimezoneName(timezone);
      if (timezone == null) {
        // some browsers assume no timezone offset means local time and others assume it means UTC
        // we explicitly make them all act like it is UTC
        return moment.utc(timestamp, format).toDate();
      } else {
        return moment.tz(timestamp, format, timezone).toDate();
      }
    },
    /*
     * Get a UTC based string that represents `now`
     *
     * @return {String} an ISO8601-formatted timestamp with the offset from UTC specified
     */
    utcDateString: function() {
      return moment().format();
    },
    /*
     * Get a date N days into the future
     *
     * @return {string} an ISO-8601-formatted zulu timestamp N days from now
     */
    futureDate: function(ndays) {
      return moment().utc().add(ndays, 'days').toISOString();
    },
    /*
     * Get the difference between two dates in the asked for units
     *
     * @param {String} timestampA
     * @param {String} timestampB
     * @param {String} units, a valid units identifier per moment e.g. days, hours, years ...
     *
     * @return {string} the difference between the two timestamps (which will be rounded down)
     */
    dateDifference: function(timestampA, timestampB, units) {
      return moment.utc(timestampA).diff(moment.utc(timestampB), units);
    },
    /*
     *== CONSTANTS ==*
     */
    SEC_TO_MSEC: 1000,
    MIN_TO_MSEC: 60 * 1000,
    MIN30_TO_MSEC: 30 * 60 * 1000
  };
};

// CommonJS module is defined
if(typeof module != 'undefined' && module.exports){
  module.exports = datetimeWrapper;
}
