/*
 * Copyright (c) 2016-2023, Diabeloop
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

import { computeMsThresholdForTimeOfDay, formatCbgs } from './cbg-slices-container.util'
import { CbgSliceContainerData } from '../../../../models/cbg-slice-container-data'

describe('Cbg slice container util', () => {
  describe('formatCbgs', () => {
    it('should return correct stats', () => {
      const data: CbgSliceContainerData[] = [
        { msPer24: 10, value: 1 },
        { msPer24: 10, value: 2 },
        { msPer24: 10, value: 3 },
        { msPer24: 10, value: 4 },
        { msPer24: 10, value: 5 },
        { msPer24: 10, value: 6 },
        { msPer24: 10, value: 7 },
        { msPer24: 10, value: 8 },
        { msPer24: 10, value: 9 },
        { msPer24: 10, value: 10 },
        { msPer24: 10, value: 11 },
        { msPer24: 10, value: 12 },
        { msPer24: 10, value: 13 },
        { msPer24: 5000000, value: 12 },
        { msPer24: 5000000, value: 23 },
        { msPer24: 5000000, value: 34 },
        { msPer24: 5000000, value: 45 },
        { msPer24: 5000000, value: 56 },
        { msPer24: 5000000, value: 67 },
        { msPer24: 5000000, value: 78 },
        { msPer24: 5000000, value: 89 },
        { msPer24: 5000000, value: 90 }
      ]

      const cbgs = formatCbgs(data)

      expect(cbgs).toEqual([
        {
          firstQuartile: 4,
          id: '900000',
          max: 13,
          median: 7,
          min: 1,
          msFrom: 0,
          msTo: 1800000,
          msX: 900000,
          ninetiethQuantile: 12,
          tenthQuantile: 2,
          thirdQuartile: 10
        },
        {
          firstQuartile: 34,
          id: '4500000',
          max: 90,
          median: 56,
          min: 12,
          msFrom: 3600000,
          msTo: 5400000,
          msX: 4500000,
          ninetiethQuantile: 90,
          tenthQuantile: 12,
          thirdQuartile: 78
        }
      ])
    })
  })

  describe('computeMsThresholdForTimeOfDay', () => {
    it('should throw exception when given number is negative', () => {
      expect(() => computeMsThresholdForTimeOfDay(-1)).toThrow('numberOfMs < 0 or >= 86400000 is invalid!')
    })

    it('should throw exception when given number is superior to 86400000 (a full day in milliseconds)', () => {
      expect(() => computeMsThresholdForTimeOfDay(86400001)).toThrow('numberOfMs < 0 or >= 86400000 is invalid!')
    })
  })
})
