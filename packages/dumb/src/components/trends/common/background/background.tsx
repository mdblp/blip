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
import styles from './background.css'
import { range } from 'lodash'
import { ONE_HOUR_MS } from '../../../../utils/datetime/datetime.util'

interface BackgroundProps {
  margins: {
    bottom?: number
    left?: number
    right?: number
    top?: number
  }
  svgDimensions: {
    width: number
    height: number
  }
  xScale: (value: number) => number
}

const LINE_INTERVAL_HOURS = 3

export const Background: FunctionComponent<BackgroundProps> = (props) => {
  const { margins, svgDimensions, xScale } = props

  const getMarginValue = (margin?: number): number => {
    return margin ?? 0
  }

  const horizontalMargins = getMarginValue(margins.left) + getMarginValue(margins.right)
  const verticalMargins = getMarginValue(margins.top) + getMarginValue(margins.bottom)

  const width = svgDimensions.width - horizontalMargins
  const height = svgDimensions.height - verticalMargins

  const lineInterval = ONE_HOUR_MS * LINE_INTERVAL_HOURS
  const lineData = range(1, 8).map((value: number) => value * lineInterval)

  return (
    <g>
      <rect
        className={styles.background}
        x={margins.left}
        y={margins.top}
        width={width}
        height={height}
      />
      {lineData.map((value: number, index: number) => (
        <line
          className={styles.line}
          key={`line-${index}`}
          x1={xScale(value)}
          x2={xScale(value)}
          y1={margins.top}
          y2={svgDimensions.height - getMarginValue(margins.bottom)}
        />
      ))}
    </g>
  )
}
