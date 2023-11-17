/*
 * Copyright (c) 2021-2023, Diabeloop
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
import { createBrowserRouter, Navigate, Outlet, redirect } from 'react-router-dom'
import { AppUserRoute } from '../models/enums/routes.enum'
import { CareTeamSettingsPage } from '../pages/care-team-settings/care-team-settings-page'
import { PatientListPage } from '../components/patient-list/patient-list-page'
import { PatientData } from '../components/patient-data/patient-data'
import { PatientCaregiversPage } from '../pages/patient/caregivers/patient-caregivers-page'
import TeamApi from '../lib/team/team.api'
import { LOCAL_STORAGE_SELECTED_TEAM_ID_KEY } from '../layout/hcp-layout'
import PatientUtils from '../lib/patient/patient.util'
import AuthService from '../lib/auth/auth.service'
import { userLoader } from './loaders'
import { RouterRoot } from './root'
import { AuthLayout, UserLayout } from '../layout/user-layout'
import { COMMON_LOGGED_ROUTES, COMMON_ROUTES } from './common-routes'
import PatientApi from '../lib/patient/patient.api'
import SpinningLoader from '../components/loaders/spinning-loader'
import { PRIVATE_TEAM_ID } from '../lib/team/team.hook'
import { Team } from '../lib/team'
import { TeamType } from '../lib/team/models/enums/team-type.enum'
import TeamUtils from '../lib/team/team.util'
import { PatientsProvider } from '../lib/patient/patients.provider'

const getLoggedInRoutes = () => {
  return {
    element: <AuthLayout />,
    loader: userLoader,
    id: 'user-route',
    children: [
      {
        element: <UserLayout />,
        id: 'teams-route',
        loader: async () => {
          const user = AuthService.getUser()
          if (user.isUserCaregiver()) {
            return null
          }
          const teams = await TeamApi.getTeams(AuthService.getUser().id, user.role)
          if (!teams.length) {
            throw Error('Error when retrieving teams')
          }
          if (!user.isUserHcp()) {
            return teams
          }
          const localStorageTeamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
          if (localStorageTeamId) {
            const isTeamIdValid = teams.some(team => team.id === localStorageTeamId)
            if (isTeamIdValid) {
              localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, localStorageTeamId)
              return teams
            }
          }
          const medicalTeams = teams.filter((team: Team) => team.type === TeamType.medical)
          if (!medicalTeams.length) {
            localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, PRIVATE_TEAM_ID)
            return redirect('private/patients')
          }
          const firstTeamId = TeamUtils.sortTeamsByName(medicalTeams)[0].id
          localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, firstTeamId)
          return teams
        },
        children: [
          ...COMMON_LOGGED_ROUTES,
          {
            path: 'teams',
            children: [
              {
                path: '',
                loader: async () => {
                  const user = AuthService.getUser()
                  if (user.isUserCaregiver()) {
                    return redirect('/private')
                  }
                  const teams = await TeamApi.getTeams(AuthService.getUser().id, user.role) //This call should be cached
                  if (!teams) {
                    throw Error('Could not retrieve teams')
                  }
                  const localStorageTeamId = localStorage.getItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY)
                  const isTeamIdValid = teams.some(team => team.id === localStorageTeamId)
                  if (isTeamIdValid) {
                    return redirect(`${localStorageTeamId}/patients`)
                  }
                  const medicalTeams = teams.filter((team: Team) => team.type === TeamType.medical)
                  if (!medicalTeams.length) {
                    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, PRIVATE_TEAM_ID)
                    return redirect('private/patients')
                  }
                  const firstTeamId = TeamUtils.sortTeamsByName(medicalTeams)[0].id
                  return redirect(`${firstTeamId}/patients`)
                }
              },
              { path: 'private', element: <Navigate to="/teams/private/patients" replace /> },
              {
                path: ':teamId',
                loader: async ({ params }) => {
                  const paramTeamId = params.teamId
                  const user = AuthService.getUser()
                  if (user.isUserCaregiver()) {
                    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, PRIVATE_TEAM_ID)
                    if (paramTeamId !== PRIVATE_TEAM_ID) {
                      return redirect('private/patients')
                    }
                    return null
                  }
                  const teams = await TeamApi.getTeams(AuthService.getUser().id, user.role) //This call should be cached
                  if (!teams) {
                    throw Error('Could not retrieve teams')
                  }
                  const isParamTeamIdValid = teams.some(team => team.id === paramTeamId)
                  if (isParamTeamIdValid) {
                    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, paramTeamId)
                    return null
                  }
                  const medicalTeams = teams.filter((team: Team) => team.type === TeamType.medical)
                  if (!medicalTeams.length) {
                    localStorage.setItem(LOCAL_STORAGE_SELECTED_TEAM_ID_KEY, PRIVATE_TEAM_ID)
                    return redirect('private/patients')
                  }
                  const firstTeamId = TeamUtils.sortTeamsByName(medicalTeams)[0].id
                  return redirect(`${firstTeamId}/patients`)
                },
                children: [
                  { path: '', element: <CareTeamSettingsPage /> },
                  {
                    path: 'patients',
                    element: <PatientsProvider><Outlet /></PatientsProvider>,
                    loader: async ({ params }) => {
                      if (!params.teamId) {
                        return null
                      }
                      const user = AuthService.getUser()
                      if (user.isUserHcp()) {
                        return PatientApi.getPatientsForHcp(user.id, params.teamId)
                      }
                      return await PatientUtils.computePatientsForCaregiver()
                    },
                    id: 'patients-route',
                    children: [
                      { path: '', element: <PatientListPage /> },
                      { path: ':patientId/*', element: <PatientData /> }
                    ]
                  }
                ]
              }
            ]
          },
          {
            path: '*',
            element: <Outlet />,
            loader: () => {
              const user = AuthService.getUser()
              if (!user.isUserPatient()) {
                console.log('here 3')
                return redirect(AppUserRoute.NotFound)
              }
              return null
            },
            children: [
              { path: AppUserRoute.Caregivers, element: <PatientCaregiversPage /> },
              { path: AppUserRoute.CareTeamSettings, element: <CareTeamSettingsPage /> },
              { path: '*', element: <PatientData /> }
            ]
          }
        ]
      }]
  }
}

export const buildRoutes = () => {
  return [
    {
      path: '',
      element: <RouterRoot />,
      children: [
        ...COMMON_ROUTES,
        getLoggedInRoutes(),
        { path: 'loading', element: <SpinningLoader className="centered-spinning-loader" /> }
      ]
    }
  ]
}

export const buildRouterContent = () => {
  return createBrowserRouter(buildRoutes())
}
