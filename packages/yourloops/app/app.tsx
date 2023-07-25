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
import { BrowserRouter } from 'react-router-dom'
import { Auth0Provider } from '@auth0/auth0-react'

import appConfig from '../lib/config/config'
import { AuthContextProvider } from '../lib/auth'
import { MainLobby } from './main-lobby'
import MetricsLocationListener from '../components/MetricsLocationListener'
import { init as i18nInit } from '../lib/language'
import initDayJS from '../lib/dayjs'
import initCookiesConsentListener from '../lib/cookies-manager'
import initAxios from '../lib/http/axios.service'
import { initTheme } from '../components/theme'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '../../../branding/global.css'
import '../../../branding/palette.css'
import '../css/classes.css'

export const Yourloops: FC = () => {
  i18nInit()
  initDayJS()
  initCookiesConsentListener()
  initAxios()
  initTheme()
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
      <BrowserRouter>
        <MetricsLocationListener />
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </BrowserRouter>
    </Auth0Provider>
  )
}
