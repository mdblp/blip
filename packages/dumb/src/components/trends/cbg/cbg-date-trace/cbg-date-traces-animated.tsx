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
import { type ScaleFunction } from '../../../../models/scale-function.model'
import { type BgBounds, ClassificationType } from 'medical-domain'
import { getBgClass } from '../../../../utils/blood-glucose/blood-glucose.util'
import styles from './cbg-date-traces-animated.css'
import { type CbgDateTrace } from '../../../../models/cbg-date-trace.model'
import { CBG_CIRCLE_PREFIX_ID } from '../../../../models/constants/cbg.constants'
import { useTrendsContext } from '../../../../provider/trends.provider'

interface CbgDateTracesAnimatedProps {
  bgBounds: BgBounds
  data: CbgDateTrace[]
  onSelectDate: (epoch: number) => void
  topMargin: number
  xScale: ScaleFunction
  yScale: ScaleFunction
}

const CBG_RADIUS = 2.5

export const CbgDateTracesAnimated: FunctionComponent<CbgDateTracesAnimatedProps> = (props) => {
  const { bgBounds, data, onSelectDate, topMargin, xScale, yScale } = props
  const { focusCbgDateTrace, unfocusCbgDateTrace } = useTrendsContext()

  const handleClick = (dateTrace: CbgDateTrace): void => {
    if (dateTrace.epoch) {
      onSelectDate(dateTrace.epoch)
    }
  }

  const handleMouseOut = (): void => {
    unfocusCbgDateTrace()
  }

  const handleMouseOver = (dateTrace: CbgDateTrace): void => {
    focusCbgDateTrace(dateTrace, {
      left: xScale(dateTrace.msPer24),
      yPositions: {
        top: yScale(dateTrace.value),
        topMargin
      }
    })
  }

  return (
    <g>
      {data.map((dateTrace: CbgDateTrace, index) => (
        <circle
          className={styles[getBgClass(bgBounds, dateTrace.value, ClassificationType.FiveWay)]}
          cx={xScale(dateTrace.msPer24)}
          cy={yScale(dateTrace.value)}
          id={`${CBG_CIRCLE_PREFIX_ID}-${dateTrace.id}`}
          data-testid="trends-cbg-circle"
          key={index}
          onClick={() => {
            handleClick(dateTrace)
          }}
          onMouseOver={() => {
            handleMouseOver(dateTrace)
          }}
          onMouseOut={handleMouseOut}
          opacity={1}
          r={CBG_RADIUS}
        />
      ))}
    </g>
  )
}
