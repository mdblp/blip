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

import { CbgRangeSegment } from '../cbg-range-segment.model'
import { RangeSegmentHeightKeys, RangeSegmentQuantile } from '../enums/range-segment.enum'

export const RANGE_SEGMENT_MAX: CbgRangeSegment = {
  classKey: 'rangeSegment',
  displayFlag: 'cbg100Enabled',
  height: RangeSegmentHeightKeys.Top10Height,
  heightKeys: [RangeSegmentQuantile.NinetiethQuantile, RangeSegmentQuantile.Max],
  key: 'top10',
  y: RangeSegmentQuantile.Max
}

export const RANGE_SEGMENT_TENTH: CbgRangeSegment = {
  classKey: 'rangeSegment',
  displayFlag: 'cbg100Enabled',
  height: RangeSegmentHeightKeys.Bottom10Height,
  heightKeys: [RangeSegmentQuantile.Min, RangeSegmentQuantile.TenthQuantile],
  key: 'bottom10',
  y: RangeSegmentQuantile.TenthQuantile
}

export const RANGE_SEGMENT_NINETIETH: CbgRangeSegment = {
  classKey: 'outerSegment',
  displayFlag: 'cbg80Enabled',
  height: RangeSegmentHeightKeys.Upper15Height,
  heightKeys: [RangeSegmentQuantile.ThirdQuartile, RangeSegmentQuantile.NinetiethQuantile],
  key: 'upper15',
  y: RangeSegmentQuantile.NinetiethQuantile
}

export const RANGE_SEGMENT_FIRST: CbgRangeSegment = {
  classKey: 'outerSegment',
  displayFlag: 'cbg80Enabled',
  height: RangeSegmentHeightKeys.Lower15Height,
  heightKeys: [RangeSegmentQuantile.TenthQuantile, RangeSegmentQuantile.FirstQuartile],
  key: 'lower15',
  y: RangeSegmentQuantile.FirstQuartile
}

export const RANGE_SEGMENT_THIRD: CbgRangeSegment = {
  classKey: 'innerQuartilesSegment',
  displayFlag: 'cbg50Enabled',
  height: RangeSegmentHeightKeys.InnerQuartilesHeight,
  heightKeys: [RangeSegmentQuantile.FirstQuartile, RangeSegmentQuantile.ThirdQuartile],
  key: 'innerQuartiles',
  y: RangeSegmentQuantile.ThirdQuartile
}
