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

import i18next from 'i18next'
import enzyme from 'enzyme'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17'

import locales from '../../../locales/languages.json'

// Partial translation to avoid changing lot of tests
locales.resources.en.main = {
  ...locales.resources.en.main,
  'abbrev_duration_day': 'd',
  'abbrev_duration_hour': 'h',
  'abbrev_duration_minute': 'min',
  'abbrev_duration_minute_m': 'm',
  'abbrev_duration_second': 's',
  'birthday-format': 'll',
  'pdf-date-range': 'Date range: {{range}}'
}

const i18nOptions = {
  fallbackLng: locales.fallback,
  lng: 'en',

  /** @type {false} To allow . in keys */
  keySeparator: false,
  // To allow : in keys
  nsSeparator: '|',

  debug: false,

  interpolation: {
    escapeValue: false // not needed for react!!
  },

  // If the translation is empty, return the key instead
  returnEmptyString: false,

  react: {
    wait: true,
    withRef: true,
    transSupportBasicHtmlNodes: true // allow <br/> and simple html elements in translations
  },
  ns: locales.namespaces,
  defaultNS: locales.defaultNS,

  resources: locales.resources
}

window.config = {
  TEST: true,
  DEV: true
}

// Enable bows logging display:
// window.localStorage.setItem('debug', 'true');

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true
})

// Return key if no translation is present
i18next.init(i18nOptions).finally(() => {
  const context = require.context('.', true, /\.js$/) // Load .js files in /test
  context.keys().forEach(context)
})
