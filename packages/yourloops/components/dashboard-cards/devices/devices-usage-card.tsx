/*
 * Copyright (c) 2025, Diabeloop
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

import React, { FC } from 'react'
import { SensorUsageStat } from '../../statistics/sensor-usage-stat'
import Divider from '@mui/material/Divider'
import { DataCard } from '../../data-card/data-card'
import { Patient } from '../../../lib/patient/models/patient.model'
import MedicalDataService, { type DateFilter } from 'medical-domain'
import { makeStyles } from 'tss-react/mui'
import { CartridgeChangesStat } from '../../statistics/cartridge-changes-stat'

interface DevicesUsageCardProps {
  dateFilter: DateFilter
  goToDailySpecificDate: (date: Date) => void
  medicalDataService: MedicalDataService
  sensorUsage: number
  totalUsage: number
}

const useStyles = makeStyles()((theme) => ({
  divider: {
    margin: theme.spacing(1, 0)
  }
}))

export const DevicesUsageCard: FC<DevicesUsageCardProps> = (props) => {
  const { medicalDataService, sensorUsage, totalUsage, dateFilter, goToDailySpecificDate } = props
  const { classes } = useStyles()

  return (
    <DataCard data-testid="devices-usage-card">
      <SensorUsageStat total={totalUsage} usage={sensorUsage} />
      <Divider variant="fullWidth" className={classes.divider} />
      <CartridgeChangesStat
        dateFilter={dateFilter}
        goToDailySpecificDate={goToDailySpecificDate}
        reservoirChanges={medicalDataService.medicalData.reservoirChanges}
      />
    </DataCard>
  )
}
