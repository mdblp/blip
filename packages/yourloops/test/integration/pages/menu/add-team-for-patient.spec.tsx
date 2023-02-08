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

import TeamAPI from '../../../../lib/team/team.api'
import { getCodeTeam, teamOne } from '../../mock/team.api.mock'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { monitoredPatientAsTeamMember } from '../../mock/patient.api.mock'
import { act, screen, within } from '@testing-library/react'
import { renderPage } from '../../utils/render'
import userEvent from '@testing-library/user-event'

describe('Team menu for patient', () => {
  beforeAll(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne])
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(getCodeTeam)
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
  })

  it('should close the dialog after clicking the add care button with success message', async () => {
    await act(async () => {
      renderPage('/')
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    expect(badgeTeamMenu).toHaveTextContent('1')
    await userEvent.click(badgeTeamMenu)
    const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
    await userEvent.click(buttonJoinTeam)
    const dialog = screen.getByRole('dialog')
    const titleDialog = within(dialog).getByTestId('team-add-dialog-title')
    const labelDialog = within(dialog).getByTestId('label-dialog')
    expect(dialog).toBeVisible()
    expect(titleDialog).toHaveTextContent('Add a care team')
    expect(labelDialog).toHaveTextContent('Please enter the team code (9 digits)')
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    const inputCode = within(dialog).getByRole('textbox')
    expect(addTeamButton).toBeDisabled()
    expect(cancelButton).toBeVisible()
    await userEvent.type(inputCode, '263381988')
    expect(addTeamButton).toBeEnabled()
    await userEvent.click(addTeamButton)

    const dialogPrivacy = screen.getByRole('dialog')
    const addCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Add Care team' })
    const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
    const textPrivatePolicy = within(dialogPrivacy).getByTestId('text-privacy-policy')
    const detailsTeam = within(dialogPrivacy).getByTestId('team-add-dialog-confirm-team-infos')

    expect(within(dialogPrivacy).getByText('You are about to share you data with')).toBeVisible()
    expect(detailsTeam).toHaveTextContent('fakeTeamFive6 rue des champs75000Paris263381988')
    expect(within(dialogPrivacy).getByText('By accepting this invitation, I recognize this team as my care team and consent to share my personal data with all its members, who are authorized healthcare professionals registered on YourLoops. I acknowledge that I can revoke this access at any time.')).toBeVisible()
    expect(dialogPrivacy).toHaveTextContent('Share your data with a care team')
    expect(dialogPrivacy).toHaveTextContent('Please verify that the above details match the information provided by your healthcare professional before accepting the invitation.')
    expect(textPrivatePolicy).toHaveTextContent('Read our Privacy Policy for more information')
    expect(within(dialogPrivacy).getByRole('button', { name: 'Cancel' })).toBeVisible()
    expect(addCareTeamButton).toBeDisabled()
    await userEvent.click(checkPolicy)
    expect(addCareTeamButton).toBeEnabled()
    await userEvent.click(addCareTeamButton)
    expect(TeamAPI.joinTeam).toHaveBeenCalledWith('fakeIdTeam', 'unmonitoredPatientId')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Your care team has now access to your data.')).toBeVisible()
  })

  it('should close dialog code after clicking in cancel button', async function () {
    await act(async () => {
      renderPage('/')
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    expect(badgeTeamMenu).toHaveTextContent('1')
    await userEvent.click(badgeTeamMenu)
    const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
    await userEvent.click(buttonJoinTeam)
    const dialog = screen.getByRole('dialog')
    const titleDialog = within(dialog).getByTestId('team-add-dialog-title')
    const labelDialog = within(dialog).getByTestId('label-dialog')
    expect(dialog).toBeVisible()
    expect(titleDialog).toHaveTextContent('Add a care team')
    expect(labelDialog).toHaveTextContent('Please enter the team code (9 digits)')
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    expect(addTeamButton).toBeDisabled()
    expect(cancelButton).toBeVisible()
    await userEvent.click(cancelButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
  it('should close dialog policy privacy after clicking in cancel button', async function () {
    await act(async () => {
      renderPage('/')
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    expect(badgeTeamMenu).toHaveTextContent('1')
    await userEvent.click(badgeTeamMenu)
    const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
    await userEvent.click(buttonJoinTeam)
    const dialog = screen.getByRole('dialog')
    const titleDialog = within(dialog).getByTestId('team-add-dialog-title')
    const labelDialog = within(dialog).getByTestId('label-dialog')
    expect(dialog).toBeVisible()
    expect(titleDialog).toHaveTextContent('Add a care team')
    expect(labelDialog).toHaveTextContent('Please enter the team code (9 digits)')
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    const inputCode = within(dialog).getByRole('textbox')
    expect(addTeamButton).toBeDisabled()
    expect(cancelButton).toBeVisible()
    await userEvent.type(inputCode, '263381988')
    expect(addTeamButton).toBeEnabled()
    await userEvent.click(addTeamButton)

    const dialogPrivacy = screen.getByRole('dialog')
    const addCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Add Care team' })
    const cancelCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Cancel' })
    const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
    const textPrivatePolicy = within(dialogPrivacy).getByTestId('text-privacy-policy')
    const detailsTeam = within(dialogPrivacy).getByTestId('team-add-dialog-confirm-team-infos')

    expect(within(dialogPrivacy).getByText('You are about to share you data with')).toBeVisible()
    expect(detailsTeam).toHaveTextContent('fakeTeamFive6 rue des champs75000Paris263381988')
    expect(within(dialogPrivacy).getByText('By accepting this invitation, I recognize this team as my care team and consent to share my personal data with all its members, who are authorized healthcare professionals registered on YourLoops. I acknowledge that I can revoke this access at any time.')).toBeVisible()
    expect(dialogPrivacy).toHaveTextContent('Share your data with a care team')
    expect(dialogPrivacy).toHaveTextContent('Please verify that the above details match the information provided by your healthcare professional before accepting the invitation.')
    expect(textPrivatePolicy).toHaveTextContent('Read our Privacy Policy for more information')
    expect(addCareTeamButton).toBeDisabled()
    await userEvent.click(checkPolicy)
    await userEvent.click(cancelCareTeamButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('should after error in input code display an error message', async function () {
    await act(async () => {
      renderPage('/')
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    expect(badgeTeamMenu).toHaveTextContent('1')
    await userEvent.click(badgeTeamMenu)
    const buttonJoinTeam = screen.getByTestId('team-menu-teams-link')
    await userEvent.click(buttonJoinTeam)
    const dialog = screen.getByRole('dialog')
    const titleDialog = within(dialog).getByTestId('team-add-dialog-title')
    const labelDialog = within(dialog).getByTestId('label-dialog')
    expect(dialog).toBeVisible()
    expect(titleDialog).toHaveTextContent('Add a care team')
    expect(labelDialog).toHaveTextContent('Please enter the team code (9 digits)')
    const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    const inputCode = within(dialog).getByRole('textbox')
    expect(addTeamButton).toBeDisabled()
    expect(cancelButton).toBeVisible()
    await userEvent.type(inputCode, '263381900')
    expect(addTeamButton).toBeEnabled()
    await userEvent.click(addTeamButton)
    expect(within(dialog).getByText('Please check the code, is an bad code')).toBeVisible()
    expect(dialog).toBeVisible()
  })
})
