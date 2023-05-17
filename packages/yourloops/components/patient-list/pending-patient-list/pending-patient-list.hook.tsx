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

import React, { useCallback, useMemo, useState } from 'react'
import { type GridColDef, type GridRowParams, type GridRowsProp } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { PendingPatientListColumns } from '../models/enums/patient-list.enum'
import { usePatientContext } from '../../../lib/patient/patient.provider'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { type PendingGridRowModel } from '../models/grid-row.model'
import { useNotification } from '../../../lib/notifications/notification.hook'
import { useAuth } from '../../../lib/auth'
import { getUserName } from '../../../lib/auth/user.util'
import { formatDate } from 'dumb/dist/src/utils/datetime/datetime.util'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import MailIcon from '@mui/icons-material/Mail'
import Tooltip from '@mui/material/Tooltip'

interface PendingPatientListHookProps {
  patients: Patient[]
}

interface PatientListHookReturns {
  columns: GridColDef[]
  patientToRemoveForHcp: Patient | null
  patientToReinvite: Patient | null
  rowsProps: GridRowsProp
  onCloseRemoveDialog: () => void
  onCloseReinviteDialog: () => void
  onSuccessReinviteDialog: () => void
}

export const usePendingPatientListHook = (props: PendingPatientListHookProps): PatientListHookReturns => {
  const { patients } = props
  const { t } = useTranslation()
  const { getPatientById } = usePatientContext()
  const { sentInvitations } = useNotification()
  const { user } = useAuth()

  const [patientToRemoveForHcp, setPatientToRemoveForHcp] = useState<Patient | null>(null)
  const [patientToReinvite, setPatientToReinvite] = useState<Patient | null>(null)

  const removePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    setPatientToRemoveForHcp(patient)
  }, [getPatientById])

  const onCloseRemoveDialog = (): void => {
    setPatientToRemoveForHcp(null)
  }

  const onCloseReinviteDialog = (): void => {
    setPatientToReinvite(null)
  }

  const onSuccessReinviteDialog = (): void => {
    setPatientToReinvite(null)
  }

  const resendInvite = (patient: Patient): void => {
    setPatientToReinvite(patient)
  }

  const buildPendingColumns = (): GridColDef[] => {
    return [
      {
        field: PendingPatientListColumns.InviteSentBy,
        type: 'string',
        headerName: t('invite-sent-by'),
        hideable: false,
        minWidth: 250
      },
      {
        field: PendingPatientListColumns.Date,
        type: 'string',
        headerName: t('date'),
        hideable: false,
        minWidth: 200
      },
      {
        field: PendingPatientListColumns.Email,
        type: 'string',
        headerName: t('email'),
        minWidth: 250
      },
      {
        type: 'actions',
        field: PendingPatientListColumns.Actions,
        headerName: t('actions'),
        getActions: (params: GridRowParams<PendingGridRowModel>) => {
          const patient = params.row[PendingPatientListColumns.Actions]
          const inviteCreatedByLoggedUser = params.row.inviteCreatedByLoggedUser
          const tooltipText = inviteCreatedByLoggedUser ? '' : 'This action cannot be performed as you did not invite this patient'

          return [
            <Tooltip
              key={params.row.id}
              title={tooltipText}
              aria-label={tooltipText}
            >
              <span>
              <Button
                data-action="remove-patient"
                startIcon={<MailIcon />}
                data-testid={`reinvite-patient-${patient.profile.email}`}
                aria-label={`${t('button-resend-invite')} ${patient.profile.email}`}
                disabled={!inviteCreatedByLoggedUser}
                onClick={() => {
                  resendInvite(patient)
                }}
              >
                {t('button-resend-invite')}
              </Button>
              </span>
            </Tooltip>,
            <Tooltip
              key={params.row.id}
              title={tooltipText}
              aria-label={tooltipText}
            >
              <span>
              <Button
                data-action="remove-patient"
                startIcon={<CloseIcon />}
                data-testid={`remove-patient-${patient.profile.email}`}
                aria-label={`${t('button-remove-patient')} ${patient.profile.email}`}
                disabled={!inviteCreatedByLoggedUser}
                onClick={() => {
                  removePatient(patient.userid)
                }}
              >
                {t('button-cancel')}
              </Button>
              </span>
            </Tooltip>
          ]
        },
        minWidth: 300
      }
    ]
  }

  const buildPendingRows = useCallback((): GridRowsProp => {
    const { firstName, lastName, fullName } = user.profile
    return patients.map((patient): PendingGridRowModel => {
      const invite = sentInvitations.find(invitation => invitation.email === patient.profile.email)
      const inviteCreatedByLoggedUser = !!invite
      const inviteDate = invite ? formatDate(invite.date) : t('N/A')
      const inviteAuthorName = invite ? getUserName(firstName, lastName, fullName) : t('N/A')
      return {
        id: patient.userid,
        inviteCreatedByLoggedUser,
        [PendingPatientListColumns.Actions]: patient,
        [PendingPatientListColumns.Date]: inviteDate,
        [PendingPatientListColumns.Email]: patient.profile.email,
        [PendingPatientListColumns.InviteSentBy]: inviteAuthorName
      }
    })
  }, [patients, sentInvitations, t, user.profile])

  const rowsProps: GridRowsProp = useMemo(() => {
    return buildPendingRows()
  }, [buildPendingRows])

  return {
    columns: buildPendingColumns(),
    patientToRemoveForHcp,
    patientToReinvite,
    rowsProps,
    onCloseRemoveDialog,
    onCloseReinviteDialog,
    onSuccessReinviteDialog
  }
}
