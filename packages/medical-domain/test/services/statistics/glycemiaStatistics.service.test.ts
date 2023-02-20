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

import { type BgBounds } from '../../../src/domains/models/statistics/glycemia-statistics.model'
import type Cbg from '../../../src/domains/models/medical/datum/cbg.model'
import Unit from '../../../src/domains/models/medical/datum/enums/unit.enum'
import type Smbg from '../../../src/domains/models/medical/datum/smbg.model'
import type DateFilter from '../../../src/domains/models/time/date-filter.model'
import { GlycemiaStatisticsService } from '../../../src/domains/repositories/statistics/glycemia-statistics.service'
import { MS_IN_DAY, MS_IN_MIN } from '../../../src/domains/repositories/time/time.service'
import { createRandomCbg, createRandomSmbg } from '../../models/data-generator'

const buildCbgData = (data: Array<[Date, number, string]>): Cbg[] => (
  data.map((cbgData) => (
    {
      ...createRandomCbg(cbgData[0]),
      units: Unit.MilligramPerDeciliter,
      value: cbgData[1],
      deviceName: cbgData[2]
    }
  ))
)

const buildSmbgData = (data: Array<[Date, number, string]>): Smbg[] => (
  data.map((smbgData) => (
    { ...createRandomSmbg(smbgData[0]), units: Unit.MilligramPerDeciliter, value: smbgData[1] }
  ))
)

const abbottDevice = 'AbbottFreeStyleLibre-XXX-XXXX'
const dexcomDevice = 'Dexcom-XXX-XXXX'

const veryLowCbg = 50
const lowCbg = 60
const targetCbg = 100
const highCbg = 190
const veryHighCbg = 260
const targetCbg2 = 120
const targetCbg3 = 150
const highCbg2 = 200

const bgDataSource: Array<[Date, number, string]> = [
  // data for one day and two days tests
  [new Date('2018-02-01T00:00:00.000Z'), veryLowCbg, abbottDevice],
  [new Date('2018-02-01T00:15:00.000Z'), lowCbg, abbottDevice],
  [new Date('2018-02-01T00:30:00.000Z'), targetCbg, abbottDevice],
  [new Date('2018-02-01T00:45:00.000Z'), highCbg, dexcomDevice],
  [new Date('2018-02-01T00:50:00.000Z'), veryHighCbg, dexcomDevice],
  // data for two days tests
  [new Date('2018-02-02T00:50:00.000Z'), targetCbg, dexcomDevice],
  // data for three days tests
  [new Date('2018-02-03T00:50:00.000Z'), targetCbg3, dexcomDevice],
  [new Date('2018-02-03T00:55:00.000Z'), highCbg2, dexcomDevice],
  [new Date('2018-02-03T01:00:00.000Z'), targetCbg2, dexcomDevice],
  // data 2020
  [new Date('2020-02-01T01:00:00.000Z'), targetCbg2, dexcomDevice],
  [new Date('2020-02-02T01:00:00.000Z'), targetCbg2, dexcomDevice],
  [new Date('2020-02-03T01:00:00.000Z'), targetCbg2, dexcomDevice]
]

const cbgData = buildCbgData(bgDataSource)
const smbgData = buildSmbgData(bgDataSource)

const bgBounds: BgBounds = {
  veryHighThreshold: 250,
  targetUpperBound: 180,
  targetLowerBound: 70,
  veryLowThreshold: 54
}

const dateFilterOneDay: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-02T00:00:00.000Z').valueOf()
}
const dateFilterTwoDays: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-03T00:00:00.000Z').valueOf()
}
const dateFilterThreeDays: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-04T00:00:00.000Z').valueOf()
}
const dateFilterThreeDays2020: DateFilter = {
  start: new Date('2020-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2020-02-04T00:00:00.000Z').valueOf()
}
const dateFilterTwoWeeks: DateFilter = {
  start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
  end: new Date('2018-02-15T00:00:00.000Z').valueOf()
}

describe('GlycemiaStatisticsService getTimeInRangeData', () => {
  it('should return time in range when viewing one day', () => {
    const stats = GlycemiaStatisticsService.getTimeInRangeData(cbgData, bgBounds, dateFilterOneDay)
    expect(stats).toEqual({
      veryLow: MS_IN_MIN * 15,
      low: MS_IN_MIN * 15,
      target: MS_IN_MIN * 15,
      high: MS_IN_MIN * 5,
      veryHigh: MS_IN_MIN * 5,
      total: MS_IN_MIN * 15 * 3 + MS_IN_MIN * 5 * 2
    })
  })
  it('should return time in range when viewing more than 1 day', () => {
    const stats = GlycemiaStatisticsService.getTimeInRangeData(cbgData, bgBounds, dateFilterTwoDays)
    expect(stats).toEqual({
      veryLow: MS_IN_MIN * 15,
      low: MS_IN_MIN * 15,
      target: MS_IN_MIN * 15 + MS_IN_MIN * 5,
      high: MS_IN_MIN * 5,
      veryHigh: MS_IN_MIN * 5,
      total: MS_IN_MIN * 15 * 3 + MS_IN_MIN * 5 * 3
    })
  })
})

