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

import MedicalDataService from 'medical-domain'
import moment from 'moment-timezone'
import { DatumWithSubType, SuperpositionEvent } from '../../models/superposition-event.model'

const SUPERPOSITION_TIME_FRAME_MN = 30

export const getSuperpositionEvents = (medicalData: MedicalDataService): SuperpositionEvent[] => {
  const allData = medicalData.medicalData

  const alarmEvents = allData.alarmEvents
  const parameterChanges = allData.deviceParametersChanges
  const reservoirChanges = allData.reservoirChanges
  const warmUps = allData.warmUps

  const allEvents = [...alarmEvents, ...parameterChanges, ...reservoirChanges, ...warmUps]
  const sortedEvents = [...allEvents].sort((a: DatumWithSubType, b: DatumWithSubType) => {
    return moment(a.normalTime).valueOf() - moment(b.normalTime).valueOf()
  })

  return sortedEvents.reduce((acc: SuperpositionEvent[], event: DatumWithSubType) => {
    const lastEvent = acc[acc.length - 1]
    const isEventWithinTimeRange = lastEvent && moment(event.normalTime).isBefore(moment(lastEvent.normalTime).add(SUPERPOSITION_TIME_FRAME_MN, 'minutes'))

    if (isEventWithinTimeRange) {
      lastEvent.events.push(event)
      lastEvent.eventsCount++
    } else {
      acc.push({
        eventsCount: 1,
        events: [event],
        normalTime: event.normalTime
      })
    }

    return acc
  }, [])
    .filter((superpositionEvent: SuperpositionEvent) => superpositionEvent.eventsCount !== 1)
}

export const getDataWithoutSuperpositionEvents = (data: DatumWithSubType[], superpositionEvents: SuperpositionEvent[]): DatumWithSubType[] => {
  const allSuperpositionEventIds = superpositionEvents
    .map((superpositionEvent: SuperpositionEvent) => superpositionEvent.events)
    .flat()
    .map((event: DatumWithSubType) => event.id)

  return data.filter((datum: DatumWithSubType) => !allSuperpositionEventIds.includes(datum.id))
}
