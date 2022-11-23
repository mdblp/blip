/*
 * Copyright (c) 2022, Diabeloop
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

import Meal from '../../../models/medical/datum/Meal'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'
import Prescriptor from '../../../models/medical/datum/enums/prescriptor.enum'
import Unit from '../../../models/medical/datum/enums/unit.enum'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Meal => {
  const base = BaseDatumService.normalize(rawData, opts)
  const rawNutrition = (rawData?.nutrition ?? {}) as Record<string, unknown>
  const carbohydrate = (rawNutrition?.carbohydrate ?? {}) as Record<string, unknown>
  const rawPrescribedNutrition = (rawData?.prescribedNutrition ?? {}) as Record<string, unknown>
  const prescribedCarbohydrate = (rawPrescribedNutrition?.carbohydrate ?? {}) as Record<string, unknown>
  const prescriptor = (rawData?.prescriptor ?? '') as Prescriptor

  if (!(carbohydrate?.net && carbohydrate?.units)) {
    throw new Error('Missing nutrition data on meal datum')
  }

  const nutrition = {
    carbohydrate: {
      net: carbohydrate.net as number,
      units: carbohydrate.units as Unit
    }
  }

  const prescribedNutrition = {
    carbohydrate: {
      net: prescribedCarbohydrate?.net as number,
      units: prescribedCarbohydrate?.units as Unit
    }
  }

  const meal: Meal = {
    ...base,
    type: 'food',
    meal: 'rescuecarbs',
    uploadId: rawData.uploadId as string,
    nutrition,
    prescribedNutrition,
    prescriptor
  }
  return meal
}

const deduplicate = (data: Meal[], opts: MedicalDataOptions): Meal[] => {
  return DatumService.deduplicate(data, opts) as Meal[]
}

const MealService: DatumProcessor<Meal> = {
  normalize,
  deduplicate
}

export default MealService
