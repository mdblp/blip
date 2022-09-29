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

import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

export const checkStepper = () => {
  expect(screen.getByLabelText('signup-stepper')).toBeInTheDocument()
  expect(screen.getByLabelText('step-1-label')).toHaveTextContent('Select account type')
  expect(screen.getByLabelText('step-2-label')).toHaveTextContent('Consent')
  expect(screen.getByLabelText('step-3-label')).toHaveTextContent('Create profile')
}

export const checkAccountSelectorStep = () => {
  const caregiverRadioInput = screen.getByLabelText('caregiver-radio-input')
  const hcpRadioInput = screen.getByLabelText('hcp-radio-input')
  const patientRadioInput = screen.getByLabelText('patient-radio-input')

  expect(within(caregiverRadioInput).getByRole('radio')).toBeInTheDocument()
  expect(within(hcpRadioInput).getByRole('radio')).toBeInTheDocument()
  expect(within(patientRadioInput).getByRole('radio')).toBeInTheDocument()
  expect(within(patientRadioInput).getByRole('radio')).toHaveAttribute('disabled')
  expect(within(caregiverRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Caregiver and family')
  expect(within(caregiverRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('View patients diabetes data as an individual caregiver or family member.')
  expect(within(hcpRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Professional')
  expect(within(hcpRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('View all your patients diabetes data in one place. Join and create a care team for your clinic or practice.')
  expect(within(patientRadioInput).getByLabelText('radio-label-header')).toHaveTextContent('Patient')
  expect(within(patientRadioInput).getByLabelText('radio-label-body')).toHaveTextContent('If you use a DBL System, you have to create your account from your handset. You can’t create several accounts with the same email address.')
}

export const checkConsentStep = () => {
  const privacyCheckbox = within(screen.getByLabelText('privacy-policy-checkbox')).getByRole('checkbox')
  const termsCheckbox = within(screen.getByLabelText('terms-checkbox')).getByRole('checkbox')
  const nextButton = screen.getByRole('button', { name: 'Next' })

  expect(nextButton).toBeDisabled()
  expect(privacyCheckbox).toBeInTheDocument()
  expect(termsCheckbox).toBeInTheDocument()

  fireEvent.click(privacyCheckbox)
  fireEvent.click(termsCheckbox)

  expect(nextButton).not.toBeDisabled()
}

export const checkProfileStep = async (firstname: string, lastname: string) => {
  const firstnameInput = within(screen.getByLabelText('First Name')).getByRole('textbox')
  const lastnameInput = within(screen.getByLabelText('Last Name')).getByRole('textbox')
  const countrySelect = screen.getByTestId('country-selector')
  const createButton = screen.getByRole('button', { name: 'Create Account' })

  expect(firstnameInput).toBeInTheDocument()
  expect(lastnameInput).toBeInTheDocument()
  expect(countrySelect).toBeInTheDocument()
  expect(createButton).toBeDisabled()

  await userEvent.type(firstnameInput, firstname)
  await userEvent.type(lastnameInput, lastname)
  fireEvent.mouseDown(within(countrySelect).getByRole('button'))
  screen.getByRole('listbox')
  fireEvent.click(screen.getByRole('option', { name: 'France' }))
}
