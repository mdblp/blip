/*
 * Copyright (c) 2022, Diabeloop
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

import { getOutOfRangeAnnotationMessages } from './annotations.util'

jest.mock('i18next', () => ({
  t: (value: string) => value
}))

const veryHigh = [
  {
    code: 'bg/out-of-range',
    value: 'high',
    threshold: 600
  }
]

const veryLow = [
  {
    code: 'bg/out-of-range',
    value: 'low',
    threshold: 40
  }
]

describe('AnnotationsUtil', () => {
  describe('getOutOfRangeAnnotationMessages', () => {
    it('should return empty array for non-annotated and in-range datum', () => {
      expect(getOutOfRangeAnnotationMessages(undefined)).toEqual([])
    })

    it('should return annotation messages for annotated datum', () => {
      expect(getOutOfRangeAnnotationMessages(veryHigh)[0].message.value).toEqual(
        '* This BG value was higher than your device could record. Your actual BG value is higher than it appears here.'
      )
      expect(getOutOfRangeAnnotationMessages(veryLow)[0].message.value).toEqual(
        '* This BG value was lower than your device could record. Your actual BG value is lower than it appears here.'
      )
    })
  })
})
