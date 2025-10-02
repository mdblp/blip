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
import { DEFAULT_TOOLTIP_OFFSET, Position, Tooltip } from '../common/tooltip/tooltip'
import { TooltipSide } from '../../../models/enums/tooltip-side.enum'
import type { TimePrefs, TimeZoneChange } from 'medical-domain'
import { useTranslation } from 'react-i18next'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import commonStyles from '../../../styles/tooltip-common.css'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import colors from '../../../styles/colors.css'
import moment from 'moment-timezone'
import { getDateTimeFormat } from '../../../utils/datetime/datetime.util'
import Grid from '@mui/material/Grid'
import styles from './time-change-tooltip.css'

interface TimeChangeTooltipProps {
  timeChange: TimeZoneChange
  position: Position
  side: TooltipSide
  timePrefs: TimePrefs
}

export const TimeChangeTooltip: FC<TimeChangeTooltipProps> = (props) => {
  const { timeChange, position, side, timePrefs } = props
  const { t } = useTranslation('main')

  const previousTimezone = timeChange.from.timeZoneName
  const newTimezone = timeChange.to.timeZoneName
  const previousTime = timeChange.from.time
  const newTime = timeChange.to.time

  const isTimeChangeOnly = previousTimezone === newTimezone

  const momentPreviousTime = moment.tz(previousTime, previousTimezone)
  const momentNewTime = moment.tz(newTime, newTimezone)

  const format = getDateTimeFormat(momentPreviousTime, momentNewTime)
  const formattedPreviousTime = momentPreviousTime.format(format)
  const formattedNewTime = momentNewTime.format(format)

  const tooltipTitle = isTimeChangeOnly ? t('Time Change') : t('Timezone Change')

  return (
    <Tooltip
      position={position}
      side={side}
      backgroundColor={colors.greyBackground}
      title={tooltipTitle}
      dateTitle={getDateTitleForBaseDatum(timeChange, timePrefs)}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={commonStyles.containerFlex}>
          {isTimeChangeOnly ?
            <>
              <TooltipLine label={t('previous-time')} value={formattedPreviousTime} />
              <TooltipLine label={t('new-time')} value={formattedNewTime} />
            </>
            : <Grid container spacing={1} sx={{ maxWidth: '324px' }}>
              <Grid item xs={4}>
                {t('previous-time')}
              </Grid>
              <Grid item xs={3} className={styles.value}>
                {formattedPreviousTime}
              </Grid>
              <Grid item xs={5} className={styles.value}>
                <span className={styles.timezone}>{previousTimezone}</span>
              </Grid>
              <Grid item xs={4}>
                {t('new-time')}
              </Grid>
              <Grid item xs={3} className={styles.value}>
                {formattedNewTime}
              </Grid>
              <Grid item xs={5} className={styles.value}>
                <span className={styles.timezone}>{newTimezone}</span>
              </Grid>
            </Grid>
          }
        </div>
      }
    />
  )
}
