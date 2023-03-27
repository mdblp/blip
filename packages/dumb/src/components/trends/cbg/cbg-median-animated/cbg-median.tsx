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

import styles from './cbg-median.css'
import { getBgClass } from '../../../../utils/blood-glucose/blood-glucose.util'
import { type BgBounds, ClassificationType } from 'medical-domain'
import { type ScaleFunction } from '../../../../models/scale-function.model'
import { useTrendsContext } from '../../../../provider/trends.provider'

interface CbgMedianAnimatedProps {
  bgBounds: BgBounds
  median: number
  msX: number
  sliceWidth: number
  xScale: ScaleFunction
  yScale: ScaleFunction
}

export const CbgMedian: FunctionComponent<CbgMedianAnimatedProps> = (props) => {
  const {
    bgBounds,
    median,
    msX,
    sliceWidth,
    xScale,
    yScale
  } = props

  const { showCbgDateTraces } = useTrendsContext()

  // default Y position is the center of the target range
  // i.e., 100 mg/dL if target range is 80-120 mg/dL
  const strokeWidth = sliceWidth / 8
  const medianWidth = sliceWidth - strokeWidth
  const width = medianWidth - strokeWidth
  const medianHeight = medianWidth * 0.75
  const x = xScale(msX) - medianWidth / 2 + strokeWidth / 2
  const bgClass = getBgClass(bgBounds, median, ClassificationType.FiveWay)

  const medianClasses = cx({
    [styles.median]: true,
    [styles[`${bgClass}FadeIn`]]: !showCbgDateTraces,
    [styles[`${bgClass}FadeOut`]]: showCbgDateTraces
  })

  return (
    <rect
      className={medianClasses}
      data-testid="cbgMedian-median"
      width={width}
      height={medianHeight}
      x={x}
      y={yScale(median) - medianHeight / 2}
      opacity={1}
    />
  )
}
