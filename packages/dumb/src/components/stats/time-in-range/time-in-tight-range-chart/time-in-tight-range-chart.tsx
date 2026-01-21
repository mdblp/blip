/*
 * Copyright (c) 2025, Diabeloop
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

import React, { FC } from 'react'
import Box from '@mui/material/Box'
import { TimeInRangeTitleMemoized as TimeInRangeTitle } from '../time-in-range-title'
import { CBGPercentageBarMemoized as CbgPercentageBarChart } from '../cbg-percentage-bar/cbg-percentage-bar'
import { CBGStatType, StatLevel } from '../../../../models/stats.model'
import { useTranslation } from 'react-i18next'
import { StatLegendMemoized as StatLegend } from '../../stat-legend/stat-legend'
import { BgPrefs } from '../../../../models/blood-glucose.model'
import { TIGHT_RANGE_BOUNDS } from 'medical-domain'

interface TimeInTightRangeChartProps {
  data: { value: number, total: number }
  bgPrefs: BgPrefs
}

export const TimeInTightRangeChart: FC<TimeInTightRangeChartProps> = (props) => {
  const { data, bgPrefs } = props
  const { t } = useTranslation('main')

  const title = t('time-in-tight-range')
  const annotations = [t('time-in-tight-range-cgm-one-day'), t('compute-oneday-time-in-tight-range')]

  const bounds = TIGHT_RANGE_BOUNDS[bgPrefs.bgUnits]
  const legendValues = [
    { className: 'tight-range', value: `${Math.round(bounds.lower)}-${Math.round(bounds.upper)}` }
  ]

  const isDisabled = data.value === 0 && data.total === 0

  return (
    <Box data-testid="time-in-tight-range-chart">
      <TimeInRangeTitle
        annotations={annotations}
        title={title}
        shouldDisplayInfoTooltip={true}
        type={CBGStatType.TimeInTightRange}
      />
      <Box sx={{ marginBottom: 1 }}>
        <CbgPercentageBarChart
          type={CBGStatType.TimeInTightRange}
          id={StatLevel.TightRange}
          isDisabled={isDisabled}
          onMouseEnter={() => {}}
          title={title}
          total={data.total}
          value={data.value}
          isReducedSize={true}
        />
      </Box>
      <StatLegend units={bgPrefs.bgUnits} legend={legendValues} type={CBGStatType.TimeInTightRange} />
    </Box>
  )
}
