import _ from 'lodash'
import { expect } from 'chai'
import { MGDL_UNITS } from 'medical-domain'
import * as stat from '../../src/utils/stat'

/* eslint-disable max-len */

describe('stat', () => {
  const {
    commonStats,
    dailyDoseUnitOptions,
    statFormats,
    statTypes
  } = stat

  describe('dailyDoseUnitOptions', () => {
    it('should export the `dailyDoseUnitOptions`', () => {
      expect(stat.dailyDoseUnitOptions).to.be.an('array').and.have.length(2)

      expect(stat.dailyDoseUnitOptions[0]).to.eql({
        label: 'kg',
        value: 'kg'
      })

      expect(stat.dailyDoseUnitOptions[1]).to.eql({
        label: 'lb',
        value: 'lb'
      })
    })
  })

  describe('statTypes', () => {
    it('should export the `statTypes`', () => {
      expect(stat.statTypes).to.eql({
        barBg: 'barBg',
        noBar: 'noBar',
        lines: 'lines',
        wheel: 'wheel',
        input: 'input',
        simple: 'simple'
      })
    })
  })

  describe('statBgSourceLabels', () => {
    it('should export the `statBgSourceLabels`', () => {
      expect(stat.statBgSourceLabels).to.eql({
        cbg: 'CGM',
        smbg: 'BGM'
      })
    })
  })

  describe('statFormats', () => {
    it('should export the `statFormats`', () => {
      expect(stat.statFormats).to.eql({
        bgCount: 'bgCount',
        bgRange: 'bgRange',
        bgValue: 'bgValue',
        cv: 'cv',
        carbs: 'carbs',
        duration: 'duration',
        gmi: 'gmi',
        percentage: 'percentage',
        standardDevRange: 'standardDevRange',
        standardDevValue: 'standardDevValue',
        units: 'units',
        unitsPerKg: 'unitsPerKg'
      })
    })
  })

  describe('commonStats', () => {
    it('should export the `commonStats`', () => {
      expect(stat.commonStats).to.eql({
        averageGlucose: 'averageGlucose',
        averageDailyDose: 'averageDailyDose',
        carbs: 'carbs',
        coefficientOfVariation: 'coefficientOfVariation',
        glucoseManagementIndicator: 'glucoseManagementIndicator',
        readingsInRange: 'readingsInRange',
        sensorUsage: 'sensorUsage',
        standardDev: 'standardDev',
        timeInAuto: 'timeInAuto',
        timeInRange: 'timeInRange',
        totalInsulin: 'totalInsulin'
      })
    })
  })

  describe('statFetchMethods', () => {
    it('should export the common `statFetchMethods`', () => {
      expect(stat.statFetchMethods).to.eql({
        averageGlucose: 'getAverageGlucoseData',
        averageDailyDose: 'getTotalInsulinAndWeightData',
        carbs: 'getCarbsData',
        coefficientOfVariation: 'getCoefficientOfVariationData',
        glucoseManagementIndicator: 'getGlucoseManagementIndicatorData',
        readingsInRange: 'getReadingsInRangeData',
        sensorUsage: 'getSensorUsage',
        standardDev: 'getStandardDevData',
        timeInAuto: 'getTimeInAutoData',
        timeInRange: 'getTimeInRangeData',
        totalInsulin: 'getBasalBolusData'
      })
    })
  })

  describe('getSum', () => {
    it('should sum up datum values by their `value` key', () => {
      const data = [
        {
          value: 1
        },
        {
          value: 2
        },
        {
          value: 3.5
        }
      ]
      expect(stat.getSum(data)).to.equal(6.5)
    })
  })

  describe('ensureNumeric', () => {
    it('should parse incoming values as floats', () => {
      expect(stat.ensureNumeric('6.5')).to.equal(6.5)
      expect(stat.ensureNumeric(6.0)).to.equal(6)
    })

    it('should convert `NaN`, `null`, or `undefined` to `-1`', () => {
      expect(stat.ensureNumeric(Number.NaN)).to.equal(-1)
      expect(stat.ensureNumeric(null)).to.equal(-1)
      expect(stat.ensureNumeric(undefined)).to.equal(-1)
    })
  })

  describe('getStatAnnotations', () => {
    const defaultOpts = {
      manufacturer: 'medtronic'
    }

    const opts = overrides => _.assign({}, defaultOpts, overrides)

    const cbgOpts = opts({ bgSource: 'cbg' })
    const smbgOpts = opts({ bgSource: 'smbg' })
    const singleDayOpts = opts({ days: 1 })
    const multiDayOpts = opts({ days: 14 })

    const data = { total: 10 }

    describe('averageDailyDose', () => {
      it('should return annotations for `averageDailyDose` stat when viewing a single day of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.averageDailyDose, singleDayOpts)).to.have.ordered.members([
          '**Daily Insulin:** All basal and bolus insulin delivery (in Units) added together.'
        ])
      })

      it('should return annotations for `averageDailyDose` stat when viewing multiple days of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.averageDailyDose, multiDayOpts)).to.have.ordered.members([
          '**Avg. Daily Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view.'
        ])
      })
    })

    describe('carbs', () => {
      it('should return annotations for `carbs` stat when viewing a single day of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.carbs, singleDayOpts)).to.have.ordered.members([
          '**Total Carbs**: All carb entries from bolus wizard events or Apple Health records added together.',
          'Derived from _**10**_ carb entries.'
        ])
      })

      it('should return annotations for `carbs` stat when viewing multiple days of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.carbs, multiDayOpts)).to.have.ordered.members([
          '**Avg. Daily Carbs**: All carb entries added together, then divided by the number of days in this view. Note, these entries come from either bolus wizard events, or Apple Health records.',
          'Derived from _**10**_ carb entries.'
        ])
      })
    })

    describe('readingsInRange', () => {
      it('should return annotations for `readingsInRange` stat', () => {
        expect(stat.getStatAnnotations(data, commonStats.readingsInRange, smbgOpts)).to.have.ordered.members([
          '**Readings In Range:** Daily average of the number of BGM readings.',
          'Derived from _**10**_ BGM readings.'
        ])
      })
    })
    describe('standardDev', () => {
      it('should return insufficient dataannotation for `standardDev` stat when not enough data was present for a calculation', () => {
        const insufficientData = {
          ...data,
          insufficientData: true
        }

        expect(stat.getStatAnnotations(insufficientData, commonStats.standardDev, cbgOpts)).to.have.include.members([
          'insufficient-data'
        ])
      })
    })

    describe('timeInAuto', () => {
      it('should return annotations for `timeInAuto` stat when viewing a single day of data', () => {
        const result = stat.getStatAnnotations(data, commonStats.timeInAuto, singleDayOpts)
        expect(result, JSON.stringify(result)).to.have.ordered.members([
          '**Time In Loop Mode:** Time spent in automated basal delivery.',
          'compute-oneday-time-in-auto'
        ])
      })

      it('should return annotations for `timeInAuto` stat when viewing multiple days of data', () => {
        const result = stat.getStatAnnotations(data, commonStats.timeInAuto, multiDayOpts)
        expect(result, JSON.stringify(result)).to.have.ordered.members([
          '**Time In Loop Mode:** Daily average of the time spent in automated basal delivery.',
          'compute-ndays-time-in-auto'
        ])
      })
    })

    describe('timeInRange', () => {
      it('should return annotations for `timeInRange` stat when viewing a single day of data', () => {
        const result = stat.getStatAnnotations(data, commonStats.timeInRange, singleDayOpts)
        expect(result, JSON.stringify(result)).to.have.ordered.members([
          '**Time In Range:** Time spent in range, based on CGM readings.',
          'compute-oneday-time-in-range'
        ])
      })

      it('should return annotations for `timeInRange` stat when viewing multiple days of data', () => {
        const result = stat.getStatAnnotations(data, commonStats.timeInRange, multiDayOpts)
        expect(result, JSON.stringify(result)).to.have.ordered.members([
          '**Time In Range:** Daily average of the time spent in range, based on CGM readings.',
          'compute-ndays-time-in-range'
        ])
      })
    })

    describe('totalInsulin', () => {
      it('should return annotations for `totalInsulin` stat when viewing a single day of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.totalInsulin, singleDayOpts)).to.have.ordered.members([
          '**Total Insulin:** All basal and bolus insulin delivery (in Units) added together',
          'compute-total-insulin'
        ])
      })

      it('should return annotations for `totalInsulin` stat when viewing multiple days of data', () => {
        expect(stat.getStatAnnotations(data, commonStats.totalInsulin, multiDayOpts)).to.have.ordered.members([
          '**Total Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view',
          'compute-total-insulin'
        ])
      })
    })

    describe('insufficientData', () => {
      it('should return annotation for `insufficientData` stat when insufficient data was present', () => {
        expect(stat.getStatAnnotations({ insufficientData: true }, null, singleDayOpts)).to.have.ordered.members([
          'insufficient-data'
        ])
      })
    })
  })

  describe('getStatData', () => {
    const opts = {
      manufacturer: 'medtronic',
      bgPrefs: {
        bgBounds: {
          veryHighThreshold: 250,
          targetUpperBound: 180,
          targetLowerBound: 70,
          veryLowThreshold: 54
        },
        bgUnits: MGDL_UNITS
      }
    }

    it('should return the raw stat data as provided', () => {
      const data = {
        averageGlucose: 100
      }

      const statData = stat.getStatData(data, commonStats.averageGlucose, opts)

      expect(statData.raw.averageGlucose).to.eql(100)
    })

    it('should return the raw days option as provided', () => {
      const data = {
        averageGlucose: 100
      }

      const statData = stat.getStatData(data, commonStats.averageGlucose, { ...opts, days: 123 })

      expect(statData.raw.days).to.eql(123)
    })

    it('should format and return `averageGlucose` data', () => {
      const data = {
        averageGlucose: 100
      }

      const statData = stat.getStatData(data, commonStats.averageGlucose, opts)

      expect(statData.data).to.eql([
        {
          value: 100
        }
      ])

      expect(statData.dataPaths).to.eql({
        summary: 'data.0'
      })
    })

    it('should format and return default `averageDailyDose` data', () => {
      const data = {
        totalInsulin: 80,
        weight: {
          value: 154,
          unit: 'lb'
        }
      }

      const statData = stat.getStatData(data, commonStats.averageDailyDose, opts)

      expect(statData.data).to.eql([
        {
          id: 'insulin',
          input: {
            id: 'weight',
            label: 'Weight',
            suffix: 'lb',
            type: 'number',
            value: 154
          },
          output: {
            label: 'Daily Dose ÷ Weight',
            type: 'divisor',
            dataPaths: {
              dividend: 'data.0'
            }
          },
          value: 80
        }
      ])
    })

    it('should format and return `averageDailyDose` data with provided input value', () => {
      const data = {
        totalInsulin: 80,
        weight: {
          value: 70,
          unit: 'kg'
        }
      }

      const valueOpts = _.assign({}, opts, {
        inputValue: '300'
      })

      const statData = stat.getStatData(data, commonStats.averageDailyDose, valueOpts)

      expect(statData.data).to.eql([
        {
          id: 'insulin',
          input: {
            id: 'weight',
            label: 'Weight',
            suffix: 'kg',
            type: 'number',
            value: 70
          },
          output: {
            label: 'Daily Dose ÷ Weight',
            type: 'divisor',
            dataPaths: {
              dividend: 'data.0'
            }
          },
          value: 80
        }
      ])
    })

    it('should format and return `averageDailyDose` data with provided suffix value', () => {
      const data = {
        totalInsulin: 80,
        weight: {
          value: 70,
          unit: 'kg'
        }
      }

      const valueOpts = _.assign({}, opts, {
        suffixValue: dailyDoseUnitOptions[1]
      })

      const statData = stat.getStatData(data, commonStats.averageDailyDose, valueOpts)

      expect(statData.data).to.eql([
        {
          id: 'insulin',
          input: {
            id: 'weight',
            label: 'Weight',
            suffix: 'kg',
            type: 'number',
            value: 70
          },
          output: {
            label: 'Daily Dose ÷ Weight',
            type: 'divisor',
            dataPaths: {
              dividend: 'data.0'
            }
          },
          value: 80
        }
      ])
    })

    it('should format and return `carbs` data', () => {
      const data = {
        totalCarbsPerDay: 22
      }

      const statData = stat.getStatData(data, commonStats.carbs, opts)
      const expected = [
        {
          id: 'total-carbs',
          value: 22,
          valueString: '22',
          units: 'g',
          name: 'title',
          displayLine: false
        },
        {
          id: 'food',
          value: 16,
          valueString: '16',
          units: 'g',
          name: 'Rescuecarbs',
          displayLine: true
        }
      ]
      expect(statData.data, JSON.stringify({ value: statData.data, expected })).to.eql(expected)

      expect(statData.dataPaths).to.eql({
        summary: 'data.0'
      })
    })

    it('should format and return `coefficientOfVariation` data', () => {
      const data = {
        coefficientOfVariation: 40
      }

      const statData = stat.getStatData(data, commonStats.coefficientOfVariation, opts)

      expect(statData.data).to.eql([
        {
          id: 'cv',
          value: 40
        }
      ])

      expect(statData.dataPaths).to.eql({
        summary: 'data.0'
      })
    })

    it('should format and return `glucoseManagementIndicator` data', () => {
      const data = {
        glucoseManagementIndicator: 36
      }

      const statData = stat.getStatData(data, commonStats.glucoseManagementIndicator, opts)

      expect(statData.data).to.eql([
        {
          id: 'gmi',
          value: 36
        }
      ])

      expect(statData.dataPaths).to.eql({
        summary: 'data.0'
      })
    })

    it('should format and return `readingsInRange` data', () => {
      const data = {
        veryLow: 10,
        low: 20,
        target: 30,
        high: 40,
        veryHigh: 50
      }

      const statData = stat.getStatData(data, commonStats.readingsInRange, opts)

      expect(statData.data).to.eql([
        {
          id: 'veryLow',
          value: 10,
          title: 'Readings Below Range',
          legendTitle: '<54'
        },
        {
          id: 'low',
          value: 20,
          title: 'Readings Below Range',
          legendTitle: '54-70'
        },
        {
          id: 'target',
          value: 30,
          title: 'Readings In Range',
          legendTitle: '70-180'
        },
        {
          id: 'high',
          value: 40,
          title: 'Readings Above Range',
          legendTitle: '180-250'
        },
        {
          id: 'veryHigh',
          value: 50,
          title: 'Readings Above Range',
          legendTitle: '>250'
        }
      ])

      expect(statData.total).to.eql({ value: 150 })

      expect(statData.dataPaths).to.eql({
        summary: ['data', 2]
      })
    })

    it('should format and return `sensorUsage` data', () => {
      const data = {
        sensorUsage: 80,
        total: 200
      }

      const statData = stat.getStatData(data, commonStats.sensorUsage, opts)

      expect(statData.data).to.eql([
        {
          value: 80
        }
      ])

      expect(statData.total).to.eql({ value: 200 })

      expect(statData.dataPaths).to.eql({
        summary: 'data.0'
      })
    })

    it('should format and return `standardDev` data', () => {
      const data = {
        averageGlucose: 120,
        standardDeviation: 32
      }

      const statData = stat.getStatData(data, commonStats.standardDev, opts)

      expect(statData.data).to.eql([
        {
          value: 120,
          deviation: {
            value: 32
          }
        }
      ])

      expect(statData.dataPaths).to.eql({
        summary: 'data.0.deviation',
        title: 'data.0'
      })
    })

    it('should format and return `timeInAuto` data', () => {
      const data = {
        automated: 100000,
        manual: 20000
      }

      const statData = stat.getStatData(data, commonStats.timeInAuto, opts)

      expect(statData.data).to.eql([
        {
          id: 'basalManual',
          value: 20000,
          title: 'Time In Loop Mode OFF',
          legendTitle: 'Manual'
        },
        {
          id: 'basal',
          value: 100000,
          title: 'Time In Loop Mode ON',
          legendTitle: 'Auto Mode'
        }
      ])

      expect(statData.total).to.eql({ value: 120000 })

      expect(statData.dataPaths).to.eql({
        summary: ['data', 1]
      })
    })

    it('should format and return `timeInRange` data', () => {
      const data = {
        veryLow: 10000,
        low: 20000,
        target: 30000,
        high: 40000,
        veryHigh: 50000
      }

      const statData = stat.getStatData(data, commonStats.timeInRange, opts)

      expect(statData.data).to.eql([
        {
          id: 'veryLow',
          value: 10000,
          title: 'Time Below Range',
          legendTitle: '<54'
        },
        {
          id: 'low',
          value: 20000,
          title: 'Time Below Range',
          legendTitle: '54-70'
        },
        {
          id: 'target',
          value: 30000,
          title: 'Time In Range',
          legendTitle: '70-180'
        },
        {
          id: 'high',
          value: 40000,
          title: 'Time Above Range',
          legendTitle: '180-250'
        },
        {
          id: 'veryHigh',
          value: 50000,
          title: 'Time Above Range',
          legendTitle: '>250'
        }
      ])

      expect(statData.total).to.eql({ value: 150000 })

      expect(statData.dataPaths).to.eql({
        summary: ['data', 2]
      })
    })

    it('should format and return `totalInsulin` data', () => {
      const data = {
        bolus: 9.123,
        basal: 6.892
      }

      const statData = stat.getStatData(data, commonStats.totalInsulin, opts)

      const expectStatDataData = [
        {
          id: 'bolus',
          value: 9.123,
          valueString: '9.1',
          units: 'U',
          title: 'Bolus'
        },
        {
          id: 'basal',
          value: 6.892,
          valueString: '6.9',
          units: 'U',
          title: 'Basal'
        }
      ]
      expect(statData.data, JSON.stringify({
        having: statData.data,
        expected: expectStatDataData
      })).to.eql(expectStatDataData)

      expect(statData.total).to.eql({ id: 'insulin', value: 16.015 })

      expect(statData.dataPaths).to.eql({
        summary: 'total',
        title: 'total'
      })
    })
  })

  describe('getStatTitle', () => {
    const defaultOpts = {
      manufacturer: 'medtronic'
    }

    const opts = overrides => _.assign({}, defaultOpts, overrides)

    const cbgOpts = opts({ bgSource: 'cbg' })
    const smbgOpts = opts({ bgSource: 'smbg' })
    const singleDayOpts = opts({ days: 1 })
    const multiDayOpts = opts({ days: 14 })

    describe('averageGlucose', () => {
      it('should return title for `averageGlucose` stat when bgSource is `smgb`', () => {
        expect(stat.getStatTitle(commonStats.averageGlucose, smbgOpts)).to.equal('Avg. Glucose (BGM)')
      })

      it('should return title for `averageGlucose` stat when bgSource is `cbg`', () => {
        expect(stat.getStatTitle(commonStats.averageGlucose, cbgOpts)).to.equal('Avg. Glucose (CGM)')
      })
    })

    describe('averageDailyDose', () => {
      it('should return title for `averageDailyDose` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.averageDailyDose, singleDayOpts)).to.equal('Total Insulin')
      })

      it('should return title for `averageDailyDose` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.averageDailyDose, multiDayOpts)).to.equal('Avg. Daily Insulin')
      })
    })

    describe('carbs', () => {
      it('should return title for `carbs` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.carbs, singleDayOpts)).to.equal('Total Carbs')
      })

      it('should return title for `carbs` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.carbs, multiDayOpts)).to.equal('Avg. Daily Carbs')
      })
    })

    describe('coefficientOfVariation', () => {
      it('should return title for `coefficientOfVariation` stat when bgSource is `smgb`', () => {
        expect(stat.getStatTitle(commonStats.coefficientOfVariation, smbgOpts)).to.equal('CV (BGM)')
      })

      it('should return title for `coefficientOfVariation` stat when bgSource is `cbg`', () => {
        expect(stat.getStatTitle(commonStats.coefficientOfVariation, cbgOpts)).to.equal('CV (CGM)')
      })
    })

    describe('glucoseManagementIndicator', () => {
      it('should return title for `glucoseManagementIndicator` stat when bgSource is `smgb`', () => {
        expect(stat.getStatTitle(commonStats.glucoseManagementIndicator, smbgOpts)).to.equal('GMI (BGM)')
      })

      it('should return title for `glucoseManagementIndicator` stat when bgSource is `cbg`', () => {
        expect(stat.getStatTitle(commonStats.glucoseManagementIndicator, cbgOpts)).to.equal('GMI (CGM)')
      })
    })

    describe('readingsInRange', () => {
      it('should return title for `readingsInRange` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.readingsInRange, singleDayOpts)).to.equal('Readings In Range')
      })

      it('should return title for `readingsInRange` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.readingsInRange, multiDayOpts)).to.equal('Avg. Daily Readings In Range')
      })
    })

    describe('sensorUsage', () => {
      it('should return title for `sensorUsage` stat', () => {
        expect(stat.getStatTitle(commonStats.sensorUsage)).to.equal('Sensor Usage')
      })
    })

    describe('standardDev', () => {
      it('should return title for `standardDev` stat when bgSource is `smgb`', () => {
        expect(stat.getStatTitle(commonStats.standardDev, smbgOpts)).to.equal('Std. Deviation (BGM)')
      })

      it('should return title for `standardDev` stat when bgSource is `cbg`', () => {
        expect(stat.getStatTitle(commonStats.standardDev, cbgOpts)).to.equal('Std. Deviation (CGM)')
      })
    })

    describe('timeInAuto', () => {
      it('should return title for `timeInAuto` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.timeInAuto, singleDayOpts)).to.equal('Time In Loop Mode')
      })

      it('should return title for `timeInAuto` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.timeInAuto, multiDayOpts)).to.equal('Avg. Daily Time In Loop Mode')
      })
    })

    describe('timeInRange', () => {
      it('should return title for `timeInRange` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.timeInRange, singleDayOpts)).to.equal('Time In Range')
      })

      it('should return title for `timeInRange` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.timeInRange, multiDayOpts)).to.equal('Avg. Daily Time In Range')
      })
    })

    describe('totalInsulin', () => {
      it('should return title for `totalInsulin` stat when viewing a single day of data', () => {
        expect(stat.getStatTitle(commonStats.totalInsulin, singleDayOpts)).to.equal('Total Insulin')
      })

      it('should return title for `totalInsulin` stat when viewing multiple days of data', () => {
        expect(stat.getStatTitle(commonStats.totalInsulin, multiDayOpts)).to.equal('Avg. Daily Total Insulin')
      })
    })
  })

  describe('getStatDefinition', () => {
    const data = { total: 10 }

    const opts = {
      manufacturer: 'medtronic',
      bgPrefs: {
        bgBounds: {
          veryHighThreshold: 250,
          targetUpperBound: 180,
          targetLowerBound: 70,
          veryLowThreshold: 54
        },
        bgUnits: MGDL_UNITS
      }
    }

    const commonStatProperties = [
      'annotations',
      'collapsible',
      'data',
      'dataFormat',
      'id',
      'title',
      'type'
    ]

    it('should define the `averageGlucose` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.averageGlucose, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.averageGlucose)
      expect(def.type).to.equal(statTypes.barBg)
      expect(def.dataFormat).to.eql({
        label: statFormats.bgValue,
        summary: statFormats.bgValue
      })
    })

    it('should define the `carbs` stat', () => {
      const data = {
        totalCarbsPerDay: 22
      }
      const def = stat.getStatDefinition(data, commonStats.carbs, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.carbs)
      expect(def.type).to.equal(statTypes.lines)
      expect(def.dataFormat).to.eql({
        summary: statFormats.carbs
      })
    })

    it('should define the `averageDailyDose` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.averageDailyDose, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.averageDailyDose)
      expect(def.alwaysShowSummary).to.be.true
      expect(def.type).to.equal(statTypes.input)
      expect(def.dataFormat).to.eql({
        output: statFormats.unitsPerKg,
        summary: statFormats.units
      })
    })

    it('should define the `coefficientOfVariation` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.coefficientOfVariation, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.coefficientOfVariation)
      expect(def.type).to.equal(statTypes.simple)
      expect(def.dataFormat).to.eql({
        summary: statFormats.cv
      })
    })

    it('should define the `glucoseManagementIndicator` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.glucoseManagementIndicator, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.glucoseManagementIndicator)
      expect(def.type).to.equal(statTypes.simple)
      expect(def.dataFormat).to.eql({
        summary: statFormats.gmi
      })
    })

    it('should define the `readingsInRange` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.readingsInRange, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.readingsInRange)
      expect(def.type).to.equal(statTypes.barBg)
      expect(def.dataFormat).to.eql({
        label: statFormats.bgCount,
        summary: statFormats.bgCount,
        tooltip: statFormats.percentage,
        tooltipTitle: statFormats.bgRange
      })
      expect(def.alwaysShowTooltips).to.be.true
    })

    it('should define the `sensorUsage` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.sensorUsage, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.sensorUsage)
      expect(def.type).to.equal(statTypes.simple)
      expect(def.dataFormat).to.eql({
        summary: statFormats.percentage
      })
    })

    it('should define the `standardDev` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.standardDev, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.standardDev)
      expect(def.type).to.equal(statTypes.barBg)
      expect(def.dataFormat).to.eql({
        label: statFormats.standardDevValue,
        summary: statFormats.standardDevValue,
        title: statFormats.standardDevRange
      })
    })

    it('should define the `timeInAuto` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.timeInAuto, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.timeInAuto)
      expect(def.type).to.equal(statTypes.wheel)
      expect(def.dataFormat).to.eql({
        label: statFormats.percentage,
        summary: statFormats.duration
      })
      expect(def.alwaysShowTooltips).to.be.true
    })

    it('should define the `timeInRange` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.timeInRange, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.timeInRange)
      expect(def.type).to.equal(statTypes.barBg)
      expect(def.dataFormat).to.eql({
        label: statFormats.percentage,
        summary: statFormats.percentage,
        tooltip: statFormats.duration,
        tooltipTitle: statFormats.bgRange
      })
      expect(def.alwaysShowTooltips).to.be.true
    })

    it('should define the `totalInsulin` stat', () => {
      const def = stat.getStatDefinition(data, commonStats.totalInsulin, opts)
      expect(def).to.include.all.keys(commonStatProperties)
      expect(def.id).to.equal(commonStats.totalInsulin)
      expect(def.type).to.equal(statTypes.noBar)
      expect(def.dataFormat).to.eql({
        label: statFormats.percentage,
        summary: statFormats.units,
        title: statFormats.units,
        tooltip: statFormats.units
      })
      expect(def.alwaysShowTooltips).to.be.true
    })
  })
})
