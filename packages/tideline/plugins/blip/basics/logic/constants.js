import infusion from 'infusion.png'
import cartridge from 'cartridge.png'
import cartridgeVicentra from 'cartridge-vicentra.png'

export const ROCHE = 'Roche'
export const VICENTRA = 'Vicentra'
export const DEFAULT_MANUFACTURER = 'default'

// labels have to be translated
export const INFUSION_SITE_CHANGE = {
  label: 'Infusion site changes',
  class: 'Change--site',
  picto: infusion
}
export const CARTRIDGE_CHANGE = {
  label: 'Reservoir changes',
  class: 'Change--reservoir',
  picto: cartridge
}
export const CARTRIDGE_VICENTRA_CHANGE = {
  label: 'Reservoir changes',
  class: 'Change--reservoir--vicentra',
  picto: cartridgeVicentra
}

export const MS_IN_DAY = 864e5
export const NO_SITE_CHANGE = 'noSiteChange'
export const SITE_CHANGE = 'siteChange'
export const SITE_CHANGE_RESERVOIR = 'reservoirChange'
export const SITE_CHANGE_TUBING = 'tubingPrime'
export const SITE_CHANGE_CANNULA = 'cannulaPrime'
export const SECTION_TYPE_UNDECLARED = 'undeclared'
export const DIABELOOP = 'Diabeloop'
export const SITE_CHANGE_BY_MANUFACTURER = {
  [DEFAULT_MANUFACTURER]: INFUSION_SITE_CHANGE,
  [ROCHE]: CARTRIDGE_CHANGE,
  [VICENTRA]: CARTRIDGE_VICENTRA_CHANGE
}
