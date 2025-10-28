import _ from 'lodash'
import i18next from 'i18next'

import { generateBgRangeLabels } from './bloodglucose'
import { AUTOMATED_DELIVERY, SCHEDULED_DELIVERY } from './constants'
import { getPumpVocabulary } from './device'
import { formatDecimalNumber } from './format'

const t = i18next.t.bind(i18next)

export const dailyDoseUnitOptions = [
  {
    label: t('kg'),
    value: 'kg'
  },
  {
    label: t('lb'),
    value: 'lb'
  }
]

export const statTypes = {
  barBg: 'barBg',
  noBar: 'noBar',
  lines: 'lines',
  wheel: 'wheel',
  input: 'input',
  simple: 'simple'
}

export const statBgSourceLabels = {
  get cbg() {
    return t('CGM')
  },
  get smbg() {
    return t('BGM')
  }
}

export const statFormats = {
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
}

export const commonStats = {
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
}

export const statFetchMethods = {
  [commonStats.averageGlucose]: 'getAverageGlucoseData',
  [commonStats.averageDailyDose]: 'getTotalInsulinAndWeightData',
  [commonStats.carbs]: 'getCarbsData',
  [commonStats.coefficientOfVariation]: 'getCoefficientOfVariationData',
  [commonStats.glucoseManagementIndicator]: 'getGlucoseManagementIndicatorData',
  [commonStats.readingsInRange]: 'getReadingsInRangeData',
  [commonStats.sensorUsage]: 'getSensorUsage',
  [commonStats.standardDev]: 'getStandardDevData',
  [commonStats.timeInAuto]: 'getTimeInAutoData',
  [commonStats.timeInRange]: 'getTimeInRangeData',
  [commonStats.totalInsulin]: 'getBasalBolusData'
}

export const getSum = data => _.sum(_.map(data, d => _.max([d.value, 0])))

export const ensureNumeric = value => (_.isNil(value) || _.isNaN(value) ? -1 : Number.parseFloat(value))

export const getStatAnnotations = (data, type, opts = {}) => {
  const { bgSource, days } = opts

  const annotations = []

  const bgStats = [
    commonStats.averageGlucose,
    commonStats.coefficientOfVariation,
    commonStats.glucoseManagementIndicator,
    commonStats.readingsInRange,
    commonStats.timeInRange,
    commonStats.standardDev
  ]

  switch (type) {

    case commonStats.averageDailyDose:
      if (days > 1) {
        annotations.push(t('**Avg. Daily Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view.'))
      } else {
        annotations.push(t('**Daily Insulin:** All basal and bolus insulin delivery (in Units) added together.'))
      }
      break

    case commonStats.readingsInRange:
      annotations.push(t('**Readings In Range:** Daily average of the number of {{smbgLabel}} readings.', { smbgLabel: statBgSourceLabels.smbg }))
      break


    case commonStats.timeInAuto:
      if (days > 1) {
        annotations.push(t('**Time In Loop Mode:** Daily average of the time spent in automated basal delivery.'))
        annotations.push(t('compute-ndays-time-in-auto'))
      } else {
        annotations.push(t('**Time In Loop Mode:** Time spent in automated basal delivery.'))
        annotations.push(t('compute-oneday-time-in-auto'))
      }
      break

    case commonStats.timeInRange:
      annotations.push(t('**Time In Range:** Time spent in range, based on {{cbgLabel}} readings.', { cbgLabel: statBgSourceLabels.cbg }))
      annotations.push(t('compute-oneday-time-in-range', { cbgLabel: statBgSourceLabels.cbg }))
      break

    case commonStats.totalInsulin:
      if (days > 1) {
        annotations.push(t('**Total Insulin:** All basal and bolus insulin delivery (in Units) added together, divided by the number of days in this view'))
      } else {
        annotations.push(t('**Total Insulin:** All basal and bolus insulin delivery (in Units) added together'))
      }
      break

    default:
      break
  }

  if (data.insufficientData) {
    annotations.push(t('insufficient-data'))
  } else if (_.includes(bgStats, type)) {
    if (bgSource === 'smbg') {
      annotations.push(t('Derived from _**{{total}}**_ {{smbgLabel}} readings.', { total: data.total, smbgLabel: statBgSourceLabels.smbg }))
    }
  }

  return annotations
}

