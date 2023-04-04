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

import { act, fireEvent, screen, waitFor, within } from '@testing-library/react'
import PatientAPI from '../../../../lib/patient/patient.api'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import {
  mockPatientApiForHcp,
  mockPatientApiForPatients,
  monitoredPatient,
  monitoredPatientTwo,
  monitoredPatientWithMmol,
  pendingPatient,
  unmonitoredPatient
} from '../../mock/patient.api.mock'
import { AVAILABLE_TEAMS, mockTeamAPI, teamPrivate, teamThree, teamTwo } from '../../mock/team.api.mock'
import { checkHCPLayout } from '../../assert/layout'
import userEvent from '@testing-library/user-event'
import { PhonePrefixCode } from '../../../../lib/utils'
import { renderPage } from '../../utils/render'
import TeamAPI from '../../../../lib/team/team.api'
import { mockUserApi } from '../../mock/user.api.mock'
import { checkPatientList } from '../../assert/patient-list-header'

describe('HCP home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'
  const removePatientMock = jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)
  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockDirectShareApi()
  })

  it('should not display the Care team tab and not allow to add patients if the private practice is selected', async () => {
    localStorage.setItem('selectedTeamId', 'private')
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    await checkHCPLayout(`${firstName} ${lastName}`, { teamName: teamPrivate.name, isPrivate: true }, AVAILABLE_TEAMS)

    const patientListHeader = screen.getByTestId('patient-list-header')
    const addPatientButton = within(patientListHeader).getByText('Add new patient')
    expect(addPatientButton).toBeVisible()
    expect(addPatientButton).toBeDisabled()

    const addPatientHoverZone = within(patientListHeader).getByTestId('add-patient-button-disabled')
    await userEvent.hover(addPatientHoverZone)
    const informationTooltip = screen.getByText('To invite a patient, you must first select a care team from the dropdown menu. You can create you own care team if you need to. Alternatively, you can provide the patient with your YourLoops email address so they can enable private data sharing with you.')
    expect(informationTooltip).toBeVisible()

    await userEvent.unhover(addPatientHoverZone)
    expect(informationTooltip).not.toBeVisible()
  })

  it('should display a list of patients and allow to remove one of them', async () => {
    localStorage.setItem('selectedTeamId', teamThree.id)
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    await checkHCPLayout(`${firstName} ${lastName}`, { teamName: teamThree.name }, AVAILABLE_TEAMS)
    checkPatientList()

    const dataGridRow = screen.getByTestId('patient-list-grid')
    expect(within(dataGridRow).getAllByRole('row')).toHaveLength(5)
    expect(dataGridRow).toHaveTextContent('PatientSystemTime spent out of range from targetSevere hypoglycemiaData not transferredLast data updateActionsFlag patient monitored-patient2@diabeloop.frMonitored Monitored Patient 2DBLG110%20%30%N/ANo new messagesFlag patient monitored-patient2@diabeloop.frMonitored Monitored Patient 2DBLG110%20%30%N/ANo new messagesFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/ANo new messagesFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientDBLG110%20%30%N/ANo new messagesData calculated on the last 7 daysRows per page:101–4 of 4')

    const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatient.profile.email}` })
    expect(removeButton).toBeVisible()

    await userEvent.click(removeButton)
    const removeDialog = screen.getByRole('dialog')
    expect(removeDialog).toBeVisible()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    jest.spyOn(PatientAPI, 'getPatientsForHcp').mockResolvedValueOnce([monitoredPatient, monitoredPatientTwo, monitoredPatientWithMmol, pendingPatient])
    const teamId = unmonitoredPatient.teams[0].teamId
    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })
    expect(removePatientMock).toHaveBeenCalledWith(teamId, unmonitoredPatient.userid)
    expect(within(dataGridRow).getAllByRole('row')).toHaveLength(4)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unmonitoredPatient.profile.firstName} ${unmonitoredPatient.profile.lastName} is no longer a member of ${teamThree.name}`)
  })

  it('should allow to remove a patient who is in multiple teams', async () => {
    const teamId = monitoredPatient.teams[0].teamId
    await act(async () => {
      renderPage('/')
    })

    const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
    expect(removeButton).toBeVisible()

    await userEvent.click(removeButton)
    const removeDialog = screen.getByRole('dialog')
    expect(removeDialog).toBeVisible()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    const select = within(removeDialog).getByTestId('patient-team-selector')
    fireEvent.mouseDown(within(select).getByRole('button'))

    fireEvent.click(screen.getByRole('option', { name: teamTwo.name }))

    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })
    expect(removePatientMock).toHaveBeenCalledWith(teamId, monitoredPatient.userid)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} is no longer a member of ${teamTwo.name}`)
  })

  it('should display an error message if patient removal failed', async () => {
    mockPatientApiForPatients()
    jest.spyOn(PatientAPI, 'removePatient').mockRejectedValueOnce(Error('error'))
    await act(async () => {
      renderPage('/')
    })

    const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
    await userEvent.click(removeButton)
    const removeDialog = screen.getByRole('dialog')
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })
    expect(removePatientMock).toHaveBeenCalledWith(monitoredPatient.teams[0].teamId, monitoredPatient.userid)
    expect(screen.getByTestId('remove-hcp-patient-dialog')).toBeVisible()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  })

  it('should display dialog to add patient with appropriate error messages depending on the input user and the selected team', async () => {
    await act(async () => {
      renderPage('/')
    })

    const patientListHeader = screen.getByTestId('patient-list-header')
    const addPatientButton = within(patientListHeader).getByText('Add new patient')
    expect(addPatientButton).toBeVisible()

    await userEvent.click(addPatientButton)

    const addPatientDialog = screen.getByRole('dialog')
    expect(addPatientDialog).toBeVisible()

    const title = within(addPatientDialog).getByText('Invite a patient in A - MyThirdTeam - to be deleted')
    expect(title).toBeVisible()

    const infoAlert = within(addPatientDialog).getByText('To invite a patient to share their data with another care team, you must first select the care team in the dropdown menu at the top right of YourLoops.')
    expect(infoAlert).toBeVisible()

    const warningLine1 = within(addPatientDialog).getByText('By inviting this patient to share their data with me and their care team, I declare under my professional responsibility that I am part of this patient’s care team and, as such, have the right to access the patient’s personal data according to the applicable regulations.')
    expect(warningLine1).toBeVisible()

    const warningLine2 = within(addPatientDialog).getByTestId('modal-add-patient-warning-line2')
    expect(warningLine2).toHaveTextContent('Read our Terms of use and Privacy Policy.')
    const termsOfUseLink = within(addPatientDialog).getByRole('link', { name: 'Terms of use' })
    expect(termsOfUseLink).toBeVisible()
    const privacyPolicyLink = within(addPatientDialog).getByRole('link', { name: 'Privacy Policy' })
    expect(privacyPolicyLink).toBeVisible()

    const cancelButton = within(addPatientDialog).getByText('Cancel')
    expect(cancelButton).toBeVisible()

    const invitePatientButton = within(addPatientDialog).getByRole('button', { name: 'Invite' })
    expect(invitePatientButton).toBeVisible()

    const emailInput = within(addPatientDialog).getByRole('textbox', { name: 'Email' })
    expect(emailInput).toBeVisible()
    await userEvent.type(emailInput, monitoredPatient.profile.email)

    const alreadyInTeamErrorMessage = within(addPatientDialog).getByText('This patient is already sharing data with the team.')
    expect(alreadyInTeamErrorMessage).toBeVisible()
    expect(invitePatientButton).toBeDisabled()

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, pendingPatient.profile.email)

    const pendingErrorMessage = within(addPatientDialog).getByText('This patient has already been invited and hasn\'t confirmed yet.')
    expect(pendingErrorMessage).toBeVisible()
    expect(invitePatientButton).toBeDisabled()

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'new-patient@email.com')

    expect(invitePatientButton).toBeEnabled()
  })

  it('should check that the team creation button is valid if all fields are complete', async () => {
    const createTeamMock = jest.spyOn(TeamAPI, 'createTeam').mockResolvedValue(undefined)
    await act(async () => {
      renderPage('/')
    })
    const teamMenu = screen.getByLabelText('Open team selection menu')
    await userEvent.click(teamMenu)
    await userEvent.click(screen.getByText('Create a new care team'))
    const dialogTeam = screen.getByRole('dialog')
    const createTeamButton = within(dialogTeam).getByRole('button', { name: 'Create team' })
    const nameInput = within(dialogTeam).getByRole('textbox', { name: 'Name' })
    const address1Input = within(dialogTeam).getByRole('textbox', { name: 'Address 1' })
    const address2Input = within(dialogTeam).getByRole('textbox', { name: 'Address 2' })
    const zipcodeInput = within(dialogTeam).getByRole('textbox', { name: 'Zipcode' })
    const cityInput = within(dialogTeam).getByRole('textbox', { name: 'City (State / Province)' })
    const phoneNumberInput = within(dialogTeam).getByRole('textbox', { name: 'Phone number' })
    const prefixPhoneNumber = within(dialogTeam).getByText('+33')
    const emailInput = within(dialogTeam).getByRole('textbox', { name: 'Email' })

    // Team creation button disabled and all fields empty
    expect(nameInput).toHaveTextContent('')
    expect(address1Input).toHaveTextContent('')
    expect(address2Input).toHaveTextContent('')
    expect(zipcodeInput).toHaveTextContent('')
    expect(cityInput).toHaveTextContent('')
    expect(phoneNumberInput).toHaveTextContent('')
    expect(emailInput).toHaveTextContent('')
    expect(dialogTeam).toBeInTheDocument()
    expect(prefixPhoneNumber).toHaveTextContent(PhonePrefixCode.FR)
    expect(createTeamButton).toBeDisabled()

    // Team dropdown with prefix phone number
    fireEvent.mouseDown(within(screen.getByTestId('team-edit-dialog-select-country')).getByRole('button'))
    fireEvent.click(screen.getByRole('option', { name: 'Austria' }))
    expect(prefixPhoneNumber).toHaveTextContent(PhonePrefixCode.AT)

    // Team creation button activated and all fields filled
    await userEvent.type(nameInput, lastName)
    await userEvent.type(address1Input, '5 rue')
    await userEvent.type(cityInput, 'Grenoble')
    await userEvent.type(phoneNumberInput, '0600000000')
    await userEvent.type(zipcodeInput, '38000')
    await userEvent.type(emailInput, 'toto@titi.com')
    expect(createTeamButton).not.toBeDisabled()

    // Team creation button disabled and a field in error with the error message
    await userEvent.clear(zipcodeInput)
    expect(createTeamButton).toBeDisabled()
    await userEvent.type(zipcodeInput, '75d')
    expect(within(dialogTeam).getByText('Please enter a valid zipcode')).toBeVisible()
    expect(createTeamButton).toBeDisabled()
    await userEvent.clear(zipcodeInput)
    await userEvent.type(zipcodeInput, '75800')
    expect(createTeamButton).not.toBeDisabled()

    await userEvent.clear(phoneNumberInput)
    expect(createTeamButton).toBeDisabled()
    await userEvent.type(phoneNumberInput, '060')
    expect(within(dialogTeam).getByText('Please enter a valid phone number')).toBeVisible()
    expect(createTeamButton).toBeDisabled()
    await userEvent.clear(phoneNumberInput)
    await userEvent.type(phoneNumberInput, '06000000')
    expect(createTeamButton).not.toBeDisabled()

    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'tototiti.com')
    expect(within(dialogTeam).getByText('Invalid email address (special characters are not allowed).')).toBeVisible()
    expect(createTeamButton).toBeDisabled()
    await userEvent.clear(emailInput)
    await userEvent.type(emailInput, 'toto@titi.com')
    expect(createTeamButton).not.toBeDisabled()

    await act(async () => {
      await userEvent.click(createTeamButton)
    })
    expect(createTeamMock).toHaveBeenCalledTimes(1)
  })
})
