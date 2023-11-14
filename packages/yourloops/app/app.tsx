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

import React, { type FC, useEffect } from 'react'
import { createBrowserRouter, Navigate, redirect, RouterProvider } from 'react-router-dom'
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'branding/global.css'
import 'classes.css'

import appConfig from '../lib/config/config'
import { User } from '../lib/auth'
import MetricsLocationListener from '../components/MetricsLocationListener'
import { MainLobby } from './main-lobby'
import { AppRoute, AppUserRoute } from '../models/enums/routes.enum'
import { ProductLabellingPage } from '../pages/product-labelling/product-labelling-page'
import { LoginPageLanding } from '../pages/login/login-page-landing'
import { CompleteSignUpPage } from '../pages/signup/complete-signup-page'
import { ConsentPage } from '../pages/consent/consent-page'
import { TrainingPage } from '../pages/training/training'
import { VerifyEmailPage } from '../pages/login/verify-email-page'
import { InvalidRoute } from '../components/invalid-route'
import { UserRole } from '../lib/auth/models/enums/user-role.enum'
import { CaregiverLayout, CaregiverLayoutWithPatientsProviders } from '../layout/caregiver-layout'
import { PatientLayout } from '../layout/patient-layout'
import { ProfilePage } from '../pages/profile/profile-page'
import { NotificationsPage } from '../pages/notifications/notifications-page'
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
import { AuthenticatedUser } from '../lib/auth/models/authenticated-user.model'
import UserApi from '../lib/auth/user.api'
import { sanitizeBgUnit } from '../lib/auth/user.util'
import { v4 as uuidv4 } from 'uuid'

const checkFirstSignup = (user: User | null) => {
  if (user && user.isFirstLogin()) {
    redirect(AppRoute.CompleteSignup)
  }
}

const checkConsent = (user: User | null) => {
  if (user && user.hasToAcceptNewConsent()) {
    redirect(AppRoute.NewConsent)
  }
  if (user && user.hasToRenewConsent()) {
    redirect(AppRoute.RenewConsent)
  }
}

const checkTraining = (user: User | null) => {
  if (user && user.hasToDisplayTrainingInfoPage()) {
    redirect(AppRoute.NewConsent)
  }
}

const retrieveUser = async (user: User | null) => {
  if (!user || AuthService.hasUserBeenRetrieved()) {
    return AuthService.getUser()
  }
  const userMetadata = await UserApi.getUserMetadata(user.id)
  if (userMetadata) {
    user.profile = userMetadata.profile
    user.preferences = userMetadata.preferences
    user.settings = userMetadata.settings
    if (!user.settings) {
      user.settings = {}
    }
    user.settings.units = {
      bg: sanitizeBgUnit(userMetadata.settings?.units?.bg)
    }
  }
  AuthService.setUser(user)
  AuthService.setHasUserBeenRetrieved(true)
  return user
}

const COMMON_ROUTES = [
  {
    path: AppRoute.ProductLabelling,
    loader: async () => {
      const user = AuthService.getUser()
      // await retrieveUser(user)
      checkFirstSignup(user)
      checkConsent(user)
      checkTraining(user)
      return null
    },
    element: <ProductLabellingPage />
  },
  {
    path: AppRoute.Login,
    loader: async () => {
      const isAuthenticated = AuthService.isAuthenticated()
      const user = AuthService.getUser()
      if (!isAuthenticated) {
        return null
      }
      // await retrieveUser(user)
      checkFirstSignup(user)
      checkConsent(user)
      checkTraining(user)
      if (user.isUserHcp()) {
        return redirect(`/hcps/${user.id}/teams`)
      }
      if (user.isUserPatient()) {
        return redirect(`/patients/${user.id}`)
      }
      if (user.isUserCaregiver()) {
        return redirect(`/caregivers/${user.id}`)
      }
      throw Error(`Could not get role for user ${JSON.stringify(user)}`)
    },
    element: <LoginPageLanding />
  },
  { path: AppRoute.CompleteSignup, element: <CompleteSignUpPage /> },
  {
    path: AppRoute.RenewConsent,
    loader: async () => {
      const user = AuthService.getUser()
      // await retrieveUser(user)
      checkFirstSignup(user)
      return null
    },
    element: <ConsentPage messageKey="consent-renew-message" />
  },
  {
    path: AppRoute.NewConsent,
    loader: async () => {
      const user = AuthService.getUser()
      // await retrieveUser(user)
      checkFirstSignup(user)
      return null
    },
    element: <ConsentPage messageKey="consent-welcome-message" />
  },
  {
    path: AppRoute.Training,
    loader: async () => {
      const user = AuthService.getUser()
      // await retrieveUser(user)
      checkFirstSignup(user)
      checkConsent(user)
      return null
    },
    element: <TrainingPage />
  },
  {
    path: AppRoute.VerifyEmail,
    loader: async () => {
      const user = AuthService.getUser()
      // await retrieveUser(user)
      checkFirstSignup(user)
      checkConsent(user)
      checkTraining(user)
      return null
    },
    element: <VerifyEmailPage />
  }
]

