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

import type DateFilter from '../../models/time/date-filter.model'
import type Bolus from '../../models/medical/datum/bolus.model'
import type Basal from '../../models/medical/datum/basal.model'
import BasalService from '../medical/datum/basal.service'
import BolusService from '../medical/datum/bolus.service'
import {
  type BasalBolusStatistics,
  type TotalInsulinAndWeightStatistics
} from '../../models/statistics/basal-bolus-statistics.model'
import { getWeekDaysFilter } from './statistics.utils'
import type PumpSettings from '../../models/medical/datum/pump-settings.model'
import { type ParameterConfig } from '../../models/medical/datum/pump-settings.model'
import { type TimeInAutoStatistics } from '../../models/statistics/time-in-auto.model'
import { TimeService } from '../../../index'

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

function getBasalBolusData(basalsData: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter): BasalBolusStatistics {
  if (numDays === 0) {
    return {
      bolus: 0,
      basal: 0,
      total: 0
    }
  }

  const filteredBasal = BasalService.filterOnDate(basalsData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filteredBolus = BolusService.filterOnDate(bolus, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const basalData = resamplingDuration(filteredBasal, dateFilter.start, dateFilter.end)
  const bolusTotal = filteredBolus.reduce((accumulator, bolus) => accumulator + bolus.normal, 0)
  const basalTotal = basalData.reduce((accumulator, basal) => accumulator + (basal.duration / 3_600_000 * basal.rate), 0)
  const totalBasalBolus = bolusTotal + basalTotal

  return {
    bolus: bolusTotal / numDays,
    basal: basalTotal / numDays,
    total: totalBasalBolus / numDays

  }
}

function getTotalInsulinAndWeightData(basalsData: Basal[], bolusData: Bolus[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]): TotalInsulinAndWeightStatistics {
  const weight = getWeight(pumpSettings)
  const { basal, bolus } = getBasalBolusData(basalsData, bolusData, numDays, dateFilter)
  const totalInsulin = [basal, bolus].reduce((accumulator, value) => {
    const delivered = isNaN(value) ? 0 : value
    return accumulator + delivered
  }, 0)

  return {
    totalInsulin,
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
  const total = manualBasalDuration + automatedBasalDuration

  return {
    automatedBasalDuration,
    manualBasalDuration,
    automatedAndManualTotalDuration: Math.round(total),
    automatedBasalInDays: (automatedBasalDuration / total) * TimeService.MS_IN_DAY,
    manualBasalInDays: (manualBasalDuration / total) * TimeService.MS_IN_DAY
  }
}

interface BasalBolusStatisticsAdapter {
  getBasalBolusData: (basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter) => BasalBolusStatistics
  getTotalInsulinAndWeightData: (basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]) => TotalInsulinAndWeightStatistics
  getAutomatedAndManualBasalDuration: (basalsData: Basal[], dateFilter: DateFilter) => TimeInAutoStatistics
}

export const BasalBolusStatisticsService: BasalBolusStatisticsAdapter = {
  getAutomatedAndManualBasalDuration,
  getBasalBolusData,
  getTotalInsulinAndWeightData
}
