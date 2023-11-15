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

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'branding/global.css'
import 'classes.css'
import { AppUserRoute } from '../models/enums/routes.enum'
import { UserRole } from '../lib/auth/models/enums/user-role.enum'
import { CaregiverLayout, CaregiverLayoutWithPatientsProviders } from '../layout/caregiver-layout'
import { PatientLayout } from '../layout/patient-layout'
import { CareTeamSettingsPage } from '../pages/care-team-settings/care-team-settings-page'
import { PatientListPage } from '../components/patient-list/patient-list-page'
import { PatientData } from '../components/patient-data/patient-data'
import { PatientCaregiversPage } from '../pages/patient/caregivers/patient-caregivers-page'
import SpinningLoader from '../components/loaders/spinning-loader'
import TeamApi from '../lib/team/team.api'
import { HcpLayout, NavigateWithCorrectTeamId, PatientListProviders } from '../layout/hcp-layout'
import PatientUtils from '../lib/patient/patient.util'
import HttpService from '../lib/http/http.service'
import AuthService from '../lib/auth/auth.service'
import { userLoader } from './loaders'
import { RouterRoot } from './root'
import { AuthLayout, UserLayout } from '../layout/user-layout'
import { COMMON_LOGGED_ROUTES, COMMON_ROUTES } from './common-routes'


const getHcpRoutes = () => {
  return [
    {
      path: ':userId',
      element: <HcpLayout />,
      loader: async ({ params }) => {
        if (!HttpService.isServiceAvailable()) {
          return redirect('/')
        }
        const teams = await TeamApi.getTeams(params.userId, UserRole.Hcp)
        if (!teams.length) {
          throw Error('Error when retrieving teams')
        }
        return teams
      },
      id: 'teams-hcps',
      children: [
        ...COMMON_LOGGED_ROUTES,
        {
          path: 'teams',
          children: [
            {
              path: ':teamId/patients',
              element: <PatientListProviders />,
              loader: async ({ params }) => {
                if (!HttpService.isServiceAvailable()) {
                  return redirect('/')
                }
                if (!params.teamId) {
                  return null
                }
                return PatientUtils.computePatientsForHcp(params.userId, UserRole.Hcp, params.teamId)
              },
              id: 'patients-route-for-hcp',
              children: [
                { path: '', element: <PatientListPage /> },
                { path: ':patientId/*', element: <PatientData /> }
              ]
            },
            { path: ':teamId', element: <CareTeamSettingsPage /> },
            { path: 'private', element: <Navigate to="/teams/private/patients" replace /> },
            { path: '', element: <NavigateWithCorrectTeamId /> }
          ]
        },
        { path: '*', element: <Navigate to={AppUserRoute.NotFound} replace /> }
      ]
    }
  ]
}

const getCaregiverRoutes = () => {
  return [
    {
      element: <CaregiverLayout />,
      children: [
        ...COMMON_LOGGED_ROUTES,
        {
          path: AppUserRoute.PatientsList,
          element: <CaregiverLayoutWithPatientsProviders />,
          loader: async () => {
            if (!HttpService.isServiceAvailable()) {
              return redirect('/')
            }
            return await PatientUtils.computePatientsForCaregiver()
          },
          id: 'patients-route-for-caregivers',
          children: [
            { path: '', element: <PatientListPage /> },
            { path: ':patientId/*', element: <PatientData /> }
          ]
        },
        { path: '', element: <Navigate to={AppUserRoute.PrivatePatientsList} replace /> },
        { path: '*', element: <Navigate to={AppUserRoute.NotFound} replace /> }
      ]
    }
  ]
}

const getPatientRoutes = () => {
  return [
    {
      element: <PatientLayout />,
      loader: async ({ params }) => {
        if (!HttpService.isServiceAvailable()) {
          return redirect('/')
        }
        const teams = await TeamApi.getTeams(params.userId, UserRole.Patient)
        if (!teams.length) {
          throw Error('Error when retrieving teams')
        }
        return teams
      },
      id: 'teams-patients',
      children: [
        ...COMMON_LOGGED_ROUTES,
        { path: AppUserRoute.Caregivers, element: <PatientCaregiversPage /> },
        { path: AppUserRoute.CareTeamSettings, element: <CareTeamSettingsPage /> },
        { path: '*', element: <PatientData /> }
      ]
    }
  ]
}

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
          return teams
        },
        children: [
          ...COMMON_LOGGED_ROUTES,
          {
            path: 'teams',
            children: [
              { path: 'private', element: <Navigate to="/teams/private/patients" replace /> },
              { path: ':teamId', element: <CareTeamSettingsPage /> },
              {
                path: ':teamId/patients',
                element: <PatientListProviders />,
                loader: async ({ params }) => {
                  if (!params.teamId) {
                    return null
                  }
                  const user = AuthService.getUser()
                  if (user.isUserHcp()) {
                    return PatientUtils.computePatientsForHcp(params.userId, UserRole.Hcp, params.teamId)
                  }
                  return await PatientUtils.computePatientsForCaregiver()
                },
                id: 'patients-route',
                children: [
                  { path: '', element: <PatientListPage /> },
                  { path: ':patientId/*', element: <PatientData /> }
                ]
              },
              {
                path: '',
                element: <NavigateWithCorrectTeamId />
              }

            ]
          },
          {
            path: '',
            loader: () => {
              const user = AuthService.getUser()
              if (user.isUserPatient()) {
                return redirect(AppUserRoute.Dashboard)
              }
              return null
            },
            element: <NavigateWithCorrectTeamId />
          },
          {
            path: '*',
            element: <Outlet />,
            loader: () => {
              const user = AuthService.getUser()
              if (!user.isUserPatient()) {
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
  return createBrowserRouter([
    {
      path: '',
      element: <RouterRoot />,
      // errorElement: <SpinningLoader className="centered-spinning-loader" />,
      children: [
        ...COMMON_ROUTES,
        getLoggedInRoutes(),
        { path: 'loading', element: <SpinningLoader className="centered-spinning-loader" /> }
        // { path: '*', element: <Navigate to={AppRoute.Login} replace /> }
      ]
    }
  ])
}
