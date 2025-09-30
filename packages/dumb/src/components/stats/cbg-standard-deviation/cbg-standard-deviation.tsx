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

import React, { type FunctionComponent } from 'react'
import styles from './cbg-standard-deviation.css'
import stylesCbgCommon from '../common/cbg-common.css'
import commonStyles from '../../../styles/stat-common.css'
import Box from '@mui/material/Box'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { computeBgClassesBarStyle, computeCBGStyle } from '../common/cbg-utils'
import { type BgClasses } from 'medical-domain'
import { StatColoredBar } from '../stat-colored-bar/stat-colored-bar'

export interface CBGStandardDeviationProps {
  annotations: string[]
  averageGlucose: number
  bgClasses: BgClasses
  standardDeviation: number
  title: string
  units: string
}

const CbgStandardDeviation: FunctionComponent<CBGStandardDeviationProps> = (props) => {
  const { annotations, averageGlucose, bgClasses, standardDeviation, title, units } = props

  const standardDeviationMin = averageGlucose - standardDeviation
  const standardDeviationMax = averageGlucose + standardDeviation

  const valueBasedStyles = {
    min: computeCBGStyle(standardDeviationMin, bgClasses, true),
    max: computeCBGStyle(standardDeviationMax, bgClasses, true)
  }
  const bgClassesBarStyle = computeBgClassesBarStyle(bgClasses)

  return (
    <Box data-testid="cbg-standard-deviation-stat">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box display="flex" className={commonStyles.title}>
          {title}
          {!Number.isNaN(standardDeviation) &&
            <>
              &nbsp;
              <span className={styles['title-value']}>
                (
                <span className={`${valueBasedStyles.min.color} ${styles.spacing}`}>{standardDeviationMin}</span>
                -
                <span className={`${valueBasedStyles.max.color} ${styles.spacing}`}>{standardDeviationMax}</span>
                )
              </span>
            </>
          }
          <StatTooltip annotations={annotations} />
        </Box>
        <Box fontSize="12px">
          {units}
        </Box>
      </Box>
      <Box display="flex" alignItems="center" marginLeft="6px">
        {Number.isNaN(standardDeviation) ? (
          <>
            <div className={stylesCbgCommon['disabled-line']} />
            <Box className={stylesCbgCommon['disabled-label']} fontSize="24px" marginLeft="auto">
              --
            </Box>
          </>
        ) : (
          <>
            <StatColoredBar
              lineColorItems={[
                { index: 'bg-low', color: 'var(--bg-low)', widthPercent: bgClassesBarStyle.lowWidth },
                { index: 'bg-target', color: 'var(--bg-target)', widthPercent: bgClassesBarStyle.targetWidth },
                { index: 'bg-high', color: 'var(--bg-high)', widthPercent: bgClassesBarStyle.highWidth }
              ]}
              horizontalLineItems={[
                { index: 'std-dev-min', color: valueBasedStyles.min.backgroundColor, alignmentPercent: valueBasedStyles.min.left },
                { index: 'std-dev-max', color: valueBasedStyles.max.backgroundColor, alignmentPercent: valueBasedStyles.max.left }
              ]}
              lineWidth={'calc(100% - 60px)'}
            />
            <Box className={styles.value} fontSize="20px" marginLeft="auto">
              {standardDeviation}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}

export const CbgStandardDeviationMemoized = React.memo(CbgStandardDeviation)
