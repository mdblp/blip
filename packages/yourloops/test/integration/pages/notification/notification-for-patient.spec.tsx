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
import { Notification } from '../../../../lib/notifications/models/notification.model'
import { TeamMemberRole } from '../../../../lib/team/models/enums/team-member-role.enum'
import { NotificationType } from '../../../../lib/notifications/models/enums/notification-type.enum'
import { invitationHcpForPatient, teamOne, teamTwo } from '../../mock/team.api.mock'
import TeamAPI from '../../../../lib/team/team.api'

describe('Add patient in the team with a notification', () => {
  const invitationTeam: Notification = {
    id: '26a11710e98e4',
    type: NotificationType.careTeamPatientInvitation,
    metricsType: 'join_team',
    email: 'ylp.ui.test.67-patient12@diabeloop.fr',
    creatorId: 'dec0816009d32',
    date: '',
    target: { id: '63c7b7989cacc878ecce2c40', name: 'sysReq-67-team2' },
    role: TeamMemberRole.patient,
    creator: {
      userid: 'dec0816009d32',
      profile: {
        fullName: 'Backloops test SysReq 67 hcp1',
        patient: {
          birthday: '',
          diagnosisDate: ''
        },
        email: ''
      }
    }
  }

  beforeAll(() => {
    mockPatientLogin(monitoredPatientAsTeamMember)
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne, teamTwo])
    jest.spyOn(NotificationApi, 'getReceivedInvitations').mockResolvedValue([invitationTeam])
    jest.spyOn(TeamAPI, 'getTeamFromCode').mockResolvedValue(invitationHcpForPatient)
    jest.spyOn(NotificationApi, 'acceptInvitation').mockResolvedValue()
  })

  it('Should cancel add team', async () => {
    await act(async () => {
      renderPage('/notifications')
    })

    expect(screen.getByTestId('notification-line')).toHaveTextContent("You're invited to share your diabetes data with sysReq-67-team2.")
    const acceptButton = screen.getByRole('button', { name: 'Accept' })
    await userEvent.click(acceptButton)
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('Add the care team sysReq-67-team2')).toBeVisible()
    expect(within(dialog).getByText('Please enter the team code (9 digits, provided by the care team who sent this invite)')).toBeVisible()
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    const cancelTeamButton = within(dialog).getByRole('button', { name: 'Cancel' })
    expect(addTeamButton).toBeDisabled()
    await userEvent.click(cancelTeamButton)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('Should after validation of the team code, the patient must be in a new team', async () => {
    await act(async () => {
      renderPage('/notifications')
    })
    const badgetNotification = screen.getByLabelText('Go to notifications list')
    expect(badgetNotification).toHaveTextContent('1')
    const badgetTeam = screen.getByLabelText('Open team menu')
    expect(badgetTeam).toHaveTextContent('2')
    const acceptButton = screen.getByRole('button', { name: 'Accept' })
    await userEvent.click(acceptButton)
    const dialog = screen.getByRole('dialog')
    const inputCode = within(dialog).getByRole('textbox')
    const addTeamButton = within(dialog).getByRole('button', { name: 'Add team' })
    expect(addTeamButton).toBeDisabled()
    await userEvent.type(inputCode, '263381988')
    expect(addTeamButton).toBeEnabled()
    await userEvent.click(addTeamButton)
    const dialogPrivacy = screen.getByRole('dialog')
    const textAccepteShareData = within(dialog).getByTestId('check-policy')
    const patientTeamInfo = within(dialog).getByTestId('patient-team-info')
    const patientShareData = within(dialog).getByTestId('patient-share-data')
    const addCareTeamButton = within(dialogPrivacy).getByRole('button', { name: 'Add Care team' })
    const checkPolicy = within(dialogPrivacy).getByRole('checkbox')
    const textPrivatePolicy = within(dialogPrivacy).getByTestId('text-privacy-policy')
    expect(patientShareData).toHaveTextContent('You are about to share you data with')
    expect(patientTeamInfo).toHaveTextContent('sysReq-67-team26 rue des champs75000 Paris67951738')
    expect(dialog).toHaveTextContent('Share your data with a care team')
    expect(textAccepteShareData).toHaveTextContent('By accepting this invitation, I recognize this team as my care team and consent to share my personal data with all its members, who are authorized healthcare professionals registered on YourLoops. I acknowledge that I can revoke this access at any time.')
    expect(dialog).toHaveTextContent('Please verify that the above details match the information provided by your healthcare professional before accepting the invitation.')
    expect(textPrivatePolicy).toHaveTextContent('Read our Privacy Policy for more information')
    expect(addCareTeamButton).toBeDisabled()
    await userEvent.click(checkPolicy)
    expect(addCareTeamButton).toBeEnabled()
    await userEvent.click(addCareTeamButton)
    expect(NotificationApi.acceptInvitation).toHaveBeenCalledWith('unmonitoredPatientId', invitationTeam)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
