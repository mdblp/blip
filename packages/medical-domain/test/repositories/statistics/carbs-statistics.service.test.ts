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
  bgDataSourceOneDay,
  bgDataSourceTwoDays,
  bgDataSourceTwoWeeks,
  buildRescueCarbsAutomatedData,
  buildRescueCarbsData,
  buildRescueCarbsManualData,
  buildWizardData,
  dateFilterOneDay,
  dateFilterTwoDays,
  dateFilterTwoWeeks
} from '../../mock/data.statistics.mock'
import { CarbsStatisticsService, HoursRange } from '../../../src'
import { RescueCarbsAverageStatistics } from '../../../src/domains/models/statistics/carbs-statistics.model'

describe('getCarbsData', () => {
  it('should return the total carbs from wizard and food data when viewing 1 day', () => {
    const mealData = buildRescueCarbsData(bgDataSourceOneDay)
    const wizardData = buildWizardData(bgDataSourceOneDay)
    const carbsData = CarbsStatisticsService.getCarbsData(mealData, wizardData, 1, dateFilterOneDay)
    const expected = {
      mealCarbsPerDay: 25,
      rescueCarbsPerDay: 25,
      totalCarbsPerDay: 50,
      totalMealCarbsWithRescueCarbsEntries: 10,
      totalRescueCarbsEntries: 5
    }

      expect(carbsData).toEqual(expected)
    })

  it('should return the avg daily carbs from wizard and food data when viewing more than 1 day', () => {
    const mealData = buildRescueCarbsData(bgDataSourceTwoDays)
    const wizardData = buildWizardData(bgDataSourceTwoDays)
    const carbsData = CarbsStatisticsService.getCarbsData(mealData, wizardData, 2, dateFilterTwoDays)
    const expected = {
      mealCarbsPerDay: 2.5,
      rescueCarbsPerDay: 2.5,
      totalCarbsPerDay: 5,
      totalMealCarbsWithRescueCarbsEntries: 2,
      totalRescueCarbsEntries: 1
    }
    expect(carbsData).toEqual(expected)
  })

  describe('getRescueCarbsAverageStatistics', () => {
    it('should return a map with ranges of hours and rescue carbs average statistics', () => {
      const manualRescueCarbs = buildRescueCarbsManualData([[new Date('2018-02-01T09:33:00.000Z'), 'deviceId']])
      const automatedRescueCarbs = buildRescueCarbsAutomatedData([[new Date('2018-02-01T16:33:00.000Z'), 'deviceId']])
      const rescueCarbs = [...buildRescueCarbsData(bgDataSourceTwoWeeks), ...manualRescueCarbs, ...automatedRescueCarbs]
      const rescueCarbsStatistics = CarbsStatisticsService.getRescueCarbsAverageStatistics(rescueCarbs, dateFilterTwoWeeks)
      const expected: RescueCarbsAverageStatistics = new Map([
        // Hybrid rescue carbs (modified)
        [HoursRange.MidnightToThree, { averageRecommendedCarb: 2, numberOfModifiedCarbs: 3, rescueCarbsOverrideAverage: 3, numberOfRescueCarbs: 3 }],
        // Hybrid rescue carbs (modified)
        [HoursRange.ThreeToSix, { averageRecommendedCarb: 2, numberOfModifiedCarbs: 3, rescueCarbsOverrideAverage: 3, numberOfRescueCarbs: 3 }],
        // No rescue carb
        [HoursRange.SixToNine, { averageRecommendedCarb: 0, numberOfModifiedCarbs: 0, rescueCarbsOverrideAverage: 0, numberOfRescueCarbs: 0 }],
        // Manual rescue carb
        [HoursRange.NineToTwelve, { averageRecommendedCarb: 0, numberOfModifiedCarbs: 0, rescueCarbsOverrideAverage: 0, numberOfRescueCarbs: 1 }],
        // Hybrid rescue carbs (modified)
        [HoursRange.TwelveToFifteen, { averageRecommendedCarb: 2, numberOfModifiedCarbs: 3, rescueCarbsOverrideAverage: 3, numberOfRescueCarbs: 3 }],
        // Automated rescue carb not modified
        [HoursRange.FifteenToEighteen, { averageRecommendedCarb: 5, numberOfModifiedCarbs: 0, rescueCarbsOverrideAverage: 0, numberOfRescueCarbs: 1 }],
        // Hybrid rescue carbs (modified)
        [HoursRange.EighteenToTwentyOne, { averageRecommendedCarb: 2, numberOfModifiedCarbs: 3, rescueCarbsOverrideAverage: 3, numberOfRescueCarbs: 3 }],
        // Hybrid rescue carbs (modified)
        [HoursRange.TwentyOneToMidnight, { averageRecommendedCarb: 2, numberOfModifiedCarbs: 3, rescueCarbsOverrideAverage: 3, numberOfRescueCarbs: 3 }]
      ])
      expect(rescueCarbsStatistics).toEqual(expected)
    })
  })
})
