/*
 * Copyright (c) 2022-2023, Diabeloop
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

import React, { type FunctionComponent } from 'react'
import styles from '../common/cbg-common.css'
import stylesCbgMeanStat from './cbg-mean-stat.css'
import Box from '@mui/material/Box'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { computeBgClassesBarStyle, computeCBGStyle } from '../common/cbg-utils'
import { type BgClasses } from 'medical-domain'

export interface CBGMeanStatProps {
  bgClasses: BgClasses
  title: string
  tooltipValue: string
  units: string
  value: number
}

const CBGMeanStat: FunctionComponent<CBGMeanStatProps> = (props) => {
  const { bgClasses, title, tooltipValue, units, value } = props
  const valueBasedStyles = computeCBGStyle(value, bgClasses)
  const bgClassesBarStyle = computeBgClassesBarStyle(bgClasses)

  return (
    <Box
      data-testid="cbg-mean-stat"
      marginLeft="4px"
      marginRight="4px"
    >
      <Box display="flex" justifyContent="space-between" marginTop="4px">
        <div>
          {title}
          <StatTooltip annotations={[tooltipValue]} />
        </div>
        <Box fontSize="12px">
          {units}
        </Box>
      </Box>
      <Box display="flex" marginLeft="6px" marginTop="4px">
        {Number.isNaN(value)
          ? <>
            <div className={styles['disabled-line']} />
            <Box className={styles['disabled-label']} fontSize="24px" marginLeft="auto" marginRight="4px">
              --
            </Box>
          </>
          : <>
            <div className={styles.lines}>
              <div
                className={`${styles.line} ${styles['line-low']}`}
                style={{ width: bgClassesBarStyle.lowWidth }}
              />
              <div
                className={`${styles.line} ${styles['line-target']}`}
                style={{ width: bgClassesBarStyle.targetWidth }}
              />
              <div
                className={`${styles.line} ${styles['line-high']}`}
              />
              <div
                className={`${stylesCbgMeanStat.dot} ${valueBasedStyles.backgroundColor}`}
                style={{ left: valueBasedStyles.left }}
              />
            </div>
            <Box className={valueBasedStyles.color} fontSize="24px" marginLeft="auto" marginRight="4px">
              {value}
            </Box>
          </>
        }
      </Box>
    </Box>
  )
}

export const CBGMeanStatMemoized = React.memo(CBGMeanStat)
