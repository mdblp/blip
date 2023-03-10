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

import React, { type FunctionComponent } from 'react'
import { PatientListHeader } from './patient-list-header'
import { usePatientListHook } from './patient-list.hook'
import { DataGrid } from '@mui/x-data-grid'

export const PatientList: FunctionComponent = () => {
  const {
    columns,
    columnsVisibility,
    currentTab,
    gridApiRef,
    inputSearch,
    rows,
    onChangingTab,
    setColumnsVisibility,
    setInputSearch
  } = usePatientListHook()

  return (
    <React.Fragment>
      <PatientListHeader
        currentTab={currentTab}
        inputSearch={inputSearch}
        onChangingTab={onChangingTab}
        setInputSearch={setInputSearch}
      />
      <DataGrid
        columns={columns}
        rows={rows}
        apiRef={gridApiRef}
        autoHeight
        disableColumnMenu
        disableColumnFilter
        disableColumnSelector
        disableRowSelectionOnClick
        columnVisibilityModel={columnsVisibility}
        onColumnVisibilityModelChange={(model) => {
          setColumnsVisibility(model)
        }}
        sx={{ borderRadius: 0 }}
      />
    </React.Fragment>
  )
}
