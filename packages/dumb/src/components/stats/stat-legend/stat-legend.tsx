/*
 * Copyright (c) 2022, Diabeloop
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

import React, { FunctionComponent, memo } from 'react'
import styles from './stat-legend.css'
import Box from '@mui/material/Box'
import { BgClasses } from '../models'
import { StatLegendElement } from './stat-legend-element'

interface StatLegendProps {
  bgClasses: BgClasses
  units: string
}

const StatLegend: FunctionComponent<StatLegendProps> = (props) => {
  const { bgClasses, units } = props
  const veryLowValue = Math.round(bgClasses.veryLow)
  const lowValue = Math.round(bgClasses.low)
  const targetValue = Math.round(bgClasses.target)
  const highValue = Math.round(bgClasses.high)

  return (
    <Box data-testid="cbg-percentage-stats-legends" display="flex" marginLeft="8px" marginBottom="8px">
      <ul className={styles['stat-legend']}>
        <StatLegendElement
          cbgClassName="very-low"
          value={`<${veryLowValue}`}
        />
        <StatLegendElement
          cbgClassName="low"
          value={`${veryLowValue}-${lowValue}`}
        />
        <StatLegendElement
          cbgClassName="target"
          value={`${lowValue}-${targetValue}`}
        />
        <StatLegendElement
          cbgClassName="high"
          value={`${targetValue}-${highValue}`}
        />
        <StatLegendElement
          cbgClassName="very-high"
          value={`>${highValue}`}
        />
      </ul>
      <Box marginLeft="auto" marginRight="4px" fontSize="12px">
        {units}
      </Box>
    </Box>
  )
}

export const StatLegendMemoized = memo(StatLegend)
