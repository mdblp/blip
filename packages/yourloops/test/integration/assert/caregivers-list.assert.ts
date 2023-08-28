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
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { NotificationType } from '../../../lib/notifications/models/enums/notification-type.enum'
import { type Notification } from '../../../lib/notifications/models/notification.model'
import { expectation } from 'sinon'
import DirectShareApi from '../../../lib/share/direct-share.api'

export const checkCaregiversListLayout = async () => {
  expect(await screen.findByTestId('patient-caregivers-list')).toBeVisible()

  const addCaregiverButton = await screen.findByTestId('add-caregiver-button')
  expect(addCaregiverButton).toBeVisible()
  expect(addCaregiverButton).toBeEnabled()
}

export const checkAddRemoveCaregiver = async () => {
  const caregiversTable = screen.getByTestId('patient-caregivers-list')
  expect(caregiversTable).toHaveTextContent('Last nameFirst nameEmail')

  const caregiverRow = within(caregiversTable).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}`)
  expect(caregiverRow).toBeVisible()
  expect(caregiverRow).toHaveTextContent('UserCaregivercaregiver@mail.com')
  expect(within(caregiverRow).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}-button-remove`)).toBeVisible()

  const addCaregiverButton = await screen.findByTestId('add-caregiver-button')
  await userEvent.click(addCaregiverButton)

  const addCaregiverDialog = screen.getByTestId('patient-add-caregiver-dialog')
  expect(addCaregiverDialog).toBeVisible()
  expect(within(addCaregiverDialog).getByText('Add a caregiver')).toBeVisible()
  const emailInput = within(addCaregiverDialog).getByRole('textbox', { name: 'Email' })
  expect(emailInput).toBeVisible()

  const newCaregiverEmail = 'new-caregiver@mail.com'
  await userEvent.type(emailInput, 'new-caregiver@mail.com')
  const inviteButton = within(addCaregiverDialog).getByRole('button', { name: 'Invite' })
  expect(inviteButton).toBeEnabled()

  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValueOnce([{
    email: newCaregiverEmail,
    type: NotificationType.directInvitation,
    target: { id: 'target-id' },
    id: 'my-id'
  } as Notification])
  await userEvent.click(inviteButton)

  expect(screen.queryByTestId('patient-add-caregiver-dialog')).not.toBeInTheDocument()
  const inviteSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(inviteSuccessfulSnackbar).toHaveTextContent('Invite sent!')
  await userEvent.click(within(inviteSuccessfulSnackbar).getByTitle('Close'))

  const caregiversTableAfterAdd = await screen.findByTestId('patient-caregivers-list')
  expect(caregiversTableAfterAdd).toBeVisible()

  const caregiverRowAfterAdd = within(caregiversTableAfterAdd).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}`)
  expect(caregiverRowAfterAdd).toBeVisible()
  expect(caregiverRowAfterAdd).toHaveTextContent('UserCaregivercaregiver@mail.com')
  expect(within(caregiverRowAfterAdd).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}-button-remove`)).toBeVisible()

  const newCaregiverRow = within(caregiversTableAfterAdd).getByTestId(`patient-caregivers-table-row-${newCaregiverEmail}`)
  expect(newCaregiverRow).toBeVisible()
  expect(newCaregiverRow).toHaveTextContent('--new-caregiver@mail.com')
  const removeCaregiverButton = within(newCaregiverRow).getByTestId(`patient-caregivers-table-row-${newCaregiverEmail}-button-remove`)
  expect(removeCaregiverButton).toBeVisible()

  await userEvent.click(removeCaregiverButton)

  const removeCaregiverDialog = screen.getByTestId('remove-direct-share-dialog')
  expect(within(removeCaregiverDialog).getByText('Remove caregiver new-caregiver@mail.com')).toBeVisible()
  expect(removeCaregiverDialog).toHaveTextContent('Are you sure you want to remove caregiver new-caregiver@mail.com?They will no longer have access to your data.')
  const cancelButton = within(removeCaregiverDialog).getByRole('button', { name: 'Cancel' })
  expect(cancelButton).toBeEnabled()
  const removeButton = within(removeCaregiverDialog).getByRole('button', { name: 'Remove caregiver' })
  expect(removeButton).toBeEnabled()

  jest.spyOn(NotificationApi, 'getSentInvitations').mockResolvedValueOnce([])
  await userEvent.click(removeButton)

  expect(screen.queryByTestId('remove-direct-share-dialog')).not.toBeInTheDocument()
  const removeCaregiverSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
  expect(removeCaregiverSuccessfulSnackbar).toHaveTextContent('Your caregiver has no longer access to your data.')
  await userEvent.click(within(removeCaregiverSuccessfulSnackbar).getByTitle('Close'))

  const caregiversTableAfterRemove = await screen.findByTestId('patient-caregivers-list')
  expect(caregiversTableAfterRemove).toBeVisible()

  const caregiverRowAfterRemove = within(caregiversTableAfterRemove).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}`)
  expect(caregiverRowAfterRemove).toBeVisible()
  expect(caregiverRowAfterRemove).toHaveTextContent('UserCaregivercaregiver@mail.com')
  expect(within(caregiverRowAfterRemove).getByTestId(`patient-caregivers-table-row-${mockCaregiverUser.username}-button-remove`)).toBeVisible()

  expect(NotificationApi.cancelInvitation).toHaveBeenCalledWith('my-id', 'target-id', 'new-caregiver@mail.com')
  expect(within(caregiversTableAfterRemove).queryByTestId(`patient-caregivers-table-row-${newCaregiverEmail}`)).not.toBeInTheDocument()
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

  await userEvent.click(cancelButton)

  expect(screen.queryByTestId('patient-add-caregiver-dialog')).not.toBeInTheDocument()
}
