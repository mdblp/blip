/**
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

import { MedicalRecord, NewMedicalRecord, Prescription, WeeklyReport } from '../../../lib/medical-files/model'
import HttpService from '../../../services/http'
import { AxiosResponse } from 'axios'
import MedicalFilesApi from '../../../lib/medical-files/medical-files-api'

describe('Medical files API', () => {
  const patientId = 'patientId'
  const teamId = 'teamId'

  it('should get all prescriptions', async () => {
    const payload: Prescription[] = [{} as Prescription, {} as Prescription]
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const prescriptions = await MedicalFilesApi.getPrescriptions(patientId, teamId)
    expect(prescriptions).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: 'cargo/v0/prescriptions',
      config: { params: { teamId, patientId } }
    })
  })

  it('should get a single prescription', async () => {
    const prescriptionId = 'fakeId'
    const payload: Prescription = { id: prescriptionId } as Prescription
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const prescription = await MedicalFilesApi.getPrescription(patientId, teamId, prescriptionId)
    expect(prescription).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: `/cargo/v0/prescriptions/${prescriptionId}`,
      config: { params: { teamId, patientId }, responseType: 'blob' }
    })
  })

  it('upload a prescription', async () => {
    const payload: Prescription = { id: 'presrId' } as Prescription
    const prescriptorId = 'prescriptorId'
    const blob = new Blob(['fake-url.jpeg'], { type: 'image/jpeg' })
    const file = new File([blob], 'fake.png', {
      lastModified: new Date().getMilliseconds(),
      type: 'image/jpeg'
    })

    jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const prescription = await MedicalFilesApi.uploadPrescription(patientId, teamId, prescriptorId, 12, file)
    expect(prescription).toEqual(payload)
    expect(HttpService.post).toHaveBeenCalledWith({
      url: 'cargo/v0/prescriptions',
      payload: expect.anything(),
      config: {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    })
  })

  it('should get weekly reports', async () => {
    const payload: WeeklyReport[] = [{} as WeeklyReport, {} as WeeklyReport]
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const weeklyReports = await MedicalFilesApi.getWeeklyReports(patientId, teamId)
    expect(weeklyReports).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: 'cargo/v0/weekly-reports',
      config: { params: { teamId, patientId } }
    })
  })

  it('should get a single weekly report', async () => {
    const weeklyReportId = 'fakeId'
    const payload = {} as WeeklyReport
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const weeklyReport = await MedicalFilesApi.getWeeklyReport(patientId, teamId, weeklyReportId)
    expect(weeklyReport).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: `/cargo/v0/weekly-reports/${weeklyReportId}`,
      config: { params: { teamId, patientId } }
    })
  })

  it('should get medical records', async () => {
    const payload: MedicalRecord[] = [{} as MedicalRecord, {} as MedicalRecord]
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const medicalRecords = await MedicalFilesApi.getMedicalRecords(patientId, teamId)
    expect(medicalRecords).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: '/cargo/v0/medical-records',
      config: { params: { teamId, patientId } }
    })
  })

  it('should get a single medical record', async () => {
    const medicalRecordId = 'fakeId'
    const payload = {} as MedicalRecord
    jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const medicalRecord = await MedicalFilesApi.getMedicalRecord(patientId, teamId, medicalRecordId)
    expect(medicalRecord).toEqual(payload)
    expect(HttpService.get).toHaveBeenCalledWith({
      url: `/cargo/v0/medical-records/${medicalRecordId}`,
      config: { params: { teamId, patientId } }
    })
  })

  it('should create a medical record', async () => {
    const payload = {} as NewMedicalRecord
    jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const medicalRecord = await MedicalFilesApi.createMedicalRecord(payload)
    expect(medicalRecord).toEqual(payload)
    expect(HttpService.post).toHaveBeenCalledWith({
      url: '/cargo/v0/medical-records',
      payload
    })
  })

  it('should update a medical record', async () => {
    const payload = {} as MedicalRecord
    jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: payload } as AxiosResponse)
    const medicalRecord = await MedicalFilesApi.createMedicalRecord(payload)
    expect(medicalRecord).toEqual(payload)
    expect(HttpService.post).toHaveBeenCalledWith({
      url: '/cargo/v0/medical-records',
      payload
    })
  })

  it('should delete a medical record', async () => {
    const medicalRecordId = 'fakeId'
    jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
    await MedicalFilesApi.deleteMedicalRecord(medicalRecordId)
    expect(HttpService.delete).toHaveBeenCalledWith({
      url: `/cargo/v0/medical-records/${medicalRecordId}`
    })
  })
})
