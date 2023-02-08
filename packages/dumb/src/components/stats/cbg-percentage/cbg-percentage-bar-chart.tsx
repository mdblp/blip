/*
 * Copyright (c) 2022-2023, Diabeloop
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
import { CBGPercentageBarMemoized as CBGPercentageBar } from './cbg-percentage-bar'
import { CbgPercentageTitleMemoized as CbgPercentageTitle } from './cbg-percentage-title'
import { useCBGPercentageBarChartHook } from './cbg-percentage-bar-chart.hook'
import { type CBGStatType } from '../../../models/stats.model'
import { StatLegendMemoized as StatLegend } from '../stat-legend/stat-legend'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { type BgPrefs, type BgBounds, type BgSource } from '../../../models/blood-glucose.model'
import { type ReadingsInRangeData, type TimeInRangeData } from 'tidepool-viz/src/types/utils/data'
import { useTheme } from '@mui/material/styles'

interface CBGPercentageBarChartProps {
  bgBounds: BgBounds
  bgSource: BgSource
  bgPrefs: BgPrefs
  cbgStatType: CBGStatType
  data: TimeInRangeData | ReadingsInRangeData
  days: number
}

const CBGPercentageBarChart: FunctionComponent<CBGPercentageBarChartProps> = (props) => {
  const { bgBounds, bgPrefs, bgSource, cbgStatType, data, days } = props
  const theme = useTheme()
  const {
    annotations,
    cbgStatsProps,
    hoveredStatId,
    onMouseLeave,
    titleProps
  } = useCBGPercentageBarChartHook({
    bgBounds,
    bgSource,
    data,
    days,
    type: cbgStatType,
    units: bgPrefs.bgUnits
  })

  return (
    <div data-testid="cbg-percentage-bar-chart">
      <div>
        <CbgPercentageTitle
          annotations={annotations}
          hoveredStatId={hoveredStatId}
          {...titleProps}
        />
        <Box onMouseLeave={() => { onMouseLeave() }}>
          <CBGPercentageBar {...cbgStatsProps.veryHighStat} />
          <CBGPercentageBar {...cbgStatsProps.highStat} />
          <CBGPercentageBar {...cbgStatsProps.targetStat} />
          <CBGPercentageBar {...cbgStatsProps.lowStat} />
          <CBGPercentageBar {...cbgStatsProps.veryLowStat} />
        </Box>
      </div>
      <Divider sx={{ marginBlock: theme.spacing(1) }} />
      <StatLegend bgClasses={bgPrefs.bgClasses} units={bgPrefs.bgUnits} />
    </div>
  )
}
export const CBGPercentageBarChartMemoized = React.memo(CBGPercentageBarChart)
