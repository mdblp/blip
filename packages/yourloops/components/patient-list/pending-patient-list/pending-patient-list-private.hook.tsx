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

import React from 'react'
import { type GridColDef, type GridRowParams, type GridRowsProp } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { PendingPatientListPrivateColumns, PendingPatientListTeamColumns } from '../models/enums/patient-list.enum'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { type PendingGridRowPrivateModel } from '../models/grid-row.model'
import { getUserName } from '../../../lib/auth/user.util'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import { formatDate } from 'dumb/dist/src/utils/datetime/datetime.util'
import { NotificationType } from '../../../lib/notifications/models/enums/notification-type.enum'
import { useNotification } from '../../../lib/notifications/notification.hook'
import metrics from '../../../lib/metrics'
import { errorTextFromException } from '../../../lib/utils'
import { type Notification } from '../../../lib/notifications/models/notification.model'
import { useAlert } from '../../utils/snackbar'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

interface PendingPatientListPrivateHookReturns {
  columns: GridColDef[]
  rowsProps: GridRowsProp
}

const SMALL_CELL_WIDTH = 200
const MEDIUM_CELL_WIDTH = 250
const LARGE_CELL_WIDTH = 300

export const usePendingPatientListPrivateHook = (): PendingPatientListPrivateHookReturns => {
  const { receivedInvitations, accept, decline, update: invitesUpdate, refreshReceivedInvitations } = useNotification()
  const alert = useAlert()
  const { refresh: refreshPatients } = usePatientsContext()
  const directShareInvites = receivedInvitations.filter(invite => invite.type === NotificationType.directInvitation)

  const { t } = useTranslation()

  const onDecline = async (invite: Notification): Promise<void> => {
    try {
      await decline(invite)
      metrics.send('invitation', 'decline_invitation', invite.metricsType)
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t(errorMessage))
      invitesUpdate()
    }
  }

  const acceptInvite = async (invite: Notification, creatorFullName: string): Promise<void> => {
    try {
      await accept(invite)
      metrics.send('invitation', 'accept_invitation', invite.metricsType)
      refreshPatients()
      alert.success(t('accept-notification-success', { name: creatorFullName }))
      await refreshReceivedInvitations()
    } catch (reason: unknown) {
      const errorMessage = errorTextFromException(reason)
      alert.error(t(errorMessage))
      invitesUpdate()
    }
  }

  const buildPendingColumns = (): GridColDef[] => {
    return [
      {
        field: PendingPatientListPrivateColumns.Patient,
        type: 'string',
        headerName: t('patient'),
        hideable: false,
        minWidth: MEDIUM_CELL_WIDTH
      },
      {
        field: PendingPatientListPrivateColumns.Date,
        type: 'string',
        headerName: t('date'),
        hideable: false,
        minWidth: SMALL_CELL_WIDTH
      },
      {
        field: PendingPatientListPrivateColumns.Email,
        type: 'string',
        headerName: t('email'),
        minWidth: MEDIUM_CELL_WIDTH
      },
      {
        type: 'actions',
        field: PendingPatientListPrivateColumns.Actions,
        headerName: t('actions'),
        getActions: (params: GridRowParams<PendingGridRowPrivateModel>) => {
          const invite = params.row[PendingPatientListTeamColumns.Actions].invite
          const patientFullName = params.row[PendingPatientListTeamColumns.Actions].patientFullName

          return [
            <Button
              key={params.row.id}
              startIcon={<CheckCircleIcon />}
              data-testid={`accept-invite-patient-${patientFullName}`}
              aria-label={`${t('button-accept-invite')} ${patientFullName}`}
              onClick={() => {
                acceptInvite(invite, patientFullName)
              }}
            >
              {t('button-accept-invite')}
            </Button>,
            <Button
              key={params.row.id}
              startIcon={<CloseIcon />}
              data-testid={`decline-invite-patient-${patientFullName}`}
              aria-label={`${t('button-decline')} ${patientFullName}`}
              onClick={() => {
                onDecline(invite)
              }}
            >
              {t('button-decline')}
            </Button>
          ]
        },
        minWidth: LARGE_CELL_WIDTH
      }
    ]
  }

  const buildPendingRows = (): GridRowsProp => {
    return directShareInvites.map((invite): PendingGridRowPrivateModel => {
      console.log(invite)
      const inviteCreator = invite.creator
      const inviteCreatorName = inviteCreator ? getUserName(inviteCreator.profile.firstName, inviteCreator.profile.lastName, inviteCreator.profile.fullName) : t('N/A')
      return {
        id: invite.id,
        [PendingPatientListPrivateColumns.Actions]: { invite, patientFullName: inviteCreatorName },
        [PendingPatientListPrivateColumns.Date]: formatDate(invite.date),
        [PendingPatientListPrivateColumns.Email]: inviteCreator.profile.email ?? t('N/A'),
        [PendingPatientListPrivateColumns.Patient]: inviteCreatorName
      }
    })
  }

  return {
    columns: buildPendingColumns(),
    rowsProps: buildPendingRows()
  }
}
