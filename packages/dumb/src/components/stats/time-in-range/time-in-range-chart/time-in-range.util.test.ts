/*
 * Copyright (c) 2026, Diabeloop
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

import { type CBGPercentageData, StatLevel } from '../../../../models/stats.model'
import { getTimeInRangePercentages } from './time-in-range.util'

const buildData = (id: StatLevel, value: number): CBGPercentageData => ({ id, title: id, value })

describe('Time in range util', () => {
  describe('getTimeInRangePercentages', () => {
    it('should return an empty array when the input is empty', () => {
      expect(getTimeInRangePercentages([], 100)).toEqual([])
    })

    it('should return 0% for all items when total is 0', () => {
      const data = [
        buildData(StatLevel.VeryHigh, 0),
        buildData(StatLevel.Target, 0),
        buildData(StatLevel.VeryLow, 0)
      ]

      expect(getTimeInRangePercentages(data, 0)).toEqual([
        { id: StatLevel.VeryHigh, percentage: 0 },
        { id: StatLevel.Target, percentage: 0 },
        { id: StatLevel.VeryLow, percentage: 0 }
      ])
    })

    it('should return exact integer percentages when values divide evenly', () => {
      const data = [
        buildData(StatLevel.VeryHigh, 50),
        buildData(StatLevel.Target, 30),
        buildData(StatLevel.VeryLow, 20)
      ]

      expect(getTimeInRangePercentages(data, 100)).toEqual([
        { id: StatLevel.VeryHigh, percentage: 50 },
        { id: StatLevel.Target, percentage: 30 },
        { id: StatLevel.VeryLow, percentage: 20 }
      ])
    })

    it('should return 100% for a single item that equals the total', () => {
      const data = [buildData(StatLevel.Target, 288)]

      expect(getTimeInRangePercentages(data, 288)).toEqual([
        { id: StatLevel.Target, percentage: 100 }
      ])
    })

    it('should ensure percentages always sum to 100 using smart rounding', () => {
      // 3 equal thirds: each raw = 33.333%
      // floors [33, 33, 33] sum to 99 → 1 bump needed
      const data = [
        buildData(StatLevel.VeryHigh, 1),
        buildData(StatLevel.High, 1),
        buildData(StatLevel.Target, 1)
      ]
      const result = getTimeInRangePercentages(data, 3)
      const sum = result.reduce((acc, item) => acc + item.percentage, 0)

      expect(sum).toBe(100)
    })

    it('should bump the item with the largest remainder when one bump is needed', () => {
      // values [1, 2, 3], total 6: raw = [16.67%, 33.33%, 50%]
      // floors [16, 33, 50] sum to 99 → 1 bump needed
      // remainders: VeryHigh=0.67 > High=0.33 > Target=0.00 → VeryHigh is bumped
      const data = [
        buildData(StatLevel.VeryHigh, 1),
        buildData(StatLevel.High, 2),
        buildData(StatLevel.Target, 3)
      ]
      expect(getTimeInRangePercentages(data, 6)).toEqual([
        { id: StatLevel.VeryHigh, percentage: 17 },
        { id: StatLevel.High, percentage: 33 },
        { id: StatLevel.Target, percentage: 50 }
      ])
    })

    it('should bump the items with the largest remainders when multiple bumps are needed', () => {
      // values [2, 1, 1, 1, 1], total 6: raw = [33.33%, 16.67%, 16.67%, 16.67%, 16.67%]
      // floors [33, 16, 16, 16, 16] sum to 97 → 3 bumps needed
      // remainders: High/Target/Low/VeryLow=0.67 > VeryHigh=0.33
      // top 3 by remainder (stable sort): High, Target, Low are bumped
      const data = [
        buildData(StatLevel.VeryHigh, 2),
        buildData(StatLevel.High, 1),
        buildData(StatLevel.Target, 1),
        buildData(StatLevel.Low, 1),
        buildData(StatLevel.VeryLow, 1)
      ]
      expect(getTimeInRangePercentages(data, 6)).toEqual([
        { id: StatLevel.VeryHigh, percentage: 33 },
        { id: StatLevel.High, percentage: 17 },
        { id: StatLevel.Target, percentage: 17 },
        { id: StatLevel.Low, percentage: 17 },
        { id: StatLevel.VeryLow, percentage: 16 }
      ])
    })

    it('should preserve the StatLevel id for each item in the output', () => {
      const data = [
        buildData(StatLevel.TightRange, 40),
        buildData(StatLevel.TimeInRangeDt1, 60)
      ]
      const result = getTimeInRangePercentages(data, 100)
      expect(result[0].id).toBe(StatLevel.TightRange)
      expect(result[1].id).toBe(StatLevel.TimeInRangeDt1)
    })
  })
})
