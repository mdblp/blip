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

import styles from './cbg-colors.css'
import { BgClasses } from '../../models/stats.model'

const CBG_BAR_WIDTH_IN_PX = 234

interface CBGStyle {
  backgroundColor: string
  color: string
  left: string
}

interface BgClassesBarStyle {
  lowWidth: string
  targetWidth: string
}

export const computeCBGStyle = (value: number, bgClasses: BgClasses): CBGStyle => {
  const veryLowValue = bgClasses.veryLow
  const lowValue = bgClasses.low
  const targetValue = bgClasses.target
  const highValue = bgClasses.high
  if (value < veryLowValue) {
    return { backgroundColor: styles['low-background'], color: styles['low-color'], left: '0' }
  }
  if (value > highValue) {
    return { color: styles['high-color'], backgroundColor: styles['high-background'], left: `${CBG_BAR_WIDTH_IN_PX}px` }
  }
  const cbgBarRange = highValue - veryLowValue // Number of value included in the cbg bar range (default is from 54 to 250)
  const left = `${Math.round(((value - veryLowValue) * CBG_BAR_WIDTH_IN_PX) / cbgBarRange)}px`
  if (value > targetValue) {
    return { color: styles['high-color'], backgroundColor: styles['high-background'], left }
  }
  if (value < lowValue) {
    return { color: styles['low-color'], backgroundColor: styles['low-background'], left }
  }
  return { color: styles['target-color'], backgroundColor: styles['target-background'], left }
}

export const computeBgClassesBarStyle = (bgClasses: BgClasses): BgClassesBarStyle => {
  const veryLowValue = bgClasses.veryLow
  const lowValue = bgClasses.low
  const targetValue = bgClasses.target
  const highValue = bgClasses.high
  const cbgBarRange = highValue - veryLowValue
  const lowWidth = Math.round(((lowValue - veryLowValue) * CBG_BAR_WIDTH_IN_PX) / cbgBarRange)
  const targetWidth = Math.round(((targetValue - veryLowValue) * CBG_BAR_WIDTH_IN_PX) / cbgBarRange) - lowWidth
  return {
    lowWidth: `${lowWidth}px`,
    targetWidth: `${targetWidth}px`
  }
}
