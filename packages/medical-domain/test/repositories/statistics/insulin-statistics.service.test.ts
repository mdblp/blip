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

import { BasalBolusStatisticsService, HoursRange } from '../../../src'
import {
  basalsData,
  bolusData,
  buildBasalsData,
  buildBolusData,
  dateFilterOneDay,
  dateFilterTwoWeeks,
  dateFilterTwoDays,
  MS_IN_HOUR,
  manualBolusData,
  buildSingleWizardData
} from '../../mock/data.statistics.mock'
import { ManualBolusAverageStatistics } from '../../../src/domains/models/statistics/basal-bolus-statistics.model'

describe('Time In Auto Data', () => {
  it('should return the time spent in automated and manual basal delivery when viewing 1 day', () => {
    const basalData = buildBasalsData(basalsData)
    expect(BasalBolusStatisticsService.getAutomatedAndManualBasalDuration(basalData, dateFilterOneDay)).toEqual({
      automatedBasalDuration: MS_IN_HOUR,
      automatedPercentage: 33,
      manualBasalDuration: 7200000,
      manualPercentage: 67


    })
  })

  it('should return the avg daily time spent in automated and manual basal delivery when viewing more than 1 day', () => {
    const basalData = buildBasalsData(basalsData)
    expect(BasalBolusStatisticsService.getAutomatedAndManualBasalDuration(basalData, dateFilterTwoDays)).toEqual({
      automatedBasalDuration: 1800000,
      automatedPercentage: 20,
      manualBasalDuration: 7200000,
      manualPercentage: 80
    })
  })
})

describe('getBasalBolusData', () => {
  it('should return the total basal and bolus insulin delivery when viewing 1 day', () => {
    const basals = buildBasalsData(basalsData)
    const bolus = buildBolusData(bolusData)
    const wizard = buildSingleWizardData(bolus[0].id)

    const basalBolusData = BasalBolusStatisticsService.getBasalBolusData(basals, bolus, [wizard], 1, dateFilterOneDay)
    const expectBasalBolusData = {
      totalCorrectiveBolusesAndBasals: 16.5,
      totalManualBoluses: 0,
      totalMealBoluses: 1,
      totalPenBoluses: 4,
      total: 21.5,
      basal: 1.5,
      bolus: 20
    }
    expect(basalBolusData).toEqual(expectBasalBolusData)
  })

  it('should return the avg daily total basal and bolus insulin delivery when viewing more than 1 day', () => {
    const basals = buildBasalsData(basalsData)
    const bolus = buildBolusData(bolusData)

    const basalBolusData = BasalBolusStatisticsService.getBasalBolusData(basals, bolus, [], 2, dateFilterTwoWeeks)
    const expectBasalBolusData = {
      totalCorrectiveBolusesAndBasals: 10.75,
      totalManualBoluses: 0,
      totalMealBoluses: 0,
      totalPenBoluses: 2,
      total: 12.75,
      basal: 1.25,
      bolus: 11.5
    }
    expect(basalBolusData).toEqual(expectBasalBolusData)
  })
})

describe('getManualBolusAverageStatistics', () => {
  it('should return a map with ranges of hours and manual bolus average statistics', () => {
    const boluses = buildBolusData(manualBolusData)
    const manualBoluses = BasalBolusStatisticsService.getManualBolusAverageStatistics(boluses, dateFilterTwoWeeks)
    const expected: ManualBolusAverageStatistics = new Map([
      [HoursRange.MidnightToThree, { confirmedDose: 3, numberOfInjections: 2 }],
      [HoursRange.ThreeToSix, { confirmedDose: 5, numberOfInjections: 1 }],
      [HoursRange.SixToNine, { confirmedDose: 0, numberOfInjections: 0 }],
      [HoursRange.NineToTwelve, { confirmedDose: 0, numberOfInjections: 0 }],
      [HoursRange.TwelveToFifteen, { confirmedDose: 2, numberOfInjections: 2 }],
      [HoursRange.FifteenToEighteen, { confirmedDose: 0, numberOfInjections: 0 }],
      [HoursRange.EighteenToTwentyOne, { confirmedDose: 4, numberOfInjections: 2 }],
      [HoursRange.TwentyOneToMidnight, { confirmedDose: 1, numberOfInjections: 3 }]
    ])
    expect(manualBoluses).toEqual(expected)
  })
})
