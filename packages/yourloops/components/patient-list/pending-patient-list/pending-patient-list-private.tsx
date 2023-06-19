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

import React, { type FunctionComponent, useState } from 'react'
import { DataGrid, type GridPaginationModel, type GridSortModel, useGridApiRef } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { PatientListColumns } from '../models/enums/patient-list.enum'
import { usePatientListContext } from '../../../lib/providers/patient-list.provider'
import { usePatientsContext } from '../../../lib/patient/patients.provider'
import { EmptyPatientList } from '../empty-patient-list/empty-patient-list'
import { useWindowDimensions } from '../../../lib/custom-hooks/use-window-dimensions.hook'
import { usePendingPatientListPrivateHook } from './pending-patient-list-private.hook'

export const PendingPatientListPrivate: FunctionComponent = () => {
  const {
    columns,
    rowsProps
  } = usePendingPatientListPrivateHook()
  const { displayedColumns } = usePatientListContext()
  const { refreshInProgress } = usePatientsContext()
  const { width } = useWindowDimensions()
  const gridApiRef = useGridApiRef()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: PatientListColumns.Patient, sort: 'asc' }])

  return (
    <Box data-testid="pending-patient-list-grid" width={width}>
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
        onRowClick={undefined}
        pageSizeOptions={[5, 10, 25]}
        slots={{
          noRowsOverlay: EmptyPatientList
        }}
      />
    </Box>
  )
}
