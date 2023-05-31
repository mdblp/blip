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
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import GenericDashboardCard from './generic-dashboard-card'
import { useTranslation } from 'react-i18next'
import CardContent from '@mui/material/CardContent'
import { PatientStatistics, type PatientStatisticsProps } from '../statistics/patient-statistics'

export const PatientStatisticsWidget: FunctionComponent<PropsWithChildren<PatientStatisticsProps>> = (props) => {
  const { t } = useTranslation()
  const { medicalData, bgPrefs, bgType, dateFilter, children } = props

  return (
    <GenericDashboardCard
      avatar={<InsertChartOutlinedIcon />}
      title={t('patient-statistics')}
    >
      <CardContent>
        <PatientStatistics
          medicalData={medicalData}
          bgPrefs={bgPrefs}
          bgType={bgType}
          dateFilter={dateFilter}
        >
          {children}
        </PatientStatistics>
      </CardContent>
    </GenericDashboardCard>
  )
}
