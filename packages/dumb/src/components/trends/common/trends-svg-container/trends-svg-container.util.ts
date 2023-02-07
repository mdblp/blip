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

import { type CbgDateTrace } from '../../../../models/cbg-date-trace.model'
import { type FocusedSlice } from './trends-svg-container'
import { type RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'

const isCbgDateTraceIntersectingWithFocusedSlice = (cbgDateTrace: CbgDateTrace, focusedSlice: FocusedSlice, focusedSliceKeys: RangeSegmentSlice[]): boolean => {
  const data = focusedSlice.data
  return cbgDateTrace.msPer24 >= data.msFrom && cbgDateTrace.msPer24 < data.msTo && (cbgDateTrace.value >= data[focusedSliceKeys[0]] && cbgDateTrace.value <= data[focusedSliceKeys[1]])
}

export const findCbgsIntersectingWithCbgSliceSegment = (cbgDateTraces: CbgDateTrace[], focusedSlice: FocusedSlice, focusedSliceKeys: RangeSegmentSlice[]): CbgDateTrace[][] => {
  const datesOfCbgIntersectingWithFocusedSlice = cbgDateTraces.reduce((dates: string[], cbgDateTrace) => {
    const date = cbgDateTrace.localDate
    const isDateAlreadyIncluded = !date || dates.includes(date)
    if (isDateAlreadyIncluded) {
      return dates
    }
    if (isCbgDateTraceIntersectingWithFocusedSlice(cbgDateTrace, focusedSlice, focusedSliceKeys)) {
      dates.push(date)
    }
    return dates
  }, [])

  return datesOfCbgIntersectingWithFocusedSlice.reduce((cbgsIntersectingWithFocusedSlice: CbgDateTrace[][], currentDate) => {
    const cbgsOfGivenDate = cbgDateTraces.filter(cbgDateTrace => cbgDateTrace.localDate === currentDate)
    cbgsIntersectingWithFocusedSlice.push(cbgsOfGivenDate)
    return cbgsIntersectingWithFocusedSlice
  }, new Array<CbgDateTrace[]>())
}
