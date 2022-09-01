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

import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MedicalRecord } from '../../../../../lib/medical-files/model'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files-api'
import * as alertHookMock from '../../../../../components/utils/snackbar'
import MedicalRecordEditDialog, {
  MedicalRecordEditDialogProps
} from '../../../../../components/dialogs/medical-record-edit-dialog'
import userEvent from '@testing-library/user-event'
import * as authHookMock from '../../../../../lib/auth'
import User from '../../../../../lib/auth/user'
import { UserRoles } from '../../../../../models/user'

jest.mock('../../../../../lib/auth')
jest.mock('../../../../../components/utils/snackbar')
describe('Medical record edit dialog', () => {
  const updateMedicalRecordSpy = jest.spyOn(MedicalFilesApi, 'updateMedicalRecord').mockResolvedValue({} as MedicalRecord)
  const createMedicalRecordSpy = jest.spyOn(MedicalFilesApi, 'createMedicalRecord').mockResolvedValue({} as MedicalRecord)
  const onClose = jest.fn()
  const onSaved = jest.fn()
  const successAlertMock = jest.fn()
  const errorAlertMock = jest.fn()
  let medicalRecord: MedicalRecord
  let diagnosisTextArea: HTMLTextAreaElement
  let progressionProposalTextArea: HTMLTextAreaElement
  let trainingSubjectTextArea: HTMLTextAreaElement
  let saveButton: HTMLButtonElement

  function getMedicalRecord(): MedicalRecord {
    return {
      id: 'fakeId',
      authorId: 'fakeAuthorId',
      creationDate: '2022-05-23',
      patientId: 'PatientId',
      teamId: 'teamId',
      diagnosis: 'diag1',
      progressionProposal: 'proposal1',
      trainingSubject: 'training1'
    }
  }

  function getDialogJSX(readonly: boolean): JSX.Element {
    const props: MedicalRecordEditDialogProps = {
      onClose,
      onSaved,
      readonly,
      medicalRecord,
      teamId: 'teamId',
      patientId: 'patientId'
    }
    return <MedicalRecordEditDialog {...props} />
  }

  function mountComponent(readonly = false) {
    render(getDialogJSX(readonly))
    diagnosisTextArea = within(screen.getByTestId('diagnosis')).getByRole('textbox')
    progressionProposalTextArea = within(screen.getByTestId('progression-proposal')).getByRole('textbox')
    trainingSubjectTextArea = within(screen.getByTestId('training-subject')).getByRole('textbox')
    saveButton = screen.queryByRole('button', { name: 'save' })
  }

  beforeAll(() => {
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successAlertMock, error: errorAlertMock }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { role: UserRoles.hcp, isUserPatient: () => false } as User }
    })
  })

  it('should create a new medical record', async () => {
    mountComponent()
    expect(diagnosisTextArea.value).toBe('')
    expect(progressionProposalTextArea.value).toBe('')
    expect(trainingSubjectTextArea.value).toBe('')

    fireEvent.click(saveButton)
    expect(updateMedicalRecordSpy).not.toHaveBeenCalled()
    expect(createMedicalRecordSpy).not.toHaveBeenCalled()

    await userEvent.type(diagnosisTextArea, 'abcd')
    userEvent.click(saveButton)
    await waitFor(() => expect(createMedicalRecordSpy).toHaveBeenCalled())
    expect(successAlertMock).toHaveBeenCalledWith('medical-record-save-success')
    expect(onSaved).toHaveBeenCalled()
  })

  it('should display an error if save failed', async () => {
    createMedicalRecordSpy.mockImplementationOnce(() => Promise.reject(Error('This error was thrown by a mock on purpose')))
    mountComponent()

    await userEvent.type(progressionProposalTextArea, 'abcd')
    await userEvent.type(trainingSubjectTextArea, 'efgh')
    fireEvent.click(saveButton)
    await waitFor(() => expect(createMedicalRecordSpy).toHaveBeenCalled())
    expect(errorAlertMock).toHaveBeenCalledWith('medical-record-save-failed')
  })

  it('should edit and save medical record', async () => {
    medicalRecord = getMedicalRecord()
    mountComponent()
    expect(diagnosisTextArea.value).toBe('diag1')
    expect(progressionProposalTextArea.value).toBe('proposal1')
    expect(trainingSubjectTextArea.value).toBe('training1')

    await userEvent.type(diagnosisTextArea, 'diag2')
    fireEvent.click(saveButton)
    await waitFor(() => expect(updateMedicalRecordSpy).toHaveBeenCalled())
    expect(successAlertMock).toHaveBeenCalledWith('medical-record-save-success')
    expect(onSaved).toHaveBeenCalled()
  })

  it('should not be editable when opening with readonly', async () => {
    medicalRecord = getMedicalRecord()
    mountComponent(true)
    await userEvent.type(diagnosisTextArea, 'new diag')
    await userEvent.type(progressionProposalTextArea, 'new proposal')
    await userEvent.type(trainingSubjectTextArea, 'new training')

    expect(diagnosisTextArea.value).toBe('diag1')
    expect(progressionProposalTextArea.value).toBe('proposal1')
    expect(trainingSubjectTextArea.value).toBe('training1')
    fireEvent.click(saveButton)
    expect(createMedicalRecordSpy).not.toHaveBeenCalled()
  })

  it('should not be able to save a medical record for a patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { role: UserRoles.patient, isUserPatient: () => true } as User }
    })
    mountComponent(true)
    expect(saveButton).not.toBeInTheDocument()
  })
})
