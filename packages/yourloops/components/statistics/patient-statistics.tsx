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
import { type BgPrefs, CBGPercentageBarChart, CBGStatType, LoopModeStat, TotalCarbsStat } from 'dumb'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { SensorUsageStat } from './sensor-usage-stat'
import {
  BasalBolusStatisticsService,
  type BgType,
  CarbsStatisticsService,
  type DateFilter,
  DatumType,
  GlycemiaStatisticsService,
  type MedicalData,
  TimeService
} from 'medical-domain'
import { GlucoseManagementIndicator } from './glucose-management-indicator-stat'
import { useLocation } from 'react-router-dom'
import { CoefficientOfVariation } from './coefficient-of-variation-stat'
import { StandardDeviationStat } from './standard-deviation-stat'
import { AverageGlucoseStat } from './average-glucose-stat'
import { TotalInsulinStat } from './total-insulin-stat'
import { MS_IN_DAY } from 'medical-domain'
import { makeStyles } from 'tss-react/mui'

export interface PatientStatisticsProps {
  medicalData: MedicalData
  bgPrefs: BgPrefs
  dateFilter: DateFilter
}

const useStyles = makeStyles()((theme) => ({
  divider: {
    marginBlock: theme.spacing(1),
    backgroundColor: 'var(--light-grey-border-color)'
  },
  widgetGroup: {
    backgroundColor: theme.palette.background.paper,
    border: '1px solid var(--light-grey-border-color)',
    borderRadius: theme.spacing(3),
    marginBottom: '12px',
    padding: '20px'
  }
}))

export const PatientStatistics: FunctionComponent<PatientStatisticsProps> = (props) => {
  const { medicalData, bgPrefs, dateFilter } = props
  const { classes } = useStyles()
  const location = useLocation()

  const cbgSelected = medicalData.cbg.length > 0
  const bgType: BgType = cbgSelected ? DatumType.Cbg : DatumType.Smbg
  const cbgStatType: CBGStatType = cbgSelected ? CBGStatType.TimeInRange : CBGStatType.ReadingsInRange
  const numberOfDays = dateFilter.weekDays ? TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays) : (dateFilter.end - dateFilter.start) / MS_IN_DAY
  const bgUnits = bgPrefs.bgUnits
  const selectedBgData = cbgSelected ? medicalData.cbg : medicalData.smbg
  const isTrendsView = location.pathname.includes('trends')
  const isDailyView = location.pathname.includes('daily')
  const isDashboardPage = location.pathname.includes('dashboard')

  const {
    standardDeviation,
    total: standardDeviationTotal
  } = GlycemiaStatisticsService.getStandardDevData(selectedBgData, dateFilter)

  const {
    sensorUsage,
    total: sensorUsageTotal
  } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, dateFilter)

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
    automatedBasalDuration,
    manualBasalDuration,
    manualBasalInDays,
    automatedBasalInDays,
    automatedAndManualTotalDuration
  } = BasalBolusStatisticsService.getAutomatedAndManualBasalDuration(medicalData.basal, dateFilter)

  const automatedBasals = isDashboardPage ? automatedBasalInDays : automatedBasalDuration
  const manualBasals = isDashboardPage ? manualBasalInDays : manualBasalDuration

  return (
    <Box data-testid="patient-statistics">
      <Box className={classes.widgetGroup}>
        <CBGPercentageBarChart
          bgType={bgType}
          cbgStatType={cbgStatType}
          data={cbgPercentageBarChartData}
          bgPrefs={bgPrefs}
          days={numberOfDays}
        />
        {isTrendsView &&
          <>
            <Divider className={classes.divider} />
            <SensorUsageStat total={sensorUsageTotal} usage={sensorUsage} />
          </>
        }
      </Box>

      <Box className={classes.widgetGroup}>
        <TotalCarbsStat
          totalEntriesCarbWithRescueCarbs={totalEntriesCarbWithRescueCarbs}
          totalCarbsPerDay={Math.round(totalCarbsPerDay)}
          foodCarbsPerDay={Math.round(foodCarbsPerDay)}
        />
        <Divider className={classes.divider} />
        <TotalInsulinStat
          basal={basal}
          bolus={bolus}
          totalInsulin={basalBolusTotal}
          weight={weight}
          dailyDose={dailyDose}
        />
      </Box>
      <Box className={classes.widgetGroup}>
        <LoopModeStat
            automatedBasalDuration={automatedBasalDuration}
            manualBasalDuration={manualBasalDuration}
            totalBasalDuration={automatedAndManualTotalDuration}
            automatedBasals={automatedBasals}
            manualBasals={manualBasals}
        />
      </Box>
      <Box className={classes.widgetGroup}>
        <AverageGlucoseStat
          averageGlucose={averageGlucose}
          bgPrefs={bgPrefs}
          bgType={bgType}
        />
        <Divider className={classes.divider} />
        <StandardDeviationStat
          total={standardDeviationTotal}
          bgType={bgType}
          bgPrefs={bgPrefs}
          averageGlucose={averageGlucose}
          standardDeviation={standardDeviation}
        />
        <Divider className={classes.divider} />
        <CoefficientOfVariation coefficientOfVariation={coefficientOfVariation} bgType={bgType} />
        {!isDailyView &&
          <>
            <Divider className={classes.divider} />
            <GlucoseManagementIndicator glucoseManagementIndicator={glucoseManagementIndicator} />
          </>
        }
      </Box>
    </Box>
  )
}
