/*
 * Copyright (c) 2023-2025, Diabeloop
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

import { diffDays, MS_IN_DAY, MS_IN_MIN } from '../time/time.service'
import type Cbg from '../../models/medical/datum/cbg.model'
import type Smbg from '../../models/medical/datum/smbg.model'
import type {
  AverageGlucoseStatistics,
  BgBounds,
  CbgRangeStatistics,
  CoefficientOfVariationStatistics,
  GlucoseManagementIndicatoStatistics,
  SensorUsageStatistics,
  StandardDevStatistics
} from '../../models/statistics/glycemia-statistics.model'
import { ClassificationType } from '../../models/statistics/enum/bg-classification.enum'
import CbgService, { convertBG } from '../medical/datum/cbg.service'
import SmbgService from '../medical/datum/smbg.service'
import type DateFilter from '../../models/time/date-filter.model'
import type Bg from '../../models/medical/datum/bg.model'
import { type BgUnit, MGDL_UNITS, MMOLL_UNITS } from '../../models/medical/datum/bg.model'
import { getWeekDaysFilter, sumValues } from './statistics.utils'

export const TIGHT_RANGE_BOUNDS = {
  lower: 70,
  upper: 140
}

export function classifyBgValue(bgBounds: BgBounds, bgValue: number, classificationType: ClassificationType): keyof CbgRangeStatistics {
  if (bgValue <= 0) {
    throw new Error('You must provide a positive, numerical blood glucose value to categorize!')
  }
  const { veryLowThreshold, targetLowerBound, targetUpperBound, veryHighThreshold } = bgBounds
  if (classificationType === ClassificationType.FiveWay) {
    if (bgValue < veryLowThreshold) {
      return 'veryLow'
    } else if (bgValue >= veryLowThreshold && bgValue < targetLowerBound) {
      return 'low'
    } else if (bgValue > targetUpperBound && bgValue <= veryHighThreshold) {
      return 'high'
    } else if (bgValue > veryHighThreshold) {
      return 'veryHigh'
    }
    return 'target'
  }
  if (bgValue < targetLowerBound) {
    return 'low'
  } else if (bgValue > targetUpperBound) {
    return 'high'
  }
  return 'target'
}

const isInTightRange = (bgValue: number): boolean => {
  return bgValue >= TIGHT_RANGE_BOUNDS.lower && bgValue <= TIGHT_RANGE_BOUNDS.upper
}

const cgmSampleFrequency = (cgmDeviceName: string): number => (
  cgmDeviceName.startsWith('AbbottFreeStyleLibre') ? 15 * MS_IN_MIN : 5 * MS_IN_MIN
)

const getCgmTotalDuration = (cbgData: Cbg[]): number => (
  cbgData.reduce((duration, cbg) => duration + cgmSampleFrequency(cbg.deviceName), 0)
)

const meanValues = (values: number[]): number => (
  values.length === 0 ? Number.NaN : sumValues(values) / values.length
)

function getTimeInRangeData(cbgData: Cbg[], bgBounds: BgBounds, numDays: number, dateFilter: DateFilter): CbgRangeStatistics {
  const filteredCbg = CbgService.filterOnDate(cbgData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const durationInRange = filteredCbg.reduce(
    (result, cbg) => {
      const classification = classifyBgValue(bgBounds, cbg.value, ClassificationType.FiveWay)
      const duration = cgmSampleFrequency(cbg.deviceName)
      result[classification] += duration
      result.total += duration
      return result
    },
    {
      veryLow: 0,
      low: 0,
      target: 0,
      high: 0,
      veryHigh: 0,
      total: 0
    }
  )

  if (numDays > 1) {
    return {
      veryLow: durationInRange.veryLow / durationInRange.total * MS_IN_DAY,
      low: durationInRange.low / durationInRange.total * MS_IN_DAY,
      target: durationInRange.target / durationInRange.total * MS_IN_DAY,
      high: durationInRange.high / durationInRange.total * MS_IN_DAY,
      veryHigh: durationInRange.veryHigh / durationInRange.total * MS_IN_DAY,
      total: durationInRange.total
    }
  }
  return durationInRange
}

function getTimeInTightRangeData(cbgData: Cbg[], numDays: number, dateFilter: DateFilter): { value: number, total: number } {
  const filteredCbg = CbgService.filterOnDate(cbgData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const durationInRange = filteredCbg.reduce(
    (result, cbg) => {
      const isInRange = isInTightRange(cbg.value)
      const duration = cgmSampleFrequency(cbg.deviceName)

      if (isInRange) {
        result.value += duration
      }

      result.total += duration
      return result
    },
    {
      value: 0,
      total: 0
    }
  )

  if (numDays > 1) {
    return {
      value: durationInRange.value / durationInRange.total * MS_IN_DAY,
      total: durationInRange.total
    }
  }
  return durationInRange
}

function getReadingsInRangeData(smbgData: Smbg[], bgBounds: BgBounds, numDays: number, dateFilter: DateFilter): CbgRangeStatistics {
  const filteredSmbg = SmbgService.filterOnDate(smbgData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const readingsInRange = filteredSmbg.reduce(
    (result, smbg) => {
      const classification = classifyBgValue(bgBounds, smbg.value, ClassificationType.FiveWay)
      result[classification]++
      result.total++
      return result
    },
    {
      veryLow: 0,
      low: 0,
      target: 0,
      high: 0,
      veryHigh: 0,
      total: 0
    }
  )
  if (numDays > 1) {
    return {
      veryLow: readingsInRange.veryLow / numDays,
      low: readingsInRange.low / numDays,
      target: readingsInRange.target / numDays,
      high: readingsInRange.high / numDays,
      veryHigh: readingsInRange.veryHigh / numDays,
      total: readingsInRange.total
    }
  }
  return readingsInRange
}

function getSensorUsage(cbgData: Cbg[], dateFilter: DateFilter): SensorUsageStatistics {
  const filteredCbg = CbgService.filterOnDate(cbgData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const totalDuration = getCgmTotalDuration(filteredCbg)

  const total = dateFilter.end - dateFilter.start

  return {
    sensorUsage: totalDuration,
    total
  }
}

function getAverageGlucoseData(bgData: Cbg[] | Smbg[], dateFilter: DateFilter): AverageGlucoseStatistics {
  const filteredBg = CbgService.filterOnDate(bgData as Cbg[], dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter)) as Bg[]
  const totalBgValue = filteredBg.reduce((sum, bgData) => sum + bgData.value, 0)
  const numberOfBg = filteredBg.length
  return {
    averageGlucose: totalBgValue / numberOfBg,
    total: numberOfBg
  }
}

function getCoefficientOfVariationData(bgData: Cbg[] | Smbg[], dateFilter: DateFilter): CoefficientOfVariationStatistics {
  const filteredBg = CbgService.filterOnDate(bgData as Cbg[], dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const average = getAverageGlucoseData(filteredBg, dateFilter)
  const noDataStatistics = {
    insufficientData: true,
    coefficientOfVariation: Number.NaN,
    total: average.total
  }

  const MIN_CBG_FOR_VARIATION_COEF = 3
  if (average.total < MIN_CBG_FOR_VARIATION_COEF) {
    return noDataStatistics
  }

  const initialAcc: Record<string, number[]> = {}
  const bgValueByDay = filteredBg.reduce((current, bgData) => {
    if (current[bgData.localDate] === undefined) {
      current[bgData.localDate] = [bgData.value]
      return { ...current }
    }
    current[bgData.localDate].push(bgData.value)
    return { ...current }
  }, initialAcc)

  const coefficientOfVariationByDate = Object.keys(bgValueByDay).reduce((current: number[], localDate): number[] => {
    const numBg = bgValueByDay[localDate].length
    if (numBg >= 3) {
      const avgGlucose = meanValues(bgValueByDay[localDate])
      const squaredDiffs = bgValueByDay[localDate].map((bgValue: number) => (bgValue - avgGlucose) ** 2)
      const sumSquaredDiffs = sumValues(squaredDiffs)
      const standardDeviation = Math.sqrt(sumSquaredDiffs / (numBg - 1))
      return [...current, standardDeviation / avgGlucose * 100]
    }
    return [...current]
  }, [])
  if (coefficientOfVariationByDate.length === 0) {
    return noDataStatistics
  }
  return {
    insufficientData: false,
    coefficientOfVariation: meanValues(coefficientOfVariationByDate),
    total: average.total
  }
}

function getGlucoseManagementIndicatorData(cbgData: Cbg[], bgUnit: BgUnit, dateFilter: DateFilter): GlucoseManagementIndicatoStatistics {
  const insufficientData = {
    glucoseManagementIndicator: Number.NaN,
    insufficientData: true
  }
  if (diffDays(dateFilter.start, dateFilter.end) < 14) {
    return insufficientData
  }

  const filteredCbg = CbgService.filterOnDate(cbgData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const totalCbgDuration = getCgmTotalDuration(filteredCbg)
  // Duration must be at least 70% of 14 days
  const SEVENTY_PERCENT = 0.7
  if (totalCbgDuration < 14 * MS_IN_DAY * SEVENTY_PERCENT) {
    return insufficientData
  }

  const { averageGlucose } = getAverageGlucoseData(filteredCbg, dateFilter)
  const averageGlucoseMgdl = bgUnit === MGDL_UNITS ? averageGlucose : convertBG(averageGlucose, MMOLL_UNITS)

  return {
    // This is a magic formula... https://www.jaeb.org/gmi/
    glucoseManagementIndicator: (3.31 + 0.02392 * averageGlucoseMgdl),
    insufficientData: false
  }
}

function getStandardDevData(bgData: Cbg[] | Smbg[], dateFilter: DateFilter): StandardDevStatistics {
  const filteredBg = CbgService.filterOnDate(bgData as Cbg[], dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const average = getAverageGlucoseData(filteredBg, dateFilter)
  if (average.total < 3) {
    return {
      ...average,
      insufficientData: true,
      standardDeviation: Number.NaN
    }
  }
  const squaredDiffs = filteredBg.map((bgData) => (bgData.value - average.averageGlucose) ** 2)
  const standardDeviation = Math.sqrt(sumValues(squaredDiffs) / (filteredBg.length - 1))

  return {
    ...average,
    insufficientData: false,
    standardDeviation
  }
}

export interface GlycemiaStatisticsAdapter {
  getReadingsInRangeData: (smbgData: Smbg[], bgBounds: BgBounds, numDays: number, dateFilter: DateFilter) => CbgRangeStatistics
  getTimeInRangeData: (cbgData: Cbg[], bgBounds: BgBounds, numDays: number, dateFilter: DateFilter) => CbgRangeStatistics
  getTimeInTightRangeData: (cbgData: Cbg[], numDays: number, dateFilter: DateFilter) => { value: number, total: number }
  getSensorUsage: (cbgData: Cbg[], dateFilter: DateFilter) => SensorUsageStatistics
  getAverageGlucoseData: (bgData: Cbg[] | Smbg[], dateFilter: DateFilter) => AverageGlucoseStatistics
  getCoefficientOfVariationData: (bgData: Cbg[] | Smbg[], dateFilter: DateFilter) => CoefficientOfVariationStatistics
  getGlucoseManagementIndicatorData: (cbgData: Cbg[], bgUnit: BgUnit, dateFilter: DateFilter) => GlucoseManagementIndicatoStatistics
  getStandardDevData: (bgData: Cbg[] | Smbg[], dateFilter: DateFilter) => StandardDevStatistics
}

export const GlycemiaStatisticsService: GlycemiaStatisticsAdapter = {
  getReadingsInRangeData,
  getTimeInRangeData,
  getTimeInTightRangeData,
  getSensorUsage,
  getAverageGlucoseData,
  getCoefficientOfVariationData,
  getGlucoseManagementIndicatorData,
  getStandardDevData
}
