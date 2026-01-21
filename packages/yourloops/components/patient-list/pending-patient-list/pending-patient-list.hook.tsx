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

import React, { useCallback, useMemo, useState } from 'react'
import { type GridColDef, type GridRowParams, type GridRowsProp } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { PendingPatientListColumns } from '../models/enums/patient-list.enum'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { type PendingGridRowModel } from '../models/grid-row.model'
import { getUserName } from '../../../lib/auth/user.util'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import MailIcon from '@mui/icons-material/Mail'
import { formatDate } from 'dumb'
import { useParams } from 'react-router-dom'
import { useTeam } from '../../../lib/team'

interface PendingPatientListHookProps {
  patients: Patient[]
}

interface PatientListHookReturns {
  columns: GridColDef[]
  patientToCancelInvite: Patient | null
  patientToReinvite: Patient | null
  rowsProps: GridRowsProp
  onCloseCancelInviteDialog: () => void
  onCloseReinviteDialog: () => void
  onSuccessReinviteDialog: () => void
}

const SMALL_CELL_WIDTH = 200
const MEDIUM_CELL_WIDTH = 250
const LARGE_CELL_WIDTH = 300

export const usePendingPatientListHook = (props: PendingPatientListHookProps): PatientListHookReturns => {
  const { patients } = props
  const { t } = useTranslation()
  const { getPatientById } = usePatientsContext()
  const { teamId } = useParams()
  const { getTeam } = useTeam()
  const selectedTeam = getTeam(teamId)

  const [patientToCancelInvite, setPatientToCancelInvite] = useState<Patient | null>(null)
  const [patientToReinvite, setPatientToReinvite] = useState<Patient | null>(null)

  const removePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    setPatientToCancelInvite(patient)
  }, [getPatientById])

  const onCloseCancelInviteDialog = (): void => {
    setPatientToCancelInvite(null)
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
        minWidth: MEDIUM_CELL_WIDTH
      },
      {
        field: PendingPatientListColumns.Date,
        type: 'string',
        headerName: t('date'),
        hideable: false,
        minWidth: SMALL_CELL_WIDTH
      },
      {
        field: PendingPatientListColumns.Email,
        type: 'string',
        headerName: t('email'),
        minWidth: MEDIUM_CELL_WIDTH
      },
      {
        type: 'actions',
        field: PendingPatientListColumns.Actions,
        headerName: t('actions'),
        getActions: (params: GridRowParams<PendingGridRowModel>) => {
          const patient = params.row[PendingPatientListColumns.Actions]

          if (!params.row.isInviteAvailable) {
            return []
          }
          const patientEmail = patient.profile.email

          return [
            <Button
              key={params.row.id}
              data-action="reinvite-patient"
              startIcon={<MailIcon />}
              data-testid={`reinvite-patient-${patientEmail}`}
              aria-label={`${t('button-resend-invite')} ${patientEmail}`}
              onClick={() => {
                resendInvite(patient)
              }}
            >
              {t('button-resend-invite')}
            </Button>,
            <Button
              key={params.row.id}
              data-action="remove-patient"
              startIcon={<CloseIcon />}
              data-testid={`remove-patient-${patientEmail}`}
              aria-label={`${t('button-remove-patient')} ${patientEmail}`}
              onClick={() => {
                removePatient(patient.userid)
              }}
            >
              {t('button-cancel')}
            </Button>
          ]
        },
        minWidth: LARGE_CELL_WIDTH
      }
    ]
  }

  const buildPendingRows = useCallback((): GridRowsProp => {
    return patients.map((patient): PendingGridRowModel => {
      const invite = patient.invite
      if (!invite) {
        const notAvailableLabel = t('N/A')
        return {
          id: patient.userid,
          isInviteAvailable: false,
          [PendingPatientListColumns.Actions]: patient,
          [PendingPatientListColumns.Date]: notAvailableLabel,
          [PendingPatientListColumns.Email]: patient.profile.email,
          [PendingPatientListColumns.InviteSentBy]: notAvailableLabel
        }
      }
      const inviteCreator = selectedTeam.members.find(member => member.userId === invite.creatorId)
      const inviteCreatorName = inviteCreator ? getUserName(inviteCreator.profile.firstName, inviteCreator.profile.lastName, inviteCreator.profile.fullName) : t('N/A')
      return {
        id: patient.userid,
        isInviteAvailable: true,
        [PendingPatientListColumns.Actions]: patient,
        [PendingPatientListColumns.Date]: formatDate(invite.creationDate),
        [PendingPatientListColumns.Email]: patient.profile.email,
        [PendingPatientListColumns.InviteSentBy]: inviteCreatorName
      }
    })
  }, [patients, selectedTeam, t])

  const rowsProps: GridRowsProp = useMemo(() => {
    return buildPendingRows()
  }, [buildPendingRows])

  const columns: GridColDef[] = useMemo(() => buildPendingColumns(), [buildPendingColumns])

  return {
    columns,
    patientToCancelInvite,
    patientToReinvite,
    rowsProps,
    onCloseCancelInviteDialog,
    onCloseReinviteDialog,
    onSuccessReinviteDialog
  }
}
