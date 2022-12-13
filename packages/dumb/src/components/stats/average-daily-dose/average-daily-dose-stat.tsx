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

import React, { FunctionComponent } from 'react'
import _ from 'lodash'
import cx from 'classnames'
import styles from './average-daily-dose-stat.css'
import { formatDecimalNumber } from '../../../utils/format/format.util'
import { useTranslation } from 'react-i18next'
import { ChartTitle } from '../common/chart-title'
import { ChartSummary } from '../common/chart-summary'
import { ParameterConfig } from 'medical-domain'
import { StatFormats } from '../../../models/stats.model'

interface StatProps {
  alwaysShowSummary: boolean
  annotations: string[]
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
  units: string | boolean
  showToolTip: boolean
  parametersConfig: ParameterConfig[]
}

interface Datum {
  id: string
  value: number
  title: string
}

export const AverageDailyDoseStat: FunctionComponent<StatProps> = (
  {
    alwaysShowSummary = false,
    emptyDataPlaceholder = '--',
    isOpened = true,
    units = false,
    showToolTip = true,
    ...props
  }) => {
  const {
    annotations,
    data,
    dataFormat,
    title,
    parametersConfig
  } = props

  const { t } = useTranslation('main')

  const input = _.get(data, data.dataPaths.input, {})
  input.value = parametersConfig.find(param => param.name === 'WEIGHT')?.value ?? -1

  const statClasses = cx({
    [styles.Stat]: true,
    [styles.isOpen]: isOpened
  })

  const formatDatum = (datum: { id?: string, value: number, suffix: string }, format: string): { className?: string, value: string, suffix: string } => {
    const value: number | string = datum.value
    const suffix = datum.suffix || ''

    if (format === StatFormats.unitsPerKg) {
      if (value > 0 && _.isFinite(value)) {
        return {
          value: formatDecimalNumber(value, 2),
          suffix: t('U/kg')
        }
      }
      return {
        className: styles.statDisabled,
        value: emptyDataPlaceholder,
        suffix: t('U/kg')
      }
    }

    if (format === StatFormats.units && value >= 0) {
      return {
        className: styles.insulinTitle,
        value: formatDecimalNumber(value, 1),
        suffix: t('U')
      }
    }
    return {
      className: styles.statDisabled,
      value: emptyDataPlaceholder,
      suffix
    }
  }

  const getFormattedDataByKey = (key: string, format: StatFormats): { className?: string, value: string, suffix: string } => {
    const path = _.get(data, `dataPaths.${key}`)
    if (!path) {
      return { value: '', suffix: '' }
    }
    const datum = _.get(data, path)
    return formatDatum(datum, format)
  }

  const computeCalculatedOutput = (outputPath: string | [], output: { type: string }, format: string): { value: string, suffix: string } => {
    if (outputPath && output) {
      const datum = {
        value: data.data[0].value / input.value,
        suffix: input.value.label ?? ''
      }
      const datumFormatted = formatDatum(datum, format)
      return {
        suffix: datumFormatted.suffix,
        value: datumFormatted.value
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

  const titleData = getFormattedDataByKey('title', dataFormat.title)
  const summaryData = getFormattedDataByKey('summary', dataFormat.summary)
  return (
    <div className={styles.StatWrapper}>
      <div className={statClasses}>
        <div className={styles.statHeader}>
          <ChartTitle
            annotations={annotations}
            className={titleData.className}
            emptyDataPlaceholder={emptyDataPlaceholder}
            showToolTip={showToolTip}
            title={title}
            suffix={titleData.suffix}
            value={titleData.value}
          />
          <ChartSummary
            className={summaryData.className}
            isOpened={isOpened}
            suffix={summaryData.suffix}
            showSummary={alwaysShowSummary || !isOpened}
            units={units}
            value={summaryData.value}
          />
        </div>
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
        {isOpened &&
          <div className={styles.statFooter}>
            {renderCalculatedOutput()}
            {units &&
              <div className={styles.units}>
                {units}
              </div>
            }
          </div>
        }
      </div>
    </div>
  )
}
