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

import { act, within, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderPage } from '../../utils/render'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { monitoredPatientAsTeamMember } from '../../mock/patient.api.mock'
import NotificationApi from '../../../../lib/notifications/notification.api'
import { iTeamOne, teamOne, teamTwo } from '../../mock/team.api.mock'
import TeamAPI from '../../../../lib/team/team.api'
import { invitationTeam } from '../../data/notification.data'
import { closeDialogNotificationTeam } from '../../assert/notification-join-team'

describe('Notification page for patient', () => {
  beforeAll(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne, teamTwo])
    jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([invitationTeam])
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(iTeamOne)
    jest.spyOn(NotificationApi, 'acceptInvitation').mockResolvedValue()
  })

  it('should be able to accept a team invite', async () => {
    await act(async () => {
      renderPage('/notifications')
    })

    const acceptButton = screen.getByRole('button', { name: 'Accept' })
    await userEvent.click(acceptButton)
    const dialogInputCodeTeam = screen.getByRole('dialog')
    const inputCode = within(dialogInputCodeTeam).getByRole('textbox')
    const addTeamButton = within(dialogInputCodeTeam).getByRole('button', { name: 'Continue' })
    expect(addTeamButton).toBeDisabled()
    await userEvent.type(inputCode, '263381988')
    expect(addTeamButton).toBeEnabled()
    await userEvent.click(addTeamButton)
    const dialogPrivacy = screen.getByRole('dialog')
    const addCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Join team' })
    const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
    expect(dialogPrivacy).toHaveTextContent('Share your data with a care teamYou ' +
      'are about to share you data withiTeamOne6 rue des champs75000Paris679517388Please verify that the above details match the information provided by your healthcare professional ' +
      'before accepting the invitation.By accepting this invitation, I recognize this team as my care team and consent to share my personal data with all its members, ' +
      'who are authorized healthcare professionals registered on YourLoops. ' +
      'I acknowledge that I can revoke this access at any time.Read our Privacy Policy for more information.CancelJoin team')
    await userEvent.click(checkPolicy)
    expect(addCareTeamButton).toBeEnabled()
    await userEvent.click(addCareTeamButton)
    expect(NotificationApi.acceptInvitation).toHaveBeenCalledWith('unmonitoredPatientId', invitationTeam)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    closeDialogNotificationTeam()
  })
})
