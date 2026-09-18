/*
 * Copyright (c) 2026, Diabeloop
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

import { BgPrefs } from 'dumb'
import { Cbg, DateFilter, DatumType, GlycemiaStatisticsService } from 'medical-domain'
import React, { FC } from 'react'
import { CardDivider } from '../../card-divider/card-divider'
import { DataCard } from '../../data-card/data-card'
import { AverageGlucoseStat } from '../average-glucose-stat'
import { CoefficientOfVariation } from '../coefficient-of-variation-stat'
import { GlucoseManagementIndicator } from '../glucose-management-indicator-stat'
import { StandardDeviationStat } from '../standard-deviation-stat'

interface GlucoseMetricsCardProps {
  cbgData: Cbg[]
  dateFilter: DateFilter
  bgPrefs: BgPrefs
  showGmi?: boolean
}

export const GlucoseMetricsCard: FC<GlucoseMetricsCardProps> = (props) => {
  const { cbgData, bgPrefs, showGmi, dateFilter } = props

  const bgUnits = bgPrefs.bgUnits

  const { averageGlucose } = GlycemiaStatisticsService.getAverageGlucoseData(cbgData, dateFilter)
  const {
    standardDeviation,
    total: standardDeviationTotal
  } = GlycemiaStatisticsService.getStandardDevData(cbgData, dateFilter)
  const { coefficientOfVariation } = GlycemiaStatisticsService.getCoefficientOfVariationData(cbgData, dateFilter)
  const { glucoseManagementIndicator } = GlycemiaStatisticsService.getGlucoseManagementIndicatorData(cbgData, bgUnits, dateFilter)

  return (
    <DataCard>
      <AverageGlucoseStat
        averageGlucose={averageGlucose}
        bgPrefs={bgPrefs}
        bgType={DatumType.Cbg}
      />
      <CardDivider />
      <StandardDeviationStat
        total={standardDeviationTotal}
        bgType={DatumType.Cbg}
        bgPrefs={bgPrefs}
        averageGlucose={averageGlucose}
        standardDeviation={standardDeviation}
      />
      <CardDivider />
      <CoefficientOfVariation
        coefficientOfVariation={coefficientOfVariation}
        bgType={DatumType.Cbg}
      />
      {showGmi &&
        <>
          <CardDivider />
          <GlucoseManagementIndicator glucoseManagementIndicator={glucoseManagementIndicator} />
        </>
      }
    </DataCard>
  )
}
