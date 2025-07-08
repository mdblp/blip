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
import { DatumWithSubType, SuperpositionEvent } from '../../../models/superposition-event.model'
import Popover from '@mui/material/Popover'
import { AlarmEvent, DeviceEventSubtype, ReservoirChange, TimePrefs } from 'medical-domain'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { computeDateValue, getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import {
  getAlarmEventIcon,
  getAlarmEventTitle,
  getAlarmEventDescription
} from '../../../utils/alarm-event/alarm-event.util'
import { useTranslation } from 'react-i18next'
import { getReservoirChangeIcon, getReservoirChangeTitle } from '../../../utils/reservoir-change/reservoir-change.util'
import warmUpIcon from 'warmup-dexcom.svg'
import parameterChangeIcon from 'parameter-change.png'
import styles from './events-superposition-popover.css'
import { BgPrefs } from '../../../models/blood-glucose.model'
import { Device } from '../../../models/device.model'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { getWarmUpDescription, getWarmUpEndTime, getWarmUpTitle } from '../../../utils/warm-up/warm-up.util'
import WarmUp from 'medical-domain/dist/src/domains/models/medical/datum/warm-up.model'

interface EventsSuperpositionPopoverProps {
  superpositionEvent: SuperpositionEvent
  device: Device
  anchorElement: Element
  timePrefs: TimePrefs
  bgPrefs: BgPrefs
}

export const EventsSuperpositionPopover: FC<EventsSuperpositionPopoverProps> = (props) => {
  const { t } = useTranslation('main')
  const theme = useTheme()
  const { anchorElement, bgPrefs, device, superpositionEvent, timePrefs } = props

  const getTitle = (event: DatumWithSubType): string => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm:
        return getAlarmEventTitle(event as AlarmEvent)
      case DeviceEventSubtype.DeviceParameter:
        return 'Device Parameter'
      case DeviceEventSubtype.ReservoirChange:
        return getReservoirChangeTitle(event as unknown as ReservoirChange)
      case DeviceEventSubtype.Warmup:
        return getWarmUpTitle()
      default:
        return t('N/A')
    }
  }

  const getContent = (event: DatumWithSubType): string[] => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm:
        const alarmEventCode = (event as AlarmEvent).alarm.alarmCode
        return getAlarmEventDescription(alarmEventCode, device, bgPrefs)
      case DeviceEventSubtype.DeviceParameter:
        // TODO To update
        return []
      case DeviceEventSubtype.ReservoirChange:
        return []
      case DeviceEventSubtype.Warmup:
        // TODO To rework (should not be displayed in 2 lines)
        const warmUpEvent = event as WarmUp
        return [getWarmUpDescription(), getWarmUpEndTime(warmUpEvent.epochEnd, warmUpEvent.timezone)]
      default:
        return []
    }
  }

  const getIcon = (event: DatumWithSubType): string => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm:
        const alarmEventType = (event as AlarmEvent).alarmEventType
        return getAlarmEventIcon(alarmEventType)
      case DeviceEventSubtype.DeviceParameter:
        return parameterChangeIcon
      case DeviceEventSubtype.ReservoirChange:
        const pumpManufacturer = (event as ReservoirChange).pump.manufacturer
        return getReservoirChangeIcon(pumpManufacturer)
      case DeviceEventSubtype.Warmup:
        return warmUpIcon
      default:
        return ''
    }
  }

  return (
    <Popover
      open
      anchorEl={anchorElement}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{ vertical: -10, horizontal: 0 }}
    >
      <Box sx={{ m: 2, fontSize: "small", minWidth: "250px" }}>
        {superpositionEvent.events.map((event: DatumWithSubType, index: number) => {
          return (
            <React.Fragment key={index}>
              <Grid container>
                <Grid item xs={2}>
                  <Box>
                    <img src={getIcon(event)} alt="Event icon" />
                  </Box>
                </Grid>
                <Grid item xs={10}>
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{ marginBottom: theme.spacing(1) }}
                    >
                      <span className={styles.title}>{getTitle(event)}</span>
                      <span>{computeDateValue(getDateTitleForBaseDatum(event, timePrefs))}</span>
                    </Box>
                    <Box>
                      {getContent(event).map((line: string, lineIndex: number) => (
                        <Box key={lineIndex} className={styles.contentLine}>
                          {line}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              {index < superpositionEvent.events.length - 1 && <Divider sx={{ marginTop: theme.spacing(2), marginBottom: theme.spacing(2) }} />}
            </React.Fragment>
          )
        })}
      </Box>
    </Popover>
  )
}
