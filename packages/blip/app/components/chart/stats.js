import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import bows from 'bows'
import { utils as vizUtils } from 'tidepool-viz'
import {
  AverageDailyDoseStat,
  CBGMeanStat,
  CBGStandardDeviation,
  CBGStatType,
  LoopModeStat,
  SimpleStat,
  TotalCarbsStat,
  TotalInsulinStat
} from 'dumb'
import { BG_DATA_TYPES } from '../../core/constants'
import Divider from '@mui/material/Divider'

const WEIGHT_PARAM = 'WEIGHT'
const WEIGHT_PARAM_DEFAULT_VALUE = -1

class Stats extends React.Component {
  static propTypes = {
    bgPrefs: PropTypes.object.isRequired,
    bgSource: PropTypes.oneOf(BG_DATA_TYPES),
    chartPrefs: PropTypes.object,
    chartType: PropTypes.oneOf(['daily', 'bgLog', 'trends', 'deviceUsage', 'patientStatistics']).isRequired,
    dataUtil: PropTypes.object.isRequired,
    endpoints: PropTypes.arrayOf(PropTypes.string),
    loading: PropTypes.bool.isRequired,
    parametersConfig: PropTypes.array
  }

  constructor(props) {
    super(props)
    this.log = bows('Stats')

    this.bgPrefs = {
      bgUnits: this.props.bgPrefs.bgUnits,
      bgBounds: vizUtils.bg.reshapeBgClassesToBgBounds(this.props.bgPrefs)
    }

    this.updateDataUtilEndpoints(this.props)

    this.state = {
      stats: this.getStatsByChartType(this.props)
    }
  }

  componentDidUpdate(prevProps) {
    const update = this.updatesRequired(prevProps)
    if (update) {
      if (update.dataChanged) {
        this.updateDataUtilEndpoints()
        this.updateStatData()
        this.setState({
          stats: this.getStatsByChartType()
        })
      } else if (update.stats) {
        this.setState({
          stats: this.getStatsByChartType()
        })
      } else if (update.endpoints) {
        this.updateDataUtilEndpoints()
        this.updateStatData()
      } else if (update.activeDays) {
        this.updateStatData()
      }
    }
  }
  updatesRequired(prevProps) {
    const {
      bgSource,
      chartType,
      endpoints,
      loading
    } = prevProps

    const prevActiveDays = _.get(prevProps, `chartPrefs.${chartType}`, null)
    const currActiveDays = _.get(this.props, `chartPrefs.${chartType}`, null)

    const activeDaysChanged = !_.isEqual(prevActiveDays, currActiveDays)
    const bgSourceChanged = _.isString(bgSource) && !_.isEqual(bgSource, this.props.bgSource)
    const endpointsChanged = _.isArray(endpoints) && !_.isEqual(endpoints, this.props.endpoints)
    const dataChanged = loading === true && this.props.loading === false

    return activeDaysChanged || bgSourceChanged || endpointsChanged || dataChanged
      ? {
        activeDays: activeDaysChanged,
        endpoints: endpointsChanged,
        stats: bgSourceChanged,
        dataChanged
      }
      : false
  }

