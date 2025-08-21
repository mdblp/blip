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
import Box from '@mui/material/Box'
import { AlarmEvent, GROUP_ALARMS_THRESHOLD_MINUTES, TimePrefs } from 'medical-domain'
import { TooltipLine } from '../../common/tooltip-line/tooltip-line'
import { computeDateValue, getDateTitle } from '../../../../utils/tooltip/tooltip.util'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import { getBorderColor } from '../../../../utils/alarm-event/alarm-event.util'

interface AlarmMultipleOccurrencesProps {
  alarmEvent: AlarmEvent
  timePrefs: TimePrefs
}

export const AlarmMultipleOccurrences: FC<AlarmMultipleOccurrencesProps> = (props) => {
  const { alarmEvent, timePrefs } = props
  const theme = useTheme()
  const { t } = useTranslation('main')

  const borderColor = getBorderColor(alarmEvent.alarmEventType)

  return (
    <>
      <Box
        marginTop={theme.spacing(1)}
        marginBottom={theme.spacing(1)}
        paddingLeft={theme.spacing(1)}
        borderLeft={`2px solid ${borderColor}`}
      >
        <TooltipLine
          label={t('alarm-multiple-occurrences', { maxFrequency: GROUP_ALARMS_THRESHOLD_MINUTES })} />
      </Box>
      {alarmEvent.otherOccurrencesDate?.map((dateTime: string) => {
        const occurrenceDateTitle = getDateTitle(dateTime, alarmEvent, timePrefs)
        const formattedDateTime = computeDateValue(occurrenceDateTitle)
        const occurrenceLine = t('alarm-at-time', { alarmTime: formattedDateTime })
        return <TooltipLine label={occurrenceLine} key={dateTime} />
      })}
    </>
  )
}
