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

import React from 'react'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files.api'
import * as alertHookMock from '../../../../../components/utils/snackbar'
import MedicalRecordEditDialog, {
  type MedicalRecordEditDialogProps
} from '../../../../../components/dialogs/medical-record-edit-dialog'
import userEvent from '@testing-library/user-event'
import * as authHookMock from '../../../../../lib/auth'
import type User from '../../../../../lib/auth/models/user.model'
import { type MedicalRecord } from '../../../../../lib/medical-files/models/medical-record.model'
import { UserRoles } from '../../../../../lib/auth/models/enums/user-roles.enum'

jest.mock('../../../../../lib/auth')
jest.mock('../../../../../components/utils/snackbar')
describe('Medical record edit dialog', () => {
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

  function getDialogJSX(): JSX.Element {
    const props: MedicalRecordEditDialogProps = {
      onClose,
      onSaved,
      medicalRecord,
      teamId: 'teamId',
      patientId: 'patientId'
    }
    return <MedicalRecordEditDialog {...props} />
  }

  function mountComponent() {
    render(getDialogJSX())
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
      return { user: { role: UserRoles.hcp, isUserPatient: () => false, isUserHcp: () => true } as User }
    })
  })

  it('should display an error if save failed', async () => {
    createMedicalRecordSpy.mockImplementationOnce(() => Promise.reject(Error('This error was thrown by a mock on purpose')))
    mountComponent()

    await userEvent.type(diagnosisTextArea, 'fake diagnosis')
    await userEvent.type(progressionProposalTextArea, 'fake progression proposal')
    await userEvent.type(trainingSubjectTextArea, 'fake training subject')
    fireEvent.click(saveButton)
    await waitFor(() => {
      expect(createMedicalRecordSpy).toHaveBeenCalled()
    })
    expect(errorAlertMock).toHaveBeenCalledWith('medical-record-save-failed')
  })
})
