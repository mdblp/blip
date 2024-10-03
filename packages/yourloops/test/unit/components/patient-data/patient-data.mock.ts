/*
 * Copyright (c) 2023-2024, Diabeloop
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

import type { PatientData } from '../../../../lib/data/models/patient-datum.model'
import type { MessageNote } from '../../../../lib/data/models/message-note.model'
import type { PatientDataRange } from '../../../../lib/data/models/data-range.model'
import { CONFIDENTIAL_MODE_ID } from '../../../integration/mock/data.api.mock'

export const dataRangeMock: PatientDataRange = ['2022-08-08T15:00:00Z', '2022-08-08T18:40:00Z']

export const patientDataMock: PatientData = [
  { time: '2022-08-08T15:15:00Z', type: 'smbg', id: 'smbgId', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T15:30:00Z', type: 'cbg', id: 'cbgId', timezone: 'Europe/Paris', units: 'mmol/L', value: 10.5, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T15:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T15:40:00Z', type: 'cbg', id: 'cbg_2022-08-08T15:40:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 14.7, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:10:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:10:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 6.5, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:20:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:20:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:25:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:25:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:30:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:30:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:35:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:35:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 3.4, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:45:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:45:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:50:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:50:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:55:00Z', type: 'cbg', id: 'cbg_2022-08-08T16:55:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T17:00:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:00:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T17:05:00Z', type: 'cbg', id: 'cbg_2022-08-08T17:05:00', timezone: 'Europe/Paris', units: 'mmol/L', value: 2.2, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T18:25:00Z', type: 'bolus', id: 'carbBolusId', timezone: 'Europe/Paris', prescriptor: 'auto', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T18:25:00Z', type: 'wizard', id: 'wizardId1', timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 45, bolus: 'carbBolusId', uploadId: 'osef', _userId: 'osef', inputMeal: { fat: 'yes' }, inputTime: '2022-08-08T02:00:00Z' },
  { time: '2022-08-08T18:35:00Z', type: 'bolus', id: 'carbBolusId2', timezone: 'Europe/Paris', prescriptor: 'auto', normal: 1.3, subType: 'normal', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T18:35:00Z', type: 'wizard', id: 'wizardId2', timezone: 'Europe/Paris', units: 'mmol/L', carbInput: 50, bolus: 'carbBolusId2', uploadId: 'osef', _userId: 'osef', inputMeal: { source: 'umm' }, inputTime: '2022-08-08T18:34:00Z' },
  { time: '2022-08-08T16:30:00Z', type: 'basal', id: 'basal_2022-08-08_5', timezone: 'Europe/Paris', deliveryType: 'automated', duration: 1000, rate: 0.8, uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T16:35:00Z', type: 'pumpSettings', id: 'pump_2022-08-08_6', timezone: 'UTC', uploadId: 'osef', payload: { cgm: { apiVersion: 'v1', endOfLifeTransmitterDate: '2050-04-12T17:53:54+02:00', expirationDate: '2050-04-12T17:53:54+02:00', manufacturer: 'Dexcom', name: 'G6', swVersionTransmitter: 'v1', transmitterId: 'a1234' }, device: { deviceId: '1234', imei: '1234567890', manufacturer: 'Diabeloop', name: 'DBLG1', swVersion: 'beta' }, history: [], parameters: [{ name: 'WEIGHT', value: '72', unit: 'kg', level: 1, effectiveDate: '2020-01-17T08:00:00Z' }], pump: { manufacturer: 'Vicentra', name: 'Kaleido', serialNumber: '123456', swVersion: 'beta' } }, _userId: 'osef' },
  { time: '2022-08-08T02:00:00Z', type: 'deviceEvent', id: CONFIDENTIAL_MODE_ID, timezone: 'Europe/Paris', duration: { units: 'hours', value: 2 }, guid: 'confidential_0', inputTime: '2022-08-08T02:00:00Z', subType: 'confidential', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T12:00:00Z', type: 'food', id: 'carbId', timezone: 'Europe/Paris', meal: 'rescuecarbs', nutrition: { carbohydrate: { net: 15, units: 'grams' } }, prescribedNutrition: { carbohydrate: { net: 16, units: 'grams' } }, prescriptor: 'hybrid', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T13:00:00Z', type: 'physicalActivity', id: 'physicalActivityId', timezone: 'Europe/Paris', duration: { units: 'seconds', value: 1800 }, guid: 'pa_18', reportedIntensity: 'medium', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T17:00:00Z', type: 'deviceEvent', id: 'reservoirChangeId', subType: 'reservoirChange', timezone: 'Europe/Paris', uploadId: 'osef', _userId: 'osef' },
  { time: '2022-08-08T08:00:00Z', type: 'deviceEvent', id: 'parameterId', lastUpdateDate: '2022-08-08T08:00:00Z', level: '1', name: 'MEAL_RATIO_LUNCH_FACTOR', previousValue: '110', subType: 'deviceParameter', timezone: 'UTC', units: '%', uploadId: 'osef', value: '100', _userId: 'osef' }
]

export const messagesMock: MessageNote[] = [
  {
    id: 'messageNoteId',
    userid: 'fakeId',
    messagetext: 'Nice carbs shot here !',
    groupid: 'groupId',
    timestamp: '2022-08-08T18:25:00Z',
    parentmessage: 'parentMessage',
    user: {
      fullName: 'Dr Canut'
    }
  }
]
