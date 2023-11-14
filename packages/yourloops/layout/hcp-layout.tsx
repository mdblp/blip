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
import { Navigate, Outlet, useLoaderData, useParams } from 'react-router-dom'
import { PatientsProvider } from '../lib/patient/patients.provider'
import { DashboardLayout } from './dashboard-layout'
import { PatientListProvider } from '../lib/providers/patient-list.provider'
import { Team, TeamContextProvider, useTeam } from '../lib/team'
import { NotificationContextProvider } from '../lib/notifications/notification.hook'
import { AppUserRoute } from '../models/enums/routes.enum'
import { AuthContextProvider } from '../lib/auth'

export const LOCAL_STORAGE_SELECTED_TEAM_ID_KEY = 'selectedTeamId'

export const NavigateWithCorrectTeamId: FunctionComponent = () => {
  const { teams, getDefaultTeamId } = useTeam()
  const { userId } = useParams()

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
    <Navigate to={`/hcps/${userId}/teams/${teamId}/patients`} replace />
  )
}

export const HcpLayout: FunctionComponent = () => {
  const { teamId } = useParams()
  const teams = useLoaderData() as Team[]

  const isPageValid = (): boolean => {
    if (!teamId) {
      return true
    }
    return teamId && teams.some((team: Team) => team.id === teamId)
  }

  const updateLocalStorage = (): void => {
    const isTeamIdValid = teamId && teams.some((team: Team) => team.id === teamId)
    if (isTeamIdValid) {
      localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, teamId)
    }
  }

  const pageValid = isPageValid()
  updateLocalStorage()
  return (
    <>
      {/*{!teamId}*/}
      {pageValid ? (
        <AuthContextProvider>
          <NotificationContextProvider>
            <TeamContextProvider>
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            </TeamContextProvider>
          </NotificationContextProvider>
        </AuthContextProvider>
      ) : (
        <Navigate to={AppUserRoute.NotFound} replace />
      )}
    </>
  )
}

export const PatientListProviders: FunctionComponent = () => {
  return (
    <PatientListProvider>
      <PatientsProvider>
        <Outlet />
      </PatientsProvider>
    </PatientListProvider>
  )
}
