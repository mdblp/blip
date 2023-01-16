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

import yourloopsEn from '../../../locales/en/yourloops.json'
import translationEn from '../../../locales/en/translation.json'
import parameterEn from '../../../locales/en/parameter.json'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import locales from '../../../locales/languages.json'

export const i18nOptions = {
  fallbackLng: locales.fallback,
  lng: 'en',

  // To allow . in keys
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
    useSuspense: true,
    transSupportBasicHtmlNodes: true // allow <br/> and simple html elements in translations
  },
  ns: locales.namespaces,
  defaultNS: locales.defaultNS,
  fallbackNS: locales.fallbackNS,

  resources: locales.resources
}

async function init(options = i18nOptions): Promise<void> {
  i18n.use(initReactI18next)
  await i18n.init(options)
}

const options = i18nOptions
options.resources.en.yourloops = yourloopsEn
options.resources.en.main = translationEn
options.resources.en.params = parameterEn

init(options).then(() => {
  // nothing to do
}).catch((reason) => {
  console.error(reason)
})
