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

import React, { FunctionComponent, useEffect, useState } from 'react'
import _ from 'lodash'
import cx from 'classnames'
import styles from './stat.css'
import colors from '../../styles/colors.css'
import CollapseIconOpen from './assets/expand-more-24-px.svg'
import CollapseIconClose from './assets/chevron-right-24-px.svg'
import { StatTooltip } from 'dumb'
import { formatDecimalNumber } from '../../utils/format/format.util'
import { useTranslation } from 'react-i18next'
import { LBS_PER_KG } from '../../utils/constants/constants.utils'

enum StatFormats {
  cv = 'cv',
  gmi = 'gmi',
  percentage = 'percentage',
  units = 'units',
  unitsPerKg = 'unitsPerKg'
}

interface StatProps {
  alwaysShowTooltips: boolean
  alwaysShowSummary: boolean
  annotations: string[]
  collapsible: boolean
  data: {
    data: Datum[]
    total: Datum
    dataPaths: {
      input: string | []
      output: string | []
      summary: string | []
      title: string | []
    }
  }
  dataFormat: {
    label: StatFormats
    summary: StatFormats
    title: StatFormats
    tooltip: StatFormats
    tooltipTitle: StatFormats
  }
  emptyDataPlaceholder: string
  isOpened: boolean
  title: string
  type: string
  units: string | boolean
  hideToolTips: boolean
}

interface ChartState {
  showFooter: boolean
  isCollapsible: boolean
  isOpened: boolean
  isDisabled: boolean
  inputValue?: number
  inputSuffix?: string
}

interface Datum {
  id: string
  value: number
  title: string
}

enum StatTypes {
  input = 'input',
  simple = 'simple'
}

