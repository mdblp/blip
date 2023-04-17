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
import { loggedInUserId, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import {
  flaggedPatient,
  flaggedPatientId,
  hypoglycemiaPatient,
  monitoredPatient,
  monitoredPatientTwo,
  monitoredPatientWithMmol,
  noDataTransferredPatient,
  pendingPatient,
  timeSpentOutOfTargetRangePatient,
  unmonitoredPatient,
  unreadMessagesPatient
} from '../../data/patient.api.data'
import {
  buildAvailableTeams,
  buildFiltersTeam,
  buildPrivateTeam,
  buildTeamThree,
  filtersTeamId,
  filtersTeamName,
  mockTeamAPI,
  myFirstTeamName,
  myThirdTeamId,
  myThirdTeamName
} from '../../mock/team.api.mock'
import { checkHCPLayout } from '../../assert/layout'
import userEvent from '@testing-library/user-event'
import { PhonePrefixCode } from '../../../../lib/utils'
import { renderPage } from '../../utils/render'
import TeamAPI from '../../../../lib/team/team.api'
import { mockUserApi } from '../../mock/user.api.mock'
import {
  checkPatientsFilters,
  closeFiltersPresentation,
  defaultToggles,
  updatePatientsFilters
} from '../../assert/patient-filters'
import { mockPatientApiForHcp, mockPatientApiForPatients } from '../../mock/patient.api.mock'
import PatientApi from '../../../../lib/patient/patient.api'
import { mockDataAPI } from '../../mock/data.api.mock'
import { checkDataGridAfterSinglePatientFilter, checkPatientListHeader } from '../../assert/patient-list'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import DirectShareApi from '../../../../lib/share/direct-share.api'

describe('HCP home page', () => {
  const firstName = 'Eric'
  const lastName = 'Ard'
  const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
  const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)

  beforeEach(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, preferences: { patientsStarred: [flaggedPatientId] } })
    mockPatientApiForHcp()
    mockDirectShareApi()
    mockDataAPI()
  })

  it('should not display the Care team tab and not allow to add patients if the private practice is selected', async () => {
    localStorage.setItem('selectedTeamId', 'private')
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValueOnce([{
      ...monitoredPatient,
      teams: [{
        teamId: 'private',
        status: UserInvitationStatus.accepted
      }]
    }])

    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    await checkHCPLayout(`${firstName} ${lastName}`, {
      teamName: myFirstTeamName,
      isPrivate: true
    }, buildAvailableTeams())

    const patientListHeader = screen.getByTestId('patient-list-header')
    const addPatientButton = within(patientListHeader).getByText('Add new patient')
    expect(addPatientButton).toBeVisible()
    expect(addPatientButton).toBeDisabled()

    const addPatientHoverZone = within(patientListHeader).getByTestId('add-patient-button')
    await userEvent.hover(addPatientHoverZone)
    const informationTooltip = screen.getByText('To invite a patient, you must first select a care team from the dropdown menu. You can create you own care team if you need to. Alternatively, you can provide the patient with your YourLoops email address so they can enable private data sharing with you.')
    expect(informationTooltip).toBeVisible()

    await userEvent.unhover(addPatientHoverZone)
    expect(informationTooltip).not.toBeVisible()

    const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
    await userEvent.click(removeButton)
    const removeDialog = screen.getByRole('dialog')

    const dialogTitle = within(removeDialog).getByText(`Remove ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} from My private practice`)
    expect(dialogTitle).toBeVisible()
    const dialogQuestion = within(removeDialog).getByTestId('modal-remove-patient-question')
    expect(dialogQuestion).toHaveTextContent(`Are you sure you want to remove ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} from My private practice?`)
    const dialogInfo = within(removeDialog).getByText('You will no longer have access to their data.')
    expect(dialogInfo).toBeVisible()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })
    expect(confirmRemoveButton).toBeVisible()
    const cancelButton = within(removeDialog).getByText('Cancel')
    expect(cancelButton).toBeVisible()

    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })

    expect(removeDirectShareMock).toHaveBeenCalledWith(monitoredPatient.userid, loggedInUserId)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).not.toBeInTheDocument()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`Direct data sharing with ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} has been removed`)
  })

  it('should display a list of current patients and allow to remove one of them', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    await checkHCPLayout(`${firstName} ${lastName}`, { teamName: myThirdTeamName }, buildAvailableTeams())
    checkPatientListHeader()

    const dataGridCurrentRows = screen.getByTestId('patient-list-grid')
    expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(5)
    expect(dataGridCurrentRows).toHaveTextContent('PatientSystemTime spent out of the target rangeSevere hypoglycemiaData not transferredLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/ANo new messagesFlag patient monitored-patient2@diabeloop.frMonitored Patient 2DBLG110%20%30%N/ANo new messagesFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolDBLG110%20%30%N/ANo new messagesFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientDBLG110%20%30%N/ANo new messagesData calculated on the last 7 daysRows per page:101–4 of 4')

    const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatient.profile.email}` })
    expect(removeButton).toBeVisible()

    await userEvent.click(removeButton)

    const removeDialog = screen.getByRole('dialog')
    expect(removeDialog).toBeVisible()

    const title = within(removeDialog).getByText(`Remove ${unmonitoredPatient.profile.fullName} from ${myThirdTeamName}`)
    expect(title).toBeVisible()
    const question = within(removeDialog).getByTestId('modal-remove-patient-question')
    expect(question).toHaveTextContent(`Are you sure you want to remove ${unmonitoredPatient.profile.fullName} from ${myThirdTeamName}?`)
    const info = within(removeDialog).getByText('You and the care team will no longer have access to their data.')
    expect(info).toBeVisible()
    const alertInfo = within(removeDialog).getByText('If you want to remove the patient from another care team, you must first select the care team from the dropdown menu at the top right of YourLoops.')
    expect(alertInfo).toBeVisible()
    const cancelButton = within(removeDialog).getByText('Cancel')
    expect(cancelButton).toBeVisible()
    expect(cancelButton).toBeEnabled()
    const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValueOnce([monitoredPatient, monitoredPatientTwo, monitoredPatientWithMmol, pendingPatient])
    const teamId = unmonitoredPatient.teams[0].teamId
    await act(async () => {
      await userEvent.click(confirmRemoveButton)
    })
    expect(removePatientMock).toHaveBeenCalledWith(teamId, unmonitoredPatient.userid)
    expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(4)
    expect(screen.queryByTestId('remove-hcp-patient-dialog')).toBeFalsy()
    expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unmonitoredPatient.profile.firstName} ${unmonitoredPatient.profile.lastName} is no longer a member of ${myThirdTeamName}`)
  })

  it('should display a list of patients and allow to filter them', async () => {
    localStorage.setItem('selectedTeamId', filtersTeamId)
    const teams = [buildFiltersTeam(), buildTeamThree(), buildPrivateTeam()]
    jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue(teams)
    jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([monitoredPatient, unreadMessagesPatient, timeSpentOutOfTargetRangePatient, hypoglycemiaPatient, noDataTransferredPatient, flaggedPatient, pendingPatient, monitoredPatientTwo])
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    await checkHCPLayout(`${firstName} ${lastName}`, { teamName: filtersTeamName }, teams)
    checkPatientListHeader()

    expect(screen.queryByTestId('filters-label')).not.toBeInTheDocument()
    const dataGridRow = screen.getByTestId('patient-list-grid')
    expect(within(dataGridRow).getAllByRole('row')).toHaveLength(7)
    expect(dataGridRow).toHaveTextContent('PatientSystemTime spent out of the target rangeSevere hypoglycemiaData not transferredLast data updateActionsUnflag patient flagged@patient.frFlagged PatientDBLG110%20%30%N/ANo new messagesFlag patient hypoglycemia@patient.frHypoglycemia PatientDBLG110%20%30%N/ANo new messagesFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/ANo new messagesFlag patient no-data@patient.frNo Data PatientDBLG110%20%30%N/ANo new messagesFlag patient time-out-of-range@patient.frTime Out of Range PatientDBLG110%20%30%N/ANo new messagesFlag patient unread-messages@patient.frUnread Messages PatientDBLG110%20%30%N/AThe patient has sent you new messagesData calculated on the last 7 daysRows per page:101–6 of 6')

    // Check the default values
    const filtersButton = screen.getByRole('button', { name: 'Filters' })
    await userEvent.click(filtersButton)
    checkPatientsFilters()

    // Check the cancel button
    await closeFiltersPresentation()
    await userEvent.click(filtersButton)

    // check the manual flag toggle
    await updatePatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Unflag patient flagged@patient.frFlagged PatientDBLG110%20%30%N/ANo new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })

    // check the telemonitored toggle
    await updatePatientsFilters({
      ...defaultToggles,
      manualFlagFilterToggle: true,
      telemonitoredFilterToggle: true
    })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient monitored-patient@diabeloop.frMonitored PatientDBLG110%20%30%N/ANo new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, telemonitoredFilterToggle: true })

    // check the time spent out of target toggle
    await updatePatientsFilters({
      ...defaultToggles,
      telemonitoredFilterToggle: true,
      outOfRangeFilterToggle: true
    })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient time-out-of-range@patient.frTime Out of Range PatientDBLG110%20%30%N/ANo new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, outOfRangeFilterToggle: true })

    // check the hypoglycemia toggle
    await updatePatientsFilters({
      ...defaultToggles,
      outOfRangeFilterToggle: true,
      hypoglycemiaFilterToggle: true
    })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient hypoglycemia@patient.frHypoglycemia PatientDBLG110%20%30%N/ANo new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, hypoglycemiaFilterToggle: true })

    // check the no data toggle
    await updatePatientsFilters({
      ...defaultToggles,
      hypoglycemiaFilterToggle: true,
      dataNotTransferredFilterToggle: true
    })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient no-data@patient.frNo Data PatientDBLG110%20%30%N/ANo new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, dataNotTransferredFilterToggle: true })

    // check the no data toggle
    await updatePatientsFilters({
      ...defaultToggles,
      dataNotTransferredFilterToggle: true,
      unreadMessagesFilterToggle: true
    })
    checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient unread-messages@patient.frUnread Messages PatientDBLG110%20%30%N/AThe patient has sent you new messages')
    await userEvent.click(filtersButton)
    checkPatientsFilters({ ...defaultToggles, unreadMessagesFilterToggle: true })

    await closeFiltersPresentation()

    // Check the click on the pending tab
    const pendingTab = screen.getByRole('tab', { name: 'Pending' })
    await userEvent.click(pendingTab)

    const filtersButtonDisabled = screen.getByRole('button', { name: 'Filters' })
    expect(filtersButtonDisabled).toBeDisabled()
    expect(screen.getByTestId('filters-label')).toHaveTextContent('Pending filter activated: 1 patients')
    expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()

    expect(within(dataGridRow).getAllByRole('row')).toHaveLength(2)
    expect(dataGridRow).toHaveTextContent('PatientSystemTime spent out of the target rangeSevere hypoglycemiaData not transferredLast data updateActionsPending invitationPending PatientDBLG110%20%30%N/ANo new messagesData calculated on the last 7 daysRows per page:101–1 of 1')
  })

  it('should display a list of pending patient and not be able to click on it, then redirect to patient dashboard when clicking on a current patient', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    const currentTab = screen.getByRole('tab', { name: 'Current' })
    const pendingTab = screen.getByRole('tab', { name: 'Pending' })

    await userEvent.click(pendingTab)
    const dataGridPendingRows = screen.getByTestId('patient-list-grid')
    expect(within(dataGridPendingRows).getAllByRole('row')).toHaveLength(2)
    expect(dataGridPendingRows).toHaveTextContent('PatientSystemTime spent out of the target rangeSevere hypoglycemiaData not transferredLast data updateActionsPending invitationPending PatientDBLG110%20%30%N/ANo new messagesData calculated on the last 7 daysRows per page:101–1 of 1')

    await userEvent.click(within(dataGridPendingRows).getAllByRole('row')[1])
    expect(router.state.location.pathname).toEqual('/home')

    await userEvent.click(currentTab)
    const dataGridCurrentRows = screen.getByTestId('patient-list-grid')
    await userEvent.click(within(dataGridCurrentRows).getAllByRole('row')[1])
    expect(router.state.location.pathname).toEqual(`/patient/${monitoredPatient.userid}/dashboard`)
  })

  it('should display an error message if patient removal failed', async () => {
    localStorage.setItem('selectedTeamId', myThirdTeamId)
    mockPatientApiForPatients()
    jest.spyOn(PatientApi, 'removePatient').mockRejectedValueOnce(Error('error'))
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
    expect(removePatientMock).toHaveBeenCalledWith(myThirdTeamId, monitoredPatient.userid)
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

    const title = within(addPatientDialog).getByText('Invite a patient to A - MyThirdTeam - to be deleted')
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
    await userEvent.type(emailInput, 'invalid@emai.l')

    const invalidEmailErrorMessage = within(addPatientDialog).getByText('Invalid email address (special characters are not allowed).')
    expect(invalidEmailErrorMessage).toBeVisible()
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

  it('should display the right columns for hcp and be able to change them', async () => {
    const router = renderPage('/')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/home')
    })

    const columnSettingsButton = screen.getByTestId('column-settings-button')

    checkPatientListHeader()
    expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'System' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Time spent out of the target range' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Severe hypoglycemia' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Data not transferred' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

    await userEvent.click(columnSettingsButton)

    let columnSettingsPopover = screen.getByRole('presentation')
    const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

    await userEvent.click(cancelButton)
    expect(columnSettingsPopover).not.toBeVisible()

    await userEvent.click(columnSettingsButton)
    columnSettingsPopover = screen.getByRole('presentation')
    const applyButton = within(columnSettingsPopover).getByRole('button', { name: 'Apply' })
    expect(columnSettingsPopover).toBeVisible()
    expect(within(columnSettingsPopover).getByText('Show column')).toBeVisible()

    const patientToggle = within(within(columnSettingsPopover).getByLabelText('Patient')).getByRole('checkbox')
    const systemToggle = within(within(columnSettingsPopover).getByLabelText('System')).getByRole('checkbox')
    const outOfRangeToggle = within(within(columnSettingsPopover).getByLabelText('Time spent out of range')).getByRole('checkbox')
    const dataToggle = within(within(columnSettingsPopover).getByLabelText('Data not transferred')).getByRole('checkbox')
    const hypoToggle = within(within(columnSettingsPopover).getByLabelText('Severe hypoglycemia')).getByRole('checkbox')
    const lastUpdateToggle = within(within(columnSettingsPopover).getByLabelText('Last data update')).getByRole('checkbox')
    const messagesToggle = within(within(columnSettingsPopover).getByLabelText('Messages')).getByRole('checkbox')
    expect(patientToggle).toHaveProperty('checked', true)
    expect(patientToggle).toHaveProperty('disabled', true)
    expect(systemToggle).toHaveProperty('checked', true)
    expect(outOfRangeToggle).toHaveProperty('checked', true)
    expect(dataToggle).toHaveProperty('checked', true)
    expect(hypoToggle).toHaveProperty('checked', true)
    expect(lastUpdateToggle).toHaveProperty('checked', true)
    expect(messagesToggle).toHaveProperty('checked', true)

    const disabledToggle = screen.getByLabelText('This column cannot be removed')
    await userEvent.hover(disabledToggle)
    expect(await screen.findByText('This column cannot be removed'))

    await userEvent.click(systemToggle)
    await userEvent.click(outOfRangeToggle)
    await userEvent.click(dataToggle)
    await userEvent.click(hypoToggle)
    await userEvent.click(lastUpdateToggle)
    await userEvent.click(messagesToggle)
    expect(systemToggle).toHaveProperty('checked', false)
    expect(outOfRangeToggle).toHaveProperty('checked', false)
    expect(dataToggle).toHaveProperty('checked', false)
    expect(hypoToggle).toHaveProperty('checked', false)
    expect(lastUpdateToggle).toHaveProperty('checked', false)
    expect(messagesToggle).toHaveProperty('checked', false)

    await userEvent.click(applyButton)

    expect(columnSettingsPopover).not.toBeVisible()
    expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
    expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Time spent out of the target range' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Severe hypoglycemia' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Data not transferred' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
    expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()
  })
})
