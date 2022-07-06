import i18next from "i18next";
import enzyme from "enzyme";
import Adapter from "enzyme-adapter-react-16";

import locales from "../../../locales/languages.json";

// Partial translation to avoid changing lot of tests
locales.resources.en.main = {
  ...locales.resources.en.main,
  "abbrev_duration_day": "d",
  "abbrev_duration_hour": "h",
  "abbrev_duration_minute": "min",
  "abbrev_duration_minute_m": "m",
  "abbrev_duration_second": "s",
  "birthday-format": "ll",
  "pdf-date-range": "Date range: {{range}}",
};

const i18nOptions = {
  fallbackLng: locales.fallback,
  lng: "en",

  /** @type {false} To allow . in keys */
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
    withRef: true,
    transSupportBasicHtmlNodes: true, // allow <br/> and simple html elements in translations
  },
  ns: locales.namespaces,
  defaultNS: locales.defaultNS,

  resources: locales.resources,
};

window.config = {
  TEST: true,
  DEV: true,
};

// Enable bows logging display:
// window.localStorage.setItem('debug', 'true');

enzyme.configure({
  adapter: new Adapter(),
  disableLifecycleMethods: true,
});

// Return key if no translation is present
i18next.init(i18nOptions).finally(() => {
  const context = require.context(".", true, /\.js$/); // Load .js files in /test
  context.keys().forEach(context);
});
