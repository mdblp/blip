/*
 * Copyright (c) 2022-2026, Diabeloop
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
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import MedicalReportDeleteDialog, {
  type MedicalReportDeleteDialogProps
} from '../../../../../components/dialogs/medical-report-delete-dialog'
import MedicalFilesApi from '../../../../../lib/medical-files/medical-files.api'
import * as alertHookMock from '../../../../../components/utils/snackbar'
import { type MedicalReport } from '../../../../../lib/medical-files/models/medical-report.model'

jest.mock('../../../../../components/utils/snackbar')
describe('Medical report delete dialog', () => {
  const onClose = jest.fn()
  const onDelete = jest.fn()
  const successMock = jest.fn()
  const errorMock = jest.fn()

  function getDialogJSX(props: MedicalReportDeleteDialogProps = {
    onClose,
    onDelete,
    medicalReport: { id: 'fakeId' } as MedicalReport,
    teamName: 'fakeTeamName'
  }): JSX.Element {
    return <MedicalReportDeleteDialog {...props} />
  }

  beforeAll(() => {
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successMock, error: errorMock }
    })
  })

  it('should display error message if delete failed', async () => {
    const deleteMedicalReportSpy = jest.spyOn(MedicalFilesApi, 'deleteMedicalReport')
      .mockImplementationOnce(() => Promise.reject(Error('delete-failed')))
    render(getDialogJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-delete' }))
    await waitFor(() => { expect(deleteMedicalReportSpy).toHaveBeenCalled() })
    expect(errorMock).toHaveBeenCalledWith('medical-report-delete-failed')
  })

  it('should close dialog when clicking cancel button', () => {
    render(getDialogJSX())
    fireEvent.click(screen.getByRole('button', { name: 'button-cancel' }))
    expect(onClose).toHaveBeenCalled()
  })
})
