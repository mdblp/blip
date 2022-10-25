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

import styles from './cbg-colors.css'

interface CBGStyle {
  backgroundColor: string
  color: string
  left: string
}

export const computeCBGStyle = (value: number): CBGStyle => {
  if (value < 54) {
    return { backgroundColor: styles['low-background'], color: styles['low-color'], left: '0' }
  } else if (value > 250) {
    return { color: styles['high-color'], backgroundColor: styles['high-background'], left: '234px' }
  } else {
    const widthInPx = 234 // Width of the cbg bar
    const cbgBarRange = 196 // Number of value included in the cbg bar range (from 54 to 250)
    const nbOfValuesNotIncludedInRange = 54 // The first 54 values are not included in the range and should be deduced
    return {
      backgroundColor: value < 180 ? styles['target-background'] : styles['high-background'],
      color: value < 180 ? styles['target-color'] : styles['high-color'],
      left: `${Math.round(((value - nbOfValuesNotIncludedInRange) * widthInPx) / cbgBarRange)}px`
    }
  }
}
