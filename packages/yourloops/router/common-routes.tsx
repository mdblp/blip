/*
 * Copyright (c) 2023, Diabeloop
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

import { AppRoute, AppUserRoute } from '../models/enums/routes.enum'
import AuthService from '../lib/auth/auth.service'
import { retrieveUser } from './loaders'
import { ProductLabellingPage } from '../pages/product-labelling/product-labelling-page'
import { redirect } from 'react-router-dom'
import { LoginPageLanding } from '../pages/login/login-page-landing'
import { CompleteSignUpPage } from '../pages/signup/complete-signup-page'
import { ConsentPage } from '../pages/consent/consent-page'
import { TrainingPage } from '../pages/training/training'
import { VerifyEmailPage } from '../pages/login/verify-email-page'
import { ProfilePage } from '../pages/profile/profile-page'
import { NotificationsPage } from '../pages/notifications/notifications-page'
import { InvalidRoute } from '../components/invalid-route'
import React from 'react'

export const COMMON_ROUTES = [
  {
    path: AppRoute.ProductLabelling,
    element: <ProductLabellingPage />
  },
  {
    path: AppRoute.Login,
    loader: () => {
      if (AuthService.isAuthenticated()) {
        return redirect('/')
      }
      return null
    },
    element: <LoginPageLanding />
  },
  {
    path: AppRoute.VerifyEmail,
    loader: () => {
      if (AuthService.isAuthenticated()) {
        return redirect('/')
      }
      return null
    },
    element: <VerifyEmailPage />
  }
]

export const COMMON_LOGGED_ROUTES = [
  { path: AppUserRoute.Preferences, element: <ProfilePage /> },
  { path: AppUserRoute.Notifications, element: <NotificationsPage /> },
  { path: AppUserRoute.NotFound, element: <InvalidRoute /> }
]

export const COMMON_LOGGED_ROUTES_NO_HEADER = [
  {
    path: AppRoute.RenewConsent,
    loader: async () => {
      const user = await retrieveUser()
      if (!user.hasToRenewConsent()) {
        return redirect('/')
      }
      return null
    },
    element: <ConsentPage messageKey="consent-renew-message" />
  },
  { path: AppRoute.CompleteSignup, element: <CompleteSignUpPage /> },
  {
    path: AppRoute.NewConsent,
    loader: async () => {
      const user = await retrieveUser()
      if (!user.hasToAcceptNewConsent()) {
        return redirect('/')
      }
      return null
    },
    element: <ConsentPage messageKey="consent-welcome-message" />
  },
  {
    path: AppRoute.Training,
    loader: async () => {
      const user = await retrieveUser()
      if (!user.hasToDisplayTrainingInfoPage()) {
        return redirect('/')
      }
      return null
    },
    element: <TrainingPage />
  }
]
