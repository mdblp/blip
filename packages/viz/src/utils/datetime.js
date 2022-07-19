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

/*
 * Guidelines for these utilities:
 *
 * 1. Only "workhorse" functions used in 2+ places should be here.
 * 1a. A function used in multiple components for one view should live
 * in view-specific utils: src/utils/[view]/datetime.js
 * 1b. A function used in only one component should just be part of that component,
 * potentially as a named export if tests are deemed important to have.
 *
 * 2. Function naming scheme: the two main verbs here are `get` and `format`.
 * 2a. If the function returns any kind of datetime (JavaScript Date, hammertime, ISO 8601 String),
 * then the function name should start with `get`.
 * 2b. If the function returns a _formatted_ String that will be **surfaced to the end user**,
 * then the function name should start with `format`.
 *
 * 3. Function organizational scheme in this file and tests file: alphabetical plz, unless ESLint
 * complains about an undefined (e.g., getTimezoneFromTimePrefs must be at the top).
 *
 * 4. Try to be consistent in how params are used:
 * (e.g., always pass in `timePrefs`) rather than a named timezone
 * and try to copy & paste JSDoc @param descriptions for common params.
 *
 */

import _ from 'lodash'
// using d3-time-format because time is time of data access in
// user’s browser time, not PwD’s configured timezone
import { utcFormat, timeFormat } from 'd3-time-format'
import moment from 'moment-timezone'
import i18next from 'i18next'

const t = i18next.t.bind(i18next)

export const THIRTY_MINS = 1800000
export const ONE_HR = 3600000
export const THREE_HRS = 10800000
export const TWENTY_FOUR_HRS = 86400000

/**
 * getHourMinuteFormat
 * @returns string according to translation
 */
export function getHourMinuteFormat() {
  return t('h:mm a')
}

/**
 * getHourMinuteFormatNoSpace
 * @returns string according to translation
 */
export function getHourMinuteFormatNoSpace() {
  return t('h:mma')
}

/**
 * getSimpleHourFormat
 * @returns string according to translation
 */
export function getSimpleHourFormat() {
  return t('ha')
}

/**
 * getDayFormat
 * @returns string according to translation
 */
export function getDayFormat() {
  return t('dddd, MMMM D')
}

/**
 * getLongDayFormat
 * @returns string according to translation
 */
export function getLongDayFormat() {
  return t('MMM D, YYYY')
}

/**
 * getSimpleHourFormatSpace
 * @returns string according to translation
 */
export function getSimpleHourFormatSpace() {
  return t('h a')
}

/**
 * getLongFormat
 * @returns string according to translation
 */
export function getLongFormat() {
  return t('ddd, MMM D, Y')
}

/**
 * Moment format for:
 * - English: 'MMM D, YYYY h:mm a'
 * - French: 'D MMM YYYY, H:mm'
 * @returns {string} Format according to translation
 */
export function getLongDayHourFormat() {
  return t('MMM D, YYYY h:mm a')
}

/**
 * addDuration
 * @param {String} datetime - an ISO date string
 * @param {Number} duration - milliseconds to add to date
 * @returns new Date ISO string - the provided datetime + duration
 */
export function addDuration(startTime, duration) {
  const dateTime = new Date(startTime)

  return new Date(dateTime.valueOf() + duration).toISOString()
}

/**
 * getBrowserTimezone
 * @returns {String} browser-determined timezone name
 */
export function getBrowserTimezone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * getTimezoneFromTimePrefs
 * @param {{timezoneAware: boolean; timezoneName: string; }} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {String} timezoneName from timePrefs, browser, or fallback to 'UTC'
 */
export function getTimezoneFromTimePrefs(timePrefs) {
  if (typeof timePrefs === 'object' && !_.isEmpty(timePrefs)) {
    return timePrefs.timezoneName ?? getBrowserTimezone() ?? 'UTC'
  }
  return 'UTC'
}

/**
 * formatBirthdate
 * @param {Object} patient - Tidepool patient object containing profile
 *
 * @return {String} formatted birthdate, e.g., 'Jul 4, 1975'; empty String if none found
 */
export function formatBirthdate(patient) {
  const birthday = _.get(patient, 'profile.patient.birthday', '')
  if (birthday) {
    return moment.utc(birthday).format(t('birthday-format'))
  }
  return ''
}

/**
 * formatClocktimeFromMsPer24
 * @param {number} milliseconds - positive integer representing a time of day
 *                            in milliseconds within a 24-hr day
 * @param {string} format - optional moment display format string; default is 'h:mm a'
 *
 * @return {string} formatted clocktime, e.g., '12:05 pm'
 */
export function formatClocktimeFromMsPer24(milliseconds, format = getHourMinuteFormat()) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > TWENTY_FOUR_HRS) {
    throw new Error('First argument must be a value in milliseconds per twenty-four hour day!')
  }
  return moment.utc(milliseconds).format(format)
}

/**
 * formatCurrentDate
 * @return {String} formatted current date, e.g., 'Jul 4, 2017';
 */
export function formatCurrentDate() {
  return timeFormat(t('%b %-d, %Y'))(new Date())
}

/**
 * formatDiagnosisDate
 * @param {Object} patient - Tidepool patient object containing profile
 *
 * @return {String} formatted diagnosis date, e.g., 'Jul 4, 1975'; empty String if none found
 */
export function formatDiagnosisDate(patient) {
  const diagnosis = _.get(patient, 'profile.patient.diagnosisDate', '')
  if (diagnosis) {
    return utcFormat('%b %-d, %Y')(Date.parse(diagnosis))
  }
  return ''
}

