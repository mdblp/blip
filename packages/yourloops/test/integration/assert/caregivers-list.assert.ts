/*
 * Copyright (c) 2023, Diabeloop
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

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockCaregiverEmail } from '../mock/direct-share.api.mock'

export const checkCaregiversListLayout = async () => {
  expect(await screen.findByTestId('patient-caregivers-list')).toBeVisible()

  const addCaregiverButton = await screen.findByTestId('add-caregiver-button')
  expect(addCaregiverButton).toBeVisible()
  expect(addCaregiverButton).toBeEnabled()
}

export const checkAddRemoveCaregiver = async () => {
  const addCaregiverButton = await screen.findByTestId('add-caregiver-button')
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByTestId('patient-add-caregiver-dialog')
  expect(addCaregiverDialog).toBeVisible()
  expect(within(addCaregiverDialog).getByText('Add a caregiver')).toBeVisible()
  const emailInput = within(addCaregiverDialog).getByRole('textbox', { name: 'Email' })
  expect(emailInput).toBeVisible()

  await userEvent.type(emailInput, 'new-caregiver@mail.com')
  const inviteButton = within(addCaregiverDialog).getByRole('button', { name: 'Invite' })
  expect(inviteButton).toBeEnabled()

  await userEvent.click(inviteButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkAddCaregiverErrorCases = async () => {
  const addCaregiverButton = await screen.findByTestId('add-caregiver-button')
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByTestId('patient-add-caregiver-dialog')
  expect(addCaregiverDialog).toBeVisible()

  const cancelButton = within(addCaregiverDialog).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeVisible()
  expect(cancelButton).toBeEnabled()

  const inviteButton = within(addCaregiverDialog).getByRole('button', { name: 'Invite' })
  expect(inviteButton).toBeVisible()
  expect(inviteButton).toBeDisabled()

  const emailInput = within(addCaregiverDialog).getByRole('textbox', { name: 'Email' })
  const validEmail = 'valid-email@test.com'
  await userEvent.type(emailInput, validEmail)
  expect(inviteButton).toBeEnabled()

  await userEvent.clear(emailInput)
  expect(inviteButton).toBeDisabled()

  await userEvent.type(emailInput, 'invalid-email')
  // Blur the email input field to trigger the error message display
  await userEvent.click(addCaregiverDialog)
  expect(inviteButton).toBeDisabled()
  expect(within(addCaregiverDialog).getByText('Invalid email address (special characters are not allowed).')).toBeVisible()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, validEmail)
  expect(inviteButton).toBeEnabled()
  expect(within(addCaregiverDialog).queryByText('Invalid email address (special characters are not allowed).')).not.toBeInTheDocument()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, mockCaregiverEmail)
  // Blur the email input field to trigger the error message display
  await userEvent.click(addCaregiverDialog)
  expect(inviteButton).toBeDisabled()
  expect(within(addCaregiverDialog).getByText('You are already sharing your data with this caregiver.')).toBeVisible()

  await userEvent.click(cancelButton)

  // await waitFor(() => {
  //   // expect(screen.queryByTestId('patient-add-caregiver-dialog')).not.toBeInTheDocument()
  //   expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  // }, { timeout: 3000 })

  expect(await screen.findByRole('dialog', {}, { timeout: 5000 })).not.toBeInTheDocument()
}
