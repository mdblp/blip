/*
 * Copyright (c) 2022-2026, Diabeloop
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
import MedicalDataService, { type DateFilter, GlycemiaStatisticsService, type PumpSettings } from 'medical-domain'
import React, { type FC } from 'react'
import { sortHistory } from '../../device/utils/device.utils'
import { TimeInLoopModeCard } from '../../statistics/stat-cards/time-in-loop-mode-card'
import { DeviceListCard } from './device-list-card'
import { DevicesUsageCard } from './devices-usage-card'

interface DeviceUsageWidgetProps {
  dateFilter: DateFilter
  goToDailySpecificDate: (date: Date) => void
  medicalDataService: MedicalDataService
}

export const DevicesColumn: FC<DeviceUsageWidgetProps> = (props) => {
  const { dateFilter, goToDailySpecificDate, medicalDataService } = props
  const medicalData = medicalDataService.medicalData
  const pumpSettings = medicalData.pumpSettings.slice(-1)[0] as PumpSettings
  const {
    total,
    sensorUsage
  } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, dateFilter)

  if (pumpSettings) {
    sortHistory(pumpSettings.payload.history.parameters)
  }

  return (
    <Box data-testid="devices-column">
      <DeviceListCard pumpSettings={pumpSettings} />
      <TimeInLoopModeCard basalData={medicalData.basal} dateFilter={dateFilter} />
      <DevicesUsageCard
        dateFilter={dateFilter}
        goToDailySpecificDate={goToDailySpecificDate}
        medicalDataService={medicalDataService}
        sensorUsage={sensorUsage}
        totalUsage={total}
      />
    </Box>
  )
}
