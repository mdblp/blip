/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { computeBgClassesBarStyle, computeCBGStyle } from './cbg-utils'
import { type BgClasses } from '../../../models/stats.model'

describe('CBGUtils', () => {
  const bgClasses: BgClasses = {
    high: 100,
    target: 80,
    low: 60,
    veryLow: 30
  }

  describe('computeCBGStyle', () => {
    it('should return correct left when value is inferior to very low bg', () => {
      const computedStyle = computeCBGStyle(20, bgClasses)
      expect(computedStyle.left).toBe(0)
    })

    it('should return correct left when value is superior to high bg', () => {
      const computedStyle = computeCBGStyle(110, bgClasses)
      expect(computedStyle.left).toBe(100)
    })

    it('should return correct left when value is superior to low bg and inferior to target bg', () => {
      const computedStyle = computeCBGStyle(70, bgClasses)
      expect(computedStyle.left).toBe(57)
    })

    it('should return correct left when value is superior to very low bg and inferior to low bg', () => {
      const computedStyle = computeCBGStyle(50, bgClasses)
      expect(computedStyle.left).toBe(29)
    })
  })

  describe('computeBgClassesBarStyle', () => {
    it('should return correct left when value is inferior to very low bg', () => {
      const computedStyle = computeBgClassesBarStyle(bgClasses)
      expect(computedStyle.lowWidth).toBe(43)
      expect(computedStyle.targetWidth).toBe(28)
    })
  })
})
