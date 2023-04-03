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
import { PatientListHeader } from './patient-list-header'
import { usePatientListHook } from './patient-list.hook'
import {
  DataGrid,
  type GridColumnVisibilityModel,
  type GridPaginationModel,
  type GridSortModel
} from '@mui/x-data-grid'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTranslation } from 'react-i18next'
import RemovePatientDialog from '../patient/remove-patient-dialog'
import RemoveDirectShareDialog from '../dialogs/remove-direct-share-dialog'
import { PatientListCustomFooter } from './patient-list-custom-footer'
import { PatientListColumns } from './enums/patient-list.enum'
import { useAuth } from '../../lib/auth'
import { GlobalStyles } from 'tss-react'
import { useTheme } from '@mui/material/styles'

export const PatientList: FunctionComponent = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const theme = useTheme()
  const {
    columns,
    selectedTab,
    gridApiRef,
    inputSearch,
    patientToRemoveForHcp,
    patientToRemoveForCaregiver,
    rowsProps,
    onChangingTab,
    onCloseRemoveDialog,
    onRowClick,
    setInputSearch
  } = usePatientListHook()

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({ pageSize: 10, page: 0 })
  const [sortModel, setSortModel] = useState<GridSortModel>([{ field: PatientListColumns.Patient, sort: 'asc' }])
  const [columnsVisibility, setColumnsVisibility] = useState<GridColumnVisibilityModel>({
    [PatientListColumns.Flag]: true,
    [PatientListColumns.System]: true,
    [PatientListColumns.Patient]: true,
    [PatientListColumns.TimeOutOfRange]: true,
    [PatientListColumns.SevereHypoglycemia]: true,
    [PatientListColumns.DataNotTransferred]: true,
    [PatientListColumns.LastDataUpdate]: true,
    [PatientListColumns.Messages]: user.isUserHcp() ?? false,
    [PatientListColumns.Actions]: true
  })

  // TODO relates to YLP-2154 https://diabeloop.atlassian.net/browse/YLP-2154
  //  This function handles the switch between column visibility.
  //  Add it when a toggle will be switched for a column
  // const toggleColumnVisibility = (columnName: PatientListColumns): void => {
  //   gridApiRef.current.setColumnVisibility(columnName, !columnsVisibility[columnName])
  // }

  const NoPatientMessage = (): JSX.Element => {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <Typography>{t('no-patient')}</Typography>
      </Box>
    )
  }

  return (
    <React.Fragment>
      <GlobalStyles styles={{ body: { backgroundColor: theme.palette.common.white } }} />
      <PatientListHeader
        selectedTab={selectedTab}
        inputSearch={inputSearch}
        onChangingTab={onChangingTab}
        setInputSearch={setInputSearch}
      />

      <Box data-testid="patient-list-grid">
        <DataGrid
          columns={columns}
          rows={rowsProps}
          apiRef={gridApiRef}
          autoHeight
          disableColumnMenu
          disableColumnFilter
          disableColumnSelector
          disableRowSelectionOnClick
          disableVirtualization={process.env.NODE_ENV === 'test'}
          columnVisibilityModel={columnsVisibility}
          onColumnVisibilityModelChange={setColumnsVisibility}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          onRowClick={onRowClick}
          pageSizeOptions={[5, 10, 25]}
          sx={{ borderRadius: 0, '& .MuiDataGrid-cell:hover': { cursor: 'pointer' } }}
          slots={{
            noRowsOverlay: NoPatientMessage,
            footer: PatientListCustomFooter
          }}
        />
      </Box>

      {patientToRemoveForHcp &&
        <RemovePatientDialog
          patient={patientToRemoveForHcp}
          onClose={onCloseRemoveDialog}
        />
      }

      {patientToRemoveForCaregiver &&
        <RemoveDirectShareDialog
          userToRemove={patientToRemoveForCaregiver}
          onClose={onCloseRemoveDialog}
        />
      }
    </React.Fragment>
  )
}
