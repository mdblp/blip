/*
 * Copyright (c) 2025-2026, Diabeloop
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

export const checkConsequencesDialog = async () => {
  const changeRoleButton = screen.getByTestId('switch-role-button')
  await userEvent.click(changeRoleButton)

  const consequencesDialog = screen.getByRole('dialog')
  expect(consequencesDialog).toBeVisible()
  expect(within(consequencesDialog).getByText('Switch to professional account')).toBeVisible()
  expect(within(consequencesDialog).getByText('You are about to convert your caregiver account to a professional account.')).toBeVisible()
  expect(within(consequencesDialog).getByText('This action can’t be undone.')).toBeVisible()
  expect(within(consequencesDialog).getByText('As a healthcare professional on YourLoops you can:')).toBeVisible()
  expect(within(consequencesDialog).getByText('Patients you followed as a caregiver will be added to your Professional Private Care.')).toBeVisible()
  expect(within(consequencesDialog).getByText('Do you want to convert your caregiver account to a professional account?')).toBeVisible()
  expect(within(consequencesDialog).getByText('Create, manage and join care teams')).toBeVisible()
  expect(within(consequencesDialog).getByText('Invite your patients to share their data')).toBeVisible()
  expect(within(consequencesDialog).getByText('Invite other healthcare professionals')).toBeVisible()
  expect(within(consequencesDialog).getByRole('button', { name: 'Cancel' })).toBeVisible()
  const switchButton = within(consequencesDialog).getByRole('button', { name: 'Switch to Professional account' })
  await userEvent.click(switchButton)
}

export const checkPrivacyAndTermsDialog = async () => {
  const consentDialog = screen.getByRole('dialog')

  expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-privacy-policy')).toHaveTextContent('I have read and accepted YourLoops Privacy Policy. Hereby, I consent to the processing of my personal data by Diabeloop so I can benefit from YourLoops services.')
  expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-terms')).toHaveTextContent('I have read and accepted YourLoops Terms of use. I confirm that I am an authorized healthcare practitioner according to local laws and regulation. I undertake to use YourLoops solely in accordance with these Terms of Use and what is allowed by the law.')
  expect(within(consentDialog).getByTestId('switch-role-consent-dialog-label-feedback')).toHaveTextContent('I agree to receive information and news from Diabeloop. (optional)')

  const privacyCheckbox = within(consentDialog).getByLabelText('Privacy policy checkbox')
  const termsCheckbox = within(consentDialog).getByLabelText('Terms checkbox')
  const feedbackCheckbox = within(consentDialog).getByLabelText('Feedback checkbox')
  const acceptButton = within(consentDialog).getByRole('button', { name: 'Accept' })

  expect(privacyCheckbox).toBeVisible()
  expect(termsCheckbox).toBeVisible()
  expect(feedbackCheckbox).toBeVisible()
  expect(acceptButton).toBeDisabled()

  await userEvent.click(privacyCheckbox)
  await userEvent.click(termsCheckbox)

  expect(acceptButton).toBeEnabled()
  await userEvent.click(feedbackCheckbox)
  await userEvent.click(acceptButton)
}

export const checkHcpProfessionDialogAndSave = async () => {
  const professionDialog = screen.getByRole('dialog')
  const hcpProfessionSelect = within(professionDialog).getByTestId('dropdown-profession-selector')
  const validateButton = within(professionDialog).getByRole('button', { name: 'Validate' })

  expect(hcpProfessionSelect).toBeVisible()
  expect(validateButton).toBeDisabled()
  expect(hcpProfessionSelect.textContent).toEqual('​Profession')

  fireEvent.mouseDown(within(screen.getByTestId('dropdown-profession-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'Dietitian' }))
  expect(hcpProfessionSelect).toHaveTextContent('Dietitian')

  await userEvent.click(validateButton)
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Your account has been successfully switched to HCP')
}

export const checkConsequencesDialogClosing = async () => {
  const changeRoleButton = screen.getByTestId('switch-role-button')
  await userEvent.click(changeRoleButton)

  const consequencesDialog = screen.getByRole('dialog')
  await userEvent.click(within(consequencesDialog).getByRole('button', { name: 'Cancel' }))
  expect(consequencesDialog).not.toBeVisible()
}

export const checkPrivacyAndTermsDialogClosing = async () => {
  const changeRoleButton = screen.getByTestId('switch-role-button')

  await userEvent.click(changeRoleButton)
  await userEvent.click(screen.getByRole('button', { name: 'Switch to Professional account' }))

  const consentDialog = screen.getByRole('dialog')
  await userEvent.click(within(consentDialog).getByRole('button', { name: 'Decline' }))
  expect(consentDialog).not.toBeVisible()
}

export const checkHcpProfessionDialogClosing = async () => {
  const changeRoleButton = screen.getByTestId('switch-role-button')

  await userEvent.click(changeRoleButton)
  await userEvent.click(screen.getByRole('button', { name: 'Switch to Professional account' }))

  await userEvent.click(screen.getByLabelText('Privacy policy checkbox'))
  await userEvent.click(screen.getByLabelText('Terms checkbox'))
  await userEvent.click(screen.getByRole('button', { name: 'Accept' }))

  const professionDialog = screen.getByRole('dialog')
  await userEvent.click(within(professionDialog).getByRole('button', { name: 'Decline' }))
  expect(professionDialog).not.toBeVisible()
}
