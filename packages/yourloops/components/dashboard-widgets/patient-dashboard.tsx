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

import React, { FunctionComponent } from 'react'
import { Patient } from '../../lib/patient/models/patient.model'
import DeviceUsage from 'blip/app/components/chart/deviceUsage.js'
import MedicalDataService, { TimePrefs } from 'medical-domain'
import { ChartPrefs } from './models/chart-prefs.model'
import { BgPrefs } from 'dumb'
import DataUtil from 'tidepool-viz/src/utils/data'
import moment, { Moment } from 'moment-timezone'
import { PermsOfLoggedInUser } from './models/perms-of-loggedin-user.model'
import metrics from '../../lib/metrics'
import Grid from '@mui/material/Grid'
import AccessTime from '@mui/icons-material/AccessTime'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'
import { useTeam } from '../../lib/team'
import RemoteMonitoringWidget from './remote-monitoring-widget'
import { useTheme } from '@mui/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  RESPONSIVE_GRID_FOUR_COLUMNS,
  RESPONSIVE_GRID_FULL_WIDTH,
  RESPONSIVE_GRID_HALF_WIDTH
} from '../../css/css-utils'
import { PatientStatisticsWidget } from './patient-statistics-widget'
import Stats from 'blip/app/components/chart/stats'

interface PatientDashboardProps {
  bgPrefs: BgPrefs
  chartPrefs: ChartPrefs
  dataUtil: typeof DataUtil
  epochDate: number
  loading: boolean
  medicalDataService: MedicalDataService
  msRange: number
  patient: Patient
  permsOfLoggedInUser: PermsOfLoggedInUser
  timePrefs: TimePrefs
  trackMetric: typeof metrics.send
  onSwitchToDaily: (dateTime: Moment | Date | number | null) => void
}

const PatientDashboard: FunctionComponent<PatientDashboardProps> = (props) => {
  const {
    bgPrefs,
    chartPrefs,
    dataUtil,
    epochDate,
    loading,
    medicalDataService,
    msRange,
    patient,
    permsOfLoggedInUser,
    timePrefs,
    trackMetric,
    onSwitchToDaily
  } = props
  const { user } = useAuth()
  const { getMedicalTeams } = useTeam()
  const { medicalData } = medicalDataService
  const { t } = useTranslation()
  const theme = useTheme()
  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const endpoints = [
    moment.utc(epochDate - msRange).toISOString(), // start
    moment.utc(epochDate).toISOString() // end
  ]
  const showRemoteMonitoringWidget = user.isUserHcp() && getMedicalTeams().some(team => team.monitoring?.enabled)
  const gridWidgetSize = isMobileBreakpoint ? RESPONSIVE_GRID_FULL_WIDTH : showRemoteMonitoringWidget ? RESPONSIVE_GRID_FOUR_COLUMNS : RESPONSIVE_GRID_HALF_WIDTH

  return (
    <Grid
      data-testid="patient-dashboard"
      container
      spacing={5}
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
          {t('dashboard-header-period-text')}
        </Typography>
      </Grid>
      <Grid item xs={gridWidgetSize}>
        <PatientStatisticsWidget
          dataUtil={dataUtil}
          bgPrefs={bgPrefs}
          endpoints={endpoints}
        >
          <Stats
            bgPrefs={bgPrefs}
            bgSource={dataUtil.bgSource}
            chartPrefs={chartPrefs}
            chartType="patientStatistics"
            dataUtil={dataUtil}
            endpoints={endpoints}
            loading={loading}
            parametersConfig={medicalData?.pumpSettings[0]?.payload?.parameters}
          />
        </PatientStatisticsWidget>
      </Grid>
      <Grid item xs={gridWidgetSize}>
        <DeviceUsage
          bgPrefs={bgPrefs}
          timePrefs={timePrefs}
          patient={patient}
          tidelineData={medicalDataService}
          permsOfLoggedInUser={permsOfLoggedInUser}
          trackMetric={trackMetric}
          dataUtil={dataUtil}
          chartPrefs={chartPrefs}
          endpoints={endpoints}
          loading={loading}
          onSwitchToDaily={onSwitchToDaily}
        />
      </Grid>
      {showRemoteMonitoringWidget &&
        <Grid item xs={gridWidgetSize}>
          <RemoteMonitoringWidget patient={patient} />
        </Grid>
      }
    </Grid>
  )
}

export default PatientDashboard
