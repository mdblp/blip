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

import HttpService, { ErrorMessageStatus } from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import DataApi from '../../../../lib/data/data.api'
import { type GetPatientDataOptions } from '../../../../lib/data/models/get-patient-data-options.model'
import { type User } from '../../../../lib/auth'
import { sortBy } from 'lodash'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { type MessageNote } from '../../../../lib/data/models/message-note.model'
import { HttpHeaderKeys } from '../../../../lib/http/models/enums/http-header-keys.enum'
import { HttpHeaderValues } from '../../../../lib/http/models/enums/http-header-values.enum'
import { MedicalData, Unit } from 'medical-domain'
import { CsvReportModel } from '../../../../lib/data/models/csv-report.model'

describe('Data API', () => {
  const patientId = 'patientId'

  describe('getPatientDataRange', () => {
    it('should get an array of strings if call success', async () => {
      const data = ['data1', 'data2']
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)
      const response = await DataApi.getPatientDataRange(patientId)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url: `/data/v2/range/${patientId}` })
    })

    it('should return null if patient is not found', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await DataApi.getPatientDataRange(patientId)
      expect(response).toBeNull()
    })

    it('should throw an error if call fails', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await DataApi.getPatientDataRange(patientId)
      }).rejects.toThrow('This error was thrown by a mock on purpose')
    })
  })

  describe('getPatientData', () => {
    it('should get patient data', async () => {
      const data: MedicalData = {
        basal: [],
        cbg: [],
        confidentialModes: [],
        deviceParametersChanges: [],
        meals: [],
        messages: [],
        physicalActivities: [],
        pumpSettings: [],
        reservoirChanges: [],
        smbg: [],
        timezoneChanges: [],
        uploads: [],
        warmUps: [],
        wizards: [],
        zenModes: [],
        bolus: []
      }
      const options: GetPatientDataOptions = {
        startDate: '2022-02-20',
        endDate: '2022-02-25',
        withPumpSettings: true,
        bgUnits: 'mmol/L'
      }
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)
      const response = await DataApi.getPatientData({ userid: patientId } as Patient, options)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/data/v2/all/${patientId}`,
        config: { params: options }
      })
    })
  })

  describe('editMessage', () => {
    it('should edit a message', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValue(undefined)
      const message = { userid: patientId } as MessageNote
      await DataApi.editMessage(message)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: '/message/v1/edit',
        payload: message
      })
    })
  })

  describe('exportData', () => {
    const report = {
      Data : {} as Blob,
      Name : "report.zip"
    } as CsvReportModel
    jest.spyOn(HttpService, 'get').mockResolvedValue({ data: report.Data }  as AxiosResponse)
    it('should get a blob with data in mg/dL if the user have no unit set', async () => {
      const bgUnits = Unit.MilligramPerDeciliter
      const startDate = '2022-02-02'
      const endDate = '2022-02-05'

      const response = await DataApi.exportData({} as User, patientId, startDate, endDate)
      expect(response).toEqual(report)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/v0/export/${patientId}`,
        config: {
          headers: { [HttpHeaderKeys.contentType]: HttpHeaderValues.zip },
          params: { bgUnits, startDate, endDate },
          responseType: "blob",
        }
      })
    })

    it('should get a blob with data with the user units', async () => {
      const bgUnits = Unit.MmolPerLiter
      const startDate = '2022-02-02'
      const endDate = '2022-02-05'

      const response = await DataApi.exportData(
        { settings: { units: { bg: bgUnits } } } as User,
        patientId,
        startDate,
        endDate
      )
      expect(response).toEqual(report)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/v0/export/${patientId}`,
        config: {
          headers: { [HttpHeaderKeys.contentType]: HttpHeaderValues.zip },
          params: { bgUnits, startDate, endDate },
          responseType: "blob",
        }
      })
    })
  })

  describe('getMessageThread', () => {
    it('should get the message thread sorted by date', async () => {
      const messageId = 'messageId'
      const data: MessageNote[] = [
        { userid: patientId, timestamp: new Date('2022-02-02') } as unknown as MessageNote,
        { userid: patientId, timestamp: new Date('2022-02-03') } as unknown as MessageNote
      ]
      jest.spyOn(HttpService, 'get').mockResolvedValue({ data } as AxiosResponse)

      let response = await DataApi.getMessageThread(messageId)
      response = sortBy(response, (message: MessageNote) => Date.parse(message.timestamp))
      expect(response).toEqual(data)

      expect(HttpService.get).toHaveBeenCalledWith({ url: `/message/v1/thread/${messageId}` })
    })
  })

  describe('postMessageThread', () => {
    it('should post a new message', async () => {
      const message = { userid: patientId } as MessageNote
      const messageId = 'messageId'
      const data = { id: messageId }
      jest.spyOn(HttpService, 'post').mockResolvedValue({ data } as AxiosResponse)

      const response = await DataApi.postMessageThread(message)
      expect(response).toEqual(messageId)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: '/message/v1/send',
        payload: message
      })
    })
  })
})
