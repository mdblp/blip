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

import { renderHook } from '@testing-library/react-hooks'
import * as authHookMock from '../../../../lib/auth'
import useMedicalRecordEditDialog from '../../../../components/dialogs/medical-record-edit-dialog.hook'
import { type MedicalRecord } from '../../../../lib/medical-files/models/medical-record.model'

jest.mock('../../../../lib/auth')
describe('MedicalRecordEditDialog hook', () => {
  const onSaved = jest.fn()
  const patientId = 'patientId'
  const teamId = 'teamId'
  const authorId = 'authorId'
  const medicalRecord: MedicalRecord = {
    id: 'medicalRecordId',
    authorId,
    creationDate: '01-01-2023',
    patientId,
    teamId,
    diagnosis: 'Dude is almost dead...',
    progressionProposal: 'End the suffering :/',
    trainingSubject: 'Best ways to do it?'
  }

  describe('dialogTitle', () => {
    it('should be correct when user is a patient', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeUserId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('consult-medical-record')
    })

    it('should be correct when user is a hcp that is not the author of the record', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: 'fakeHcpId',
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('consult-medical-record')
    })

    it('should be correct when user is a hcp that is the author of the record', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('edit-medical-record')
    })

    it('should be correct when no medical record is given', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord: undefined,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.dialogTitle).toBe('create-medical-record')
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
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeTruthy()
    })

    it('should be false when user is a hcp that is not the author of the record', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeFalsy()
    })

    it('should be true when user is a hcp that is the author of the record', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => true,
          isUserHcp: () => false
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeTruthy()
    })

    it('should be false when no medical record is given', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
        user: {
          id: authorId,
          isUserPatient: () => false,
          isUserHcp: () => true
        }
      }))
      const { result } = renderHook(() => useMedicalRecordEditDialog({
        medicalRecord: undefined,
        onSaved,
        teamId,
        patientId
      }))
      expect(result.current.isInReadOnly).toBeFalsy()
    })
  })
})
