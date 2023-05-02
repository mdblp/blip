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
import Badge from '@mui/material/Badge'
import { TimeSpentOufOfRangeIcon } from '../icons/diabeloop/time-spent-ouf-of-range-icon'
import { NoDataIcon } from '../icons/diabeloop/no-data-icon'
import { HypoglycemiaIcon } from '../icons/diabeloop/hypoglycemia-icon'
import { NoMessageIcon } from '../icons/diabeloop/no-message-icon'
import { MessageIcon } from '../icons/diabeloop/message-icon'
import { Unit } from 'medical-domain'

interface FlagCellProps {
  isFlagged: boolean
  patient: Patient
}

interface MonitoringAlertsCellProps {
  patient: Patient
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

export const MonitoringAlertsCell: FunctionComponent<MonitoringAlertsCellProps> = ({ patient }) => {
  const { t } = useTranslation()
  const theme = useTheme()
  const monitoringAlerts = patient.monitoringAlerts

  // This default value assignment will be removed in YLP-2324
  // (it is only necessary because monitoring features have not yet been enabled for every patient)
  const monitoringParameters = patient.monitoring?.parameters ?? {
    bgUnit: Unit.MilligramPerDeciliter,
    lowBg: 70,
    highBg: 100,
    outOfRangeThreshold: 10,
    veryLowBg: 65,
    hypoThreshold: 5,
    nonDataTxThreshold: 15,
    reportingPeriod: 55
  }
  const unit = monitoringParameters.bgUnit
  const isTimeSpentAwayFromTargetAlertActive = monitoringAlerts.timeSpentAwayFromTargetActive
  const isFrequencyOfSevereHypoglycemiaAlertActive = monitoringAlerts.frequencyOfSevereHypoglycemiaActive
  const isNonDataTransmissionAlertActive = monitoringAlerts.nonDataTransmissionActive
  const timeSpentAwayFromTargetRate = Math.round(monitoringAlerts.timeSpentAwayFromTargetRate * 10) / 10
  const frequencyOfSevereHypoglycemiaRate = Math.round(monitoringAlerts.frequencyOfSevereHypoglycemiaRate * 10) / 10
  const nonDataTransmissionRate = Math.round(monitoringAlerts.nonDataTransmissionRate * 10) / 10
  const sharedTooltip = t('monitoring-alerts-shared-tooltip')

  return (
    <>
      <Tooltip
        title={
          <>
            <Box>{t('time-out-of-range-target-tooltip1', { percentage: timeSpentAwayFromTargetRate })}</Box>
            <Box>
              {t('time-out-of-range-target-tooltip2', {
                min: monitoringParameters.lowBg,
                max: monitoringParameters.highBg,
                threshold: monitoringParameters.outOfRangeThreshold,
                unit
              })}
            </Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
        data-testid="time-spent-out-of-range-icon-tooltip"
      >
        <TimeSpentOufOfRangeIcon
          color={isTimeSpentAwayFromTargetAlertActive ? 'inherit' : 'disabled'}
          data-testid="time-spent-out-of-range-icon"
        />
      </Tooltip>
      <Tooltip
        title={
          <>
            <Box>{t('hypoglycemia-tooltip1', { percentage: frequencyOfSevereHypoglycemiaRate })}</Box>
            <Box>
              {t('hypoglycemia-tooltip2', {
                veryLowBg: monitoringParameters.veryLowBg,
                threshold: monitoringParameters.hypoThreshold,
                unit
              })}
            </Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
      >
        <HypoglycemiaIcon
          sx={{ marginLeft: theme.spacing(1) }}
          color={isFrequencyOfSevereHypoglycemiaAlertActive ? 'error' : 'disabled'}
          data-testid="hypoglycemia-icon"
        />
      </Tooltip>
      <Tooltip
        title={
          <>
            <Box>{t('data-not-transferred-tooltip1', { percentage: nonDataTransmissionRate })}</Box>
            <Box>{t('data-not-transferred-tooltip2', { threshold: monitoringParameters.nonDataTxThreshold })}</Box>
            <Box>{sharedTooltip}</Box>
          </>
        }
      >
        <NoDataIcon
          sx={{ marginLeft: theme.spacing(1) }}
          color={isNonDataTransmissionAlertActive ? 'inherit' : 'disabled'}
          data-testid="no-data-icon"
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
      <Box display="flex" justifyContent="center" data-testid="message-icon">
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
