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
import TeamDetailsPage from '../pages/team/team-details-page'
import HomePage from '../pages/home-page'
import { PatientProvider } from '../lib/patient/patient.provider'
import { TeamContextProvider } from '../lib/team'
import DashboardLayout from './dashboard-layout'
import InvalidRoute from '../components/invalid-route'
import ProfilePage from '../pages/profile/profile-page'
import NotificationsPage from '../pages/notifications'
import { SelectedTeamProvider } from '../lib/selected-team/selected-team.provider'

export function HcpLayout(): JSX.Element {
  return (
    <TeamContextProvider>
      <PatientProvider>
        <SelectedTeamProvider>
          <DashboardLayout>
            <Routes>
              <Route path="/not-found" element={<InvalidRoute />} />
              <Route path="/preferences" element={<ProfilePage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/patient/:patientId/*" element={<PatientDataPage />} />
              <Route path="/teams/:teamId" element={<TeamDetailsPage />} />
              <Route
                path="/"
                element={<Navigate to="/home" replace />}
              />
              <Route
                path="*"
                element={<Navigate to="/not-found" replace />}
              />
            </Routes>
          </DashboardLayout>
        </SelectedTeamProvider>
      </PatientProvider>
    </TeamContextProvider>
  )
}