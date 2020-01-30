
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import getLocale from 'browser-locale';
import moment from 'moment';
import mainEN from '../../locales/en/translation.json';
import parameterEN from '../../locales/en/parameter.json';
import mainFR from '../../locales/fr/translation.json';
import parameterFR from '../../locales/fr/parameter.json';
import mainDE from '../../locales/de/translation.json';
import parameterDE from '../../locales/de/parameter.json';

// window is not defined in the PDF Worker object
const lokalizeActive = typeof window === 'object' && typeof window.LOKALISE_CONFIG === 'object';

let language = getLocale();
if (self.localStorage && self.localStorage.lang) {
  language = self.localStorage.lang;
}

const i18nOptions = {
  fallbackLng: 'en',
  lng: language,

  // To allow . in keys
  keySeparator: false,
  // To allow : in keys
  nsSeparator: ':::',

  debug: false,

  interpolation: {
    escapeValue: false, // not needed for react!!
  },

  // If the translation is empty, return the key instead
  returnEmptyString: false,

  react: {
    wait: true,
    withRef: true,
    // Needed for react < 16
    defaultTransParent: 'div'
  },
  ns: ['main', 'params'],
  defaultNS: 'main',

  resources: {
    en: {
      // Default namespace
      main: mainEN,
      params: parameterEN
    },
    fr: {
      main: mainFR,
      params: parameterFR
    },
    de: {
      main: mainDE,
      params: parameterDE
    }
  }
}


i18n.use(reactI18nextModule);

if (lokalizeActive) {
  i18n.use({
    type: 'postProcessor',
    name: 'lokalizeLiveJs',
    process: (value, key) => {
      let k = key;
      // For some reason, key is an array
      if (Array.isArray(key) && key.length === 1) {
        k = key[0];
      }
      // process(value, key, options, translator)
      // Transform the key so Lokalize can recognize it.
      if (k === 'mg/dL' || k === 'mmol/L') {
        // Special treatment for this value. It can't yet be translated, because it is used
        // in data comparison.
        return k;
      }
      return `{.${k}.}`;
    }
  });
  i18nOptions.postProcess = 'lokalizeLiveJs';
  console.log('Using lokalise live preview');
}

// Update moment with the right language, for date display
i18n.on('languageChanged', (lng) => {
  // FIXME Only perform the update when the locale really changed.
  // For some reason, it is call a lots of times
  if (typeof lng === 'string' && language !== lng) {
    language = lng;

    // Update moment locale
    moment.locale(lng);

    // Save locale for future load
    if (self.localStorage) {
      self.localStorage.lang = lng;
    }

    // Notify lokalize if active
    if (lokalizeActive) {
      window.LOKALISE_CONFIG.locale = lng;
      document.dispatchEvent(new CustomEvent('lokalise-update-locale', { detail: lng }));
    }
  }
});

i18n.init(i18nOptions);

export default i18n;
