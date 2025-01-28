/*
 * Copyright (c) 2022-2024, Diabeloop
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

import type Wizard from '../../../models/medical/datum/wizard.model'
import BaseDatumService from './basics/base-datum.service'
import DatumService from '../datum.service'
import type MedicalDataOptions from '../../../models/medical/medical-data-options.model'
import { DatumType } from '../../../models/medical/datum/enums/datum-type.enum'
import { type WizardInputMealFat } from '../../../models/medical/datum/enums/wizard-input-meal-fat.enum'
import { type WeekDaysFilter, defaultWeekDaysFilter } from '../../../models/time/date-filter.model'
import { WizardInputMealSource } from '../../../models/medical/datum/enums/wizard-input-meal-source.enum'
import Bolus from '../../../models/medical/datum/bolus.model'
import { WizardDatumProcessor } from '../../../models/medical/datum/wizard-datum-processor.model'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Wizard => {
  const base = BaseDatumService.normalize(rawData, opts)
  const bolusId = (rawData?.bolus ?? '') as string
  const wizard: Wizard = {
    ...base,
    type: DatumType.Wizard,
    bolusId,
    bolusIds: new Set<string>([bolusId]),
    carbInput: rawData.carbInput as number,
    units: rawData.units as string,
    bolus: null,
    bolusPart2: null,
    inputTime: rawData.inputTime as string
  }
  if (rawData?.recommended) {
    const recommended = rawData?.recommended as Record<string, unknown>
    wizard.recommended = {
      carb: recommended.carb as number,
      correction: recommended.correction as number,
      net: recommended.net as number
    }
  }
  if (rawData?.inputMeal) {
    const inputMeal = rawData.inputMeal as Record<string, unknown>
    const currentSource = inputMeal?.source as WizardInputMealSource
    const inputMealSource = Object.values(WizardInputMealSource).includes(currentSource)
      ? currentSource : WizardInputMealSource.Manual

    wizard.inputMeal = {
      fat: inputMeal?.fat as WizardInputMealFat,
      source: inputMealSource
    }
  }
  return wizard
}

const isBolusValid = (bolusId: string, bolusData: Bolus[]): boolean => {
  return bolusData.some((bolus: Bolus) => bolus.id === bolusId)
}

const deduplicate = (data: Wizard[], bolusData: Bolus[], _opts: MedicalDataOptions): Wizard[] => {
  // group wizards by normal time
  const initialGroups: Record<string, Wizard[]> = {}
  const timeGroups = data.reduce((previous, current: Wizard) => {
    current.bolusIds = new Set<string>([current.bolusId])
    if (previous[current.normalTime] === undefined) {
      previous[current.normalTime] = []
    }
    previous[current.normalTime].push(current)
    return previous
  }, initialGroups)
  // Getting only one wizard with the max inputTime & aggregating bolusIds
  return Object.values(timeGroups).flatMap(value => {
    if (value.length <= 1) {
      return value
    }
    const uniqueWizard = value.reduce((max: Wizard, val: Wizard) => {
      max.bolusIds.add(val.bolusId)

      const isValBolusValid = isBolusValid(val.bolusId, bolusData)
      const isMaxBolusValid = isBolusValid(max.bolusId, bolusData)

      if (!isValBolusValid) {
        return max
      }
      if (!isMaxBolusValid || val.inputTime > max.inputTime) {
        return { ...val, bolusIds: max.bolusIds }
      }
      return max
    }, value[0])
    return [uniqueWizard]
  })
}

const filterOnDate = (data: Wizard[], start: number, end: number, weekDaysFilter: WeekDaysFilter = defaultWeekDaysFilter): Wizard[] => {
  return DatumService.filterOnDate(data, start, end, weekDaysFilter) as Wizard[]
}

const WizardService: WizardDatumProcessor<Wizard> = {
  normalize,
  deduplicate,
  filterOnDate
}

export default WizardService
