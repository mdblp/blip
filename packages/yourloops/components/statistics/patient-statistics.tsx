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
import { type BgPrefs, CBGPercentageBarChart, CBGStatType, LoopModeStat, TotalCarbsStat } from 'dumb'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material'
import Divider from '@mui/material/Divider'
import { SensorUsageStat } from './sensor-usage-stat'
import {
  type BgType,
  type DateFilter,
  DatumType,
  type MedicalData,
  TimeService,
  GlycemiaStatisticsService,
  CarbsStatisticsService,
  BasalBolusStatisticsService
} from 'medical-domain'
import { GlucoseManagementIndicator } from './glucose-management-indicator-stat'
import { useLocation } from 'react-router-dom'
import { CoefficientOfVariation } from './coefficient-of-variation-stat'
import { StandardDeviationStat } from './standard-deviation-stat'
import { AverageGlucoseStat } from './average-glucose-stat'
import { TotalInsulinStat } from './total-insulin-stat'
import { automatedBasalDeviceModel, checkManufacturerName } from './patient-statistics.utils'

export interface PatientStatisticsProps {
  medicalData: MedicalData
  bgPrefs: BgPrefs
  bgType: BgType
  dateFilter: DateFilter
}

export const PatientStatistics: FunctionComponent<PropsWithChildren<PatientStatisticsProps>> = (props) => {
  const { medicalData, bgPrefs, bgType, dateFilter, children } = props
  const theme = useTheme()
  const location = useLocation()

  const cbgSelected = bgType === DatumType.Cbg
  const cbgStatType: CBGStatType = cbgSelected ? CBGStatType.TimeInRange : CBGStatType.ReadingsInRange
  const numberOfDays = TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays)
  const bgUnits = bgPrefs.bgUnits
  const selectedBgData = cbgSelected ? medicalData.cbg : medicalData.smbg
  const isTrendsPage = location.pathname.includes('trends')
  const manufacturer = medicalData.pumpSettings.map(item => item.payload.device.manufacturer)
  const deviceModel = medicalData.pumpSettings.map(item => item.payload.device.name)

  const isAutomatedBasalDevice = (): boolean => {
    const models = automatedBasalDeviceModel[checkManufacturerName(manufacturer)] || false
    return Array.isArray(models) && models.includes(deviceModel)
  }

  const {
    standardDeviation,
    total: standardDeviationTotal
  } = GlycemiaStatisticsService.getStandardDevData(selectedBgData, dateFilter)

  const {
    sensorUsage,
    total: sensorUsageTotal
  } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, numberOfDays, dateFilter)

  const {
    foodCarbsPerDay,
    totalEntriesCarbWithRescueCarbs,
    totalCarbsPerDay
  } = CarbsStatisticsService.getCarbsData(medicalData.meals, medicalData.wizards, numberOfDays, dateFilter)

  const { averageGlucose } = GlycemiaStatisticsService.getAverageGlucoseData(selectedBgData, dateFilter)
  const { coefficientOfVariation } = GlycemiaStatisticsService.getCoefficientOfVariationData(selectedBgData, dateFilter)
  const { glucoseManagementIndicator } = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(medicalData.cbg, bgUnits, dateFilter)

  const cbgPercentageBarChartData = cbgStatType === CBGStatType.TimeInRange
    ? GlycemiaStatisticsService.getTimeInRangeData(medicalData.cbg, bgPrefs.bgBounds, numberOfDays, dateFilter)
    : GlycemiaStatisticsService.getReadingsInRangeData(medicalData.smbg, bgPrefs.bgBounds, numberOfDays, dateFilter)

  const {
    bolus,
    basal,
    total: basalBolusTotal
  } = BasalBolusStatisticsService.getBasalBolusData(medicalData.basal, medicalData.bolus, numberOfDays, dateFilter)

  const {
    weight,
    totalInsulin: dailyDose
  } = BasalBolusStatisticsService.getTotalInsulinAndWeightData(medicalData.basal, medicalData.bolus, numberOfDays, dateFilter, medicalData.pumpSettings)

  const {
    total,
    manual,
    auto
  } = BasalBolusStatisticsService.getTimeInAutoData(medicalData.basal, numberOfDays, dateFilter)

  return (
    <Box data-testid="patient-statistics">
      <CBGPercentageBarChart
        bgBounds={bgPrefs.bgBounds}
        bgType={bgType}
        cbgStatType={cbgStatType}
        data={cbgPercentageBarChartData}
        bgPrefs={bgPrefs}
        days={numberOfDays}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <StandardDeviationStat
        total={standardDeviationTotal}
        bgType={bgType}
        bgPrefs={bgPrefs}
        averageGlucose={averageGlucose}
        standardDeviation={standardDeviation}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <AverageGlucoseStat
        averageGlucose={averageGlucose}
        bgPrefs={bgPrefs}
        bgType={bgType}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <SensorUsageStat total={sensorUsageTotal} usage={sensorUsage} />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />

      {isTrendsPage &&
        <>
          <GlucoseManagementIndicator glucoseManagementIndicator={glucoseManagementIndicator} />
          <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
        </>
      }
      <CoefficientOfVariation coefficientOfVariation={coefficientOfVariation} bgType={bgType} />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <TotalInsulinStat
        basal={basal}
        bolus={bolus}
        totalInsulin={basalBolusTotal}
        weight={weight}
        dailyDose={dailyDose}
      />
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      {isAutomatedBasalDevice &&
        <>
          <LoopModeStat
            automated={auto}
            manual={manual}
            total={total}
          />
        </>
      }
      <Divider sx={{ marginBlock: theme.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      <TotalCarbsStat
        totalEntriesCarbWithRescueCarbs={totalEntriesCarbWithRescueCarbs}
        totalCarbsPerDay={Math.round(totalCarbsPerDay)}
        foodCarbsPerDay={Math.round(foodCarbsPerDay)}
      />
      <Divider sx={{ marginBlock: t  me.spacing(1), backgroundColor: theme.palette.grey[600] }} />
      {children}
    </Box>
  )
}
