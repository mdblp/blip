/*
 * Copyright (c) 2023, Diabeloop
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
import styles from '../diabeloop.css'
import { TimePrefs, Unit } from 'medical-domain'
// import { Row, TableProps } from '../table'
import { useTranslation } from 'react-i18next'
import moment from 'moment-timezone'
import { getLongDayHourFormat } from '../../../utils/datetime/datetime.util'
import { formatParameterValue } from '../../../utils/format/format.util'
import _ from 'lodash'
import { HistoryTableHeader } from './history-table-header'

interface Parameter {
  changeType: string
  name: string
  value: string
  unit: Unit
  level: number
  effectiveDate: string
  parameterDate: string
  previousUnit: Unit
  previousValue: string
  parameterChange: JSX.Element
  valueChange: JSX.Element
}

interface IncomeParameter {
  changeType: string
  effectiveDate: string
  level: number
  name: string
  unit: string
  value: string
}

interface IncomingRow {
  changeDate: string
  parameters: Parameter[]
}

interface HistorizedRow extends Parameter {
  rawData: string
  isSpanned: boolean
  spannedContent: string
  mLatestDate: moment.Moment
}

interface LabeledColumn {
  key: string
  label: string
}

interface NormalizedColumn extends LabeledColumn{
  cell: (item: HistorizedRow, field: string) => string
  className: string
  key: string
}

interface HistoryParameterTableProps {
  rows: IncomingRow[]
  onSwitchToDaily: Function
  title: string
  timePrefs: TimePrefs
}

export const HistoryParameterTable: FunctionComponent<HistoryParameterTableProps> = (props) => {
  const { t } = useTranslation('main')
  const { rows } = props

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const Title = () => {
    return {
      label: {
        main: `${t('Parameters History')}`
      },
      className: styles.bdlgSettingsHeader
    }
  }

  const Columns = (): LabeledColumn[] => {
    return [
      {
        key: 'level',
        label: t('Level')
      },
      {
        key: 'parameterChange',
        label: t('Parameter')

      },
      {
        key: 'valueChange',
        label: t('Value')

      },
      {
        key: 'parameterDate',
        label: t('Date')
      }
    ]
  }

  const getItemField = (item: HistorizedRow, field: string): string => {
    // @ts-expect-error
    return item[field]
  }

  const normalizeColumns = (): NormalizedColumn[] => {
    return _.map(Columns(), (column) => ({
      cell: getItemField,
      className: '', // TODO: Fix:  column.className
      key: column.key,
      label: column.label
    }))
  }

  const renderSpannedRow = (normalizedColumns: NormalizedColumn[], rowKey: number, rowData: HistorizedRow): JSX.Element => {
    const { onSwitchToDaily } = props
    let content = rowData.spannedContent
    if (!content) {
      content = '&nbsp;'
    }
    const handleSwitchToDaily = (): void => {
      onSwitchToDaily(rowData.mLatestDate, 'Diabeloop parameters history')
    }
    const dateString = rowData.mLatestDate.toISOString()
    return (
      <tr id={`parameters-history-${dateString}`} key={rowKey} className={styles.spannedRow}>
        <td colSpan={normalizedColumns.length}>
          {content}
          <i
            id={`parameters-history-${dateString}-link-daily`}
            role="button"
            tabIndex={0}
            data-date={dateString}
            className={`icon-chart-line ${styles.clickableIcon} parameters-history-link-daily`}
            onClick={handleSwitchToDaily}
            onKeyPress={handleSwitchToDaily}
          />
        </td>
      </tr>)
  }

  const renderRow = (normalizedColumns: NormalizedColumn[], rowKey: number, rowData: HistorizedRow, /** @type {string} */ trClassName = undefined): JSX.Element => {
    const cells = _.map(normalizedColumns,
      (column) => {
        const classname = (column.className) ? `${styles.secondaryLabelWithMain} ${column.className}` : styles.secondaryLabelWithMain

        return <td key={column.key} data-testid={`${rowData.rawData.toLowerCase()}-${column.key}`}
                   className={classname}>{column.cell(rowData, column.key)}</td>
      }
    )

    return (
      <tr key={rowKey} data-testid={`${rowData.rawData.toLowerCase()}-row`} className={trClassName} data-raw={rowData.rawData}>
        {cells}
      </tr>
    )
  }

  const getParameterChange = (parameter: HistorizedRow): JSX.Element => {
    let icon = <i className="icon-unsure-data" />
    switch (parameter.changeType) {
      case 'added':
        icon = <i className="icon-add" />
        break
      case 'deleted':
        icon = <i className="icon-remove" />
        break
      case 'updated':
        icon = <i className="icon-refresh" />
        break
      default:
        break
    }
    return (
      <span>
        {icon}
        <span
          id={`parameters-history-${parameter.name}-${parameter.changeType}-${parameter.effectiveDate}`}
          className={`parameters-history-table-name ${styles.parameterHistory}`}
          data-param={parameter.name}
          data-changetype={parameter.changeType}
          data-isodate={parameter.effectiveDate}>
          {t(`params|${parameter.name}`)}
        </span>
      </span>
    )
  }

  const getValueChange = (parameter: HistorizedRow): JSX.Element => {
    const fCurrentValue = formatParameterValue(parameter.value, parameter.unit)
    const value = <span key="value">{`${fCurrentValue} ${parameter.unit}`}</span>
    let spanClass = `parameters-history-table-value ${styles.historyValue}`

    const elements = []
    switch (parameter.changeType) {
      case 'added':
        spanClass = `${spanClass} ${styles.valueAdded}`
        break
      case 'deleted':
        spanClass = `${spanClass} ${styles.valueDeleted}`
        break
      case 'updated': {
        const changeValueArrowIcon = <i className="icon-next" key="icon-next" />
        const fPreviousValue = formatParameterValue(parameter.previousValue, parameter.previousUnit)
        spanClass = `${spanClass} ${styles.valueUpdated}`
        const previousValue = <span key="previousValue">{`${fPreviousValue} ${parameter.previousUnit}`}</span>
        elements.push(previousValue)
        elements.push(changeValueArrowIcon)
        break
      }
      default:
        break
    }

    elements.push(value)

    return (
      <span className={spanClass} data-changetype={parameter.changeType}>
        {elements}
      </span>
    )
  }
  //
  const getAllRows = (history: IncomingRow[]): HistorizedRow[] => {
    const rows: HistorizedRow[] = []
    const { timePrefs } = props
    const dateFormat = getLongDayHourFormat()

    if (_.isArray(history)) {
      const currentParameters = new Map()

      const nHistory = history.length
      for (let i = 0; i < nHistory; i++) {
        const parameters = history[i].parameters

        if (_.isArray(parameters)) {
          const nParameters = parameters.length
          let latestDate = new Date(0)

          // Compare b->a since there is a reverse order at the end
          parameters.sort((a, b) =>
            b.level.toString().localeCompare(a.level.toString()) ||
            b.name.localeCompare(a.name) ||
            a.effectiveDate.localeCompare(b.effectiveDate)
          )

          for (let j = 0; j < nParameters; j++) {
            const parameter = parameters[j]
            const row: Partial<HistorizedRow> = { ...parameter }
            row.rawData = parameter.name
            const changeDate = new Date(parameter.effectiveDate)

            if (latestDate.getTime() < changeDate.getTime()) {
              latestDate = changeDate
            }
            if (timePrefs.timezoneAware) {
              row.parameterDate = moment.tz(changeDate, timePrefs.timezoneName).format(dateFormat)
            } else {
              row.parameterDate = moment.utc(changeDate).format(dateFormat)
            }

            switch (row.changeType) {
              case 'added':
                if (currentParameters.has(parameter.name)) {
                  // eslint-disable-next-line max-len
                  // this.log.warn(`History: Parameter ${parameter.name} was added, but present in current parameters`)
                }
                currentParameters.set(parameter.name, {
                  value: parameter.value,
                  unit: parameter.unit
                })
                break
              case 'deleted':
                if (currentParameters.has(parameter.name)) {
                  currentParameters.delete(parameter.name)
                } else {
                  // eslint-disable-next-line max-len
                  // this.log.warn(`History: Parameter ${parameter.name} was removed, but not present in current parameters`)
                }
                break
              case 'updated':
                if (currentParameters.has(parameter.name)) {
                  const currParam = currentParameters.get(parameter.name)
                  row.previousUnit = currParam.unit
                  row.previousValue = currParam.value
                } else {
                  // eslint-disable-next-line max-len
                  // this.log.warn(`History: Parameter ${parameter.name} was updated, but not present in current parameters`)
                  row.changeType = 'added'
                }

                currentParameters.set(parameter.name, {
                  value: parameter.value,
                  unit: parameter.unit
                })
                break
              default:
                // this.log.warn(`Unknown change type ${row.changeType}:`, row)
                break
            }

            row.parameterChange = getParameterChange(row as HistorizedRow)
            row.valueChange = getValueChange(row as HistorizedRow)
            row.isSpanned = false
            rows.push(row as HistorizedRow)
          }

          // TODO: remove dependencies on moment
          let mLatestDate
          if (timePrefs.timezoneAware) {
            mLatestDate = moment.tz(latestDate, timePrefs.timezoneName)
          } else {
            mLatestDate = moment.utc(latestDate)
          }

          rows.push({
            changeType: '',
            effectiveDate: '',
            level: 0,
            name: '',
            unit: Unit.MilligramPerDeciliter,
            value: '',
            parameterDate: '',
            previousUnit: Unit.MilligramPerDeciliter,
            previousValue: '',
            rawData: '',
            valueChange: <></>,
            isSpanned: true,
            parameterChange: <></>,
            spannedContent: mLatestDate.format(dateFormat),
            mLatestDate
          })
        }
      }
    }

    return rows.reverse()
  }

  const renderRows = (normalizedColumns: NormalizedColumn[]): JSX.Element => {
    const rs = getAllRows(rows)
    const rowData = _.map(rs, (row, key) => {
      if (row.isSpanned) {
        return renderSpannedRow(normalizedColumns, key, row)
      }
      return renderRow(normalizedColumns, key, row)
    })
    return (<tbody key={`tbody_${rowData.length}`}>{rowData}</tbody>)
  }

  let tableContents = []
  const normalizedColumns = normalizeColumns()
  const { className, label: { main } } = Title()
  tableContents = [
    renderRows(normalizedColumns)
  ]

  return (
    <table className={styles.settingsTable}>
      <caption
        key={main}
        className={className}
      >
        {main}<span className={styles.secondaryLabelWithMain}/>
      </caption>
      <HistoryTableHeader />
      {tableContents}

    </table>
  )
}
