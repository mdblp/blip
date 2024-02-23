import { PumpManufacturer } from 'medical-domain'

export const RESERVOIR_CHANGE_DANA = {
  class: 'Change--reservoir--dana'
}
export const RESERVOIR_CHANGE_INSIGHT = {
  class: 'Change--reservoir--insight'
}
export const RESERVOIR_CHANGE_KALEIDO = {
  class: 'Change--reservoir--kaleido'
}
export const RESERVOIR_CHANGE_MEDISAFE = {
  class: 'Change--reservoir--medisafe'
}

export const NO_SITE_CHANGE = 'noSiteChange'
export const SITE_CHANGE = 'siteChange'
export const SITE_CHANGE_RESERVOIR = 'reservoirChange'
export const SITE_CHANGE_TUBING = 'tubingPrime'
export const SITE_CHANGE_CANNULA = 'cannulaPrime'
export const SECTION_TYPE_UNDECLARED = 'undeclared'
export const DIABELOOP = 'Diabeloop'
export const SITE_CHANGE_BY_MANUFACTURER = {
  [PumpManufacturer.Default]: RESERVOIR_CHANGE_INSIGHT,
  [PumpManufacturer.Roche]: RESERVOIR_CHANGE_INSIGHT,
  [PumpManufacturer.Vicentra]: RESERVOIR_CHANGE_KALEIDO,
  [PumpManufacturer.Dana]: RESERVOIR_CHANGE_DANA,
  [PumpManufacturer.Terumo]: RESERVOIR_CHANGE_MEDISAFE
}
