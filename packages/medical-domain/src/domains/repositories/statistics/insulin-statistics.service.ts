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

import type DateFilter from '../../models/time/date-filter.model'
import type Bolus from '../../models/medical/datum/bolus.model'
import type Basal from '../../models/medical/datum/basal.model'
import BasalService from '../medical/datum/basal.service'
import BolusService from '../medical/datum/bolus.service'
import {
  type BasalBolusStatistics,
  ManualBolusAveragePerRange,
  ManualBolusAverageStatistics,
  type TotalInsulinAndWeightStatistics
} from '../../models/statistics/basal-bolus-statistics.model'
import { buildHoursRangeMap, getWeekDaysFilter, roundValue } from './statistics.utils'
import { type ParameterConfig, PumpSettings } from '../../models/medical/datum/pump-settings.model'
import { type TimeInAutoStatistics } from '../../models/statistics/time-in-auto.model'
import { BolusSubtype, Prescriptor } from '../../../index'
import { getHours, MS_IN_DAY } from '../time/time.service'
import { HoursRange } from '../../models/statistics/satistics.model'
import type Wizard from '../../models/medical/datum/wizard.model'
import WizardService from '../medical/datum/wizard.service'

function resamplingDuration(basals: Basal[], start: number, end: number): Basal[] {
  return basals.map(basal => {
    const basalEpochStart = basal.epoch < start ? start : basal.epoch
    const basalEpochEnd = basal.epochEnd > end ? end : basal.epochEnd
    basal.duration = basalEpochEnd - basalEpochStart
    return basal
  })
}

function getWeight(allPumpSettings: PumpSettings[]): ParameterConfig | undefined {
  const lastPumpSettings = allPumpSettings[allPumpSettings.length - 1]

  if (!lastPumpSettings) {
    return undefined
  }

  const weight = lastPumpSettings.payload.parameters.find(parameter => parameter.name === 'WEIGHT')
  return weight ?? undefined
}

