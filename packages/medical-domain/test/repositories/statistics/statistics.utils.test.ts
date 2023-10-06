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

import { buildHoursRangeMap, roundValue } from '../../../src/domains/repositories/statistics/statistics.utils'
import { HoursRange, Meal } from '../../../src'

describe('statistics.utils.test', () => {
  describe('roundValue', () => {
    it('should return a rounded value', () => {
      const value = 2.54858713
      expect(roundValue(value)).toEqual(3) // By default an integer
      expect(roundValue(value, 1)).toEqual(2.5)
      expect(roundValue(value, 2)).toEqual(2.55)
    })
  })

  describe('buildHoursRangeMap', () => {
    it('should return a map of hours range', () => {
      const map = buildHoursRangeMap<Meal[]>()
      const expectedResult: Map<HoursRange, Meal[]> = new Map([
        [HoursRange.MidnightToThree, []],
        [HoursRange.ThreeToSix, []],
        [HoursRange.SixToNine, []],
        [HoursRange.NineToTwelve, []],
        [HoursRange.TwelveToFifteen, []],
        [HoursRange.FifteenToEighteen, []],
        [HoursRange.EighteenToTwentyOne, []],
        [HoursRange.TwentyOneToMidnight, []]
      ])

      expect(map).toEqual(expectedResult)
    })
  })
})
