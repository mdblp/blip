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
import styles from '../common/cbg-common.css'
import commonStyles from '../../../styles/stat-common.css'
import Box from '@mui/material/Box'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { computeBgClassesBarStyle, computeCBGStyle } from '../common/cbg-utils'
import { type BgClasses } from 'medical-domain'
import { StatColoredBar } from '../stat-colored-bar/stat-colored-bar'
import { LineColor } from '../../../models/enums/line-color.enum'

export interface AverageGlucoseProps {
  bgClasses: BgClasses
  title: string
  tooltipValue: string
  units: string
  value: number
}

const AverageGlucose: FunctionComponent<AverageGlucoseProps> = (props) => {
  const { bgClasses, title, tooltipValue, units, value } = props
  const valueBasedStyles = computeCBGStyle(value, bgClasses, true)
  const bgClassesBarStyle = computeBgClassesBarStyle(bgClasses)

  return (
    <Box data-testid="average-glucose-stat">
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
        <div className={commonStyles.title}>
          {title}
          <StatTooltip annotations={[tooltipValue]} />
        </div>
        <Box sx={{ fontSize: "12px" }}>
          {units}
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginLeft: "6px"
        }}>
        {Number.isNaN(value)
          ? <>
            <div className={styles['disabled-line']} />
            <Box
              className={styles['disabled-label']}
              sx={{
                fontSize: "24px",
                marginLeft: "auto"
              }}>
              --
            </Box>
          </>
          : <>
            <StatColoredBar
              lineColorItems={[
                { index: 'bg-low', color: LineColor.BgLow, widthPercent: bgClassesBarStyle.lowWidth },
                { index: 'bg-target', color: LineColor.BgTarget, widthPercent: bgClassesBarStyle.targetWidth },
                { index: 'bg-high', color: LineColor.BgHigh, widthPercent: bgClassesBarStyle.highWidth }
              ]}
              dotItem={{ color: valueBasedStyles.backgroundColor, alignmentPercent: valueBasedStyles.left }}
              lineWidth={'calc(100% - 60px)'}
            />
            <Box
              className={valueBasedStyles.color}
              sx={{
                fontSize: "20px",
                fontWeight: "bold",
                marginLeft: "auto"
              }}>
              {value}
            </Box>
          </>
        }
      </Box>
    </Box>
  )
}

export const AverageGlucoseMemoized = React.memo(AverageGlucose)
