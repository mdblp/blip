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

import PatientAlarmDialog from './patient-alarm-dialog'
import { type Patient } from '../../lib/patient/models/patient.model'
import GenericDashboardCard from '../dashboard-widgets/generic-dashboard-card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import { useAuth } from '../../lib/auth'

const alarmCardStyles = makeStyles()((theme) => {
  return {
    alertColor: {
      color: theme.palette.warning.main
    }
  }
})

export interface AlarmCardProps {
  patient: Patient
}

function AlarmCard(props: AlarmCardProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { patient } = props
  const { user } = useAuth()
  const { classes } = alarmCardStyles()
  const [showPatientAlarmDialog, setShowPatientAlarmDialog] = useState(false)
  const timeSpentAwayFromTargetActive = patient.alarms.timeSpentAwayFromTargetActive
  const frequencyOfSevereHypoglycemiaActive = patient.alarms.frequencyOfSevereHypoglycemiaActive
  const nonDataTransmissionActive = patient.alarms.nonDataTransmissionActive
  const noActiveAlarm = !timeSpentAwayFromTargetActive && !frequencyOfSevereHypoglycemiaActive && !nonDataTransmissionActive

  const buildNumberOfAlarmsLabel = (): string => {
    if (noActiveAlarm) {
      return ''
    }
    const number = [timeSpentAwayFromTargetActive, frequencyOfSevereHypoglycemiaActive, nonDataTransmissionActive].filter(value => value).length
    return ` (+${number})`
  }

  const numberOfAlarmsLabel = buildNumberOfAlarmsLabel()

  const onClosePatientAlarmDialog = (): void => {
    setShowPatientAlarmDialog(false)
  }

  return (
    <GenericDashboardCard
      avatar={<AnnouncementIcon className={noActiveAlarm ? '' : classes.alertColor} />}
      title={`${t('events')}${numberOfAlarmsLabel}`}
      data-testid="alarm-card"
      action={user.isUserHcp() &&
        <IconButton
          id="configure-icon-button-id"
          aria-label={t('configure-alarms')}
          data-testid="alarm-card-configure-button"
          onClick={() => setShowPatientAlarmDialog(true)}
          size="small"
        >
          <TuneIcon />
        </IconButton>
      }
    >
      <CardContent>
        <Typography className={`${noActiveAlarm ? '' : classes.alertColor} bold`}>
          {t('current-events')}
        </Typography>
        <Box
          id="time-away-target-alarm-id"
          display="flex"
          justifyContent="space-between"
          fontSize="13px"
          className={timeSpentAwayFromTargetActive ? classes.alertColor : ''}
        >
          {t('time-out-of-range-target')}
          <Box>
            {`${Math.round(patient.alarms.timeSpentAwayFromTargetRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="severe-hypo-alarm-id"
          display="flex"
          fontSize="13px"
          justifyContent="space-between"
          className={frequencyOfSevereHypoglycemiaActive ? classes.alertColor : ''}
        >
          {t('alert-hypoglycemic')}
          <Box>
            {`${Math.round(patient.alarms.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="non-data-transmission-alarm-id"
          display="flex"
          justifyContent="space-between"
          fontSize="13px"
          className={nonDataTransmissionActive ? classes.alertColor : ''}
        >
          {t('data-not-transferred')}
          <Box>{`${Math.round(patient.alarms.nonDataTransmissionRate * 10) / 10}%`}</Box>
        </Box>
      </CardContent>
      {showPatientAlarmDialog &&
        <PatientAlarmDialog patient={patient} onClose={onClosePatientAlarmDialog} />
      }
    </GenericDashboardCard>
  )
}

export default AlarmCard
