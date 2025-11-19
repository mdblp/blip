/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { type Bolus, BolusSubtype, DatumType, Prescriptor, type Wizard, WizardInputMealSource } from 'medical-domain'
import { BolusType } from '../../models/enums/bolus-type.enum'
import { inRange } from 'lodash'
import { formatDecimalNumber } from '../format/format.util'

const DEFAULT_PROGRAMMED_VALUE = 0

export const getBolusType = (insulinEvent: Bolus | Wizard): BolusType => {
  if (insulinEvent.type === DatumType.Wizard) {
    if (insulinEvent.inputMeal?.source === WizardInputMealSource.Umm) {
      return BolusType.Umm
    }
    return BolusType.Meal
  }
  const bolus = getBolusFromInsulinEvent(insulinEvent)
  if (bolus?.subType === BolusSubtype.Pen) {
    return BolusType.Pen
  }
  if (bolus?.prescriptor === Prescriptor.Manual) {
    return BolusType.Manual
  }
  if (bolus?.prescriptor === Prescriptor.EatingShortlyManagement) {
    return BolusType.EatingShortly
  }
  if (bolus?.subType === BolusSubtype.Biphasic) {
    return BolusType.Meal
  }
  return BolusType.Correction
}

export const getDelivered = (bolus: Bolus): number => {
  if (!bolus?.normal || !inRange(bolus?.normal, Infinity)) {
    return Number.NaN
  }
  return bolus.normal
}

export const isInterruptedBolus = (bolus: Bolus): boolean => {
  const cancelledDuringNormal = Number.isFinite(bolus?.normal) &&
    Number.isFinite(bolus?.expectedNormal) &&
    bolus?.normal !== bolus?.expectedNormal

  if (inRange(bolus?.normal, Infinity)) {
    return cancelledDuringNormal
  }
  return false
}

export const getProgrammed = (bolus?: Bolus): number | undefined => {
  if (!bolus) {
    return DEFAULT_PROGRAMMED_VALUE
  }

  return Number.isFinite(bolus.expectedNormal) ? bolus.expectedNormal : bolus.normal
}

export const getRecommended = (wizard: Wizard): number => {
  if (!wizard.recommended) {
    return Number.NaN
  }

  const netRecommendation = wizard.recommended?.net || null
  if (netRecommendation !== null) {
    return netRecommendation
  }

  const carbValue: number = wizard.recommended.carb || 0
  const correctionValue: number = wizard.recommended.correction || 0
  const recommendation = carbValue + correctionValue

  return fixFloatingPoint(recommendation)
}

export const getBolusFromInsulinEvent = (insulinEvent: Bolus | Wizard): Bolus | null => {
  return insulinEvent.type === DatumType.Wizard ? insulinEvent.bolus : insulinEvent
}

const fixFloatingPoint = (value: number): number => {
  return Number.parseFloat(formatDecimalNumber(value, 3))
}
