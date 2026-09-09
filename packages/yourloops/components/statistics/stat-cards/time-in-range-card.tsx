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

import Box from '@mui/material/Box'
import { BgPrefs, TimeInRangeChart, TimeInRangeDT1Chart, TimeInTightRangeChart } from 'dumb'
import {
  Cbg,
  type DateFilter,
  defaultBgClasses,
  GlycemiaStatisticsService,
  MS_IN_DAY,
  TimeService
} from 'medical-domain'
import React, { FC } from 'react'
import AnalyticsApi from '../../../lib/analytics/analytics.api'
import { CardDivider } from '../../card-divider/card-divider'
import { DataCard } from '../../data-card/data-card'
import { SensorUsageStat } from '../sensor-usage-stat'

interface TimeInRangeCardProps {
  bgPrefs: BgPrefs
  dateFilter: DateFilter
  cbgData: Cbg[]
  showDt1Chart?: boolean
  showSensorUsage?: boolean
}

export const TimeInRangeCard: FC<TimeInRangeCardProps> = (props) => {
  const { bgPrefs, dateFilter, cbgData, showDt1Chart, showSensorUsage } = props

  const bgUnits = bgPrefs.bgUnits
  const numberOfDays = dateFilter.weekDays ? TimeService.getNumberOfDays(dateFilter.start, dateFilter.end, dateFilter.weekDays) : (dateFilter.end - dateFilter.start) / MS_IN_DAY

  const timeInRangeChartData = GlycemiaStatisticsService.getTimeInRangeData(cbgData, bgPrefs.bgBounds, numberOfDays, dateFilter)
  const timeInTightRangeData = GlycemiaStatisticsService.getTimeInTightRangeData(cbgData, bgUnits, numberOfDays, dateFilter)

  let defaultBgPrefs: BgPrefs
  let timeInRangeDt1Data: {
    value: number,
    total: number
  }

  if (showDt1Chart) {
    const bgClasses = defaultBgClasses[bgUnits]
    defaultBgPrefs = {
      bgUnits: bgUnits,
      bgClasses: bgClasses,
      bgBounds: {
        veryHighThreshold: bgClasses.high,
        targetUpperBound: bgClasses.target,
        targetLowerBound: bgClasses.low,
        veryLowThreshold: bgClasses.veryLow
      }
    }
    timeInRangeDt1Data = GlycemiaStatisticsService.getTimeInRangeDt1Data(cbgData, bgUnits, numberOfDays, dateFilter)
  }

  const {
    sensorUsage,
    total: sensorUsageTotal
  } = GlycemiaStatisticsService.getSensorUsage(cbgData, dateFilter)

  return (
    <DataCard>
      <TimeInRangeChart
        data={timeInRangeChartData}
        bgPrefs={bgPrefs}
        trackHoverFunc={AnalyticsApi.trackHover}
      />

      {showDt1Chart &&
        <Box sx={{ marginTop: 3 }}>
          <TimeInRangeDT1Chart
            data={timeInRangeDt1Data}
            bgPrefs={defaultBgPrefs}
            trackHoverFunc={AnalyticsApi.trackHover}
          />
        </Box>
      }

      <Box sx={{ marginTop: 3 }}>
        <TimeInTightRangeChart
          data={timeInTightRangeData}
          bgPrefs={bgPrefs}
          trackHoverFunc={AnalyticsApi.trackHover}
        />
      </Box>

      {showSensorUsage &&
        <Box sx={{ marginTop: 2 }}>
          <CardDivider />
          <SensorUsageStat total={sensorUsageTotal} usage={sensorUsage} trackHoverFunc={AnalyticsApi.trackHover}
          />
        </Box>
      }
    </DataCard>
  )
}
