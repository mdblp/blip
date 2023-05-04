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

function resamplingDuration(basals: Basal[], start: number, end: number): Basal[] {
  return basals.map(basal => {
    if (basal.epoch < start) {
      basal.epoch = start
    }
    if (basal.epochEnd > end) {
      basal.epochEnd = end
    }
    basal.duration = basal.epochEnd - basal.epoch
    return basal
  })
}

function getWeight(allPumpSettings: PumpSettings[]): ParameterConfig | null {
  console.log('allPump', allPumpSettings)

  const lastPumpSettings = allPumpSettings[allPumpSettings.length - 1]
  console.log('lastPump', lastPumpSettings)

  if (!lastPumpSettings) {
    return null
  }
  const weight = lastPumpSettings.payload.parameters.find(parameter => parameter.name === 'WEIGHT')
  console.log('weight', weight)
  return weight ?? null
}

function getBasalBolusData(basalsData: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter): BasalBolusStatistics {
  const filteredBasal = BasalService.filterOnDate(basalsData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filteredBolus = BolusService.filterOnDate(bolus, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const basalData = resamplingDuration(filteredBasal, dateFilter.start, dateFilter.end)
  const bolusTotal = filteredBolus.reduce((accumulator, bolus) => accumulator + bolus.normal, 0)
  const basalTotal = basalData.reduce((accumulator, basal) => accumulator + (basal.duration / 3_600_000 * basal.rate), 0)

  if (numDays > 1) {
    return {
      bolus: bolusTotal / numDays,
      basal: basalTotal / numDays,
      total: bolusTotal / numDays + basalTotal / numDays
    }
  }

  return {
    basal: basalTotal,
    bolus: bolusTotal,
    total: basalTotal + bolusTotal
  }
}

function getTotalInsulinAndWeightData(basalsData: Basal[], bolusData: Bolus[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]): TotalInsulinAndWeightStatistics {
  const weight = getWeight(pumpSettings)
  const { basal, bolus } = getBasalBolusData(basalsData, bolusData, numDays, dateFilter)

  return {
    totalInsulin: basal + bolus,
    weight
  }
}

interface BasalBolusStatisticsAdapter {
  getBasalBolusData: (basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter) => BasalBolusStatistics
  getTotalInsulinAndWeightData: (basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter, pumpSettings: PumpSettings[]) => TotalInsulinAndWeightStatistics
}

export const BasalBolusStatisticsService: BasalBolusStatisticsAdapter = {
  getBasalBolusData,
  getTotalInsulinAndWeightData
}
