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

import { type BgUnit } from 'medical-domain'

import styles from './focused-range-labels.css'
import { formatClocktimeFromMsPer24 } from '../../../../utils/datetime/datetime.util'
import { type RangeSegmentSlice } from '../../../../models/enums/range-segment.enum'
import { formatBgValue } from '../../../../utils/format/format.util'
import Tooltip from '../../../tooltips/common/tooltip/tooltip'

interface FocusedRangeLabelsProps {
  bgUnit: BgUnit
  focusedRangeSegments: RangeSegmentSlice
  data: {
    [key in RangeSegmentSlice]: number
  } & {
    median: number
    msFrom: number
    msTo: number
    outOfRangeThresholds: {
      low: number
      high: number
    }
  }
  position: {
    left: number
    tooltipLeft: boolean
    yPositions: {
      [key in RangeSegmentSlice]: number
    } & {
      topMargin: number
    }
  }
}

const OFFSET_BOTTOM = -5
const OFFSET_TOP = 5

export const FocusedRangeLabels: FunctionComponent<FocusedRangeLabelsProps> = (props) => {
  const { focusedRangeSegments, data, position, bgUnit } = props

  if (focusedRangeSegments.length <= 1) {
    return null
  }

  const timeFrom = formatClocktimeFromMsPer24(data.msFrom)
  const timeTo = formatClocktimeFromMsPer24(data.msTo)
  const bottom = focusedRangeSegments[0] as RangeSegmentSlice
  const top = focusedRangeSegments[1] as RangeSegmentSlice
  const topPosition = {
    top: position.yPositions[top],
    left: position.left
  }
  const bottomPosition = {
    top: position.yPositions[bottom],
    left: position.left
  }

  return (
    <div className={styles.container} data-testid="trends-tooltips">
      <Tooltip
        title={
          <span className={styles.timeLabel}>{timeFrom} - {timeTo}</span>
        }
        borderWidth={0}
        position={{ left: position.left, top: position.yPositions.topMargin }}
        side="bottom"
        tail={false}
      />
      <Tooltip
        content={
          <span className={styles.number}>
            {formatBgValue(data[top], bgUnit, data.outOfRangeThresholds)}
          </span>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        offset={{ left: 0, top: OFFSET_TOP }}
        position={topPosition}
        side="top"
        tail={false}
      />
      <Tooltip
        content={
          <span className={styles.number}>
            {formatBgValue(data[bottom], bgUnit, data.outOfRangeThresholds)}
          </span>
        }
        backgroundColor="transparent"
        borderColor="transparent"
        offset={{ left: 0, top: OFFSET_BOTTOM }}
        position={bottomPosition}
        side="bottom"
        tail={false}
      />
    </div>
  )
}
