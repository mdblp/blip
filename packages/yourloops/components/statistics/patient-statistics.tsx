/*
 * Copyright (c) 2023-2026, Diabeloop
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

import Box from '@mui/material/Box'
import { type BgPrefs } from 'dumb'
import { type DateFilter, DiabeticType, type MedicalData } from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import { useLocation } from 'react-router-dom'
import { GlucoseMetricsCard } from './stat-cards/glucose-metrics-card'
import { TimeInLoopModeCard } from './stat-cards/time-in-loop-mode-card'
import { TimeInRangeCard } from './stat-cards/time-in-range-card'
import { TotalCarbsInsulinCard } from './stat-cards/total-carbs-insulin-card'

export interface PatientStatisticsProps {
  medicalData: MedicalData
  bgPrefs: BgPrefs
  dateFilter: DateFilter
  diabeticProfile?: string
}

export const PatientStatistics: FunctionComponent<PatientStatisticsProps> = (props) => {
  const { medicalData, bgPrefs, dateFilter, diabeticProfile } = props
  const location = useLocation()

  const isTrendsView = location.pathname.includes('trends')
  const isDailyView = location.pathname.includes('daily')

  return (
    <Box data-testid="patient-statistics">
      <TimeInRangeCard
        bgPrefs={bgPrefs}
        dateFilter={dateFilter}
        cbgData={medicalData.cbg}
        showDt1Chart={diabeticProfile === DiabeticType.DT1Pregnancy && isDailyView}
        showSensorUsage={isTrendsView}
      />
      <TotalCarbsInsulinCard
        basalData={medicalData.basal}
        bolusData={medicalData.bolus}
        mealData={medicalData.meals}
        pumpSettingsData={medicalData.pumpSettings}
        wizardData={medicalData.wizards}
        dateFilter={dateFilter}
      />
      <TimeInLoopModeCard basalData={medicalData.basal} dateFilter={dateFilter} />
      <GlucoseMetricsCard
        cbgData={medicalData.cbg}
        dateFilter={dateFilter}
        bgPrefs={bgPrefs}
        showGmi={!isDailyView}
      />
    </Box>
  )
}
