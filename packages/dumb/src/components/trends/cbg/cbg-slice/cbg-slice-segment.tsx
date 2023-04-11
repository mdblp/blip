/*
 * Copyright (c) 2017-2023, Diabeloop
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

import cx from 'classnames'
import React, { type FunctionComponent } from 'react'

import styles from './cbg-slice-animated.css'
import { getRangeSegments } from './cbg-slice-animated.util'
import { type ScaleFunction } from '../../../../models/scale-function.model'
import { useTrendsContext } from '../../../../provider/trends.provider'
import { type CbgSlice } from '../../../../models/cbg-slice.model'
import { CBG_CIRCLE_PREFIX_ID } from '../../../../models/constants/cbg.constants'
import { type CbgPositionData, type CbgSliceYPositions } from '../../../../models/cbg-position-data.model'
import { type RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'

interface CbgSliceAnimatedProps {
  datum: CbgSlice
  sliceWidth: number
  tooltipLeftThreshold: number
  topMargin: number
  xScale: ScaleFunction
  yScale: ScaleFunction
}

export const CbgSliceSegment: FunctionComponent<CbgSliceAnimatedProps> = (props) => {
  const {
    datum,
    sliceWidth,
    tooltipLeftThreshold,
    topMargin,
    xScale,
    yScale
  } = props

  const { displayFlags, showCbgDateTraces, focusCbgSlice, unfocusCbgSlice } = useTrendsContext()

  const handleMouseOut = (event: { relatedTarget: EventTarget | null | { id: string } }): void => {
    const relatedTarget = event.relatedTarget as { id: string }
    // Do not unfocus the slice if the user just rolled over a CBG inside it
    if (relatedTarget?.id && relatedTarget.id.search(CBG_CIRCLE_PREFIX_ID) !== -1) {
      return
    }
    unfocusCbgSlice()
  }

  const handleMouseOver = (positionData: CbgPositionData<CbgSliceYPositions>, heightKeys: RangeSegmentSlice[]): void => {
    focusCbgSlice(
      datum,
      positionData,
      heightKeys
    )
  }

  const strokeWidth = sliceWidth / 8
  const binLeftX = xScale(datum.msX) - sliceWidth / 2 + strokeWidth / 2
  const width = sliceWidth - strokeWidth

  const rangeSegments = getRangeSegments(displayFlags)

  const yPositions = {
    firstQuartile: yScale(datum.firstQuartile),
    max: yScale(datum.max),
    median: yScale(datum.median),
    min: yScale(datum.min),
    ninetiethQuantile: yScale(datum.ninetiethQuantile),
    tenthQuantile: yScale(datum.tenthQuantile),
    thirdQuartile: yScale(datum.thirdQuartile),
    topMargin
  }

  return (
    <g id={`cbgSlice-${datum.id}`}>
      {rangeSegments.map(segment => {
        const key = segment.key
        const classes = cx({
          [styles.segment]: true,
          [styles[segment.classKey]]: !showCbgDateTraces,
          [styles[`${segment.classKey}Faded`]]: showCbgDateTraces
        })
        const positionData = {
          left: xScale(datum.msX),
          tooltipLeft: datum.msX > tooltipLeftThreshold,
          yPositions
        }
        const height = yScale(datum[segment.heightKeys[0]]) - yScale(datum[segment.heightKeys[1]])
        return (
          <rect
            className={classes}
            data-testid={`cbg-slice-rectangle-${key}`}
            key={key}
            width={width}
            height={height}
            x={binLeftX}
            y={yScale(datum[segment.y])}
            onMouseOver={() => {
              handleMouseOver(positionData, segment.heightKeys)
            }}
            onMouseOut={handleMouseOut}
          />
        )
      })}
    </g>
  )
}
