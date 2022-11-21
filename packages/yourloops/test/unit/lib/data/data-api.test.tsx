/*
 * Copyright (c) 2022, Diabeloop
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

import { IUser } from '../../../../models/user'
import HttpService, { ErrorMessageStatus } from '../../../../services/http'
import { AxiosResponse } from 'axios'
import { HttpHeaderKeys, HttpHeaderValues } from '../../../../models/api'
import DataApi from '../../../../lib/data/data-api'
import { PatientData, PatientDatum } from '../../../../models/device-data'
import { Patient } from '../../../../lib/data/patient'
import { GetPatientDataOptions } from '../../../../lib/data/models'
import MessageNote from '../../../../models/message'
import { Units } from '../../../../models/generic'
import { User } from '../../../../lib/auth'
import { sortBy } from 'lodash'

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
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
    })
  })

  describe('getPatientData', () => {
    it('should get patient data', async () => {
      const data: PatientData = [{ id: 'id' } as PatientDatum]
      const options: GetPatientDataOptions = {
        startDate: '2022-02-20',
        endDate: '2022-02-25',
        withPumpSettings: true
      }
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)
      const response = await DataApi.getPatientData({ userid: patientId } as Patient, options)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/data/v1/dataV2/${patientId}`,
        config: { params: options }
      })
    })
  })

  describe('getMessages', () => {
    it('should get patient messages', async () => {
      const data: MessageNote[] = [{ userid: patientId } as MessageNote]
      const options: GetPatientDataOptions = {
        startDate: '2022-02-20',
        endDate: '2022-02-25'
      }
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)
      const response = await DataApi.getMessages({ userid: patientId } as IUser, options)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/message/v1/notes/${patientId}`,
        config: {
          params: {
            starttime: options.startDate,
            endtime: options.endDate
          }
        }
      })
    })

    it('should return an empty array if there is no messages', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await DataApi.getMessages({ userid: patientId } as IUser)
      expect(response).toEqual([])
    })

    it('should throw an error if http call fails', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await DataApi.getMessages({ userid: patientId } as IUser)
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
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
    it('should get a blob with data', async () => {
      const data = {} as Blob
      const bgUnits = Units.gram
      const startDate = '2022-02-02'
      const endDate = '2022-02-05'
      jest.spyOn(HttpService, 'get').mockResolvedValue({ data } as AxiosResponse)

      const response = await DataApi.exportData({} as User, patientId, startDate, endDate)
      expect(response).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: `/export/${patientId}`,
        config: {
          headers: { [HttpHeaderKeys.contentType]: HttpHeaderValues.csv },
          params: { bgUnits, startDate, endDate }
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
