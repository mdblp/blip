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

import React, { type FunctionComponent, useState } from 'react'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { usePrivateTeamOrCaregiverPatientListHook } from './private-team-or-caregiver-patient-list.hook'
import Box from '@mui/material/Box'
import { DataGrid, type GridPaginationModel, type GridSortModel, useGridApiRef } from '@mui/x-data-grid'
import { EmptyPatientList } from '../../empty-patient-list/empty-patient-list'
import { PatientListCustomFooter } from '../../patient-list-custom-footer'
import RemoveDirectShareDialog from '../../../dialogs/remove-direct-share-dialog'
import { usePatientListContext } from '../../../../lib/providers/patient-list.provider'
import { usePatientsContext } from '../../../../lib/patient/patients.provider'
import { useWindowDimensions } from '../../../../lib/custom-hooks/use-window-dimensions.hook'
import { PatientListColumns } from '../../models/enums/patient-list.enum'
import RemovePatientDialog from '../../../patient/remove-patient-dialog/remove-patient-dialog'

interface PrivateTeamOrCaregiverPatientListProps {
  patients: Patient[]
}

export const PrivateTeamOrCaregiverPatientList: FunctionComponent<PrivateTeamOrCaregiverPatientListProps> = (props: PrivateTeamOrCaregiverPatientListProps) => {
  const { patients } = props
  const {
    columns,
    patientToRemoveFromDirectShare,
    patientToRemoveFromPrivateTeam,
    rowsProps,
    onCloseRemoveDialog,
    onRowClick
  } = usePrivateTeamOrCaregiverPatientListHook({ patients })
  const { displayedColumns } = usePatientListContext()
  const { refreshInProgress } = usePatientsContext()
  const { width } = useWindowDimensions()
  const gridApiRef = useGridApiRef()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: PatientListColumns.Patient, sort: 'asc' }])

  return (
    <>
      <Box data-testid="current-patient-list-grid" sx={{ width: width }}>
        <DataGrid
          columns={columns}
          rows={rowsProps}
          apiRef={gridApiRef}
          autoHeight
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          loading={refreshInProgress}
          disableVirtualization={process.env.NODE_ENV === 'test'}
          columnVisibilityModel={displayedColumns}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onRowClick={onRowClick}
          pageSizeOptions={[5, 10, 25]}
          sx={{
            borderRadius: 0,
            '& .MuiDataGrid-cell:hover': { cursor: 'pointer' }
          }}
          slots={{
            noRowsOverlay: EmptyPatientList,
            footer: PatientListCustomFooter
          }}
        />
      </Box>

      {patientToRemoveFromPrivateTeam &&
        <RemovePatientDialog
          patient={patientToRemoveFromPrivateTeam}
          onClose={onCloseRemoveDialog}
        />
      }

      {patientToRemoveFromDirectShare &&
        <RemoveDirectShareDialog
          userToRemove={patientToRemoveFromDirectShare}
          onClose={onCloseRemoveDialog}
        />
      }
    </>
  )
}
