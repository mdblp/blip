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

import DateFilterModel from '../../models/time/date-filter.model'
import DateFilter from '../../models/time/date-filter.model'
import Bolus from '../../models/medical/datum/bolus.model'
import Basal from '../../models/medical/datum/basal.model'
import BasalService from '../medical/datum/basal.service'
import Cbg from '../../models/medical/datum/cbg.model'
import { getWeekDaysFilter } from '../../../../dist/src/domains/repositories/statistics/statistics.utils'
import BolusService from '../medical/datum/bolus.service'

getBasalBolusData()
{
  this.applyDateFilters()

  const bolusData = this.filter.byType('bolus').top(Infinity)
  let basalData = this.sort.byDate(this.filter.byType('basal').top(Infinity).reverse())
  basalData = this.addBasalOverlappingStart(basalData)

  const basalBolusData = {
    basal: basalData.length
      ? Number.parseFloat(getTotalBasalFromEndpoints(basalData, this._endpoints))
      : Number.NaN,
    bolus: bolusData.length ? getTotalBolus(bolusData) : Number.NaN
  }

  if (this.days > 1) {
    const nDays = this.getNumDaysWithInsulin(bolusData, basalData)
    basalBolusData.basal = basalBolusData.basal / nDays
    basalBolusData.bolus = basalBolusData.bolus / nDays
  }

  return basalBolusData
}

interface BasalBolusStatistics {
  bolus: number
  basal: number
}

function getDuration(basal: Basal[], start: number, end: number): Basal[] {
  const epoch = basal.map(basal => basal.epoch)
  const epochStart = basal.map(basal => basal.)
}

function getBasalBolusData(basal: Basal[], bolus: Bolus[], numDays: number, dateFilter: DateFilter): BasalBolusStatistics {
  const basalData = BasalService.filterOnDate(basal as Basal[], dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  const bolusData = BolusService.filterOnDate(bolus as Bolus[], dateFilter.start, dateFilter.end, getWeekDaysFilter(dateFilter))
  return {

  }
}

