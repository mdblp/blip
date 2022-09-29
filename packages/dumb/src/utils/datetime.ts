/**
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import _ from 'lodash'
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
export const getHourMinuteFormat = (): string => {
  return t('h:mm a')
}

/**
 * getHourMinuteFormatNoSpace
 * @returns string according to translation
 */
export const getHourMinuteFormatNoSpace = (): string => {
  return t('h:mma')
}

/**
 * getSimpleHourFormat
 * @returns string according to translation
 */
export const getSimpleHourFormat = (): string => {
  return t('ha')
}

/**
 * getDayFormat
 * @returns string according to translation
 */
export const getDayFormat = (): string => {
  return t('dddd, MMMM D')
}

/**
 * getLongDayFormat
 * @returns string according to translation
 */
export const getLongDayFormat = (): string => {
  return t('MMM D, YYYY')
}

/**
 * getSimpleHourFormatSpace
 * @returns string according to translation
 */
export const getSimpleHourFormatSpace = (): string => {
  return t('h a')
}

/**
 * getLongFormat
 * @returns string according to translation
 */
export const getLongFormat = (): string => {
  return t('ddd, MMM D, Y')
}

/**
 * Moment format for:
 * - English: 'MMM D, YYYY h:mm a'
 * - French: 'D MMM YYYY, H:mm'
 * @returns {string} Format according to translation
 */
export const getLongDayHourFormat = (): string => {
  return t('MMM D, YYYY h:mm a')
}

/**
 * addDuration
 * @param {String} startTime - an ISO date string
 * @param {Number} duration - milliseconds to add to date
 * @returns new Date ISO string - the provided datetime + duration
 */
export const addDuration = (startTime: string, duration: number): string => {
  const dateTime = new Date(startTime)

  return new Date(dateTime.valueOf() + duration).toISOString()
}

/**
 * getBrowserTimezone
 * @returns {String} browser-determined timezone name
 */
export const getBrowserTimezone = (): string => {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * getTimezoneFromTimePrefs
 * @param {{timezoneAware: boolean; timezoneName: string; }} timePrefs - object containing timezoneAware Boolean and timezoneName String
 *
 * @return {String} timezoneName from timePrefs, browser, or fallback to 'UTC'
 */
export const getTimezoneFromTimePrefs = (timePrefs: { timezoneAware: boolean, timezoneName: string }): string => {
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
export const formatBirthdate = (patient: { profile: { patient: { birthday: string } } }): string => {
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
export const formatClocktimeFromMsPer24 = (milliseconds: number, format = getHourMinuteFormat()): string => {
  if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > TWENTY_FOUR_HRS) {
    throw new Error('First argument must be a value in milliseconds per twenty-four hour day!')
  }
  return moment.utc(milliseconds).format(format)
}

/**
 * formatDateRange
 * @param {string} startDate - A moment-compatible date object or string
 * @param {string} endDate - A moment-compatible date object or string
 * @param {string} format - Optional. The moment format string to parse startDate and endDate with
 * @param {string} timezone Default to UTC
 */
export const formatDateRange = (startDate: string, endDate: string, format: string, timezone = 'UTC'): string => {
  const start = moment.tz(startDate, format, timezone)
  const end = moment.tz(endDate, format, timezone)

  const isSameYear = start.isSame(end, 'year')
  const startFormat = isSameYear ? start.format(t('MMM D')) : start.format(t('MMM D, YYYY'))
  const endFormat = end.format(t('MMM D, YYYY'))
  return `${startFormat} - ${endFormat}`
}

/**
 * Format a duration
 * @param {number} duration - positive integer duration in milliseconds
 * @param {{condensed?: boolean}} opts - options
 * @return {string} formatted duration, e.g., '1¼ h'
 */
export const formatDuration = (duration: number, opts: { condensed: boolean }): string => {
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
export const formatLocalizedFromUTC = (utc: string | number | Date | moment.Moment, timePrefs: { timezoneAware: boolean, timezoneName: string }, format = getDayFormat()): string => {
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
export const getHammertimeFromDatumWithTimePrefs = (datum: { normalTime: string, deviceTime: string }, timePrefs: { timezoneAware: boolean, timezoneName: string }): number | null => {
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
export const getLocalizedCeiling = (utc: string | number | Date | moment.Moment, timePrefs: { timezoneAware: boolean, timezoneName: string }): Date => {
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
