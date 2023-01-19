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
import PatientStatistics from 'blip/app/components/chart/patientStatistics.js'
import DeviceUsage from 'blip/app/components/chart/deviceUsage.js'
import MedicalDataService, { TimePrefs } from 'medical-domain'
import { ChartPrefs } from './models/chart-prefs.model'
import { BgPrefs } from './models/bg-prefs.model'
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
  const endpoints = [
    moment.utc(epochDate - msRange).toISOString(), // start
    moment.utc(epochDate).toISOString() // end
  ]
  const showRemoteMonitoringWidget = user.isUserHcp() && getMedicalTeams().some(team => team.monitoring?.enabled)
  const gridWidgetSize = showRemoteMonitoringWidget ? 4 : 6

  return (
    <Grid
      id="patient-dashboard"
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
        <AccessTime fontSize="small" className="subnav-icon" />
        <Typography id="subnav-period-label" variant="body1">{t('dashboard-header-period-text')}</Typography>
      </Grid>
      <Grid item xs={gridWidgetSize}>
        <PatientStatistics
          id="dashboard-patient-statistics"
          bgPrefs={bgPrefs}
          bgSource={dataUtil.bgSource}
          chartPrefs={chartPrefs}
          chartType="patientStatistics"
          dataUtil={dataUtil}
          endpoints={endpoints}
          loading={loading}
          parametersConfig={medicalData?.pumpSettings[0]?.payload?.parameters}
        />
      </Grid>
      <Grid item xs={gridWidgetSize}>
        <DeviceUsage
          id="dashboard-device-usage"
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
