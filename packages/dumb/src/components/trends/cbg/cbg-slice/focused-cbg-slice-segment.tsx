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

import React, { type FunctionComponent } from 'react'

import styles from './focused-cbg-slice-segment.css'
import { type FocusedSliceKeys } from '../../../../models/enums/range-segment.enum'

interface FocusedCBGSliceSegmentProps {
  position: {
    left: number
    yPositions: Record<FocusedSliceKeys, number>
  }
  focusedSliceKeys: FocusedSliceKeys[]
  sliceWidth: number
}

const STROKE_WIDTH = 2 // When changing this value, make sure to update the value of stroke-width in the css file

export const FocusedCbgSliceSegment: FunctionComponent<FocusedCBGSliceSegmentProps> = (props) => {
  const { position, focusedSliceKeys, sliceWidth } = props

  const height = position.yPositions[focusedSliceKeys[0]] - position.yPositions[focusedSliceKeys[1]]
  const width = sliceWidth - STROKE_WIDTH
  const xPosition = position.left - sliceWidth / 2 + STROKE_WIDTH / 2
  const yPosition = position.yPositions[focusedSliceKeys[1]]

  return (
    <rect
      data-testid="cbg-slice-animated"
      className={styles.segment}
      x={xPosition}
      y={yPosition}
      width={width}
      height={height}
    />
  )
}
