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

import { type Patient } from '../../../../lib/patient/models/patient.model'
import { type GridColDef, type GridRowParams, type GridRowsProp, type GridValidRowModel } from '@mui/x-data-grid'
import { useCallback, useState } from 'react'
import { type UserToRemove } from '../../../dialogs/remove-direct-share-dialog'
import { usePatientsContext } from '../../../../lib/patient/patients.provider'
import { useAuth } from '../../../../lib/auth'
import { getPatientFullName } from 'dumb'
import { useCurrentPatientListHook } from '../current-patient-list.hook'
import { PatientListColumns } from '../../models/enums/patient-list.enum'
import _ from 'lodash'

interface PrivateTeamOrCaregiverPatientListHookProps {
  patients: Patient[]
}

interface PrivateTeamOrCaregiverPatientListHookReturns {
  columns: GridColDef[]
  patientToRemoveFromPrivateTeam: Patient | null
  patientToRemoveFromDirectShare: UserToRemove | null
  rowsProps: GridRowsProp
  onCloseRemoveDialog: () => void
  onRowClick: (params: GridRowParams) => void
}

const EXCLUDED_COLUMNS = [PatientListColumns.Messages, PatientListColumns.MonitoringAlerts]

export const usePrivateTeamOrCaregiverPatientListHook = (props: PrivateTeamOrCaregiverPatientListHookProps): PrivateTeamOrCaregiverPatientListHookReturns => {
  const { patients } = props
  const { user } = useAuth()
  const { getPatientById } = usePatientsContext()

  const [patientToRemoveFromPrivateTeam, setPatientToRemoveFromPrivateTeam] = useState<Patient | null>(null)
  const [patientToRemoveFromDirectShare, setPatientToRemoveFromDirectShare] = useState<UserToRemove | null>(null)

  const onClickRemovePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    if (user.isUserHcp()) {
      setPatientToRemoveFromPrivateTeam(patient)
      return
    }
    setPatientToRemoveFromDirectShare({
      id: patient.userid,
      fullName: getPatientFullName(patient),
      email: patient.profile.email
    })
  }, [getPatientById, user])

  const { allRows, allColumns, onRowClick } = useCurrentPatientListHook({ patients, onClickRemovePatient })

  const onCloseRemoveDialog = (): void => {
    setPatientToRemoveFromPrivateTeam(null)
    setPatientToRemoveFromDirectShare(null)
  }

  const columns = allColumns.filter((column: GridColDef) => !EXCLUDED_COLUMNS.includes(column.field as PatientListColumns))
  const rowsProps = allRows.map((row: GridValidRowModel) => _.omit(row, EXCLUDED_COLUMNS))

  return {
    columns,
    rowsProps,
    onCloseRemoveDialog,
    onRowClick,
    patientToRemoveFromPrivateTeam,
    patientToRemoveFromDirectShare
  }
}
