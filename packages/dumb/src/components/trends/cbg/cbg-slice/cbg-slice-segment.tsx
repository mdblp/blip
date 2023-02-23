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
import { type CbgPositionData, type CbgSliceYPositions } from '../../../../models/cbg-position-data.model'
import { type CbgRangeSegment } from '../../../../models/cbg-range-segment.model'
import { type CbgSliceTransitionMotionStyle } from '../../../../models/animation.model'
import { CBG_CIRCLE_PREFIX_ID } from '../../../../models/constants/cbg.constants'
import { useTrendsContext } from '../../../../provider/trends.provider'
import { type CbgSlice } from '../../../../models/cbg-slice.model'

interface CbgSliceSegmentProps {
  classes: string
  datum: CbgSlice
  id: string
  positionData: CbgPositionData<CbgSliceYPositions>
  segment: CbgRangeSegment
  style: CbgSliceTransitionMotionStyle
  width: number
  x: number
}

export const CbgSliceSegment: FunctionComponent<CbgSliceSegmentProps> = (props) => {
  const { classes, datum, id, positionData, segment, style, x, width } = props

  const { focusCbgSlice, unfocusCbgSlice } = useTrendsContext()

  const handleMouseOut = (event: { relatedTarget: EventTarget | null | { id: string } }): void => {
    const relatedTarget = event.relatedTarget as { id: string }
    // Do not unfocus the slice if the user just rolled over a CBG inside it
    if (relatedTarget?.id && relatedTarget.id.search(CBG_CIRCLE_PREFIX_ID) !== -1) {
      return
    }
    unfocusCbgSlice()
  }

  const handleMouseOver = (): void => {
    focusCbgSlice(
      datum,
      positionData,
      segment.heightKeys
    )
  }

  return (
    <rect
      className={classes}
      data-testid={`cbg-slice-rectangle-${id}`}
      width={width}
      height={style[segment.height]}
      x={x}
      y={style[segment.y]}
      opacity={style.opacity}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
    />
  )
}
