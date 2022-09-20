import Meal from '../../../models/medical/datum/Meal'
import { DatumProcessor } from '../../../models/medical/Datum'
import BaseDatumService from './basics/BaseDatumService'
import DatumService from '../DatumService'
import MedicalDataOptions from '../../../models/medical/MedicalDataOptions'

const normalize = (rawData: Record<string, unknown>, opts: MedicalDataOptions): Meal => {
  const base = BaseDatumService.normalize(rawData, opts)
  const rawNutrition = (rawData?.nutrition ?? {}) as Record<string, unknown>
  const carboHydrate = (rawNutrition?.carbohydrate ?? {}) as Record<string, unknown>
  if (!(carboHydrate?.net && carboHydrate?.units)) {
    throw new Error('Missing nutrition data on meal datum')
  }
  const nutrition = {
    carbohydrate: {
      net: carboHydrate.net as number,
      units: carboHydrate.units as string
    }
  }
  const meal: Meal = {
    ...base,
    type: 'food',
    meal: 'rescuecarbs',
    uploadId: rawData.uploadId as string,
    nutrition
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
