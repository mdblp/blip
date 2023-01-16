/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { DurationUnit } from 'medical-domain'

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
 * getDayFormat
 * @returns string according to translation
 */
export const getDayFormat = (): string => {
  return t('dddd, MMMM D')
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
export const getTimezoneFromTimePrefs = (timePrefs?: { timezoneAware?: boolean, timezoneName?: string }): string => {
  if (typeof timePrefs === 'object' && !_.isEmpty(timePrefs)) {
    return timePrefs.timezoneName ?? getBrowserTimezone() ?? 'UTC'
  }
  return 'UTC'
}

/**
 * Format a duration
 * @param {number} duration - positive integer duration in milliseconds
 * @param {{condensed?: boolean}} opts - options
 * @return {string} formatted duration, e.g., '1¼ h'
 */
export const formatDuration = (duration: number, opts?: { condensed: boolean }): string => {
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

  if (opts?.condensed) {
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
export const formatLocalizedFromUTC = (utc: string | number | Date | moment.Moment, timePrefs?: { timezoneAware?: boolean, timezoneName?: string }, format = getDayFormat()): string => {
  const timezone = getTimezoneFromTimePrefs(timePrefs)
  return moment.utc(utc).tz(timezone).format(format)
}

export const convertValueToMinutes = (durationValue: number, durationUnit: DurationUnit): number => {
  switch (durationUnit) {
    case DurationUnit.Seconds:
      return Math.round(durationValue / 60)
    case DurationUnit.Hours:
      return durationValue * 60
    default:
      return durationValue
  }
}
