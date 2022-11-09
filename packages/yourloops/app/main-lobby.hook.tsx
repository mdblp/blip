/**
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

import { User } from '../lib/auth'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { Palette } from '@material-ui/core/styles/createPalette'

const RENEW_CONSENT_PATH = '/renew-consent'
const TRAINING_PATH = '/training'
const NEW_CONSENT_PATH = '/new-consent'
const COMPLETE_SIGNUP_PATH = '/complete-signup'
const LOGIN_PATH = '/login'
const INTENDED_USE_PATH = '/intended-use'
const PUBLIC_ROUTES = [LOGIN_PATH]
const ALWAYS_ACCESSIBLE_ROUTES = [INTENDED_USE_PATH]
const EXTERNAL_THEME_ROUTES = [NEW_CONSENT_PATH, RENEW_CONSENT_PATH, COMPLETE_SIGNUP_PATH, LOGIN_PATH, INTENDED_USE_PATH]

interface StyleProps {
  color: string
}

const routeStyle = makeStyles<Theme, StyleProps>(() => {
  return {
    '@global': {
      body: {
        backgroundColor: ({ color }) => color
      }
    },
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

interface MainLobbyHookReturn {
  getStyle: (route: string, palette: Palette) => string
  getRedirectUrl: (route: string, user: User, isAuthenticated: boolean) => string | undefined
  isRoutePublic: (route: string) => boolean
}

export const useMainLobby = (): MainLobbyHookReturn => {
  const isRoutePublic = (route: string): boolean => {
    return PUBLIC_ROUTES.includes(route)
  }

  const getRedirectUrl = (route: string, user: User, isAuthenticated: boolean): string | undefined => {
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

  const getStyle = (route: string, palette: Palette): string => {
    const routeIsPublic = isRoutePublic(route)
    const classes = routeStyle({
      color: EXTERNAL_THEME_ROUTES.includes(route) ? palette.background.default : palette.background.paper
    })
    return routeIsPublic || route === COMPLETE_SIGNUP_PATH ? classes.public : classes.private
  }

  return {
    getStyle,
    getRedirectUrl,
    isRoutePublic
  }
}
