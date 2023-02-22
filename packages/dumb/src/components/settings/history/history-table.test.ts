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

import { transformToViewModels } from './history-table.core'
import { TimePrefs, Unit } from 'medical-domain'
import { ChangeType } from '../../../models/historized-parameter.model'

const preference: TimePrefs = { timezoneAware: false, timezoneName: 'Europe/Paris', timezoneOffset: 60 }

describe('history core', () => {
  describe('buildAllRows', () => {
    it('should return HistorizedParameter array group by date', () => {
      const params = [
        {
          changeDate: '2022-11-01T00:00:00Z',
          parameters: [
            {
              changeType: ChangeType.Added,
              effectiveDate: '2022-11-01T01:00:00Z',
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              unit: Unit.Percent,
              level: 1,
              value: '143'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '150',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2022-11-01T02:00:00Z',
              changeType: ChangeType.Updated
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '150',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2022-11-01T03:00:00Z',
              changeType: ChangeType.Deleted
            }
          ]
        },
        {
          changeDate: '2022-11-02T00:00:00Z',
          parameters: [
            {
              changeType: ChangeType.Added,
              effectiveDate: '2022-11-02T01:00:00Z',
              name: 'BOLUS_AGGRESSIVENESS_FACTOR',
              unit: Unit.Percent,
              level: 1,
              value: '143'
            },
            {
              name: 'LARGE_MEAL_BREAKFAST',
              value: '150',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2022-11-02T02:00:00Z',
              changeType: ChangeType.Updated
            },
            {
              name: 'LARGE_MEAL_DINNER',
              value: '150',
              unit: Unit.Gram,
              level: 1,
              effectiveDate: '2022-11-02T03:00:00Z',
              changeType: ChangeType.Deleted
            }
          ]
        }
      ]

      const arr = transformToViewModels(params, preference)
      // length of parameter array + row with the date
      expect(arr).toHaveLength(8)
    })

    it('should return empty array when passing any data', () => {
      const arr = transformToViewModels([], preference)
      expect(arr).toHaveLength(0)
    })
  })
})