const COMMON_LOGGED_ROUTES = [
  { path: AppUserRoute.Preferences, element: <ProfilePage /> },
  { path: AppUserRoute.Notifications, element: <NotificationsPage /> },
  { path: AppUserRoute.NotFound, element: <InvalidRoute /> }
]


const AuthUpdater: FC = () => {
  const { isAuthenticated, user, getAccessTokenSilently, isLoading } = useAuth0()

  AuthService.setIsLoggedIn(isAuthenticated)
  if (user && !AuthService.getUser()) {
    AuthService.setUser(new User(user as AuthenticatedUser))
  }

  useEffect(() => {
    const getAccessToken = async (): Promise<string> => await getAccessTokenSilently()
    HttpService.setGetAccessTokenMethod(getAccessToken)
    HttpService.setTraceToken(uuidv4())
  }, [getAccessTokenSilently])

  return (
    <>
      {!isLoading &&
        <>
          <MetricsLocationListener />
          <MainLobby />
        </>
      }
    </>
  )
}

const Root: FC = () => {
  const redirectUri = window.location.origin
  return (
    <Auth0Provider
      domain={appConfig.AUTH0_DOMAIN}
      issuer={appConfig.AUTH0_ISSUER}
      clientId={appConfig.AUTH0_CLIENT_ID}
      useRefreshTokensFallback
      authorizationParams={{
        redirect_uri: redirectUri,
        audience: 'https://api-ext.your-loops.com'
      }}
      useRefreshTokens
    >
      <AuthUpdater />
    </Auth0Provider>
  )
}

const getHcpLayout = () => {
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
      id: 'teams-route',
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

const getCaregiverLayout = () => {
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

const getPatientLayout = () => {
  return [
    {
      element: <PatientLayout />,
      children: [
        ...COMMON_LOGGED_ROUTES,
        { path: AppUserRoute.Caregivers, element: <PatientCaregiversPage /> },
        { path: AppUserRoute.CareTeamSettings, element: <CareTeamSettingsPage /> },
        { path: '*', element: <PatientData /> }
      ]
    }
  ]
}

const userLoader = async (currentRoleRoute: UserRole) => {
  const isAuthenticated = AuthService.isAuthenticated()
  if (!isAuthenticated) {
    return redirect('/login')
  }
  const user = AuthService.getUser()
  if (user.role !== currentRoleRoute) {
    redirect('/login')
  }
  checkFirstSignup(user)
  checkConsent(user)
  return await retrieveUser(user)
}

const router = createBrowserRouter([
  {
    element: <Root />,
    loader: async () => {
      const isAuthenticated = AuthService.isAuthenticated()
      if (!isAuthenticated) {
        return null
      }
      const user = AuthService.getUser()
      return await retrieveUser(user)
    },
    errorElement: <SpinningLoader className="centered-spinning-loader" />,
    children: [
      ...COMMON_ROUTES,
      {
        path: 'hcps/',
        loader: async () => {
          return userLoader(UserRole.Hcp)
        },
        id: 'user-hcps',
        children: getHcpLayout()
      },
      {
        path: 'caregivers/:userId',
        loader: async () => {
          return userLoader(UserRole.Caregiver)
        },
        id: 'user-caregivers',
        children: getCaregiverLayout()
      },
      { path: 'patients/:userId', children: getPatientLayout() },
      { path: '*', element: <Navigate to={AppRoute.Login} replace /> }
    ]
  }
])


export const Yourloops: FC = () => {
  return (
    <RouterProvider router={router} fallbackElement={<SpinningLoader className="centered-spinning-loader" />} />
  )
}
