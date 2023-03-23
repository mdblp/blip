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

import React, { useCallback, useEffect, useMemo } from 'react'
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
import PatientUtils from '../lib/patient/patient.util'
import { errorTextFromException } from '../lib/utils'
import SpinningLoader from '../components/loaders/spinning-loader'

interface YourloopsRouterHookResult {
  routes: RouteObject[]
}

export const useYourloopsRouterHook = (): YourloopsRouterHookResult => {
  const { user } = useAuth()

  useEffect(() => {
    console.log(user)
  }, [user])

  const getRolesCommonRoutes = useCallback((): RouteObject[] => {
    return [
      {
        path: AppUserRoute.NotFound,
        Component: InvalidRoute
      },
      {
        path: AppUserRoute.Preferences,
        Component: ProfilePage
      },
      {
        path: AppUserRoute.Notifications,
        Component: NotificationsPage
      }
    ]
  }, [])

  const getCaregiverRoutes = useCallback((): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      {
        path: AppUserRoute.Home,
        // id: 'home',
        // loader: async () => {
        //   try {
        //     return { patients: await PatientUtils.computePatients(user) }
        //   } catch (reason: unknown) {
        //     return { error: errorTextFromException(reason) }
        //   }
        // },
        Component: HomePage
      },
      {
        path: `${AppUserRoute.Patient}/:patientId/*`,
        Component: PatientDataPage
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
  }, [getRolesCommonRoutes])

  const getHcpRoutes = useCallback((): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      ...getCaregiverRoutes(),
      {
        path: AppUserRoute.Team,
        Component: TeamDetailsPage
      }
    ]
  }, [getCaregiverRoutes, getRolesCommonRoutes])

  const getPatientRoutes = useCallback((): RouteObject[] => {
    return [
      ...getRolesCommonRoutes(),
      {
        path: AppUserRoute.Home,
        Component: PatientDataPage
      },
      {
        path: `${AppUserRoute.Teams}/:teamId`,
        Component: TeamDetailsPage
      },
      {
        path: AppUserRoute.Caregivers,
        Component: CaregiversPage
      },
      {
        path: '*',
        Component: PatientDataPage
      }
    ]
  }, [getRolesCommonRoutes])

  const getRoleSpecificRoutes = useCallback((): RouteObject[] => {
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
  }, [getCaregiverRoutes, getHcpRoutes, getPatientRoutes, user?.role])

  const getRoutes = (): RouteObject[] => {
    const roleSpecificRoutes = getRoleSpecificRoutes()
    console.log(roleSpecificRoutes)
    return [
      {
        Component: MainLobby,
        children: [
          {
            path: AppRoute.Login,
            Component: LoginPage
          },
          {
            path: AppRoute.ProductLabelling,
            Component: ProductLabellingPage
          },
          {
            path: AppRoute.CompleteSignup,
            Component: CompleteSignUpPage
          },
          {
            path: AppRoute.RenewConsent,
            Component: ConsentPage
          },
          {
            path: AppRoute.NewConsent,
            Component: PatientConsentPage
          },
          {
            path: AppRoute.Training,
            Component: TrainingPage
          },
          {
            path: AppRoute.VerifyEmail,
            Component: VerifyEmailPage
          },
          {
            // path: '*',
            Component: MainLayout,
            id: 'mainLayout',
            loader: async () => {
              // if (user.isUserHcp() || user.isUserPatient()) {
              //   try {
              //     return { teams: await TeamApi.getTeams(user) }
              //   } catch (reason: unknown) {
              //     return { error: errorTextFromException(reason) }
              //   }
              // }
              // return null
              console.log(user)
              if (!user) {
                return null
              }
              try {
                return { patients: await PatientUtils.computePatients(user) }
              } catch (reason: unknown) {
                return { error: errorTextFromException(reason) }
              }
            },
            children: roleSpecificRoutes
          }
        ]
      }
    ]
  }

  const getRoutes2 = useCallback((): RouteObject[] => {
    const roleSpecificRoutes = getRoleSpecificRoutes()
    console.log(roleSpecificRoutes)
    const mainLobbyChildren: RouteObject[] = [
      {
        path: AppRoute.Login,
        Component: LoginPage
      },
      {
        path: AppRoute.ProductLabelling,
        Component: ProductLabellingPage
      },
      {
        path: AppRoute.CompleteSignup,
        Component: CompleteSignUpPage
      },
      {
        path: AppRoute.RenewConsent,
        Component: ConsentPage
      },
      {
        path: AppRoute.NewConsent,
        Component: PatientConsentPage
      },
      {
        path: AppRoute.Training,
        Component: TrainingPage
      },
      {
        path: AppRoute.VerifyEmail,
        Component: VerifyEmailPage
      }
    ]
    if (roleSpecificRoutes.length !== 0) {
      mainLobbyChildren.push(
        {
          // path: '*',
          Component: MainLayout,
          id: 'mainLayout',
          loader: async () => {
            // if (user.isUserHcp() || user.isUserPatient()) {
            //   try {
            //     return { teams: await TeamApi.getTeams(user) }
            //   } catch (reason: unknown) {
            //     return { error: errorTextFromException(reason) }
            //   }
            // }
            // return null
            console.log(user)
            if (!user) {
              return null
            }
            try {
              return { patients: await PatientUtils.computePatients(user) }
            } catch (reason: unknown) {
              return { error: errorTextFromException(reason) }
            }
          },
          children: roleSpecificRoutes
        }
      )
    } else {
      mainLobbyChildren.push(
        {
          path: '*',
          Component: SpinningLoader
        }
      )
    }
    return [
      {
        Component: MainLobby,
        children: mainLobbyChildren
      }
    ]
  }, [getRoleSpecificRoutes, user])

  const routes = useMemo(() => {
    return getRoutes2()
  }, [getRoutes2])

  return useMemo(() => {
    return { routes }
  }, [routes])
}
