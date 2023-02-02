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

import { ChangeType, HistorizedParameter, IncomingRow } from '../../../models/historized-parameter.model'
import React from 'react'
import styles from '../diabeloop.css'
import { formatLocalizedFromUTC, getLongDayHourFormat } from '../../../utils/datetime/datetime.util'
import { TimePrefs, Unit } from 'medical-domain'

export const selectIcon = (change: ChangeType): JSX.Element => {
  switch (change) {
    case ChangeType.Added:
      return <i className="icon-add" />
    case ChangeType.Deleted:
      return <i className="icon-remove" />
    case ChangeType.Updated:
      return <i className="icon-refresh" />
    default:
      break
  }
  return <i className="icon-unsure-data" />
}

export const selectSpanClass = (change: ChangeType): string => {
  const spanClass = `parameters-history-table-value ${styles.historyValue}`
  switch (change) {
    case ChangeType.Added:
      return `${spanClass} ${styles.valueAdded}`
    case ChangeType.Deleted:
      return `${spanClass} ${styles.valueDeleted}`
    case ChangeType.Updated: {
      return `${spanClass} ${styles.valueUpdated}`
    }
    default:
      break
  }
  return spanClass
}

export const buildAllRows = (history: IncomingRow[], timePrefs: TimePrefs): HistorizedParameter[] => {
  const rows: HistorizedParameter[] = []
  const dateFormat = getLongDayHourFormat()
  const currentParameters = new Map()

  const nHistory = history.length
  for (let i = 0; i < nHistory; i++) {
    const parameters = history[i].parameters
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
      const row: Partial<HistorizedParameter> = { ...parameter }
      row.rawData = parameter.name
      const changeDate = new Date(parameter.effectiveDate)

      if (latestDate.getTime() < changeDate.getTime()) {
        latestDate = changeDate
      }
      row.parameterDate = formatLocalizedFromUTC(changeDate, timePrefs, dateFormat)

      switch (row.changeType) {
        case ChangeType.Added:
          currentParameters.set(parameter.name, {
            value: parameter.value,
            unit: parameter.unit
          })
          break
        case ChangeType.Deleted:
          if (currentParameters.has(parameter.name)) {
            currentParameters.delete(parameter.name)
          }
          break
        case ChangeType.Updated:
          if (currentParameters.has(parameter.name)) {
            const currParam = currentParameters.get(parameter.name)
            row.previousUnit = currParam.unit
            row.previousValue = currParam.value
          } else {
            row.changeType = ChangeType.Added
          }

          currentParameters.set(parameter.name, {
            value: parameter.value,
            unit: parameter.unit
          })
          break
        default:
          break
      }

      row.isGroupedParameterHeader = false
      rows.push(row as HistorizedParameter)
    }

    const mLatestDate = formatLocalizedFromUTC(latestDate, timePrefs, dateFormat)

    rows.push({
      changeType: ChangeType.Added,
      effectiveDate: '',
      level: 0,
      name: '',
      unit: Unit.MilligramPerDeciliter,
      value: '',
      parameterDate: '',
      previousUnit: Unit.MilligramPerDeciliter,
      previousValue: '',
      rawData: '',
      isGroupedParameterHeader: true,
      groupedParameterHeaderContent: mLatestDate,
      latestDate
    })
  }

  return rows.reverse()
}
