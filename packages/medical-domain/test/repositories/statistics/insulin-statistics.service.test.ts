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

import { BasalBolusStatisticsService } from '../../../src'
import {
  basalsData,
  bolusData,
  buildBasalsData,
  buildBolusData,
  dateFilterOneDay,
  dateFilterTwoDays,
  dateFilterTwoWeeks,
  MS_IN_HOUR
} from '../../mock/data.statistics.mock'

describe('Time In Auto Data', () => {
  it('should return the time spent in automated and manual basal delivery when viewing 1 day', () => {
    const basalData = buildBasalsData(basalsData)
    expect(BasalBolusStatisticsService.getTimeInAutoData(basalData, 1, dateFilterOneDay)).toEqual({
      auto: MS_IN_HOUR,
      manual: MS_IN_HOUR * 2,
      total: MS_IN_HOUR + MS_IN_HOUR * 2
    })
  })

  it('should return the avg daily time spent in automated and manual basal delivery when viewing more than 1 day', () => {
    const basalData = buildBasalsData(basalsData)
    expect(BasalBolusStatisticsService.getTimeInAutoData(basalData, 2, dateFilterTwoDays)).toEqual({
      auto: 1800000,
      manual: 3600000,
      total: 5400000
    })
})

describe('getBasalBolusData', () => {
  it('should return the total basal and bolus insulin delivery when viewing 1 day', () => {
    const basals = buildBasalsData(basalsData)
    const bolus = buildBolusData(bolusData)

    const basalBolusData = BasalBolusStatisticsService.getBasalBolusData(basals, bolus, 1, dateFilterOneDay)
    const expectBasalBolusData = {
      basal: 1.5,
      bolus: 15,
      total: 16.5
    }
    expect(basalBolusData).toEqual(expectBasalBolusData)
  })

  it('should return the avg daily total basal and bolus insulin delivery when viewing more than 1 day', () => {
    const basals = buildBasalsData(basalsData)
    const bolus = buildBolusData(bolusData)

    const basalBolusData = BasalBolusStatisticsService.getBasalBolusData(basals, bolus, 2, dateFilterTwoWeeks)
    const expectBasalBolusData = {
      basal: 1,
      bolus: 9.5,
      total: 10.5
    }
    expect(basalBolusData).toEqual(expectBasalBolusData)
  })
})
