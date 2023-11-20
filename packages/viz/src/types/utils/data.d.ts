import { type BgType } from "medical-domain"
export default DataUtil

export interface TimeInRangeData {
  veryLow: number
  low: number
  target: number
  high: number
  veryHigh: number
  total: number
}

export interface ReadingsInRangeData extends TimeInRangeData {}

declare class DataUtil {
  constructor(data: unknown[], opts?: {
    endpoints?: [string, string]
    chartPrefs?: {}
    bgPrefs?: {}
    timePrefs?: {}
  })

  log: any
  data: any
  _endpoints: [string, string] | []
  _chartPrefs: {}
  bgBounds: any
  bgUnits: any
  days: number
  dimension: {}
  filter: {}
  sort: {
    byDate: (array: Array<{ epoch: number }>) => Array<{ epoch: number }>
  }
  bgSources: {
    cbg: boolean
    smbg: boolean
  }
  defaultBgSource: string
  latestPump: {
    deviceModel: any
    manufacturer: any
  }

  get bgSource(): BgType

  set chartPrefs(arg: any)
  set endpoints(arg: any)
  set bgPrefs(arg: any)

  getAverageGlucoseData: (returnBgData?: boolean) => {
    averageGlucose: any
    total: any
  }

  /**
   * Return the number of days which have at least one bolus or one basal data.
   * @param {Array} bolus Array of bolus data
   * @param {Array} basal Array of basal data
   */

  getBasalBolusData(): {
    basal: number
    bolus: number
  }

  getBgSources: () => {
    cbg: boolean
    smbg: boolean
  }

  getCarbsData: () => {
    totalCarbsPerDay: number
  }

  getCoefficientOfVariationData: () => {
    insufficientData: boolean
    total: any
    coefficientOfVariation: number
  } | {
    coefficientOfVariation: any
    total: any
    insufficientData?: undefined
  }

  getDefaultBgSource: () => string
  getDayCountFromEndpoints: () => number
  getGlucoseManagementIndicatorData: () => {
    glucoseManagementIndicator: number
    insufficientData: boolean
    total?: undefined
  } | {
    glucoseManagementIndicator: number
    total: any
    insufficientData?: undefined
  }

  getLatestPump: () => {
    deviceModel: any
    manufacturer: any
  }

  getReadingsInRangeData: () => ReadingsInRangeData
  getSensorUsage: () => {
    sensorUsage: any
    total: number
  }

  getStandardDevData: (cvByDate?: boolean) => {
    averageGlucose: any
    insufficientData: boolean
    total: any
    standardDeviation: number
    coefficientOfVariationByDate?: undefined
  } | {
    averageGlucose: any
    insufficientData: boolean
    total: any
    standardDeviation: number
    coefficientOfVariationByDate: {}
  }

  getTimeInAutoData: () => any
  getTimeInRangeData: () => TimeInRangeData

  getTotalInsulinAndWeightData(): {
    totalInsulin: any
    weight: {
      name: 'WEIGHT'
      value: string
      unit: string
      level: number
    }
  }
}
