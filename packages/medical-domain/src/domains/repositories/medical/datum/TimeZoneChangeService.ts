import Datum, { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'
import TimeZoneChange from '../../../models/medical/datum/TimeZoneChange'
import { getDstChange, toISOString } from '../../time/TimeService'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): TimeZoneChange => {
  const base = BaseDatumService.normalize(rawData, opts)
  const rawFrom = (rawData?.from ?? {}) as Record<string, unknown>
  const rawTo = (rawData?.to ?? {}) as Record<string, unknown>
  const tzChange: TimeZoneChange = {
    ...base,
    type: 'deviceEvent',
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
interface TimeZoneProcessor {
  getTimeZoneEvents: (data: Datum[]) => Datum[]
  getTimeZoneChanges: (tzChanges: Datum[], opts: MedicalDataOptions) => TimeZoneChange[]

}
const TimeZoneChangeService: DatumProcessor<TimeZoneChange> & TimeZoneProcessor = {
  normalize,
  deduplicate,
  getTimeZoneEvents,
  getTimeZoneChanges
}

export default TimeZoneChangeService
