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
import { spring, TransitionMotion } from '@serprex/react-motion'

import { springConfig } from '../../../../models/constants/animation.constants'

import styles from './cbg-slice-animated.css'
import { type CbgSliceTransitionMotionInterpolate } from '../../../../models/animation.model'
import CbgSliceSegment from './cbg-slice-segment'
import { type TrendsDisplayFlags } from '../../../../models/trends-display-flags.model'
import { getRangeSegments } from './cbg-slice-animated.util'
import { type ScaleFunction } from '../../../../models/scale-function.model'
import { type TrendsCalculatedCbgStats } from '../../../../models/trends-calculated-cbg-stats.model'

interface CbgSliceAnimatedProps {
  datum: TrendsCalculatedCbgStats
  displayFlags: TrendsDisplayFlags
  showingCbgDateTraces: boolean
  sliceWidth: number
  tooltipLeftThreshold: number
  topMargin: number
  xScale: ScaleFunction
  yScale: ScaleFunction
}

const DEFAULT_SEGMENT_Y = 16

export const CbgSliceAnimated: FunctionComponent<CbgSliceAnimatedProps> = (props) => {
  const {
    datum,
    displayFlags,
    showingCbgDateTraces,
    sliceWidth,
    tooltipLeftThreshold,
    topMargin,
    xScale,
    yScale
  } = props

  const strokeWidth = sliceWidth / 8
  const binLeftX = xScale(datum.msX) - sliceWidth / 2 + strokeWidth / 2
  const width = sliceWidth - strokeWidth

  const rangeSegments = getRangeSegments(displayFlags)

  const defaultStyles = rangeSegments.map(segment => ({
    key: segment.key,
    style: {
      [segment.y]: DEFAULT_SEGMENT_Y,
      [segment.height]: 0,
      opacity: 0
    }
  }))

  const transitionMotionStyle = rangeSegments.map(segment => ({
    key: segment.key,
    style: {
      [segment.y]: spring(yScale(datum[segment.y]), springConfig),
      [segment.height]: spring(
        yScale(datum[segment.heightKeys[0]]) - yScale(datum[segment.heightKeys[1]]),
        springConfig
      ),
      opacity: spring(1.0, springConfig)
    }
  }))

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
    <TransitionMotion
      defaultStyles={defaultStyles}
      styles={transitionMotionStyle}
    >
      {(interpolatedStyles: CbgSliceTransitionMotionInterpolate[]) => {
        if (interpolatedStyles.length === 0) {
          return null
        }
        return (
          <g id={`cbgSlice-${datum.id}`}>
            {interpolatedStyles.map(interpolated => {
              const key = interpolated.key
              const segment = rangeSegments.find(segment => segment.key === key)
              if (!segment) {
                return null
              }
              const classes = cx({
                [styles.segment]: true,
                [styles[segment.classKey]]: !showingCbgDateTraces,
                [styles[`${segment.classKey}Faded`]]: showingCbgDateTraces
              })
              return (
                <CbgSliceSegment
                  classes={classes}
                  datum={datum}
                  id={key}
                  key={key}
                  positionData={{
                    left: xScale(datum.msX),
                    tooltipLeft: datum.msX > tooltipLeftThreshold,
                    yPositions
                  }}
                  segment={segment}
                  style={interpolated.style}
                  width={width}
                  x={binLeftX}
                />
              )
            })}
          </g>
        )
      }}
    </TransitionMotion>
  )
}
