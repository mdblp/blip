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

import { SecurityBasalConfig } from 'medical-domain'
import { getSafetyBasalItems, isSafetyBasalAvailable } from './safety-basal-profile.util'

describe('SafetyBasalProfileUtil', () => {
  describe('getSafetyBasalItems', () => {
    it('should compute end times correctly', () => {
      const securityBasalConfig: SecurityBasalConfig = {
        rates: [

          {
            rate: 1.6,
            start: 510
          },
          {
            rate: 1,
            start: 0
          },
          {
            rate: 0.4,
            start: 840
          }
        ]
      }

      const result = getSafetyBasalItems(securityBasalConfig)
      expect(result).toEqual([
        {
          rate: '1 U/h',
          startTime: '12:00 AM',
          endTime: '8:30 AM'
        },
        {
          rate: '1.6 U/h',
          startTime: '8:30 AM',
          endTime: '2:00 PM'
        },
        {
          rate: '0.4 U/h',
          startTime: '2:00 PM',
          endTime: '12:00 AM'
        }
      ])
    })
  })

  describe('isSafetyBasalAvailable', () => {
    it('should return true if there are rates, false in other cases', () => {
      const securityBasalConfigNoValue: SecurityBasalConfig = {
        rates: []
      }
      const securityBasalConfigOneValue: SecurityBasalConfig = {
        rates: [{ rate: 1.6, start: 510 }]
      }
      const securityBasalConfigMultipleValues: SecurityBasalConfig = {
        rates: [
          {
            rate: 1.6,
            start: 510
          },
          {
            rate: 1,
            start: 0
          },
          {
            rate: 0.4,
            start: 840
          }
        ]
      }

      expect(isSafetyBasalAvailable(null as unknown as SecurityBasalConfig)).toEqual(false)
      expect(isSafetyBasalAvailable(undefined as unknown as SecurityBasalConfig)).toEqual(false)
      expect(isSafetyBasalAvailable({} as unknown as SecurityBasalConfig)).toEqual(false)
      expect(isSafetyBasalAvailable(securityBasalConfigNoValue)).toEqual(false)
      expect(isSafetyBasalAvailable(securityBasalConfigOneValue)).toEqual(true)
      expect(isSafetyBasalAvailable(securityBasalConfigMultipleValues)).toEqual(true)
    })
  });
})
