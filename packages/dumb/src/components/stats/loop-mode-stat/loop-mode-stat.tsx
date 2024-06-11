/*
 * Copyright (c) 2020-2024, Diabeloop
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
import styles from './loop-mode-stat.css'
import commonStyles from '../../../styles/stat-common.css'
import { StatTooltip } from '../../tooltips/stat-tooltip/stat-tooltip'
import Box from '@mui/material/Box'
import { LoopModePercentageDetail } from './loop-mode-percentage-detail'
import { LoopModeLabel } from './loop-mode-label'
import { LoopModeGraph } from './loop-mode-graph'
import { useLocation } from 'react-router-dom'
import { t } from 'i18next'
import { ensureNumeric } from '../stats.util'

interface LoopModeStatProps {
  automatedBasalDuration: number
  manualBasalDuration: number
  manualPercentage: number
  automatedPercentage: number
}

const LoopModeStat: FunctionComponent<LoopModeStatProps> = (props) => {
  const {
    automatedBasalDuration,
    automatedPercentage,
    manualBasalDuration,
    manualPercentage
  } = props

  const location = useLocation()
  const isDailyPage = location.pathname.includes('daily')
  const title = t(isDailyPage ? 'time-loop' : 'avg-time-loop')
  const annotations = isDailyPage ? [t('time-loop-tooltip'), t('time-loop-how-calculate')] : [t('avg-time-loop-tooltip'), t('avg-time-loop-how-calculate')]

  return (
    <div data-testid="loop-mode-stat">
      <Box className={commonStyles.title}>
        {title}
        <StatTooltip annotations={annotations}/>
      </Box>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 290 80"
        className={`${styles.statWheelTimeInAuto} ${styles.donutChart}`}
      >
        <LoopModeLabel
          className={styles.onColor}
          transform="translate(10 15)"
          translationKey="wheel-label-on"
        />
        <LoopModeLabel
          className={styles.offColor}
          transform="translate(240 15)"
          translationKey="wheel-label-off"
        />
        <LoopModePercentageDetail
          className={styles.labelOnValueUnits}
          percentage={automatedPercentage}
          transform="translate(30 63)"
          value={ensureNumeric(automatedBasalDuration)}
        />
        <LoopModePercentageDetail
          className={styles.labelOffValueUnits}
          percentage={manualPercentage}
          transform="translate(260 63)"
          value={ensureNumeric(manualBasalDuration)}
        />
        <LoopModeGraph automatedPercentage={automatedPercentage} manualPercentage={manualPercentage}/>
      </svg>
    </div>
  )
}

export const LoopModeStatMemoized = memo(LoopModeStat)
