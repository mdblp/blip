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

import _ from 'lodash'
import { HistorySpannedRow } from './history-table-spanned-row'
import { HistoryTableRow } from './history-table-row'
import React, { FunctionComponent } from 'react'
import { getLongDayHourFormat } from '../../../utils/datetime/datetime.util'
import moment from 'moment-timezone'
import { TimePrefs, Unit } from 'medical-domain'
import { ChangeType, HistorizedParameter, IncomingRow } from '../../../models/historized-parameter.model'

interface HistoryTableContentProps {
  onSwitchToDaily: Function
  data: IncomingRow[]
  timePrefs: TimePrefs
  length: number
}

export const HistoryTableContent: FunctionComponent<HistoryTableContentProps> = (props): JSX.Element => {
  const { onSwitchToDaily, data, timePrefs, length } = props

  // TODO: Candidate to custom hooks ?
  const buildAllRows = (history: IncomingRow[]): HistorizedParameter[] => {
    const rows: HistorizedParameter[] = []
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
            const row: Partial<HistorizedParameter> = { ...parameter }
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

            row.isSpanned = false
            rows.push(row as HistorizedParameter)
          }

          // TODO: remove dependencies on moment
          let mLatestDate
          if (timePrefs.timezoneAware) {
            mLatestDate = moment.tz(latestDate, timePrefs.timezoneName)
          } else {
            mLatestDate = moment.utc(latestDate)
          }

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
            isSpanned: true,
            spannedContent: mLatestDate.format(dateFormat),
            mLatestDate
          })
        }
      }
    }

    return rows.reverse()
  }
  const rs = buildAllRows(data)

  // Though for reviewer : Should these lines below be part of the return ?
  // change from lodash _.map to native Array.map ?
  // data or value for arg of component ?
  const content = _.map(rs, (row, key) => {
    if (row.isSpanned) {
      return <HistorySpannedRow key={key} data={row} length={length} onSwitchToDaily={onSwitchToDaily} />
    }
    return <HistoryTableRow key={key} data={row} />
  })

  return (
    <tbody>
      {content}
    </tbody>)
}
