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
import { type Patient } from '../../lib/patient/models/patient.model'
import type MedicalDataService from 'medical-domain'
import { type DateFilter, DatumType, type MedicalData, type TimePrefs } from 'medical-domain'
import { type BgPrefs } from 'dumb'
import DataUtil from 'tidepool-viz/src/utils/data'
import Grid from '@mui/material/Grid'
import AccessTime from '@mui/icons-material/AccessTime'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  RESPONSIVE_GRID_FOUR_COLUMNS,
  RESPONSIVE_GRID_FULL_WIDTH,
  RESPONSIVE_GRID_HALF_WIDTH
} from '../../css/css-utils'
import { PatientStatisticsWidget } from './patient-statistics-widget'
import Stats from 'blip/app/components/chart/stats'
import MedicalFilesWidget from './medical-files/medical-files-widget'
import MonitoringAlertsCard from '../monitoring-alert/monitoring-alerts-card'
import { makeStyles } from 'tss-react/mui'
import ChatWidget from '../chat/chat-widget'
import { useSelectedTeamContext } from '../../lib/selected-team/selected-team.provider'
import { PRIVATE_TEAM_ID, useTeam } from '../../lib/team/team.hook'
import { DEFAULT_DASHBOARD_TIME_RANGE_DAYS } from '../patient-data/patient-data.utils'
import { DeviceUsageWidget } from './device-usage-widget'

interface PatientDashboardProps {
  bgPrefs: BgPrefs
  dataUtil: typeof DataUtil
  loading: boolean
  medicalDataService: MedicalDataService
  patient: Patient
  timePrefs: TimePrefs
}

const useStyle = makeStyles()((theme) => ({
  gridItemContainer: {
    '& > div': {
      marginBottom: theme.spacing(2)
    }
  }
}))

export const PatientDashboard: FunctionComponent<PatientDashboardProps> = (props) => {
  const {
    bgPrefs,
    loading,
    medicalDataService,
    patient,
    timePrefs
  } = props
  const { user } = useAuth()
  const { selectedTeam } = useSelectedTeamContext()
  const { getMedicalTeams } = useTeam()
  const { medicalData } = medicalDataService
  const { t } = useTranslation()
  const { classes, theme } = useStyle()

  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  const computeDateFilter = (data: MedicalData): DateFilter => {
    const now = new Date()
    const dashboardStartDate = new Date()
    dashboardStartDate.setDate(now.getDate() - DEFAULT_DASHBOARD_TIME_RANGE_DAYS)
    const dateRangeData = [...data.smbg, ...data.cbg]
    const localDates = dateRangeData
      .filter(bgData => new Date(bgData.normalTime) >= dashboardStartDate)
      .map((bgData) => bgData.normalTime)
      .sort((a, b) => a.localeCompare(b))
    const dateRangeSet = new Set(localDates)
    if (dateRangeSet.size === 0) {
      return {
        start: 0,
        end: 0
      }
    }
    const dataRangeArray = Array.from(dateRangeSet)
    return {
      start: new Date(dataRangeArray[0]).valueOf(),
      end: new Date(dataRangeArray.pop()).valueOf()
    }
  }

  const dateFilter = computeDateFilter(medicalData)
  const endpoints = [new Date(dateFilter.start).toJSON(), new Date(dateFilter.end).toJSON()]

  const dataUtil = new DataUtil(medicalDataService.data, {
    bgPrefs,
    timePrefs,
    endpoints
  })

  const isSelectedTeamPrivate = selectedTeam?.id === PRIVATE_TEAM_ID
  const isCaregiver = user.isUserCaregiver()
  const isPatientWithNoTeams = user.isUserPatient() && getMedicalTeams().length === 0

  const getGridWidgetSize = (): number => {
    if (isMobileBreakpoint) {
      return RESPONSIVE_GRID_FULL_WIDTH
    }
    if (isCaregiver || isSelectedTeamPrivate || isPatientWithNoTeams) {
      return RESPONSIVE_GRID_HALF_WIDTH
    }
    return RESPONSIVE_GRID_FOUR_COLUMNS
  }

  const gridWidgetSize = getGridWidgetSize()

  return (
    <Grid
      data-testid="patient-dashboard"
      container
      spacing={2}
      rowSpacing={2}
      paddingX={3}
    >
      <Grid
        item
        xs={12}
        display="flex"
        alignItems="center"
      >
        <AccessTime fontSize="small" />
        <Typography
          variant="subtitle2"
          sx={{ marginLeft: theme.spacing(1), fontStyle: 'italic' }}
        >
          {t('data-period-text')}
        </Typography>
      </Grid>

      <Grid item xs={gridWidgetSize}>
        <PatientStatisticsWidget
          medicalData={medicalData}
          bgPrefs={bgPrefs}
          dateFilter={dateFilter}
        >
          <Stats
            bgPrefs={bgPrefs}
            bgSource={DatumType.Cbg}
            chartType="patientStatistics"
            loading={loading}
            dataUtil={dataUtil}
            endpoints={endpoints}
            parametersConfig={medicalData?.pumpSettings[0]?.payload?.parameters}
          />
        </PatientStatisticsWidget>
      </Grid>

      <Grid item xs={gridWidgetSize}>
        <DeviceUsageWidget
          bgPrefs={bgPrefs}
          dateFilter={dateFilter}
          medicalDataService={medicalDataService}
          patient={patient}
          timePrefs={timePrefs}
        />
      </Grid>

      {!isCaregiver && !isPatientWithNoTeams && !isSelectedTeamPrivate &&
        <>
          <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
            {user.isUserHcp() && <MonitoringAlertsCard patient={patient} />}
            <MedicalFilesWidget patient={patient} />
          </Grid>

          <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
            <ChatWidget
              patient={patient}
            />
          </Grid>
        </>
      }
    </Grid>
  )
}
