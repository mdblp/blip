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

import { act, renderHook } from '@testing-library/react'
import * as authHookMock from '../../../../lib/auth'
import { type MedicalReport, type NewMedicalReport } from '../../../../lib/medical-files/models/medical-report.model'
import { useMedicalReportEditDialog } from '../../../../components/dialogs/medical-report-edit-dialog.hook'
import MedicalFilesApi from '../../../../lib/medical-files/medical-files.api'
import * as alertHookMock from '../../../../components/utils/snackbar'
import * as teamHookMock from '../../../../lib/team'
import ErrorApi from '../../../../lib/error/error.api'

jest.mock('../../../../lib/auth')
jest.mock('../../../../components/utils/snackbar')
jest.mock('../../../../lib/team')
describe('MedicalReportEditDialog hook', () => {
  const successMock = jest.fn()
  const errorMock = jest.fn()
  const onSaved = jest.fn()
  const teamName = 'fakeTeamName'
  const patientId = 'patientId'
  const teamId = 'teamId'
  const authorId = 'authorId'
  const medicalReport: MedicalReport = {
    id: 'medicalReportId',
    authorId,
    authorFirstName: 'Terry',
    authorLastName: 'Dicule',
    creationDate: '01-01-2023',
    patientId,
    teamId,
    diagnosis: 'Dude is almost dead...',
    progressionProposal: 'End the suffering :/',
    trainingSubject: 'Best ways to do it?',
    number: 65,
    teamName
  }

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getTeam: () => {
          return { name: teamName }
        }
      }
    })
  })

  describe('dialogTitle', () => {
    it('should be correct when user is a patient', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('consult-medical-report')
    })

    it('should be correct when user is a hcp that is not the author of the report', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeHcpId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('consult-medical-report')
    })

    it('should be correct when user is a hcp that is the author of the report', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('edit-medical-report')
    })

    it('should be correct when no medical report is given', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport: undefined,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('create-medical-report')
    })
  })

  describe('isInReadOnly', () => {
    it('should be true when user is a patient', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeTruthy()
    })

    it('should be false when user is a hcp that is not the author of the report', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeFalsy()
    })

    it('should be true when user is a hcp that is the author of the report', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => true,
          isUserHcp: () => false
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeTruthy()
    })

    it('should be false when no medical report is given', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport: undefined,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeFalsy()
    })
  })

  describe('saveMedicalReport', () => {
    beforeAll(() => {
      (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
        return { success: successMock, error: errorMock }
      })
    })

    it('should update successfully medical record', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const updateMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'updateMedicalReport').mockResolvedValue(medicalReport)
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      await act(async () => {
        await result.current.saveMedicalReport()
      })

      expect(updateMedicalReportSpy).toHaveBeenCalledWith(medicalReport)
      expect(successMock).toHaveBeenCalled()
      expect(onSaved).toHaveBeenCalled()
    })

    it('should show error when update failed', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const updateMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'updateMedicalReport').mockRejectedValue(Error('This error was thrown by a mock on purpose'))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        medicalReport,
        onSaved,
        teamId,
        patientId
      }))
      await act(async () => {
        await result.current.saveMedicalReport()
      })

      expect(updateMedicalReportSpy).toHaveBeenCalledWith(medicalReport)
      expect(errorMock).toHaveBeenCalled()
      expect(onSaved).not.toHaveBeenCalled()
    })

    it('should create successfully medical record', async () => {
      jest.spyOn(ErrorApi, 'sendError').mockResolvedValue()

      const firstName = 'Sandy'
      const lastName = 'Kilos';
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          profile: { firstName, lastName },
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const createMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'createMedicalReport').mockResolvedValue(medicalReport)
      const { result } = renderHook(() => useMedicalReportEditDialog({
        onSaved,
        teamId,
        patientId
      }))

      await act(async () => {
        result.current.setProgressionProposal(medicalReport.progressionProposal)
        result.current.setDiagnosis(medicalReport.diagnosis)
        result.current.setTrainingSubject(medicalReport.trainingSubject)
      })

      await act(async () => {
        await result.current.saveMedicalReport()
      })

      const medicalReportExpected: NewMedicalReport = {
        patientId,
        teamId,
        diagnosis: medicalReport.diagnosis,
        progressionProposal: medicalReport.progressionProposal,
        trainingSubject: medicalReport.trainingSubject,
        authorFirstName: firstName,
        authorLastName: lastName,
        teamName: medicalReport.teamName
      }

      expect(createMedicalReportSpy).toHaveBeenCalledWith(medicalReportExpected)
      expect(successMock).toHaveBeenCalled()
      expect(onSaved).toHaveBeenCalled()
    })

    it('should show error when create failed', async () => {
      const firstName = 'Sandy'
      const lastName = 'Kilos';
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          profile: { firstName, lastName },
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const createMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'createMedicalReport').mockRejectedValue(Error('This error was thrown by a mock on purpose'))
      const { result } = renderHook(() => useMedicalReportEditDialog({
        onSaved,
        teamId,
        patientId
      }))

      await act(async () => {
        result.current.setProgressionProposal(medicalReport.progressionProposal)
        result.current.setDiagnosis(medicalReport.diagnosis)
        result.current.setTrainingSubject(medicalReport.trainingSubject)
      })

      await act(async () => {
        await result.current.saveMedicalReport()
      })

      const medicalReportExpected: NewMedicalReport = {
        patientId,
        teamId,
        diagnosis: medicalReport.diagnosis,
        progressionProposal: medicalReport.progressionProposal,
        trainingSubject: medicalReport.trainingSubject,
        authorFirstName: firstName,
        authorLastName: lastName,
        teamName: medicalReport.teamName
      }

      expect(createMedicalReportSpy).toHaveBeenCalledWith(medicalReportExpected)
      expect(errorMock).toHaveBeenCalled()
      expect(onSaved).not.toHaveBeenCalled()
    })
  })
})