describe('GlycemiaStatisticsService getReadingsInRangeData', () => {
  it('should return readings in range when viewing one day', () => {
    const stats = GlycemiaStatisticsService.getReadingsInRangeData(smbgData, bgBounds, dateFilterOneDay)
    expect(stats).toEqual({
      veryLow: 1,
      low: 1,
      target: 1,
      high: 1,
      veryHigh: 1,
      total: 5
    })
  })
  it('should return readings in range when viewing more than 1 day', () => {
    const stats = GlycemiaStatisticsService.getReadingsInRangeData(smbgData, bgBounds, dateFilterTwoDays)
    expect(stats).toEqual({
      veryLow: 1,
      low: 1,
      target: 2,
      high: 1,
      veryHigh: 1,
      total: 6
    })
  })
})

describe('GlycemiaStatisticsService getSensorUsage', () => {
  it('should return sensor usage when viewing one day', () => {
    const stats = GlycemiaStatisticsService.getSensorUsage(cbgData, 1, dateFilterOneDay)
    expect(stats).toEqual({
      sensorUsage: MS_IN_MIN * 15 * 3 + MS_IN_MIN * 5 * 2,
      total: MS_IN_DAY
    })
  })
  it('should return sensor usage when viewing more than 1 day', () => {
    const stats = GlycemiaStatisticsService.getSensorUsage(cbgData, 2, dateFilterTwoDays)
    expect(stats).toEqual({
      sensorUsage: MS_IN_MIN * 15 * 3 + MS_IN_MIN * 5 * 3,
      total: 2 * MS_IN_DAY
    })
  })
})

describe('GlycemiaStatisticsService getAverageGlucoseData', () => {
  it('should return average glucose for smbg when viewing one day', () => {
    const stats = GlycemiaStatisticsService.getAverageGlucoseData(smbgData, dateFilterOneDay)
    expect(stats).toEqual({
      averageGlucose: (veryLowCbg + lowCbg + targetCbg + highCbg + veryHighCbg) / 5,
      total: 5
    })
  })
  it('should return average glucose for cbg when viewing one day', () => {
    const stats = GlycemiaStatisticsService.getAverageGlucoseData(cbgData, dateFilterOneDay)
    expect(stats).toEqual({
      averageGlucose: (veryLowCbg + lowCbg + targetCbg + highCbg + veryHighCbg) / 5,
      total: 5
    })
  })
  it('should return average glucose for smbg  when viewing more than one day', () => {
    const stats = GlycemiaStatisticsService.getAverageGlucoseData(smbgData, dateFilterTwoDays)
    expect(stats).toEqual({
      averageGlucose: (veryLowCbg + lowCbg + 2 * targetCbg + highCbg + veryHighCbg) / 6,
      total: 6
    })
  })
  it('should return average glucose for cbg  when viewing more than one day', () => {
    const stats = GlycemiaStatisticsService.getAverageGlucoseData(cbgData, dateFilterTwoDays)
    expect(stats).toEqual({
      averageGlucose: (veryLowCbg + lowCbg + 2 * targetCbg + highCbg + veryHighCbg) / 6,
      total: 6
    })
  })
})

describe('GlycemiaStatisticsService getCoefficientOfVariationData', () => {
  it('should return the coefficient of variation when viewing one day', () => {
    const statsCbg = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData, dateFilterOneDay)
    const expected = {
      coefficientOfVariation: 68.47579720288888,
      insufficientData: false,
      total: 5
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getCoefficientOfVariationData(smbgData, dateFilterOneDay)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return the coefficient of variation when viewing two days', () => {
    const statsCbg = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData, dateFilterTwoDays)
    const expected = {
      coefficientOfVariation: 68.47579720288888,
      insufficientData: false,
      total: 6
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getCoefficientOfVariationData(smbgData, dateFilterTwoDays)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return the coefficient of variation when viewing three days', () => {
    const statsCbg = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData, dateFilterThreeDays)
    const expected = {
      coefficientOfVariation: 47.136149296106296,
      insufficientData: false,
      total: 9
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getCoefficientOfVariationData(smbgData, dateFilterThreeDays)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return no value coefficient of variation for 3 days having less than 3 values per day', () => {
    const statsCbg = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData, dateFilterThreeDays2020)
    const expected = {
      insufficientData: true,
      total: 3,
      coefficientOfVariation: Number.NaN
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getCoefficientOfVariationData(smbgData, dateFilterThreeDays2020)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return no value coefficient of variation when less than 3 bg values are available', () => {
    const statsCbg = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData.slice(0, 2), dateFilterOneDay)
    const expected = {
      insufficientData: true,
      total: 2,
      coefficientOfVariation: Number.NaN
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getCoefficientOfVariationData(smbgData.slice(0, 2), dateFilterOneDay)
    expect(statsSmbg).toEqual(expected)
  })
})

