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

import { Datum, type DatumProcessor } from '../../../models/medical/datum.model'
import BaseDatumService from './basics/base-datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import type TimeZoneChange from '../../../models/medical/datum/time-zone-change.model'
import { getDstChange, toISOString } from '../../time/time.service'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import DatumService from '../datum.service'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../models/time/date-filter.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): TimeZoneChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const rawFrom = (rawData?.from ?? {}) as Record<string, unknown>
  const rawTo = (rawData?.to ?? {}) as Record<string, unknown>
  const tzChange: TimeZoneChange = {
    ...base,
    type: DatumType.DeviceEvent,
    subType: 'timeChange',
    from: {
      time: rawFrom.time as string,
      timeZoneName: rawFrom.timeZoneName as string
    },
    to: {
      time: rawTo.time as string,
      timeZoneName: rawTo.timeZoneName as string
    },
    method: 'guessed'
  }
  return tzChange
}

const deduplicate = (data: TimeZoneChange[], _opts: MedicalDataOptions): TimeZoneChange[] => {
  return data
}

// Detecting timezone changes (or Summer/Winter time changes) based on timezone offset
const getTimeZoneEvents = (data: Datum[]): Datum[] => {
  return data.filter((datum, idx) => {
    if (idx === 0) {
      return true
    }
    return datum.displayOffset !== data[idx - 1].displayOffset
  })
}

// generating TimeZoneChange events for the timeline (from the whole data filtered from getTimeZoneEvents)
const getTimeZoneChanges = (tzChanges: Datum[], opts: MedicalDataOptions): TimeZoneChange[] => {
  const firstTzChange = tzChanges.shift()
  if (firstTzChange === undefined || tzChanges.length === 0) {
    return []
  }
  let previousTimezone = firstTzChange.timezone
  let previousEpoch = firstTzChange.epoch
  return tzChanges.flatMap((d) => {
    // event for zone name + offset changes
    const rawTzChange = {
      time: d.normalTime,
      timezone: d.timezone,
      type: 'deviceEvent',
      from: {
        time: toISOString(d.epoch),
        timeZoneName: previousTimezone
      },
      to: {
        time: d.normalTime,
        timeZoneName: d.timezone
      }
    }
    if (d.timezone === previousTimezone) {
      // same zone name but != timezone offet ==> Summer/Winter time changes
      const dstEpoch = getDstChange(d.timezone, previousEpoch, d.epoch)
      if (!dstEpoch) {
        previousTimezone = d.timezone
        previousEpoch = d.epoch
        return []
      }
      const timeFrom = toISOString(dstEpoch)
      const timeTo = toISOString(dstEpoch - 1)
      rawTzChange.time = timeTo
      rawTzChange.timezone = d.timezone
      rawTzChange.from.time = timeFrom
      rawTzChange.from.timeZoneName = d.timezone
      rawTzChange.to.time = timeTo
      rawTzChange.to.timeZoneName = d.timezone
    }
    previousTimezone = d.timezone
    previousEpoch = d.epoch
    return [normalize(rawTzChange, opts)]
  })
}

const filterOnDate = (data: TimeZoneChange[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): TimeZoneChange[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as TimeZoneChange[]
}

interface TimeZoneProcessor {
  getTimeZoneEvents: (data: Datum[]) => Datum[]
  getTimeZoneChanges: (tzChanges: Datum[], opts: MedicalDataOptions) => TimeZoneChange[]

}
const TimeZoneChangeService: DatumProcessor<TimeZoneChange> & TimeZoneProcessor = {
  normalize,
  deduplicate,
  filterOnDate,
  getTimeZoneEvents,
  getTimeZoneChanges
}

export default TimeZoneChangeService
