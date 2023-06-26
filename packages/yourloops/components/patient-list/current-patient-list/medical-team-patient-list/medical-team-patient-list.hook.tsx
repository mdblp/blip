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

import { useCallback, useState } from 'react'
import { type GridColDef, type GridRowParams, type GridRowsProp } from '@mui/x-data-grid'
import { usePatientsContext } from '../../../../lib/patient/patients.provider'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { useCurrentPatientListHook } from '../current-patient-list.hook'

interface MedicalTeamPatientListHookProps {
  patients: Patient[]
}

interface MedicalTeamPatientListHookReturns {
  columns: GridColDef[]
  patientToRemove: Patient | null
  rowsProps: GridRowsProp
  onCloseRemoveDialog: () => void
  onRowClick: (params: GridRowParams) => void
}

export const useMedicalTeamPatientListHook = (props: MedicalTeamPatientListHookProps): MedicalTeamPatientListHookReturns => {
  const { patients } = props
  const { getPatientById } = usePatientsContext()

  const [patientToRemove, setPatientToRemove] = useState<Patient | null>(null)

  const onClickRemovePatient = useCallback((patientId: string): void => {
    const patient = getPatientById(patientId)
    setPatientToRemove(patient)
  }, [getPatientById])

  const { allRows, allColumns, onRowClick } = useCurrentPatientListHook({ patients, onClickRemovePatient })

  const onCloseRemoveDialog = (): void => {
    setPatientToRemove(null)
  }

  return {
    columns: allColumns,
    patientToRemove,
    rowsProps: allRows,
    onCloseRemoveDialog,
    onRowClick
  }
}