/**
 * formatDateRange
 * @param {string|Date} startDate - A moment-compatible date object or string
 * @param {string|Date} endDate - A moment-compatible date object or string
 * @param {string|undefined} format - Optional. The moment format string to parse startDate and endDate with
 * @param {string|undefined} timezone Default to UTC
 */
export function formatDateRange(startDate, endDate, format = undefined, timezone = 'UTC') {
  const start = moment.tz(startDate, format, timezone)
  const end = moment.tz(endDate, format, timezone)

  const isSameYear = start.isSame(end, 'year')
  const startFormat = isSameYear ? start.format(t('MMM D')) : start.format(t('MMM D, YYYY'))
  const endFormat = end.format(t('MMM D, YYYY'))

  const formattedRange = `${startFormat} - ${endFormat}`

  return formattedRange
}

/**
 * Format a duration
 * @param {number} duration - positive integer duration in milliseconds
 * @param {{condensed?: boolean}} opts - options
 * @return {string} formatted duration, e.g., '1¼ h'
 */
export function formatDuration(duration, opts = {}) {
  const momentDuration = moment.duration(duration)
  const days = momentDuration.days()
  const hours = momentDuration.hours()
  const minutes = momentDuration.minutes()
  const seconds = momentDuration.seconds()

  const QUARTER = '¼'
  const THIRD = '⅓'
  const HALF = '½'
  const TWO_THIRDS = '⅔'
  const THREE_QUARTERS = '¾'

  if (opts.condensed) {
    const formatted = {
      days: '',
      hours: '',
      minutes: '',
      seconds: ''
    }

    if (days + hours + minutes === 0) {
      // Less than a minute
      if (seconds > 0) {
        formatted.seconds = `${seconds}${t('abbrev_duration_second')}`
      } else {
        formatted.minutes = `0${t('abbrev_duration_minute_m')}`
      }
    } else {
      let roundedMinutes = seconds >= 30 ? minutes + 1 : minutes
      let roundedHours = hours
      let roundedDays = days

      if (roundedMinutes >= 60) {
        roundedMinutes = roundedMinutes - 60
        roundedHours++
      }

      if (roundedHours >= 24) {
        roundedHours = roundedHours - 24
        roundedDays++
      }

      formatted.days = roundedDays > 0 ? `${roundedDays}${t('abbrev_duration_day')} ` : ''
      formatted.hours = roundedHours > 0 ? `${roundedHours}${t('abbrev_duration_hour')} ` : ''
      formatted.minutes = roundedMinutes > 0 ? `${roundedMinutes}${t('abbrev_duration_minute_m')} ` : ''
    }

    return `${formatted.days}${formatted.hours}${formatted.minutes}${formatted.seconds}`.trim()
  } else if (hours > 0) {
    const suffix = t('abbrev_duration_hour')
    switch (minutes) {
      case 0:
        return `${hours} ${suffix}`
      case 15:
        return `${hours}${QUARTER} ${suffix}`
      case 20:
        return `${hours}${THIRD} ${suffix}`
      case 30:
        return `${hours}${HALF} ${suffix}`
      case 40:
        return `${hours}${TWO_THIRDS} ${suffix}`
      case 45:
        return `${hours}${THREE_QUARTERS} ${suffix}`
      default:
        return `${hours} ${suffix} ${minutes} ${t('abbrev_duration_minute')}`
    }
  } else {
    return `${minutes} ${t('abbrev_duration_minute')}`
  }
}

/**
 * formatLocalizedFromUTC
 * @param {String|Number|Date|moment.Moment} utc - Zulu timestamp (Integer hammertime also OK)
 * @param {Object} timePrefs - object containing timezoneAware Boolean and timezoneName String
 * @param  {String} [format] - optional moment display format string; default is 'dddd, MMMM D'
 *
 * @return {String} formatted datetime, e.g., 'Sunday, January 1'
 */
export function formatLocalizedFromUTC(utc, timePrefs, format = getDayFormat()) {
  const timezone = getTimezoneFromTimePrefs(timePrefs)
  return moment.utc(utc).tz(timezone).format(format)
}

/**
 * getHammertimeFromDatumWithTimePrefs
 * @param {Object} datum - a Tidepool datum with a normalTime (required) and deviceTime (optional)
 * @param {Object} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {Number} Integer hammertime (i.e., UTC time in milliseconds)
 */
export function getHammertimeFromDatumWithTimePrefs(datum, timePrefs) {
  let hammertime
  if (timePrefs.timezoneAware) {
    if (!_.isUndefined(datum.normalTime)) {
      hammertime = Date.parse(datum.normalTime)
    } else {
      hammertime = null
    }
  } else if (!_.isUndefined(datum.deviceTime)) {
    hammertime = Date.parse(datum.deviceTime)
  } else {
    hammertime = null
  }
  if (_.isNaN(hammertime)) {
    throw new Error(
      'Check your input datum; could not parse `normalTime` or `deviceTime` with Date.parse.'
    )
  }
  return hammertime
}

/**
 * getLocalizedCeiling
 * @param {string} utc - Zulu timestamp (Integer hammertime also OK)
 * @param {object} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {Date} a JavaScript Date, the closest (future) midnight according to timePrefs;
 *                  if utc is already local midnight, returns utc
 */
export function getLocalizedCeiling(utc, timePrefs) {
  if (utc instanceof Date) {
    throw new Error('`utc` must be a ISO-formatted String timestamp or integer hammertime!')
  }
  const timezone = getTimezoneFromTimePrefs(timePrefs)
  const startOfDay = moment.utc(utc)
    .tz(timezone)
    .startOf('day')

  const utcHammertime = (typeof utc === 'string') ? Date.parse(utc) : utc
  if (startOfDay.valueOf() === utcHammertime) {
    return startOfDay.toDate()
  }
  return startOfDay.add(1, 'day').toDate()
}
