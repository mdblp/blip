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
import { type BgPrefs, CBGStatType } from 'dumb'
import { type BgType, type CbgRangeStatistics, type DateFilter, DatumType, type MedicalData, TimeService } from 'medical-domain'
import { GlycemiaStatisticsService } from 'medical-domain/dist/src/domains/repositories/statistics/glycemia-statistics.service'
import { ensureNumeric } from 'dumb/dist/src/components/stats/stats.util'

interface patientStatisticsHookProps {
  medicalData: MedicalData
  bgPrefs: BgPrefs
  dateFilter: DateFilter
  bgSource: BgType
}

interface SensorUsageData {
  total: number
  sensorUsage: number
}

interface patientStatisticsHookReturn {
  cbgStatType: CBGStatType
  numberOfDays: number
  cbgPercentageBarChartData: CbgRangeStatistics
  sensorUsageData: SensorUsageData
}

export const patientStatisticsHook = ({ medicalData, bgPrefs, bgSource, dateFilter }: patientStatisticsHookProps): patientStatisticsHookReturn => {
  const cbgStatType: CBGStatType = bgSource === DatumType.Cbg ? CBGStatType.TimeInRange : CBGStatType.ReadingsInRange
  const numberOfDays = TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays)
  const cbgPercentageBarChartData = cbgStatType === CBGStatType.TimeInRange
    ? GlycemiaStatisticsService.getTimeInRangeData(medicalData.cbg, bgPrefs.bgBounds, numberOfDays, dateFilter)
    : GlycemiaStatisticsService.getReadingsInRangeData(medicalData.smbg, bgPrefs.bgBounds, numberOfDays, dateFilter)
  const { sensorUsage, total } = GlycemiaStatisticsService.getSensorUsage(medicalData.cbg, numberOfDays, dateFilter)
  const sensorUsageData = {
    total: ensureNumeric(total),
    sensorUsage: ensureNumeric(sensorUsage)
  }

  return {
    cbgStatType,
    numberOfDays,
    cbgPercentageBarChartData,
    sensorUsageData
  }
}
