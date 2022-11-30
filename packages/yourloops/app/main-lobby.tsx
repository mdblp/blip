/*
 * Copyright (c) 2022, Diabeloop
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
import { Redirect, Route, Switch, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { Theme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles'
import { makeStyles } from '@mui/styles'
import CssBaseline from '@mui/material/CssBaseline'

import { useAuth, User } from '../lib/auth'
import { getTheme } from '../components/theme'
import { DefaultSnackbarContext, SnackbarContextProvider } from '../components/utils/snackbar'
import Footer from '../components/footer/footer'
import PatientConsentPage from '../pages/patient/patient-consent'
import CompleteSignUpPage from '../pages/signup/complete-signup-page'
import { ConsentPage } from '../pages/login'
import { MainLayout } from '../layout/main-layout'
import TrainingPage from '../pages/training/training'
import ProductLabellingPage from '../pages/intented-use/product-labelling-page'
import LoginPage from '../pages/login/login-page'
import {
  ALWAYS_ACCESSIBLE_ROUTES,
  COMPLETE_SIGNUP_PATH,
  NEW_CONSENT_PATH,
  PUBLIC_ROUTES,
  RENEW_CONSENT_PATH,
  TRAINING_PATH
} from '../lib/diabeloop-url'

const routeStyle = makeStyles<Theme>(() => {
  return {
    public: {
      flex: '1 0 auto',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    },
    private: {
      flex: '1 0 auto'
    }
  }
})

const isRoutePublic = (route: string): boolean => PUBLIC_ROUTES.includes(route)

export const getRedirectUrl = (route: string, user: User, isAuthenticated: boolean): string | undefined => {
  const routeIsPublic = isRoutePublic(route)
  const renewConsentPath = route === RENEW_CONSENT_PATH || route === NEW_CONSENT_PATH
  const trainingPath = route === TRAINING_PATH
  const isCurrentRouteAlwaysAccessible = ALWAYS_ACCESSIBLE_ROUTES.includes(route)
  if (routeIsPublic && isAuthenticated) {
    return '/'
  }
  if (!isAuthenticated && !routeIsPublic && !isCurrentRouteAlwaysAccessible) {
    return '/login'
  }
  if (route !== COMPLETE_SIGNUP_PATH && isAuthenticated && user && user.isFirstLogin()) {
    return '/complete-signup'
  }
  if (!renewConsentPath && user && user.hasToAcceptNewConsent()) {
    return '/new-consent'
  }
  if (!renewConsentPath && user && user.hasToRenewConsent()) {
    return '/renew-consent'
  }
  if (!trainingPath && route !== COMPLETE_SIGNUP_PATH && !renewConsentPath && user && user.hasToDisplayTrainingInfoPage()) {
    return '/training'
  }
  return undefined
}

export function MainLobby(): JSX.Element {
  const { isLoading, isAuthenticated } = useAuth0()
  const { fetchingUser, user } = useAuth()
  const location = useLocation()
  const currentRoute = location.pathname
  const theme = getTheme()
  const classes = routeStyle()
  const isCurrentRoutePublic = isRoutePublic(currentRoute)

  if (!isCurrentRoutePublic && isLoading) {
    return <React.Fragment />
  }

  const style = isCurrentRoutePublic || currentRoute === COMPLETE_SIGNUP_PATH ? classes.public : classes.private
  const redirectTo = getRedirectUrl(currentRoute, user, isAuthenticated)

  return (
    <React.Fragment>
      {redirectTo
        ? <Redirect to={redirectTo} />
        : (!isLoading && !fetchingUser &&
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarContextProvider context={DefaultSnackbarContext}>
                <div className={style}>
                  <Switch>
                    <Route exact path="/product-labelling" component={ProductLabellingPage} />
                    <Route exact path="/login" component={LoginPage} />
                    <Route exact path="/complete-signup" component={CompleteSignUpPage} />
                    <Route exact path="/renew-consent" component={ConsentPage} />
                    <Route exact path="/new-consent" component={PatientConsentPage} />
                    <Route exact path="/training" component={TrainingPage} />
                    <Route component={MainLayout} />
                  </Switch>
                </div>
              </SnackbarContextProvider>
              <Footer />
            </ThemeProvider>
          </StyledEngineProvider>
          )}
    </React.Fragment>
  )
}
