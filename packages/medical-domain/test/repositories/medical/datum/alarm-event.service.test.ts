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

import AlarmEventService from '../../../../src/domains/repositories/medical/datum/alarm-event.service'
import { AlarmCode, AlarmEvent, AlarmEventType, AlarmLevel, DatumType, Source } from '../../../../src'
import { DeviceEventSubtype } from '../../../../src/domains/models/medical/datum/enums/device-event-subtype.enum'

describe('Alarm event service', () => {
  describe('groupData', () => {
    it('should group 2 alarms with the same code occurring in a 30 mn interval', () => {
      const alarm2OccurrenceDate = '2023-07-01T09:36:59.076Z'
      const alarmEvents: AlarmEvent[] = [
        {
          epoch: 1688203319820,
          displayOffset: -120,
          normalTime: '2023-07-01T09:21:59.820Z',
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '821cae56122fc45a69512fac1252078b',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm179',
          inputTime: '2023-07-01T09:21:59.82Z',
          alarm: {
            alarmCode: AlarmCode.Hypoglycemia,
            alarmLevel: AlarmLevel.Alarm,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:23:04.746Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        },
        {
          epoch: 1688204219076,
          displayOffset: -120,
          normalTime: alarm2OccurrenceDate,
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '642ef8d609d991495e8b0e87690caeed',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm181',
          inputTime: '2023-07-01T09:36:59.076Z',
          alarm: {
            alarmCode: AlarmCode.Hypoglycemia,
            alarmLevel: AlarmLevel.Alarm,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:46:58.788Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        }
      ]

      const result = AlarmEventService.groupData(alarmEvents)
      expect(result).toEqual([{
        epoch: 1688203319820,
        displayOffset: -120,
        normalTime: '2023-07-01T09:21:59.820Z',
        timezone: 'Europe/Madrid',
        guessedTimezone: false,
        id: '821cae56122fc45a69512fac1252078b',
        type: DatumType.DeviceEvent,
        source: Source.Diabeloop,
        subType: DeviceEventSubtype.Alarm,
        guid: 'Alarm179',
        inputTime: '2023-07-01T09:21:59.82Z',
        alarm: {
          alarmCode: AlarmCode.Hypoglycemia,
          alarmLevel: AlarmLevel.Alarm,
          alarmType: 'handset',
          ackStatus: 'acknowledged',
          updateTime: '2023-07-01T09:23:04.746Z'
        },
        alarmEventType: AlarmEventType.Hypoglycemia,
        otherOccurrencesDate: [alarm2OccurrenceDate]
      }])
    })

    it('should not group 2 alarms that have a different code', () => {
      const alarmEvents: AlarmEvent[] = [
        {
          epoch: 1688203319820,
          displayOffset: -120,
          normalTime: '2023-07-01T09:21:59.820Z',
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '821cae56122fc45a69512fac1252078b',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm179',
          inputTime: '2023-07-01T09:21:59.82Z',
          alarm: {
            alarmCode: AlarmCode.Hypoglycemia,
            alarmLevel: AlarmLevel.Alarm,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:23:04.746Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        },
        {
          epoch: 1688204219076,
          displayOffset: -120,
          normalTime: '2023-07-01T09:36:59.076Z',
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '642ef8d609d991495e8b0e87690caeed',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm181',
          inputTime: '2023-07-01T09:36:59.076Z',
          alarm: {
            alarmCode: AlarmCode.UrgentLowSoon,
            alarmLevel: AlarmLevel.Alert,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:46:58.788Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        }
      ]

      const result = AlarmEventService.groupData(alarmEvents)
      expect(result).toEqual(alarmEvents)
    })

    it('should not group 2 alarms with the same code but 1 day occurrence interval', () => {
      const alarmEvents: AlarmEvent[] = [
        {
          epoch: 1688203319820,
          displayOffset: -120,
          normalTime: '2023-07-01T09:21:59.820Z',
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '821cae56122fc45a69512fac1252078b',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm179',
          inputTime: '2023-07-01T09:21:59.82Z',
          alarm: {
            alarmCode: AlarmCode.Hypoglycemia,
            alarmLevel: AlarmLevel.Alarm,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:23:04.746Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        },
        {
          epoch: 1688204219076,
          displayOffset: -120,
          normalTime: '2023-07-02T09:36:59.076Z',
          timezone: 'Europe/Madrid',
          guessedTimezone: false,
          id: '642ef8d609d991495e8b0e87690caeed',
          type: DatumType.DeviceEvent,
          source: Source.Diabeloop,
          subType: DeviceEventSubtype.Alarm,
          guid: 'Alarm181',
          inputTime: '2023-07-01T09:36:59.076Z',
          alarm: {
            alarmCode: AlarmCode.Hypoglycemia,
            alarmLevel: AlarmLevel.Alarm,
            alarmType: 'handset',
            ackStatus: 'acknowledged',
            updateTime: '2023-07-01T09:46:58.788Z'
          },
          alarmEventType: AlarmEventType.Hypoglycemia
        }
      ]

      const result = AlarmEventService.groupData(alarmEvents)
      expect(result).toEqual(alarmEvents)
    })
  })
})
