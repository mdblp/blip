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

import React, { type FunctionComponent, type PropsWithChildren } from 'react'
import { type VizDataUtil } from 'tidepool-viz'
import { type BgPrefs, CBGPercentageBarChart, CBGStatType } from 'dumb'
import { BgSource } from 'dumb/src/models/blood-glucose.model'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import { SensorUsageStat } from './sensor-usage-stat'

export interface PatientStatisticsProps {
  dataUtil: VizDataUtil
  bgPrefs: BgPrefs
  endpoints: string[]
}

export const PatientStatistics: FunctionComponent<PropsWithChildren<PatientStatisticsProps>> = (props) => {
  const { dataUtil, bgPrefs, endpoints, children } = props
  const theme = useTheme()
  dataUtil.endpoints = endpoints
  const cbgStatType: CBGStatType = dataUtil.bgSource === BgSource.Cbg ? CBGStatType.TimeInRange : CBGStatType.ReadingsInRange
  const cbgPercentageBarChartData = cbgStatType === CBGStatType.TimeInRange
    ? dataUtil.getTimeInRangeData()
    : dataUtil.getReadingsInRangeData()
  const cbgSelected = dataUtil.bgSources.cbg

  return (
    <Box data-testid="patient-statistics">
      <CBGPercentageBarChart
        bgBounds={dataUtil.bgBounds}
        bgSource={dataUtil.bgSource}
        cbgStatType={cbgStatType}
        data={cbgPercentageBarChartData}
        bgPrefs={bgPrefs}
        days={dataUtil?.days ?? 0}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      {cbgSelected && <SensorUsageStat dataUtil={dataUtil} />}
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      {children}
    </Box>
  )
}
