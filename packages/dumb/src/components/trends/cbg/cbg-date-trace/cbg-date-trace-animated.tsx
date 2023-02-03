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

import React, { FunctionComponent, useRef } from 'react'
import { BgBounds } from '../../../../models/blood-glucose.model'
import { ScaleFunction } from '../../../../models/scale-function.model'

interface DateTrace {
  id: string
  msPer24: number
  value: number
  epoch: number
}

interface CbgDateTraceAnimatedProps {
  userId: string
  animationDuration: number
  bgBounds: BgBounds
  cbgRadius: number
  data: DateTrace[]
  date: string
  focusDateTrace: (userId: string, dateTrace: DateTrace, position: { left: number, yPositions: { top: number, topMargin: number }}) => void
  onSelectDate: (epoch: number) => void
  topMargin: number
  unfocusDateTrace: (userId: string) => void
  xScale: ScaleFunction
  yScale: ScaleFunction
}

// const DEFAULT_ANIMATION_DURATION = 0.2
// const DEFAULT_CBG_RADIUS = 2.5

export const CbgDateTraceAnimated: FunctionComponent<CbgDateTraceAnimatedProps> = (props) => {
  const { userId, bgBounds, cbgRadius, data, date, focusDateTrace, onSelectDate, topMargin, unfocusDateTrace, xScale, yScale } = props

  const circleReferences = data.reduce((refs: { [dateTraceId: string]: React.RefObject<SVGCircleElement> }, dateTrace: DateTrace) => {
    // TODO fix warning if this is useful
    // eslint-disable-next-line react-hooks/rules-of-hooks
    refs[dateTrace.id] = useRef<SVGCircleElement>(null)
    return refs
  }, {})
  // const targets = data.map((dateTrace: DateTrace) => circleReferences[dateTrace.id])
  // TweenMax.staggerTo(
  //   targets, animationDuration, { opacity: 1 }, animationDuration / targets.length
  // )

  const handleClick = (dateTrace: DateTrace): void => {
    onSelectDate(dateTrace.epoch)
  }

  const handleMouseOut = (): void => {
    unfocusDateTrace(userId)
  }

  return (
    <g id={`cbgDateTrace-${date}`}>
      {data.map((dateTrace: DateTrace) => (
        <circle
          // className={styles[getBgClass(bgBounds, dateTrace.value, ClassificationType.FiveWay)]}
          cx={xScale(dateTrace.msPer24)}
          cy={yScale(dateTrace.value)}
          id={`cbgCircle-${dateTrace.id}`}
          data-testid="trends-cbg-circle"
          key={dateTrace.id}
          onClick={() => handleClick(dateTrace)}
          onMouseOver={() => {
            focusDateTrace(userId, dateTrace, {
              left: xScale(dateTrace.msPer24),
              yPositions: {
                top: yScale(dateTrace.value),
                topMargin
              }
            })
          }}
          onMouseOut={handleMouseOut}
          opacity={1}
          r={cbgRadius}
          ref={circleReferences[dateTrace.id]}
        />
      ))}
    </g>
  )
}
