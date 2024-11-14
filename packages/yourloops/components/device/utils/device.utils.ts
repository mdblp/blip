/*
 * Copyright (c) 2023-2024, Diabeloop
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
  type DeviceConfig, DeviceSystem, MobileAppConfig,
  type ParameterConfig,
  type ParametersChange,
  type PumpSettingsParameter,
  Unit
} from 'medical-domain'
import i18next from 'i18next'
import textTable from 'text-table'
import { sortByDate } from '../../patient-list/utils/sort-comparators.util'
import { formatCurrentDate } from 'dumb/dist/src/utils/datetime/datetime.util'

const t = i18next.t.bind(i18next)
export const PARAMETER_STRING_MAX_WIDTH = 250

export const copySettingsToClipboard = async (lastUploadDate: string, device: DeviceConfig, parameters: ParameterConfig[], mobileApp: MobileAppConfig): Promise<void> => {
  const lastUploadDateText = `${lastUploadDate}\n\n`
  const deviceText = `-- ${t('Phone')} --\n`
  let deviceTableText = ''
  let mobileAppText = ''
  let mobileAppTableText = ''

  if (device.name == DeviceSystem.Dblg1) {
    deviceTableText = textTable([
      [t('Manufacturer'), device.manufacturer],
      [t('Product Name'), device.name],
      [t('Identifier'), device.deviceId],
      [t('IMEI'), device.imei],
      [t('Software version'), device.swVersion]]
    ) as string
  }

  if (device.name == DeviceSystem.Dblg2) {
    deviceTableText = textTable([
      [t('Manufacturer'), device.manufacturer],
      [t('Product Name'), device.smartphoneModel],
      [t('Operating system'), device.operatingSystem],
      [t('Sdk version'), device.osVersion]
    ]) as string
    mobileAppText = `\n\n-- ${t('Mobile application')} --\n`
    mobileAppTableText = textTable([
      [t('Manufacturer'), mobileApp.manufacturer],
      [t('Name'), mobileApp.identifier],
      [t('Software version'), mobileApp.swVersion],
    ]) as string
  }

  const parametersText = `\n\n-- ${t('Settings on day', { day: formatCurrentDate() })} --\n`
  const parametersTable = [[
    t('Name'),
    t('Value'),
    t('Unit')
  ]]
  parameters.forEach((parameter) => {
    parametersTable.push([t(`params|${parameter.name}`), parameter.value, parameter.unit])
  })

    const rawText = `${lastUploadDateText}${deviceText}${deviceTableText}${mobileAppText}${mobileAppTableText}${parametersText}${textTable(parametersTable, { align: ['l', 'r', 'l'] })}`

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
    case Unit.Centimeter:
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

const sortHistoryParametersByDate = (historyParameters: ParametersChange[]): ParametersChange[] => {
  return historyParameters.sort((a, b) => {
    return new Date(b.changeDate).valueOf() - new Date(a.changeDate).valueOf()
  })
}

const sortPumpSettingsParametersByDate = (historyParameters: ParametersChange[]): void => {
  historyParameters.forEach((parameterChange) => {
    parameterChange.parameters.sort((paramA, paramB) => {
      return sortByDate(paramB.effectiveDate, paramA.effectiveDate)
    })
  })
}

const sortPumpSettingsParametersByLevel = (historyParameters: ParametersChange[]): void => {
  historyParameters.forEach(parametersChange => {
    parametersChange.parameters = parametersChange.parameters.sort((a, b) => a.level - b.level)
  })
}

export const sortHistory = (history: ParametersChange[]): void => {
  sortHistoryParametersByDate(history)
  sortPumpSettingsParametersByDate(history)
  sortPumpSettingsParametersByLevel(history)
}

export const sortParameterList = (parameters: ParameterConfig[]): void => {
  const settingsOrder = [
    'MEDIUM_MEAL_BREAKFAST',
    'MEDIUM_MEAL_LUNCH',
    'MEDIUM_MEAL_DINNER',
    'TOTAL_INSULIN_FOR_24H',
    'WEIGHT',
    'PATIENT_GLY_HYPER_LIMIT',
    'PATIENT_GLY_HYPO_LIMIT',
    'PATIENT_GLYCEMIA_TARGET',
    'PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA',
    'BOLUS_AGGRESSIVENESS_FACTOR',
    'MEAL_RATIO_BREAKFAST_FACTOR',
    'MEAL_RATIO_LUNCH_FACTOR',
    'MEAL_RATIO_DINNER_FACTOR',
    'SMALL_MEAL_BREAKFAST',
    'LARGE_MEAL_BREAKFAST',
    'SMALL_MEAL_LUNCH',
    'LARGE_MEAL_LUNCH',
    'SMALL_MEAL_DINNER',
    'LARGE_MEAL_DINNER'
  ]

  parameters.sort((a, b) => {
    const aIndex = settingsOrder.indexOf(a.name)
    const bIndex = settingsOrder.indexOf(b.name)
    if (aIndex < 0) {
      return 1
    }
    if (bIndex < 0) {
      return -1
    }
    return aIndex - bIndex
  })
}

export const formatParameters = (parameters: ParameterConfig[]): void => {
  parameters.forEach(parameter => {
    parameter.value = formatParameterValue(parameter.value, parameter.unit)
  })
}

export const getPumpSettingsParameterList = (historyParameters: ParametersChange[]): PumpSettingsParameter[] => {
  return historyParameters.reduce<PumpSettingsParameter[]>((pumpSettingsParameters, parameterChange) => [...pumpSettingsParameters, ...parameterChange.parameters], [])
}
