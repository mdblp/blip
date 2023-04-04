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

import {
  ChangeType,
  type HistorizedParameter,
  type ChangeDateParameterGroup,
  type Parameter,
  type ParameterValue
} from '../../../models/historized-parameter.model'
import { formatLocalizedFromUTC, getLongDayHourFormat } from '../../../utils/datetime/datetime.util'
import { type TimePrefs, Unit } from 'medical-domain'

const setCurrentParameter = (parameter: Parameter, currentParameters: Map<string, ParameterValue>): void => {
  switch (parameter.changeType) {
    case ChangeType.Added:
    case ChangeType.Updated:
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
    default:
      break
  }
}

const getRowByParameter = (parameter: Parameter, timePrefs: TimePrefs, currentParameters: Map<string, ParameterValue>): HistorizedParameter => {
  const dateFormat = getLongDayHourFormat()
  const row: Partial<HistorizedParameter> = { ...parameter }
  row.rawData = parameter.name
  const changeDate = new Date(parameter.effectiveDate)

  row.parameterDate = formatLocalizedFromUTC(changeDate, timePrefs, dateFormat)

  if (parameter.changeType === ChangeType.Updated) {
    if (currentParameters.has(parameter.name)) {
      const currentParam = currentParameters.get(parameter.name)
      if (currentParam) {
        row.previousUnit = currentParam.unit
        row.previousValue = currentParam.value
      }
    } else {
      row.changeType = ChangeType.Added
    }
  }

  setCurrentParameter(parameter, currentParameters)

  row.isGroupedParameterHeader = false

  return row as HistorizedParameter
}

const getLatestDate = (parameters: Parameter[]): Date => {
  return parameters.reduce((currentLatestDate: Date, parameter: Parameter) => {
    const changeDate = new Date(parameter.effectiveDate)
    return currentLatestDate.getTime() < changeDate.getTime() ? changeDate : currentLatestDate
  }, new Date(0))
}

export const transformToHistorizedParameters = (history: ChangeDateParameterGroup[], timePrefs: TimePrefs): HistorizedParameter[] => {
  const dateFormat = getLongDayHourFormat()
  const currentParameters = new Map<string, ParameterValue>()

  const rows = history.reduce((currentRows: HistorizedParameter[], historyElement: ChangeDateParameterGroup) => {
    const parameters = historyElement.parameters

    // Compare b->a since there is a reverse order at the end
    parameters.sort((a, b) =>
      b.level.toString().localeCompare(a.level.toString()) ||
      b.name.localeCompare(a.name) ||
      a.effectiveDate.localeCompare(b.effectiveDate)
    )

    const parameterRows = parameters.map((parameter: Parameter) => getRowByParameter(parameter, timePrefs, currentParameters))
    currentRows.push(...parameterRows)
    const latestDate = getLatestDate(parameters)
    const mLatestDate = formatLocalizedFromUTC(latestDate, timePrefs, dateFormat)

    currentRows.push({
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

    return currentRows
  }, [])

  return rows.reverse()
}
