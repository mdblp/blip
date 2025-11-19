/*
 * Copyright (c) 2021-2025, Diabeloop
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

// Polyfills for compatibility with older browsers:
import 'core-js/stable'

import React from 'react'

import config from '../lib/config/config'
import { init as i18nInit } from '../lib/language'
import initCookiesConsentListener from '../lib/cookies-manager'
import initDayJS from '../lib/dayjs'
import { initTheme } from '../components/theme'

import { Yourloops } from './app'
import OnError from './error'
import { BrowserRouter } from 'react-router-dom'
import initAxios from '../lib/http/axios.service'
import { createRoot } from 'react-dom/client'

i18nInit().then(() => {
  let div = document.getElementById('app')
  if (div === null) {
    div = document.createElement('div')
    div.id = 'app'
    document.body.appendChild(div)
  }

  initDayJS()
  initCookiesConsentListener()
  initAxios()
  initTheme()

  const root = createRoot(div)
  root.render(config.DEV ? <React.StrictMode><Yourloops /></React.StrictMode> : <Yourloops />)

  window.onerror = (event, source, lineno, colno, error) => {
    if (source && !source.endsWith('.js')) {
      return true
    }
    console.error(event, source, lineno, colno, error)
    root.render(<BrowserRouter><OnError event={event} source={source} lineno={lineno} colno={colno}
                                        error={error} /></BrowserRouter>)
    return false
  }
})
