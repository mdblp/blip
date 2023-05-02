/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { makeStyles } from 'tss-react/mui'
import { Box, IconButton } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import AnnouncementIcon from '@mui/icons-material/Announcement'

import PatientMonitoringAlertDialog from './patient-monitoring-alert-dialog'
import { type Patient } from '../../lib/patient/models/patient.model'
import GenericDashboardCard from '../dashboard-widgets/generic-dashboard-card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'

const monitoringAlertCardStyles = makeStyles()((theme) => {
  return {
    alertColor: {
      color: theme.palette.warning.main
    }
  }
})

export interface MonitoringAlertCardProps {
  patient: Patient
}

function MonitoringAlertCard(props: MonitoringAlertCardProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { patient } = props
  const { user } = useAuth()
  const { classes } = monitoringAlertCardStyles()
  const [showPatientMonitoringAlertDialog, setShowPatientMonitoringAlertDialog] = useState(false)
  const monitoringAlerts = patient.monitoringAlerts
  const timeSpentAwayFromTargetActive = monitoringAlerts.timeSpentAwayFromTargetActive
  const frequencyOfSevereHypoglycemiaActive = monitoringAlerts.frequencyOfSevereHypoglycemiaActive
  const nonDataTransmissionActive = monitoringAlerts.nonDataTransmissionActive
  const noActiveMonitoringAlert = !timeSpentAwayFromTargetActive && !frequencyOfSevereHypoglycemiaActive && !nonDataTransmissionActive

  const buildNumberOfMonitoringAlertsLabel = (): string => {
    if (noActiveMonitoringAlert) {
      return ''
    }
    const number = [timeSpentAwayFromTargetActive, frequencyOfSevereHypoglycemiaActive, nonDataTransmissionActive].filter(value => value).length
    return ` (+${number})`
  }

  const numberOfMonitoringAlertsLabel = buildNumberOfMonitoringAlertsLabel()

  const onClosePatientMonitoringAlertDialog = (): void => {
    setShowPatientMonitoringAlertDialog(false)
  }

  return (
    <GenericDashboardCard
      avatar={<AnnouncementIcon className={noActiveMonitoringAlert ? '' : classes.alertColor} />}
      title={`${t('events')}${numberOfMonitoringAlertsLabel}`}
      data-testid="monitoring-alerts-card"
      action={user.isUserHcp() &&
        <IconButton
          id="configure-icon-button-id"
          aria-label={t('configure-monitoring-alerts')}
          data-testid="monitoring-alert-card-configure-button"
          onClick={() => { setShowPatientMonitoringAlertDialog(true) }}
          size="small"
        >
          <TuneIcon />
        </IconButton>
      }
    >
      <CardContent>
        <Typography className={`${noActiveMonitoringAlert ? '' : classes.alertColor} bold`}>
          {t('current-events')}
        </Typography>
        <Box
          id="time-away-target-monitoring-alert-id"
          display="flex"
          justifyContent="space-between"
          fontSize="13px"
          className={timeSpentAwayFromTargetActive ? classes.alertColor : ''}
        >
          {t('time-out-of-range-target')}
          <Box>
            {`${Math.round(patient.monitoringAlerts.timeSpentAwayFromTargetRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="severe-hypo-monitoring-alert-id"
          display="flex"
          fontSize="13px"
          justifyContent="space-between"
          className={frequencyOfSevereHypoglycemiaActive ? classes.alertColor : ''}
        >
          {t('alert-hypoglycemic')}
          <Box>
            {`${Math.round(patient.monitoringAlerts.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="non-data-transmission-monitoring-alert-id"
          display="flex"
          justifyContent="space-between"
          fontSize="13px"
          className={nonDataTransmissionActive ? classes.alertColor : ''}
        >
          {t('data-not-transferred')}
          <Box>{`${Math.round(patient.monitoringAlerts.nonDataTransmissionRate * 10) / 10}%`}</Box>
        </Box>
      </CardContent>
      {showPatientMonitoringAlertDialog &&
        <PatientMonitoringAlertDialog patient={patient} onClose={onClosePatientMonitoringAlertDialog} />
      }
    </GenericDashboardCard>
  )
}

export default MonitoringAlertCard
