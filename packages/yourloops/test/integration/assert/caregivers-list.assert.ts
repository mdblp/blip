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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { mockCaregiverUser } from '../mock/direct-share.api.mock'
import NotificationApi from '../../../lib/notifications/notification.api'
import { NotificationType } from '../../../lib/notifications/models/enums/notification-type.enum'
import { type Notification } from '../../../lib/notifications/models/notification.model'
import DirectShareApi, { PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE } from '../../../lib/share/direct-share.api'
import { patient1Id } from '../data/patient.api.data'

export const checkCaregiversListLayout = async () => {
  expect(await screen.findByTestId('patient-caregivers-list')).toBeVisible()

  const addCaregiverButton = screen.getByRole('button', { name: 'Add caregiver' })
  expect(addCaregiverButton).toBeVisible()
  expect(addCaregiverButton).toBeEnabled()

  const caregiversTable = screen.getByTestId('patient-caregivers-list')
  expect(caregiversTable).toHaveTextContent('Last nameFirst nameEmail')

  const caregiverRow = within(caregiversTable).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}`)
  expect(caregiverRow).toBeVisible()
  expect(caregiverRow).toHaveTextContent('UserCaregivercaregiver@mail.com')
  expect(within(caregiverRow).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}-button-remove`)).toBeVisible()
}

export const checkAddCaregiverSuccess = async (newCaregiverEmail: string) => {
  const addCaregiverButton = screen.getByRole('button', { name: 'Add caregiver' })
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByRole('dialog')
  expect(addCaregiverDialog).toBeVisible()
  expect(within(addCaregiverDialog).getByText('Add a caregiver')).toBeVisible()
  const emailInput = within(addCaregiverDialog).getByRole('textbox', { name: 'Email' })
  expect(emailInput).toBeVisible()

  await userEvent.type(emailInput, newCaregiverEmail)
  const inviteButton = within(addCaregiverDialog).getByRole('button', { name: 'Invite' })
  expect(inviteButton).toBeEnabled()

  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValueOnce([{
    email: newCaregiverEmail,
    type: NotificationType.directInvitation,
    target: { id: 'target-id' },
    id: 'my-id'
  } as Notification])
  await userEvent.click(inviteButton)

  expect(DirectShareApi.addDirectShare).toHaveBeenCalledWith(patient1Id, newCaregiverEmail)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  const inviteSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(inviteSuccessfulSnackbar).toHaveTextContent('Invite sent!')
  await userEvent.click(within(inviteSuccessfulSnackbar).getByTitle('Close'))
}

export const checkAddCaregiverCancel = async () => {
  const addCaregiverButton = screen.getByRole('button', { name: 'Add caregiver' })
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByRole('dialog')
  expect(addCaregiverDialog).toBeVisible()

  const cancelButton = within(addCaregiverDialog).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeVisible()
  expect(cancelButton).toBeEnabled()

  await userEvent.click(cancelButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkAddCaregiverErrors = async () => {
  const addCaregiverButton = screen.getByRole('button', { name: 'Add caregiver' })
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByRole('dialog')
  expect(addCaregiverDialog).toBeVisible()

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
  expect(inviteButton).toBeDisabled()
  expect(within(addCaregiverDialog).getByText('Invalid email address (special characters are not allowed).')).toBeVisible()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, validEmail)
  expect(inviteButton).toBeEnabled()
  expect(within(addCaregiverDialog).queryByText('Invalid email address (special characters are not allowed).')).not.toBeInTheDocument()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, mockCaregiverUser.username)
  expect(inviteButton).toBeDisabled()
  expect(within(addCaregiverDialog).getByText('You are already sharing your data with this caregiver.')).toBeVisible()

  await userEvent.clear(emailInput)
  await userEvent.type(emailInput, 'other-patient@mail.com')

  jest.spyOn(DirectShareApi, 'addDirectShare').mockRejectedValueOnce(new Error(PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE))
  await userEvent.click(inviteButton)

  expect(DirectShareApi.addDirectShare).toHaveBeenCalled()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You cannot share your data with this user as they are not a caregiver.')
  await userEvent.click(within(screen.getByTestId('alert-snackbar')).getByTitle('Close'))
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemoveCaregiverCancel = async (caregiverEmail: string) => {
  const caregiversTable = screen.getByTestId('patient-caregivers-list')
  const caregiverRow = within(caregiversTable).getByTestId(`patient-caregivers-table-row-${caregiverEmail}`)
  const removeCaregiverButton = within(caregiverRow).getByTestId(`patient-caregivers-table-row-${caregiverEmail}-button-remove`)

  await userEvent.click(removeCaregiverButton)

  const removeCaregiverDialog = screen.getByRole('dialog')
  const cancelButton = within(removeCaregiverDialog).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeEnabled()

  await userEvent.click(cancelButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemoveCaregiverSuccess = async (caregiverEmail: string) => {
  const caregiversTable = screen.getByTestId('patient-caregivers-list')
  const caregiverRow = within(caregiversTable).getByTestId(`patient-caregivers-table-row-${caregiverEmail}`)
  const removeCaregiverButton = within(caregiverRow).getByTestId(`patient-caregivers-table-row-${caregiverEmail}-button-remove`)
  expect(removeCaregiverButton).toBeVisible()

  await userEvent.click(removeCaregiverButton)

  const removeCaregiverDialog = screen.getByRole('dialog')
  expect(within(removeCaregiverDialog).getByText(`Remove caregiver ${caregiverEmail}`)).toBeVisible()
  expect(removeCaregiverDialog).toHaveTextContent(`Are you sure you want to remove caregiver ${caregiverEmail}?They will no longer have access to your data.`)
  const cancelButton = within(removeCaregiverDialog).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeEnabled()
  const removeButton = within(removeCaregiverDialog).getByRole('button', { name: 'Remove caregiver' })
  expect(removeButton).toBeEnabled()

  await userEvent.click(removeButton)

  expect(NotificationApi.cancelInvitation).toHaveBeenCalledWith('my-id', 'target-id', caregiverEmail)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  const removeCaregiverSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(removeCaregiverSuccessfulSnackbar).toHaveTextContent('Your caregiver has no longer access to your data.')
  await userEvent.click(within(removeCaregiverSuccessfulSnackbar).getByTitle('Close'))
}
