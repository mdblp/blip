/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { CBGPercentageBarMemoized as CBGPercentageBar } from '../cbg-percentage-bar/cbg-percentage-bar'
import { TimeInRangeTitleMemoized as TimeInRangeTitle } from '../time-in-range-title'
import { useTimeInRangeChartHook } from './time-in-range-chart.hook'
import { type CBGStatType } from '../../../../models/stats.model'
import { StatLegendMemoized as StatLegend } from '../../stat-legend/stat-legend'
import Box from '@mui/material/Box'
import { type BgPrefs } from '../../../../models/blood-glucose.model'
import { type BgType, type CbgRangeStatistics } from 'medical-domain'

interface TimeInRangeChartProps {
  bgType: BgType
  bgPrefs: BgPrefs
  cbgStatType: CBGStatType
  data: CbgRangeStatistics
  days: number
}

const TimeInRangeChart: FunctionComponent<TimeInRangeChartProps> = (props) => {
  const { bgPrefs, bgType, cbgStatType, data, days } = props
  const {
    annotations,
    cbgStatsProps,
    hoveredStatId,
    onMouseLeave,
    title,
    legendValues
  } = useTimeInRangeChartHook({
    bgType,
    data,
    days,
    type: cbgStatType,
    bgPrefs
  })

  return (
    <Box data-testid="time-in-range-chart">
      <TimeInRangeTitle
        annotations={annotations}
        title={title}
        shouldDisplayInfoTooltip={!hoveredStatId}
      />
      <Box
        onMouseLeave={() => {
          onMouseLeave()
        }}
        marginBottom={1}
      >
        <CBGPercentageBar {...cbgStatsProps.veryHighStat} />
        <CBGPercentageBar {...cbgStatsProps.highStat} />
        <CBGPercentageBar {...cbgStatsProps.targetStat} />
        <CBGPercentageBar {...cbgStatsProps.lowStat} />
        <CBGPercentageBar {...cbgStatsProps.veryLowStat} />
      </Box>
      <StatLegend units={bgPrefs.bgUnits} legend={legendValues} />
    </Box>
  )
}
export const TimeInRangeChartMemoized = React.memo(TimeInRangeChart)
