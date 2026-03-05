/*
 * Copyright (c) 2022-2026, Diabeloop
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

import HttpService from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import { type INotification } from '../../../../lib/notifications/models/i-notification.model'
import { getCurrentLang } from '../../../../lib/language'
import PatientApi from '../../../../lib/patient/patient.api'
import { UserRole } from '../../../../lib/auth/models/enums/user-role.enum'
import { HttpHeaderKeys } from '../../../../lib/http/models/enums/http-header-keys.enum'
import { type MonitoringAlertsParameters, Unit } from 'medical-domain'
import { type PatientAlertsConfiguration } from '../../../../lib/patient/models/monitoring-alerts-parameters.model'

describe('PatientApi', () => {
  const userId = 'userId'
  const teamId = 'teamId'
  const email = 'email@test.com'

  describe('invitePatient', () => {
    it('should invite a new patient in a team and get a notification if success', async () => {
      const data = { creatorId: 'creatorId' } as INotification
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data } as AxiosResponse)

      const notification = await PatientApi.invitePatient({ teamId, email })
      expect(notification).toEqual(data)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: '/confirm/send/team/invite',
        payload: { teamId, email, role: UserRole.Patient },
        config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } }
      }, [409])
    })
  })

  describe('removePatient', () => {
    it('should remove a patient from a team', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
      await PatientApi.removePatient(teamId, userId)
      expect(HttpService.delete).toHaveBeenCalledWith({ url: `/crew/v1/teams/${teamId}/patients/${userId}` })
    })
  })

  describe('updatePatientAlerts', () => {
    const patientId = 'patient123'
    const mockMonitoringAlertsParameters: MonitoringAlertsParameters = {
      bgUnit: Unit.MilligramPerDeciliter,
      lowBg: 70,
      highBg: 180,
      veryLowBg: 54,
      veryHighBg: 250,
      outOfRangeThreshold: 50,
      hypoThreshold: 5,
      hyperThreshold: 10,
      nonDataTxThreshold: 50
    }

    it('should update patient alerts parameters successfully', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValueOnce({ data: undefined } as AxiosResponse)

      await PatientApi.updatePatientAlerts(teamId, patientId, mockMonitoringAlertsParameters)

      const expectedPayload: PatientAlertsConfiguration = {
        parameters: {
          bgUnit: Unit.MilligramPerDeciliter,
          hyperglycemia: {
            rateThreshold: 10,
            glycemiaUpperLimit: 250
          },
          hypoglycemia: {
            rateThreshold: 5,
            glycemiaLowerLimit: 54
          },
          nonDataTransmission: {
            rateThreshold: 50
          },
          timeOutOfRange: {
            rateThreshold: 50,
            glycemiaLowerLimit: 70,
            glycemiaUpperLimit: 180
          }
        }
      } as PatientAlertsConfiguration

      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/crew/v1/teams/${teamId}/patients/${patientId}/monitoring-alerts-parameters`,
        payload: expectedPayload
      })
    })

    it('should call HttpService.put with correct payload structure', async () => {
      jest.spyOn(HttpService, 'put').mockResolvedValueOnce({ data: undefined } as AxiosResponse)

      await PatientApi.updatePatientAlerts(teamId, patientId, mockMonitoringAlertsParameters)

      expect(HttpService.put).toHaveBeenCalledTimes(1)

      const callArgs = (HttpService.put as jest.Mock).mock.calls[0][0]
      expect(callArgs.url).toBe(`/crew/v1/teams/${teamId}/patients/${patientId}/monitoring-alerts-parameters`)
      expect(callArgs.payload).toBeDefined()
      expect(callArgs.payload.parameters).toBeDefined()
      expect(callArgs.payload.parameters.bgUnit).toBe(Unit.MilligramPerDeciliter)
      expect(callArgs.payload.parameters.hyperglycemia).toEqual({
        rateThreshold: 10,
        glycemiaUpperLimit: 250
      })
      expect(callArgs.payload.parameters.hypoglycemia).toEqual({
        rateThreshold: 5,
        glycemiaLowerLimit: 54
      })
      expect(callArgs.payload.parameters.nonDataTransmission).toEqual({
        rateThreshold: 50
      })
      expect(callArgs.payload.parameters.timeOutOfRange).toEqual({
        rateThreshold: 50,
        glycemiaLowerLimit: 70,
        glycemiaUpperLimit: 180
      })
    })

    it('should handle different monitoring alerts parameters', async () => {
      const differentParameters: MonitoringAlertsParameters = {
        bgUnit: Unit.MmolPerLiter,
        lowBg: 3.9,
        highBg: 10.0,
        veryLowBg: 3.0,
        veryHighBg: 13.9,
        outOfRangeThreshold: 60,
        hypoThreshold: 10,
        hyperThreshold: 15,
        nonDataTxThreshold: 75
      }

      jest.spyOn(HttpService, 'put').mockResolvedValueOnce({ data: undefined } as AxiosResponse)

      await PatientApi.updatePatientAlerts(teamId, patientId, differentParameters)

      const expectedPayload: PatientAlertsConfiguration = {
        parameters: {
          bgUnit: Unit.MmolPerLiter,
          hyperglycemia: {
            rateThreshold: 15,
            glycemiaUpperLimit: 13.9
          },
          hypoglycemia: {
            rateThreshold: 10,
            glycemiaLowerLimit: 3.0
          },
          nonDataTransmission: {
            rateThreshold: 75
          },
          timeOutOfRange: {
            rateThreshold: 60,
            glycemiaLowerLimit: 3.9,
            glycemiaUpperLimit: 10.0
          }
        }
      } as PatientAlertsConfiguration

      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/crew/v1/teams/${teamId}/patients/${patientId}/monitoring-alerts-parameters`,
        payload: expectedPayload
      })
    })

    it('should propagate errors from HttpService', async () => {
      const mockError = new Error('Network error')
      jest.spyOn(HttpService, 'put').mockRejectedValueOnce(mockError)

      await expect(
        PatientApi.updatePatientAlerts(teamId, patientId, mockMonitoringAlertsParameters)
      ).rejects.toThrow('Network error')
    })
  })
})