function getBasalBolusData(basalsData: Basal[], bolus: Bolus[], mealBoluses: Wizard[], numDays: number, dateFilter: DateFilter): BasalBolusStatistics {
  if (numDays === 0) {
    return {
      bolus:0,
      basal:0,
      totalMealBoluses:0,
      totalManualBoluses:0,
      totalPenBoluses:0,
      totalCorrectiveBolusesAndBasals:0,
      total:0
    }
  }

  // Basal computing
  const filteredBasal = BasalService.filterOnDate(basalsData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const basalsResampled = resamplingDuration(filteredBasal, dateFilter.start, dateFilter.end)
  const totalBasal = basalsResampled.reduce((accumulator, basal) => accumulator + (basal.duration / 3_600_000 * basal.rate), 0)

  // Bolus computing
  const filteredBolus = BolusService.filterOnDate(bolus, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filteredMealBoluses = WizardService.filterOnDate(mealBoluses, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const totalMealBoluses = filteredMealBoluses.reduce((total, mealBolus) => {
    if (mealBolus.bolus) {
      return total + mealBolus.bolus.normal
    }
    return total
  }, 0)

  const totalCorrectiveBoluses = filteredBolus.reduce((total, bolus) => {
    if (bolus.prescriptor === Prescriptor.Auto || bolus.prescriptor === Prescriptor.Hybrid) {
      return total + bolus.normal
    }
    return total
  }, 0)

  const totalManualBoluses = filteredBolus.reduce((total, bolus) => {
    if (bolus.prescriptor === Prescriptor.Manual && bolus.subType != BolusSubtype.Pen) {
      return total + bolus.normal
    }
    return total
  }, 0)

  const totalPenBoluses = filteredBolus.reduce((total, bolus) => {
    if (bolus.subType === BolusSubtype.Pen) {
      return total + bolus.normal
    }
    return total
  }, 0)

  const totalCorrectiveBolusesAndBasal = totalBasal + totalCorrectiveBoluses
  const total = totalMealBoluses + totalManualBoluses + totalPenBoluses + totalCorrectiveBolusesAndBasal
  const totalBoluses = totalMealBoluses + totalManualBoluses + totalPenBoluses + totalCorrectiveBoluses

  return {
    bolus: totalBoluses / numDays,
    basal: totalBasal / numDays,
    totalMealBoluses: totalMealBoluses / numDays,
    totalManualBoluses: totalManualBoluses / numDays,
    totalPenBoluses: totalPenBoluses / numDays,
    totalCorrectiveBolusesAndBasals: totalCorrectiveBolusesAndBasal / numDays,
    total: total / numDays
  }
}

function getTotalInsulinAndWeightData(basalsData: Basal[], bolusData: Bolus[], mealBoluses: Wizard[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]): TotalInsulinAndWeightStatistics {
  const weight = getWeight(pumpSettings)
  const { total } = getBasalBolusData(basalsData, bolusData, mealBoluses, numDays, dateFilter)

  return {
    totalInsulin: total,
    weight
  }
}

function getAutomatedAndManualBasalDuration(basalsData: Basal[], dateFilter: DateFilter): TimeInAutoStatistics {
  const filteredBasal = BasalService.filterOnDate(basalsData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const basalData = resamplingDuration(filteredBasal, dateFilter.start, dateFilter.end)
  const manualBasal = basalData.filter(manualBasal => manualBasal.subType !== 'automated')
  const manualBasalDuration = manualBasal.reduce((accumulator, manualBasal) => accumulator + manualBasal.duration, 0)
  const automatedBasals = basalData.filter(automatedBasal => automatedBasal.subType === 'automated')
  const automatedBasalDuration = automatedBasals.reduce((accumulator, automaticBasal) => accumulator + automaticBasal.duration, 0)
  const numOfDay = (dateFilter.end - dateFilter.start) / MS_IN_DAY
  const automatedBasalPerDay = automatedBasalDuration / numOfDay
  const manualBasalPerDay = manualBasalDuration / numOfDay
  const total = automatedBasalPerDay + manualBasalPerDay
  const automatedPercentage = Math.round(100 * automatedBasalPerDay / total)
  const manualPercentage = Math.round(100 * manualBasalPerDay / total)


  return {
    automatedBasalDuration: automatedBasalPerDay ,
    manualBasalDuration: manualBasalPerDay ,
    automatedPercentage,
    manualPercentage

  }
}

function getManualBolusAverageStatistics(boluses: Bolus[], dateFilter: DateFilter): ManualBolusAverageStatistics {
  const carbsMap = buildHoursRangeMap<Bolus>()

  const midnightToThree = carbsMap.get(HoursRange.MidnightToThree)as Bolus[]
  const threeToSix = carbsMap.get(HoursRange.ThreeToSix)as Bolus[]
  const sixToNine = carbsMap.get(HoursRange.SixToNine)as Bolus[]
  const nineToTwelve = carbsMap.get(HoursRange.NineToTwelve)as Bolus[]
  const twelveToFifteen = carbsMap.get(HoursRange.TwelveToFifteen)as Bolus[]
  const fifteenToEighteen = carbsMap.get(HoursRange.FifteenToEighteen)as Bolus[]
  const eighteenToTwentyOne = carbsMap.get(HoursRange.EighteenToTwentyOne)as Bolus[]
  const twentyOneToMidnight = carbsMap.get(HoursRange.TwentyOneToMidnight)as Bolus[]


  const manualBoluses = boluses.filter(bolus => bolus.prescriptor === Prescriptor.Manual)
  const filteredManualBoluses = BolusService.filterOnDate(manualBoluses, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  filteredManualBoluses.forEach((bolus) => {
    const hours = getHours(bolus.normalTime, bolus.timezone)

    if (hours < 3) {
      midnightToThree.push(bolus)
      return
    }
    if (hours >= 3 && hours < 6) {
      threeToSix.push(bolus)
      return
    }
    if (hours >= 6 && hours < 9) {
      sixToNine.push(bolus)
      return
    }
    if (hours >= 9 && hours < 12) {
      nineToTwelve.push(bolus)
      return
    }
    if (hours >= 12 && hours < 15) {
      twelveToFifteen.push(bolus)
      return
    }
    if (hours >= 15 && hours < 18) {
      fifteenToEighteen.push(bolus)
      return
    }
    if (hours >= 18 && hours < 21) {
      eighteenToTwentyOne.push(bolus)
      return
    }
    if (hours >= 21) {
      twentyOneToMidnight.push(bolus)
    }
  })

  return new Map([
    [HoursRange.MidnightToThree, getManualBolusAveragePerRange(midnightToThree)],
    [HoursRange.ThreeToSix, getManualBolusAveragePerRange(threeToSix)],
    [HoursRange.SixToNine, getManualBolusAveragePerRange(sixToNine)],
    [HoursRange.NineToTwelve, getManualBolusAveragePerRange(nineToTwelve)],
    [HoursRange.TwelveToFifteen, getManualBolusAveragePerRange(twelveToFifteen)],
    [HoursRange.FifteenToEighteen, getManualBolusAveragePerRange(fifteenToEighteen)],
    [HoursRange.EighteenToTwentyOne, getManualBolusAveragePerRange(eighteenToTwentyOne)],
    [HoursRange.TwentyOneToMidnight, getManualBolusAveragePerRange(twentyOneToMidnight)]
  ])
}

function getManualBolusAveragePerRange(boluses: Bolus[]): ManualBolusAveragePerRange {
  const confirmedDoseValues = boluses.reduce((totalDose, bolus) => totalDose + (bolus.normal ?? 0), 0)
  const numberOfInjections = boluses.length
  const confirmedDose = numberOfInjections === 0 ? 0 : roundValue (confirmedDoseValues / numberOfInjections)
  return {
    confirmedDose,
    numberOfInjections
  }
}

interface BasalBolusStatisticsAdapter {
  getBasalBolusData: (basals: Basal[], bolus: Bolus[], mealBoluses: Wizard[], numDays: number, dateFilter: DateFilter) => BasalBolusStatistics
  getTotalInsulinAndWeightData: (basals: Basal[], bolus: Bolus[], mealBoluses: Wizard[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]) => TotalInsulinAndWeightStatistics
  getAutomatedAndManualBasalDuration: (basalsData: Basal[], dateFilter: DateFilter) => TimeInAutoStatistics
  getManualBolusAverageStatistics: (boluses: Bolus[], dateFilter: DateFilter) => ManualBolusAverageStatistics
}

export const BasalBolusStatisticsService: BasalBolusStatisticsAdapter = {
  getAutomatedAndManualBasalDuration,
  getBasalBolusData,
  getTotalInsulinAndWeightData,
  getManualBolusAverageStatistics
}
