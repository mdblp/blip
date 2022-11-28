/*
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
import { CBGPercentageBarMemoized as CBGPercentageBar } from './cbg-percentage-bar'
import styles from './cbg-percentage-title.css'
import { CbgPercentageTitleMemoized as CbgPercentageTitle } from './cbg-percentage-title'
import { useCBGPercentageBarChartHook } from './cbg-percentage-bar-chart.hook'
import { BgClasses, CBGPercentageData, CBGStatType } from '../models'
import { StatLegendMemoized as StatLegend } from '../stat-legend/stat-legend'
import { Box } from '@material-ui/core'

interface CBGPercentageBarChartProps {
  annotations: []
  bgClasses: BgClasses
  cbgStatType: CBGStatType
  data: CBGPercentageData[]
  hideTooltip: boolean
  total: number
  titleKey: string
  units: string
}

const CBGPercentageBarChart: FunctionComponent<CBGPercentageBarChartProps> = (props) => {
  const { annotations, bgClasses, cbgStatType, data, hideTooltip, titleKey, total, units } = props

  const { cbgStatsProps, hoveredStatId, onMouseLeave, titleProps } = useCBGPercentageBarChartHook({
    type: cbgStatType,
    data,
    hideTooltip,
    titleKey,
    total
  })
  return (
    <>
      <div data-testid={`cbg-percentage-stats-${cbgStatType}`}>
        <CbgPercentageTitle
          annotations={annotations}
          hoveredStatId={hoveredStatId}
          {...titleProps}
        />
        <Box className={styles.stats} onMouseLeave={() => onMouseLeave()} marginLeft="8px">
          <CBGPercentageBar {...cbgStatsProps.veryHighStat} />
          <CBGPercentageBar {...cbgStatsProps.highStat} />
          <CBGPercentageBar {...cbgStatsProps.targetStat} />
          <CBGPercentageBar {...cbgStatsProps.lowStat} />
          <CBGPercentageBar {...cbgStatsProps.veryLowStat} />
        </Box>
      </div>
      <div className={styles['stat-footer']} />
      <StatLegend bgClasses={bgClasses} units={units} />
    </>
  )
}
export const CBGPercentageBarChartMemoized = React.memo(CBGPercentageBarChart)
