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

import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthApi } from '../../../lib/auth/auth.api'
import { Unit } from 'medical-domain'

export const checkCaregiverUserAccountLayout = () => {
  expect(screen.getByText('User account')).toBeVisible()

  expect(screen.getByText('Personal information')).toBeVisible()
  expect(screen.getByLabelText('First name')).toHaveValue('Phil')
  expect(screen.getByLabelText('Last name')).toHaveValue('Defer')
  expect(screen.queryByLabelText('Country')).not.toBeInTheDocument()

  expect(screen.getByText('Preferences')).toBeVisible()
  expect(screen.getByLabelText('Units')).toHaveTextContent('mmol/L')
  expect(screen.getByLabelText('Language')).toHaveTextContent('Français')

  expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()

  expect(screen.getByText('Security')).toBeVisible()
  const emailInput = screen.getByLabelText('Email')
  expect(emailInput).toHaveValue('yann.blanc@example.com')
  expect(emailInput).toBeDisabled()
  expect(screen.getByText('By clicking this button, you will receive an e-mail allowing you to change your password.')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Change password' })).toBeEnabled()

  expect(screen.getByText('Professional account')).toBeVisible()
  expect(screen.getByText('Caregivers can upgrade their account to a professional account. The professional account is reserved for healthcare professionals as a tool to facilitate patient care.')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Switch to professional account' })).toBeEnabled()
}

export const checkHcpUserAccountLayout = () => {
  expect(screen.getByText('User account')).toBeVisible()

  expect(screen.getByText('Personal information')).toBeVisible()
  expect(screen.getByLabelText('First name')).toHaveValue('Djamal')
  expect(screen.getByLabelText('Last name')).toHaveValue('Alatete')
  expect(screen.getByLabelText('Profession')).toHaveTextContent('Diabetologist')
  expect(screen.getByLabelText('Country')).toHaveTextContent('France')

  expect(screen.getByText('Preferences')).toBeVisible()
  expect(screen.getByLabelText('Units')).toHaveTextContent('mmol/L')
  expect(screen.getByLabelText('Language')).toHaveTextContent('Français')
  expect(screen.getByTestId('profile-label-feedback')).toHaveTextContent('I agree to receive information and news from Diabeloop. (optional)')

  expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()

  expect(screen.getByText('Security')).toBeVisible()
  const emailInput = screen.getByLabelText('Email')
  expect(emailInput).toHaveValue('yann.blanc@example.com')
  expect(emailInput).toBeDisabled()
  expect(screen.getByText('By clicking this button, you will receive an e-mail allowing you to change your password.')).toBeVisible()
  expect(screen.getByRole('button', { name: 'Change password' })).toBeEnabled()
}

export const checkPatientUserAccountLayout = () => {
  expect(screen.getByText('User account')).toBeVisible()

  expect(screen.getByText('Personal information')).toBeVisible()
  expect(screen.getByLabelText('First name')).toHaveValue('Elie')
  expect(screen.getByLabelText('Last name')).toHaveValue('Coptere')
  const emailInput = screen.getByLabelText('Email')
  expect(emailInput).toHaveValue('yann.blanc@example.com')
  expect(emailInput).toBeDisabled()
  expect(screen.getByLabelText('Gender')).toHaveTextContent('Male')
  expect(screen.queryByTestId('country-selector')).not.toBeInTheDocument()

  expect(screen.getByText('Preferences')).toBeVisible()
  expect(screen.getByLabelText('Units')).toHaveTextContent('mg/dL')
  expect(within(screen.getByTestId('user-account-units-selector')).getByRole('combobox')).toHaveAttribute('aria-disabled', 'true')
  expect(screen.getByLabelText('Language')).toHaveTextContent('Français')

  expect(screen.getByRole('button', { name: 'Cancel' })).toBeEnabled()
  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
}

export const checkCaregiverInfoUpdate = async () => {
  fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'English' }))

  fireEvent.mouseDown(within(screen.getByTestId('user-account-units-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: Unit.MilligramPerDeciliter }))

  const firstNameInput = screen.getByLabelText('First name')
  const lastNameInput = screen.getByLabelText('Last name')
  const saveButton = screen.getByRole('button', { name: 'Save' })

  await userEvent.clear(firstNameInput)
  expect(saveButton).toBeDisabled()
  await userEvent.clear(lastNameInput)
  expect(saveButton).toBeDisabled()
  await userEvent.type(firstNameInput, 'Jean')
  expect(saveButton).toBeDisabled()
  await userEvent.type(lastNameInput, 'Talue')
  expect(saveButton).toBeEnabled()

  await userEvent.click(saveButton)

  expect(saveButton).toBeDisabled()

  const accountUpdateSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(accountUpdateSuccessfulSnackbar).toHaveTextContent('User account updated')

  const accountUpdateSuccessfulSnackbarCloseButton = within(accountUpdateSuccessfulSnackbar).getByTitle('Close')
  await userEvent.click(accountUpdateSuccessfulSnackbarCloseButton)
}

export const checkHcpInfoUpdate = async () => {
  fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'English' }))

  fireEvent.mouseDown(within(screen.getByTestId('user-account-units-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: Unit.MilligramPerDeciliter }))

  fireEvent.mouseDown(within(screen.getByTestId('dropdown-profession-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'Nurse' }))

  fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'Japan' }))

  fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'United Kingdom' }))

  fireEvent.mouseDown(within(screen.getByTestId('country-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'Austria' }))

  const firstNameInput = screen.getByLabelText('First name')
  const lastNameInput = screen.getByLabelText('Last name')
  const saveButton = screen.getByRole('button', { name: 'Save' })

  await userEvent.clear(firstNameInput)
  await userEvent.clear(lastNameInput)
  await userEvent.type(firstNameInput, 'Jean')
  await userEvent.type(lastNameInput, 'Talue')

  expect(saveButton).toBeEnabled()
  await userEvent.click(saveButton)

  expect(saveButton).toBeDisabled()

  const accountUpdateSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(accountUpdateSuccessfulSnackbar).toHaveTextContent('User account updated')

  const accountUpdateSuccessfulSnackbarCloseButton = within(accountUpdateSuccessfulSnackbar).getByTitle('Close')

  await userEvent.click(accountUpdateSuccessfulSnackbarCloseButton)
}

export const checkPatientInfoUpdate = async () => {
  fireEvent.mouseDown(within(screen.getByTestId('profile-local-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'English' }))

  const firstNameInput = screen.getByLabelText('First name')
  const lastNameInput = screen.getByLabelText('Last name')
  const saveButton = screen.getByRole('button', { name: 'Save' })

  await userEvent.clear(firstNameInput)
  await userEvent.clear(lastNameInput)
  await userEvent.type(firstNameInput, 'Jean')
  await userEvent.type(lastNameInput, 'Tanrien')

  expect(saveButton).toBeEnabled()
  await userEvent.click(saveButton)

  expect(saveButton).toBeDisabled()

  const accountUpdateSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(accountUpdateSuccessfulSnackbar).toHaveTextContent('User account updated')

  const accountUpdateSuccessfulSnackbarCloseButton = within(accountUpdateSuccessfulSnackbar).getByTitle('Close')

  await userEvent.click(accountUpdateSuccessfulSnackbarCloseButton)
}

export const checkPasswordChangeRequest = async (email: string): Promise<void> => {
  const changePasswordCategoryTitle = screen.getByText('Security')
  expect(changePasswordCategoryTitle).toBeVisible()

  const changePasswordInfoLabel = screen.getByText('By clicking this button, you will receive an e-mail allowing you to change your password.')
  expect(changePasswordInfoLabel).toBeVisible()

  const changePasswordButton = screen.getByRole('button', { name: 'Change password' })
  expect(changePasswordButton).toBeEnabled()

  await userEvent.click(changePasswordButton)

  expect(AuthApi.sendResetPasswordEmail).toHaveBeenCalledWith(email)

  const changePasswordEmailSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(changePasswordEmailSuccessfulSnackbar).toHaveTextContent('E-mail sent successfully')

  const changePasswordEmailSuccessfulSnackbarCloseButton = within(changePasswordEmailSuccessfulSnackbar).getByTitle('Close')

  await userEvent.click(changePasswordEmailSuccessfulSnackbarCloseButton)

  jest.spyOn(AuthApi, 'sendResetPasswordEmail').mockRejectedValueOnce('Error')
  await userEvent.click(changePasswordButton)

  const changePasswordEmailFailedSnackbar = screen.getByTestId('alert-snackbar')
  expect(changePasswordEmailFailedSnackbar).toHaveTextContent('Impossible to send the change password e-mail. Please try again later.')
}
