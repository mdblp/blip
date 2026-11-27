/*
 * Copyright (c) 2026, Diabeloop
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

import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { type AlarmEvent, type TimePrefs } from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import { type BgPrefs } from '../../models/blood-glucose.model'
import { type Device } from '../../models/device.model'
import {
  getAlarmEventDescription,
  getAlarmEventIcon,
  getAlarmEventTitle,
  getContentTitleByCode
} from '../../utils/alarm-event/alarm-event.util'
import { getDateTitleForBaseDatum } from '../../utils/tooltip/tooltip.util'
import { AlarmMultipleOccurrences } from '../tooltips/alarm-event-tooltip/alarm-multiple-occurrences/alarm-multiple-occurrences'
import { DailyDrawer } from './daily-drawer'
import { DailyDrawerIcon } from './daily-drawer-icon'

interface AlarmEventDrawerProps {
  datum: AlarmEvent
  bgPrefs: BgPrefs
  device: Device
  timePrefs: TimePrefs
  onClose: () => void
}

export const AlarmEventDrawer: FunctionComponent<AlarmEventDrawerProps> = (props) => {
  const { datum: alarmEvent, bgPrefs, device, timePrefs, onClose } = props

  const alarmCode = alarmEvent.alarm.alarmCode
  const contentTitle = getContentTitleByCode(alarmCode, device)
  const contentTextArray = getAlarmEventDescription(alarmCode, device, bgPrefs)

  return (
    <DailyDrawer
      icon={<DailyDrawerIcon src={getAlarmEventIcon(alarmEvent.alarmEventType)} />}
      title={getAlarmEventTitle(alarmEvent)}
      dateTitle={getDateTitleForBaseDatum(alarmEvent, timePrefs)}
      content={
        <>
          <Box sx={{ fontWeight: 'bold' }}>{contentTitle}</Box>
          {contentTextArray.map((textLine) => <Box key={textLine}>{textLine}</Box>)}
          {alarmEvent.otherOccurrencesDate &&
            <>
              <Divider sx={{ marginY: 2 }} />
              <AlarmMultipleOccurrences alarmEvent={alarmEvent} timePrefs={timePrefs} isDrawer />
            </>
          }
        </>
      }
      onClose={onClose}
    />
  )
}
