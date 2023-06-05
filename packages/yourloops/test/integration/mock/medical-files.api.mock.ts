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

import MedicalFilesApi from '../../../lib/medical-files/medical-files.api'
import { patient1Id } from '../data/patient.api.data'

export const mockMedicalFilesAPI = (teamId: string, teamName: string) => {
  jest.spyOn(MedicalFilesApi, 'getMedicalReports').mockResolvedValue([{
    id: 'medicalReportId',
    authorId: 'authorId',
    creationDate: '2022-01-10T08:34:06.898Z',
    patientId: patient1Id,
    teamId,
    teamName,
    diagnosis: 'whatever diagnosis',
    progressionProposal: 'whatever proposal',
    trainingSubject: 'here is the subject',
    number: 1,
    authorFirstName: 'Vishnou',
    authorLastName: 'Lapaix'
  },
  {
    id: 'medicalReportId2',
    authorId: 'authorId',
    creationDate: '2022-01-02T10:30:00.000Z',
    patientId: patient1Id,
    teamId,
    teamName,
    diagnosis: 'whatever diagnosis 2 ',
    progressionProposal: 'whatever proposal 2',
    trainingSubject: 'here is the subject 2',
    number: 2,
    authorFirstName: 'Vishnou',
    authorLastName: 'Lapaix'
  }])
}

export const mockMedicalFilesApiEmptyResult = () => {
  jest.spyOn(MedicalFilesApi, 'getMedicalReports').mockResolvedValue([])
}
