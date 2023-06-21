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

import { type ParameterConfig, type ParametersChange, Unit } from 'medical-domain'

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

export const sortParameterList = (parameters: ParameterConfig[]): ParameterConfig[] => {
  const aggressivenessParameters = parameters.filter(parameter => parameter.unit === Unit.Percent)
  const insulinParameters = parameters.filter(parameter => parameter.unit === Unit.InsulinUnit)
  const mealParameters = parameters.filter(parameter => parameter.unit === Unit.Gram)
  const weightParameters = parameters.filter(parameter => parameter.unit === Unit.Kilogram)
  const thresholdParameters = parameters.filter(parameter => parameter.unit === Unit.MilligramPerDeciliter)

  return [...insulinParameters, ...weightParameters, ...thresholdParameters, ...aggressivenessParameters, ...sortMealParameters(mealParameters)]
}

const sortMealParameters = (parameters: ParameterConfig[]): ParameterConfig[] => {
  const breakfastMeals = []
  const lunchMeals = []
  const dinnerMeals = []
  parameters.forEach((parameter) => {
    const splitParameterKey = parameter.name.split('_')
    switch (splitParameterKey[2]) {
      case 'BREAKFAST':
        breakfastMeals.push(parameter)
        break
      case 'LUNCH':
        lunchMeals.push(parameter)
        break
      case 'DINNER':
        dinnerMeals.push(parameter)
        break
    }
  })
  breakfastMeals[0] = breakfastMeals.splice(1, 1, breakfastMeals[0])[0]
  lunchMeals[0] = lunchMeals.splice(1, 1, lunchMeals[0])[0]
  dinnerMeals[0] = dinnerMeals.splice(1, 1, dinnerMeals[0])[0]
  return [...breakfastMeals, ...lunchMeals, ...dinnerMeals]
}
