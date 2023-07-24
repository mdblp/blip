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

import _ from 'lodash'
import { type CbgSlicesContainerData } from '../../../../models/cbg-slices-container-data.model'
import { THIRTY_MINS, TWENTY_FOUR_HRS } from '../../../../utils/datetime/datetime.util'
import { type CbgSlice } from '../../../../models/cbg-slice.model'
import { RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'

export const computeMsThresholdForTimeOfDay = (numberOfMs: number): number => {
  if (numberOfMs < 0 || numberOfMs >= TWENTY_FOUR_HRS) {
    throw new Error('numberOfMs < 0 or >= 86400000 is invalid')
  }
  return Math.floor(numberOfMs / THIRTY_MINS) * THIRTY_MINS + (THIRTY_MINS / 2)
}

export const computeQuantile = (data: number[], quantile: number): number => {
  const indexNotRounded = (data.length - 1) * quantile
  const baseRoundedToFloor = Math.floor(indexNotRounded)
  const indexesDiff = indexNotRounded - baseRoundedToFloor
  if (data[baseRoundedToFloor + 1]) {
    return data[baseRoundedToFloor] + indexesDiff * (data[baseRoundedToFloor + 1] - data[baseRoundedToFloor])
  } else {
    return data[baseRoundedToFloor]
  }
}

const computeCbgStatsForGivenTimeOfDay = (numberOfMs: number, data: number[]): CbgSlice => {
  const sorted = data.sort((a, b) => a - b)
  const sortedDataLength = sorted.length
  return {
    id: numberOfMs.toString(),
    [RangeSegmentSlice.Min]: sorted[0],
    [RangeSegmentSlice.TenthQuantile]: computeQuantile(sorted, 0.1),
    [RangeSegmentSlice.FirstQuartile]: computeQuantile(sorted, 0.25),
    [RangeSegmentSlice.Median]: computeQuantile(sorted, 0.5),
    [RangeSegmentSlice.ThirdQuartile]: computeQuantile(sorted, 0.75),
    [RangeSegmentSlice.NinetiethQuantile]: computeQuantile(sorted, 0.9),
    [RangeSegmentSlice.Max]: sorted[sortedDataLength - 1],
    msX: numberOfMs,
    msFrom: numberOfMs - (THIRTY_MINS / 2),
    msTo: numberOfMs + (THIRTY_MINS / 2)
  }
}

export const formatCbgs = (cbgData: CbgSlicesContainerData[]): CbgSlice[] => {
  const cbgDataSorted = _.groupBy(cbgData, (cbgSliceContainerData) => {
    return computeMsThresholdForTimeOfDay(cbgSliceContainerData.msPer24)
  })

  return Object.entries(cbgDataSorted).map(([numberOfMs, cbgData]) => {
    const values = cbgData.map(cbgSliceContainerData => (cbgSliceContainerData.value))
    return computeCbgStatsForGivenTimeOfDay(Number.parseInt(numberOfMs, 10), values)
  })
}
