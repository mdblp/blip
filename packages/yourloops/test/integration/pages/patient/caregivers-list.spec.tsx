/*
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

import { loggedInUserId, mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { IUser, UserRoles } from '../../../../models/user'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { mockUserDataFetch } from '../../mock/auth'
import { mockPatientAPI } from '../../mock/mockPatientAPI'
import { addDirectShareMock, mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { act, screen, within } from '@testing-library/react'
import { renderPage } from '../../utils/render'
import { checkPatientLayout } from '../../assert/layout'
import userEvent from '@testing-library/user-event'
import DirectShareApi, {
  PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE
} from '../../../../lib/share/direct-share-api'
import { UserInvitationStatus } from '../../../../models/generic'
import { INotification } from '../../../../lib/notifications/models'

describe('Patient caregivers page', () => {
  const firstName = 'Théo'
  const lastName = 'Cupé'

  const caregiverId = 'caregiver-id'
  const caregiverFirstName = 'Claire'
  const caregiverLastName = 'Hyère'
  const caregiverEmail = 'caregiver@email.com'

  const otherPatientEmail = 'other-patient@email.com'

  beforeAll(() => {
    mockAuth0Hook(UserRoles.patient)
    mockNotificationAPI()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockDirectShareApi()
  })

  it('should render the caregivers page, allow to add and remove a caregiver', async () => {
    await act(async () => {
      renderPage('/caregivers')
    })

    checkPatientLayout(`${firstName} ${lastName}`)

    const secondaryBar = screen.getByTestId('patient-caregivers-secondary-bar')
    expect(secondaryBar).toBeVisible()

    const addCaregiverButton = within(secondaryBar).getByText('Add Caregiver')
    expect(addCaregiverButton).toBeVisible()

    await userEvent.click(addCaregiverButton)

    const addCaregiverDialog = screen.getByRole('dialog')
    expect(addCaregiverDialog).toBeVisible()

    const addCaregiverDialogTitle = within(addCaregiverDialog).getByText('Add a caregiver')
    expect(addCaregiverDialogTitle).toBeVisible()

    const addCaregiverDialogEmailInput = within(addCaregiverDialog).getByRole('textbox', { name: 'Email' })
    expect(addCaregiverDialogEmailInput).toBeVisible()

    const addCaregiverDialogConfirmButton = within(addCaregiverDialog).getByRole('button', { name: 'Invite' })
    expect(addCaregiverDialogConfirmButton).toBeVisible()
    expect(addCaregiverDialogConfirmButton).toBeDisabled()

    const addCaregiverDialogCancelButton = within(addCaregiverDialog).getByText('Cancel')
    expect(addCaregiverDialogCancelButton).toBeVisible()

    await userEvent.type(addCaregiverDialogEmailInput, caregiverEmail)

    expect(addCaregiverDialogConfirmButton).toBeEnabled()

    jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValueOnce([{
      user: { userid: caregiverId, profile: { firstName: caregiverFirstName, lastName: caregiverLastName } } as IUser,
      invitation: { email: caregiverEmail } as INotification,
      status: UserInvitationStatus.accepted
    }])
    await act(async () => {
      await userEvent.click(addCaregiverDialogConfirmButton)
    })

    expect(addDirectShareMock).toHaveBeenCalledWith(loggedInUserId, caregiverEmail)

    const invitationSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
    expect(invitationSuccessfulSnackbar).toHaveTextContent('Invitation sent!')

    const invitationSuccessfulSnackbarCloseButton = within(invitationSuccessfulSnackbar).getByTitle('Close')

    await userEvent.click(invitationSuccessfulSnackbarCloseButton)

    expect(invitationSuccessfulSnackbar).not.toBeVisible()

    const caregiversTable = screen.getByLabelText('Table caregiver list')
    expect(caregiversTable).toBeVisible()

    const caregiversTableLastNameHeader = within(caregiversTable).getByText('Last name')
    expect(caregiversTableLastNameHeader).toBeVisible()

    const caregiversTableFirstNameHeader = within(caregiversTable).getByText('First name')
    expect(caregiversTableFirstNameHeader).toBeVisible()

    const caregiversTableEmailHeader = within(caregiversTable).getByText('Email')
    expect(caregiversTableEmailHeader).toBeVisible()

    const caregiverRow = within(caregiversTable).getByTestId(`patient-caregivers-table-row-${caregiverId}`)
    expect(caregiverRow).toBeVisible()

    const removeCaregiverButton = await within(caregiverRow).findByRole('button', { name: `Remove caregiver-${caregiverId}` })
    expect(removeCaregiverButton).toBeVisible()

    await userEvent.click(removeCaregiverButton)

    const removeCaregiverDialog = screen.getByRole('dialog')
    expect(removeCaregiverDialog).toBeVisible()

    const removeCaregiverDialogTitle = within(removeCaregiverDialog).getByText('Remove a caregiver')
    expect(removeCaregiverDialogTitle).toBeVisible()

    const removeCaregiverDialogQuestion = within(removeCaregiverDialog).getByText(`Are you sure you want to remove caregiver ${caregiverFirstName} ${caregiverLastName}?`)
    expect(removeCaregiverDialogQuestion).toBeVisible()

    const removeCaregiverDialogInfo = within(removeCaregiverDialog).getByText('They will no longer have access to your data.')
    expect(removeCaregiverDialogInfo).toBeVisible()

    const removeCaregiverDialogCancelButton = within(removeCaregiverDialog).getByText('Cancel')
    expect(removeCaregiverDialogCancelButton).toBeVisible()

    const removeCaregiverDialogConfirmButton = within(removeCaregiverDialog).getByText('Remove caregiver')
    expect(removeCaregiverDialogConfirmButton).toBeVisible()

    await act(async () => {
      await userEvent.click(removeCaregiverDialogConfirmButton)
    })

    expect(caregiverRow).not.toBeVisible()

    const removeCaregiverSuccessfulSnackbar = screen.getByTestId('alert-snackbar')
    expect(removeCaregiverSuccessfulSnackbar).toHaveTextContent('Your caregiver has no longer access to your data.')

    const removeCaregiverSuccessfulSnackbarCloseButton = within(removeCaregiverSuccessfulSnackbar).getByTitle('Close')

    await userEvent.click(removeCaregiverSuccessfulSnackbarCloseButton)

    expect(removeCaregiverSuccessfulSnackbar).not.toBeVisible()

    const secondaryBar2 = screen.getByTestId('patient-caregivers-secondary-bar')
    expect(secondaryBar2).toBeVisible()

    const addCaregiverButton2 = within(secondaryBar2).getByText('Add Caregiver')
    expect(addCaregiverButton2).toBeVisible()

    await userEvent.click(addCaregiverButton2)

    const addCaregiverDialog2 = screen.getByRole('dialog')
    const addCaregiverDialogEmailInput2 = within(addCaregiverDialog2).getByRole('textbox', { name: 'Email' })
    const addCaregiverDialogConfirmButton2 = within(addCaregiverDialog2).getByRole('button', { name: 'Invite' })

    await userEvent.type(addCaregiverDialogEmailInput2, otherPatientEmail)

    jest.spyOn(DirectShareApi, 'addDirectShare').mockRejectedValueOnce(new Error(PATIENT_CANNOT_BE_ADDED_AS_CAREGIVER_ERROR_MESSAGE))
    await act(async () => {
      await userEvent.click(addCaregiverDialogConfirmButton2)
    })

    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('You cannot share your data with this user as they are not a caregiver.')
  })
})
