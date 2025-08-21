/*
 * Copyright (c) 2025, Diabeloop
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

import { getDataWithoutSuperpositionEvents, getSuperpositionEvents } from './events.util'
import { type DatumWithSubType, type SuperpositionEvent } from '../../models/superposition-event.model'
import MedicalDataService, { AlarmEvent, AlarmEventType, DeviceEventSubtype } from 'medical-domain'
import moment from 'moment-timezone'
import { SuperpositionEventSeverity } from '../../models/enums/superposition-event-severity.enum'

const makeEvent = (id: string, minutesOffset: number, subType: DeviceEventSubtype, alarmType?: AlarmEventType): DatumWithSubType => {
  const event = {
    id,
    normalTime: moment('2025-01-01T00:00:00Z').add(minutesOffset, 'minutes').toISOString(),
    subType
  } as DatumWithSubType

  if (subType === DeviceEventSubtype.Alarm && alarmType) {
    (event as AlarmEvent).alarmEventType = alarmType
  }

  return event
}

const mockMedicalData = (events: DatumWithSubType[]) => ({
  medicalData: {
    alarmEvents: events.filter(event => event.subType === DeviceEventSubtype.Alarm),
    deviceParametersChanges: events.filter(event => event.subType === DeviceEventSubtype.DeviceParameter),
    reservoirChanges: events.filter(event => event.subType === DeviceEventSubtype.ReservoirChange),
    warmUps: events.filter(event => event.subType === DeviceEventSubtype.Warmup)
  }
} as MedicalDataService)

describe('Events util', () => {
  describe('getSuperpositionEvents', () => {
    it('should group events within 30 minutes into superposition events', () => {
      const events = [
        makeEvent('alarm1', 0, DeviceEventSubtype.Alarm, AlarmEventType.Hyperglycemia),
        makeEvent('alarm2', 45, DeviceEventSubtype.Alarm, AlarmEventType.Hypoglycemia),
        makeEvent('res1', 20, DeviceEventSubtype.ReservoirChange),
        makeEvent('warm1', 40, DeviceEventSubtype.Warmup),
        makeEvent('param1', 10, DeviceEventSubtype.DeviceParameter),
        makeEvent('param2', 30, DeviceEventSubtype.DeviceParameter),
        makeEvent('alarm3', 120, DeviceEventSubtype.Alarm, AlarmEventType.Device),
        makeEvent('param3', 121, DeviceEventSubtype.DeviceParameter),
        makeEvent('param4', 122, DeviceEventSubtype.DeviceParameter),
      ]

      const result = getSuperpositionEvents(mockMedicalData(events))
      expect(result).toHaveLength(3)

      expect(result[0].eventsCount).toBe(3)
      expect(result[0].events.map(e => e.id)).toEqual(['alarm1', 'param1', 'res1'])
      expect(result[0].normalTime).toEqual('2025-01-01T00:00:00.000Z')
      expect(result[0].firstEventId).toEqual('alarm1')
      expect(result[0].severity).toEqual(SuperpositionEventSeverity.Orange)

      expect(result[1].eventsCount).toBe(3)
      expect(result[1].events.map(e => e.id)).toEqual(['param2', 'warm1', 'alarm2'])
      expect(result[1].normalTime).toEqual('2025-01-01T00:30:00.000Z')
      expect(result[1].firstEventId).toEqual('param2')
      expect(result[1].severity).toEqual(SuperpositionEventSeverity.Red)

      expect(result[2].eventsCount).toBe(3)
      expect(result[2].events.map(e => e.id)).toEqual(['alarm3', 'param3', 'param4'])
      expect(result[2].normalTime).toEqual('2025-01-01T02:00:00.000Z')
      expect(result[2].firstEventId).toEqual('alarm3')
      expect(result[2].severity).toEqual(SuperpositionEventSeverity.Grey)
    })

    it('should ignore single events (return only groups with more than one event)', () => {
      const events = [
        makeEvent('alarm1', 0, DeviceEventSubtype.Alarm, AlarmEventType.Hyperglycemia),
        makeEvent('param1', 40, DeviceEventSubtype.DeviceParameter)
      ]

      const result = getSuperpositionEvents(mockMedicalData(events))
      expect(result).toHaveLength(0)
    })

    it('should handle empty medical data', () => {
      const result = getSuperpositionEvents(mockMedicalData([]))
      expect(result).toEqual([])
    })
  })

  describe('getDataWithoutSuperpositionEvents', () => {
    it('should remove events that are part of superposition groups', () => {
      const data = [makeEvent('a', 0, DeviceEventSubtype.Warmup), makeEvent('b', 10, DeviceEventSubtype.Warmup), makeEvent('c', 60, DeviceEventSubtype.Warmup)]
      const superpositionEvents: SuperpositionEvent[] = [
        {
          eventsCount: 2,
          events: [makeEvent('a', 0, DeviceEventSubtype.Warmup), makeEvent('b', 0, DeviceEventSubtype.Warmup)],
          normalTime: '2025-01-01T00:00:00Z',
          firstEventId: 'a',
          severity: SuperpositionEventSeverity.Grey
        }
      ]

      const result = getDataWithoutSuperpositionEvents(data, superpositionEvents)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('c')
    })

    it('should return all data if no events are superposed', () => {
      const data = [makeEvent('a', 0, DeviceEventSubtype.Warmup), makeEvent('b', 120, DeviceEventSubtype.Warmup)]
      const superpositionEvents: SuperpositionEvent[] = []

      const result = getDataWithoutSuperpositionEvents(data, superpositionEvents)
      expect(result).toEqual(data)
    })

    it('should return empty array if all data are superposed', () => {
      const data = [makeEvent('a', 0, DeviceEventSubtype.Warmup), makeEvent('b', 0, DeviceEventSubtype.Warmup)]
      const superpositionEvents: SuperpositionEvent[] = [
        {
          eventsCount: 2,
          events: [makeEvent('a', 0, DeviceEventSubtype.Warmup), makeEvent('b', 0, DeviceEventSubtype.Warmup)],
          normalTime: '2025-01-01T00:00:00Z',
          firstEventId: 'a',
          severity: SuperpositionEventSeverity.Grey
        }
      ]

      const result = getDataWithoutSuperpositionEvents(data, superpositionEvents)
      expect(result).toEqual([])
    })

    it('should handle empty data and empty superpositionEvents', () => {
      const result = getDataWithoutSuperpositionEvents([], [])
      expect(result).toEqual([])
    })
  })
})
