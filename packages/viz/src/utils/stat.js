import _ from 'lodash'
import i18next from 'i18next'
import { AUTOMATED_DELIVERY, SCHEDULED_DELIVERY } from './constants'
import { getPumpVocabulary } from './device'


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
    case commonStats.timeInAuto:
      if (days > 1) {
        annotations.push(t('**Time In Loop Mode:** Daily average of the time spent in automated basal delivery.'))
        annotations.push(t('compute-ndays-time-in-auto'))
      } else {
        annotations.push(t('**Time In Loop Mode:** Time spent in automated basal delivery.'))
        annotations.push(t('compute-oneday-time-in-auto'))
      }
      break

    default:
      break
  }

  if (data.insufficientData) {
    annotations.push(t('insufficient-data'))
  } else if (_.includes(bgStats, type)) {
    if (bgSource === 'smbg') {
      annotations.push(t('Derived from _**{{total}}**_ {{smbgLabel}} readings.', {
        total: data.total,
        smbgLabel: statBgSourceLabels.smbg
      }))
    }
  }

  return annotations
}

export const getStatData = (data, type, opts = {}) => {
  const vocabulary = getPumpVocabulary(opts.manufacturer)

  let statData = {
    raw: {
      days: opts.days,
      ...data
    }
  }

  switch (type) {
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
    case commonStats.timeInAuto:
      title = (days > 1)
        ? t('Avg. Daily Time In Loop Mode')
        : t('Time In Loop Mode')
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
