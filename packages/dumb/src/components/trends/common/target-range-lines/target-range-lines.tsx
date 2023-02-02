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

import React, { type FunctionComponent } from 'react'
import styles from './target-range-lines.css'
import { type ScaleFunction } from '../../../../models/scale-function.model'

interface TargetRangeLinesProps {
  upperBound: number
  lowerBound: number
  horizontalOffset: number
  xScale: ScaleFunction
  yScale: ScaleFunction
}

export const TargetRangeLines: FunctionComponent<TargetRangeLinesProps> = (props) => {
  const { upperBound, lowerBound, horizontalOffset, xScale, yScale } = props

  const x1 = xScale.range()[0] - horizontalOffset
  const x2 = xScale.range()[1] + horizontalOffset

  const highThresholdYPosition = yScale(upperBound)
  const lowThresholdYPosition = yScale(lowerBound)

  return (
    <g data-testid="trends-target-range-lines">
      <line
        className={styles.targetRangeLine}
        x1={x1}
        x2={x2}
        y1={highThresholdYPosition}
        y2={highThresholdYPosition}
      />
      <line
        className={styles.targetRangeLine}
        x1={x1}
        x2={x2}
        y1={lowThresholdYPosition}
        y2={lowThresholdYPosition}
      />
    </g>
  )
}
