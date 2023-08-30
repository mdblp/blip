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

import { computeMsThresholdForTimeOfDay, computeQuantile, formatCbgs } from './cbg-slices-container.util'
import { type CbgSlicesContainerData } from '../../../../models/cbg-slices-container-data.model'

describe('CbgSlicesContainerUtil', () => {
  describe('formatCbgs', () => {
    it('should return correct stats', () => {
      const data: CbgSlicesContainerData[] = [
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
          ninetiethQuantile: 11.8,
          tenthQuantile: 2.2,
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
          ninetiethQuantile: 89.2,
          tenthQuantile: 20.8,
          thirdQuartile: 78
        }
      ])
    })
  })

  describe('computeMsThresholdForTimeOfDay', () => {
    it('should throw exception when given number is negative', () => {
      expect(() => computeMsThresholdForTimeOfDay(-1)).toThrow('numberOfMs < 0 or >= 86400000 is invalid')
    })

    it('should throw exception when given number is superior to 86400000 (a full day in milliseconds)', () => {
      expect(() => computeMsThresholdForTimeOfDay(86400001)).toThrow('numberOfMs < 0 or >= 86400000 is invalid')
    })
  })

  describe('computeQuantile used for median', () => {
    it('should return 0 when empty array', () => {
      const median = computeQuantile([], 0.5)
      expect(median).toBeUndefined()
    })

    it('should return correct result when odd array', () => {
      const median = computeQuantile([12], 0.5)
      expect(median).toBe(12)
    })

    it('should return correct result when even array', () => {
      const median = computeQuantile([2, 2, 4, 4], 0.5)
      expect(median).toBe(3)
    })
  })

  describe('computeQuantile used for first quantile', () => {
    it('should return correct result when odd array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20], 0.1)
      expect(median).toBe(2)
    })

    it('should return correct result when even array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20, 25], 0.1)
      expect(median).toBe(2.5)
    })
  })

  describe('computeQuantile used for first quartile', () => {
    it('should return correct result when odd array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20], 0.25)
      expect(median).toBe(5)
    })

    it('should return correct result when even array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20, 25], 0.25)
      expect(median).toBe(6.25)
    })
  })

  describe('computeQuantile used for third quartile', () => {
    it('should return correct result when odd array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20], 0.75)
      expect(median).toBe(15)
    })

    it('should return correct result when even array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20, 25], 0.75)
      expect(median).toBe(18.75)
    })
  })

  describe('computeQuantile used for ninetiethh quartile', () => {
    it('should return correct result when odd array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20], 0.9)
      expect(median).toBe(18)
    })

    it('should return correct result when even array', () => {
      const median = computeQuantile([0, 5, 10, 15, 20, 25], 0.9)
      expect(median).toBe(22.5)
    })
  })
})
