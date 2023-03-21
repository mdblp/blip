/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PatientDataPage from '../components/patient-data'
import { PatientProvider } from '../lib/patient/patient.provider'
import DashboardLayout from './dashboard-layout'
import { HomePage } from '../pages/home/home-page'
// import HomePage from '../pages/home-page'
import InvalidRoute from '../components/invalid-route'
import ProfilePage from '../pages/profile/profile-page'
import NotificationsPage from '../pages/notifications'
import { AppUserRoute } from '../models/enums/routes.enum'

export function CaregiverLayout(): JSX.Element {
  return (
    <PatientProvider>
      <DashboardLayout>
        <Routes>
          <Route path={AppUserRoute.NotFound} element={<InvalidRoute />} />
          <Route path={AppUserRoute.Preferences} element={<ProfilePage />} />
          <Route path={AppUserRoute.Notifications} element={<NotificationsPage />} />
          <Route path={`${AppUserRoute.Patient}/:patientId/*`} element={<PatientDataPage />} />
          <Route path={AppUserRoute.Home} element={<HomePage />} />
          <Route
            path="/"
            element={<Navigate to={AppUserRoute.Home} replace />}
          />
          <Route
            path="*"
            element={<Navigate to={AppUserRoute.NotFound} replace />}
          />
        </Routes>
      </DashboardLayout>
    </PatientProvider>
  )
}
