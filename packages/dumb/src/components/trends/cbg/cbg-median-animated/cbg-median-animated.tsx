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
import React, { FunctionComponent } from 'react'
import { spring, TransitionMotion } from '@serprex/react-motion'

import styles from './cbg-median-animated.css'
import { getBgClass } from '../../../../utils/blood-glucose/blood-glucose.util'
import { BgBounds, ClassificationType } from '../../../../models/blood-glucose.model'
import { springConfig } from '../../../../models/constants/animation.constants'
import { CbgMedianTransitionMotionInterpolate } from '../../../../models/animation.model'
import { XScale } from '../../../../models/x-scale.model'

interface CbgMedianAnimatedProps {
  bgBounds: BgBounds
  median: number
  msX: number
  showingCbgDateTraces: boolean
  sliceWidth: number
  xScale: XScale
  yScale: Function
}

const DEFAULT_MEDIAN = 16
const TRANSITION_STYLES_KEY = 'median'

export const CbgMedianAnimated: FunctionComponent<CbgMedianAnimatedProps> = (props) => {
  const {
    bgBounds,
    median,
    msX,
    showingCbgDateTraces,
    sliceWidth,
    xScale,
    yScale
  } = props

  // default Y position is the center of the target range
  // i.e., 100 mg/dL if target range is 80-120 mg/dL
  const strokeWidth = sliceWidth / 8
  const medianWidth = sliceWidth - strokeWidth
  const width = medianWidth - strokeWidth
  const medianHeight = medianWidth * 0.75
  const x = xScale(msX) - medianWidth / 2 + strokeWidth / 2
  const defaultY = yScale(bgBounds.targetUpperBound - (bgBounds.targetUpperBound - bgBounds.targetLowerBound) / 2)
  const bgClass = getBgClass(bgBounds, median, ClassificationType.FiveWay)

  const defaultStyles = [{
    key: TRANSITION_STYLES_KEY,
    style: {
      height: 0,
      median: DEFAULT_MEDIAN,
      opacity: 0
    }
  }]

  const transitionMotionStyles = [{
    key: TRANSITION_STYLES_KEY,
    style: {
      height: spring(medianHeight, springConfig),
      median: spring(yScale(median) - medianHeight / 2, springConfig),
      opacity: spring(1.0, springConfig)
    }
  }]

  const medianClasses = cx({
    [styles.median]: true,
    [styles[`${bgClass}FadeIn`]]: !showingCbgDateTraces,
    [styles[`${bgClass}FadeOut`]]: showingCbgDateTraces
  })

  return (
    <TransitionMotion
      defaultY={defaultY}
      defaultStyles={defaultStyles}
      styles={transitionMotionStyles}
    >
      {(interpolatedStyles: CbgMedianTransitionMotionInterpolate[]) => {
        if (interpolatedStyles.length === 0) {
          return null
        }
        const interpolatedStyle = interpolatedStyles[0]
        return <rect
          className={medianClasses}
          data-testid={`cbgMedian-${interpolatedStyle.key}`}
          width={width}
          height={interpolatedStyle.style.height}
          x={x}
          y={interpolatedStyle.style.median}
          opacity={interpolatedStyle.style.opacity}
        />
      }}
    </TransitionMotion>
  )
}
