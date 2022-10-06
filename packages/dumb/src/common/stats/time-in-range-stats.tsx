/**
 * Copyright (c) 2022, Diabeloop
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

import React, { FunctionComponent } from 'react'
import { CBGTimeStat } from './cbg-time-stat'
import styles from './time-in-range.css'
import { TimeInRangeStatsTitle } from './time-in-range-stats-title'
import { useTimeInRangeStatsTitleHook } from './time-in-range-stats.hook'

export interface TimeInRangeData {
  id: string
  legendTitle: string
  title: string
  value: number
}

interface TimeInRangeStatsProps {
  annotations: []
  data: TimeInRangeData[]
  total: number
  titleKey: string
}

export enum StatLevel {
  VeryHigh = 'veryHigh',
  High = 'high',
  Target = 'target',
  Low = 'low',
  VeryLow = 'veryLow'
}

export const TimeInRangeStats: FunctionComponent<TimeInRangeStatsProps> = (props: TimeInRangeStatsProps) => {
  const { annotations, data, titleKey, total } = props

  const { cbgStats, cbgTimeStatCommonProps, hoveredStatId, titleProps } = useTimeInRangeStatsTitleHook({ data, titleKey, total })

  return (
    <>
      <TimeInRangeStatsTitle
        annotations={annotations}
        hoveredStatId={hoveredStatId}
        {...titleProps}
      />
      <div className={styles.stats}>
        <CBGTimeStat
          {...cbgTimeStatCommonProps}
          {...cbgStats.veryHighStat}
        />
        <CBGTimeStat
          {...cbgTimeStatCommonProps}
          {...cbgStats.highStat}
        />
        <CBGTimeStat
          {...cbgTimeStatCommonProps}
          {...cbgStats.targetStat}
        />
        <CBGTimeStat
          {...cbgTimeStatCommonProps}
          {...cbgStats.lowStat}
        />
        <CBGTimeStat
          {...cbgTimeStatCommonProps}
          {...cbgStats.veryLowStat}
        />
      </div>
    </>
  )
}
