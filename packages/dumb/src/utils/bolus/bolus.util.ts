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

import { Bolus, BolusSubtype, Prescriptor, Wizard } from 'medical-domain'
import { BolusType } from '../../models/enums/bolus-type.enum'
import _, { inRange } from 'lodash'

const DEFAULT_PROGRAMMED_VALUE = 0

export const getBolusType = (bolus: Bolus | Wizard): BolusType => {
  if (bolus.type === 'wizard') {
    return BolusType.Meal
  }
  // FIXME this case should never happen? (wizard data would go in 1st return case)
  const bolusFromInsulinEvent = getBolusFromInsulinEvent(bolus)
  if (bolusFromInsulinEvent?.subType === BolusSubtype.Pen || bolusFromInsulinEvent?.prescriptor === Prescriptor.Manual) {
    return BolusType.Manual
  }
  if (bolusFromInsulinEvent?.subType === BolusSubtype.Biphasic) {
    return BolusType.Meal
  }
  return BolusType.Micro
}

export const getDelivered = (insulinEvent: Bolus | Wizard): number => {
  if (insulinEvent.type === 'wizard') {
    const bolus = getBolusFromInsulinEvent(insulinEvent)
    // FIXME no "bolus.extended" case because not present in Bolus model
    if (!bolus?.normal || !inRange(bolus?.normal, Infinity)) {
      return Number.NaN
    }
    return bolus.normal
  }
  // if (Number.isFinite(bolus.extended)) {
  //
  // }
  return insulinEvent.normal
}

export const isInterruptedBolus = (insulinEvent: Bolus | Wizard): boolean => {
  const bolus = getBolusFromInsulinEvent(insulinEvent)

  const cancelledDuringNormal = Number.isFinite(bolus?.normal) &&
    Number.isFinite(bolus?.expectedNormal) &&
    bolus?.normal !== bolus?.expectedNormal

  // FIXME no "bolus.expectedExtended" in Bolus model
  // const cancelledDuringExtended = Boolean(
  //   Number.isFinite(bolus?.extended) &&
  //   Number.isFinite(bolus?.expectedExtended) &&
  //   bolus?.extended !== bolus?.expectedExtended
  // )

  if (bolus?.normal && _.inRange(bolus?.normal, Infinity)) {
    // if (!bolus?.extended) {
    //   return cancelledDuringNormal
    // }
    // return cancelledDuringNormal || cancelledDuringExtended
    return cancelledDuringNormal
  }
  // FIXME set default value
  return false
  // return cancelledDuringExtended
}

export const getProgrammed = (bolus?: Bolus): number | undefined => {
  if (!bolus) {
    return DEFAULT_PROGRAMMED_VALUE
  }
  // if (insulinEvent.type === 'wizard') {
  //   const bolus = getBolusFromInsulinEvent(insulinEvent)
  //   // if (!(Number.isFinite(bolus?.normal) || Number.isFinite(bolus.extended))) {
  //   if (!(Number.isFinite(bolus?.normal))) {
  //     return Number.NaN
  //   }
  // }
  // if (Number.isFinite(insulinEvent.extended) && Number.isFinite(insulinEvent.expectedExtended)) {
  //   if (Number.isFinite(insulinEvent.normal)) {
  //     if (Number.isFinite(insulinEvent.expectedNormal)) {
  //       return fixFloatingPoint(insulinEvent.expectedNormal + insulinEvent.expectedExtended)
  //     }
  //     return fixFloatingPoint(insulinEvent.normal + insulinEvent.expectedExtended)
  //   }
  //   return insulinEvent.expectedExtended
  // } else if (Number.isFinite(insulinEvent.extended)) {
  // if (Number.isFinite(insulinEvent.extended)) {
  //   if (Number.isFinite(insulinEvent.normal)) {
  //     if (Number.isFinite(insulinEvent.expectedNormal)) {
  //       // this situation should not exist!
  //       throw new Error(
  //         'Combo bolus found with a cancelled `normal` portion and non-cancelled `extended`!'
  //       )
  //     }
  //     return fixFloatingPoint(insulinEvent.normal + insulinEvent.extended)
  //   }
  //   return insulinEvent.extended
  // }
  return Number.isFinite(bolus.expectedNormal) ? bolus.expectedNormal : bolus.normal
}

// FIXME no recommended field in Bolus/Wizard, feature removed?
// export const getRecommended = (insulinEvent: Bolus | Wizard): number => {
//   if (!insulinEvent.recommended) {
//     return Number.NaN
//   }
//   const netRecommendation =
// }

const getBolusFromInsulinEvent = (insulinEvent: Bolus | Wizard): Bolus | null => {
  return insulinEvent.type === 'wizard' ? insulinEvent.bolus : insulinEvent
  // return insulinEvent.bolus || insulinEvent
}
