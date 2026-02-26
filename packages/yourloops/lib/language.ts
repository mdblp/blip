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

import _ from 'lodash'
import i18n, { type InitOptions, type TOptions } from 'i18next'
import dayjs from 'dayjs'
import moment from 'moment-timezone'
import { initReactI18next } from 'react-i18next'

import locales from '../../../locales/languages.json'
import { type Country } from './auth/models/country.model'
import { getBrowserLocale } from './browser'
import metrics from './metrics'
import { zendeskLocale } from './zendesk'
import { type LanguageCodes } from './auth/models/enums/language-codes.enum'

const availableLanguageCodes = _.keys(locales.resources) as LanguageCodes[]
const availableCountries: Country[] = _.map(locales.countries, (item, key) => {
  return { code: key, name: item.name } as Country
})


export const getLanguage = (): LanguageCodes => {
  return (localStorage.getItem('lang') || getBrowserLocale() || 'en') as LanguageCodes
}

let language: LanguageCodes = getLanguage()

function refreshLanguage(language: LanguageCodes): void {
  zendeskLocale(language)
  dayjs.locale(language)
  moment.locale(language)
  metrics.setLanguage(language)
}

export const i18nOptions: InitOptions = {
  fallbackLng: locales.fallback,
  lng: language,

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

  // Update moment with the right language, for date display
  i18n.on('languageChanged', (lng: LanguageCodes) => {
    if (language !== lng && availableLanguageCodes.includes(lng)) {
      language = lng
      refreshLanguage(language)
      localStorage.setItem('lang', language)
    }
  })

  refreshLanguage(language)
  await i18n.init(options)
}

/**
 *
 * @param s The string to translate
 * @param p Optional translation parameters
 * @returns The translated string
 * @example t("translate-me");
 * @example t("translate-{{someone}}", { someone: "me" });
 */
function t(s: string, p?: TOptions): string {
  return i18n.t(s, { ns: 'yourloops', ...p })
}

const changeLanguage = i18n.changeLanguage.bind(i18n)
const getCurrentLang = (): LanguageCodes => language
const getLangName = (languageCode: LanguageCodes): string => {
  return _.get(locales, `resources.${languageCode}.name`, 'en')
}

const formatNumberForLang = (decimal: number | string, minimumFractionDigit?: number): string => {
  /* Some missing values are represented as --, so we keep it */
  if (decimal === '--') {
    return decimal
  }
  const lang= getCurrentLang()
  const formatter = Intl.NumberFormat(lang, {
    minimumFractionDigits: minimumFractionDigit !== null ? minimumFractionDigit : 1,
    maximumFractionDigits: 3
  })
  if (typeof decimal === "string") {
    if (lang !== 'en') {
      return decimal.replace(".", ",")
    } else {
      return decimal
    }
  }
  return formatter.format(decimal)
}

export {
  init,
  t,
  changeLanguage,
  getCurrentLang,
  getLangName,
  availableLanguageCodes,
  availableCountries,
  formatNumberForLang
}
export default i18n