export const getStatData = (data, type, opts = {}) => {
  const vocabulary = getPumpVocabulary(opts.manufacturer)
  const bgRanges = generateBgRangeLabels(opts.bgPrefs, { condensed: true })

  let statData = {
    raw: {
      days: opts.days,
      ...data
    }
  }

  switch (type) {
    case commonStats.averageGlucose:
      statData.data = [
        {
          value: ensureNumeric(data.averageGlucose)
        }
      ]

      statData.dataPaths = {
        summary: 'data.0'
      }
      break

    case commonStats.averageDailyDose:
      statData.data = [
        {
          id: 'insulin',
          input: {
            id: 'weight',
            label: t('Weight'),
            suffix: _.get(data, 'weight.unit', 'kg'),
            type: 'number',
            value: ensureNumeric(_.get(data, 'weight.value'))
          },
          output: {
            label: t('Daily Dose ÷ Weight'),
            type: 'divisor',
            dataPaths: {
              dividend: 'data.0'
            }
          },
          value: ensureNumeric(data.totalInsulin)
        }
      ]

      statData.dataPaths = {
        input: 'data.0.input',
        output: 'data.0.output',
        summary: 'data.0'
      }
      break

    case commonStats.carbs:
      statData.data = [
        {
          id: 'total-carbs',
          value: data.totalCarbsPerDay,
          valueString: formatDecimalNumber(data.totalCarbsPerDay),
          units: t('g'),
          name: 'title', // Not use, to make propstype happy
          displayLine: false
        }
      ]

      statData.dataPaths = {
        summary: 'data.0'
      }
      break

    case commonStats.coefficientOfVariation:
      statData.data = [
        {
          id: 'cv',
          value: ensureNumeric(data.coefficientOfVariation)
        }
      ]

      statData.dataPaths = {
        summary: 'data.0'
      }
      break

    case commonStats.glucoseManagementIndicator:
      statData.data = [
        {
          id: 'gmi',
          value: ensureNumeric(data.glucoseManagementIndicator)
        }
      ]

      statData.dataPaths = {
        summary: 'data.0'
      }
      break

    case commonStats.readingsInRange:
      statData.data = [
        {
          id: 'veryLow',
          value: ensureNumeric(data.veryLow),
          title: t('Readings Below Range'),
          legendTitle: bgRanges.veryLow
        },
        {
          id: 'low',
          value: ensureNumeric(data.low),
          title: t('Readings Below Range'),
          legendTitle: bgRanges.low
        },
        {
          id: 'target',
          value: ensureNumeric(data.target),
          title: t('Readings In Range'),
          legendTitle: bgRanges.target
        },
        {
          id: 'high',
          value: ensureNumeric(data.high),
          title: t('Readings Above Range'),
          legendTitle: bgRanges.high
        },
        {
          id: 'veryHigh',
          value: ensureNumeric(data.veryHigh),
          title: t('Readings Above Range'),
          legendTitle: bgRanges.veryHigh
        }
      ]

      statData.total = { value: getSum(statData.data) }
      statData.dataPaths = {
        summary: [
          'data',
          _.findIndex(statData.data, { id: 'target' })
        ]
      }
      break

    case commonStats.sensorUsage:
      statData.data = [
        {
          value: ensureNumeric(data.sensorUsage)
        }
      ]
      statData.total = { value: ensureNumeric(data.total) }
      statData.dataPaths = {
        summary: 'data.0'
      }
      break

    case commonStats.standardDev:
      statData.data = [
        {
          value: ensureNumeric(data.averageGlucose),
          deviation: {
            value: ensureNumeric(data.standardDeviation)
          }
        }
      ]

      statData.dataPaths = {
        summary: 'data.0.deviation',
        title: 'data.0'
      }
      break

    case commonStats.timeInAuto:
      statData.data = [
        {
          id: 'basalManual',
          value: ensureNumeric(data.manual),
          title: t('Time In Loop Mode OFF'),
          legendTitle: vocabulary[SCHEDULED_DELIVERY]
        },
        {
          id: 'basal',
          value: ensureNumeric(data.automated),
          title: t('Time In Loop Mode ON'),
          legendTitle: vocabulary[AUTOMATED_DELIVERY]
        }
      ]

      statData.total = { value: getSum(statData.data) }
      statData.dataPaths = {
        summary: [
          'data',
          _.findIndex(statData.data, { id: 'basal' })
        ]
      }
      break

    case commonStats.timeInRange:
      statData.data = [
        {
          id: 'veryLow',
          value: ensureNumeric(data.veryLow),
          title: t('Time Below Range'),
          legendTitle: bgRanges.veryLow
        },
        {
          id: 'low',
          value: ensureNumeric(data.low),
          title: t('Time Below Range'),
          legendTitle: bgRanges.low
        },
        {
          id: 'target',
          value: ensureNumeric(data.target),
          title: t('Time In Range'),
          legendTitle: bgRanges.target
        },
        {
          id: 'high',
          value: ensureNumeric(data.high),
          title: t('Time Above Range'),
          legendTitle: bgRanges.high
        },
        {
          id: 'veryHigh',
          value: ensureNumeric(data.veryHigh),
          title: t('Time Above Range'),
          legendTitle: bgRanges.veryHigh
        }
      ]

      statData.total = { value: getSum(statData.data) }
      statData.dataPaths = {
        summary: [
          'data',
          _.findIndex(statData.data, { id: 'target' })
        ]
      }
      break

    case commonStats.totalInsulin:
      statData.data = [
        {
          id: 'bolus',
          value: ensureNumeric(data.bolus),
          valueString: formatDecimalNumber(ensureNumeric(data.bolus), 1),
          units: t('U'),
          title: t('Bolus')
        },
        {
          id: 'basal',
          value: ensureNumeric(data.basal),
          valueString: formatDecimalNumber(ensureNumeric(data.basal), 1),
          units: t('U'),
          title: t('Basal')
        }
      ]
      statData.total = { id: 'insulin', value: getSum(statData.data) }
      statData.dataPaths = {
        summary: 'total',
        title: 'total'
      }
      break

    default:
      statData = undefined
      break
  }

  return statData
}

