/*
 * Copyright (c) 2022, Diabeloop
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

import { Theme } from '@mui/material/styles'
import makeStyles from '@mui/styles/makeStyles'
import { Box, CardHeader, IconButton } from '@mui/material'
import TuneIcon from '@mui/icons-material/Tune'
import AnnouncementIcon from '@mui/icons-material/Announcement'

import Card from '@mui/material/Card'
import { Patient } from '../../lib/data/patient'
import PatientAlarmDialog from './patient-alarm-dialog'
import { useAuth } from '../../lib/auth'

const alarmCardStyles = makeStyles((theme: Theme) => {
  return {
    alertColor: {
      color: theme.palette.warning.main
    },
    eventCard: {
      width: '400px',
      height: '350px'
    },
    eventCardHeader: {
      textTransform: 'uppercase',
      backgroundColor: 'var(--card-header-background-color)'
    },
    headerIcon: {
      display: 'flex'
    }
  }
})

export interface AlarmCardProps {
  patient: Patient
}

function AlarmCard(props: AlarmCardProps): JSX.Element {
  const { t } = useTranslation('yourloops')
  const { patient } = props
  const authHook = useAuth()
  const loggedInUser = authHook.user
  const classes = alarmCardStyles()
  const [showPatientAlarmDialog, setShowPatientAlarmDialog] = useState(false)
  const timeSpentAwayFromTargetActive = patient.metadata.alarm.timeSpentAwayFromTargetActive
  const frequencyOfSevereHypoglycemiaActive = patient.metadata.alarm.frequencyOfSevereHypoglycemiaActive
  const nonDataTransmissionActive = patient.metadata.alarm.nonDataTransmissionActive
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
    <Card className={classes.eventCard} id="alarm-card" data-testid="alarm-card">
      <CardHeader
        id="alarm-card-header-id"
        avatar={
          <AnnouncementIcon
            className={noActiveAlarm ? 'headerIcon' : `${classes.alertColor} ${classes.headerIcon}`}
          />
        }
        className={classes.eventCardHeader}
        title={`${t('events')}${numberOfAlarmsLabel}`}
        action={
          <div>
            {!loggedInUser?.isUserPatient() &&
              <IconButton
                id="configure-icon-button-id"
                aria-label="settings"
                data-testid="alarm-card-configure-button"
                onClick={() => setShowPatientAlarmDialog(true)}
                size="large">
                <TuneIcon />
              </IconButton>
            }
          </div>
        }
      />
      <Box marginTop={2} marginLeft={1} marginRight={1}>
        <Box fontSize="16px" marginBottom={1} fontWeight={600} className={noActiveAlarm ? '' : classes.alertColor}>
          {t('current-events')}
        </Box>
        <Box
          id="time-away-target-alarm-id"
          display="flex"
          fontSize="13px"
          className={timeSpentAwayFromTargetActive ? classes.alertColor : ''}
        >
          {t('time-out-of-range-target')}
          <Box
            marginLeft="auto"
          >
            {`${Math.round(patient.metadata.alarm.timeSpentAwayFromTargetRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="severe-hypo-alarm-id"
          display="flex"
          fontSize="13px"
          className={frequencyOfSevereHypoglycemiaActive ? classes.alertColor : ''}
        >
          {t('alert-hypoglycemic')}
          <Box
            marginLeft="auto"
          >
            {`${Math.round(patient.metadata.alarm.frequencyOfSevereHypoglycemiaRate * 10) / 10}%`}
          </Box>
        </Box>
        <Box
          id="non-data-transmission-alarm-id"
          display="flex" fontSize="13px"
          className={nonDataTransmissionActive ? classes.alertColor : ''}
        >
          {t('data-not-transferred')}
          <Box marginLeft="auto">{`${Math.round(patient.metadata.alarm.nonDataTransmissionRate * 10) / 10}%`}</Box>
        </Box>
      </Box>
      {showPatientAlarmDialog &&
        <PatientAlarmDialog patient={patient} onClose={onClosePatientAlarmDialog} />
      }
    </Card>
  )
}

export default AlarmCard
