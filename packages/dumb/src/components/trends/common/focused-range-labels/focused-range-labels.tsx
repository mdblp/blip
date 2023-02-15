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

import styles from './focused-range-labels.css'
import { formatClocktimeFromMsPer24 } from '../../../../utils/datetime/datetime.util'
import { type RangeSegmentSlice, type RangeSegmentSliceType } from '../../../../models/enums/range-segment.enum'
import { formatBgValue } from '../../../../utils/format/format.util'
import Tooltip from '../../../tooltips/common/tooltip/tooltip'
import { type CbgPositionData } from '../../../../models/cbg-position-data.model'
import { type UnitsType } from '../../../../models/enums/units-type.enum'

interface FocusedRangeLabelsProps {
  bgUnit: UnitsType
  focusedRangeSegments: RangeSegmentSlice
  data: RangeSegmentSliceType & {
    median: number
    msFrom: number
    msTo: number
    outOfRangeThresholds: {
      low: number
      high: number
    }
  }
  position: CbgPositionData
}

const BOTTOM_OFFSET = -5
const TOP_OFFSET = 5
const TOP_SIDE = 'top'
const BOTTOM_SIDE = 'bottom'
const TRANSPARENT_COLOR = 'transparent'

export const FocusedRangeLabels: FunctionComponent<FocusedRangeLabelsProps> = (props) => {
  const { focusedRangeSegments, data, position, bgUnit } = props

  if (focusedRangeSegments.length <= 1) {
    return null
  }

  const timeFrom = formatClocktimeFromMsPer24(data.msFrom)
  const timeTo = formatClocktimeFromMsPer24(data.msTo)
  const bottom = focusedRangeSegments[0] as RangeSegmentSlice
  const top = focusedRangeSegments[1] as RangeSegmentSlice
  const leftPosition = position.left
  const dateTooltipPosition = { left: leftPosition, top: position.yPositions.topMargin }
  const topRangeSegmentTooltipPosition = { top: position.yPositions[top] as number, left: leftPosition }
  const bottomRangeSegmentTooltipPosition = { top: position.yPositions[bottom] as number, left: leftPosition }

  const thresholds = data.outOfRangeThresholds
  const topSegmentBgValue = formatBgValue(data[top], bgUnit, thresholds)
  const bottomSegmentBgValue = formatBgValue(data[bottom], bgUnit, thresholds)

  return (
    <div className={styles.container} data-testid="trends-tooltips">
      <Tooltip
        title={
          <span className={styles.timeLabel}>{timeFrom} - {timeTo}</span>
        }
        borderWidth={0}
        position={dateTooltipPosition}
        side={BOTTOM_SIDE}
        tail={false}
      />
      <Tooltip
        content={
          <span className={styles.number}>
            {topSegmentBgValue}
          </span>
        }
        backgroundColor={TRANSPARENT_COLOR}
        borderColor={TRANSPARENT_COLOR}
        offset={{ left: 0, top: TOP_OFFSET }}
        position={topRangeSegmentTooltipPosition}
        side={TOP_SIDE}
        tail={false}
      />
      <Tooltip
        content={
          <span className={styles.number}>
            {bottomSegmentBgValue}
          </span>
        }
        backgroundColor={TRANSPARENT_COLOR}
        borderColor={TRANSPARENT_COLOR}
        offset={{ left: 0, top: BOTTOM_OFFSET }}
        position={bottomRangeSegmentTooltipPosition}
        side={BOTTOM_SIDE}
        tail={false}
      />
    </div>
  )
}
