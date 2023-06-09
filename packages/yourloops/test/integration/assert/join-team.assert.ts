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
import TeamAPI, { PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_MESSAGE } from '../../../lib/team/team.api'
import { iTeamOne } from '../mock/team.api.mock'
import { patient1Id } from '../data/patient.api.data'
import { ITeam } from '../../../lib/team/models/i-team.model'

export const checkJoinTeamDialogCancel = async () => {
  const badgeTeamMenu = screen.getByLabelText('Open team menu')
  expect(badgeTeamMenu).toHaveTextContent('2')
  await userEvent.click(badgeTeamMenu)
  const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
  await userEvent.click(buttonJoinTeam)
  const dialog = screen.getByRole('dialog')
  await userEvent.click(buttonJoinTeam)
  const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkJoinTeamDialogPrivacyCancel = async () => {
  const badgeTeamMenu = screen.getByLabelText('Open team menu')
  expect(badgeTeamMenu).toHaveTextContent('2')
  await userEvent.click(badgeTeamMenu)
  const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
  await userEvent.click(buttonJoinTeam)
  const dialog = screen.getByRole('dialog')
  const inputCode = within(dialog).getByRole('textbox')
  await userEvent.type(inputCode, '263381988')
  const addTeamButton = within(dialog).getByRole('button', { name: 'Continue' })
  await userEvent.click(addTeamButton)
  const dialogPrivacy = screen.getByRole('dialog')
  const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
  const cancelCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Cancel' })
  await userEvent.click(checkPolicy)
  await userEvent.click(cancelCareTeamButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkJoinTeamDialogDisplayErrorMessage = async () => {
  jest.spyOn(TeamAPI, 'getTeamFromCode').mockRejectedValueOnce(undefined)
  const teamMenuButton = screen.getByLabelText('Open team menu')

  await userEvent.click(teamMenuButton)

  const joinTeamLink = screen.getByTestId('team-menu-teams-link')

  await userEvent.click(joinTeamLink)

  const dialog = screen.getByRole('dialog')
  const addTeamButton = within(dialog).getByRole('button', { name: 'Continue' })
  const inputCode = within(dialog).getByRole('textbox')

  await userEvent.type(inputCode, '263381990')
  await userEvent.click(addTeamButton)

  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Unable to add the care team. Please try again later.')
  expect(screen.queryByRole('dialog')).toBeInTheDocument()

  const snackbarCloseButton = within(screen.getByTestId('alert-snackbar')).getByTitle('Close')
  await userEvent.click(snackbarCloseButton)

  jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValueOnce({
    id: '64671d9d3853b3fcc9af152d',
    name: 'My team',
    code: '263381990',
    address: { line1: '', line2: '' }
  } as ITeam)
  jest.spyOn(TeamAPI, 'joinTeam').mockRejectedValueOnce(new Error(PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_MESSAGE))

  await userEvent.click(addTeamButton)

  const privacyPolicyDialog = within(screen.getByRole('dialog'))
  const privacyPolicyCheckbox = privacyPolicyDialog.queryByRole('checkbox')
  const joinTeamButton = privacyPolicyDialog.getByText('Join team')
  expect(privacyPolicyDialog.getByText('Cancel')).toBeEnabled()
  expect(joinTeamButton).toBeDisabled()

  await userEvent.click(privacyPolicyCheckbox)

  expect(joinTeamButton).toBeEnabled()

  await userEvent.click(joinTeamButton)

  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('This care team already invited you. Accept the pending invitation to join the care team.')
}

export const checkJoinTeamDialog = async () => {
  const badgeTeamMenu = screen.getByLabelText('Open team menu')
  expect(badgeTeamMenu).toHaveTextContent('2')
  await userEvent.click(badgeTeamMenu)
  const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
  await userEvent.click(buttonJoinTeam)
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveTextContent('Join the care team Please enter the team code (9 digits)CancelContinue')
  const addTeamButton = within(dialog).getByRole('button', { name: 'Continue' })
  const inputCode = within(dialog).getByRole('textbox')
  expect(addTeamButton).toBeDisabled()
  await userEvent.type(inputCode, '263381988')
  expect(addTeamButton).toBeEnabled()
  await userEvent.click(addTeamButton)
  expect(TeamAPI.getTeamFromCode).toHaveBeenCalledWith('263381988')

  const dialogPrivacy = screen.getByRole('dialog')
  const addCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Join team' })
  const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
  expect(dialogPrivacy).toHaveTextContent('Share your data with a care teamYou ' +
    'are about to share your data with' +
    'iTeamOne6 rue des champs75000Paris679517388' +
    'Please verify that the above details match the information provided by your healthcare professional before accepting the invite.' +
    'By accepting this invite, I recognize this team as my care team and consent to share my personal data with all its members, who are authorized healthcare professionals registered on YourLoops. ' +
    'I acknowledge that I can revoke this access at any time.Read our Privacy Policy for more information.CancelJoin team')
  expect(addCareTeamButton).toBeDisabled()
  await userEvent.click(checkPolicy)
  expect(addCareTeamButton).toBeEnabled()
  await userEvent.click(addCareTeamButton)
  expect(TeamAPI.joinTeam).toHaveBeenCalledWith(iTeamOne.id, patient1Id)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByText('Your care team has now access to your data.')).toBeVisible()
}
