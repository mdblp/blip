/*
 * Copyright (c) 2023-2025, Diabeloop
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

import {
  COMMON_TOOLTIP_TAIL_HEIGHT,
  COMMON_TOOLTIP_TAIL_WIDTH,
  DEFAULT_TOOLTIP_BORDER_WIDTH,
  DEFAULT_TOOLTIP_OFFSET,
  DEFAULT_TOOLTIP_TAIL,
  Position,
  Side
} from '../common/tooltip/tooltip'
import { AlarmEvent, TimePrefs } from 'medical-domain'
import React, { FC } from 'react'
import { BgPrefs, Tooltip } from '../../../index'
import { TooltipLine } from '../common/tooltip-line/tooltip-line'
import { getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util';
import styles from './alarm-event-tooltip.css'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { Device } from '../../../models/device.model'
import {
  getAlarmEventDescription,
  getAlarmEventTitle,
  getBorderColor,
  getContentTitleByCode
} from '../../../utils/alarm-event/alarm-event.util'
import { AlarmMultipleOccurrences } from './alarm-multiple-occurrences/alarm-multiple-occurrences'

interface AlarmEventTooltipProps {
  alarmEvent: AlarmEvent
  position: Position
  side: Side
  bgPrefs: BgPrefs
  timePrefs: TimePrefs
  device: Device
}

export const AlarmEventTooltip: FC<AlarmEventTooltipProps> = (props) => {
  const { alarmEvent, bgPrefs, position, side, timePrefs, device } = props
  const theme = useTheme()

  const borderColor = getBorderColor(alarmEvent.alarmEventType)
  const alarmCode = alarmEvent.alarm.alarmCode
  const title = getAlarmEventTitle(alarmEvent)

  const contentTitle = getContentTitleByCode(alarmCode, device)
  const contentTextArray = getAlarmEventDescription(alarmCode, device, bgPrefs)

  return (
    <Tooltip
      position={position}
      borderColor={borderColor}
      dateTitle={getDateTitleForBaseDatum(alarmEvent, timePrefs)}
      title={title}
      side={side}
      tailWidth={COMMON_TOOLTIP_TAIL_WIDTH}
      tailHeight={COMMON_TOOLTIP_TAIL_HEIGHT}
      tail={DEFAULT_TOOLTIP_TAIL}
      borderWidth={DEFAULT_TOOLTIP_BORDER_WIDTH}
      offset={DEFAULT_TOOLTIP_OFFSET}
      content={
        <div className={styles.container}>
          <TooltipLine label={contentTitle} isBold />
          {contentTextArray.map((textLine: string) => (
            <TooltipLine label={textLine} key={textLine} />
          ))}

          {alarmEvent.otherOccurrencesDate &&
            <>
              <Divider sx={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} variant="middle" />
              <AlarmMultipleOccurrences alarmEvent={alarmEvent} timePrefs={timePrefs} />
            </>
          }
        </div>
      }
    />
  )
}
