/*
 * Copyright (c) 2023-2026, Diabeloop
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
import {
  myFirstTeamId,
  mySecondTeamId,
  myThirdTeamAddress,
  myThirdTeamCode,
  myThirdTeamId,
  myThirdTeamName,
  myThirdTeamPhoneNumber
} from '../mock/team.api.mock'
import {
  loggedInUserEmail,
  loggedInUserFirstName,
  loggedInUserFullName,
  loggedInUserId,
  loggedInUserInitials,
  loggedInUserLastName,
  userHugoFullName,
  userTimEmail,
  userTimFirstName,
  userTimFullName,
  userTimId,
  userTimInitials,
  userTimLastName,
  userYdrisFullName
} from '../mock/auth0.hook.mock'
import userEvent from '@testing-library/user-event'
import TeamApi from '../../../lib/team/team.api'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import PatientApi from '../../../lib/patient/patient.api'
import { patient1Id } from '../data/patient.api.data'

export const checkCareTeamInformation = async () => {
  const teamInformationSection = within(await screen.findByTestId('team-information'))

  expect(teamInformationSection.getByText('Team information')).toBeVisible()
  expect(teamInformationSection.getByText('Edit information')).toBeVisible()
  expect(teamInformationSection.getByText('Edit information')).toBeEnabled()

  expect(teamInformationSection.getByText('Team name')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamName)).toBeVisible()
  expect(teamInformationSection.getByText('Phone number')).toBeVisible()
  expect(teamInformationSection.getByText(`(+44) ${myThirdTeamPhoneNumber}`)).toBeVisible()
  expect(teamInformationSection.getByText('Identification code')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamCode)).toBeVisible()
  expect(teamInformationSection.getByText('Address')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamAddress)).toBeVisible()
}

export const checkRemoveMember = async () => {
  const teamMembersTable = await screen.findByRole('table')
  expect(teamMembersTable).toHaveTextContent(/^MemberEmailAdminActionsYBYann Blancyann.blanc@example.comTCTim Canutim.canu@example.compending-user-iconPending...hugo.rodrigues@example.compending-user-iconPending...ydris.rebibane@example.com$/)

  const removeMemberButton = screen.getByRole('button', { name: `Remove the member ${userTimFullName}` })
  await userEvent.click(removeMemberButton)

  const confirmDialog = screen.getByRole('dialog')
  expect(confirmDialog).toHaveTextContent('Remove member from teamRemove the member Tim Canu from the team A - MyThirdTeam - to be deleted?CancelConfirm')

  jest.spyOn(TeamApi, 'removeMember').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  const confirmButton = within(confirmDialog).getByRole('button', { name: 'Confirm' })
  await userEvent.click(confirmButton)
  expect(TeamApi.removeMember).toHaveBeenCalledWith({ teamId: myThirdTeamId, userId: userTimId, email: userTimEmail })
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)

  const cancelButton = within(confirmDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton) //Surprisingly the dialog is still present (legacy code from component?)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemoveOurselvesFromTheMembers = async () => {
  const removeMemberButton = screen.getByRole('button', { name: `Remove the member ${loggedInUserFullName}` })
  expect(removeMemberButton).toBeDisabled()
}

export const checkRemovePendingMemberNotInvitedByOurselves = async () => {
  const removeMemberButton = screen.getByRole('button', { name: `Remove the member ${userYdrisFullName}` })
  expect(removeMemberButton).toBeDisabled()
}

export const checkRemovePendingMemberInvitedByOurselves = async () => {
  const removeMemberButton = screen.getByRole('button', { name: `Remove the member ${userHugoFullName}` })
  expect(removeMemberButton).toBeEnabled()
}

export const checkGiveAdminRole = async () => {
  const memberToUpdateRow = await screen.findByTestId(`member-row-${userTimId}`)
  const roleCheckBoxNotAdmin = within(memberToUpdateRow).getByRole('checkbox')
  expect(roleCheckBoxNotAdmin).toBeEnabled()
  expect(roleCheckBoxNotAdmin).toHaveProperty('checked', false)

  jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  await userEvent.click(roleCheckBoxNotAdmin)
  expect(TeamApi.changeMemberRole).toHaveBeenCalledWith({
    teamId: myThirdTeamId,
    userId: userTimId,
    email: userTimEmail,
    role: TeamMemberRole.admin
  })
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)
}

export const checkRemoveAdminRole = async () => {
  const memberToUpdateRow = await screen.findByTestId(`member-row-${userTimId}`)
  const roleCheckBoxNotAdmin = within(memberToUpdateRow).getByRole('checkbox')
  expect(roleCheckBoxNotAdmin).toBeEnabled()
  expect(roleCheckBoxNotAdmin).toHaveProperty('checked', true)

  jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  await userEvent.click(roleCheckBoxNotAdmin)
  expect(TeamApi.changeMemberRole).toHaveBeenCalledWith({
    teamId: myFirstTeamId,
    userId: userTimId,
    email: userTimEmail,
    role: TeamMemberRole.member
  })
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)
}

export const checkNotTeamAdmin = async () => {
  const memberToUpdateRow = await screen.findByTestId(`member-row-${userTimId}`)
  const roleCheckBoxNotAdmin = within(memberToUpdateRow).getByRole('checkbox')
  expect(roleCheckBoxNotAdmin).toBeDisabled()
}

export const checkDeleteTeam = async () => {
  const teamMembersTable = await screen.findByRole('table')
  expect(teamMembersTable).toHaveTextContent('MemberEmailAdminActionsYUYourloops UI 28.0 HCP 0yann.blanc@example.com')

  const leaveTeamButton = screen.getByRole('button', { name: 'Leave team' })
  await userEvent.click(leaveTeamButton)

  const confirmDialog = screen.getByRole('dialog')
  expect(confirmDialog).toHaveTextContent('Leave and delete a care teamMySecondTeamSince you are the only member in this team, MySecondTeam will be permanently deleted if you leave it.You will no longer have access to your patients data. This action can\'t be undone.CancelLeave and delete team')

  jest.spyOn(TeamApi, 'deleteTeam').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  const deleteTeambutton = within(confirmDialog).getByRole('button', { name: 'Leave and delete team' })
  await userEvent.click(deleteTeambutton)
  expect(TeamApi.deleteTeam).toHaveBeenCalledWith(mySecondTeamId)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)
}

export const checkLeaveTeamHcp = async () => {
  const leaveTeamButton = await screen.findByRole('button', { name: 'Leave team' })
  await userEvent.click(leaveTeamButton)

  const confirmDialog = screen.getByRole('dialog')
  expect(confirmDialog).toHaveTextContent('Leave a care teamMyFirstTeamAre you sure you want to leave this care team?You will no longer have access to your patients data.CancelLeave team')

  jest.spyOn(TeamApi, 'leaveTeam').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  const leaveTeambutton = within(confirmDialog).getByRole('button', { name: 'Leave team' })
  await userEvent.click(leaveTeambutton)
  expect(TeamApi.leaveTeam).toHaveBeenCalledWith(loggedInUserId, myFirstTeamId)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)
}

export const checkLeaveTeamPatient = async () => {
  const leaveTeamButton = await screen.findByRole('button', { name: 'Leave team' })
  await userEvent.click(leaveTeamButton)

  const confirmDialog = screen.getByRole('dialog')
  expect(confirmDialog).toHaveTextContent('Leave a care teamMyFirstTeamAre you sure you want to leave this care team?CancelLeave team')

  jest.spyOn(PatientApi, 'removePatient').mockResolvedValueOnce(null)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(1)
  const leaveTeambutton = within(confirmDialog).getByRole('button', { name: 'Leave team' })
  await userEvent.click(leaveTeambutton)
  expect(PatientApi.removePatient).toHaveBeenCalledWith(myFirstTeamId, patient1Id)
  expect(TeamApi.getTeams).toHaveBeenCalledTimes(2)
}

export const checkCareTeamMembers = () => {
  const teamMembersSection = within(screen.getByTestId('team-members'))

  expect(teamMembersSection.getByText('Members')).toBeVisible()
  expect(teamMembersSection.getByText('Leave team')).toBeVisible()
  expect(teamMembersSection.getByText('Leave team')).toBeEnabled()
  expect(teamMembersSection.getByText('Add healthcare professional')).toBeVisible()
  expect(teamMembersSection.getByText('Add healthcare professional')).toBeEnabled()

  expect(screen.getByTestId('team-members-list-table')).toHaveTextContent(`MemberEmailAdminActions${loggedInUserInitials}${loggedInUserFirstName} ${loggedInUserLastName}${loggedInUserEmail}${userTimInitials}${userTimFirstName} ${userTimLastName}${userTimEmail}`)
}

export const checkCareTeamMonitoringAlertsConfiguration = async () => {
  const menu = screen.getByTestId('care-team-settings-menu')
  const monitoringAlertsConfigurationMenuItem = within(menu).getByText('Monitoring alerts')
  await userEvent.click(monitoringAlertsConfigurationMenuItem)
  const monitoringAlertsConfigurationSection = screen.getByTestId('team-monitoring-alerts-configuration')

  expect(within(monitoringAlertsConfigurationSection).getByText('Monitoring alerts configuration')).toBeVisible()
  const saveButton = within(monitoringAlertsConfigurationSection).getByRole('button', { name: 'Save' })
  expect(saveButton).toBeVisible()
  expect(saveButton).toBeDisabled() // No monitoring value has been changed, button should be disabled

  expect(monitoringAlertsConfigurationSection).toHaveTextContent('Monitoring alerts configuration1. Time away from target range')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum​mg/dLMaximum​mg/dLDefault: min at 70 mg/dL and max at 180 mg/dLB. Event trigger thresholdTime spent off target5%​Default: 50%')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('2. HyperglycemiaCurrent trigger setting: 25% of time above 250 mg/dL thresholdA. Hyperglycemia threshold:Hyperglycemia above​mg/dLDefault: 250 mg/dLB. Event trigger thresholdTime spent in hyperglycemia25%​Default: 25%')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('3. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mg/dLDefault: 54 mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​Default: 5%')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('4. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Default: 50%')
}

export const checkCareTeamLayoutForPatient = async () => {
  await screen.findByText('Team information')

  expect(screen.queryByTestId('care-team-settings-menu')).not.toBeInTheDocument()

  expect(screen.getByTestId('team-information')).toBeVisible()
  const teamInformationSection = within(screen.getByTestId('team-information'))
  expect(teamInformationSection.queryByTestId('team-information-alert')).not.toBeInTheDocument()
  expect(screen.getByTestId('team-information')).toHaveTextContent('Team informationLeave teamIdentification code036 - 038 - 775Name *Name *Country *​Country *Phone number *+44Phone number *EmailEmailAddress 1 *Address 1 *Address 2Address 2Zipcode *Zipcode *City (State / Province) *City (State / Province) *')
  expect(teamInformationSection.queryByTestId('copy-team-code-button')).not.toBeInTheDocument()
  expect(teamInformationSection.queryByTestId('team-information-save-button')).not.toBeInTheDocument()

  expect(within(teamInformationSection.getByTestId('team-information-name-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-phone-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-email-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-addr1-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-addr2-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-zipCode-input')).getByRole('textbox')).toHaveAttribute('readonly')
  expect(within(teamInformationSection.getByTestId('team-information-city-input')).getByRole('textbox')).toHaveAttribute('readonly')

  expect(screen.queryByTestId('team-members')).not.toBeInTheDocument()
}
