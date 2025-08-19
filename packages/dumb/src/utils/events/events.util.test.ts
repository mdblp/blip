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
import { type DatumWithSubType } from '../../models/superposition-event.model'
import MedicalDataService from 'medical-domain'
import moment from 'moment-timezone'

const makeEvent = (id: string, minutesOffset: number): DatumWithSubType => ({
  id,
  normalTime: moment('2025-01-01T00:00:00Z').add(minutesOffset, 'minutes').toISOString(),
} as DatumWithSubType)

const mockMedicalData = (events: DatumWithSubType[]) => ({
  medicalData: {
    alarmEvents: events.filter(e => e.id.startsWith('alarm')),
    deviceParametersChanges: events.filter(e => e.id.startsWith('param')),
    reservoirChanges: events.filter(e => e.id.startsWith('res')),
    warmUps: events.filter(e => e.id.startsWith('warm')),
  }
} as MedicalDataService)

describe('Events util', () => {
  describe('getSuperpositionEvents', () => {
    it('should group events within 30 minutes into superposition events', () => {
      const events = [
        makeEvent('alarm1', 0),
        makeEvent('alarm2', 45),
        makeEvent('res1', 20),
        makeEvent('warm1', 40),
        makeEvent('param1', 10)
      ]

      const result = getSuperpositionEvents(mockMedicalData(events))
      expect(result).toHaveLength(2)
      expect(result[0].eventsCount).toBe(3)
      expect(result[0].events.map(e => e.id)).toEqual(['alarm1', 'param1', 'res1'])
      expect(result[1].eventsCount).toBe(2)
      expect(result[1].events.map(e => e.id)).toEqual(['warm1', 'alarm2'])
    })

    it('should ignore single events (return only groups with more than one event)', () => {
      const events = [
        makeEvent('alarm1', 0),
        makeEvent('param1', 40)
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
      const data = [makeEvent('a'), makeEvent('b'), makeEvent('c')]
      const superpositionEvents: SuperpositionEvent[] = [
        { eventsCount: 2, events: [makeEvent('a'), makeEvent('b')], normalTime: '2025-01-01T00:00:00Z' }
      ]

      const result = getDataWithoutSuperpositionEvents(data, superpositionEvents)
      expect(result).toHaveLength(1)
      expect(result[0].id).toBe('c')
    })

    it('should return all data if no events are superposed', () => {
      const data = [makeEvent('a'), makeEvent('b')]
      const superpositionEvents: SuperpositionEvent[] = []

      const result = getDataWithoutSuperpositionEvents(data, superpositionEvents)
      expect(result).toEqual(data)
    })

    it('should return empty array if all data are superposed', () => {
      const data = [makeEvent('a'), makeEvent('b')]
      const superpositionEvents: SuperpositionEvent[] = [
        { eventsCount: 2, events: [makeEvent('a'), makeEvent('b')], normalTime: '2025-01-01T00:00:00Z' }
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
