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

import {
  type MedicalReport,
  type MedicalReportWithIndex
} from '../../../../../lib/medical-files/models/medical-report.model'
import {
  getMedicalReportDate,
  getMedicalReportsToDisplay
} from '../../../../../components/dashboard-widgets/medical-files/medical-report-list.util'

describe('Medical Report list util', () => {
  const medicalReports: MedicalReport[] = [
    {
      id: 'fakeId',
      authorId: 'fakeAuthorId',
      creationDate: '2023-02-15T10:00:000Z',
      patientId: 'PatientId',
      teamId: 'teamId',
      diagnosis: 'diag1',
      progressionProposal: 'proposal1',
      trainingSubject: 'training1'
    },
    {
      id: 'fakeId2',
      authorId: 'fakeAuthorId2',
      creationDate: '2023-02-15T08:00:00.000Z',
      patientId: 'PatientId2',
      teamId: 'teamId2',
      diagnosis: 'diag2',
      progressionProposal: 'proposal2',
      trainingSubject: 'training2'
    },
    {
      id: 'fakeId3',
      authorId: 'fakeAuthorId3',
      creationDate: '2023-02-11T07:00:00.000Z',
      patientId: 'PatientId2',
      teamId: 'teamId2',
      diagnosis: 'diag3',
      progressionProposal: 'proposal3',
      trainingSubject: 'training3'
    },
    {
      id: 'fakeId4',
      authorId: 'fakeAuthorId4',
      creationDate: '2024-03-18T19:00:00.000Z',
      patientId: 'PatientId2',
      teamId: 'teamId2',
      diagnosis: 'diag4',
      progressionProposal: 'proposal4',
      trainingSubject: 'training4'
    }
  ]

  describe('getMedicalReportsToDisplay', () => {
    it('should return correct list of medical report to display', async () => {
      const medicalReportsExpected: MedicalReportWithIndex[] = [
        { medicalReport: medicalReports[2] },
        { medicalReport: medicalReports[1] },
        { medicalReport: medicalReports[0], index: 1 },
        { medicalReport: medicalReports[3] }
      ]
      const medicalReportsReceived = getMedicalReportsToDisplay(medicalReports)

      expect(medicalReportsReceived).toEqual(medicalReportsExpected)
    })

    it('should return an empty array when no medical records are given', async () => {
      const medicalReportsReceived = getMedicalReportsToDisplay(null)

      expect(medicalReportsReceived).toEqual([])
    })
  })

  describe('getMedicalReportDate', () => {
    it('should return correct date when no index is given', async () => {
      const medicalReport: MedicalReportWithIndex = {
        medicalReport: {
          id: 'fakeId',
          authorId: 'fakeAuthorId',
          creationDate: '2023-02-15T10:00:000Z',
          patientId: 'PatientId',
          teamId: 'teamId',
          diagnosis: 'diag1',
          progressionProposal: 'proposal1',
          trainingSubject: 'training1'
        }
      }
      const dateReceived = getMedicalReportDate(medicalReport)

      expect(dateReceived).toEqual('2023-02-15')
    })

    it('should return correct date when an index is given', async () => {
      const medicalReport: MedicalReportWithIndex = {
        medicalReport: {
          id: 'fakeId',
          authorId: 'fakeAuthorId',
          creationDate: '2023-02-15T10:00:000Z',
          patientId: 'PatientId',
          teamId: 'teamId',
          diagnosis: 'diag1',
          progressionProposal: 'proposal1',
          trainingSubject: 'training1'
        },
        index: 30
      }
      const dateReceived = getMedicalReportDate(medicalReport)

      expect(dateReceived).toEqual('2023-02-15_30')
    })
  })
})
