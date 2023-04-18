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
import { PatientNavBarMemoized as PatientNavBar } from '../header-bars/patient-nav-bar'
import { usePatientData } from './patient-data.hook'
import { Route, Routes } from 'react-router-dom'
import { AppUserRoute } from '../../models/enums/routes.enum'
import SpinningLoader from '../loaders/spinning-loader'
import DialogPDFOptions from '../dialogs/pdf-print-options'

export const PatientData: FunctionComponent = () => {
  const { currentChart, selectedPatient, changeChart, changePatient } = usePatientData()

  const [showPdfDialog, setShowPdfDialog] = useState<boolean>(false)

  return (
    <React.Fragment>
      <PatientNavBar
        currentChart={currentChart}
        currentPatient={selectedPatient}
        onChangeChart={changeChart}
        onClickPrint={() => { setShowPdfDialog(true) }}
        onSwitchPatient={changePatient}
      />
      <Routes>
        <Route
          path={AppUserRoute.Dashboard}
          element={
            <SpinningLoader />
          }
        />
        <Route
          path={AppUserRoute.Daily}
          element={
            <h1>daily</h1>
          }
        />
        <Route
          path={AppUserRoute.Trends}
          element={
            <h1>Trends</h1>
          }
        />
      </Routes>
      {showPdfDialog &&
        <DialogPDFOptions
          minDate={'2021'}
          maxDate={'2022'}
          onResult={() => {
            console.log('coucou')
            setShowPdfDialog(false)
          }}
          defaultPreset={'1week'}
        />
      }
    </React.Fragment>
  )
}
