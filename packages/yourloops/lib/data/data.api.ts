/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { sortBy } from 'lodash'
import HttpService, { ErrorMessageStatus } from '../http/http.service'
import { type GetPatientDataOptions } from './models/get-patient-data-options.model'
import type User from '../auth/models/user.model'
import bows from 'bows'
import { type Patient } from '../patient/models/patient.model'
import { type MessageNote } from './models/message-note.model'
import { HttpHeaderKeys } from '../http/models/enums/http-header-keys.enum'
import { HttpHeaderValues } from '../http/models/enums/http-header-values.enum'
import { MedicalData, Unit } from 'medical-domain'
import type { PatientDataRange } from './models/data-range.model'
import { CsvReportModel } from './models/csv-report.model'

const log = bows('Data API')

export default class DataApi {
  static async getPatientDataRange(patientId: string): Promise<PatientDataRange | null> {
    try {
      const { data } = await HttpService.get<PatientDataRange>({ url: `/data/v2/range/${patientId}` })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info(`No data for patient ${patientId}`)
        return null
      }
      throw err
    }
  }

  static async getPatientData(patient: Patient, options?: GetPatientDataOptions): Promise<MedicalData> {
    const params = {
      startDate: options?.startDate,
      endDate: options?.endDate,
      withPumpSettings: options?.withPumpSettings ?? undefined,
      bgUnits: options.bgUnits
    }
    const { data } = await HttpService.get<MedicalData>({
      url: `/data/v2/all/${patient.userid}`,
      config: { params }
    })
    return data
  }

  static async editMessage(message: MessageNote): Promise<void> {
    await HttpService.put<void, MessageNote>({
      url: '/message/v1/edit',
      payload: message
    })
  }

  static async exportData(user: User, patientId: string, startDate: string, endDate: string): Promise<CsvReportModel> {
    const bgUnits = user.settings?.units?.bg ?? Unit.MilligramPerDeciliter
    const response = await HttpService.get<Blob>({
      url: `/v0/export/${patientId}`,
      config: {
        headers: { [HttpHeaderKeys.contentType]: HttpHeaderValues.csv },
        responseType: "blob",
        params: { bgUnits, startDate, endDate }
      }
    })
    const data = response.data
    const filename = response.headers['content-disposition'].split('filename=')[1];
    return { Data: data, Name: filename }
  }

  static async getMessageThread(messageId: string): Promise<MessageNote[]> {
    const { data } = await HttpService.get<MessageNote[]>({ url: `/message/v1/thread/${messageId}` })
    return sortBy(data, (message: MessageNote) => Date.parse(message.timestamp))
  }

  static async postMessageThread(message: MessageNote): Promise<string> {
    const { data } = await HttpService.post<{ id: string }, MessageNote>({
      url: '/message/v1/send',
      payload: message
    })
    return data.id
  }
}