  getStatElementById(stat, bgClasses) {
    const { parametersConfig } = this.props
    switch (stat.id) {
      case CBGStatType.TimeInAuto:
        return (
          <LoopModeStat
            annotations={stat.annotations}
            automated={stat.data.raw.automated}
            manual={stat.data.raw.manual}
            title={stat.title}
            total={stat.data.total.value}
          />
        )
      case CBGStatType.TotalInsulin:
        return (
          <TotalInsulinStat
            annotations={stat.annotations}
            data={stat.data.data}
            title={stat.title}
            total={Math.round(stat.data.total.value * 10) / 10}
          />
        )
      case CBGStatType.Carbs:
        return (
          <TotalCarbsStat
            annotations={stat.annotations}
            foodCarbs={stat.data.raw.foodCarbs}
            title={stat.title}
            totalCarbs={stat.data.raw.totalCarbs}
          />
        )
      case CBGStatType.AverageGlucose:
        return (
          <CBGMeanStat
            bgClasses={bgClasses}
            title={stat.title}
            tooltipValue={stat.annotations[0]}
            units={stat.units}
            value={Math.round(stat.data.raw.averageGlucose)}
          />
        )
      case CBGStatType.StandardDeviation:
        return (
          <CBGStandardDeviation
            annotations={stat.annotations}
            averageGlucose={Math.round(stat.data.raw.averageGlucose)}
            bgClasses={bgClasses}
            standardDeviation={Math.round(stat.data.raw.standardDeviation)}
            title={stat.title}
            units={stat.units}
          />
        )
      case CBGStatType.AverageDailyDose: {
        const weightParam = parametersConfig?.find(param => param.name === WEIGHT_PARAM)
        const weight = weightParam ? Number(weightParam?.value) : WEIGHT_PARAM_DEFAULT_VALUE
        return (
          <AverageDailyDoseStat
            annotations={stat.annotations}
            dailyDose={stat.data.data[0].value}
            footerLabel={stat.data.data[0].output.label}
            title={stat.title}
            weight={weight}
            weightSuffix={stat.data.data[0].input.suffix}
          />
        )
      }
      default: {
        if (stat.type !== vizUtils.stat.statTypes.simple) {
          throw Error(`Unexpected stat id ${stat.id} and type ${stat.type}`)
        }
        return (
          <SimpleStat
            annotations={stat.annotations}
            summaryFormat={stat.dataFormat.summary}
            title={stat.title}
            total={stat.data.total?.value}
            value={stat.data.data[0].value}
          />
        )
      }
    }
  }

  renderStats(stats) {
    const { bgPrefs } = this.props
    const bgClasses = {
      high: bgPrefs.bgClasses.high,
      low: bgPrefs.bgClasses.low,
      target: bgPrefs.bgClasses.target,
      veryLow: bgPrefs.bgClasses.veryLow
    }
    return stats.map(stat => {
      return (
        <div key={stat.id} data-testid={`stat-${stat.id}`}>
          {this.getStatElementById(stat, bgClasses)}
          <Divider sx={{ marginBlock: '8px', backgroundColor: '#757575' }} />
        </div>
      )
    })
  }

  render() {
    return (
      <div className="Stats" data-testid="stats-widgets">
        {this.renderStats(this.state.stats)}
      </div>
    )
  }

  getStatsByChartType() {
    const {
      chartType,
      dataUtil,
      bgSource
    } = this.props

    const { commonStats } = vizUtils.stat
    const { bgBounds, bgUnits, days, latestPump } = dataUtil
    const { manufacturer, deviceModel } = latestPump
    const isAutomatedBasalDevice = vizUtils.device.isAutomatedBasalDevice(manufacturer, deviceModel)

    const stats = []

    const addStat = statType => {
      const chartStatOpts = _.get(this.props, `chartPrefs.${chartType}.${statType}`)

      const stat = vizUtils.stat.getStatDefinition(dataUtil[vizUtils.stat.statFetchMethods[statType]](), statType, {
        bgSource,
        days,
        bgPrefs: {
          bgBounds,
          bgUnits
        },
        manufacturer,
        ...chartStatOpts
      })

      stats.push(stat)
    }


    switch (chartType) {
      case 'daily':
        isAutomatedBasalDevice && addStat(commonStats.timeInAuto)
        break

      case 'patientStatistics':
        isAutomatedBasalDevice && addStat(commonStats.timeInAuto)
        break
    }

    return stats
  }

  updateDataUtilEndpoints() {
    const {
      dataUtil,
      endpoints
    } = this.props

    dataUtil.endpoints = endpoints
  }

  updateStatData() {
    const { bgSource, dataUtil } = this.props
    const stats = this.state.stats

    const { bgBounds, bgUnits, days, latestPump } = dataUtil
    const { manufacturer } = latestPump

    _.forEach(stats, (stat, i) => {
      const data = dataUtil[vizUtils.stat.statFetchMethods[stat.id]]()
      const opts = {
        bgSource: bgSource,
        bgPrefs: {
          bgBounds,
          bgUnits
        },
        days,
        manufacturer
      }

      stats[i].data = vizUtils.stat.getStatData(data, stat.id, opts)
      stats[i].annotations = vizUtils.stat.getStatAnnotations(data, stat.id, opts)
      stats[i].title = vizUtils.stat.getStatTitle(stat.id, opts)
    })

    this.setState({ stats })
  }
}

export default Stats
