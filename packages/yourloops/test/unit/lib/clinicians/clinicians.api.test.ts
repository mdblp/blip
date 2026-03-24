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

import { LeadCliniciansApi } from '../../../../lib/lead-clinicians/lead-clinicians.api'
import HttpService from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import { type LeadClinicianPayload } from '../../../../lib/lead-clinicians/models/lead-clinician-payload.model'

describe('CliniciansApi', () => {
  const patientId = 'patient123'
  const hcpId = 'hcp456'

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('addClinician', () => {
    it('should add a clinician to a patient successfully', async () => {
      const expectedPayload: LeadClinicianPayload = {
        hcpUserId: hcpId
      }

      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: undefined } as AxiosResponse)

      await LeadCliniciansApi.addClinician(patientId, hcpId)

      expect(HttpService.post).toHaveBeenCalledWith({
        url: `/crew/v1/patients/${patientId}/lead-clinicians`,
        payload: expectedPayload
      })
      expect(HttpService.post).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the HTTP call fails', async () => {
      const errorMessage = 'Failed to add clinician'
      jest.spyOn(HttpService, 'post').mockRejectedValueOnce(new Error(errorMessage))

      await expect(async () => {
        await LeadCliniciansApi.addClinician(patientId, hcpId)
      }).rejects.toThrow(errorMessage)

      expect(HttpService.post).toHaveBeenCalledTimes(1)
    })

    it('should handle network errors when adding a clinician', async () => {
      const networkError = new Error('Network error')
      jest.spyOn(HttpService, 'post').mockRejectedValueOnce(networkError)

      await expect(async () => {
        await LeadCliniciansApi.addClinician(patientId, hcpId)
      }).rejects.toThrow('Network error')
    })

    it('should call the correct endpoint with valid patient and HCP IDs', async () => {
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: undefined } as AxiosResponse)

      await LeadCliniciansApi.addClinician(patientId, hcpId)

      expect(HttpService.post).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `/crew/v1/patients/${patientId}/lead-clinicians`
        })
      )
    })
  })

  describe('removeClinician', () => {
    it('should remove a clinician from a patient successfully', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)

      await LeadCliniciansApi.removeClinician(patientId, hcpId)

      expect(HttpService.delete).toHaveBeenCalledWith({
        url: `/crew/v1/patients/${patientId}/lead-clinicians/${hcpId}`
      })
      expect(HttpService.delete).toHaveBeenCalledTimes(1)
    })

    it('should throw an error if the HTTP call fails', async () => {
      const errorMessage = 'Failed to remove clinician'
      jest.spyOn(HttpService, 'delete').mockRejectedValueOnce(new Error(errorMessage))

      await expect(async () => {
        await LeadCliniciansApi.removeClinician(patientId, hcpId)
      }).rejects.toThrow(errorMessage)

      expect(HttpService.delete).toHaveBeenCalledTimes(1)
    })

    it('should call the correct endpoint with valid patient and HCP IDs', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)

      await LeadCliniciansApi.removeClinician(patientId, hcpId)

      expect(HttpService.delete).toHaveBeenCalledWith(
        expect.objectContaining({
          url: `/crew/v1/patients/${patientId}/lead-clinicians/${hcpId}`
        })
      )
    })

    it('should handle special characters in IDs when removing clinician', async () => {
      const specialPatientId = 'patient-123_abc'
      const specialHcpId = 'hcp-456_xyz'
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)

      await LeadCliniciansApi.removeClinician(specialPatientId, specialHcpId)

      expect(HttpService.delete).toHaveBeenCalledWith({
        url: `/crew/v1/patients/${specialPatientId}/lead-clinicians/${specialHcpId}`
      })
    })
  })
})

