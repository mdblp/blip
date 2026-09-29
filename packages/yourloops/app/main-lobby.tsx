/*
 * Copyright (c) 2022-2026, Diabeloop
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
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'

import { ThemeProvider, useTheme } from '@mui/material/styles'
import { CacheProvider } from '@emotion/react'
import { GlobalStyles, TssCacheProvider } from 'tss-react'
import createCache from '@emotion/cache'
import CssBaseline from '@mui/material/CssBaseline'
import useMediaQuery from '@mui/material/useMediaQuery'

import { useAuth, type User } from '../lib/auth'
import { getTheme } from '../components/theme'
import { DefaultSnackbarContext, SnackbarContextProvider } from '../components/utils/snackbar'
import { Footer } from '../components/footer/footer'
import { FooterMobile } from '../components/footer/footer-mobile'
import { getCurrentLang } from '../lib/language'
import { CompleteSignUpPage } from '../pages/signup/complete-signup-page'
import { MainLayout } from '../layout/main-layout'
import { TrainingPage } from '../pages/training/training'
import { ProductLabellingPage } from '../pages/product-labelling/product-labelling-page'
import { LoginPageLanding } from '../pages/login/login-page-landing'
import { ALWAYS_ACCESSIBLE_ROUTES, PUBLIC_ROUTES } from '../lib/diabeloop-urls.model'
import { VerifyEmailPage } from '../pages/verify-email/verify-email-page'
import { useIdleTimer } from 'react-idle-timer'
import { ConfigService } from '../lib/config/config.service'
import { AppRoute } from '../models/enums/routes.enum'
import { ConsentPage } from '../pages/consent/consent-page'
import Box from '@mui/material/Box'
import { VerifyEmailResultPage } from '../pages/verify-email/verify-email-result-page'
import { SignupInformationPage } from '../pages/signup-information/signup-information-page'
import { DblCommunicationPage } from '../pages/dbl-communication/dbl-communication'
import { useQueryParams } from '../lib/custom-hooks/query-params.hook'

const muiCache = createCache({
  key: 'mui',
  prepend: true
})

const tssCache = createCache({
  key: 'tss'
})
tssCache.compat = true

const isRoutePublic = (route: string): boolean => PUBLIC_ROUTES.includes(route as AppRoute)
const isRouteAlwaysAccessible = (route: string): boolean => ALWAYS_ACCESSIBLE_ROUTES.includes(route as AppRoute)


interface RedirectRule {
  targetRoute: AppRoute
  /** user has to visit this route before pursuing other activities on yourloops **/
  isPending: (user: User) => boolean
  /**
   * Routes on which the redirect to `targetRoute` is skipped because the user is already on a page with a bigger priority
   * It MUST contain `targetRoute`, otherwise the redirect would be issued again and again.
   */
  skipRedirectOnRoutes: AppRoute[]
}

/**
 * The pages a user has to visit once logged in, in the order they are presented.
 *
 * Termination invariant: `getPendingRedirectRule` only depends on the user, so navigating cannot
 * change which rule wins, and every rule skips its own `targetRoute`. A redirect to
 * `pendingRule.targetRoute` therefore resolves to the same rule and returns undefined: at most one
 * redirect is issued per user state, whatever the combination of pending rules. Keep it that way when
 * adding a new rule.
 */
export const REDIRECT_RULES: RedirectRule[] = [
  {
    targetRoute: AppRoute.CompleteSignup,
    isPending: (user: User) => user.isFirstLogin(),
    skipRedirectOnRoutes: [AppRoute.CompleteSignup]
  },
  {
    targetRoute: AppRoute.DblCommunication,
    isPending: (user: User) => user.hasToDisplayDblCommunicationPage(),
    skipRedirectOnRoutes: [AppRoute.DblCommunication, AppRoute.CompleteSignup]
  },
  {
    targetRoute: AppRoute.NewConsent,
    isPending: (user: User) => user.hasToAcceptNewConsent(),
    skipRedirectOnRoutes: [AppRoute.NewConsent, AppRoute.RenewConsent]
  },
  {
    targetRoute: AppRoute.RenewConsent,
    isPending: (user: User) => user.hasToRenewConsent(),
    skipRedirectOnRoutes: [AppRoute.NewConsent, AppRoute.RenewConsent]
  },
  {
    targetRoute: AppRoute.Training,
    isPending: (user: User) => user.hasToDisplayTrainingInfoPage(),
    skipRedirectOnRoutes: [AppRoute.Training, AppRoute.CompleteSignup, AppRoute.NewConsent, AppRoute.RenewConsent]
  }
]

