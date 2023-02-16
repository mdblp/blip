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
import { renderPage } from '../../utils/render'
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockPatientApiForPatients, monitoredPatientAsTeamMember } from '../../mock/patient.api.mock'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import TeamAPI from '../../../../lib/team/team.api'
import { iTeamOne, teamOne } from '../../mock/team.api.mock'
import userEvent from '@testing-library/user-event'
import { closeDialogJoinTeam, closeDialogPrivacyPolicy, errorMessageDialogJoinTeam } from '../../assert/join-team'

describe('Patient dashboard for HCP', () => {
  const monitoredPatientDashboardRoute = '/dashboard'

  beforeAll(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    mockPatientApiForPatients()
    mockDataAPI()
  })

  it('should display proper header', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })
    const secondaryHeader = await screen.findByTestId('patient-nav-bar')
    expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsGenerate report')
  })
})

describe('Team menu for patient', () => {
  beforeAll(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne])
    jest.spyOn(TeamAPI, 'joinTeam').mockResolvedValue()
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
  })

  it('should close the dialog after clicking the join care team button with success message', async () => {
    await act(async () => {
      renderPage('/')
    })

    const badgeTeamMenu = screen.getByLabelText('Open team menu')
    expect(badgeTeamMenu).toHaveTextContent('1')
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
      'are about to share you data with' +
      'iTeamOne6 rue des champs75000Paris679517388' +
      'Please verify that the above details match the information provided by your healthcare professional before accepting the invitation.' +
      'By accepting this invitation, I recognize this team as my care team and consent to share my personal data with all its members, who are authorized healthcare professionals registered on YourLoops. ' +
      'I acknowledge that I can revoke this access at any time.Read our Privacy Policy for more information.CancelJoin team')
    expect(addCareTeamButton).toBeDisabled()
    await userEvent.click(checkPolicy)
    expect(addCareTeamButton).toBeEnabled()
    await userEvent.click(addCareTeamButton)
    expect(TeamAPI.joinTeam).toHaveBeenCalledWith('iTeamOneId', 'unmonitoredPatientId')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByText('Your care team has now access to your data.')).toBeVisible()

    closeDialogJoinTeam()
    closeDialogPrivacyPolicy()
    errorMessageDialogJoinTeam()
  })
})
