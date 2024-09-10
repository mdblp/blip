/*
 * Copyright (c) 2023, Diabeloop
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

import moment from 'moment-timezone'
import { type WeekDaysFilter } from '../../models/time/date-filter.model'
import type WeekDays from '../../models/time/enum/weekdays.enum'

const INVALID_TIMEZONES = ['UTC', 'GMT', 'Etc/GMT']
const timezones = moment.tz.names().filter((tz) => !INVALID_TIMEZONES.includes(tz))

interface NormalizedTime {
  epoch: number
  displayOffset: number
  normalTime: string
  isoWeekday: WeekDays
}

interface NormalizedEndTime {
  epochEnd: number
  normalEnd: string
}

interface TrendsTime {
  localDate: string
  isoWeekday: WeekDays
  msPer24: number
}

export const MS_IN_DAY = 864e5
export const MS_IN_HOUR = 3600000
export const MS_IN_MIN = MS_IN_HOUR / 60

// Find first Daily Saving Time(Summer/Winter time) in a timezone between two dates (unix timestamp)
export function getDstChange(timezone: string, epochFrom: number, epochTo: number): number | null {
  const zone = moment.tz.zone(timezone)
  if (zone === null || zone.untils.length === 0) {
    return null
  }
  const tzChange = zone.untils.find(epoch => epoch >= epochFrom && epoch <= epochTo)
  return tzChange ?? null
}

export function isValidTimeZone(tz: string): boolean {
  return timezones.includes(tz)
}

export function getOffset(epoch: number, timezone: string): number {
  const mTime = moment.tz(epoch, timezone)
  return -mTime.utcOffset()
}

export function toISOString(epoch: number): string {
  return moment.utc(epoch).toISOString()
}

export function epochAtTimezone(time: string | number, tz: string): number {
  return moment.utc(time).tz(tz).valueOf()
}

export function addAtTimezone(time: string | number, tz: string, amount: number, unit: moment.unitOfTime.DurationConstructor): number {
  return moment.utc(time).tz(tz).add(amount, unit).valueOf()
}

export function substractAtTimezone(time: string | number, tz: string, amount: number, unit: moment.unitOfTime.DurationConstructor): number {
  return moment.utc(time).tz(tz).subtract(amount, unit).valueOf()
}

export function getHours(time: string | number, tz: string): number {
  return moment.utc(time).tz(tz).hours()
}

export function addMilliseconds(time: string, milliseconds: number): string {
  const mTime = moment.parseZone(time)
  return moment.utc(mTime).add(milliseconds, 'milliseconds').toISOString()
}

export function getNormalizedTime(strTime: string, timezone: string): NormalizedTime {
  const mTime = moment.parseZone(strTime)
  const epoch = mTime.valueOf()
  const displayOffset = -moment.utc(epoch).tz(timezone).utcOffset()
  return {
    epoch,
    displayOffset,
    normalTime: mTime.toISOString(),
    isoWeekday: getWeekDay(mTime)
  }
}

export function getNormalizedEnd(time: string, duration: number, unit: string): NormalizedEndTime {
  const mTime = moment.parseZone(time)
  const mEndTime = moment.utc(mTime).add(
    duration,
    unit as moment.unitOfTime.DurationConstructor
  )
  return {
    normalEnd: mEndTime.toISOString(),
    epochEnd: mEndTime.valueOf()
  }
}

export function getWeekDay(mTime: moment.Moment): WeekDays {
  return mTime.locale('en').format('dddd').toLowerCase() as WeekDays
}

export function getTrendsTime(epoch: number, timezone: string): TrendsTime {
  const mTime = moment.tz(epoch, timezone)
  const msPer24 = mTime.hours() * 1000 * 60 * 60 +
    mTime.minutes() * 1000 * 60 +
    mTime.seconds() * 1000 +
    mTime.milliseconds()
  return {
    localDate: mTime.format('YYYY-MM-DD'),
    isoWeekday: getWeekDay(mTime),
    msPer24
  }
}

export function getStartOfDay(epoch: number, timezone: string): number {
  const mTime = moment.tz(epoch, timezone).startOf('day')
  return mTime.valueOf()
}

export function getEndOfDay(epoch: number, timezone: string): number {
  const mTime = moment.tz(epoch, timezone).endOf('day').add(1, 'millisecond')
  return mTime.valueOf()
}

export function getEpoch(time: string): number {
  const mTime = moment.parseZone(time)
  return mTime.valueOf()
}

export function format(epoch: number, timezone: string, strFormat: string): string {
  return moment.tz(epoch, timezone).format(strFormat)
}

export function findBasicsDays(firstEpoch: number, firstTimezone: string, lastEpoch: number, lastTimezone: string, fullWeeks: boolean = false): Array<{
  date: string
  type: string
}> {
  const first = moment.tz(firstEpoch, firstTimezone)
  const last = moment.tz(lastEpoch, lastTimezone)

  const start = first.format('YYYY-MM-DD')
  const current = first.clone().startOf('week')
  const mostRecent = last.format('YYYY-MM-DD')
  const end = last.clone().endOf('week').add(1, 'day').format('YYYY-MM-DD')
  let date
  const days = []
  while ((date = current.format('YYYY-MM-DD')) !== end) {
    const dateObj = { date, type: 'mostRecent' }
    if (!fullWeeks && date < start) {
      // Use future here, even if it is not
      // true, so the calendar days are greyed.
      dateObj.type = 'future'
    } else if (date < mostRecent) {
      dateObj.type = 'past'
    } else if (date > mostRecent) {
      dateObj.type = 'future'
    }
    days.push(dateObj)
    current.add(1, 'day')
  }
  return days
}

export function twoWeeksAgo(time: string | number, timezone: string): number {
  const mTime = moment.tz(time, timezone)
  return mTime.startOf('week').subtract(2, 'weeks').valueOf()
}

/**
 * setTimeout() as promised
 * @param {number} timeout in milliseconds
 * @returns Promise<void>
 */
export async function waitTimeout(timeout: number): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, timeout))
}

export const isEpochBetweenBounds = (epoch: number, start: number, end: number): boolean => (
  epoch >= start && epoch <= end
)

export function diffDays(start: number, end: number): number {
  return Math.round(moment.utc(end).diff(moment.utc(start)) / MS_IN_DAY)
}

export function getNumberOfDays(start: number, end: number, daysFilter?: WeekDaysFilter): number {
  const totalDays = diffDays(start, end)
  if (daysFilter === undefined || Object.values(daysFilter).every(val => val)) {
    return totalDays
  }
  const firstDay = moment.utc(start)

  return [...Array(totalDays).keys()].reduce((count, dayOffset) => {
    const currentDay = moment(firstDay).add(dayOffset, 'days')
    const weekDay = getWeekDay(currentDay)
    return daysFilter[weekDay] ? count + 1 : count
  }, 0)
}

export function applyOffset(timestamp: string, offset: number): Date {
  return moment.utc(timestamp).add(offset, 'minutes').toDate()
}
