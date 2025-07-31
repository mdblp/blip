/*
 * Copyright (c) 2022-2025, Diabeloop
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

import {
  type MedicalReport
} from '../../../../../lib/medical-files/models/medical-report.model'
import {
  getMedicalReportDate
} from '../../../../../components/dashboard-cards/medical-files/medical-report-list.util'

describe('Medical Report list util', () => {
  describe('getMedicalReportDate', () => {
    it('should return correct date when no index is given', async () => {
      const medicalReport: MedicalReport = {
        id: 'fakeId',
        authorId: 'fakeAuthorId',
        creationDate: '2023-02-15T10:00:000Z',
        patientId: 'PatientId',
        teamId: 'teamId',
        diagnosis: 'diag1',
        progressionProposal: 'proposal1',
        trainingSubject: 'training1',
        authorFirstName: 'fakeFirstName',
        authorLastName: 'fakeLastName',
        number: 10
      }
      const dateReceived = getMedicalReportDate(medicalReport)

      expect(dateReceived).toEqual('2023-02-15')
    })
  })
})
