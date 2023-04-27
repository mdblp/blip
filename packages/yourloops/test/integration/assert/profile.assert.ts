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

import { act, screen, within } from '@testing-library/react'
import { CountryCodes } from '../../../lib/auth/models/country.model'
import userEvent from '@testing-library/user-event'
import { AuthApi } from '../../../lib/auth/auth.api'

interface CommonFieldsHtmlElements {
  firstNameInput: HTMLElement
  lastNameInput: HTMLElement
  unitsSelect: HTMLElement
  languageSelect: HTMLElement
}

interface PatientFieldsHtmlElements extends CommonFieldsHtmlElements {
  birthdayInput: HTMLElement
  birthPlaceInput: HTMLElement
  genderSelect: HTMLElement
  referringDoctorInput: HTMLElement
  insInput?: HTMLElement
  ssnInput?: HTMLElement
  hba1cInput?: HTMLElement
}

interface HcpFieldsHtmlElements extends CommonFieldsHtmlElements {
  hcpProfessionSelect: HTMLElement
}

const checkCommonFields = (): CommonFieldsHtmlElements => {
  const firstNameInput = screen.getByLabelText('First name')
  const lastNameInput = screen.getByLabelText('Last name')
  const unitsSelect = screen.getByTestId('profile-units-selector')
  const languageSelect = screen.getByTestId('profile-local-selector')

  expect(firstNameInput).toBeVisible()
  expect(lastNameInput).toBeVisible()
  expect(unitsSelect).toBeVisible()
  expect(lastNameInput).toBeVisible()

  return {
    firstNameInput,
    lastNameInput,
    unitsSelect,
    languageSelect
  }
}

export const checkHcpProfilePage = (): HcpFieldsHtmlElements => {
  const hcpProfessionSelect = screen.getByTestId('dropdown-profession-selector')
  expect(hcpProfessionSelect).toBeVisible()
  return {
    ...checkCommonFields(),
    hcpProfessionSelect
  }
}

export const checkCaregiverProfilePage = (): CommonFieldsHtmlElements => {
  return checkCommonFields()
}

export const checkPatientProfilePage = (country: CountryCodes): PatientFieldsHtmlElements => {
  const birthdayInput = screen.getByLabelText('Date of birth')
  const birthPlaceInput = screen.getByLabelText('Birth place')
  const genderSelect = screen.getByLabelText('Gender')
  const referringDoctorInput = screen.getByLabelText('Referring doctor')
  const insInput = screen.queryByLabelText('INS')
  const ssnInput = screen.queryByLabelText('SSN')
  const hba1cInput = screen.getByLabelText('Initial HbA1c 01/01/2020')
  const inputs = {
    ...checkCommonFields(),
    birthdayInput,
    birthPlaceInput,
    genderSelect,
    hba1cInput,
    referringDoctorInput
  }

  expect(within(inputs.unitsSelect).getByRole('button')).toHaveAttribute('aria-disabled', 'true')
  expect(birthdayInput).toBeVisible()
  expect(birthPlaceInput).toBeVisible()
  expect(genderSelect).toBeVisible()
  expect(referringDoctorInput).toBeVisible()

  if (country === CountryCodes.France) {
    expect(insInput).toBeVisible()
    expect(ssnInput).toBeVisible()

    return {
      ...inputs,
      insInput,
      ssnInput
    }
  }
  expect(insInput).not.toBeInTheDocument()
  expect(ssnInput).not.toBeInTheDocument()

  return inputs
}

export const checkPasswordChangeRequest = async (email: string): Promise<void> => {
  const changePasswordCategoryTitle = screen.getByText('Security')
  expect(changePasswordCategoryTitle).toBeVisible()

  const changePasswordInfoLabel = screen.getByText('By clicking this button, you will receive an e-mail allowing you to change your password.')
  expect(changePasswordInfoLabel).toBeVisible()

  const changePasswordButton = screen.getByRole('button', { name: 'Change password' })
  expect(changePasswordButton).toBeEnabled()

  await act(async () => {
    await userEvent.click(changePasswordButton)
  })

  expect(AuthApi.sendResetPasswordEmail).toHaveBeenCalledWith(email)

  const changePasswordEmailSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(changePasswordEmailSuccessfulSnackbar).toHaveTextContent('E-mail sent successfully')

  const changePasswordEmailSuccessfulSnackbarCloseButton = within(changePasswordEmailSuccessfulSnackbar).getByTitle('Close')

  await userEvent.click(changePasswordEmailSuccessfulSnackbarCloseButton)

  jest.spyOn(AuthApi, 'sendResetPasswordEmail').mockRejectedValueOnce('Error')
  await act(async () => {
    await userEvent.click(changePasswordButton)
  })

  const changePasswordEmailFailedSnackbar = screen.getByTestId('alert-snackbar')
  expect(changePasswordEmailFailedSnackbar).toHaveTextContent('Impossible to send the change password e-mail. Please try again later.')
}