export const getStatTitle = (type, opts = {}) => {
  const { days } = opts

  let title

  switch (type) {
    case commonStats.averageDailyDose:
      title = (days > 1) ? t('Avg. Daily Insulin') : t('Total Insulin')
      break

    case commonStats.carbs:
      title = (days > 1) ? t('Avg. Daily Carbs') : t('Total Carbs')
      break

    case commonStats.readingsInRange:
      title = (days > 1) ? t('Avg. Daily Readings In Range') : t('Readings In Range')
      break

    case commonStats.timeInAuto:
      title = t('Time In Loop Mode')
      break

    case commonStats.timeInRange:
      title = t('Time In Range')
      break

    case commonStats.totalInsulin:
      title = (days > 1) ? t('Avg. Daily Total Insulin') : t('Total Insulin')
      break

    default:
      title = ''
      break
  }

  return title
}

export const getStatDefinition = (data, type, opts = {}) => {
  let stat = {
    annotations: getStatAnnotations(data, type, opts),
    collapsible: false,
    data: getStatData(data, type, opts),
    id: type,
    title: getStatTitle(type, opts),
    type: statTypes.barBg
  }

  switch (type) {
    case commonStats.averageGlucose:
      stat.dataFormat = {
        label: statFormats.bgValue,
        summary: statFormats.bgValue
      }
      stat.type = statTypes.barBg
      stat.units = _.get(opts, 'bgPrefs.bgUnits')
      break

    case commonStats.averageDailyDose:
      stat.alwaysShowSummary = true
      stat.dataFormat = {
        output: statFormats.unitsPerKg,
        summary: statFormats.units
      }
      stat.type = statTypes.input
      break

    case commonStats.carbs:
      stat.dataFormat = {
        summary: statFormats.carbs
      }
      stat.type = statTypes.lines
      stat.alwaysShowSummary = true
      break

    case commonStats.coefficientOfVariation:
      stat.dataFormat = {
        summary: statFormats.cv
      }
      stat.type = statTypes.simple
      break

    case commonStats.glucoseManagementIndicator:
      stat.dataFormat = {
        summary: statFormats.gmi
      }
      stat.type = statTypes.simple
      break

    case commonStats.readingsInRange:
      stat.alwaysShowTooltips = true
      stat.dataFormat = {
        label: statFormats.bgCount,
        summary: statFormats.bgCount,
        tooltip: statFormats.percentage,
        tooltipTitle: statFormats.bgRange
      }
      stat.legend = true
      stat.reverseLegendOrder = true
      stat.units = _.get(opts, 'bgPrefs.bgUnits')
      break

    case commonStats.sensorUsage:
      stat.dataFormat = {
        summary: statFormats.percentage
      }
      stat.type = statTypes.simple
      break

    case commonStats.standardDev:
      stat.dataFormat = {
        label: statFormats.standardDevValue,
        summary: statFormats.standardDevValue,
        title: statFormats.standardDevRange
      }
      stat.type = statTypes.barBg
      stat.units = _.get(opts, 'bgPrefs.bgUnits')
      break

    case commonStats.timeInAuto:
      stat.alwaysShowTooltips = true
      stat.dataFormat = {
        label: statFormats.percentage,
        summary: statFormats.duration
      }
      stat.legend = false
      stat.type = statTypes.wheel
      break

    case commonStats.timeInRange:
      stat.alwaysShowTooltips = true
      stat.dataFormat = {
        label: statFormats.percentage,
        summary: statFormats.percentage,
        tooltip: statFormats.duration,
        tooltipTitle: statFormats.bgRange
      }
      stat.legend = true
      stat.reverseLegendOrder = true
      stat.units = _.get(opts, 'bgPrefs.bgUnits')
      break

    case commonStats.totalInsulin:
      stat.alwaysShowTooltips = true
      stat.dataFormat = {
        label: statFormats.percentage,
        summary: statFormats.units,
        title: statFormats.units,
        tooltip: statFormats.units
      }
      stat.legend = true
      stat.type = statTypes.noBar
      break

    default:
      stat = undefined
      break
  }

  return stat
}
