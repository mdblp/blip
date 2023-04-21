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
import { type BasalBolusStatistics } from '../../models/statistics/basal-bolus-statistics.model'
import { getWeekDaysFilter } from '../../../../dist/src/domains/repositories/statistics/statistics.utils'

// getBasalBolusData()
// {
//   this.applyDateFilters()
//
//   const bolusData = this.filter.byType('bolus').top(Infinity)
//   let basalData = this.sort.byDate(this.filter.byType('basal').top(Infinity).reverse())
//   basalData = this.addBasalOverlappingStart(basalData)
//
//   const basalBolusData = {
//     basal: basalData.length
//       ? Number.parseFloat(getTotalBasalFromEndpoints(basalData, this._endpoints))
//       : Number.NaN,
//     bolus: bolusData.length ? getTotalBolus(bolusData) : Number.NaN
//   }
//
//   if (this.days > 1) {
//     const nDays = this.getNumDaysWithInsulin(bolusData, basalData)
//     basalBolusData.basal = basalBolusData.basal / nDays
//     basalBolusData.bolus = basalBolusData.bolus / nDays
//   }
//
//   return basalBolusData
// }
//
function resempleDuration(basals: Basal[], start: number, end: number): Basal[] {
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

function getBasalBolusData(basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter): BasalBolusStatistics {
  const filterBasal = BasalService.filterOnDate(basals, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const filterBolus = BolusService.filterOnDate(bolus, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const basalData = resempleDuration(filterBasal, dateFilter.start, dateFilter.end)
  const bolusData = filterBolus.reduce((accumulator, bolus) => accumulator + bolus.normal, 0)
  const formatBasalPerHour = basalData.map(basal => (basal.duration * 3600) * basal.duration)
  const basal = formatBasalPerHour.reduce((accumulateur, basal) => accumulateur + basal)
  return {
    basal,
    bolus: bolusData
  }
}

interface BasalBolusStatisticsAdapter {
  getBasalBolusData: (basals: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter) => BasalBolusStatistics
}

export const BasalBolusStatisticsService: BasalBolusStatisticsAdapter = {
  getBasalBolusData
}
