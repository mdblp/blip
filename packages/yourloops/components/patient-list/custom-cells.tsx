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
import Box from '@mui/material/Box'
import { useAuth } from '../../lib/auth'
import { useTheme } from '@mui/material/styles'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import IconActionButton from '../buttons/icon-action'
import PersonRemoveIcon from '../icons/mui/person-remove-icon'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FlagIcon from '@mui/icons-material/Flag'
import FlagOutlineIcon from '@mui/icons-material/FlagOutlined'
import { type Patient } from '../../lib/patient/models/patient.model'
import { MonitoringAlertType } from './models/enums/monitoring-alert-type.enum'
import { type MonitoringAlerts } from '../../lib/patient/models/monitoring-alerts.model'
import Badge from '@mui/material/Badge'
import { TimeSpentOufOfRangeIcon } from '../icons/diabeloop/time-spent-ouf-of-range-icon'
import { NoDataIcon } from '../icons/diabeloop/no-data-icon'
import { HypoglycemiaIcon } from '../icons/diabeloop/hypoglycemia-icon'
import { NoMessageIcon } from '../icons/diabeloop/no-message-icon'
import { MessageIcon } from '../icons/diabeloop/message-icon'

interface FlagCellProps {
  isFlagged: boolean
  patient: Patient
}

interface MonitoringAlertsCellProps {
  monitoringAlerts: MonitoringAlerts
}

interface MessageCellProps {
  hasNewMessages: boolean
}

interface ActionsCellProps {
  patient: Patient
  onClickRemove: (patientId: string) => void
}

export const FlagIconCell: FunctionComponent<FlagCellProps> = ({ isFlagged, patient }) => {
  const { flagPatient } = useAuth()
  const { t } = useTranslation()
  const flagPatientLabel = t('flag-patient', { patientEmail: patient.profile.email })
  const unflagPatientLabel = t('unflag-patient', { patientEmail: patient.profile.email })

  const onClickFlag = async (): Promise<void> => {
    await flagPatient(patient.userid)
  }

  return (
    <IconActionButton
      icon={isFlagged
        ? <FlagIcon
          titleAccess={unflagPatientLabel}
          aria-label={unflagPatientLabel}
        />
        : <FlagOutlineIcon
          titleAccess={flagPatientLabel}
          aria-label={flagPatientLabel}
        />}
      color="inherit"
      onClick={onClickFlag}
    />
  )
}

export const PendingIconCell: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t('pending-invitation')}
      aria-label={t('pending-invitation')}
    >
      <Box display="flex">
        <AccessTimeIcon titleAccess={t('pending-invitation')} />
      </Box>
    </Tooltip>
  )
}

const getMonitoringAlertActiveValueByType = (monitoringAlerts: MonitoringAlerts, monitoringAlertType: MonitoringAlertType): boolean => {
  switch (monitoringAlertType) {
    case MonitoringAlertType.FrequencyOfSevereHypoglycemia:
      return monitoringAlerts.frequencyOfSevereHypoglycemiaActive
    case MonitoringAlertType.NonDataTransmission:
      return monitoringAlerts.nonDataTransmissionActive
    case MonitoringAlertType.TimeSpentAwayFromTarget:
      return monitoringAlerts.timeSpentAwayFromTargetActive
  }
}

export const MonitoringAlertsCell: FunctionComponent<MonitoringAlertsCellProps> = ({ monitoringAlerts }) => {
  const { t } = useTranslation()
  const theme = useTheme()

  const isTimeSpentAwayFromTargetAlertActive = getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.TimeSpentAwayFromTarget)
  const isFrequencyOfSevereHypoglycemiaAlertActive = getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.FrequencyOfSevereHypoglycemia)
  const isNonDataTransmissionAlertActive = getMonitoringAlertActiveValueByType(monitoringAlerts, MonitoringAlertType.NonDataTransmission)

  return (
    <>
      <Tooltip title={t('time-out-of-range-target-tooltip')}>
        <TimeSpentOufOfRangeIcon
          color={isTimeSpentAwayFromTargetAlertActive ? 'inherit' : 'disabled'}
        />
      </Tooltip>
      <Tooltip title={t('hypoglycemia-tooltip')}>
        <HypoglycemiaIcon
          sx={{ marginLeft: theme.spacing(1) }}
          color={isFrequencyOfSevereHypoglycemiaAlertActive ? 'error' : 'disabled'}
        />
      </Tooltip>
      <Tooltip title={t('data-not-transferred-tooltip')}>
        <NoDataIcon
          sx={{ marginLeft: theme.spacing(1) }}
          color={isNonDataTransmissionAlertActive ? 'inherit' : 'disabled'}
        />
      </Tooltip>
    </>
  )
}

export const MessageCell: FunctionComponent<MessageCellProps> = ({ hasNewMessages }) => {
  const { t } = useTranslation()
  const newUnreadMessagesLabel = t('new-unread-messages')
  const noNewMessagesLabel = t('no-new-messages')
  const title = hasNewMessages ? newUnreadMessagesLabel : noNewMessagesLabel

  return (
    <Tooltip
      title={title}
      aria-label={title}
    >
      <Box display="flex" justifyContent="center">
        {hasNewMessages
          ? <Badge color="warning" variant="dot">
            <MessageIcon
              titleAccess={newUnreadMessagesLabel}
              aria-label={newUnreadMessagesLabel}
              color="inherit"
            />
          </Badge>
          : <NoMessageIcon
            titleAccess={noNewMessagesLabel}
            aria-label={noNewMessagesLabel}
            color="disabled"
          />
        }
      </Box>
    </Tooltip>
  )
}

export const ActionsCell: FunctionComponent<ActionsCellProps> = ({ patient, onClickRemove }) => {
  const { t } = useTranslation()
  const removePatientLabel = t('button-remove-patient')

  return (
    <Tooltip
      title={removePatientLabel}
      aria-label={removePatientLabel}
    >
      <Box display="flex" justifyContent="end">
        <IconActionButton
          data-action="remove-patient"
          data-testid={`${removePatientLabel} ${patient.profile.email}`}
          aria-label={`${removePatientLabel} ${patient.profile.email}`}
          icon={<PersonRemoveIcon />}
          color="inherit"
          onClick={() => {
            onClickRemove(patient.userid)
          }}
        />
      </Box>
    </Tooltip>
  )
}