export const StatBoy: FunctionComponent<StatProps> = (
  {
    alwaysShowSummary = false,
    collapsible = false,
    emptyDataPlaceholder = '--',
    isOpened = true,
    type = StatTypes.simple,
    units = false,
    hideToolTips = false,
    ...props
  }) => {
  const {
    annotations,
    data,
    dataFormat,
    title
  } = props

  if (type !== 'simple' && type !== 'input') {
    console.error(`Invalid chart type ${type}`)
    throw Error(`Invalid chart type ${type}`)
  }

  const { t } = useTranslation('main')

  const [chartState, setChartState] = useState<ChartState>({
    showFooter: false,
    isCollapsible: false,
    isOpened: true,
    isDisabled: _.sum(_.map(data.data, d => _.get(d, 'deviation.value', d.value))) <= 0
  })

  const statClasses = cx({
    [styles.Stat]: true,
    [styles.isOpen]: chartState.isOpened
  })

  const computeChartState = (): void => {
    switch (type) {
      case 'input': {
        const input = _.get(props.data, props.data.dataPaths.input, {})
        setChartState({
          ...chartState,
          inputSuffix: _.get(chartState, 'inputSuffix', input.suffix),
          inputValue: input.value,
          isCollapsible: collapsible,
          isOpened: _.get(chartState, 'isOpened', isOpened),
          showFooter: isOpened
        })
        break
      }

      case 'simple':
        setChartState({
          ...chartState,
          isOpened: false,
          showFooter: false
        })
        break
    }
  }

  useEffect(() => {
    computeChartState()
  }, []) // Only for first render

  /**
   * classifyCvValue
   * @param {number} value - integer or float coefficient of variation (CV) value
   * @return {String} cvClassification - target, high
   */
  const classifyCvValue = (value: number): string => {
    if (value <= 36) {
      return 'target'
    }
    return 'high'
  }

  const formatDatum = (datum: { id?: string, value: number, suffix: string }, format: string): { id?: string, value: number | string, suffix: string } => {
    const id = datum.id
    const value: number | string = datum.value
    const suffix = datum.suffix || ''
    if (format !== StatFormats.cv && format !== StatFormats.gmi && format !== StatFormats.percentage && format !== StatFormats.unitsPerKg && format !== StatFormats.units) {
      return {
        id,
        value: datum.value,
        suffix
      }
    }
    if (format === StatFormats.cv && value >= 0) {
      return {
        id: classifyCvValue(value),
        value: formatDecimalNumber(value),
        suffix: '%'
      }
    }
    if (format === StatFormats.gmi && value >= 0) {
      return {
        id,
        value: formatDecimalNumber(value, 1),
        suffix: '%'
      }
    }

    const total = _.get(data, 'total.value')
    if (format === StatFormats.percentage && total && total >= 0) {
      const val = _.max([value, 0]) ?? 0
      const percentage = (val / total) * 100
      let precision = 0
      // We want to show extra precision on very small percentages so that we avoid showing 0%
      // when there is some data there.
      if (percentage > 0 && percentage < 0.5) {
        precision = percentage < 0.05 ? 2 : 1
      }
      return {
        id,
        value: formatDecimalNumber(percentage, precision),
        suffix: '%'
      }
    }

    if (format === StatFormats.unitsPerKg) {
      if (suffix === t('lb')) {
        const val = value * LBS_PER_KG
        if (val > 0 && _.isFinite(val)) {
          return {
            id,
            value: formatDecimalNumber(val, 2),
            suffix: t('U/kg')
          }
        }
      }
      if (value > 0 && _.isFinite(value)) {
        return {
          id,
          value: formatDecimalNumber(value, 2),
          suffix: t('U/kg')
        }
      }
      return {
        id: 'statDisabled',
        value: emptyDataPlaceholder,
        suffix: t('U/kg')
      }
    }

    if (format === StatFormats.units && value >= 0) {
      return {
        id,
        value: formatDecimalNumber(value, 1),
        suffix: t('U')
      }
    }

    return {
      id: 'statDisabled',
      value: emptyDataPlaceholder,
      suffix
    }
  }

  const getFormattedDataByDataPath = (path: string, format: string): { id?: string, value: number | string, suffix: string } => {
    const datum = _.get(data, path)
    return formatDatum(datum, format)
  }

  const getFormattedDataByKey = (key: string, format: StatFormats): { id?: string, value: number | string, suffix: string } => {
    const path = _.get(data, `dataPaths.${key}`)
    if (!path) {
      return { id: undefined, value: '', suffix: '' }
    }
    return getFormattedDataByDataPath(path, format)
  }

  const renderChartTitle = (): JSX.Element => {
    const titleData = getFormattedDataByKey('title', dataFormat.title)

    const titleDataValue = _.get(titleData, 'value')
    return (
      <div className={styles.chartTitle}>
        {title}
        {titleDataValue && titleDataValue !== emptyDataPlaceholder && (
          <span className={styles.chartTitleData}>
            (&nbsp;
            <span
              style={{
                color: titleData.id ? (colors[titleData.id] ?? colors.statDefault) : colors.statDefault
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
        {!hideToolTips && annotations && (
          <StatTooltip annotations={annotations} />
        )}
      </div>
    )
  }

  const renderStatUnits = (): JSX.Element => {
    return (
      <div className={styles.units}>
        {units}
      </div>
    )
  }

  const handleCollapse = (): void => {
    setChartState({
      ...chartState,
      isOpened: !chartState.isOpened
    })
    computeChartState()
  }

  const renderChartSummary = (): JSX.Element => {
    const summaryData = getFormattedDataByKey('summary', dataFormat.summary)
    const showSummary = alwaysShowSummary || !chartState.isOpened
    const summaryDataValue = _.get(summaryData, 'value')

    // console.log(summaryDataValue)
    return (
      <div className={styles.chartSummary}>
        {summaryDataValue && showSummary && (
          <div
            className={styles.summaryData}
            style={{
              color: summaryData.id ? (colors[summaryData.id] ?? colors.statDefault) : colors.statDefault
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

        {units && !chartState.showFooter && renderStatUnits()}

        {chartState.isCollapsible && (
          <div className={styles.chartCollapse}>
            <img
              src={chartState.isOpened ? CollapseIconOpen : CollapseIconClose}
              onClick={handleCollapse}
            />
          </div>
        )}
      </div>
    )
  }

  const renderStatHeader = (): JSX.Element => (
    <div className={styles.statHeader}>
      {renderChartTitle()}
      {renderChartSummary()}
    </div>
  )

  const renderWeight = (): JSX.Element => {
    const input = _.get(data, data.dataPaths.input)

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

  const computeCalculatedOutput = (outputPath: string | [], output: { type: string }, format: string): { value: number | string, suffix: string } => {
    if (outputPath && output) {
      if (!chartState.inputValue) {
        throw Error('chart state input value cannot be null')
      }
      switch (output.type) {
        case 'divisor': {
          if (!chartState.inputValue) {
            throw Error('chartState inputValue cannot be null')
          }
          const datum = {
            value: data.data[0].value / chartState.inputValue,
            suffix: _.get(chartState, 'inputSuffix.value.label', chartState.inputSuffix) ?? ''
          }
          const result = formatDatum(datum, format)
          return {
            value: result.value,
            suffix: result.suffix
          }
        }
        default: {
          const datum = {
            value: chartState.inputValue,
            suffix: _.get(chartState, 'inputSuffix.value.label', chartState.inputSuffix) ?? ''
          }
          if (!datum.suffix) {
            throw Error('Suffix cannot be null')
          }
          const result = formatDatum(datum, format)
          return {
            value: result.value,
            suffix: result.suffix
          }
        }
      }
    }
    return {
      value: emptyDataPlaceholder,
      suffix: ''
    }
  }

  const renderCalculatedOutput = (): JSX.Element => {
    const outputPath = _.get(data, 'dataPaths.output')
    const format = _.get(dataFormat, 'output')
    if (!format) {
      throw Error('Format should be defined')
    }

    const output = _.get(data, outputPath)
    const calc = computeCalculatedOutput(outputPath, output, format)

    console.log(calc)
    const label = _.get(output, 'label')

    const outputValueClasses = cx({
      [styles.outputValue]: true,
      [styles.outputValueDisabled]: calc.value === emptyDataPlaceholder
    })

    return (
      <div className={styles.outputWrapper}>
        {label && <div className={styles.outputLabel}>{label}</div>}
        <div className={styles.outputValueWrapper}>
          <span className={outputValueClasses}>
            {calc.value}
          </span>
          <span className={styles.outputSuffix}>
            {calc.suffix}
          </span>
        </div>
      </div>
    )
  }

  const renderStatFooter = (): JSX.Element => (
    <div className={styles.statFooter}>
      {type === StatTypes.input && renderCalculatedOutput()}
      {units && renderStatUnits()}
    </div>
  )

  return (
    <div className={styles.StatWrapper}>
      <div className={statClasses}>
        {renderStatHeader()}
        {type === StatTypes.input && renderWeight()}
        {chartState.showFooter && renderStatFooter()}
      </div>
    </div>
  )
}
