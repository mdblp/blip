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

import { type CbgRangeSegment } from '../cbg-range-segment.model'
import {
  RangeSegmentClassKey,
  RangeSegmentHeightKeys,
  RangeSegmentKey,
  SegmentMinMax,
  SegmentQuantile,
  SegmentQuartile
} from '../enums/range-segment.enum'
import { DisplayFlag } from '../enums/display-flag.enum'

export const RANGE_SEGMENT_MAX: CbgRangeSegment = {
  classKey: RangeSegmentClassKey.RangeSegment,
  displayFlag: DisplayFlag.Cbg100Enabled,
  height: RangeSegmentHeightKeys.Top10Height,
  heightKeys: [SegmentQuantile.NinetiethQuantile, SegmentMinMax.Max],
  key: RangeSegmentKey.Top10,
  y: SegmentMinMax.Max
}

export const RANGE_SEGMENT_TENTH: CbgRangeSegment = {
  classKey: RangeSegmentClassKey.RangeSegment,
  displayFlag: DisplayFlag.Cbg100Enabled,
  height: RangeSegmentHeightKeys.Bottom10Height,
  heightKeys: [SegmentMinMax.Min, SegmentQuantile.TenthQuantile],
  key: RangeSegmentKey.Bottom10,
  y: SegmentQuantile.TenthQuantile
}

export const RANGE_SEGMENT_NINETIETH: CbgRangeSegment = {
  classKey: RangeSegmentClassKey.OuterSegment,
  displayFlag: DisplayFlag.Cbg80Enabled,
  height: RangeSegmentHeightKeys.Upper15Height,
  heightKeys: [SegmentQuartile.ThirdQuartile, SegmentQuantile.NinetiethQuantile],
  key: RangeSegmentKey.Upper15,
  y: SegmentQuantile.NinetiethQuantile
}

export const RANGE_SEGMENT_FIRST: CbgRangeSegment = {
  classKey: RangeSegmentClassKey.OuterSegment,
  displayFlag: DisplayFlag.Cbg80Enabled,
  height: RangeSegmentHeightKeys.Lower15Height,
  heightKeys: [SegmentQuantile.TenthQuantile, SegmentQuartile.FirstQuartile],
  key: RangeSegmentKey.Lower15,
  y: SegmentQuartile.FirstQuartile
}

export const RANGE_SEGMENT_THIRD: CbgRangeSegment = {
  classKey: RangeSegmentClassKey.InnerQuartilesSegment,
  displayFlag: DisplayFlag.Cbg50Enabled,
  height: RangeSegmentHeightKeys.InnerQuartilesHeight,
  heightKeys: [SegmentQuartile.FirstQuartile, SegmentQuartile.ThirdQuartile],
  key: RangeSegmentKey.InnerQuartiles,
  y: SegmentQuartile.ThirdQuartile
}
