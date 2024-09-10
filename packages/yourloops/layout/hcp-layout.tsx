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

import React, { type FunctionComponent, useCallback, useMemo } from 'react'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import { CareTeamSettingsPage } from '../pages/care-team-settings/care-team-settings-page'
import { InvalidRoute } from '../components/invalid-route'
import { ProfilePage } from '../pages/profile/profile-page'
import { NotificationsPage } from '../pages/notifications/notifications-page'
import { AppUserRoute } from '../models/enums/routes.enum'
import { PatientListPage } from '../components/patient-list/patient-list-page'
import { Team, TeamContextProvider, useTeam } from '../lib/team'
import { ScopedPatientData } from '../components/patient-data/scoped-patient-data'
import { ScopedDashboardLayout } from './scoped-dashboard-layout'

export const LOCAL_STORAGE_SELECTED_TEAM_ID_KEY = 'selectedTeamId'

const HcpCommonLayout: FunctionComponent = () => {
  const { teamId } = useParams()
  const { teams } = useTeam()

  const checkRouteIsValid = (): void => {
    const isTeamIdValid = teamId && teams.some((team: Team) => team.id === teamId)
    if (isTeamIdValid) {
      localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, teamId)
    }
  }

  if (teamId) {
    checkRouteIsValid()
  }

  return (
    <ScopedDashboardLayout />
  )
}

const HcpLayout: FunctionComponent = () => {
  const { teams, getDefaultTeamId } = useTeam()

  const getFallbackTeamId = useCallback((): string => {
    const localStorageTeamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
    const isTeamIdValid = teams.some((team: Team) => team.id === localStorageTeamId)
    if (isTeamIdValid) {
      return localStorageTeamId
    }
    const defaultTeamId = getDefaultTeamId()
    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, defaultTeamId)
    return defaultTeamId
  }, [getDefaultTeamId, teams])

  const teamId = useMemo(() => {
    return getFallbackTeamId()
  }, [getFallbackTeamId])

  return (
    <Routes>
      <Route element={<HcpCommonLayout />}>
        <Route path={AppUserRoute.NotFound} element={<InvalidRoute />} />
        <Route path={AppUserRoute.Preferences} element={<ProfilePage />} />
        <Route path={AppUserRoute.Notifications} element={<NotificationsPage />} />
        <Route path={AppUserRoute.CareTeamSettings} element={<CareTeamSettingsPage />} />
        <Route
          path="/teams/private"
          element={<Navigate to={`/teams/${teamId}/patients`} replace />}
        />
        <Route path={AppUserRoute.PatientsList} element={<PatientListPage />} />
        <Route path={AppUserRoute.PatientView} element={<ScopedPatientData />} />
        <Route path="/" element={<Navigate to={`/teams/${teamId}/patients`} replace />} />
        <Route path="*" element={<Navigate to={AppUserRoute.NotFound} replace />} />
      </Route>
    </Routes>
  )
}

export const HcpLayoutWithContext: FunctionComponent = () => {
  return (
    <TeamContextProvider>
      <HcpLayout />
    </TeamContextProvider>
  )
}
