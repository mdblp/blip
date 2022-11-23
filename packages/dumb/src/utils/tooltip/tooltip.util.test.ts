/*
 * Copyright (c) 2022, Diabeloop
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

import { getDateTitle } from './tooltip.util'
import { BaseDatum, Source } from 'medical-domain'

describe('TooltipUtil', () => {
  const timePrefs = {
    timezoneAware: true,
    timezoneName: 'Timezone'
  }
  const customNormalTime = 'Normal time'

  describe('getDateTitle', () => {
    it('should return the values from data if provided', () => {
      const customSource = 'Other source'
      const customTimezone = 'Custom timezone'
      const data = {
        source: customSource as Source,
        normalTime: customNormalTime,
        timezone: customTimezone
      } as BaseDatum

      expect(getDateTitle(data, timePrefs)).toEqual({
        source: customSource,
        normalTime: customNormalTime,
        timezone: customTimezone,
        timePrefs
      })
    })

    it('should return default values if some information is missing from data', () => {
      const data = { normalTime: customNormalTime } as BaseDatum

      expect(getDateTitle(data, timePrefs)).toEqual({
        source: 'Diabeloop',
        normalTime: customNormalTime,
        timezone: 'UTC',
        timePrefs
      })
    })
  })
})
