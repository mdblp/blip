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
import {
  AlarmEvent,
  DeviceEventSubtype,
  DeviceParameterChange,
  ReservoirChange,
  TimePrefs,
  WarmUp
} from 'medical-domain'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { computeDateValue, getDateTitleForBaseDatum } from '../../../utils/tooltip/tooltip.util'
import { getAlarmEventIcon, getAlarmEventTitle } from '../../../utils/alarm-event/alarm-event.util'
import { useTranslation } from 'react-i18next'
import { getReservoirChangeIcon, getReservoirChangeTitle } from '../../../utils/reservoir-change/reservoir-change.util'
import warmUpIcon from 'warmup-dexcom.svg'
import parameterChangeIcon from 'parameter-change.png'
import styles from './events-superposition-popover.css'
import { BgPrefs } from '../../../models/blood-glucose.model'
import { Device } from '../../../models/device.model'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { getWarmUpTitle } from '../../../utils/warm-up/warm-up.util'
import { WarmUpContent } from './contents/warmup-content'
import { AlarmEventContent } from './contents/alarm-content'
import { ParameterChangeContent } from './contents/parameter-change-content'

interface EventsSuperpositionPopoverProps {
  superpositionEvent: SuperpositionEvent
  device: Device
  htmlElement: Element
  timePrefs: TimePrefs
  bgPrefs: BgPrefs
  onClose: () => void
}

const EventsSuperpositionPopover: FC<EventsSuperpositionPopoverProps> = (props) => {
  const { t } = useTranslation('main')
  const theme = useTheme()
  const { htmlElement, bgPrefs, device, superpositionEvent, timePrefs, onClose } = props
  const [anchorElement, setAnchorElement] = React.useState<Element | null>(htmlElement)
  const open = Boolean(anchorElement)

  const getTitle = (event: DatumWithSubType): string => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm:
        return getAlarmEventTitle(event as AlarmEvent)
      case DeviceEventSubtype.DeviceParameter:
        return t('settings-change')
      case DeviceEventSubtype.ReservoirChange:
        return getReservoirChangeTitle(event as unknown as ReservoirChange)
      case DeviceEventSubtype.Warmup:
        return getWarmUpTitle()
      default:
        return t('N/A')
    }
  }

  const getContent = (event: DatumWithSubType): JSX.Element => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm: {
        const alarmEvent = event as AlarmEvent
        return <AlarmEventContent alarmEvent={alarmEvent} device={device} bgPrefs={bgPrefs} />
      }
      case DeviceEventSubtype.DeviceParameter: {
        const parameterChange = event as DeviceParameterChange
        return <ParameterChangeContent parameterChange={parameterChange} />
      }
      case DeviceEventSubtype.Warmup: {
        const warmUpEvent = event as WarmUp
        return <WarmUpContent warmUpEvent={warmUpEvent} />
      }
      case DeviceEventSubtype.ReservoirChange:
      default:
        return <></>
    }
  }

  const getIcon = (event: DatumWithSubType): string => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm: {
        const alarmEventType = (event as AlarmEvent).alarmEventType
        return getAlarmEventIcon(alarmEventType)
      }
      case DeviceEventSubtype.DeviceParameter:
        return parameterChangeIcon
      case DeviceEventSubtype.ReservoirChange: {
        const pumpManufacturer = (event as ReservoirChange).pump?.manufacturer
        return getReservoirChangeIcon(pumpManufacturer)
      }
      case DeviceEventSubtype.Warmup:
        return warmUpIcon
      default:
        return ''
    }
  }

  const handleClose = () => {
    // Making sure to remove the focus from the clicked element to avoid an aria-hidden issue
    const clickedElement = document.activeElement as HTMLElement
    clickedElement?.blur()

    setAnchorElement(null)
    onClose()
  }

  return (
    <Popover
      anchorEl={anchorElement}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{ vertical: -10, horizontal: 0 }}
      onClose={handleClose}
      open={open}
    >
      <Box sx={{ m: 2, fontSize: "small", minWidth: "250px", maxWidth: "320px" }}>
        {superpositionEvent.events.map((event: DatumWithSubType, index: number) => {
          return (
            <React.Fragment key={event.id}>
              <Grid container>
                <Grid item xs={2}>
                  <Box className={styles.icon}>
                    <img src={getIcon(event)} alt={t('event-icon')} />
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
                    {getContent(event)}
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

export const EventSuperpositionPopoverMemoized = React.memo(EventsSuperpositionPopover)
