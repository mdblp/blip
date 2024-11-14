import moment from 'moment-timezone'
import _ from 'lodash'
import bows from 'bows'

import { TimeService, DateFilter, BasalBolusStatisticsService, GlycemiaStatisticsService, CarbsStatisticsService
} from 'medical-domain'
import { reshapeBgClassesToBgBounds } from './bloodglucose'

class DataUtil {
  /**
   * @param {unknown[]} data Unfiltered tideline data
   * @param {{endpoints?: [string, string]; chartPrefs?: {}; bgPrefs?: {}; timePrefs?: {}}} opts
   */
  constructor(data, opts = {}) {
    this.log = bows('DataUtil')

    this.rawData = data
    this._endpoints = opts.endpoints || []
    this._chartPrefs = opts.chartPrefs || {}
    this.bgBounds = reshapeBgClassesToBgBounds(opts.bgPrefs)
    this.bgUnits = _.get(opts, 'bgPrefs.bgUnits')
    this.days = this.getDayCountFromEndpoints()

    this.bgSources = this.getBgSources()
    this.defaultBgSource = this.getDefaultBgSource()
    this.latestPump = this.getLatestPump()
  }

  get bgSource() {
    return _.get(this._chartPrefs, 'bgSource', this.defaultBgSource)
  }

  set chartPrefs(chartPrefs = {}) {
    this._chartPrefs = chartPrefs
  }

  set endpoints(endpoints = []) {
    this._endpoints = endpoints
    this.days = this.getDayCountFromEndpoints()
  }

  set bgPrefs(bgPrefs = {}) {
    this.bgUnits = bgPrefs.bgUnits
    this.bgBounds = reshapeBgClassesToBgBounds(bgPrefs)

    this.log('bgPrefs', { bgBounds: this.bgBounds, bgUnits: this.bgUnits })
  }

  dateFilter(): DateFilter {
    return {
      start: Date.parse(this._endpoints[0]).valueOf(),
      end: Date.parse(this._endpoints[1]).valueOf(),
      weekDays: this._chartPrefs.activeDays
    }
  }

  getAverageGlucoseData = (returnBgData = false) => {
    const dateFilter = this.dateFilter()
    const bgData = this.bgSource === 'cbg' ? this.rawData.cbg : this.rawData.smbg
    const stats = GlycemiaStatisticsService.getAverageGlucoseData(bgData, dateFilter)
    if (returnBgData) {
      stats.bgData = bgData
    }
    return stats
  }

  getBasalBolusData() {
    const dateFilter = this.dateFilter()
    return BasalBolusStatisticsService.getBasalBolusData(this.rawData.basal, this.rawData.bolus, this.rawData.wizards, this.days, dateFilter)
  }

  getBgSources = () => {
    const cbg = this.rawData.cbg ? this.rawData.cbg : []
    const smbg = this.rawData.smbg ? this.rawData.smbg : []
    return {
      cbg: cbg.length > 0,
      smbg: smbg.length > 0
    }
  }

  getCarbsData = () => {
    const dateFilter = this.dateFilter()
    const stats = CarbsStatisticsService.getCarbsData(this.rawData.meals, this.rawData.wizards, this.days
      , dateFilter)
    return {
      totalCarbsPerDay: stats.totalCarbsPerDay
    }
  }

  getCoefficientOfVariationData = () => {
    const dateFilter = this.dateFilter()
    const bgData = this.bgSource === 'cbg' ? this.rawData.cbg : this.rawData.smbg
    return GlycemiaStatisticsService.getCoefficientOfVariationData(bgData, dateFilter)
  }

  getDefaultBgSource = () => {
    let source
    if (this.bgSources.cbg) {
      source = 'cbg'
    } else if (this.bgSources.smbg) {
      source = 'smbg'
    }
    return source
  }

  getDayCountFromEndpoints = () => moment.utc(this._endpoints[1])
    .diff(moment.utc(this._endpoints[0])) / TimeService.MS_IN_DAY

  getGlucoseManagementIndicatorData = () => {
    const dateFilter = this.dateFilter()
    return GlycemiaStatisticsService.getGlucoseManagementIndicatorData(this.rawData.cbg, this.bgUnits, dateFilter)
  }

  getLatestPump = () => {
    const noPumpData =  {
      deviceModel: '',
      manufacturer: ''
    }
    const allPumpSettings = this.rawData.pumpSettings
    if (allPumpSettings) {
      const pumpSettings = allPumpSettings[0]
      const device = pumpSettings?.payload?.device
      if (!device) {
        return noPumpData
      }

      const mobileApplication = pumpSettings?.payload?.mobileApplication
      //TODO: ask celia for the constant
      if (mobileApplication?.identifier === 'DBLG2') {
        return {
          deviceModel: mobileApplication.name,
          manufacturer: mobileApplication.manufacturer
        }
      }
      return {
        deviceModel: device.name,
        manufacturer: device.manufacturer
      }
    }
    return noPumpData
  }

  getReadingsInRangeData = () => {
    const dateFilter = this.dateFilter()
    return GlycemiaStatisticsService.getReadingsInRangeData(this.rawData.smbg, this.bgBounds, this.days, dateFilter)
  }

  getSensorUsage = () => {
    const dateFilter = this.dateFilter()
    return GlycemiaStatisticsService.getSensorUsage(this.rawData.cbg, dateFilter)
  }

  getStandardDevData = () => {
    const dateFilter = this.dateFilter()
    const bgData = this.bgSource === 'cbg' ? this.rawData.cbg : this.rawData.smbg
    return GlycemiaStatisticsService.getStandardDevData(bgData, dateFilter)
  }

  getTimeInAutoData = () => {
    const dateFilter = this.dateFilter()
    const stats = BasalBolusStatisticsService.getAutomatedAndManualBasalDuration(this.rawData.basal, dateFilter)
    return {
      automated: stats.automatedBasalDuration,
      manual: stats.manualBasalDuration
    }
  }

  getTimeInRangeData = () => {
    const dateFilter = this.dateFilter()
    return GlycemiaStatisticsService.getTimeInRangeData(this.rawData.cbg, this.bgBounds, this.days, dateFilter)
  }

  getTotalInsulinAndWeightData() {
    const dateFilter = this.dateFilter()
    return BasalBolusStatisticsService.getTotalInsulinAndWeightData(this.rawData.basal, this.rawData.bolus, this.rawData.wizards, this.days, dateFilter, this.rawData.pumpSettings)
  }
}

export default DataUtil
