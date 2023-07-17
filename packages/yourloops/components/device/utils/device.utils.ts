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

import { type DeviceConfig, type ParameterConfig, type ParametersChange, Unit } from 'medical-domain'
import { DeviceMeals } from '../models/device-meal.models'
import i18next from 'i18next'
import textTable from 'text-table'

const t = i18next.t.bind(i18next)
export const PARAMETER_STRING_MAX_WIDTH = 250

export const copySettingsToClipboard = async (lastUploadDate: string, device: DeviceConfig, parameters: ParameterConfig[]): Promise<void> => {
  const lastUploadDateText = `${lastUploadDate}\n\n`
  const deviceText = `-- ${t('Device')} --\n`
  const deviceTableText = textTable([
    [t('Manufacturer'), device.manufacturer],
    [t('Identifier'), device.deviceId],
    [t('IMEI'), device.imei],
    [t('Software version'), device.swVersion]]
  ) as string
  const parametersText = `\n\n-- ${t('Parameters')} --\n`
  const parametersTable = [[
    t('Name'),
    t('Value'),
    t('Unit')
  ]]
  parameters.forEach((parameter) => {
    parametersTable.push([t(`params|${parameter.name}`), parameter.value, parameter.unit])
  })

  const rawText = `${lastUploadDateText}${deviceText}${deviceTableText}${parametersText}${textTable(parametersTable, { align: ['l', 'r', 'l'] })}`

  try {
    await navigator.clipboard.writeText(rawText)
  } catch (err) {
    console.log(err)
  }
}

export const formatParameterValue = (value: string | number, units: string | Unit): string => {
  if (typeof value === 'string') {
    if (value.includes('.')) {
      value = Number.parseFloat(value)
    } else {
      value = Number.parseInt(value, 10)
    }
  }

  if (Number.isNaN(value)) {
    // Like formatPercentage() but we do not want to pad the '%' character.
    return '--'
  }

  let numberOfDecimals = 0
  switch (units) {
    case Unit.Percent:
    case Unit.Minute:
      break
    case Unit.Gram:
    case Unit.Kilogram:
    case Unit.InsulinUnit:
    case Unit.MilligramPerDeciliter:
    case Unit.MmolPerLiter:
      numberOfDecimals = 1
      break
    case Unit.InsulinUnitPerGram:
      numberOfDecimals = 3
      break
    default:
      numberOfDecimals = 2
      break
  }

  if (Number.isInteger(value) && numberOfDecimals === 0) {
    return value.toString(10)
  }

  const absoluteValue = Math.abs(value)
  // I did not use formatDecimalNumber() because some of our parameters are x10e-4,
  // so they are displayed as "0.00"
  if (absoluteValue < Number.EPSILON) {
    return value.toFixed(1) // Value ~= 0
  }
  if (absoluteValue < 1e-2 || absoluteValue > 9999) {
    return value.toExponential(2)
  }
  return value.toFixed(numberOfDecimals)
}

export const sortHistoryParametersByDate = (historyParameters: ParametersChange[]): ParametersChange[] => {
  return historyParameters.sort((a, b) => {
    return new Date(a.changeDate).valueOf() - new Date(b.changeDate).valueOf()
  })
}

export const sortPumpSettingsParameterByLevel = (historyParameters: ParametersChange[]): ParametersChange[] => {
  historyParameters.forEach(parametersChange => {
    parametersChange.parameters = parametersChange.parameters.sort((a, b) => a.level - b.level)
  })
  return historyParameters
}

export const sortParameterList = (parameters: ParameterConfig[]): ParameterConfig[] => {
  const aggressivenessParameters = parameters.filter(parameter => parameter.unit === Unit.Percent)
  const insulinParameters = parameters.filter(parameter => parameter.unit === Unit.InsulinUnit || parameter.unit === Unit.InsulinUnitPerGram)
  const mealParameters = parameters.filter(parameter => parameter.unit === Unit.Gram)
  const weightParameters = parameters.filter(parameter => parameter.unit === Unit.Kilogram)
  const thresholdParameters = parameters.filter(parameter => parameter.unit === Unit.MilligramPerDeciliter || parameter.unit === Unit.MmolPerLiter)
  const minutesParameter = parameters.filter(parameter => parameter.unit === Unit.Minute)

  const sortedMealParameters = mealParameters.length > 0 ? sortMealParameters(mealParameters) : mealParameters
  return [...insulinParameters, ...weightParameters, ...thresholdParameters, ...aggressivenessParameters, ...sortedMealParameters, ...minutesParameter]
}

const sortMealParameters = (parameters: ParameterConfig[]): ParameterConfig[] => {
  const breakfastMeals = []
  const lunchMeals = []
  const dinnerMeals = []
  parameters.forEach((parameter) => {
    const splitParameterKey = parameter.name.split('_')
    switch (splitParameterKey[2]) {
      case DeviceMeals.Breakfast:
        breakfastMeals.push(parameter)
        break
      case DeviceMeals.Lunch:
        lunchMeals.push(parameter)
        break
      case DeviceMeals.Dinner:
        dinnerMeals.push(parameter)
        break
    }
  })
  breakfastMeals[0] = breakfastMeals.splice(1, 1, breakfastMeals[0])[0]
  lunchMeals[0] = lunchMeals.splice(1, 1, lunchMeals[0])[0]
  dinnerMeals[0] = dinnerMeals.splice(1, 1, dinnerMeals[0])[0]
  return [...breakfastMeals, ...lunchMeals, ...dinnerMeals]
}
