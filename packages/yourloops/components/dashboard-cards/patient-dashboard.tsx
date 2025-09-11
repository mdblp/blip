/*
 * Copyright (c) 2023-2025, Diabeloop
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
import { type DateFilter, type MedicalData } from 'medical-domain'
import { type BgPrefs } from 'dumb'
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
import MedicalFilesCard from './medical-files/medical-files-card'
import MonitoringAlertsCard from '../monitoring-alert/monitoring-alerts-card'
import { makeStyles } from 'tss-react/mui'
import ChatWidget from '../chat/chat-widget'
import { DEFAULT_DASHBOARD_TIME_RANGE_DAYS } from '../patient-data/patient-data.utils'
import { DevicesColumn } from './devices/devices-column'
import { useParams } from 'react-router-dom'
import TeamUtils from '../../lib/team/team.util'
import { useTeam } from '../../lib/team'
import { PatientStatistics } from '../statistics/patient-statistics'

interface PatientDashboardProps {
  bgPrefs: BgPrefs
  medicalDataService: MedicalDataService
  patient: Patient
  goToDailySpecificDate: (date: Date) => void
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
    goToDailySpecificDate,
    medicalDataService,
    patient
  } = props
  const { user } = useAuth()
  const { teamId } = useParams()
  const { getMedicalTeams } = useTeam()
  const { medicalData } = medicalDataService
  const { t } = useTranslation()
  const { classes, theme } = useStyle()

  const isMobileBreakpoint: boolean = useMediaQuery(theme.breakpoints.only('xs'))

  /** Compute the date filter to be applied to the statistics and devices cards.
   *
   * We're showing 14 days of data, excluding the current day.
   * So in the nominal case, we're showing from today-15 to today-1 days of data.
   *
   * If we're not having data for today, yesterday or the day before yesterday, we extend the range backwards
   * to still show 14 days of data.
   *
   * @param data the medical data to compute the date filter from
   * @returns the date filter to be applied to the statistics and devices cards
   */
  const computeDateFilter = (data: MedicalData): DateFilter => {
    const now = new Date()
    const dateRangeData = [...data.smbg, ...data.cbg]
    const localDates = dateRangeData
      .map((bgData) => bgData.normalTime)
      .sort((a, b) => a.localeCompare(b))

    /* If we have data */
    if (localDates.length > 0) {
      const mostRecentDate = new Date(localDates[localDates.length - 1])
      /* If we have data for today, we can just return the nominal range */
      if (mostRecentDate.getDate() == now.getDate() && mostRecentDate.getMonth() == now.getMonth()) {
        /* If we have data for today, we can just return the nominal range
        * Nominal range for 14 days of data is:
        * Start: today - 14 days => with 0h 0 min 0 sec 0 ms to get the full day of this first day
        * End: today - 1 day with 23h 59 min 59 sec 999ms to get the full day of yesterday */
        const startDate = new Date()
        const endDate = new Date()
        startDate.setDate(startDate.getDate() - DEFAULT_DASHBOARD_TIME_RANGE_DAYS)
        startDate.setHours(0, 0, 0, 0)
        endDate.setDate(endDate.getDate() - 1)
        endDate.setHours(23, 59, 59, 999)
        console.log(`startDate=${startDate.toISOString()} endDate=${endDate.toISOString()}`)
        return {
          start: startDate.valueOf(),
          end: endDate.valueOf()
        }
      } else {
        /* If we have no data for today, we can just get the mostRecentDate as endDate and the last 14 days
         from this date as startDate.
         Start: mostRecentDate with 23h 59 min 59 sec 999ms to get the full day of last day of data
         End: mostRecentDate - 13 days, since we include mostRecentDate data */
        const endDate = mostRecentDate
        endDate.setHours(23, 59, 59, 999)
        const startDate = new Date(mostRecentDate)
        startDate.setDate(startDate.getDate() - DEFAULT_DASHBOARD_TIME_RANGE_DAYS + 1)
        startDate.setHours(0, 0, 0, 0)
        console.log(`startDate=${startDate.toISOString()} endDate=${endDate.toISOString()}`)
        return {
          start: startDate.valueOf(),
          end: endDate.valueOf()
        }
      }
    }

    /* If we don't have data return 0 */
    const dateRangeSet = new Set(localDates)
    if (dateRangeSet.size === 0) {
      return {
        start: 0,
        end: 0
      }
    }
  }

  const dateFilter = computeDateFilter(medicalData)
  const isSelectedTeamPrivate = TeamUtils.isPrivate(teamId)
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
        <PatientStatistics
          medicalData={medicalData}
          bgPrefs={bgPrefs}
          dateFilter={dateFilter}
        />
      </Grid>

      <Grid item xs={gridWidgetSize}>
        <DevicesColumn
          dateFilter={dateFilter}
          goToDailySpecificDate={goToDailySpecificDate}
          medicalDataService={medicalDataService}
        />
      </Grid>

      {!isCaregiver && !isPatientWithNoTeams && !isSelectedTeamPrivate &&
        <>
          <Grid item xs={gridWidgetSize} className={classes.gridItemContainer}>
            {user.isUserHcp() &&
              <MonitoringAlertsCard patient={patient} />
            }
            <MedicalFilesCard patient={patient} />
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
