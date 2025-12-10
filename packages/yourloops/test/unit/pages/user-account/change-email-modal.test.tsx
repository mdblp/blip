/*
 * Copyright (c) 2025, Diabeloop
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
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { ChangeEmailModal } from '../../../../pages/user-account/modals/change-email-modal'
import { AuthApi } from '../../../../lib/auth/auth.api'

// Mocks
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}))

jest.mock('../../../../lib/auth', () => ({
  useAuth: () => ({
    user: { id: 'user-id', email: 'current@email.com' }
  })
}))

jest.mock('../../../../components/utils/snackbar', () => ({
  useAlert: () => ({
    success: jest.fn()
  })
}))

jest.mock('../../../../pages/user-account/css-classes', () => ({
  userAccountFormCommonClasses: () => ({
    classes: { formInput: 'mock-form-input' }
  })
}))

describe('ChangeEmailModal', () => {
  const setShowUpdateEmailDialog = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  function getComponent(open = true) {
    return (
      <ChangeEmailModal
        showChangeEmailModal={open}
        setChangeEmailModal={setShowUpdateEmailDialog}
      />
    )
  }

  it('should render dialog with correct fields when open', () => {
    render(getComponent())
    expect(screen.getByTestId('confirm-email-change-dialog')).toBeInTheDocument()
    expect(screen.getByLabelText('email')).toHaveValue('current@email.com')
    expect(screen.getByLabelText('new-email')).toHaveValue('')
    expect(screen.getByRole('button', { name: 'button-cancel' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'button-confirm' })).toBeInTheDocument()
  })

  it('should close dialog when cancel button is clicked', async () => {
    render(getComponent())
    await act(async () => fireEvent.mouseDown(screen.getByRole('button', { name: 'button-cancel' })))
    expect(setShowUpdateEmailDialog).toHaveBeenCalledWith(false)
  })

  it('should call AuthApi.sendChangeEmailRequest when confirming first step', async () => {
    const sendChangeEmailRequest = jest
      .spyOn(AuthApi, 'sendChangeEmailRequest')
      .mockResolvedValue(undefined)

    render(getComponent())
    const newEmailField = screen.getByLabelText('new-email')
    fireEvent.change(newEmailField, { target: { value: 'new@email.com' } })
    await act(async () => fireEvent.mouseDown(screen.getByRole('button', { name: 'button-confirm' })))

    await waitFor(() =>
      expect(sendChangeEmailRequest).toHaveBeenCalledWith('user-id', 'new@email.com')
    )
  })

  it('should show error state if sendChangeEmailRequest fails', async () => {
    jest.spyOn(AuthApi, 'sendChangeEmailRequest').mockRejectedValue(new Error('Network error'))

    render(getComponent())
    const newEmailField = screen.getByLabelText('new-email')
    fireEvent.change(newEmailField, { target: { value: 'bad@email.com' } })
    await act(async () => fireEvent.mouseDown(screen.getByRole('button', { name: 'button-confirm' })))

    await waitFor(() => {
      expect(screen.getByLabelText('new-email')).toHaveAttribute('aria-invalid', 'true')
      expect(screen.getByText('error-occurred')).toBeInTheDocument()
    })
  })

  it('should validate change email request when emailSentSuccess is true', async () => {
    jest.spyOn(AuthApi, 'sendChangeEmailRequest').mockResolvedValue(undefined)
    const validateChangeEmailRequest = jest
      .spyOn(AuthApi, 'validateChangeEmailRequest')
      .mockResolvedValue(undefined)

    render(getComponent())

    // Step 1: sendChangeEmailRequest
    fireEvent.change(screen.getByLabelText('new-email'), {
      target: { value: 'new@email.com' }
    })
    await act(async () => fireEvent.mouseDown(screen.getByRole('button', { name: 'button-confirm' })))
    await waitFor(() => expect(AuthApi.sendChangeEmailRequest).toHaveBeenCalled())

    // Simulate code input visible (force re-render to simulate success)
    fireEvent.change(screen.getByLabelText('code'), { target: { value: '123456' } })
    await act(async () => fireEvent.mouseDown(screen.getByRole('button', { name: 'button-confirm' })))

    await waitFor(() => expect(validateChangeEmailRequest).toHaveBeenCalledWith('123456'))
  })

  it('should close dialog when backdrop or close triggered', () => {
    render(getComponent())
    const dialog = screen.getByTestId('confirm-email-change-dialog')
    fireEvent.keyDown(dialog, { key: 'Escape' })
    expect(setShowUpdateEmailDialog).toHaveBeenCalledWith(false)
  })

  it('should disable confirm button when no new email entered', () => {
    render(getComponent())
    const confirmButton = screen.getByRole('button', { name: 'button-confirm' })
    expect(confirmButton).toBeDisabled()
  })
})
