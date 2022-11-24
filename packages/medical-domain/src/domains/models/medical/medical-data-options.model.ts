import { BgUnit, MGDL_UNITS, MMOLL_UNITS } from './datum/cbg.model'

interface MedicalDataOptions {
  defaultSource: string
  YLP820_BASAL_TIME: number
  timezoneName: string
  bgUnits: BgUnit
  dateRange: {
    start: number
    end: number
  }
  defaultPumpManufacturer: string
  bgClasses: {
    'very-low': {boundary: number}
    'low': {boundary: number}
    'target': {boundary: number}
    'high': {boundary: number}
    'very-high': {boundary: number}
  }
  fillOpts: {
    classes: Record<number, string>
    duration: number
  }
  timePrefs: {
    timezoneAware: boolean
    timezoneName: string
    timezoneOffset: number
  }
}

const DEFAULT_BG_BOUNDS = {
  [MGDL_UNITS]: {
    veryLow: 54,
    targetLower: 70,
    targetUpper: 180,
    veryHigh: 250
  },
  [MMOLL_UNITS]: {
    veryLow: 3.0,
    targetLower: 3.9,
    targetUpper: 10.0,
    veryHigh: 13.9
  }
}

const BG_CLAMP_THRESHOLD = {
  [MGDL_UNITS]: 600,
  [MMOLL_UNITS]: 33.3 // round(10 * 600 / MGDL_PER_MMOLL) / 10
}

const defaultMedicalDataOptions: MedicalDataOptions = {
  defaultSource: 'Diabeloop',
  YLP820_BASAL_TIME: 5000,
  timezoneName: 'UTC',
  bgUnits: MGDL_UNITS,
  dateRange: { start: 0, end: 0 },
  defaultPumpManufacturer: 'default',
  bgClasses: {
    'very-low': { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryLow },
    low: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower },
    target: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper },
    high: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh },
    'very-high': { boundary: BG_CLAMP_THRESHOLD[MGDL_UNITS] }
  },
  fillOpts: {
    classes: {
      0: 'darkest',
      3: 'dark',
      6: 'lighter',
      9: 'light',
      12: 'lightest',
      15: 'lighter',
      18: 'dark',
      21: 'darker'
    },
    duration: 3
  },
  timePrefs: {
    timezoneAware: true,
    timezoneName: 'UTC',
    timezoneOffset: 0
  }
}

export default MedicalDataOptions
export { defaultMedicalDataOptions, DEFAULT_BG_BOUNDS, BG_CLAMP_THRESHOLD }
