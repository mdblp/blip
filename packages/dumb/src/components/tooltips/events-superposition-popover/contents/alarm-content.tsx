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
import { AlarmEvent } from 'medical-domain'
import styles from '../events-superposition-popover.css'
import { getAlarmEventDescription } from '../../../../utils/alarm-event/alarm-event.util'
import { Device } from '../../../../models/device.model'
import { BgPrefs } from '../../../../models/blood-glucose.model'

interface AlarmEventContentProps {
  alarmEvent: AlarmEvent
  device: Device
  bgPrefs: BgPrefs
}

export const AlarmEventContent: FC<AlarmEventContentProps> = (props) => {
  const { alarmEvent, device, bgPrefs } = props

  const alarmEventCode = alarmEvent.alarm.alarmCode
  const description = getAlarmEventDescription(alarmEventCode, device, bgPrefs)

  return (
    <>
      {description.map((line: string, lineIndex: number) => (
        <Box key={lineIndex} className={styles.contentLine}>
          {line}
        </Box>
      ))}
    </>
  );
}
