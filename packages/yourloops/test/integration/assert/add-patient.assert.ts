/*
 * Copyright (c) 2023-2024, Diabeloop
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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PatientApi from '../../../lib/patient/patient.api'
import { patient1Info, pendingPatient } from '../data/patient.api.data'
import { myThirdTeamId } from '../mock/team.api.mock'

export const checkAddPatientPrivateButtonTooltip = async () => {
  const patientListHeader = await screen.findByTestId('patient-list-header')
  const addPatientButton = within(patientListHeader).getByText('Add new patient')
  expect(addPatientButton).toBeVisible()
  expect(addPatientButton).toBeDisabled()

  const addPatientHoverZone = within(patientListHeader).getByTestId('add-patient-button')
  await userEvent.hover(addPatientHoverZone)
  const informationTooltip = await screen.findByText('To invite a patient, you must first select a care team from the dropdown menu. You can create you own care team if you need to. Alternatively, you can provide the patient with your YourLoops email address so they can enable private data sharing with you.')
  expect(informationTooltip).toBeVisible()

  await userEvent.unhover(addPatientHoverZone)
  expect(informationTooltip).not.toBeVisible()
}

export const checkAddPatientMedicalTeamDialogContent = async () => {
  const patientListHeader = screen.getByTestId('patient-list-header')
  const addPatientButton = within(patientListHeader).getByText('Add new patient')
  expect(addPatientButton).toBeVisible()

  await userEvent.click(addPatientButton)

  const addPatientDialog = screen.getByRole('dialog')
  expect(addPatientDialog).toBeVisible()
  expect(addPatientDialog).toHaveTextContent('Invite a patient to A - MyThirdTeam - to be deletedTo invite a patient to share their data with another care team, you must first select the care team in the dropdown menu at the top right of YourLoops.')
  expect(addPatientDialog).toHaveTextContent('Email *Email *By inviting this patient to share their data with me and their care team, I declare under my professional responsibility that I am part of this patient’s care team and, as such, have the right to access the patient’s personal data according to the applicable regulations.')
  expect(addPatientDialog).toHaveTextContent('Read our Terms of use and Privacy Policy.CancelInvite')

  const termsOfUseLink = within(addPatientDialog).getByRole('link', { name: 'Terms of use' })
  expect(termsOfUseLink).toBeVisible()

  const privacyPolicyLink = within(addPatientDialog).getByRole('link', { name: 'Privacy Policy' })
  expect(privacyPolicyLink).toBeVisible()

  const cancelButton = within(addPatientDialog).getByText('Cancel')
  expect(cancelButton).toBeVisible()

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkAddPatientMedicalTeamDialogInvite = async () => {
  jest.spyOn(PatientApi, 'invitePatient').mockResolvedValue(null)
  const patientListHeader = screen.getByTestId('patient-list-header')
  const addPatientButton = within(patientListHeader).getByText('Add new patient')
  expect(addPatientButton).toBeVisible()

  await userEvent.click(addPatientButton)

  const addPatientDialog = screen.getByRole('dialog')

  const invitePatientButton = within(addPatientDialog).getByRole('button', { name: 'Invite' })
  expect(invitePatientButton).toBeVisible()
  expect(invitePatientButton).toBeDisabled()

  const emailInput = within(addPatientDialog).getByRole('textbox', { name: 'Email' })
  expect(emailInput).toBeVisible()
  await userEvent.type(emailInput, patient1Info.profile.email)

  const alreadyInTeamErrorMessage = within(addPatientDialog).getByText('This patient is already sharing data with the team.')
  expect(alreadyInTeamErrorMessage).toBeVisible()
  expect(invitePatientButton).toBeDisabled()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, pendingPatient.profile.email)

  const pendingErrorMessage = within(addPatientDialog).getByText('This patient has already been invited and hasn\'t confirmed yet.')
  expect(pendingErrorMessage).toBeVisible()
  expect(invitePatientButton).toBeDisabled()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, 'invalid@emai.l')

  const invalidEmailErrorMessage = within(addPatientDialog).getByText('Invalid email address (special characters are not allowed).')
  expect(invalidEmailErrorMessage).toBeVisible()
  expect(invitePatientButton).toBeDisabled()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, 'new-patient@email.com')
  expect(invitePatientButton).toBeEnabled()

  await userEvent.click(invitePatientButton)

  expect(PatientApi.invitePatient).toHaveBeenCalledWith({ teamId: myThirdTeamId, email: 'new-patient@email.com' })
  const identificationCodeDialog = screen.getByRole('dialog')
  expect(identificationCodeDialog).toHaveTextContent('A - MyThirdTeam - to be deletedCommunicate this identification code to your patient during a consultation so they can verify your identity.')
  expect(identificationCodeDialog).toHaveTextContent('This identification code is always available in the Care team settings page.263 - 381 - 988Ok')

  const okButton = within(identificationCodeDialog).getByRole('button', { name: 'Ok' })

  await userEvent.click(okButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}
