/**
 * Copyright (c) 2021, Diabeloop
 * i18next configuration
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

import _ from "lodash";
import i18n, { InitOptions, Resource, TOptions, i18n as i18next } from "i18next";
import moment from "moment-timezone";
import { initReactI18next } from "react-i18next";

import getLocale from "./browser-locale";
import locales from "../../../locales/languages.json";

async function init(): Promise<void> {
  const crowdinActive = typeof window._jipt === "object";

  let language = getLocale();
  if (self.localStorage && self.localStorage.lang) {
    language = self.localStorage.lang;

    if (typeof window.zE === "function") {
      window.zE("webWidget", "setLocale", language);
    }
  }

  const i18nOptions: InitOptions = {
    fallbackLng: locales.fallback,
    lng: language,

    // To allow . in keys
    keySeparator: false,
    // To allow : in keys
    nsSeparator: "|",

    debug: false,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    // If the translation is empty, return the key instead
    returnEmptyString: false,

    react: {
      wait: true,
      transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
    },
    ns: locales.namespaces,
    defaultNS: locales.defaultNS,

    resources: locales.resources,
  };

  if (crowdinActive) {
    i18nOptions.fallbackLng = locales.crowdin.fallback;
    (i18nOptions.resources as Resource)[locales.crowdin.fallback] = locales.crowdin.resources;
  }

  i18n.use(initReactI18next);

  // Update moment with the right language, for date display
  i18n.on("languageChanged", (lng: string) => {
    // FIXME Only perform the update when the locale really changed.
    // For some reason, it is call a lots of times
    if (typeof lng === "string" && language !== lng) {
      language = lng;

      // FIXME: Get currently use Crowdin language, when Crowdin is active.
      moment.locale(lng);

      // Zendesk locale
      if (typeof window.zE === "function") {
        window.zE("webWidget", "setLocale", language);
      }

      // Save locale for future load
      if (self.localStorage) {
        self.localStorage.lang = lng;
      }
    }
  });

  await i18n.init(i18nOptions);
}

/**
 *
 * @param s The string to translate
 * @param p Optional translation parameters
 * @returns The translated string
 * @example t("translate-me");
 * @example t("translate-{{someone}}", { someone: "me" });
 */
function t(s: string, p?: TOptions | string): string {
  return i18n.t(`yourloops|${s}`, p);
}

export const getCurrentLocaleName = (i18n: i18next): string => {
  const shortLocale = i18n.language.split("-")[0] as "en" | "de" | "es" | "fr" | "it" | "nl";

  return locales.resources[shortLocale]?.name;
};

export const getLocaleShortname = (locale: string): string => {
  let shortName = "";
  _.forEach(locales.resources, ({ name }, key) => {
    if (name === locale) {
      shortName = key;
    }
  });

  return shortName;
};

export const availableLocales = _.map(locales.resources, ({ name }) => name);

export { init, t };
export default i18n;
