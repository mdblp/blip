import { init as i18nInit } from '../../lib/language'

i18nInit().then(() => {
  // nothing to do
}).catch((reason) => {
  console.error(reason)
})
