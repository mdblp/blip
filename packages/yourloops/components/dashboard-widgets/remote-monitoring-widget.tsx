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

import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MonitorHeartOutlinedIcon from '@mui/icons-material/MonitorHeartOutlined'

import RemoteMonitoringPatientDialog, { RemoteMonitoringDialogAction } from '../dialogs/remote-monitoring-dialog'
import { useAuth } from '../../lib/auth'
import { useNotification } from '../../lib/notifications/notification.hook'
import { useTeam } from '../../lib/team'
import ConfirmDialog from '../dialogs/confirm-dialog'
import { usePatientContext } from '../../lib/patient/patient.provider'
import PatientUtils from '../../lib/patient/patient.util'
import { Patient } from '../../lib/patient/models/patient.model'
import { TeamMemberRole } from '../../lib/team/models/enums/team-member-role.enum'
import { MonitoringStatus } from '../../lib/team/models/enums/monitoring-status.enum'
import { useUserName } from '../../lib/custom-hooks/user-name.hook'
import GenericDashboardCard from './generic-dashboard-card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import moment from 'moment-timezone'

export interface RemoteMonitoringWidgetProps {
  patient: Patient
}

function RemoteMonitoringWidget(props: RemoteMonitoringWidgetProps): JSX.Element {
  const { t } = useTranslation()
  const authHook = useAuth()
  const notificationHook = useNotification()
  const teamHook = useTeam()
  const patientHook = usePatientContext()
  const [patient, setPatient] = useState(props.patient)
  const [showInviteRemoteMonitoringDialog, setShowInviteRemoteMonitoringDialog] = useState(false)
  const [showRenewRemoteMonitoringDialog, setShowRenewRemoteMonitoringDialog] = useState(false)
  const [showConfirmCancelDialog, setShowConfirmCancelDialog] = useState(false)
  const [showConfirmDeleteDialog, setShowConfirmDeleteDialog] = useState(false)
  const [confirmCancelDialogActionInProgress, setConfirmCancelDialogActionInProgress] = useState(false)
  const [confirmDeleteDialogActionInProgress, setConfirmDeleteDialogActionInProgress] = useState(false)
  const { getUserName } = useUserName()
  const { firstName, fullName, lastName } = patient.profile
  const patientName = getUserName(firstName, lastName, fullName)

  const isLoggedInUserHcpAdmin = (): boolean => {
    return authHook.user?.isUserHcp() &&
      !!teamHook.getRemoteMonitoringTeams()
        .find(team => team.members.find(member => member.role === TeamMemberRole.admin && member.userId === authHook.user?.id) &&
          patient.teams.find(t => t.teamId === team.id)
        )
  }

  const showMonitoringButtonAction = isLoggedInUserHcpAdmin()

  const buttonsVisible: { invite: boolean, cancel: boolean, renewAndRemove: boolean } = {
    invite: false,
    cancel: false,
    renewAndRemove: false
  }

  const monitoredPatientTeam = patient.teams.find(team => team.monitoringStatus === MonitoringStatus.accepted)
  const requestingTeam = monitoredPatientTeam ? teamHook.getTeam(monitoredPatientTeam.teamId) : undefined
  const endDate = patient?.monitoring?.monitoringEnd
    ? moment.utc(patient.monitoring.monitoringEnd).format(moment.localeData().longDateFormat('ll')).toString()
    : '-'
  const remainingTime = patient?.monitoring?.monitoringEnd
    ? moment(patient.monitoring.monitoringEnd).fromNow(true)
    : '-'

  const computePatientInformation = (): void => {
    const displayInviteButton = !patient.monitoring?.enabled &&
      patient.monitoring.status !== MonitoringStatus.pending &&
      patient.monitoring.status !== MonitoringStatus.accepted
    const displayCancelInviteButton = !patient.monitoring?.enabled &&
      patient.monitoring.status === MonitoringStatus.pending
    const displayRenewAndRemoveMonitoringButton = (!patient.monitoring?.enabled &&
      patient.monitoring.status === MonitoringStatus.accepted) || patient.monitoring?.enabled

    buttonsVisible.invite = displayInviteButton
    buttonsVisible.cancel = displayCancelInviteButton
    buttonsVisible.renewAndRemove = displayRenewAndRemoveMonitoringButton
  }

  if (patient.monitoring) {
    computePatientInformation()
  }

  const removePatientRemoteMonitoring = async (setActionInProgress: React.Dispatch<boolean>, setShow: React.Dispatch<boolean>): Promise<void> => {
    if (!patient.monitoring) {
      throw Error('Cannot cancel monitoring invite as patient monitoring is not defined')
    }
    try {
      patient.monitoring = { ...patient.monitoring, enabled: false, status: undefined, monitoringEnd: undefined }
      await patientHook.updatePatientMonitoring(patient)
      setPatient(patientHook.getPatientById(patient.userid))
      setActionInProgress(false)
      setShow(false)
    } catch (e) {
      setActionInProgress(false)
    }
  }

  const onConfirmCancelInviteDialog = async (): Promise<void> => {
    setConfirmCancelDialogActionInProgress(true)
    try {
      const team = PatientUtils.getRemoteMonitoringTeam(patient)
      await notificationHook.cancelRemoteMonitoringInvite(team.teamId, patient.userid)
    } catch (e) {
      console.error(e)
      setConfirmCancelDialogActionInProgress(false)
    }
    await removePatientRemoteMonitoring(setConfirmCancelDialogActionInProgress, setShowConfirmCancelDialog)
  }

  const onConfirmDeleteDialog = async (): Promise<void> => {
    setConfirmDeleteDialogActionInProgress(true)
    await removePatientRemoteMonitoring(setConfirmDeleteDialogActionInProgress, setShowConfirmDeleteDialog)
  }

  return (
    <React.Fragment>
      <GenericDashboardCard
        avatar={<MonitorHeartOutlinedIcon />}
        title={t('remote-monitoring-program')}
        data-testid="remote-monitoring-card"
      >
        <CardContent>
          <Box display="flex" gap={2} marginBottom={2}>
            <Typography className="bold">{t('colon', { label: t('remote-monitoring') })}</Typography>
            <Typography id="patient-info-remote-monitoring-value">
              {patient.monitoring?.enabled ? t('yes') : t('no')}
            </Typography>
          </Box>
          <Box display="flex" gap={2} marginY={2}>
            <Typography className="bold">{t('colon', { label: t('requesting-team') })}</Typography>
            <Typography>{requestingTeam?.name || '-'}</Typography>
          </Box>
          <Box display="flex" gap={2} marginY={2}>
            <Typography className="bold">{t('colon', { label: t('end-date') })}</Typography>
            <Typography>{endDate}</Typography>
          </Box>
          <Box display="flex" gap={2} marginY={2}>
            <Typography className="bold">{t('colon', { label: t('remaining-time') })}</Typography>
            <Typography>{remainingTime}</Typography>
          </Box>
        </CardContent>
        <CardActions>
          {showMonitoringButtonAction &&
            <Box
              display="flex"
              justifyContent="end"
              gap={2}
              width="100%"
            >
              {buttonsVisible.invite &&
                <Button
                  id="invite-button-id"
                  className="capitalize"
                  variant="contained"
                  color="primary"
                  disableElevation
                  size="small"
                  onClick={() => setShowInviteRemoteMonitoringDialog(true)}
                  data-testid="remote-monitoring-card-invite-button"
                >
                  {t('invite')}
                </Button>
              }
              {buttonsVisible.cancel &&
                <Button
                  id="cancel-invite-button-id"
                  className="capitalize"
                  variant="contained"
                  color="primary"
                  disableElevation
                  size="small"
                  onClick={() => setShowConfirmCancelDialog(true)}
                  data-testid="remote-monitoring-card-cancel-invite-button"
                >
                  {t('cancel-invite')}
                </Button>
              }
              {buttonsVisible.renewAndRemove &&
                <React.Fragment>
                  <Button
                    id="renew-button-id"
                    className="capitalize"
                    variant="contained"
                    color="primary"
                    disableElevation
                    size="small"
                    onClick={() => setShowRenewRemoteMonitoringDialog(true)}
                    data-testid="remote-monitoring-card-renew-button"
                  >
                    {t('renew')}
                  </Button>
                  <Button
                    id="remove-button-id"
                    className="capitalize"
                    variant="contained"
                    color="primary"
                    disableElevation
                    size="small"
                    onClick={() => setShowConfirmDeleteDialog(true)}
                    data-testid="remote-monitoring-card-remove-button"
                  >
                    {t('button-remove')}
                  </Button>
                </React.Fragment>
              }
            </Box>
          }
        </CardActions>
      </GenericDashboardCard>

      {showInviteRemoteMonitoringDialog &&
        <RemoteMonitoringPatientDialog
          patient={patient}
          action={RemoteMonitoringDialogAction.invite}
          onClose={() => setShowInviteRemoteMonitoringDialog(false)}
        />
      }
      {showRenewRemoteMonitoringDialog &&
        <RemoteMonitoringPatientDialog
          patient={patient}
          action={RemoteMonitoringDialogAction.renew}
          onClose={() => setShowRenewRemoteMonitoringDialog(false)}
        />
      }
      {showConfirmCancelDialog &&
        <ConfirmDialog
          title={t('cancel-remote-monitoring-invite')}
          label={t('cancel-remote-monitoring-invite-confirm', { fullName: patientName })}
          inProgress={confirmCancelDialogActionInProgress}
          onClose={() => setShowConfirmCancelDialog(false)}
          onConfirm={onConfirmCancelInviteDialog}
        />
      }
      {showConfirmDeleteDialog &&
        <ConfirmDialog
          title={t('remove-remote-monitoring')}
          label={t('remove-remote-monitoring-confirm', { fullName: patientName })}
          inProgress={confirmDeleteDialogActionInProgress}
          onClose={() => setShowConfirmDeleteDialog(false)}
          onConfirm={onConfirmDeleteDialog}
        />
      }
    </React.Fragment>
  )
}

export default RemoteMonitoringWidget
