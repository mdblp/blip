/*
 * Copyright (c) 2020-2025, Diabeloop
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
import { useLocation } from 'react-router-dom'
import { t } from 'i18next'
import { formatDuration } from '../../../utils/datetime/datetime.util'
import { ensureNumeric } from '../stats.util'
import Chip from '@mui/material/Chip'
import Grid from '@mui/material/Grid'
import { LoopModePercentageDetail } from './loop-mode-percentage-detail'
import { StatColoredBar } from '../stat-colored-bar/stat-colored-bar'

interface LoopModeStatProps {
  automatedBasalDuration: number
  manualBasalDuration: number
  manualPercentage: number
  automatedPercentage: number
}

const DOT_OFFSET_PERCENT = 3

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

  const automatedDurationSafe = ensureNumeric(automatedBasalDuration)
  const automatedDuration = formatDuration(automatedDurationSafe, true)

  const manualDurationSafe = ensureNumeric(manualBasalDuration)
  const manualDuration = formatDuration(manualDurationSafe, true)

  const dotAlignment = Math.max(0, automatedPercentage - DOT_OFFSET_PERCENT)

  return (
    <div data-testid="loop-mode-stat">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box className={commonStyles.title}>
          {title}
          <StatTooltip annotations={annotations} />
        </Box>
        <Box>
          <Chip size="small" label={t('wheel-label-on')} className={styles.automatedChip} />
          <Chip size="small" label={t('wheel-label-off')} />
        </Box>
      </Box>
      <Grid container spacing={0} sx={{ marginTop: 1 }}>
        <Grid item xs={3}>
          <LoopModePercentageDetail
            percentageValue={automatedPercentage}
            duration={automatedDuration}
            valueClassName={styles.autoValueColor}
          />
        </Grid>
        <Grid item xs={6} sx={{ alignSelf: 'flex-start' }}>
          <StatColoredBar
            dotItem={{ color: 'var(--bg-target)', alignmentPercent: dotAlignment }}
            lineColorItems={[
              { index: 'loop-mode-on', widthPercent: automatedPercentage, color: 'var(--bg-target)' },
              { index: 'loop-mode-off', widthPercent: manualPercentage, color: 'var(--text-basal)' }
            ]}
          />
        </Grid>
        <Grid item xs={3}>
          <LoopModePercentageDetail
            percentageValue={manualPercentage}
            duration={manualDuration}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export const LoopModeStatMemoized = memo(LoopModeStat)
