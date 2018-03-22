
import i18n from 'i18next';
import { reactI18nextModule } from 'react-i18next';
import getLocale from 'browser-locale';

i18n
  .use(reactI18nextModule)
  .init({
    fallbackLng: 'en',
    // i18next-browser-languagedetector doesn't work in my experience
    lng: getLocale(),

    // To allow . in keys
    keySeparator: false,
    // To allow : in keys
    nsSeparator: false,

    debug: true,

    interpolation: {
      escapeValue: false, // not needed for react!!
    },

    // If the translation is empty, return the key instead
    returnEmptyString: false,

    react: {
      wait: true,
      // Needed for react < 16
      defaultTransParent: 'div'
    },

    resources: {
      en: {
        // Default namespace
        translation: require('../../locales/en/translation.json')
      },
      fr: {
        // Default namespace
        translation: require('../../locales/fr/translation.json')
      }
    }
  });

export default i18n;
