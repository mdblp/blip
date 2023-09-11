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
import {
  bgDataSourceOneDay, bgDataSourceTwoDays,
  buildMealData,
  buildWizardData,
  dateFilterOneDay,
  dateFilterTwoDays
} from '../../mock/data.statistics.mock'
import { CarbsStatisticsService } from '../../../src'

describe('getCarbsData', () => {
  it('should return the total carbs from wizard and food data when viewing 1 day', () => {
    const mealData = buildMealData(bgDataSourceOneDay)
    const wizardData = buildWizardData(bgDataSourceOneDay)
    const carbsData = CarbsStatisticsService.getCarbsData(mealData, wizardData, 1, dateFilterOneDay)
    const expected = {
      mealCarbsPerDay: 25,
      rescueCarbsPerDay: 25,
      estimatedCarbsPerDay: 25,
      totalCarbsPerDay: 50,
      totalMealCarbsWithRescueCarbsEntries: 10,
      totalRescueCarbsEntries: 5
    }

    expect(carbsData).toEqual(expected)
  })

  it('should return the avg daily carbs from wizard and food data when viewing more than 1 day', () => {
    const mealData = buildMealData(bgDataSourceTwoDays)
    const wizardData = buildWizardData(bgDataSourceTwoDays)
    const carbsData = CarbsStatisticsService.getCarbsData(mealData, wizardData, 2, dateFilterTwoDays)
    const expected = {
      mealCarbsPerDay: 2.5,
      estimatedCarbsPerDay: 2.5,
      rescueCarbsPerDay: 2.5,
      totalCarbsPerDay: 5,
      totalMealCarbsWithRescueCarbsEntries: 2,
      totalRescueCarbsEntries: 1
    }
    expect(carbsData).toEqual(expected)
  })
})