describe('GlycemiaStatisticsService getGlucoseManagementIndicatorData', () => {
  it('should return the GMI data when viewing at least 14 days of data and 70% coverage', () => {
    const dexcomRecordsPerDay = 24 * 60 / 5
    const numDexcomCbgForTwoWeeks = Math.ceil(dexcomRecordsPerDay * 0.7 * 14) // dexcomRecordsPerDay * .7(%required) * 14(days)
    const sufficientData = Array(numDexcomCbgForTwoWeeks).fill(cbgData[4])
    const stats = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(sufficientData, Unit.MilligramPerDeciliter, dateFilterTwoWeeks)
    expect(stats).toEqual({
      glucoseManagementIndicator: 9.5292,
      insufficientData: false,
      total: numDexcomCbgForTwoWeeks
    })
  })
  it('should return `NaN` when viewing less than 14 days of data', () => {
    const dexcomRecordsPerDay = 24 * 60 / 5
    const numDexcomCbgForTwoWeeks = Math.ceil(dexcomRecordsPerDay * 0.7 * 14) // dexcomRecordsPerDay * .7(%required) * 14(days)
    const insufficientData = Array(numDexcomCbgForTwoWeeks).fill(cbgData[4])
    const dateFilter13Days = {
      start: new Date('2018-02-01T00:00:00.000Z').valueOf(),
      end: new Date('2018-02-14T00:00:00.000Z').valueOf()
    }
    const stats = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(insufficientData, Unit.MilligramPerDeciliter, dateFilter13Days)
    expect(stats).toEqual({
      glucoseManagementIndicator: Number.NaN,
      insufficientData: true,
      total: Number.NaN
    })
  })
  it('should return `NaN` when not having enough CGM data', () => {
    const dexcomRecordsPerDay = 24 * 60 / 5
    const numDexcomCbgForTwoWeeks = Math.ceil(dexcomRecordsPerDay * 0.6 * 14)
    const insufficientData = Array(numDexcomCbgForTwoWeeks).fill(cbgData[4])

    const stats = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(insufficientData, Unit.MilligramPerDeciliter, dateFilterTwoWeeks)
    expect(stats).toEqual({
      glucoseManagementIndicator: Number.NaN,
      insufficientData: true,
      total: Number.NaN
    })
  })
})
describe('GlycemiaStatisticsService getStandardDevData', () => {
  it('should return the average glucose and standard deviation when viewing one day', () => {
    const statsCbg = GlycemiaStatisticsService.getStandardDevData(cbgData, dateFilterOneDay)
    const expected = {
      averageGlucose: (veryLowCbg + lowCbg + targetCbg + highCbg + veryHighCbg) / 5,
      insufficientData: false,
      total: 5,
      standardDeviation: 90.38805230781334
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getStandardDevData(smbgData, dateFilterOneDay)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return the coefficient of variation when viewing two days', () => {
    const statsCbg = GlycemiaStatisticsService.getStandardDevData(cbgData, dateFilterTwoDays)
    const expected = {
      averageGlucose: (veryLowCbg + lowCbg + 2 * targetCbg + highCbg + veryHighCbg) / 6,
      total: 6,
      insufficientData: false,
      standardDeviation: 81.89424074174366
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getStandardDevData(smbgData, dateFilterTwoDays)
    expect(statsSmbg).toEqual(expected)
  })
  it('should return true for insufficientData when less than 3 datums available', () => {
    const statsCbg = GlycemiaStatisticsService.getStandardDevData(cbgData.slice(0, 2), dateFilterTwoDays)
    const expected = {
      averageGlucose: (veryLowCbg + lowCbg) / 2,
      total: 2,
      insufficientData: true,
      standardDeviation: Number.NaN
    }
    expect(statsCbg).toEqual(expected)
    const statsSmbg = GlycemiaStatisticsService.getStandardDevData(smbgData.slice(0, 2), dateFilterTwoDays)
    expect(statsSmbg).toEqual(expected)
  })
})
