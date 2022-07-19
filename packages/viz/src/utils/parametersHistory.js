/**
 * Copyright (c) 2022, Diabeloop
 * Utils for getting parameter changes from raw parameter history
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

import bows from 'bows'
import moment from 'moment-timezone'

const log = bows('ParametersHistoryUtil')

const sortParameter = (a, b) =>
  b.level.toString().localeCompare(a.level.toString())
  || b.name.localeCompare(a.name)
  || a.effectiveDate.localeCompare(b.effectiveDate)


const setTzDate = (date, timePrefs,) => {
  if (timePrefs.timezoneAware) {
    return moment.tz(date, timePrefs.timezoneName)
  }
  return moment.utc(date)

}

const formatParameterDate = (date, timePrefs, dateFormat) => {
  return setTzDate(date, timePrefs).format(dateFormat)
}

const handleParameterChange = (currentChange, currentParameters, parameter) => {
  switch (currentChange.changeType) {
    case 'added':
      if (currentParameters.has(parameter.name)) {
      // eslint-disable-next-line max-len
        log.warn(`History: Parameter ${parameter.name} was added, but present in current parameters`)
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
        log.warn(`History: Parameter ${parameter.name} was removed, but not present in current parameters`)
      }
      break
    case 'updated':
      if (currentParameters.has(parameter.name)) {
        const currParam = currentParameters.get(parameter.name)
        currentChange.previousUnit = currParam.unit
        currentChange.previousValue = currParam.value
      } else {
      // eslint-disable-next-line max-len
        log.warn(`History: Parameter ${parameter.name} was updated, but not present in current parameters`)
        currentChange.changeType = 'added'
      }

      currentParameters.set(parameter.name, {
        value: parameter.value,
        unit: parameter.unit
      })
      break
    default:
      log.warn(`Unknown change type ${currentChange.changeType}:`, currentChange)
      break
  }
}

const getKey = (row) => [row.name,row.effectiveDate, row.value, row.unit].join('|')

export default function getParametersChanges(history, timePrefs, dateFormat, includeGroupChange = false) {
  const rows = []

  if (!Array.isArray(history)) {
    return rows
  }

  const currentParameters = new Map()

  const nHistory = history.length
  for (let i = 0; i < nHistory; i++) {
    const parameters = history[i].parameters

    if (!Array.isArray(parameters)) {
      continue
    }
    const nParameters = parameters.length
    let latestDate = new Date(0)

    // Compare b->a since there is a reverse order at the end
    parameters.sort(sortParameter)

    for (let j = 0; j < nParameters; j++) {
      const parameter = parameters[j]
      const row = { ...parameter }
      row.rawData = parameter.name
      const changeDate = new Date(parameter.effectiveDate)

      if (latestDate.getTime() < changeDate.getTime()) {
        latestDate = changeDate
      }
      row.parameterDate = formatParameterDate(changeDate, timePrefs.timezoneName, dateFormat)

      handleParameterChange(row, currentParameters, parameter)
      row.key = getKey(row)
      rows.push(row)
    }

    if(includeGroupChange) {
      const mLatestDate = setTzDate(latestDate, timePrefs)
      const latestDateFormatted = mLatestDate.format(dateFormat)
      rows.push({
        key: `group-${latestDateFormatted}`,
        isSpanned: true,
        spannedContent: latestDateFormatted,
        mLatestDate
      })
    }

  }

  return rows.reverse()
}
