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

import MedicalDataOptions from '../../../models/medical/medical-data-options.model';
import { AlarmEvent } from '../../../models/medical/datum/alarm-event.model';
import BaseDatumService from './basics/base-datum.service';
import DurationService from './basics/duration.service';
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum';
import { DeviceEventSubtype } from '../../../models/medical/datum/enums/device-event-subtype.enum';
import { DatumProcessor } from '../../../models/medical/datum.model';
import { AlarmEventType } from '../../../models/medical/datum/enums/alarm-event-type.enum';
import { AlarmLevel } from '../../../models/medical/datum/enums/alarm-level.enum';
import DatumService from '../datum.service';
import { defaultWeekDaysFilter, WeekDaysFilter } from '../../../models/time/date-filter.model';
import { AlarmCode } from '../../../models/medical/datum/enums/alarm-code.enum'
import moment from 'moment-timezone';

interface AlarmEventsWithLastOccurrence {
  lastOccurrence: string;
  alarmEvents: AlarmEvent[];
}

type GroupedAlarmEvents = {
  [code in AlarmCode]: AlarmEventsWithLastOccurrence
}

interface AlarmEventProcessor {
  groupData: (alarmEvents: AlarmEvent[]) => AlarmEvent[]
}

const CATEGORIZED_ALARM_CODES = {
  DEVICE: {
    ALARM: [
      AlarmCode.InsightEmptyInsulinCartridge,
      AlarmCode.InsightEmptyPumpBattery,
      AlarmCode.InsightIncompatibleActionsOnPump,
      AlarmCode.InsightInsulinCartridgeExpired,
      AlarmCode.InsightOcclusion,
      AlarmCode.KaleidoEmptyInsulinCartridge,
      AlarmCode.KaleidoEmptyPumpBattery,
      AlarmCode.KaleidoInsulinCartridgeExpired,
      AlarmCode.KaleidoOcclusion,
      AlarmCode.SensorSessionExpired
    ]
  },
  HYPOGLYCEMIA: {
    ALARM: [AlarmCode.Hypoglycemia, AlarmCode.LongHypoglycemia],
    ALERT: [AlarmCode.InsightHypoglycemia, AlarmCode.NoReadingsHypoglycemiaRisk, AlarmCode.UrgentLowSoon]
  },
  HYPERGLYCEMIA: {
    ALARM: [AlarmCode.LongHyperglycemia],
    ALERT: [AlarmCode.Hyperglycemia, AlarmCode.SuddenRiseInGlycemia]
  }
}

export const GROUP_ALARMS_THRESHOLD_MINUTES = 30

const getAlarmEventType = (alarmCode: AlarmCode, alarmLevel: string): AlarmEventType => {
  const isHypoglycemiaAlarm = alarmLevel === AlarmLevel.Alarm && CATEGORIZED_ALARM_CODES.HYPOGLYCEMIA.ALARM.includes(alarmCode)
  const isHypoglycemiaAlert = alarmLevel === AlarmLevel.Alert && CATEGORIZED_ALARM_CODES.HYPOGLYCEMIA.ALERT.includes(alarmCode)

  if (isHypoglycemiaAlarm || isHypoglycemiaAlert) {
    return AlarmEventType.Hypoglycemia
  }

  const isHyperglycemiaAlarm = alarmLevel === AlarmLevel.Alarm && CATEGORIZED_ALARM_CODES.HYPERGLYCEMIA.ALARM.includes(alarmCode)
  const isHyperglycemiaAlert = alarmLevel === AlarmLevel.Alert && CATEGORIZED_ALARM_CODES.HYPERGLYCEMIA.ALERT.includes(alarmCode)

  if (isHyperglycemiaAlarm || isHyperglycemiaAlert) {
    return AlarmEventType.Hyperglycemia
  }

  const isDeviceAlarm = alarmLevel === AlarmLevel.Alarm && CATEGORIZED_ALARM_CODES.DEVICE.ALARM.includes(alarmCode)

  if (isDeviceAlarm) {
    return AlarmEventType.Device
  }

  return AlarmEventType.Unknown
}

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): AlarmEvent => {
  const base = BaseDatumService.normalize(rawData, opts)
  const duration = DurationService.normalize(rawData, opts)

  const alarmCode = rawData.alarmCode as AlarmCode
  const alarmLevel = rawData.alarmLevel as AlarmLevel
  const alarmEventType = getAlarmEventType(alarmCode, alarmLevel)

  return {
    ...base,
    ...duration,
    type: DatumType.DeviceEvent,
    subType: DeviceEventSubtype.Alarm,
    guid: rawData.guid as string,
    inputTime: rawData.time as string,
    alarm: {
      alarmCode,
      alarmLevel,
      alarmType: rawData.alarmType as string,
      ackStatus: rawData.ackStatus as string,
      updateTime: rawData.updateTime as string
    },
    alarmEventType
  }
}