const getPendingRedirectRule = (user: User): RedirectRule | undefined => REDIRECT_RULES.find((rule: RedirectRule) => rule.isPending(user))

export const getRedirectUrl = (route: string, user: User | null, isAuthenticated: boolean): string | undefined => {
  const routeIsPublic = isRoutePublic(route)
  const isCurrentRouteAlwaysAccessible = isRouteAlwaysAccessible(route)

  if (routeIsPublic && !isCurrentRouteAlwaysAccessible && isAuthenticated) {
    return '/'
  }
  if (!isAuthenticated && !routeIsPublic && !isCurrentRouteAlwaysAccessible) {
    return AppRoute.Login
  }
  if (!isAuthenticated || !user) {
    return undefined
  }

  const pendingRule = getPendingRedirectRule(user)
  if (!pendingRule || pendingRule.skipRedirectOnRoutes.includes(route as AppRoute)) {
    return undefined
  }
  return pendingRule.targetRoute
}

export const MainLobby: FC = () => {
  const { isLoading, isAuthenticated } = useAuth0()
  const { fetchingUser, isLoggedIn, logout, setAppStateJson, user } = useAuth()
  const location = useLocation()
  const queryParams = useQueryParams()
  const themeMobile = useTheme()
  const isMobile = useMediaQuery(themeMobile.breakpoints.down('sm'));
  const language = getCurrentLang()

  const currentRoute = location.pathname
  const theme = getTheme(language)
  const isCurrentRoutePublic = isRoutePublic(currentRoute)
  const isCurrentRouteAlwaysAccessible = isRouteAlwaysAccessible(currentRoute)

  useEffect(() => {
    const appStateJson = queryParams.get('appStateJson')
    if (appStateJson) {
      setAppStateJson(appStateJson)
    }
  }, [queryParams, setAppStateJson])

  const onIdle = (): void => {
    if (isLoggedIn) {
      logout(true)
    }
  }

  useIdleTimer({ timeout: ConfigService.getIdleTimeout(), onIdle })

  if ((!isCurrentRoutePublic || !isCurrentRouteAlwaysAccessible) && isLoading) {
    return <React.Fragment />
  }

  const redirectTo = getRedirectUrl(currentRoute, user, isAuthenticated)
  const canDisplayApp = !isLoading && !fetchingUser && (isCurrentRoutePublic || isCurrentRouteAlwaysAccessible || user)

  return (
    <React.Fragment>
      {redirectTo
        ? <Navigate to={redirectTo} replace />
        : canDisplayApp &&
        <CacheProvider value={muiCache}>
          <TssCacheProvider value={tssCache}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <GlobalStyles
                styles={{ body: { backgroundColor: isMobile ? theme.palette.common.white : 'var(--body-background-color)' } }} />
              <SnackbarContextProvider context={DefaultSnackbarContext}>
                <Box>
                  <Routes>
                    <Route path={AppRoute.ProductLabelling} element={<ProductLabellingPage />} />
                    <Route path={AppRoute.Login} element={<LoginPageLanding />} />
                    <Route path={AppRoute.SignupInformation} element={<SignupInformationPage />} />
                    <Route path={AppRoute.CompleteSignup} element={<CompleteSignUpPage />} />
                    <Route path={AppRoute.RenewConsent} element={<ConsentPage messageKey="consent-renew-message" />} />
                    <Route path={AppRoute.NewConsent} element={<ConsentPage messageKey="consent-welcome-message" />} />
                    <Route path={AppRoute.Training} element={<TrainingPage />} />
                    <Route path={AppRoute.VerifyEmail} element={<VerifyEmailPage />} />
                    <Route path={AppRoute.VerifyEmailResult} element={<VerifyEmailResultPage />} />
                    <Route path={AppRoute.DblCommunication} element={<DblCommunicationPage />} />
                    <Route path="*" element={<MainLayout />} />
                  </Routes>
                </Box>
              </SnackbarContextProvider>
              {isMobile ? <FooterMobile /> : <Footer />}
            </ThemeProvider>
          </TssCacheProvider>
        </CacheProvider>
      }
    </React.Fragment>
  )
}
