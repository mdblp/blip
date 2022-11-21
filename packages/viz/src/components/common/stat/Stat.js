/*
 * Copyright (c) 2022, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import bows from 'bows'
import cx from 'classnames'
import i18next from 'i18next'
import { SizeMe } from 'react-sizeme'
import { formatBgValue, formatDecimalNumber, formatPercentage } from '../../../utils/format'
import { formatDuration } from '../../../utils/datetime'
import { classifyBgValue, classifyCvValue, generateBgRangeLabels } from '../../../utils/bloodglucose'
import { LBS_PER_KG } from '../../../utils/constants'
import { statFormats, statTypes } from '../../../utils/stat'
import styles from './Stat.css'
import colors from '../../../styles/colors.css'
import { bgPrefsPropType } from '../../../propTypes'
import Lines from './Lines'
import NoBar from './NoBar'
import WheelPercent from './Wheel'
import CollapseIconOpen from './assets/expand-more-24-px.svg'
import CollapseIconClose from './assets/chevron-right-24-px.svg'
import InfoIcon from './assets/info-outline-24-px.svg'
import { StatTooltip } from 'dumb'

const t = i18next.t.bind(i18next)

const dataPathPropType = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.array
])

const datumPropType = PropTypes.shape({
  id: PropTypes.string,
  value: PropTypes.number.isRequired,
  title: PropTypes.string
})

const statFormatPropType = PropTypes.oneOf(_.values(statFormats))

class Stat extends React.Component {
  static propTypes = {
    alwaysShowTooltips: PropTypes.bool,
    alwaysShowSummary: PropTypes.bool,
    annotations: PropTypes.arrayOf(PropTypes.string),
    bgPrefs: bgPrefsPropType.isRequired,
    categories: PropTypes.object,
    chartHeight: PropTypes.number,
    collapsible: PropTypes.bool,
    data: PropTypes.shape({
      data: PropTypes.arrayOf(datumPropType).isRequired,
      total: datumPropType,
      dataPaths: PropTypes.shape({
        input: dataPathPropType,
        output: dataPathPropType,
        summary: dataPathPropType,
        title: dataPathPropType
      })
    }).isRequired,
    dataFormat: PropTypes.shape({
      label: statFormatPropType,
      summary: statFormatPropType,
      title: statFormatPropType,
      tooltip: statFormatPropType,
      tooltipTitle: statFormatPropType
    }).isRequired,
    emptyDataPlaceholder: PropTypes.string.isRequired,
    isDisabled: PropTypes.bool,
    isOpened: PropTypes.bool,
    legend: PropTypes.bool,
    muteOthersOnHover: PropTypes.bool,
    reverseLegendOrder: PropTypes.bool,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(_.keys(statTypes)),
    units: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    hideToolTips: PropTypes.bool
  }

  static defaultProps = {
    alwaysShowSummary: false,
    alwaysShowTooltips: true,
    animate: true,
    bgPrefs: {},
    categories: {},
    chartHeight: 0,
    collapsible: false,
    emptyDataPlaceholder: '--',
    isDisabled: false,
    isOpened: true,
    legend: false,
    muteOthersOnHover: true,
    type: statTypes.simple,
    units: false,
    hideToolTips: false
  }

  static displayName = 'Stat'

  constructor(props) {
    super(props)
    this.log = bows('Stat')

    this.state = this.getStateByType(props)
    this.chartProps = this.getChartPropsByType(props)
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState(() => this.getStateByType(nextProps))
    this.chartProps = this.getChartPropsByType(nextProps)
  }

  renderChartTitle = () => {
    const isDatumHovered = this.state.hoveredDatumIndex >= 0

    const titleData = isDatumHovered
      ? this.state.tooltipTitleData
      : this.getFormattedDataByKey('title')

    const titleDataValue = _.get(titleData, 'value')
    const { emptyDataPlaceholder, annotations, hideToolTips } = this.props
    return (
      <div className={styles.chartTitle}>
        {this.state.chartTitle}
        {titleDataValue && titleDataValue !== emptyDataPlaceholder && (
          <span className={styles.chartTitleData}>
            (&nbsp;
            <span
              style={{
                color: colors[titleData.id] || colors.statDefault
              }}
            >
              {titleData.value}
            </span>
            <span className={styles.chartTitleSuffix}>
              {titleData.suffix}
            </span>
            &nbsp;)
          </span>
        )}
        {!hideToolTips && annotations && !isDatumHovered && (
          <StatTooltip annotations={this.props.annotations}>
            <span
              className={styles.tooltipIcon}
            >
              <img
                data-testid="info-icon"
                src={InfoIcon}
                alt={t('img-alt-hover-for-more-info')}
              />
            </span>
          </StatTooltip>
        )}
      </div>
    )
  }

  renderChartSummary = () => {
    const summaryData = this.getFormattedDataByKey('summary')
    const showSummary = this.props.alwaysShowSummary || !this.state.isOpened
    const summaryDataValue = _.get(summaryData, 'value')

    return (
      <div className={styles.chartSummary}>
        {summaryDataValue && showSummary && (
          <div
            className={styles.summaryData}
            style={{
              color: colors[summaryData.id] || colors.statDefault
            }}
          >
            <span className={styles.summaryValue}>
              {summaryData.value}
            </span>
            <span className={styles.summarySuffix}>
              {summaryData.suffix}
            </span>
          </div>
        )}

        {this.props.units && !this.state.showFooter && this.renderStatUnits()}

        {this.state.isCollapsible && (
          <div className={styles.chartCollapse}>
            <img
              src={this.state.isOpened ? CollapseIconOpen : CollapseIconClose}
              onClick={this.handleCollapse}
            />
          </div>
        )}
      </div>
    )
  }

  renderStatUnits() {
    return (
      <div className={styles.units}>
        {this.props.units}
      </div>
    )
  }

  renderStatHeader = () => (
    <div className={styles.statHeader}>
      {this.renderChartTitle()}
      {this.renderChartSummary()}
    </div>
  )

  renderStatFooter = () => (
    <div className={styles.statFooter}>
      {this.props.type === statTypes.input && this.renderCalculatedOutput()}
      {this.props.units && this.renderStatUnits()}
    </div>
  )

  renderChart = size => {
    const { renderer: Renderer, ...chartProps } = this.chartProps

    return (
      <div className={styles.chartWrapper}>
        <Renderer {...chartProps} width={size.width || 298} />
      </div>
    )
  }

  renderWeight = () => {
    const input = _.get(this.props.data, this.props.data.dataPaths.input)

    return (
      <div className={styles.inputWrapper}>
        <div className={styles.inputlabel}>
          {input.label}
        </div>
        <div>
          <span className={styles.inputValue}>
            {input.value}
          </span>
          <span className={styles.units}>
            {input.suffix}
          </span>
        </div>
      </div>
    )
  }

  renderCalculatedOutput = () => {
    const outputPath = _.get(this.props.data, 'dataPaths.output')
    const format = _.get(this.props.dataFormat, 'output')
    const output = _.get(this.props.data, outputPath)

    const calc = {
      result: {
        value: this.props.emptyDataPlaceholder
      }
    }

    const label = _.get(output, 'label')

    const datum = {
      value: this.state.inputValue,
      suffix: _.get(this.state, 'inputSuffix.value.label', this.state.inputSuffix)
    }

    if (outputPath && output) {
      switch (output.type) {
        case 'divisor':
          calc.dividend = _.get(this.props.data, _.get(output, 'dataPaths.dividend'), {}).value
          datum.value = calc.dividend / datum.value
          calc.result = this.formatDatum(datum, format)
          break

        default:
          calc.result = this.formatDatum(datum, format)
          break
      }
    }

    const outputValueClasses = cx({
      [styles.outputValue]: true,
      [styles.outputValueDisabled]: calc.result.value === this.props.emptyDataPlaceholder
    })

    return (
      <div className={styles.outputWrapper}>
        {label && <div className={styles.outputLabel}>{label}</div>}
        <div className={styles.outputValueWrapper}>
          <span className={outputValueClasses}>
            {calc.result.value}
          </span>
          <span className={styles.outputSuffix}>
            {calc.result.suffix}
          </span>
        </div>
      </div>
    )
  }

  render() {
    const statClasses = cx({
      [styles.Stat]: true,
      [styles.isOpen]: this.state.isOpened
    })

    return (
      <div className={styles.StatWrapper}>
        <div ref={this.setStatRef} className={statClasses}>
          {this.renderStatHeader()}
          {this.chartProps.renderer &&
            <div className={styles.statMain}>
              <SizeMe render={({ size }) => (this.renderChart(size))} />
            </div>
          }
          {this.props.type === statTypes.input && this.renderWeight()}
          {this.state.showFooter && this.renderStatFooter()}
        </div>
      </div>
    )
  }

  getStateByType = props => {
    const { data } = props

    let isOpened
    let input

    const state = {
      showFooter: false,
      isCollapsible: false,
      isOpened: true,
      chartTitle: props.title,
      isDisabled: _.sum(_.map(data.data, d => _.get(d, 'deviation.value', d.value))) <= 0
    }

    switch (props.type) {
      case 'input':
        input = _.get(props.data, props.data.dataPaths.input, {})
        isOpened = _.get(this.state, 'isOpened', props.isOpened)
        state.inputSuffix = _.get(this.state, 'inputSuffix', input.suffix)
        state.inputValue = input.value
        state.isCollapsible = props.collapsible
        state.isOpened = isOpened
        state.showFooter = isOpened
        break

      case 'barBg':
        isOpened = _.get(this.state, 'isOpened', props.isOpened)
        state.isCollapsible = props.collapsible
        state.isOpened = isOpened
        break

      case 'simple':
        state.isOpened = false
        state.showFooter = false
        break
    }

    return state
  }

  getDefaultChartProps = props => {
    const { chartHeight, animate } = props

    return {
      animate: animate ? { duration: 300, onLoad: { duration: 0 } } : false,
      height: chartHeight,
      labels: d => formatPercentage(d.y),
      renderer: null,
      style: {
        data: {
          fill: d => colors[d.id] || colors.statDefault
        }
      }
    }
  }

  getChartPropsByType = props => {
    const { type, data } = props

    let total
    let value

    const chartProps = this.getDefaultChartProps(props)

    switch (type) {
      case 'wheel':
        total = _.get(data, 'total.value', 0)
        value = _.get(data, 'data[1].value', 0)
        chartProps.renderer = WheelPercent
        chartProps.className = styles.statWheelTimeInAuto
        chartProps.values = {
          on: Math.round(100 * value / total),
          off: 100 - Math.round(100 * value / total)
        }
        chartProps.rawValues = {
          on: this.formatDatum(data.data[1], props.dataFormat.summary).value,
          off: this.formatDatum(data.data[0], props.dataFormat.summary).value
        }
        break

      case 'noBar':
        chartProps.renderer = NoBar
        chartProps.data = data.data
        chartProps.id = props.id
        chartProps.animate = false
        break

      case 'lines':
        chartProps.renderer = Lines
        chartProps.data = data.data
        chartProps.id = props.id
        chartProps.animate = false
        break

      case 'simple':
      case 'input':
        break

      default:
        this.log.error(`Invalid chart type ${type}`)
        chartProps.height = 20
        chartProps.renderer = () => <div>{`Invalid chart type ${type}`}</div>
        break
    }

    return chartProps
  }

  setChartTitle = (datum = {}) => {
    let tooltipTitleData
    const { title = this.props.title } = datum
    const tooltipTitleFormat = _.get(this.props, 'dataFormat.tooltipTitle')

    if (tooltipTitleFormat && datum.index >= 0) {
      tooltipTitleData = this.getFormattedDataByDataPath(['data', datum.index], tooltipTitleFormat)
    }

    this.setState({
      chartTitle: title,
      tooltipTitleData
    })
  }

  getFormattedDataByDataPath = (path, format) => {
    const datum = _.get(this.props.data, path)
    return this.formatDatum(datum, format)
  }

  getFormattedDataByKey = key => {
    const path = _.get(this.props.data, `dataPaths.${key}`)
    const format = this.props.dataFormat[key]
    return this.getFormattedDataByDataPath(path, format)
  }

  getDatumColor = datum => {
    const { hoveredDatumIndex, isDisabled } = this.state
    const isMuted = this.props.muteOthersOnHover
      && hoveredDatumIndex >= 0
      && hoveredDatumIndex !== datum.eventKey

    let color = colors[datum.id] || colors.statDefault

    if (isDisabled || isMuted) {
      color = isDisabled ? colors.statDisabled : colors.muted
    }

    return color
  }

  formatDatum = (datum = {}, format) => {
    let id = datum.id
    let value = datum.value
    let suffix = datum.suffix || ''
    let deviation
    let lowerValue
    let lowerColorId
    let upperValue
    let upperColorId

    const total = _.get(this.props.data, 'total.value')
    const { bgPrefs, emptyDataPlaceholder } = this.props
    const { bgBounds } = bgPrefs

    function disableStat() {
      id = 'statDisabled'
      value = emptyDataPlaceholder
    }

    switch (format) {
      case statFormats.bgCount:
        if (value >= 0) {
          const precision = value < 0.05 ? 2 : 1
          // Note: the + converts the rounded, fixed string back to a number
          // This allows 2.67777777 to render as 2.7 and 3.0000001 to render as 3 (not 3.0)
          value = +value.toFixed(precision)
        } else {
          disableStat()
        }
        break

      case statFormats.bgRange:
        value = generateBgRangeLabels(bgPrefs, { condensed: true })[id]
        break

      case statFormats.bgValue:
        if (value >= 0) {
          id = classifyBgValue(bgBounds, value)
          value = formatBgValue(value, bgPrefs)
        } else {
          disableStat()
        }
        break

      case statFormats.carbs:
        if (value >= 0) {
          value = datum.valueString
          suffix = datum.units
        } else {
          disableStat()
        }
        break

      case statFormats.cv:
        if (value >= 0) {
          id = classifyCvValue(value)
          value = formatDecimalNumber(value)
          suffix = '%'
        } else {
          disableStat()
        }
        break

      case statFormats.duration:
        if (value >= 0) {
          value = formatDuration(value, { condensed: true })
        } else {
          disableStat()
        }
        break

      case statFormats.gmi:
        if (value >= 0) {
          value = formatDecimalNumber(value, 1)
          suffix = '%'
        } else {
          disableStat()
        }
        break

      case statFormats.percentage:
        if (total && total >= 0) {
          value = _.max([value, 0])
          const percentage = (value / total) * 100
          let precision = 0
          // We want to show extra precision on very small percentages so that we avoid showing 0%
          // when there is some data there.
          if (percentage > 0 && percentage < 0.5) {
            precision = percentage < 0.05 ? 2 : 1
          }
          value = formatDecimalNumber(percentage, precision)
          suffix = '%'
        } else {
          disableStat()
        }
        break

      case statFormats.standardDevRange:
        deviation = _.get(datum, 'deviation.value', -1)
        if (value >= 0 && deviation >= 0) {
          lowerValue = value - deviation
          lowerColorId = lowerValue >= 0
            ? classifyBgValue(bgBounds, lowerValue)
            : 'low'

          upperValue = value + deviation
          upperColorId = classifyBgValue(bgBounds, upperValue)

          value = (
            <span>
              <span style={{
                color: colors[lowerColorId]
              }}>
                {formatBgValue(value - deviation, bgPrefs)}
              </span>
            &nbsp;-&nbsp;
              <span style={{
                color: colors[upperColorId]
              }}>
                {formatBgValue(value + deviation, bgPrefs)}
              </span>
            </span>
          )
        } else {
          disableStat()
        }
        break

      case statFormats.standardDevValue:
        if (value >= 0) {
          value = formatBgValue(value, bgPrefs)
        } else {
          disableStat()
        }
        break

      case statFormats.units:
        if (value >= 0) {
          value = formatDecimalNumber(value, 1)
          suffix = t('U')
        } else {
          disableStat()
        }
        break

      case statFormats.unitsPerKg:
        if (suffix === t('lb')) {
          value = value * LBS_PER_KG
        }
        suffix = t('U/kg')
        if (value > 0 && _.isFinite(value)) {
          value = formatDecimalNumber(value, 2)
        } else {
          disableStat()
        }
        break

      default:
        break
    }

    return {
      id,
      value,
      suffix
    }
  }

  handleCollapse = () => {
    this.setState(state => ({
      isOpened: !state.isOpened
    }), () => this.setState(this.getStateByType(this.props)))
  }

}

export default Stat
