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
import DeviceUsage from 'blip/app/components/chart/deviceUsage.js'
import { type TimePrefs } from 'medical-domain'
import type MedicalDataService from 'medical-domain'
import { type ChartPrefs } from './models/chart-prefs.model'
import { type BgPrefs } from 'dumb'
import type DataUtil from 'tidepool-viz/src/utils/data'
import moment, { type Moment } from 'moment-timezone'
import type metrics from '../../lib/metrics'
import Grid from '@mui/material/Grid'
import AccessTime from '@mui/icons-material/AccessTime'
import { useTranslation } from 'react-i18next'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'
import RemoteMonitoringWidget from './remote-monitoring-widget'
import useMediaQuery from '@mui/material/useMediaQuery'
import {
  RESPONSIVE_GRID_FOUR_COLUMNS,
  RESPONSIVE_GRID_FULL_WIDTH,
  RESPONSIVE_GRID_HALF_WIDTH,
  RESPONSIVE_GRID_THREE_COLUMNS
} from '../../css/css-utils'
import { PatientStatisticsWidget } from './patient-statistics-widget'
import Stats from 'blip/app/components/chart/stats'
import MedicalFilesWidget from './medical-files/medical-files-widget'
import AlarmCard from '../alarm/alarm-card'
import { makeStyles } from 'tss-react/mui'
import ChatWidget from '../chat/chat-widget'

interface PatientDashboardProps {
  bgPrefs: BgPrefs
  chartPrefs: ChartPrefs
  dataUtil: typeof DataUtil
  epochDate: number
  loading: boolean
  medicalDataService: MedicalDataService
  msRange: number
  patient: Patient
  timePrefs: TimePrefs
  trackMetric: typeof metrics.send
  onSwitchToDaily: (dateTime: Moment | Date | number | null) => void
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
    chartPrefs,
    dataUtil,
    epochDate,
    loading,
    medicalDataService,
    msRange,
    patient,
    timePrefs,
    trackMetric,
    onSwitchToDaily
  } = props
  const { user } = useAuth()
  const { medicalData } = medicalDataService
  const { t } = useTranslation()
  const { classes, theme } = useStyle()
  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))
  const endpoints = [
    moment.utc(epochDate - msRange).toISOString(), // start
    moment.utc(epochDate).toISOString() // end
  ]
  const dateFilter = {
    start: epochDate - msRange,
    end: epochDate
  }
  const isPatientMonitored = !!patient?.monitoring?.enabled

  const getGridWidgetSize = (): number => {
    if (isMobileBreakpoint) {
      return RESPONSIVE_GRID_FULL_WIDTH
    }
    if (isPatientMonitored) {
      return RESPONSIVE_GRID_FOUR_COLUMNS
    }
    if (user.isUserHcp() && !isPatientMonitored) {
      return RESPONSIVE_GRID_THREE_COLUMNS
    }
    return RESPONSIVE_GRID_HALF_WIDTH
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
          bgSource={dataUtil.bgSource}
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
          trackMetric={trackMetric}
          dataUtil={dataUtil}
          onSwitchToDaily={onSwitchToDaily}
          medicalData={medicalData}
          dateFilter={dateFilter}
        />
      </Grid>

      {isPatientMonitored &&
        <React.Fragment>
          <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
            <AlarmCard patient={patient} />
            <MedicalFilesWidget patient={patient} />
          </Grid>

          <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
            <ChatWidget
              patient={patient}
              userId={user.id}
              userRole={user.role}
            />
            <RemoteMonitoringWidget patient={patient} />
          </Grid>
        </React.Fragment>
      }

      {user.isUserHcp() && !isPatientMonitored &&
        <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
          <RemoteMonitoringWidget patient={patient} />
        </Grid>
      }
    </Grid>
  )
}
