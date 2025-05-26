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

import React, { type FC } from 'react'
import type MedicalDataService from 'medical-domain'
import { type DateFilter, GlycemiaStatisticsService, type PumpSettings } from 'medical-domain'
import { sortHistory } from '../../device/utils/device.utils'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { DeviceListCard } from './device-list-card'
import { LastUpdatesCard } from './last-updates-card'
import { DevicesUsageCard } from './devices-usage-card'

interface DeviceUsageWidgetProps {
  dateFilter: DateFilter
  medicalDataService: MedicalDataService
  patient: Patient
}

export const DevicesColumn: FC<DeviceUsageWidgetProps> = (props) => {
  const { patient, medicalDataService, dateFilter } = props
  const pumpSettings = medicalDataService.medicalData.pumpSettings.slice(-1)[0] as PumpSettings
  const {
    total,
    sensorUsage
  } = GlycemiaStatisticsService.getSensorUsage(medicalDataService.medicalData.cbg, dateFilter)

  if (pumpSettings) {
    sortHistory(pumpSettings.payload.history)
  }

  return (
    <>
      <DeviceListCard
        pumpSettings={pumpSettings}
      />
      <LastUpdatesCard
        pumpSettings={pumpSettings}
      />
      <DevicesUsageCard
        patient={patient}
        medicalDataService={medicalDataService}
        sensorUsage={sensorUsage}
        totalUsage={total}
      />
    </>
  )
}
