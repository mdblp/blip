/*
 * Copyright (c) 2020-2022, Diabeloop
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
import styles from './loop-mode-stat.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import { Box } from '@material-ui/core'
import { LoopModePercentageDetail } from './loop-mode-percentage-detail'
import { LoopModeLabel } from './loop-mode-label'

interface LoopModeStatProps {
  annotations: []
  automated: number
  hideTooltip: boolean
  manual: number
  title: string
  total: number
}

const circleRadius = 70

const LoopModeStat: FunctionComponent<LoopModeStatProps> = (props) => {
  const { annotations, automated, hideTooltip, manual, title, total } = props

  const automatedPercentage = Math.round(100 * automated / total)
  const manualPercentage = Math.round(100 * manual / total)

  const angle = manualPercentage * Math.PI / 100
  const x = circleRadius * 2.0 * Math.cos(angle)
  const y = -circleRadius * 2.0 * Math.sin(angle)

  return (
    <div data-testid="loop-mode-stat">
      <Box className={styles.title}>
        {title}
        {!hideTooltip &&
          <StatTooltip annotations={annotations} />
        }
      </Box>
      <svg
        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 290 80"
        className={`${styles.statWheelTimeInAuto} ${styles.donutChart}`}
      >
        <LoopModeLabel className={styles.onColor} transform="translate(10 15)" translationKey="wheel-label-on" />
        <LoopModeLabel className={styles.offColor} transform="translate(240 15)" translationKey="wheel-label-off" />
        <LoopModePercentageDetail
          className={styles.labelOnValueUnits}
          percentage={automatedPercentage}
          transform="translate(30 63)"
          value={automated}
        />
        <LoopModePercentageDetail
          className={styles.labelOffValueUnits}
          percentage={manualPercentage}
          transform="translate(260 63)"
          value={manual}
        />
        <g transform="translate(145 75)">
          <mask id="half-wheel-mask">
            <rect x="-70" y="-70" width="140" height="70" fill="white" />
            <circle cx="0" cy="0" r="40" fill="black" />
          </mask>
          <clipPath id="half-circle-percent-clip">
            {x && y
              ? (manualPercentage > 50
                  ? <>
                    <path d="M0,0 l140,0 l0,-140 l-140,0 Z" />
                    <path d={`M0,0 l0,-140 L${x},${y} Z`} />
                  </>
                  : <path d={`M0,0 L${circleRadius * 2.0},0 L${x},${y} Z`} />
                )
              : <rect x="-70" y="-70" width="140" height="140" />
            }
          </clipPath>
          <circle className={styles.onEllipse} cx="0" cy="0" r="70" fill="blue" mask="url(#half-wheel-mask)" />
          {automatedPercentage !== 100 &&
            <circle
              className={styles.offEllipse}
              cx="0"
              cy="0"
              r="70"
              fill="grey"
              mask="url(#half-wheel-mask)"
              clipPath="url(#half-circle-percent-clip)"
            />
          }
        </g>
      </svg>
    </div>
  )
}

export const LoopModeStatMemoized = memo(LoopModeStat)
