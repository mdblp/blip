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

import React, { FunctionComponent } from 'react'
import { formatClocktimeFromMsPer24, getSimpleHourFormatSpace } from '../../../../utils/datetime/datetime.util'
import { TRENDS_INTERVAL_ARRAY_WITH_INITIAL_VALUE_MS } from '../../../../utils/trends/trends.util'
import styles from '../../../../styles/typography.css'
import { ScaleFunction } from '../../../../models/scale-function.model'

interface XAxisLabelsProps {
  topMargin: number
  xScale: ScaleFunction
}

const DEFAULT_OFFSET = 5

export const XAxisLabels: FunctionComponent<XAxisLabelsProps> = (props) => {
  const { topMargin, xScale } = props

  const yPosition = topMargin - DEFAULT_OFFSET

  return (
    <g data-testid="trends-x-axis-labels">
      {TRENDS_INTERVAL_ARRAY_WITH_INITIAL_VALUE_MS.map((timeInMs: number) => {
        const displayTime = formatClocktimeFromMsPer24(timeInMs, getSimpleHourFormatSpace())
        return (
          <text
            className={`${styles.axisSize} ${styles.mediumContrastText} ${styles.svgStartAnchored}`}
            key={timeInMs}
            x={xScale(timeInMs) + DEFAULT_OFFSET}
            y={yPosition}
          >
            {displayTime}
          </text>
        )
      })}
    </g>
  )
}
