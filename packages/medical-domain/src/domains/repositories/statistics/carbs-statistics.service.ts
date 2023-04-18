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

import type Meal from '../../models/medical/datum/meal.model'
import type Wizard from '../../models/medical/datum/wizard.model'
import type DateFilter from '../../models/time/date-filter.model'
import MealService from '../medical/datum/meal.service'
import WizardService from '../medical/datum/wizard.service'
import { getWeekDaysFilter, sumValues } from './statistics.utils'
import { type CarbsStatistics } from '../../models/statistics/carbs-statistics.model'

function getCarbsData(meal: Meal[], wizard: Wizard[], numDays: number, dateFilter: DateFilter): CarbsStatistics {
  const filterMeal = MealService.filterOnDate(meal, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filterWizard = WizardService.filterOnDate(wizard, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const foodCarbsData = filterMeal.map(meal => meal.nutrition.carbohydrate.net)
  const wizardData = filterWizard.map(wizard => wizard.carbInput)

  return {
    foodCarbs: sumValues(foodCarbsData) / numDays,
    total: (sumValues(foodCarbsData) + sumValues(wizardData)) / numDays
  }
}

export interface CarbsStatisticsAdapter {
  getCarbsData: (meal: Meal[], wizard: Wizard[], numDays: number, dateFilter: DateFilter) => CarbsStatistics
}

export const CarbsStatisticsService: CarbsStatisticsAdapter = {
  getCarbsData
}
