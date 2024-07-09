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

import type Meal from '../../models/medical/datum/meal.model'
import type Wizard from '../../models/medical/datum/wizard.model'
import type DateFilter from '../../models/time/date-filter.model'
import MealService from '../medical/datum/meal.service'
import WizardService from '../medical/datum/wizard.service'
import { buildHoursRangeMap, getWeekDaysFilter, sumValues } from './statistics.utils'
import {
  type CarbsStatistics,
  RescueCarbsAveragePerRange,
  RescueCarbsAverageStatistics
} from '../../models/statistics/carbs-statistics.model'
import { getHours } from '../time/time.service'
import { HoursRange } from '../../models/statistics/satistics.model'

function getCarbsData(meal: Meal[], wizard: Wizard[], numDays: number, dateFilter: DateFilter): CarbsStatistics {
  const filteredMeal = MealService.filterOnDate(meal, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filteredWizard = WizardService.filterOnDate(wizard, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const rescueCarbsData = filteredMeal.map(meal => meal.nutrition.carbohydrate.net)
  const mealData = filteredWizard.map(wizard => wizard.carbInput)
  const mealCarbs = sumValues(mealData)
  const rescueCarbs = sumValues(rescueCarbsData)
  const totalEntriesMealCarbWithRescueCarbs = rescueCarbsData.length + mealData.length
  const totalRescueCarbsEntries = rescueCarbsData.length
  const totalCarbs = mealCarbs + rescueCarbs
  return {
    mealCarbsPerDay: mealCarbs / numDays,
    rescueCarbsPerDay: rescueCarbs / numDays,
    totalMealCarbsWithRescueCarbsEntries: totalEntriesMealCarbWithRescueCarbs,
    totalCarbsPerDay: totalCarbs / numDays,
    totalRescueCarbsEntries
  }
}

function getRescueCarbsAverageStatistics(meals: Meal[], numberOfDays: number, dateFilter: DateFilter): RescueCarbsAverageStatistics {
  const carbsMap = buildHoursRangeMap<Meal>()
  const midnightToThree = carbsMap.get(HoursRange.MidnightToThree) as Meal[]
  const threeToSix = carbsMap.get(HoursRange.ThreeToSix) as Meal[]
  const sixToNine = carbsMap.get(HoursRange.SixToNine) as Meal[]
  const nineToTwelve = carbsMap.get(HoursRange.NineToTwelve) as Meal[]
  const twelveToFifteen = carbsMap.get(HoursRange.TwelveToFifteen) as Meal[]
  const fifteenToEighteen = carbsMap.get(HoursRange.FifteenToEighteen) as Meal[]
  const eighteenToTwentyOne = carbsMap.get(HoursRange.EighteenToTwentyOne) as Meal[]
  const twentyOneToMidnight = carbsMap.get(HoursRange.TwentyOneToMidnight) as Meal[]

  const filteredMeal = MealService.filterOnDate(meals, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  filteredMeal.forEach((meal) => {
    const hours = getHours(meal.normalTime, meal.timezone)

    if (hours < 3) {
      midnightToThree.push(meal)
      return
    }
    if (hours >= 3 && hours < 6) {
      threeToSix.push(meal)
      return
    }
    if (hours >= 6 && hours < 9) {
      sixToNine.push(meal)
      return
    }
    if (hours >= 9 && hours < 12) {
      nineToTwelve.push(meal)
      return
    }
    if (hours >= 12 && hours < 15) {
      twelveToFifteen.push(meal)
      return
    }
    if (hours >= 15 && hours < 18) {
      fifteenToEighteen.push(meal)
      return
    }
    if (hours >= 18 && hours < 21) {
      eighteenToTwentyOne.push(meal)
      return
    }
    if (hours >= 21) {
      twentyOneToMidnight.push(meal)
    }
  })

  return new Map([
    [HoursRange.MidnightToThree, getRescueCarbsAveragePerRange(midnightToThree)],
    [HoursRange.ThreeToSix, getRescueCarbsAveragePerRange(threeToSix)],
    [HoursRange.SixToNine, getRescueCarbsAveragePerRange(sixToNine)],
    [HoursRange.NineToTwelve, getRescueCarbsAveragePerRange(nineToTwelve)],
    [HoursRange.TwelveToFifteen, getRescueCarbsAveragePerRange(twelveToFifteen)],
    [HoursRange.FifteenToEighteen, getRescueCarbsAveragePerRange(fifteenToEighteen)],
    [HoursRange.EighteenToTwentyOne, getRescueCarbsAveragePerRange(eighteenToTwentyOne)],
    [HoursRange.TwentyOneToMidnight, getRescueCarbsAveragePerRange(twentyOneToMidnight)]
  ])
}

function getRescueCarbsAveragePerRange(meals: Meal[]): RescueCarbsAveragePerRange {
  const totalNumberOfRescueCarbs = meals.length

  const confirmedCarbs = meals.map((meal) =>  meal.nutrition.carbohydrate.net).length
  const recommendedCarbs = meals.map((meal) => meal.prescribedNutrition?.carbohydrate.net).length


  const overrideValues = meals.reduce(( totalCarbs, meal) => {
    if(meal.prescribedNutrition){
      return totalCarbs + ( meal.nutrition.carbohydrate.net - meal.prescribedNutrition.carbohydrate.net)
    }
    else{
      return 0
    }
  }, 0)

  console.log("override",overrideValues)

  return {
    totalNumberOfRescueCarbs,
    confirmedCarbs,
    recommendedCarbs,
    override: overrideValues / totalNumberOfRescueCarbs
  }
}


interface CarbsStatisticsAdapter {
  getCarbsData: (meal: Meal[], wizard: Wizard[], numDays: number, dateFilter: DateFilter) => CarbsStatistics
  getRescueCarbsAverageStatistics: (meals: Meal[], numberOfDays: number, dateFilter: DateFilter) => RescueCarbsAverageStatistics
}

export const CarbsStatisticsService: CarbsStatisticsAdapter = {
  getCarbsData,
  getRescueCarbsAverageStatistics
}
