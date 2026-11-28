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

import Divider from '@mui/material/Divider'
import {
  type AlarmEvent,
  DeviceEventSubtype,
  type DeviceParameterChange,
  type ReservoirChange,
  type TimePrefs,
  type WarmUp
} from 'medical-domain'
import React, { type FunctionComponent } from 'react'
import { type BgPrefs } from '../../../models/blood-glucose.model'
import { type Device } from '../../../models/device.model'
import { type DatumWithSubType, type SuperpositionEvent } from '../../../models/superposition-event.model'
import { AlarmEventDrawerContent } from '../alarm-event-drawer/alarm-event-drawer-content'
import { DailyDrawer } from '../common/daily-drawer'
import { ParameterDrawerContent } from '../parameter-drawer/parameter-drawer-content'
import { ReservoirChangeDrawerContent } from '../reservoir-change-drawer/reservoir-change-drawer-content'
import { WarmUpDrawerContent } from '../warm-up-drawer/warm-up-drawer-content'

interface EventsSuperpositionDrawerProps {
  superpositionEvent: SuperpositionEvent
  bgPrefs: BgPrefs
  device: Device
  timePrefs: TimePrefs
  onClose: () => void
}

export const EventsSuperpositionDrawer: FunctionComponent<EventsSuperpositionDrawerProps> = (props) => {
  const { superpositionEvent, bgPrefs, device, timePrefs, onClose } = props

  const getSection = (event: DatumWithSubType): JSX.Element | null => {
    switch (event.subType) {
      case DeviceEventSubtype.Alarm:
        return <AlarmEventDrawerContent alarmEvent={event as AlarmEvent} bgPrefs={bgPrefs} device={device} timePrefs={timePrefs} />
      case DeviceEventSubtype.DeviceParameter:
        return <ParameterDrawerContent parameterChange={event as DeviceParameterChange} timePrefs={timePrefs} />
      case DeviceEventSubtype.ReservoirChange:
        return <ReservoirChangeDrawerContent reservoirChange={event as ReservoirChange} timePrefs={timePrefs} />
      case DeviceEventSubtype.Warmup:
        return <WarmUpDrawerContent warmUp={event as WarmUp} timePrefs={timePrefs} />
      default:
        return null
    }
  }

  return (
    <DailyDrawer onClose={onClose}>
      {superpositionEvent.events.map((event: DatumWithSubType, index: number) => (
        <React.Fragment key={event.id}>
          {index > 0 && <Divider sx={{ marginBottom: 2 }} />}
          {getSection(event)}
        </React.Fragment>
      ))}
    </DailyDrawer>
  )
}
