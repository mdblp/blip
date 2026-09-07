/*
 * Copyright (c) 2025-2026, Diabeloop
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

import Grid from '@mui/material/Grid'
import type { TimeZoneChange } from 'medical-domain'
import moment from 'moment-timezone'
import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { DailyTooltipProps } from '../../../models/daily-tooltip-props.model'
import colors from '../../../styles/colors.css'
import commonStyles from '../../../styles/tooltip-common.css'
import { getDateTimeFormat } from '../../../utils/datetime/datetime.util'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { DEFAULT_TOOLTIP_OFFSET, Tooltip } from '../common/tooltip/tooltip'
import styles from './time-change-tooltip.css'

export const TimeChangeTooltip: FC<DailyTooltipProps<TimeZoneChange>> = (props) => {
  const { datum: timeChange, position, side, timePrefs } = props
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

  const getTimeChangeContent = (): JSX.Element => {
    return (
      <>
        <TooltipLine label={t('previous-time')} value={formattedPreviousTime} />
        <TooltipLine label={t('new-time')} value={formattedNewTime} />
      </>
    )
  }

  const getTimezoneChangeContent = (): JSX.Element => {
    return (
      <Grid container spacing={1} sx={{ maxWidth: '324px' }}>
        <Grid size={4}>
          {t('previous-time')}
        </Grid>
        <Grid className={styles.value} size={3}>
          {formattedPreviousTime}
        </Grid>
        <Grid className={styles.value} size={5}>
          <span className={styles.timezone}>{previousTimezone}</span>
        </Grid>
        <Grid size={4}>
          {t('new-time')}
        </Grid>
        <Grid className={styles.value} size={3}>
          {formattedNewTime}
        </Grid>
        <Grid className={styles.value} size={5}>
          <span className={styles.timezone}>{newTimezone}</span>
        </Grid>
      </Grid>
    )
  }

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
          {isTimeChangeOnly ? getTimeChangeContent() : getTimezoneChangeContent()}
        </div>
      }
    />
  )
}
