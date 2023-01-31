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
import { XScale } from '../../../../models/x-scale.model'
import { TRENDS_INTERVAL_ARRAY_WITH_INITIAL_AND_FINAL_VALUES_MS } from '../../../../utils/trends/trends.util'
import styles from '../../../../styles/trends-common.css'

interface XAxisTicksProps {
  topMargin: number
  xScale: XScale
}

const DEFAULT_TICK_LENGTH = 15

export const XAxisTicks: FunctionComponent<XAxisTicksProps> = (props) => {
  const { topMargin, xScale } = props

  return (
    <g>
      {TRENDS_INTERVAL_ARRAY_WITH_INITIAL_AND_FINAL_VALUES_MS.map((timeInMs: number) => {
        const xPosition = xScale(timeInMs)
        return (
          <line
            className={styles.tick}
            key={timeInMs}
            x1={xPosition}
            x2={xPosition}
            y1={topMargin}
            y2={topMargin - DEFAULT_TICK_LENGTH}
          />
        )
      })}
    </g>
  )
}
