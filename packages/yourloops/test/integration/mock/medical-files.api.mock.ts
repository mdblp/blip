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

import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import { monitoredPatientId } from './patient.api.mock'
import { monitoringParameters } from './team.api.mock'

export const mockMedicalFilesAPI = () => {
  jest.spyOn(MedicalFilesApi, 'getWeeklyReports').mockResolvedValue([{
    id: 'weeklyReportMocked',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    parameters: monitoringParameters,
    alarms: {
      timeSpentAwayFromTargetRate: 20,
      timeSpentAwayFromTargetActive: true,
      frequencyOfSevereHypoglycemiaRate: 20,
      frequencyOfSevereHypoglycemiaActive: true,
      nonDataTransmissionRate: 20,
      nonDataTransmissionActive: true
    },
    creationDate: '2022-01-02T08:34:06.898Z'
  }])
  jest.spyOn(MedicalFilesApi, 'getPrescriptions').mockResolvedValue([{
    id: 'prescriptionMocked',
    name: 'patientPrescription',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    prescriptorId: 'prescriptorId',
    link: 'https://linkToPrescription',
    uploadedAt: '2022-01-02T08:34:06.898Z'
  }])
  jest.spyOn(MedicalFilesApi, 'getMedicalRecords').mockResolvedValue([{
    id: 'medicalRecordId',
    authorId: 'authorId',
    creationDate: '2022-01-02T08:34:06.898Z',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    diagnosis: 'whatever diagnosis',
    progressionProposal: 'whatever proposal',
    trainingSubject: 'here is the subject'
  }])
}