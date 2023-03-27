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
import ReportProblemIcon from '@mui/icons-material/ReportProblem'
import { useAuth } from '../../lib/auth'
import { useTheme } from '@mui/material/styles'
import EmailIcon from '@mui/icons-material/Email'
import EmailOpenIcon from '../icons/email-open-icon'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'
import IconActionButton from '../buttons/icon-action'
import PersonRemoveIcon from '../icons/person-remove-icon'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import FlagIcon from '@mui/icons-material/Flag'
import FlagOutlineIcon from '@mui/icons-material/FlagOutlined'
import { type Patient } from '../../lib/patient/models/patient.model'
import { formatAlarmSettingThreshold } from '../../lib/utils'

interface FlagCellProps {
  isFlagged: boolean
  patient: Patient
}

interface AlarmPercentageCellProps {
  isAlarmActive: boolean
  value: number
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

  const onClickFlag = async (): Promise<void> => {
    await flagPatient(patient.userid)
  }

  return (
    <IconActionButton
      icon={isFlagged
        ? <FlagIcon
          titleAccess={t('unflag-patient', { patientEmail: patient.profile.email }) }
          aria-label={t('unflag-patient', { patientEmail: patient.profile.email }) }
        />
        : <FlagOutlineIcon
          titleAccess={t('flag-patient', { patientEmail: patient.profile.email }) }
          aria-label={t('flag-patient', { patientEmail: patient.profile.email }) }
        />}
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
        <AccessTimeIcon titleAccess="pending-icon" />
      </Box>
    </Tooltip>
  )
}

export const AlarmPercentageCell: FunctionComponent<AlarmPercentageCellProps> = ({ isAlarmActive, value }) => {
  const { user } = useAuth()
  const theme = useTheme()

  return (
    <Box
      display="flex"
      alignItems="end"
      sx={{ color: user.isUserHcp() && isAlarmActive ? theme.palette.warning.main : 'inherit' }}
    >
      {formatAlarmSettingThreshold(value)}
      {user.isUserHcp() && isAlarmActive &&
        <ReportProblemIcon sx={{ marginLeft: theme.spacing(1) }} color="warning" />
      }
    </Box>
  )
}

export const MessageCell: FunctionComponent<MessageCellProps> = ({ hasNewMessages }) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t(hasNewMessages ? 'unread-messages' : 'no-new-messages')}
      aria-label={t(hasNewMessages ? 'unread-messages' : 'no-new-messages')}
    >
      <Box display="flex" justifyContent="center">
        {hasNewMessages
          ? <EmailIcon
            titleAccess={t('new-unread-messages')}
            aria-label={t('new-unread-messages')}
            color="primary"
          />
          : <EmailOpenIcon
            titleAccess={t('no-new-messages')}
            aria-label={t('no-new-messages')}
          />
        }
      </Box>
    </Tooltip>
  )
}

export const ActionsCell: FunctionComponent<ActionsCellProps> = ({ patient, onClickRemove }) => {
  const { t } = useTranslation()

  return (
    <Tooltip
      title={t('button-remove-patient')}
      aria-label={t('button-remove-patient')}
    >
      <Box display="flex" justifyContent="end">
        <IconActionButton
          data-action="remove-patient"
          data-testid={`${t('button-remove-patient')} ${patient.profile.email}`}
          aria-label={`${t('button-remove-patient')} ${patient.profile.email}`}
          icon={<PersonRemoveIcon />}
          color="inherit"
          onClick={() => { onClickRemove(patient.userid) }}
        />
      </Box>
    </Tooltip>
  )
}
