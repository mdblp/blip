import crossfilter from 'crossfilter2'
import moment from 'moment-timezone'
import _ from 'lodash'
import bows from 'bows'

import { convertBG, MGDL_UNITS, MMOLL_UNITS, TimeService } from 'medical-domain'
import { getTotalBasalFromEndpoints, getBasalGroupDurationsFromEndpoints } from './basal'
import { getTotalBolus } from './bolus'
import { cgmSampleFrequency, classifyBgValue, reshapeBgClassesToBgBounds } from './bloodglucose'
import { addDuration } from './datetime'
import { getLatestPumpUpload } from './device'

class DataUtil {
  /**
   * @param {unknown[]} data Unfiltered tideline data
   * @param {{endpoints?: [string, string]; chartPrefs?: {}; bgPrefs?: {}; timePrefs?: {}}} opts
   */
  constructor(data, opts = {}) {
    this.log = bows('DataUtil')

    this.data = crossfilter(data)
    this._endpoints = opts.endpoints || []
    this._chartPrefs = opts.chartPrefs || {}
    this.bgBounds = reshapeBgClassesToBgBounds(opts.bgPrefs)
    this.bgUnits = _.get(opts, 'bgPrefs.bgUnits')
    this.days = this.getDayCountFromEndpoints()
    this.dimension = {}
    this.filter = {}

    this.buildDimensions()
    this.buildFilters()
    this.sort = this.buildSorts()

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

  addData(data) {
    this.data.add(data)
    this.bgSources = this.getBgSources()
    this.defaultBgSource = this.getDefaultBgSource()
  }

  removeData() {
    this.clearFilters()
    this.data.remove()
  }

  addBasalOverlappingStart(basalData) {
    if (basalData.length && basalData[0].normalTime > this._endpoints[0]) {
      // Fetch last basal from previous day
      this.filter.byEndpoints([
        addDuration(this._endpoints[0], -TimeService.MS_IN_DAY),
        this._endpoints[0]
      ])

      const previousBasalDatum = this.sort
        .byDate(this.filter.byType('basal').top(Infinity))
        .reverse()[0]

      // Add to top of basal data array if it overlaps the start endpoint
      const datumOverlapsStart = previousBasalDatum
        && previousBasalDatum.normalTime < this._endpoints[0]
        && previousBasalDatum.normalEnd > this._endpoints[0]

      if (datumOverlapsStart) {
        basalData.unshift(previousBasalDatum)
      }
    }
    return basalData
  }

  applyDateFilters() {
    this.filter.byEndpoints(this._endpoints)

    this.dimension.byDayOfWeek.filterAll()

    const daysInRange = this.getDayCountFromEndpoints()

    if (this._chartPrefs.activeDays) {
      const activeDays = _.reduce(this._chartPrefs.activeDays, (result, active, day) => {
        if (active) {
          result.push(this.getDayIndex(day))
        }
        return result
      }, [])

      this.filter.byActiveDays(activeDays)

      // here is a more realistic version of calculating days, fixing a bug in stats
      this.days = 0
      let start = moment.utc(this._endpoints[0])
      for(let i = 1; i <= daysInRange; i++) {
        if (activeDays.includes(start.day())) {
          this.days += 1
        }
        start.add(1, 'd')
      }
    }
  }

  buildDimensions = () => {
    this.dimension.byDate = this.data.dimension(d => d.normalTime)

    this.dimension.byDayOfWeek = this.data.dimension(
      d => moment.tz(d.normalTime, d.timezone ?? 'UTC').day()
    )

    this.dimension.byType = this.data.dimension(d => d.type)
  }

  buildFilters = () => {
    this.filter.byActiveDays = activeDays => this.dimension.byDayOfWeek
      .filterFunction(d => _.includes(activeDays, d))

    this.filter.byEndpoints = endpoints => this.dimension.byDate.filterRange(endpoints)
    this.filter.byType = type => this.dimension.byType.filterExact(type)
  }

  buildSorts() {
    return {
      byDate: (/** @type {{epoch: number}[]} */ array) => {
        if (Array.isArray(array)) {
          array.sort((a, b) => a.epoch - b.epoch)
        }
        return array
      }
    }
  }

  clearFilters = () => {
    this.dimension.byDate.filterAll()
    this.dimension.byDayOfWeek.filterAll()
    this.dimension.byType.filterAll()
  }

  getAverageGlucoseData = (returnBgData = false) => {
    this.applyDateFilters()

    const bgData = this.filter.byType(this.bgSource).top(Infinity)

    const data = {
      averageGlucose: _.meanBy(bgData, 'value'),
      total: bgData.length
    }

    if (returnBgData) {
      data.bgData = bgData
    }

    return data
  }

  /**
   * Returns the average glucose data
   * with the average glucose data by date
   */
  getGlucoseDataByDate = () => {
    const data = this.getAverageGlucoseData(true)

    const bgDataByDate = _.groupBy(data.bgData, 'localDate')

    data.bgDataByDate = bgDataByDate

    return data
  }

  /**
   * Return the number of days which have at least one bolus or one basal data.
   * @param {Array} bolus Array of bolus data
   * @param {Array} basal Array of basal data
   */
  getNumDaysWithInsulin(bolus, basal) {
    const uDays = [] // Array of unique days (in string...)

    if (!(_.isArray(bolus) && _.isArray(basal))) {
      this.log.warn('bolus or basal is not an array', bolus, basal)
      return this.days
    }

    const insulin = _.concat(bolus, basal)

    _.forEach(insulin, (value) => {
      if (_.isObject(value) && _.isString(value.normalTime) && value.normalTime.length > 10) {
        const day = value.normalTime.substring(0, 10)
        if (uDays.indexOf(day) < 0) {
          uDays.push(day)
        }
      }
    })

    return Math.min(uDays.length, this.days)
  }

  getBasalBolusData() {
    this.applyDateFilters()

    const bolusData = this.filter.byType('bolus').top(Infinity)
    let basalData = this.sort.byDate(this.filter.byType('basal').top(Infinity).reverse())
    basalData = this.addBasalOverlappingStart(basalData)

    const basalBolusData = {
      basal: basalData.length
        ? Number.parseFloat(getTotalBasalFromEndpoints(basalData, this._endpoints))
        : Number.NaN,
      bolus: bolusData.length ? getTotalBolus(bolusData) : Number.NaN
    }

    if (this.days > 1) {
      const nDays = this.getNumDaysWithInsulin(bolusData, basalData)
      basalBolusData.basal = basalBolusData.basal / nDays
      basalBolusData.bolus = basalBolusData.bolus / nDays
    }

    return basalBolusData
  }

  getBgSources = () => {
    this.clearFilters()
    return {
      cbg: this.filter.byType('cbg').top(Infinity).length > 0,
      smbg: this.filter.byType('smbg').top(Infinity).length > 0
    }
  }

  getCarbsData = () => {
    this.applyDateFilters()

    const wizardData = this.filter.byType('wizard').top(Infinity)
    const foodData = this.filter.byType('food').top(Infinity)

    const wizardCarbs = _.reduce(
      wizardData,
      (result, datum) => result + _.get(datum, 'carbInput', 0),
      0
    )

    const foodCarbs = _.reduce(
      foodData,
      (result, datum) => result + _.get(datum, 'nutrition.carbohydrate.net', 0),
      0
    )

    const totalCarbs = wizardCarbs + foodCarbs

    return {
      nDays: this.days,
      wizardCarbs,
      foodCarbs,
      totalCarbs,
      totalCarbsPerDay: totalCarbs / this.days,
      foodCarbsPerDay: foodCarbs / this.days,
      wizardCarbsPerDay: wizardCarbs / this.days,
      total: wizardData.length + foodData.length
    }
  }

  getCoefficientOfVariationData = () => {
    const {
      insufficientData,
      coefficientOfVariationByDate,
      total
    } = this.getStandardDevData(true)

    if (insufficientData || Object.keys(coefficientOfVariationByDate).length === 0) {
      return {
        insufficientData: true,
        total,
        coefficientOfVariation: Number.NaN
      }
    }
    return {
      coefficientOfVariation : _.meanBy(_.map(coefficientOfVariationByDate)),
      total
    }
  }

  getDailyAverageSums = data => {
    const clone = _.clone(data)

    _.forEach(clone, (value, key) => {
      if (key !== 'total') {
        clone[key] = value / this.days
      }
    })

    return clone
  }

  getDailyAverageDurations = data => {
    const clone = _.clone(data)
    const total = data.total || _.sum(_.values(data))

    _.forEach(clone, (value, key) => {
      if (key !== 'total') {
        clone[key] = (value / total) * TimeService.MS_IN_DAY
      }
    })

    return clone
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

  getDayIndex = day => {
    const dayMap = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    }

    return dayMap[day]
  }

  getGlucoseManagementIndicatorData = () => {
    const { averageGlucose, bgData, total } = this.getAverageGlucoseData(true)

    const getTotalCbgDuration = () => _.reduce(
      bgData,
      (result, datum) => {
        result += cgmSampleFrequency(datum)
        return result
      },
      0
    )

    const insufficientData = this.bgSource === 'smbg'
      || this.getDayCountFromEndpoints() < 14
      || getTotalCbgDuration() < 14 * TimeService.MS_IN_DAY * 0.7

    if (insufficientData) {
      return {
        glucoseManagementIndicator: Number.NaN,
        insufficientData: true
      }
    }

    const meanInMGDL = this.bgUnits === MGDL_UNITS
      ? averageGlucose
      : convertBG(averageGlucose, MMOLL_UNITS)

    const glucoseManagementIndicator = (3.31 + 0.02392 * meanInMGDL)

    return {
      glucoseManagementIndicator,
      total
    }
  }

  getLatestPump = () => {
    const pumpSettings = this.sort.byDate(this.filter.byType('pumpSettings').top(Infinity))[0]
    if (pumpSettings?.payload?.device?.name && pumpSettings?.payload?.device?.manufacturer) {
      return {
        deviceModel: pumpSettings.payload.device.name,
        manufacturer: pumpSettings.payload.device.manufacturer
      }
    }
    /*If no pumpSettings is found, we can fall back to old upload object*/
    const uploadData = this.sort.byDate(this.filter.byType('upload').top(Infinity))
    const latestPumpUpload = getLatestPumpUpload(uploadData)
    const latestUploadSource = _.get(latestPumpUpload, 'source', '').toLowerCase()
    return {
      deviceModel: _.get(latestPumpUpload, 'deviceModel', ''),
      manufacturer: latestUploadSource === 'carelink' ? 'medtronic' : latestUploadSource
    }
  }

  getReadingsInRangeData = () => {
    this.applyDateFilters()

    let smbgData = _.reduce(
      this.filter.byType('smbg').top(Infinity),
      (result, datum) => {
        const classification = classifyBgValue(this.bgBounds, datum.value, 'fiveWay')
        result[classification]++
        result.total++
        return result
      },
      {
        veryLow: 0,
        low: 0,
        target: 0,
        high: 0,
        veryHigh: 0,
        total: 0
      }
    )

    if (this.days > 1) {
      smbgData = this.getDailyAverageSums(smbgData)
    }

    return smbgData
  }

  getSensorUsage = () => {
    this.applyDateFilters()
    const cbgData = this.filter.byType('cbg').top(Infinity)

    const duration = _.reduce(
      cbgData,
      (result, datum) => {
        result += cgmSampleFrequency(datum)
        return result
      },
      0
    )

    const total = Math.round(this.days * TimeService.MS_IN_DAY)

    return {
      sensorUsage: duration,
      total
    }
  }

  getStandardDevData = (cvByDate = false) => {
    const { bgData, averageGlucose, bgDataByDate, total } = this.getGlucoseDataByDate()

    if (total < 3) {
      return {
        averageGlucose,
        insufficientData: true,
        total,
        standardDeviation: Number.NaN
      }
    }
    const squaredDiffs = _.map(bgData, d => (d.value - averageGlucose) ** 2)
    const standardDeviation = Math.sqrt(_.sum(squaredDiffs) / (bgData.length - 1))

    const coefficientOfVariationByDate = {}
    if (cvByDate) {
      _.forEach(bgDataByDate, (value, key) => {
        // ignore days having less than 3 glycemia values
        if (value.length >= 3) {
          const avgGlucose = _.meanBy(value, 'value')
          const squaredDiffs = _.map(value, d => (d.value - avgGlucose) ** 2)
          const standardDeviation = Math.sqrt(_.sum(squaredDiffs) / (value.length - 1))
          coefficientOfVariationByDate[key] = standardDeviation / avgGlucose * 100
        }
      })
    }

    return {
      averageGlucose,
      insufficientData: false,
      total,
      standardDeviation,
      coefficientOfVariationByDate
    }
  }

  getTimeInAutoData = () => {
    this.applyDateFilters()

    let basalData = this.sort.byDate(this.filter.byType('basal').top(Infinity))
    basalData = this.addBasalOverlappingStart(basalData)

    let durations = basalData.length
      ? _.transform(
        getBasalGroupDurationsFromEndpoints(basalData, this._endpoints),
        (result, value, key) => {
          result[key] = value
          return result
        },
        {},
      )
      : Number.NaN

    if (this.days > 1 && !_.isNaN(durations)) {
      durations = this.getDailyAverageDurations(durations)
    }

    return durations
  }

  getTimeInRangeData = () => {
    this.applyDateFilters()
    const cbgData = this.filter.byType('cbg').top(Infinity)

    let durations = _.reduce(
      cbgData,
      (result, datum) => {
        const classification = classifyBgValue(this.bgBounds, datum.value, 'fiveWay')
        const duration = cgmSampleFrequency(datum)
        result[classification] += duration
        result.total += duration
        return result
      },
      {
        veryLow: 0,
        low: 0,
        target: 0,
        high: 0,
        veryHigh: 0,
        total: 0
      }
    )

    if (this.days > 1) {
      durations = this.getDailyAverageDurations(durations)
    }

    return durations
  }

  getTotalInsulinAndWeightData() {
    const weight = this.getWeight()
    const { basal, bolus } = this.getBasalBolusData()

    const totalInsulin = _.reduce([basal, bolus], (result, value) => {
      const delivered = _.isNaN(value) ? 0 : value || 0
      return result + delivered
    }, 0)

    return {
      totalInsulin,
      weight
    }
  }

  /**
   * Retreive the patient weight from the pump settings, null if not present
   * @returns {{ name: 'WEIGHT', value: string, unit: string, level: number } | null}
   */
  getWeight() {
    // retrieve lastest pump settings
    const pumpSettings = _.last(this.filter.byType('pumpSettings').top(Infinity))
    const parameters = _.get(pumpSettings, 'payload.parameters')
    const weight = _.find(parameters, { name: 'WEIGHT' })

    if (_.isEmpty(weight)) {
      return null
    }

    return weight
  }
}

export default DataUtil
