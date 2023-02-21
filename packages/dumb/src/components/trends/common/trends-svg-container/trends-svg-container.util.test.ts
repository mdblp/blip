/*
 * Copyright (c) 2017-2023, Diabeloop
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

import { getCbgsIntersectingWithCbgSliceSegment } from './trends-svg-container.util'
import { type CbgDateTrace } from '../../../../models/cbg-date-trace.model'
import { RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'
import { type CbgSlice } from '../../../../models/cbg-slice.model'

const MIN_CBG_VALID_VALUE = 40
const MAX_CBG_VALID_VALUE = 60
const MIN_MS_VALUE = 8
const MAX_MS_VALUE = 200
const FEBRUARY_13 = '2023-02-13'
const FEBRUARY_14 = '2023-02-14'
const FEBRUARY_15 = '2023-02-15'

describe('TrendsSvgContainer util', () => {
  describe('getCbgsIntersectingWithCbgSliceSegment', () => {
    it('should return correct array', () => {
      const intersectingCbg1 = {
        id: 'cbgId',
        msPer24: MAX_MS_VALUE,
        value: MIN_CBG_VALID_VALUE,
        localDate: FEBRUARY_13
      }
      const intersectingCbg2 = {
        id: 'cbgId',
        msPer24: MIN_MS_VALUE,
        value: MAX_CBG_VALID_VALUE,
        localDate: FEBRUARY_15
      }
      const cbgsTrace13OfFebruary: CbgDateTrace[] = [
        intersectingCbg1,
        {
          id: 'cbgId',
          msPer24: 10,
          value: 20,
          localDate: FEBRUARY_13
        }]
      const cbgsTrace14OfFebruary: CbgDateTrace[] = [{
        id: 'cbgId',
        msPer24: 100,
        value: 70,
        localDate: FEBRUARY_14
      }]
      const cbgsTrace15OfFebruary: CbgDateTrace[] = [
        {
          id: 'cbgId',
          msPer24: 5,
          value: 20,
          localDate: FEBRUARY_15
        },
        intersectingCbg2
      ]
      const cbgDateTraces: CbgDateTrace[] = [
        ...cbgsTrace13OfFebruary,
        ...cbgsTrace14OfFebruary,
        ...cbgsTrace15OfFebruary
      ]

      const focusedSliceData: CbgSlice = {
        id: 'id',
        firstQuartile: MIN_CBG_VALID_VALUE,
        max: 2,
        median: 3,
        min: 4,
        ninetiethQuantile: 5,
        tenthQuantile: 6,
        thirdQuartile: MAX_CBG_VALID_VALUE,
        msFrom: MIN_MS_VALUE,
        msTo: MAX_MS_VALUE + 1,
        msX: 1
      }

      const focusedSliceKeys: RangeSegmentSlice[] = [RangeSegmentSlice.FirstQuartile, RangeSegmentSlice.ThirdQuartile]

      const result = getCbgsIntersectingWithCbgSliceSegment(cbgDateTraces, focusedSliceData, focusedSliceKeys)

      expect(result).toEqual([cbgsTrace13OfFebruary, cbgsTrace15OfFebruary])
    })
  })
})
