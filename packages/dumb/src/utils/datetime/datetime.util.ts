/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { DurationUnit, type DurationValue, type TimePrefs } from 'medical-domain'
import * as d3 from 'd3'
import Duration from 'medical-domain/dist/src/domains/models/medical/datum/basics/duration.model'

const t = i18next.t.bind(i18next)

export const ONE_HOUR_MS = 3600000
export const HOURS_IN_DAY = 24
export const THREE_HRS = ONE_HOUR_MS * 3
export const TIMEZONE_UTC = 'UTC'
export const THIRTY_MINS = ONE_HOUR_MS / 2
export const TWENTY_FOUR_HRS = ONE_HOUR_MS * 24

const ONE_HOUR_S = 3600
const ONE_HOUR_MN = 60
const ONE_MINUTE_S = 60
const ONE_MINUTE_MS = 60000

/**
 * getHourMinuteFormat
 * @returns string according to translation
 */
export const getHourMinuteFormat = (): string => {
  return t('h:mm a')
}

/**
 * getDayFormat
 * @returns string according to translation
 */
export const getDayFormat = (): string => {
  return t('dddd, MMMM D')
}

/**
 * getSimpleHourFormatSpace
 * @returns string according to translation
 */
export const getSimpleHourFormatSpace = (): string => {
  return t('h a')
}

/**
 * getLongDayFormat
 * @returns string according to translation
 */
export const getLongDayFormat = (): string => {
  return t('MMM D, YYYY')
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
export const getTimezoneFromTimePrefs = (timePrefs: TimePrefs): string => {
  if (typeof timePrefs === 'object' && !_.isEmpty(timePrefs)) {
    return timePrefs.timezoneName ?? getBrowserTimezone() ?? TIMEZONE_UTC
  }
  return TIMEZONE_UTC
}

export const formatBirthdate = (birthDate?: string): string => {
  if (!birthDate) {
    return ''
  }
  const birthdayFormat = t('birthday-format')
  return moment.utc(birthDate).format(birthdayFormat)
}

export const formatDate = (date?: string): string => {
  if (!date) {
    return ''
  }
  const dateFormat = t('date-format')
  return moment.utc(date).format(dateFormat)
}

export const formatCurrentDate = (): string => {
  return d3.timeFormat(t('%b %-d, %Y'))(new Date())
}

export const formatDateRange = (startDate: string, endDate: string, format: string, timezone: string | undefined = 'UTC'): string => {
  const start = moment.tz(startDate, format, timezone)
  const end = moment.tz(endDate, format, timezone)

  const isSameYear = start.isSame(end, 'year')
  const sameYearFormat = t('MMM D')
  const differentYearFormat = t('MMM D, YYYY')
  const startFormat = isSameYear ? start.format(sameYearFormat) : start.format(differentYearFormat)
  const endFormat = end.format(differentYearFormat)

  return `${startFormat} - ${endFormat}`
}

/**
 * Format a duration
 * @param {number} duration - positive integer duration in milliseconds
 * @param {boolean} condensed - whether the return string should be condensed (e.g: '1min' or '1m')
 * @return {string} formatted duration, e.g., '1¼ h'
 */
export const formatDuration = (duration: number, condensed: boolean = false): string => {
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

  if (condensed) {
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
export const formatLocalizedFromUTC = (utc: string | number | Date | moment.Moment, timePrefs: TimePrefs, format = getDayFormat()): string => {
  const timezone = getTimezoneFromTimePrefs(timePrefs)
  return moment.utc(utc).tz(timezone).format(format)
}

export const formatDateToUtc = (date: string, format: string): string => {
  return moment.utc(date).format(format)
}

export const convertValueToMinutes = (durationValue: number, durationUnit: DurationUnit): number => {
  switch (durationUnit) {
    case DurationUnit.Milliseconds:
      return Math.round(durationValue / ONE_MINUTE_MS)
    case DurationUnit.Seconds:
      return Math.round(durationValue / ONE_MINUTE_S)
    case DurationUnit.Hours:
      return durationValue * ONE_HOUR_MN
    default:
      return durationValue
  }
}

export const convertValueToHours = (durationValue: number, durationUnit: DurationUnit): number => {
  switch (durationUnit) {
    case DurationUnit.Milliseconds:
      return Math.round(durationValue / ONE_HOUR_MS)
    case DurationUnit.Seconds:
      return Math.round(durationValue / ONE_HOUR_S)
    case DurationUnit.Minutes:
      return Math.round(durationValue / ONE_HOUR_MN)
    default:
      return durationValue
  }
}

export const isDurationLowerThanOneHour = (durationValue: number, durationUnit: DurationUnit): boolean => {
  switch (durationUnit) {
    case DurationUnit.Milliseconds:
      return durationValue < ONE_HOUR_MS
    case DurationUnit.Seconds:
      return durationValue < ONE_HOUR_S
    case DurationUnit.Minutes:
      return durationValue < ONE_HOUR_MN
    case DurationUnit.Hours:
      return durationValue < 1
    default:
      return false
  }
}

export const getDuration = (datumWithDuration: Duration): DurationValue => {
  const units = datumWithDuration.duration.units
  const duration = datumWithDuration.duration.value

  if (isDurationLowerThanOneHour(duration, units)) {
    const value = convertValueToMinutes(duration, units)
    return {
      units: DurationUnit.Minutes,
      value
    }
  }

  const value = convertValueToHours(duration, units)
  return {
    units: DurationUnit.Hours,
    value
  }
}

/**
 * formatClocktimeFromMsPer24
 * @param {number} milliseconds - positive integer representing a time of day
 *                            in milliseconds within a 24-hr day
 * @param {string} format - optional moment display format string; default is 'h:mm a'
 *
 * @return {string} formatted clocktime, e.g., '12:05 pm'
 */
export const formatClocktimeFromMsPer24 = (milliseconds: number, format?: string): string => {
  if (!Number.isFinite(milliseconds) || milliseconds < 0 || milliseconds > ONE_HOUR_MS * HOURS_IN_DAY) {
    throw new Error('First argument must be a value in milliseconds per twenty-four hour day')
  }

  const defaultFormat = getHourMinuteFormat()
  return moment.utc(milliseconds).format(format ?? defaultFormat)
}