const getDefaultAlarmEventsByCodeValue = (alarmEvent: AlarmEvent): AlarmEventsWithLastOccurrence => {
  return {
    lastOccurrence: alarmEvent.normalTime,
    alarmEvents: [alarmEvent]
  }
}

const buildGroupedAlarmEventsByCode = (sortedAlarmEvents: AlarmEvent[]): GroupedAlarmEvents => {
  return sortedAlarmEvents.reduce<GroupedAlarmEvents>((groupedAlarmEvents: GroupedAlarmEvents, alarmEvent: AlarmEvent) => {
    const code = alarmEvent.alarm.alarmCode

    if (!groupedAlarmEvents[code]) {
      groupedAlarmEvents[code] = getDefaultAlarmEventsByCodeValue(alarmEvent)
      return groupedAlarmEvents
    }

    const alarmEventsWithLastOccurrence = groupedAlarmEvents[code]
    const alarmEvents = alarmEventsWithLastOccurrence.alarmEvents
    const lastOccurrence = alarmEventsWithLastOccurrence.lastOccurrence
    const differenceInMinutes = moment(alarmEvent.normalTime).diff(lastOccurrence, 'minutes')

    if (differenceInMinutes < GROUP_ALARMS_THRESHOLD_MINUTES) {
      const alarmEventsLength = alarmEvents.length
      const lastAlarmEvent = alarmEvents[alarmEventsLength - 1]
      const otherOccurrencesDate = lastAlarmEvent.otherOccurrencesDate ?? []

      otherOccurrencesDate.push(alarmEvent.normalTime)
      lastAlarmEvent.otherOccurrencesDate = otherOccurrencesDate
    } else {
      alarmEvents.push(alarmEvent)
    }

    alarmEventsWithLastOccurrence.lastOccurrence = alarmEvent.normalTime
    return groupedAlarmEvents
  }, {} as GroupedAlarmEvents)
}

const getSortedAlarmEvents = (alarmEvents: AlarmEvent[]): AlarmEvent[] => {
  return alarmEvents.sort((alarmEvent1: AlarmEvent, alarmEvent2: AlarmEvent) => {
    return moment(alarmEvent1.normalTime).diff(alarmEvent2.normalTime)
  })
}

const groupData = (alarmEvents: AlarmEvent[]): AlarmEvent[] => {
  const sortedAlarmEvents = getSortedAlarmEvents(alarmEvents)
  const alarmsByCode = buildGroupedAlarmEventsByCode(sortedAlarmEvents)

  const alarmEventsWithGroupedOccurrences = Object
    .entries(alarmsByCode)
    .map(([, value]) => value.alarmEvents)
    .flat()

  return getSortedAlarmEvents(alarmEventsWithGroupedOccurrences)
}

const deduplicate = (data: AlarmEvent[], opts: MedicalDataOptions): AlarmEvent[] => {
  return DatumService.deduplicate(data, opts) as AlarmEvent[]
}

const filterOnDate = (data: AlarmEvent[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): AlarmEvent[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as AlarmEvent[]
}

const AlarmEventService: DatumProcessor<AlarmEvent> & AlarmEventProcessor = {
  normalize,
  deduplicate,
  filterOnDate,
  groupData
}

export default AlarmEventService
