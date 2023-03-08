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
import { render, screen, waitFor, within } from '@testing-library/react'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files.api'
import * as alertHookMock from '../../../../../components/utils/snackbar'
import MedicalReportEditDialog, {
  type MedicalReportEditDialogProps
} from '../../../../../components/dialogs/medical-report-edit-dialog'
import userEvent from '@testing-library/user-event'
import * as authHookMock from '../../../../../lib/auth'
import type User from '../../../../../lib/auth/models/user.model'
import { type MedicalReport } from '../../../../../lib/medical-files/models/medical-report.model'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'

jest.mock('../../../../../lib/auth')
jest.mock('../../../../../components/utils/snackbar')
describe('Medical report edit dialog', () => {
  const createMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'createMedicalReport').mockResolvedValue({} as MedicalReport)
  const onClose = jest.fn()
  const onSaved = jest.fn()
  const successAlertMock = jest.fn()
  const errorAlertMock = jest.fn()
  let medicalReport: MedicalReport
  let diagnosisTextArea: HTMLTextAreaElement
  let progressionProposalTextArea: HTMLTextAreaElement
  let trainingSubjectTextArea: HTMLTextAreaElement
  let saveButton: HTMLButtonElement

  function getDialogJSX(): JSX.Element {
    const props: MedicalReportEditDialogProps = {
      onClose,
      onSaved,
      medicalReport,
      teamId: 'teamId',
      patientId: 'patientId'
    }
    return <MedicalReportEditDialog {...props} />
  }

  function mountComponent() {
    render(getDialogJSX())
    diagnosisTextArea = within(screen.getByTestId('diagnosis')).getByRole('textbox')
    progressionProposalTextArea = within(screen.getByTestId('progression-proposal')).getByRole('textbox')
    trainingSubjectTextArea = within(screen.getByTestId('training-subject')).getByRole('textbox')
    saveButton = screen.queryByRole('button', { name: 'button-save' })
  }

  beforeAll(() => {
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successAlertMock, error: errorAlertMock }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { role: UserRole.Hcp, isUserPatient: () => false, isUserHcp: () => true } as User }
    })
  })

  it('should display an error if save failed', async () => {
    createMedicalReportSpy.mockImplementationOnce(() => Promise.reject(Error('This error was thrown by a mock on purpose')))
    mountComponent()

    await userEvent.type(diagnosisTextArea, 'fake diagnosis')
    await userEvent.type(progressionProposalTextArea, 'fake progression proposal')
    await userEvent.type(trainingSubjectTextArea, 'fake training subject')
    await userEvent.click(saveButton)
    await waitFor(() => {
      expect(createMedicalReportSpy).toHaveBeenCalled()
    })
    expect(errorAlertMock).toHaveBeenCalledWith('medical-report-save-failed')
  })
})
