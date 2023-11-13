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

import React, { type FC } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'branding/global.css'
import 'classes.css'

import appConfig from '../lib/config/config'
import { AuthContextProvider, useAuth } from '../lib/auth'
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
import { HcpLayout, NavigateWithCorrectTeamId } from '../layout/hcp-layout'
import { CaregiverLayout } from '../layout/caregiver-layout'
import { PatientLayout } from '../layout/patient-layout'
import { ProfilePage } from '../pages/profile/profile-page'
import { NotificationsPage } from '../pages/notifications/notifications-page'
import { CareTeamSettingsPage } from '../pages/care-team-settings/care-team-settings-page'
import { PatientListPage } from '../components/patient-list/patient-list-page'
import { PatientData } from '../components/patient-data/patient-data'
import { PatientCaregiversPage } from '../pages/patient/caregivers/patient-caregivers-page'

const Root: FC = () => {
  return (
    <>
      <MetricsLocationListener />
      <MainLobby />
    </>
  )
}

const YourloopsRouter: FC = () => {
  const { user } = useAuth()

  const getUserLayout = () => {
    switch (user?.role) {
      case UserRole.Hcp:
        return [
          {
            element: <HcpLayout />,
            children: [
              {
                path: AppUserRoute.Preferences,
                element: <ProfilePage />
              },
              {
                path: AppUserRoute.Notifications,
                element: <NotificationsPage />
              },
              {
                path: AppUserRoute.CareTeamSettings,
                element: <CareTeamSettingsPage />
              },
              {
                path: "teams/private",
                element: <Navigate to="/teams/private/patients" replace />
              },
              {
                path: AppUserRoute.PatientsList,
                element: <PatientListPage />
              },
              {
                path: AppUserRoute.PatientView,
                element: <PatientData />
              },
              {
                path: '',
                element: <NavigateWithCorrectTeamId />
              },
              {
                path: '*',
                element: <Navigate to={AppUserRoute.NotFound} replace />
              }
            ]
          }
        ]
      case UserRole.Caregiver:
        return [
          {
            element:
              <CaregiverLayout />,
            children: [
              {
                path: AppUserRoute.Preferences,
                element: <ProfilePage />
              },
              {
                path: AppUserRoute.Notifications,
                element: <NotificationsPage />
              },
              {
                path: AppUserRoute.PatientsList,
                element: <PatientListPage />
              },
              {
                path: AppUserRoute.PatientView,
                element: <PatientData />
              },
              {
                path: '',
                element: <Navigate to={AppUserRoute.PrivatePatientsList} replace />
              },
              {
                path: '*',
                element: <Navigate to={AppUserRoute.NotFound} replace />
              }
            ]
          }
        ]
      case UserRole.Patient:
        return [
          {
            element:
              <PatientLayout />,
            children: [
              {
                path: AppUserRoute.Preferences,
                element: <ProfilePage />
              },
              {
                path: AppUserRoute.Notifications,
                element: <NotificationsPage />
              },
              {
                path: AppUserRoute.Caregivers,
                element: <PatientCaregiversPage />
              },
              {
                path: AppUserRoute.CareTeamSettings,
                element: <CareTeamSettingsPage />
              },
              {
                path: '*',
                element: <PatientData />
              }
            ]
          }
        ]
      default:
        return []
    }
  }

  const router = createBrowserRouter([
    {
      element: <Root />,
      children: [
        {
          path: AppRoute.ProductLabelling,
          element: <ProductLabellingPage />
        },
        {
          path: AppRoute.Login,
          element: <LoginPageLanding />
        },
        {
          path: AppRoute.CompleteSignup,
          element: <CompleteSignUpPage />
        },
        {
          path: AppRoute.RenewConsent,
          element: <ConsentPage messageKey="consent-renew-message" />
        },
        {
          path: AppRoute.NewConsent,
          element: <ConsentPage messageKey="consent-welcome-message" />
        },
        {
          path: AppRoute.Training,
          element: <TrainingPage />
        },
        {
          path: AppRoute.VerifyEmail,
          element: <VerifyEmailPage />
        },
        {
          path: AppUserRoute.NotFound,
          element: <InvalidRoute />
        },
        {
          path: '*',
          children: getUserLayout()
        }
      ]
    }
  ]);

  return (
    <RouterProvider router={router} />
  )
}

export const Yourloops: FC = () => {
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
      <AuthContextProvider>
        <YourloopsRouter />
      </AuthContextProvider>
    </Auth0Provider>
  )
}
