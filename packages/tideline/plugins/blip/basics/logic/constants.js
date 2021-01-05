const ROCHE = 'Roche';
const KALEIDO = 'Kaleido';
const DEFAULT_MANUFACTURER = 'default';

// labels have to be translated
const INFUSION_SITE_CHANGE = {
  label: 'Infusion site changes',
  class: 'Change--site',
  picto: require('infusion.png'),
};
const CARTRIDGE_CHANGE = {
  label: 'Reservoir Change',
  class: 'Change--reservoir',
  picto: require('cartridge.png'),
};
const CARTRIDGE_KALEIDO_CHANGE = {
  label: 'Reservoir Change',
  class: 'Change--reservoir--kaleido',
  picto: require('cartridge-kaleido.png'),
};

module.exports = {
  CGM_CALCULATED: 'calculatedCGM',
  CGM_IN_DAY: 288,
  MS_IN_DAY: 864e5,
  MS_IN_HOUR: 864e5/24,
  NO_CGM: 'noCGM',
  NO_SITE_CHANGE: 'noSiteChange',
  NOT_ENOUGH_CGM: 'notEnoughCGM',
  SITE_CHANGE: 'siteChange',
  SITE_CHANGE_RESERVOIR: 'reservoirChange',
  SITE_CHANGE_TUBING: 'tubingPrime',
  SITE_CHANGE_CANNULA: 'cannulaPrime',
  SECTION_TYPE_UNDECLARED: 'undeclared',
  INSULET: 'Insulet',
  TANDEM: 'Tandem',
  ANIMAS: 'Animas',
  MEDTRONIC: 'Medtronic',
  DIABELOOP: 'Diabeloop',
  ROCHE,
  KALEIDO,
  DEFAULT_MANUFACTURER,
  INFUSION_SITE_CHANGE,
  CARTRIDGE_CHANGE,
  SITE_CHANGE_BY_MANUFACTURER: {
      [DEFAULT_MANUFACTURER]: INFUSION_SITE_CHANGE,
      [ROCHE]: CARTRIDGE_CHANGE,
      [KALEIDO]: CARTRIDGE_KALEIDO_CHANGE,
    },
};
