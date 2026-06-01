/*
 * Copyright (c) 2021-2026, Diabeloop
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

import React, { type FC, type ReactNode } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import 'branding/global.css'
import 'classes.css'

import appConfig from '../lib/config/config'
import { AuthContextProvider } from '../lib/auth'
import { MainLobby } from './main-lobby'
import MetricsLocationListener from '../components/MetricsLocationListener'

interface AppState {
  returnTo?: string
  appStateJSON?: string
}

const Auth0ProviderWithNavigate: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const redirectUri = globalThis.location.origin

  const onRedirectCallback = (appState?: AppState) => {
    const returnTo = appState?.returnTo ?? '/'

    if (appState?.appStateJSON) {
      const url = new URL(returnTo, globalThis.location.origin)
      url.searchParams.set('appStateJson', appState.appStateJSON)
      navigate(`${url.pathname}${url.search}${url.hash}`)
      return
    }

    navigate(returnTo)
  }

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
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export const Yourloops: FC = () => (
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <MetricsLocationListener />
      <AuthContextProvider>
        <MainLobby />
      </AuthContextProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
)
