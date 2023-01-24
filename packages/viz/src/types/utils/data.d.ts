export default DataUtil

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

  get bgSource(): any

  set chartPrefs(arg: any)
  set endpoints(arg: any)
  set bgPrefs(arg: any)

  addData(data: any): void
  removeData(): void
  addBasalOverlappingStart(basalData: any): any
  applyDateFilters(): void
  buildDimensions: () => void
  buildFilters: () => void

  buildSorts(): {
    byDate: (array: Array<{ epoch: number }>) => Array<{ epoch: number }>
  }

  clearFilters: () => void
  getAverageGlucoseData: (returnBgData?: boolean) => {
    averageGlucose: any
    total: any
  }

  /**
   * Returns the average glucose data
   * with the average glucose data by date
   */
  getGlucoseDataByDate: () => {
    averageGlucose: any
    total: any
  }

  /**
   * Return the number of days which have at least one bolus or one basal data.
   * @param {Array} bolus Array of bolus data
   * @param {Array} basal Array of basal data
   */
  getNumDaysWithInsulin(bolus: any[], basal: any[]): number

  getBasalBolusData(): {
    basal: number
    bolus: number
  }

  getBgSources: () => {
    cbg: boolean
    smbg: boolean
  }

  getCarbsData: () => {
    nDays: number
    wizardCarbs: any
    foodCarbs: any
    totalCarbs: any
    totalCarbsPerDay: number
    foodCarbsPerDay: number
    wizardCarbsPerDay: number
    total: any
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

  getDailyAverageSums: (data: any) => any
  getDailyAverageDurations: (data: any) => any
  getDefaultBgSource: () => string
  getDayCountFromEndpoints: () => number
  getDayIndex: (day: any) => any
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

  getReadingsInRangeData: () => any
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
  getTimeInRangeData: () => any

  getTotalInsulinAndWeightData(): {
    totalInsulin: any
    weight: {
      name: 'WEIGHT'
      value: string
      unit: string
      level: number
    }
  }

  /**
   * Retreive the patient weight from the pump settings, null if not present
   * @returns {{ name: 'WEIGHT', value: string, unit: string, level: number } | null}
   */
  getWeight(): {
    name: 'WEIGHT'
    value: string
    unit: string
    level: number
  } | null
}
