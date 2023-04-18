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

import _ from 'lodash'
import Meal from '../../models/medical/datum/meal.model'
import Wizard from '../../models/medical/datum/wizard.model'
import DateFilter from '../../models/time/date-filter.model'
import { CarbsStatistics } from 'src/domains/models/statistics/carbs-statistics.model'
import MealService from '../medical/datum/meal.service'
import WizardService from '../medical/datum/wizard.service'
import { getWeekDaysFilter } from './statistics.utils'

getCarbsData = () => {
  this.applyDateFilters()

  const wizardData = this.filter.byType('wizard').top(Infinity)
  const foodData = this.filter.byType('food').top(Infinity)

  const wizardCarbs = _.reduce(
    wizardData,
    (result, datum) => result + _.get(datum, 'carbInput', 0),
    0
  )

  const foodCarbs = _.reduce(
    foodData,
    (result, datum) => result + _.get(datum, 'nutrition.carbohydrate.net', 0),
    0
  )

  const totalCarbs = wizardCarbs + foodCarbs

  return {
    nDays: this.days,
    wizardCarbs,
    foodCarbs,
    totalCarbs,
    totalCarbsPerDay: totalCarbs / this.days,
    foodCarbsPerDay: foodCarbs / this.days,
    wizardCarbsPerDay: wizardCarbs / this.days,
    total: wizardData.length + foodData.length
  }
}
const getCarbsData = (meal: Meal[], wizard: Wizard[], numDays: number, dateFilter: DateFilter):CarbsStatistics => {
const filterMeal = MealService.filterOnDate(meal as Meal[], dateFilter.start,dateFilter.end, getWeekDaysFilter(dateFilter))
const filterWizard = WizardService.filterOnDate(wizard as Wizard[], dateFilter.start,dateFilter.end, getWeekDaysFilter(dateFilter))
const foodCarbs = filterMeal.map(meal => meal.nutrition.carbohydrate.net){

  }
  return {
    foodCarbs,
    total
  }
}
export interface CarbsStatisticsAdapter {
  getCarbsData:(meal: Meal, wizard: Wizard, numDays: number, dateFilter: DateFilter) => CarbsStatistics
}
export const CarbsStatisticsService: CarbsStatisticsAdapter = {
  getCarbsData
}


