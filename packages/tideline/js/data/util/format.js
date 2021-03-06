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

import i18next from 'i18next';
import moment from 'moment-timezone';
import Duration from 'duration-js';

import { MGDL_UNITS, dateTimeFormats } from './constants';

const format = {

  tooltipBG: function(d, units) {
    if (d.annotations && Array.isArray(d.annotations) && d.annotations.length > 0) {
      var annotation = d.annotations[0];
      if (annotation.code && annotation.code === 'bg/out-of-range') {
        var value = annotation.value;
        if (value === 'low') {
          d.tooltipText = d.type === 'cbg' ? 'Lo' : 'Low';
        }
        else if (value === 'high') {
          d.tooltipText = d.type === 'cbg' ? 'Hi' : 'High';
        }
      }
    }
    return format.tooltipBGValue(d.value, units);
  },

  tooltipBGValue: function(value, units) {
    return units === MGDL_UNITS ? window.d3.format('g')(Math.round(value)) : window.d3.format('.1f')(value);
  },

  tooltipValue: function(x) {
    if (x === 0) {
      return '0.0';
    }
    else {
      var formatted = window.d3.format('.3f')(x);
      // remove zero-padding on the right
      while (formatted[formatted.length - 1] === '0') {
        formatted = formatted.slice(0, formatted.length - 1);
      }
      if (formatted[formatted.length - 1] === '.') {
        formatted = formatted + '0';
      }
      return formatted;
    }
  },

  /**
   * Return the name to display for message tooltips
   * @param {string|{firstName?: string, lastName?: string, fullName: string}} name A name
   * @param {number} maxWordLength Maximum words length
   */
  nameForDisplay: function(name, maxWordLength = 22) {
    let words = null;
    if (typeof name === 'string') {
      words = name.split(' ');
    } else if (typeof name.firstName === 'string' && typeof name.lastName === 'string') {
      words = [name.firstName, name.lastName];
    } else if (typeof name.fullName === 'string') {
      words = name.fullName.split(' ');
    } else {
      words = i18next.t('Anonymous user').split(' ');
    }

    return words.map(part => part.length <= maxWordLength ? part : `${part.substring(0, maxWordLength)}...`).join(' ');
  },

  /**
   * Function for returning a preview of a text value followed by elipsis.
   *
   * Will return a string of max length + 3 (for elipsis). Will end preview
   * at last completed word that fits into preview.
   *
   * @param  {string} text The input text
   * @param  {number} previewLength default = 50
   * @return {string} return a string of max length + 3 (for elipsis).
   */
  textPreview: function(text, previewLength = 50) {
    if (text.length <= previewLength) {
      return text;
    }
    const substring = text.substring(0, previewLength);
    const lastSpaceIndex = substring.lastIndexOf(' ');
    const end = (lastSpaceIndex > 0) ? lastSpaceIndex : previewLength;
    return substring.substring(0, end) + '...';
  },

  capitalize: function(s) {
    // transform the first letter of string s to uppercase
    return s[0].toUpperCase() + s.slice(1);
  },

  dayAndDate: function(i, offset) {
    var d = new Date(i);
    if (offset) {
      d.setUTCMinutes(d.getUTCMinutes() + offset);
    }
    return moment.utc(d).format('ddd, MMM D');
  },

  fixFloatingPoint: function(n) {
    return parseFloat(n.toFixed(3));
  },

  percentage: function(f) {
    if (isNaN(f)) {
      return '-- %';
    }
    else {
      return window.d3.format('%')(f);
    }
  },

  millisecondsAsTimeOfDay: function(i) {
    var d = new Date(i);
    var f = i18next.t('%-I:%M %p');
    return window.d3.time.format.utc(f)(d);
  },

  timespan: function(d) {
    var QUARTER = ' ¼', HALF = ' ½', THREE_QUARTER = ' ¾', THIRD = ' ⅓', TWO_THIRDS = ' ⅔';
    var dur = Duration.parse(d.duration + 'ms');
    var hours = dur.hours();
    var minutes = dur.minutes() - (hours * 60);

    if (hours !== 0) {
      if (hours === 1) {
        switch(minutes) {
        case 0:
          return 'over ' + hours + ' hr';
        case 15:
          return 'over ' + hours + QUARTER + ' hr';
        case 20:
          return 'over ' + hours + THIRD + ' hr';
        case 30:
          return 'over ' + hours + HALF + ' hr';
        case 40:
          return 'over ' + hours + TWO_THIRDS + ' hr';
        case 45:
          return 'over ' + hours + THREE_QUARTER + ' hr';
        default:
          return 'over ' + hours + ' hr ' + minutes + ' min';
        }
      } else {
        switch(minutes) {
        case 0:
          return 'over ' + hours + ' hrs';
        case 15:
          return 'over ' + hours + QUARTER + ' hrs';
        case 20:
          return 'over ' + hours + THIRD + ' hrs';
        case 30:
          return 'over ' + hours + HALF + ' hrs';
        case 40:
          return 'over ' + hours + TWO_THIRDS + ' hrs';
        case 45:
          return 'over ' + hours + THREE_QUARTER + ' hrs';
        default:
          return 'over ' + hours + ' hrs ' + minutes + ' min';
        }
      }
    } else {
      return 'over ' + minutes + ' min';
    }
  },

  /**
   * Given a string timestamp, return a formatted date string
   * Optionally adjust the time if an offset is supplied.
   *
   * @param  {string|moment.Moment} time
   * @param  {number} offset
   * @return {string} [MMMM D] e.g. August 4
   */
  datestamp: function(time, offset = 0) {
    if (moment.isMoment(time)) {
      return time.format(dateTimeFormats.MMMM_D_FORMAT);
    }
    var d = new Date(time);
    if (offset) {
      d.setUTCMinutes(d.getUTCMinutes() + offset);
    }
    return moment.utc(d).format(dateTimeFormats.MMMM_D_FORMAT);
  },

  /**
   * Given a string timestamp, return a formatted time string.
   * Optionally adjust the time if an offset is supplied.
   *
   * @param  {string|moment.Moment} time
   * @param  {number} offset
   * @return {string} [%-I:%M %p] D e.g. 3:14 am
   */
  timestamp: function(time, offset = 0) {
    if (moment.isMoment(time)) {
      return time.format(dateTimeFormats.H_MM_A_FORMAT);
    }
    var d = new Date(time);
    var f = i18next.t('%-I:%M %p');
    if (offset) {
      d.setUTCMinutes(d.getUTCMinutes() + offset);
    }
    return window.d3.time.format.utc(f)(d).toLowerCase();
  },

  /**
   * Given two timestamps return an object containing a timechange
   *
   * @param {String} from - date string
   * @param {String} to - date string (required)
   * @return {Object} containing keys from, to, type, format
   */
  timeChangeInfo: function(from, to) {
    if (!to) { // guard statement
      throw new Error('You have not provided a `to` datetime string');
    }

    // the "from" and "to" fields of a time change are always timezone-naive
    // timestamps by definition (b/c they are device-relative time)
    // but some (versions) of (some) browsers like to coerce timestamps without TZ info into local time
    // and we need to prevent that, so we use moment.utc and then use the UTC
    // variant of all JS Date methods to ensure consistency across browsers
    var fromDate = from ? moment.utc(from).toDate() : undefined;
    var toDate = moment.utc(to).toDate();
    var type = 'Time Change';

    var format = 'h:mm a';
    if (fromDate && toDate) {
      if (fromDate.getUTCFullYear() !== toDate.getUTCFullYear()) {
        format = 'MMM D, YYYY h:mm a';
      } else if (
        fromDate.getUTCMonth() !== toDate.getUTCMonth() ||
        fromDate.getUTCDay() !== toDate.getUTCDay()
      ) {
        format = 'MMM D, h:mm a';
      }

      if (Math.abs(toDate - fromDate) <= (8*(60*1000))) { // Clock Drift Adjustment if less than 8 minutes
        type = 'Clock Drift Adjustment';
      }
    }

    return {
      type: type,
      from: fromDate ? moment.utc(fromDate).format(format): undefined,
      to: moment.utc(toDate).format(format),
      format: format
    };
  },

  /**
   * @param {moment.Moment} m The datetime (moment) to display
   * @returns {string} The formated DDDD_MMMM_D_FORMAT datetime
   */
  xAxisDayText: function(m) {
    return m.format(dateTimeFormats.DDDD_MMMM_D_FORMAT);
  },

  /**
   * @param {moment.Moment} m The datetime (moment) to display
   * @returns {string} The formated H_MM_A_FORMAT datetime
   */
  xAxisTickText: function(m) {
    return m.format(dateTimeFormats.H_MM_A_FORMAT);
  }
};

export default format;
