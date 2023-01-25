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

export enum RangeSegmentQuantile {
  ThirdQuartile = 'thirdQuartile',
  FirstQuartile = 'firstQuartile',
  TenthQuantile = 'tenthQuantile',
  NinetiethQuantile = 'ninetiethQuantile',
  Max = 'max',
  Min = 'min'
}

export enum RangeSegmentHeightKeys {
  Top10Height = 'top10Height',
  Bottom10Height = 'bottom10Height',
  Upper15Height = 'upper15Height',
  Lower15Height = 'lower15Height',
  InnerQuartilesHeight = 'innerQuartilesHeight'
}

export enum RangeSegmentKey {
  Top10 = 'top10',
  Bottom10 = 'bottom10',
  Upper15 = 'upper15',
  Lower15 = 'lower15',
  InnerQuartiles = 'innerQuartiles'
}

export enum RangeSegmentClassKey {
  RangeSegment = 'rangeSegment',
  OuterSegment = 'outerSegment',
  InnerQuartilesSegment = 'innerQuartilesSegment'
}
