/**
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

import { renderHook } from '@testing-library/react-hooks/dom'
import { useCBGMeanStat } from './cbg-mean-stat.hook'

describe('CBGMeanStat hook', () => {
  describe('computeValueBasedStyle', () => {
    it('should return correct leftDot when value is < 54', () => {
      const { result } = renderHook(() => useCBGMeanStat())
      const computedStyle = result.current.computeValueBasedStyle(20)
      expect(computedStyle.leftDot).toBe('0')
    })

    it('should return correct leftDot when value is > 250', () => {
      const { result } = renderHook(() => useCBGMeanStat())
      const computedStyle = result.current.computeValueBasedStyle(255)
      expect(computedStyle.leftDot).toBe('234px')
    })

    it('should return correct leftDot when value is > 54 and < 250', () => {
      const { result } = renderHook(() => useCBGMeanStat())
      const computedStyle = result.current.computeValueBasedStyle(128)
      expect(computedStyle.leftDot).toBe('88px')
    })
  })
})
