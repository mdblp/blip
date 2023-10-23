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

import { computeDateValue, getDateTitleForBaseDatum } from './tooltip.util'
import { type BaseDatum, type Source, type TimePrefs } from 'medical-domain'
import { DateTitle } from '../../components/tooltips/common/tooltip/tooltip'

describe('TooltipUtil', () => {
  const timePrefs = {
    timezoneAware: true,
    timezoneName: 'Timezone'
  }
  const customNormalTime = 'Normal time'

  describe('getDateTitleForBaseDatum', () => {
    it('should return the values from data if provided', () => {
      const customSource = 'Other source'
      const customTimezone = 'Custom timezone'
      const data = {
        source: customSource as Source,
        normalTime: customNormalTime,
        timezone: customTimezone
      } as BaseDatum

      expect(getDateTitleForBaseDatum(data, timePrefs as TimePrefs)).toEqual({
        source: customSource,
        normalTime: customNormalTime,
        timezone: customTimezone,
        timePrefs
      })
    })

    it('should return default values if some information is missing from data', () => {
      const data = { normalTime: customNormalTime } as BaseDatum

      expect(getDateTitleForBaseDatum(data, timePrefs as TimePrefs)).toEqual({
        source: 'Diabeloop',
        normalTime: customNormalTime,
        timezone: 'UTC',
        timePrefs
      })
    })
  })

  describe('computeDateValue', () => {
    const defaultDateTitle: DateTitle = {
      normalTime: 'TBD',
      timezone: 'Europe/Paris',
      source: 'not Diabeloop',
      timePrefs: {
        timezoneAware: true,
        timezoneName: 'Europe/Paris'
      }
    }

    it('should return undefined when dateTitle is undefined', () => {
      const dateValue = computeDateValue()
      expect(dateValue).toBeUndefined()
    })

    it('should return correct value when source is not "Diabeloop"', () => {
      const date = '2020-01-13T'
      const dateTitle = { ...defaultDateTitle, normalTime: `${date}22:00:00.000Z` }
      const dateValue = computeDateValue(dateTitle)
      expect(dateValue).toBe('11:00 pm')
    })

    it('should return correct value when source is "Diabeloop"', () => {
      const date = '2020-01-13T'
      const dateTitle = { ...defaultDateTitle, normalTime: `${date}22:00:00.000Z`, source: 'Diabeloop' }
      const dateValue = computeDateValue(dateTitle)
      expect(dateValue).toBe('11:00 pm')
    })
  })
})
