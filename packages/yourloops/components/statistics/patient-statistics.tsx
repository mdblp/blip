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
import { type BgPrefs, CBGPercentageBarChart, CBGStatType } from 'dumb'
import { type BgType, type DateFilter, DatumType, type MedicalData, TimeService } from 'medical-domain'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import { SensorUsageStat } from './sensor-usage-stat'
import { GlycemiaStatisticsService } from 'medical-domain/src/domains/repositories/statistics/glycemia-statistics.service'
import { GlucoseManagementIndicator } from './glucose-management-indicator-stat'
import { useLocation } from 'react-router-dom'
import { CoefficientOfVariation } from './coefficient-of-variation-stat'
import { StandartDeviationStat } from './standart-deviation-stat'

export interface PatientStatisticsProps {
  medicalData: MedicalData
  bgPrefs: BgPrefs
  dateFilter: DateFilter
  bgSource: BgType
}

export const PatientStatistics: FunctionComponent<PropsWithChildren<PatientStatisticsProps>> = (props) => {
  const { medicalData, bgPrefs, bgSource, dateFilter, children } = props
  const theme = useTheme()
  const location = useLocation()

  const cbgStatType: CBGStatType = bgSource === DatumType.Cbg ? CBGStatType.TimeInRange : CBGStatType.ReadingsInRange
  const numberOfDays = TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays)
  const cbgSelected = bgSource === DatumType.Cbg
  const bgUnits = bgPrefs.bgUnits
  const selectedBgData = cbgSelected ? medicalData.cbg : medicalData.smbg
  const isTrendsPage = location.pathname.includes('trends')

  const {
    standardDeviation,
    averageGlucose,
    total: standardDeviationTotal
  } = GlycemiaStatisticsService.getStandardDevData(selectedBgData, dateFilter)

  const {
    sensorUsage,
    total: sensorUsageTotal
  } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, numberOfDays, dateFilter)

  const { coefficientOfVariation } = GlycemiaStatisticsService.getCoefficientOfVariationData(selectedBgData, dateFilter)

  const { glucoseManagementIndicator } = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(medicalData.cbg, bgUnits, dateFilter)

  const cbgPercentageBarChartData = cbgStatType === CBGStatType.TimeInRange
    ? GlycemiaStatisticsService.getTimeInRangeData(medicalData.cbg, bgPrefs.bgBounds, numberOfDays, dateFilter)
    : GlycemiaStatisticsService.getReadingsInRangeData(medicalData.smbg, bgPrefs.bgBounds, numberOfDays, dateFilter)

  return (
    <Box data-testid="patient-statistics">
      <CBGPercentageBarChart
        bgBounds={bgPrefs.bgBounds}
        bgSource={bgSource}
        cbgStatType={cbgStatType}
        data={cbgPercentageBarChartData}
        bgPrefs={bgPrefs}
        days={numberOfDays}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />

      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <StandartDeviationStat standardDeviationTotal={standardDeviationTotal} bgsource={bgSource} bgpref={bgPrefs} averageGlucose={averageGlucose} standardDeviation={standardDeviation} />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      {cbgSelected &&
        <>
          <SensorUsageStat sensorUsageTotal={sensorUsageTotal} usage={sensorUsage}/>
          <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
        </>
      }

      {children}

      {cbgSelected &&
        <>
          {isTrendsPage &&
            <>
              <GlucoseManagementIndicator glucoseManagementIndicator={glucoseManagementIndicator} />
              <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
            </>
          }
          <CoefficientOfVariation coefficientOfVariation={coefficientOfVariation} bgSource={bgSource} />
          <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
        </>
      }

      {isTrendsPage && !cbgSelected &&
        <>
          <CoefficientOfVariation coefficientOfVariation={coefficientOfVariation} bgSource={bgSource} />
          <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
        </>
      }
    </Box>
  )
}
