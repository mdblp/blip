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

import React, { FunctionComponent } from 'react'

import colors from '../../styles/colors.css'
import styles from './stat-legend.css'
import { Box } from '@material-ui/core'

interface StatLegendProps {
  items: Array<{ id: string, legendTitle: string }>
  units: string
}

export const StatLegend: FunctionComponent<StatLegendProps> = (props) => {
  const { items, units } = props

  return (
    <Box data-testid="cbg-percentage-stats-legends" display="flex" marginLeft="8px" marginBottom="8px">
      <ul className={styles['stat-legend']}>
        {items.map(item =>
          <li
            className={styles['stat-legend-item']}
            key={item.id}
            style={{ borderBottomColor: colors[item.id] }}
          >
            <span className={styles['stat-legend-title']}>
              {item.legendTitle}
            </span>
          </li>
        )}
      </ul>
      <Box marginLeft="auto" marginRight="4px" fontSize="12px">
        {units}
      </Box>
    </Box>
  )
}
