import _ from 'lodash'
import { expect } from 'chai'
import { MGDL_UNITS, MMOLL_UNITS, TimeService } from 'medical-domain'
import DataUtil from '../../src/utils/data'
import * as Types from '../../data/types'
/* eslint-disable max-len, no-underscore-dangle */

describe('DataUtil', () => {
  /** @type {DataUtil} */
  let dataUtil

  const basalDatumOverlappingStart = new Types.Basal({
    duration: TimeService.MS_IN_HOUR * 2,
    deviceTime: '2018-01-31T23:00:00',
    source: 'Medtronic',
    deviceModel: '1780',
    deliveryType: 'automated',
    rate: 0.5
  })

  const basalDatumOverlappingEnd = new Types.Basal({
    duration: TimeService.MS_IN_HOUR * 3,
    deviceTime: '2018-02-01T22:00:00',
    source: 'Medtronic',
    deviceModel: '1780',
    deliveryType: 'automated',
    rate: 0.5
  })

  const basalData = [
    new Types.Basal({
      duration: TimeService.MS_IN_HOUR,
      deviceTime: '2018-02-01T01:00:00',
      source: 'Medtronic',
      deviceModel: '1780',
      deliveryType: 'automated',
      rate: 0.25
    }),
    new Types.Basal({
      duration: TimeService.MS_IN_HOUR,
      deviceTime: '2018-02-01T02:00:00',
      source: 'Medtronic',
      deviceModel: '1780',
      deliveryType: 'scheduled',
      rate: 0.75
    }),
    new Types.Basal({
      duration: TimeService.MS_IN_HOUR,
      deviceTime: '2018-02-01T03:00:00',
      source: 'Medtronic',
      deviceModel: '1780',
      deliveryType: 'scheduled',
      rate: 0.5
    }),
    new Types.Basal({
      duration: TimeService.MS_IN_HOUR,
      deviceTime: '2018-02-03T03:00:00',
      source: 'Medtronic',
      deviceModel: '1780',
      deliveryType: 'scheduled',
      rate: 0.5
    })
  ]

  const bolusData = [
    new Types.Bolus({
      deviceTime: '2018-02-01T01:00:00',
      value: 4
    }),
    new Types.Bolus({
      deviceTime: '2018-02-01T02:00:00',
      value: 5
    }),
    new Types.Bolus({
      deviceTime: '2018-02-01T03:00:00',
      value: 6
    }),
    new Types.Bolus({
      deviceTime: '2018-02-03T03:00:00',
      value: 4
    })
  ]

  const cbgData = [
    new Types.CBG({
      deviceId: 'AbbottFreeStyleLibre-XXX-XXXX',
      value: 50,
      deviceTime: '2018-02-01T00:00:00',
      localDate: '2018-02-01'
    }),
    new Types.CBG({
      deviceId: 'AbbottFreeStyleLibre-XXX-XXXX',
      value: 60,
      deviceTime: '2018-02-01T00:15:00',
      localDate: '2018-02-01'
    }),
    new Types.CBG({
      deviceId: 'AbbottFreeStyleLibre-XXX-XXXX',
      value: 100,
      deviceTime: '2018-02-01T00:30:00',
      localDate: '2018-02-01'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 190,
      deviceTime: '2018-02-01T00:45:00',
      localDate: '2018-02-01'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 260,
      deviceTime: '2018-02-01T00:50:00',
      localDate: '2018-02-01'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 100,
      deviceTime: '2018-02-02T00:50:00',
      localDate: '2018-02-02'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 150,
      deviceTime: '2018-02-03T00:50:00',
      localDate: '2018-02-03'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 200,
      deviceTime: '2018-02-03T00:55:00',
      localDate: '2018-02-03'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 120,
      deviceTime: '2018-02-03T01:00:00',
      localDate: '2018-02-03'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 120,
      deviceTime: '2020-02-01T01:00:00',
      localDate: '2020-02-01'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 120,
      deviceTime: '2020-02-02T01:00:00',
      localDate: '2020-02-02'
    }),
    new Types.CBG({
      deviceId: 'Dexcom-XXX-XXXX',
      value: 120,
      deviceTime: '2020-02-03T01:00:00',
      localDate: '2020-02-03'
    })
  ]

  const foodData = [
    new Types.Food({
      deviceTime: '2018-02-01T02:00:00',
      nutrition: {
        carbohydrate: {
          net: 7
        }
      }
    }),
    new Types.Food({
      deviceTime: '2018-02-01T04:00:00',
      nutrition: {
        carbohydrate: {
          net: 9
        }
      }
    }),
    new Types.Food({
      deviceTime: '2018-02-02T04:00:00',
      nutrition: {
        carbohydrate: {
          net: 13
        }
      }
    })
  ]

  const smbgData = [
    new Types.SMBG({
      value: 60,
      deviceTime: '2018-02-01T00:00:00',
      localDate: '2018-02-01'
    }),
    new Types.SMBG({
      value: 70,
      deviceTime: '2018-02-01T00:15:00',
      localDate: '2018-02-01'
    }),
    new Types.SMBG({
      value: 80,
      deviceTime: '2018-02-01T00:30:00',
      localDate: '2018-02-01'
    }),
    new Types.SMBG({
      value: 200,
      deviceTime: '2018-02-01T00:45:00',
      localDate: '2018-02-01'
    }),
    new Types.SMBG({
      value: 270,
      deviceTime: '2018-02-02T00:50:00',
      localDate: '2018-02-02'
    })
  ]

  const pumpSettingsData = [
    new Types.PumpSettings({
      payload: {
        device: {
          name: 'dash',
          manufacturer: 'diabeloop'
        }
      }
    })
  ]

  const wizardData = [
    new Types.Wizard({
      deviceTime: '2018-02-01T02:00:00',
      carbInput: 4
    }),
    new Types.Wizard({
      deviceTime: '2018-02-01T03:00:00'
    }),
    new Types.Wizard({
      deviceTime: '2018-02-01T04:00:00',
      carbInput: 2
    }),
    new Types.Wizard({
      deviceTime: '2018-02-02T04:00:00',
      carbInput: 10
    })
  ]

  const pumpSettings = [
    new Types.PumpSettings({
      deviceTime: '2018-02-02T04:00:00'
    }),
    new Types.PumpSettings({
      deviceTime: '2018-02-03T04:00:00'
    })
  ]

  const data = [
    ...basalData,
    ...bolusData,
    ...cbgData,
    ...foodData,
    ...smbgData,
    ...wizardData
  ]

  const chartPrefs = {
    bgSource: 'cbg',
    activeDays: {
      monday: true,
      tuesday: true,
      wednesday: true,
      thursday: true,
      friday: true,
      saturday: true,
      sunday: true
    }
  }

  const bgPrefs = {
    bgClasses: {
      veryLow: 54,
      low: 70,
      target: 180,
      high: 250
    },
    bgUnits: MGDL_UNITS
  }

  const dayEndpoints = [
    '2018-02-01T00:00:00.000Z',
    '2018-02-02T00:00:00.000Z'
  ]

  const twoDayEndpoints = [
    '2018-02-01T00:00:00.000Z',
    '2018-02-03T00:00:00.000Z'
  ]

  const threeDayEndpoints = [
    '2018-02-01T00:00:00.000Z',
    '2018-02-04T00:00:00.000Z'
  ]

  const twoWeekEndpoints = [
    '2018-02-01T00:00:00.000Z',
    '2018-02-15T00:00:00.000Z'
  ]

  const threeDayEndpoints2020 = [
    '2020-02-01T00:00:00.000Z',
    '2020-02-04T00:00:00.000Z'
  ]

  const defaultOpts = {
    chartPrefs,
    bgPrefs,
    endpoints: dayEndpoints
  }

  const opts = overrides => _.assign({}, defaultOpts, overrides)

  beforeEach(() => {
    dataUtil = new DataUtil(data, defaultOpts)
  })

  describe('constructor', () => {
    it('should initialize the data crossfilter', () => {
      expect(dataUtil.data).to.be.an('object')
      expect(dataUtil.data.size()).to.equal(data.length)
    })

    it('should set custom `endpoints` from provided opts', () => {
      expect(dataUtil._endpoints).to.be.an('array')
      expect(dataUtil._endpoints).to.eql(dayEndpoints)
    })

    it('should set default `endpoints` when not provided in opts', () => {
      dataUtil = new DataUtil(data, opts({ endpoints: undefined }))
      expect(dataUtil._endpoints).to.eql([])
    })

    it('should set custom `chartPrefs` from provided opts', () => {
      expect(dataUtil._chartPrefs).to.include({
        bgSource: 'cbg'
      })
    })

    it('should set default `chartPrefs` when not provided in opts', () => {
      dataUtil = new DataUtil(data, opts({ chartPrefs: undefined }))
      expect(dataUtil._chartPrefs).to.eql({})
    })

    it('should set `bgBounds` from bgPrefs option', () => {
      expect(dataUtil.bgBounds).to.eql({
        veryHighThreshold: 250,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 54
      })
    })

    it('should set `bgUnits` from bgPrefs option', () => {
      expect(dataUtil.bgUnits).to.eql(MGDL_UNITS)
    })

    it('should set `days` from endpoints', () => {
      expect(dataUtil.days).to.be.a('number')
    })

    it('should set up crossfilter dimensions', () => {
      expect(dataUtil.dimension).to.be.an('object')
    })

    it('should set up crossfilter filters', () => {
      expect(dataUtil.filter).to.be.an('object')
    })

    it('should set up crossfilter sorts', () => {
      expect(dataUtil.sort).to.be.an('object')
    })

    it('should set `bgSources`', () => {
      expect(dataUtil.bgSources).to.have.keys(['cbg', 'smbg'])
    })

    it('should set `defaultBgSource`', () => {
      expect(dataUtil.defaultBgSource).to.be.oneOf(['cbg', 'smbg'])
    })

    it('should set `latestPump`', () => {
      expect(dataUtil.latestPump).to.have.keys(['deviceModel', 'manufacturer'])
    })
  })

  describe('bgSource getter', () => {
    it('should return the `bgSource` from chartPrefs when available', () => {
      dataUtil = new DataUtil(data, opts({ chartPrefs: { bgSource: 'smbg' } }))
      expect(dataUtil.bgSource).to.equal('smbg')
    })

    it('should return the `defaultBgSource` when `bgSource` from chartPrefs is unavailable', () => {
      dataUtil = new DataUtil(data, opts({ chartPrefs: undefined }))
      expect(dataUtil.bgSource).to.equal('cbg')
    })
  })

  describe('bgPrefs setter', () => {
    it('should set the `bgUnits` property as provided', () => {
      expect(dataUtil.bgUnits).to.equal(MGDL_UNITS)

      dataUtil.bgPrefs = {
        bgClasses: {
          veryLow: 54,
          low: 70,
          target: 180,
          high: 250
        },
        bgUnits: MMOLL_UNITS
      }

      expect(dataUtil.bgUnits).to.eql(MMOLL_UNITS)
    })

    it('should set the `bgBounds` property from the provided `bgClasses', () => {
      expect(dataUtil.bgBounds).to.eql({
        veryHighThreshold: 250,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 54
      })

      dataUtil.bgPrefs = {
        bgClasses: {
          veryLow: 50,
          low: 60,
          target: 70,
          high: 80
        },
        bgUnits: MGDL_UNITS
      }

      expect(dataUtil.bgBounds).to.eql({
        veryHighThreshold: 80,
        targetUpperBound: 70,
        targetLowerBound: 60,
        veryLowThreshold: 50
      })
    })
  })

  describe('chartPrefs setter', () => {
    it('should set the `_chartPrefs` property as provided', () => {
      expect(dataUtil._chartPrefs).to.equal(chartPrefs)
      dataUtil.chartPrefs = { foo: 'bar' }
      expect(dataUtil._chartPrefs).to.eql({ foo: 'bar' })
    })

    it('should set the `_chartPrefs` property to empty object when undefined arg given', () => {
      expect(dataUtil._chartPrefs).to.equal(chartPrefs)
      dataUtil.chartPrefs = undefined
      expect(dataUtil._chartPrefs).to.eql({})
    })
  })

  describe('endpoints setter', () => {
    it('should set the `_endpoints` property as provided', () => {
      expect(dataUtil._endpoints).to.equal(dayEndpoints)
      dataUtil.endpoints = twoWeekEndpoints
      expect(dataUtil._endpoints).to.eql(twoWeekEndpoints)
    })

    it('should set the `_endpoints` property to empty object when undefined arg given', () => {
      expect(dataUtil._endpoints).to.equal(dayEndpoints)
      dataUtil.endpoints = undefined
      expect(dataUtil._endpoints).to.eql([])
    })

    it('should set the `days` property with the endpoints provided', () => {
      expect(dataUtil.days).to.equal(1)
      dataUtil.endpoints = twoWeekEndpoints
      expect(dataUtil.days).to.eql(14)
    })
  })

  describe('getAverageGlucoseData', () => {
    it('should return the median glucose for cbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      expect(dataUtil.getAverageGlucoseData()).to.eql({
        averageGlucose: 132,
        total: 5
      })
    })

    it('should return the median glucose for smbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'smbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getAverageGlucoseData()).to.eql({
        averageGlucose: 136,
        total: 5
      })
    })

    it('should return the filtered bg data when `returnBgData` is true', () => {
      dataUtil.chartPrefs = { bgSource: 'smbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getAverageGlucoseData(true).bgData).to.be.an('array').and.have.length(5)
    })
  })

  describe('getBasalBolusData', () => {
    it('should return the total basal and bolus insulin delivery when viewing 1 day', () => {
      dataUtil.endpoints = dayEndpoints
      expect(dataUtil.getBasalBolusData()).to.eql({
        basal: 1.5,
        bolus: 15
      })
    })

    it('should return the avg daily total basal and bolus insulin delivery when viewing more than 1 day', () => {
      dataUtil.endpoints = twoWeekEndpoints
      expect(dataUtil.getBasalBolusData()).to.eql({
        basal: 1, // (0.25 + 0.75 + 0.5 + 0.5) / 2 days when keeping only days with insulin data
        bolus: 9.5 // (4 + 5 + 6 + 4) / 2
      })
    })

    context('basal delivery overlaps endpoints', () => {
      it('should include the portion of delivery of a basal datum that overlaps the start endpoint', () => {
        dataUtil.endpoints = dayEndpoints
        dataUtil.addData([basalDatumOverlappingStart])
        expect(dataUtil.getBasalBolusData()).to.eql({
          basal: 2,
          bolus: 15
        })
      })

      it('should include the portion of delivery of a basal datum that overlaps the end endpoint', () => {
        dataUtil.endpoints = dayEndpoints
        dataUtil.addData([basalDatumOverlappingEnd])
        expect(dataUtil.getBasalBolusData()).to.eql({
          basal: 2.5,
          bolus: 15
        })
      })
    })
  })

  describe('getBgSources', () => {
    it('should return true for `smbg` and false for `cbg` when only smbg data available', () => {
      dataUtil = new DataUtil(smbgData, defaultOpts)

      expect(dataUtil.getBgSources()).to.eql({
        cbg: false,
        smbg: true
      })
    })

    it('should return false for `smbg` and true for `cbg` when only cbg data available', () => {
      dataUtil = new DataUtil(cbgData, defaultOpts)

      expect(dataUtil.getBgSources()).to.eql({
        cbg: true,
        smbg: false
      })
    })

    it('should return true for `smbg` and true for `cbg` when both types of bg data available', () => {
      dataUtil = new DataUtil([...cbgData, ...smbgData], defaultOpts)

      expect(dataUtil.getBgSources()).to.eql({
        cbg: true,
        smbg: true
      })
    })

    it('should return false for `smbg` and false for `cbg` when neither type of bg data available', () => {
      dataUtil = new DataUtil([], defaultOpts)

      expect(dataUtil.getBgSources()).to.eql({
        cbg: false,
        smbg: false
      })
    })
  })

  describe('getCoefficientOfVariationData', () => {
    it('should return the coefficient of variation for cbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        coefficientOfVariation: 68.47579720288888,
        total: 5
      })
    })

    it('should return the coefficient of variation for cbg data for 2 days', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        coefficientOfVariation: 68.47579720288888,
        total: 6
      })
    })

    it('should return the coefficient of variation for cbg data for 3 days', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      dataUtil.endpoints = threeDayEndpoints
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        coefficientOfVariation: 47.136149296106296,
        total: 9
      })
    })

    it('should return no value coefficient of variation for cbg data for 3 days having less than 3 values per day', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      dataUtil.endpoints = threeDayEndpoints2020
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        insufficientData: true,
        total: 3,
        coefficientOfVariation: Number.NaN
      })
    })

    it('should return the coefficient of variation for smbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'smbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        coefficientOfVariation: 63.912988640759494,
        total: 5
      })
    })

    it('should return true for insufficientData when less than 3 datums available', () => {
      dataUtil = new DataUtil(smbgData.slice(0, 2), opts({ chartPrefs: { bgSource: 'smbg' } }))
      expect(dataUtil.getCoefficientOfVariationData()).to.eql({
        insufficientData: true,
        total: 2,
        coefficientOfVariation: Number.NaN
      })
    })
  })

  describe('getDefaultBgSource', () => {
    it('should return `cbg` when only cbg data is available', () => {
      dataUtil = new DataUtil(cbgData, defaultOpts)
      expect(dataUtil.getDefaultBgSource()).to.equal('cbg')
    })

    it('should return `cbg` when cbg and smbg data is available', () => {
      dataUtil = new DataUtil([...cbgData, ...smbgData], defaultOpts)
      expect(dataUtil.getDefaultBgSource()).to.equal('cbg')
    })

    it('should return `smbg` when cbg data is unavailable and smbg data is available', () => {
      dataUtil = new DataUtil(smbgData, defaultOpts)
      expect(dataUtil.getDefaultBgSource()).to.equal('smbg')
    })

    it('should return `undefined` when neither cbg nor smbg data is available', () => {
      dataUtil = new DataUtil([], defaultOpts)
      expect(dataUtil.getDefaultBgSource()).to.be.undefined
    })
  })

  describe('getDayCountFromEndpoints', () => {
    it('should return the endpoints range in days', () => {
      dataUtil.endpoints = dayEndpoints
      expect(dataUtil.getDayCountFromEndpoints()).to.equal(1)

      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getDayCountFromEndpoints()).to.equal(2)

      dataUtil.endpoints = twoWeekEndpoints
      expect(dataUtil.getDayCountFromEndpoints()).to.equal(14)
    })
  })

  describe('getGlucoseManagementIndicatorData', () => {
    it('should return the GMI data when viewing at least 14 days of data and 70% coverage', () => {
      const requiredDexcomDatums = 2823 // 288(total daily possible readings) * .7(%required) * 14(days)
      const sufficientData = _.fill(Array(requiredDexcomDatums), cbgData[4], 0, requiredDexcomDatums)

      dataUtil = new DataUtil(sufficientData, defaultOpts)
      dataUtil.endpoints = twoWeekEndpoints

      expect(dataUtil.getGlucoseManagementIndicatorData()).to.eql({
        glucoseManagementIndicator: 9.5292,
        total: 2823
      })
    })

    it('should return `NaN` when viewing less than 14 days of data', () => {
      const requiredDexcomDatums = 2823 // 288(total daily possible readings) * .7(%required) * 14(days)
      const insufficientData = _.fill(Array(requiredDexcomDatums), cbgData[4], 0, requiredDexcomDatums)

      dataUtil = new DataUtil(insufficientData, defaultOpts)
      dataUtil.endpoints = [
        '2018-02-01T00:00:00.000Z',
        '2018-02-14T00:00:00.000Z'
      ]

      expect(dataUtil.getGlucoseManagementIndicatorData()).to.eql({
        glucoseManagementIndicator: Number.NaN,
        insufficientData: true
      })
    })

    it('should return `NaN` when viewing 14 days of data and less than 70% coverage', () => {
      const requiredDexcomDatums = 2823 // 288(total daily possible readings) * .7(%required) * 14(days)
      const count = requiredDexcomDatums - 1
      const insufficientData = _.fill(Array(count), cbgData[4], 0, count)

      dataUtil = new DataUtil(insufficientData, defaultOpts)
      dataUtil.endpoints = twoWeekEndpoints

      expect(dataUtil.getGlucoseManagementIndicatorData()).to.eql({
        glucoseManagementIndicator: Number.NaN,
        insufficientData: true
      })
    })

    it('should return `NaN` when bgSource is `smbg`', () => {
      const requiredDexcomDatums = 2823 // 288(total daily possible readings) * .7(%required) * 14(days)
      const sufficientData = _.fill(Array(requiredDexcomDatums), cbgData[4], 0, requiredDexcomDatums)

      dataUtil = new DataUtil(sufficientData, opts({ chartPrefs: { bgSource: 'smbg' } }))
      dataUtil.endpoints = twoWeekEndpoints

      expect(dataUtil.getGlucoseManagementIndicatorData()).to.eql({
        glucoseManagementIndicator: Number.NaN,
        insufficientData: true
      })
    })
  })

  describe('getLatestPump', () => {
    it('should return the make and model of the latest pump uploaded', () => {
      dataUtil = new DataUtil(pumpSettingsData.slice(0, 1), defaultOpts)

      expect(dataUtil.getLatestPump()).to.eql({
        manufacturer: 'diabeloop',
        deviceModel: 'dash'
      })
    })
  })

  describe('getReadingsInRangeData', () => {
    it('should return the readings in range data when viewing 1 day', () => {
      expect(dataUtil.getReadingsInRangeData()).to.eql({
        veryLow: 0,
        low: 1,
        target: 2,
        high: 1,
        veryHigh: 0,
        total: 4
      })
    })

    it('should return the readings in range data when viewing 2 days', () => {
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getReadingsInRangeData()).to.eql({
        veryLow: 0,
        low: 0.5,
        target: 1,
        high: 0.5,
        veryHigh: 0.5,
        total: 5
      })
    })

    it('should return the avg daily readings in range data when viewing more than 2 days', () => {
      dataUtil.endpoints = threeDayEndpoints
      expect(dataUtil.getReadingsInRangeData()).to.eql({
        veryLow: 0,
        low: 0.3333333333333333,
        target: 0.6666666666666666,
        high: 0.3333333333333333,
        veryHigh: 0.3333333333333333,
        total: 5
      })
    })
  })

  describe('getSensorUsage', () => {
    it('should return the duration of sensor usage and total duration of the endpoint range', () => {
      dataUtil.endpoints = dayEndpoints
      expect(dataUtil.getSensorUsage()).to.eql({
        sensorUsage: TimeService.MS_IN_MIN * 55, // 3 * 15m for libre readings, 2 * 5m for dex readings
        total: TimeService.MS_IN_DAY
      })

      dataUtil.endpoints = twoWeekEndpoints
      expect(dataUtil.getSensorUsage()).to.eql({
        sensorUsage: TimeService.MS_IN_MIN * (55 + 5 + 15),
        total: TimeService.MS_IN_DAY * 14
      })
    })
  })

  describe('getStandardDevData', () => {
    it('should return the average glucose and standard deviation for cbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      expect(dataUtil.getStandardDevData()).to.eql({
        averageGlucose: 132,
        insufficientData: false,
        total: 5,
        standardDeviation: 90.38805230781334,
        coefficientOfVariationByDate: {}
      })
    })

    it('should return the average glucose, standard deviation and cv by date for cbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'cbg' }
      expect(dataUtil.getStandardDevData(true)).to.eql({
        averageGlucose: 132,
        insufficientData: false,
        total: 5,
        standardDeviation: 90.38805230781334,
        coefficientOfVariationByDate: {
          '2018-02-01': 68.47579720288888
        }
      })
    })

    it('should return the average glucose and standard deviation for smbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'smbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getStandardDevData()).to.eql({
        averageGlucose: 136,
        insufficientData: false,
        total: 5,
        standardDeviation: 93.96807968666806,
        coefficientOfVariationByDate: {}
      })
    })

    it('should return the average glucose, standard deviation and cv by date for smbg data', () => {
      dataUtil.chartPrefs = { bgSource: 'smbg' }
      dataUtil.endpoints = twoDayEndpoints
      expect(dataUtil.getStandardDevData(true)).to.eql({
        averageGlucose: 136,
        insufficientData: false,
        total: 5,
        standardDeviation: 93.96807968666806,
        coefficientOfVariationByDate: {
          '2018-02-01': 63.912988640759494
        }
      })
    })

    it('should return true for insufficientData when less than 3 datums available', () => {
      dataUtil = new DataUtil(smbgData.slice(0, 2), opts({ chartPrefs: { bgSource: 'smbg' } }))
      expect(dataUtil.getStandardDevData()).to.eql({
        averageGlucose: 65,
        insufficientData: true,
        total: 2,
        standardDeviation: Number.NaN
      })
    })
  })

  describe('getTimeInRangeData', () => {
    it('should return the time in range data when viewing 1 day', () => {
      dataUtil.endpoints = dayEndpoints
      expect(dataUtil.getTimeInRangeData()).to.eql({
        veryLow: TimeService.MS_IN_MIN * 15,
        low: TimeService.MS_IN_MIN * 15,
        target: TimeService.MS_IN_MIN * 15,
        high: TimeService.MS_IN_MIN * 5,
        veryHigh: TimeService.MS_IN_MIN * 5,
        total: TimeService.MS_IN_MIN * 55
      })
    })

    it('should return the avg daily time in range data when viewing more than 1 day', () => {
      dataUtil.endpoints = twoDayEndpoints

      const result = dataUtil.getTimeInRangeData()
      const totalDuration = result.total
      expect(result).to.eql({
        veryLow: (TimeService.MS_IN_MIN * 15) / totalDuration * TimeService.MS_IN_DAY,
        low: (TimeService.MS_IN_MIN * 15) / totalDuration * TimeService.MS_IN_DAY,
        target: (TimeService.MS_IN_MIN * (15 + 5)) / totalDuration * TimeService.MS_IN_DAY,
        high: (TimeService.MS_IN_MIN * 5) / totalDuration * TimeService.MS_IN_DAY,
        veryHigh: (TimeService.MS_IN_MIN * 5) / totalDuration * TimeService.MS_IN_DAY,
        total: TimeService.MS_IN_MIN * (55 + 5)
      })
    })
  })

  describe('getTotalInsulinAndWeightData', () => {
    it('should return the total basal and bolus insulin delivery when viewing 1 day and weight', () => {
      let du = new DataUtil(data, defaultOpts)
      du.endpoints = dayEndpoints
      du.addData(pumpSettings)
      // {name: 'WEIGHT', value: '60', unit: 'kg', level: 1}
      const result = du.getTotalInsulinAndWeightData()
      expect(result, JSON.stringify(result)).to.deep.eql({
        totalInsulin: 16.5,
        weight: {
          name: 'WEIGHT',
          value: '60.0',
          unit: 'kg',
          level: 1
        }
      })
    })

    it('should return the avg daily total basal and bolus insulin delivery when viewing more than 1 day and weight', () => {
      let du = new DataUtil(data, defaultOpts)
      du.endpoints = twoWeekEndpoints
      du.addData(pumpSettings)
      const result = du.getTotalInsulinAndWeightData()
      expect(result, JSON.stringify(result)).to.eql({
        totalInsulin: 10.5, // 9.5 + 1
        weight: {
          name: 'WEIGHT',
          value: '60.0',
          unit: 'kg',
          level: 1
        }
      })
    })

    it('should return null weight when no pump settings found', () => {
      const du = new DataUtil(data, defaultOpts)
      du.endpoints = dayEndpoints
      expect(du.getTotalInsulinAndWeightData()).to.eql({
        totalInsulin: 16.5,
        weight: null
      })
    })

    context('basal delivery overlaps endpoints', () => {
      it('should include the portion of delivery of a basal datum that overlaps the start endpoint', () => {
        let du = new DataUtil(data, defaultOpts)
        du.endpoints = dayEndpoints
        du.addData([basalDatumOverlappingStart])
        du.addData(pumpSettings)
        expect(du.getTotalInsulinAndWeightData()).to.eql({
          totalInsulin: 17,
          weight: {
            name: 'WEIGHT',
            value: '60.0',
            unit: 'kg',
            level: 1
          }
        })
      })

      it('should include the portion of delivery of a basal datum that overlaps the start endpoint', () => {
        let du = new DataUtil(data, defaultOpts)
        du.endpoints = dayEndpoints
        du.addData([basalDatumOverlappingEnd])
        du.addData(pumpSettings)
        expect(du.getTotalInsulinAndWeightData()).to.eql({
          totalInsulin: 17.5,
          weight: {
            name: 'WEIGHT',
            value: '60.0',
            unit: 'kg',
            level: 1
          }
        })
      })
    })
  })
})
