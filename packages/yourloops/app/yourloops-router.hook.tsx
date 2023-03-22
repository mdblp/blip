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
import { Navigate, type RouteObject } from 'react-router-dom'

import { useAuth } from '../lib/auth'
import { AppRoute, AppUserRoute } from '../models/enums/routes.enum'
import { MainLobby } from './main-lobby'
import LoginPage from '../pages/login/login-page-landing'
import ProductLabellingPage from '../pages/product-labelling/product-labelling-page'
import CompleteSignUpPage from '../pages/signup/complete-signup-page'
import { ConsentPage } from '../pages/login'
import PatientConsentPage from '../pages/patient/patient-consent'
import TrainingPage from '../pages/training/training'
import VerifyEmailPage from '../pages/login/verify-email-page'
import { MainLayout } from '../layout/main-layout'
import InvalidRoute from '../components/invalid-route'
import ProfilePage from '../pages/profile/profile-page'
import NotificationsPage from '../pages/notifications'
import PatientDataPage from '../components/patient-data'
import TeamDetailsPage from '../pages/team/team-details-page'
import CaregiversPage from '../pages/patient/caregivers/page'
import { UserRole } from '../lib/auth/models/enums/user-role.enum'
import HomePage from '../pages/home-page'

interface YourloopsRouterHookResult {
  routes: RouteObject[]
}

export const useYourloopsRouterHook = (): YourloopsRouterHookResult => {
  const { user } = useAuth()
  console.log('rendering')

  const getRolesCommonRoutes = (): RouteObject[] => {
    return [
      {
        path: AppUserRoute.NotFound,
        element: <InvalidRoute />
      },
      {
        path: AppUserRoute.Preferences,
        element: <ProfilePage />
      },
      {
        path: AppUserRoute.Notifications,
        element: <NotificationsPage />
      }
    ]
  }

  const getCaregiverRoutes = (): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      {
        path: AppUserRoute.Home,
        element: <HomePage />
      },
      {
        path: `${AppUserRoute.Patient}/:patientId/*`,
        element: <PatientDataPage />
      },
      {
        path: '/',
        element: <Navigate to={AppUserRoute.Home} replace />
      },
      {
        path: '*',
        element: <Navigate to={AppUserRoute.NotFound} replace />
      }
    ]
  }

  const getHcpRoutes = (): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      ...getCaregiverRoutes(),
      {
        path: AppUserRoute.Team,
        element: <TeamDetailsPage />
      }
    ]
  }

  const getPatientRoutes = (): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      {
        path: AppUserRoute.Home,
        element: <PatientDataPage />
      },
      {
        path: `${AppUserRoute.Teams}/:teamId`,
        element: <TeamDetailsPage />
      },
      {
        path: AppUserRoute.Caregivers,
        element: <CaregiversPage />
      },
      {
        path: '*',
        element: <PatientDataPage/>
      }
    ]
  }

  const getRoleSpecificRoutes = (): RouteObject[] => {
    switch (user?.role) {
      case UserRole.Hcp:
        return getHcpRoutes()
      case UserRole.Caregiver:
        return getCaregiverRoutes()
      case UserRole.Patient:
        return getPatientRoutes()
      default:
        return []
    }
  }

  const getRoutes = (): RouteObject[] => {
    const roleSpecificRoutes = getRoleSpecificRoutes()
    return [
      {
        element: <MainLobby />,
        children: [
          {
            path: AppRoute.Login,
            element: <LoginPage />
          },
          {
            path: AppRoute.ProductLabelling,
            element: <ProductLabellingPage />
          },
          {
            path: AppRoute.CompleteSignup,
            element: <CompleteSignUpPage />
          },
          {
            path: AppRoute.RenewConsent,
            element: <ConsentPage />
          },
          {
            path: AppRoute.NewConsent,
            element: <PatientConsentPage />
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
            element: <MainLayout />,
            children: roleSpecificRoutes
          }
        ]
      }
    ]
  }

  return { routes: getRoutes() }
}
