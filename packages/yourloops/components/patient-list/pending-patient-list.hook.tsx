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
import { type GridColDef, type GridRenderCellParams, type GridRowsProp } from '@mui/x-data-grid'
import { useTranslation } from 'react-i18next'
import { usePatientListStyles } from './patient-list.styles'
import { PendingPatientListColumns } from './models/enums/patient-list.enum'
import { usePatientContext } from '../../lib/patient/patient.provider'
import { ActionsCell, PendingIconCell } from './custom-cells'
import { useAuth } from '../../lib/auth'
import { type Patient } from '../../lib/patient/models/patient.model'
import { type GridRowModel } from './models/grid-row.model'
import { type UserToRemove } from '../dialogs/remove-direct-share-dialog'
import { getPatientFullName } from 'dumb'
import Box from '@mui/material/Box'
import { sortByUserName } from './sort-comparators.util'

interface PendingPatientListHookProps {
  patients: Patient[]
}

interface PatientListHookReturns {
  columns: GridColDef[]
  patientToRemoveForHcp: Patient | null
  patientToRemoveForCaregiver: UserToRemove | null
  rowsProps: GridRowsProp
  onCloseRemoveDialog: () => void
}

export const usePendingPatientListHook = (props: PendingPatientListHookProps): PatientListHookReturns => {
  const { patients } = props
  const { t } = useTranslation()
  const { classes } = usePatientListStyles()
  const { user } = useAuth()
  const { getPatientById } = usePatientContext()

  const [patientToRemoveForHcp, setPatientToRemoveForHcp] = useState<Patient | null>(null)
  const [patientToRemoveForCaregiver, setPatientToRemoveForCaregiver] = useState<UserToRemove | null>(null)

  const onClickRemovePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    if (user.isUserHcp()) {
      setPatientToRemoveForHcp(patient)
      return
    }
    setPatientToRemoveForCaregiver({
      id: patient.userid,
      fullName: getPatientFullName(patient),
      email: patient.profile.email
    })
  }, [getPatientById, user])

  const onCloseRemoveDialog = (): void => {
    setPatientToRemoveForHcp(null)
    setPatientToRemoveForCaregiver(null)
  }

  const buildPendingColumns = (): GridColDef[] => {
    return [
      {
        field: PendingPatientListColumns.Icon,
        type: 'actions',
        headerName: '',
        width: 55,
        hideable: false,
        sortable: false,
        renderCell: (): JSX.Element => {
          return <PendingIconCell />
        }
      },
      {
        field: PendingPatientListColumns.Patient,
        headerName: t('patient'),
        hideable: false,
        flex: 1,
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          const { email } = params.value.profile
          return <Box data-email={email}>{email}</Box>
        },
        sortComparator: sortByUserName
      },
      {
        type: 'actions',
        field: PendingPatientListColumns.Actions,
        headerName: t('actions'),
        headerClassName: classes.mandatoryCellBorder,
        cellClassName: classes.mandatoryCellBorder,
        renderCell: (params: GridRenderCellParams<GridRowModel, Patient>) => {
          return <ActionsCell patient={params.value} onClickRemove={onClickRemovePatient} />
        }
      }
    ]
  }

  const buildPendingRows = useCallback((): GridRowsProp => {
    return patients.map((patient): GridRowModel => {
      return {
        id: patient.userid,
        [PendingPatientListColumns.Patient]: patient,
        [PendingPatientListColumns.Actions]: patient
      }
    })
  }, [patients])

  const rowsProps: GridRowsProp = useMemo(() => {
    return buildPendingRows()
  }, [buildPendingRows])

  return {
    columns: buildPendingColumns(),
    patientToRemoveForHcp,
    patientToRemoveForCaregiver,
    rowsProps,
    onCloseRemoveDialog
  }
}
