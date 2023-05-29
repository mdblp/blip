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
import type Basal from '../../models/medical/datum/basal.model'
import type DateFilter from '../../models/time/date-filter.model'
import { type TimeInAutoStatistics } from '../../models/statistics/time-in-auto.model'
import { getWeekDaysFilter } from './statistics.utils'
import BasalService from '../medical/datum/basal.service'

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

function getTimeInAutoData(basalsData: Basal[], numDays: number, dateFilter: DateFilter): TimeInAutoStatistics {
  const filteredBasal = BasalService.filterOnDate(basalsData, dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const resampledBasalData = resamplingDuration(filteredBasal, dateFilter.start, dateFilter.end)

  const manualBasals = resampledBasalData.filter((manualBasal) => {
    return (manualBasal.subType === 'manual')
  }).reduce((accumulator, manualBasal) => accumulator + manualBasal.duration, 0)

  const automatedBasals = resampledBasalData.filter((automateBasal) => {
    return (automateBasal.subType === 'automated')
  }).reduce((accumulator, automateBasal) => accumulator + automateBasal.duration, 0)
  console.log('manual', manualBasals)
  console.log('auto', automatedBasals)
  console.log('basals', basalsData)

  return {
    auto: automatedBasals,
    manual: manualBasals,
    total: automatedBasals + manualBasals
  }
}

interface BasalBolusStatisticsAdapter {
  getTimeInAutoData: (basalsData: Basal[], numDays: number, dateFilter: DateFilter) => TimeInAutoStatistics
}

export const BasalBolusStatisticsService: BasalBolusStatisticsAdapter = {
  getTimeInAutoData
}
