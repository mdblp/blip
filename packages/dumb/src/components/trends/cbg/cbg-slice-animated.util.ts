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

import {
  RANGE_SEGMENT_FIRST,
  RANGE_SEGMENT_MAX,
  RANGE_SEGMENT_NINETIETH,
  RANGE_SEGMENT_TENTH,
  RANGE_SEGMENT_THIRD
} from '../../../models/constants/cbg.constants'
import { TrendsDisplayFlags } from '../../../models/trends-display-flags.model'
import { CbgRangeSegment } from '../../../models/cbg-range-segment.model'

export const getRangeSegments = (displayFlags: TrendsDisplayFlags): CbgRangeSegment[] => {
  const segments = []
  if (displayFlags.cbg100Enabled) {
    segments.push(RANGE_SEGMENT_MAX)
    segments.push(RANGE_SEGMENT_TENTH)
  }
  if (displayFlags.cbg80Enabled) {
    segments.push(RANGE_SEGMENT_NINETIETH)
    segments.push(RANGE_SEGMENT_FIRST)
  }
  if (displayFlags.cbg50Enabled) {
    segments.push(RANGE_SEGMENT_THIRD)
  }
  return segments
}

export const getCbgRangeSegment = (segments: CbgRangeSegment[], key: string): CbgRangeSegment => {
  const segment = segments.find(segment => segment.key === key)
  if (!segment) {
    throw Error(`Could not find segment with key ${key}`)
  }
  return segment
}
