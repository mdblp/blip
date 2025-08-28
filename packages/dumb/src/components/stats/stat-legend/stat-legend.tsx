/*
 * Copyright (c) 2022-2025, Diabeloop
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

import React, { type FunctionComponent, memo } from 'react'
import styles from './stat-legend.css'
import Box from '@mui/material/Box'
import { StatLegendElement } from './stat-legend-element'
import { type BgUnit } from 'medical-domain'
import { CBGStatType } from '../../../models/stats.model'

interface StatLegendProps {
  units: BgUnit
  legend: { className: string; value: string }[]
  type: CBGStatType
}

const StatLegend: FunctionComponent<StatLegendProps> = (props) => {
  const { legend, units, type } = props

  return (
    <Box
      data-testid={`${type}-stats-legends`}
      display="flex"
      justifyContent="space-between"
    >
      <ul className={styles['stat-legend']}>
        {
          legend.map((legend: { className: string, value: string }) => (
            <StatLegendElement
              key={legend.className}
              cbgClassName={legend.className}
              value={legend.value}
            />
          ))
        }
      </ul>
      <Box fontSize="12px">
        {units}
      </Box>
    </Box>
  )
}

export const StatLegendMemoized = memo(StatLegend)
