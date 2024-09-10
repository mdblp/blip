/*
 * Copyright (c) 2022-2024, Diabeloop
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
import { type BgClasses } from 'medical-domain'

interface CBGStyle {
  backgroundColor: string
  color: string
  left: string
}

interface BgClassesBarStyle {
  lowWidth: string
  targetWidth: string
}

const CBG_BAR_WIDTH_IN_PERCENTAGE = 100

export const computeCBGStyle = (value: number, bgClasses: BgClasses, usePrimaryColors = false): CBGStyle => {
  const veryLowValue = bgClasses.veryLow
  const lowValue = bgClasses.low
  const targetValue = bgClasses.target
  const highValue = bgClasses.high

  const highColor = usePrimaryColors ? styles['high-color-primary'] : styles['high-color']
  const lowColor = usePrimaryColors ? styles['low-color-primary'] : styles['low-color']

  if (value < veryLowValue) {
    return { color: lowColor, backgroundColor: styles['low-background'], left: '0' }
  }
  if (value > highValue) {
    return { color: highColor, backgroundColor: styles['high-background'], left: '100%' }
  }
  const cbgBarRange = highValue - veryLowValue // Number of value included in the cbg bar range (default is from 54 to 250)
  const left = `${Math.round(((value - veryLowValue) * CBG_BAR_WIDTH_IN_PERCENTAGE) / cbgBarRange)}%`
  if (value > targetValue) {
    return { color: highColor, backgroundColor: styles['high-background'], left }
  }
  if (value < lowValue) {
    return { color: lowColor, backgroundColor: styles['low-background'], left }
  }
  return { color: styles['target-color'], backgroundColor: styles['target-background'], left }
}

export const computeBgClassesBarStyle = (bgClasses: BgClasses): BgClassesBarStyle => {
  const veryLowValue = bgClasses.veryLow
  const lowValue = bgClasses.low
  const targetValue = bgClasses.target
  const highValue = bgClasses.high
  const cbgBarRange = highValue - veryLowValue
  const lowWidth = Math.round(((lowValue - veryLowValue) * CBG_BAR_WIDTH_IN_PERCENTAGE) / cbgBarRange)
  const targetWidth = Math.round(((targetValue - veryLowValue) * CBG_BAR_WIDTH_IN_PERCENTAGE) / cbgBarRange) - lowWidth
  return {
    lowWidth: `${lowWidth}%`,
    targetWidth: `${targetWidth}%`
  }
}
