import { i18nOptions, init as i18nInit } from '../../lib/language'
import yourloopsEn from '../../../../locales/en/yourloops.json'
import translationEn from '../../../../locales/en/translation.json'
import parameterEn from '../../../../locales/en/parameter.json'

const options = i18nOptions
options.resources.en.yourloops = yourloopsEn
options.resources.en.main = translationEn
options.resources.en.params = parameterEn

i18nInit(options).then(() => {
  // nothing to do
}).catch((reason) => {
  console.error(reason)
})
