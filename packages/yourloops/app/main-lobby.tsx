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
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { ThemeProvider } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { GlobalStyles, TssCacheProvider } from 'tss-react'
import createCache from '@emotion/cache'
import CssBaseline from '@mui/material/CssBaseline'

import { useAuth, type User } from '../lib/auth'
import { getTheme } from '../components/theme'
import { DefaultSnackbarContext, SnackbarContextProvider } from '../components/utils/snackbar'
import Footer from '../components/footer/footer'
import PatientConsentPage from '../pages/patient/patient-consent'
import CompleteSignUpPage from '../pages/signup/complete-signup-page'
import { ConsentPage } from '../pages/login'
import { MainLayout } from '../layout/main-layout'
import TrainingPage from '../pages/training/training'
import ProductLabellingPage from '../pages/product-labelling/product-labelling-page'
import LoginPage from '../pages/login/login-page-landing'
import { ALWAYS_ACCESSIBLE_ROUTES, PUBLIC_ROUTES } from '../lib/diabeloop-urls.model'
import VerifyEmailPage from '../pages/login/verify-email-page'
import Box from '@mui/material/Box'
import { useIdleTimer } from 'react-idle-timer'
import { ConfigService } from '../lib/config/config.service'
import { AppRoute } from '../models/enums/routes.enum'

const muiCache = createCache({
  key: 'mui',
  prepend: true
})

const tssCache = createCache({
  key: 'tss'
})
tssCache.compat = true

const isRoutePublic = (route: string): boolean => PUBLIC_ROUTES.includes(route as AppRoute)

export const getRedirectUrl = (route: string, user: User, isAuthenticated: boolean): string | undefined => {
  const routeIsPublic = isRoutePublic(route)
  const renewConsentPath = route === AppRoute.RenewConsent || route === AppRoute.NewConsent
  const trainingPath = route === AppRoute.Training
  const isCurrentRouteAlwaysAccessible = ALWAYS_ACCESSIBLE_ROUTES.includes(route as AppRoute)
  if (routeIsPublic && isAuthenticated) {
    return '/'
  }
  if (!isAuthenticated && !routeIsPublic && !isCurrentRouteAlwaysAccessible) {
    return AppRoute.Login
  }
  if (route !== AppRoute.CompleteSignup && isAuthenticated && user && user.isFirstLogin()) {
    return AppRoute.CompleteSignup
  }
  if (!renewConsentPath && user && user.hasToAcceptNewConsent()) {
    return AppRoute.NewConsent
  }
  if (!renewConsentPath && user && user.hasToRenewConsent()) {
    return AppRoute.RenewConsent
  }
  if (!trainingPath && route !== AppRoute.CompleteSignup && !renewConsentPath && user && user.hasToDisplayTrainingInfoPage()) {
    return AppRoute.Training
  }
  return undefined
}

export function MainLobby(): JSX.Element {
  const { isLoading, isAuthenticated } = useAuth0()
  const { fetchingUser, isLoggedIn, logout, user } = useAuth()
  const location = useLocation()
  const currentRoute = location.pathname
  const theme = getTheme()
  const isCurrentRoutePublic = isRoutePublic(currentRoute)

  const onIdle = async (): Promise<void> => {
    if (isLoggedIn) {
      await logout(true)
    }
  }

  useIdleTimer({ timeout: ConfigService.getIdleTimeout(), onIdle })

  if (!isCurrentRoutePublic && isLoading) {
    return <React.Fragment />
  }

  const redirectTo = getRedirectUrl(currentRoute, user, isAuthenticated)

  return (
    <React.Fragment>
      {redirectTo
        ? <Navigate to={redirectTo} replace />
        : (!isLoading && !fetchingUser &&
          <CacheProvider value={muiCache}>
            <TssCacheProvider value={tssCache}>
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <GlobalStyles styles={{ body: { backgroundColor: 'var(--body-background-color)' } }} />
                <SnackbarContextProvider context={DefaultSnackbarContext}>
                  <Box>
                    <Routes>
                      <Route path={AppRoute.ProductLabelling} element={<ProductLabellingPage />} />
                      <Route path={AppRoute.Login} element={<LoginPage />} />
                      <Route path={AppRoute.CompleteSignup} element={<CompleteSignUpPage />} />
                      <Route path={AppRoute.RenewConsent} element={<ConsentPage />} />
                      <Route path={AppRoute.NewConsent} element={<PatientConsentPage />} />
                      <Route path={AppRoute.Training} element={<TrainingPage />} />
                      <Route path={AppRoute.VerifyEmail} element={<VerifyEmailPage />} />
                      <Route path="*" element={<MainLayout />} />
                    </Routes>
                  </Box>
                </SnackbarContextProvider>
                <Footer />
              </ThemeProvider>
            </TssCacheProvider>
          </CacheProvider>
          )}
    </React.Fragment>
  )
}
