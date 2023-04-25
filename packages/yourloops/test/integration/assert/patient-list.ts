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

import { act, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { monitoredPatient, pendingPatient, unmonitoredPatient } from '../data/patient.api.data'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import DirectShareApi from '../../../lib/share/direct-share.api'
import { filtersTeamName, myThirdTeamId, myThirdTeamName } from '../mock/team.api.mock'
import PatientApi from '../../../lib/patient/patient.api'
import {
  checkPatientsFilters,
  closeFiltersPresentation,
  defaultToggles,
  updatePatientsFilters
} from './patient-filters'
import { changeTeamScope } from './header'
import { type createBrowserRouter } from 'react-router-dom'

export type Router = ReturnType<typeof createBrowserRouter>

export const checkDataGridAfterSinglePatientFilter = (dataGridRow: HTMLElement, rowContent: string): void => {
  expect(screen.getByTestId('filters-label')).toHaveTextContent('Filters activated: 1 patient(s) out of 6')
  expect(screen.getByTestId('reset-filters-link')).toHaveTextContent('Reset')
  const allRows = within(dataGridRow).getAllByRole('row')
  expect(allRows).toHaveLength(2)
  expect(allRows[1]).toHaveTextContent(rowContent)
}

const checkPatientListHeader = (header: HTMLElement) => {
  expect(header).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Search for a patient...')).toBeVisible()
  expect(within(header).getByLabelText('Search by first name, last name or birthdate (dd/mm/yyyy)')).toBeVisible()
  expect(within(header).getByTestId('column-settings-button')).toBeVisible()
  expect(screen.getByTestId('patient-list-grid')).toBeVisible()
  expect(screen.getByText('Data calculated on the last 7 days')).toBeVisible()
  expect(screen.getByRole('tab', { name: 'Current' })).toBeVisible()
}

export const checkPatientListHeaderCaregiver = () => {
  const header = screen.getByTestId('patient-list-header')
  checkPatientListHeader(header)
  expect(within(header).queryByRole('button', { name: 'Filters' })).not.toBeInTheDocument()
  expect(screen.queryByTestId('filters-label')).not.toBeInTheDocument()
  expect(within(header).queryByRole('button', { name: 'Add new patient' })).not.toBeInTheDocument()
  expect(screen.queryByRole('tab', { name: 'Pending' })).not.toBeInTheDocument()
}

export const checkPatientListContentHcp = () => {
  const dataGridCurrentRows = screen.getByTestId('patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(5)
  expect(dataGridCurrentRows).toHaveTextContent('PatientMonitoring alertsSystemLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG1N/ANo new messagesFlag patient monitored-patient2@diabeloop.frMonitored Patient 2DBLG1N/ANo new messagesFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolDBLG1N/ANo new messagesFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientDBLG1N/ANo new messagesData calculated on the last 7 daysRows per page:101–4 of 4')
}

export const checkAddPatientPrivateButtonTooltip = async () => {
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
}

export const checkPatientListHeaderForHcp = () => {
  const header = screen.getByTestId('patient-list-header')
  checkPatientListHeader(header)
  expect(within(header).getByRole('button', { name: 'Filters' })).toBeVisible()
  expect(within(header).getByRole('button', { name: 'Add new patient' })).toBeVisible()
  expect(screen.getByRole('tab', { name: 'Pending' })).toBeVisible()
}

export const checkRemovePatientPrivateDialogContent = async () => {
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
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkAddPatientMedicalTeamDialogContent = async () => {
  const patientListHeader = screen.getByTestId('patient-list-header')
  const addPatientButton = within(patientListHeader).getByText('Add new patient')
  expect(addPatientButton).toBeVisible()

  await userEvent.click(addPatientButton)

  const addPatientDialog = screen.getByRole('dialog')
  expect(addPatientDialog).toBeVisible()
  expect(addPatientDialog).toHaveTextContent('Invite a patient to A - MyThirdTeam - to be deletedTo invite a patient to share their data with another care team, you must first select the care team in the dropdown menu at the top right of YourLoops.')
  expect(addPatientDialog).toHaveTextContent('Email *Email *By inviting this patient to share their data with me and their care team, I declare under my professional responsibility that I am part of this patient’s care team and, as such, have the right to access the patient’s personal data according to the applicable regulations.')
  expect(addPatientDialog).toHaveTextContent('Read our Terms of use and Privacy Policy.CancelInvite')

  const termsOfUseLink = within(addPatientDialog).getByRole('link', { name: 'Terms of use' })
  expect(termsOfUseLink).toBeVisible()

  const privacyPolicyLink = within(addPatientDialog).getByRole('link', { name: 'Privacy Policy' })
  expect(privacyPolicyLink).toBeVisible()

  const cancelButton = within(addPatientDialog).getByText('Cancel')
  expect(cancelButton).toBeVisible()

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkAddPatientMedicalTeamDialogInvite = async () => {
  jest.spyOn(PatientApi, 'invitePatient').mockResolvedValue(null)
  const patientListHeader = screen.getByTestId('patient-list-header')
  const addPatientButton = within(patientListHeader).getByText('Add new patient')
  expect(addPatientButton).toBeVisible()

  await userEvent.click(addPatientButton)

  const addPatientDialog = screen.getByRole('dialog')

  const invitePatientButton = within(addPatientDialog).getByRole('button', { name: 'Invite' })
  expect(invitePatientButton).toBeVisible()
  expect(invitePatientButton).toBeDisabled()

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

  await userEvent.click(invitePatientButton)

  expect(PatientApi.invitePatient).toHaveBeenCalledWith({ teamId: myThirdTeamId, email: 'new-patient@email.com' })
  const identificationCodeDialog = screen.getByRole('dialog')
  expect(identificationCodeDialog).toHaveTextContent('A - MyThirdTeam - to be deletedCommunicate this identification code to your patient during a consultation so they can verify your identity.')
  expect(identificationCodeDialog).toHaveTextContent('This identification code is always available in the team information on the "My teams" page.263 - 381 - 988Ok')

  const okButton = within(identificationCodeDialog).getByRole('button', { name: 'Ok' })

  await userEvent.click(okButton)

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientMedicalTeamDialogContent = async () => {
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
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientMedicalTeamConfirm = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${unmonitoredPatient.profile.email}` })
  expect(removeButton).toBeVisible()

  await userEvent.click(removeButton)

  expect(screen.queryByRole('dialog')).toBeVisible()
  const removeDialog = screen.getByRole('dialog')
  expect(removeDialog).toBeVisible()
  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

  await userEvent.click(confirmRemoveButton)

  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, unmonitoredPatient.userid)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`${unmonitoredPatient.profile.firstName} ${unmonitoredPatient.profile.lastName} is no longer a member of ${myThirdTeamName}`)
}

export const checkRemovePatientMedicalTeamError = async () => {
  jest.spyOn(PatientApi, 'removePatient').mockRejectedValueOnce(Error('Remove patient error: This error was thrown by a mock on purpose'))
  const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
  await userEvent.click(removeButton)
  const removeDialog = screen.getByRole('dialog')
  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })

  await act(async () => {
    await userEvent.click(confirmRemoveButton)
  })
  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, monitoredPatient.userid)
  expect(screen.getByRole('dialog')).toBeVisible()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('Impossible to remove patient. Please try again later.')
  const cancelButton = within(removeDialog).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkRemovePatientPrivateConfirm = async () => {
  const removeButton = screen.getByRole('button', { name: `Remove patient ${monitoredPatient.profile.email}` })
  await userEvent.click(removeButton)
  const removeDialog = screen.getByRole('dialog')

  const confirmRemoveButton = within(removeDialog).getByRole('button', { name: 'Remove patient' })
  expect(confirmRemoveButton).toBeVisible()

  await userEvent.click(confirmRemoveButton)

  expect(DirectShareApi.removeDirectShare).toHaveBeenCalledWith(monitoredPatient.userid, loggedInUserId)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent(`Direct data sharing with ${monitoredPatient.profile.firstName} ${monitoredPatient.profile.lastName} has been removed`)
}

export const checkPatientListPendingTab = async (router: Router) => {
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)
  const dataGridPendingRows = screen.getByTestId('patient-list-grid')
  expect(within(dataGridPendingRows).getAllByRole('row')).toHaveLength(2)
  expect(dataGridPendingRows).toHaveTextContent('PatientActionsPending invitationpending-patient@diabeloop.frData calculated on the last 7 daysRows per page:101–1 of 1')

  await userEvent.click(within(dataGridPendingRows).getAllByRole('row')[1])
  expect(router.state.location.pathname).toEqual('/home')
}

export const checkPatientListCurrentTab = async () => {
  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
  const dataGridCurrentRows = screen.getByTestId('patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(5)
}

export const checkPatientListFilters = async () => {
  await changeTeamScope(myThirdTeamName, filtersTeamName)

  expect(screen.getByTestId('filters-label')).toHaveTextContent('Filters deactivated: 6 patient(s) out of 6')
  expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()
  const dataGridRow = screen.getByTestId('patient-list-grid')
  expect(within(dataGridRow).getAllByRole('row')).toHaveLength(7)
  expect(dataGridRow).toHaveTextContent('PatientMonitoring alertsSystemLast data updateActionsUnflag patient flagged@patient.frFlagged PatientDBLG1N/ANo new messagesFlag patient hypoglycemia@patient.frHypoglycemia PatientDBLG1N/ANo new messagesFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG1N/ANo new messagesFlag patient no-data@patient.frNo Data PatientDBLG1N/ANo new messagesFlag patient time-out-of-range@patient.frTime Out of Range PatientDBLG1N/ANo new messagesFlag patient unread-messages@patient.frUnread Messages PatientDBLG1N/AThe patient has sent you new messagesData calculated on the last 7 daysRows per page:101–6 of 6')

  // Check the default values
  const filtersButton = screen.getByRole('button', { name: 'Filters' })
  await userEvent.click(filtersButton)
  checkPatientsFilters()

  // Check the cancel button
  await closeFiltersPresentation()
  await userEvent.click(filtersButton)

  // check the manual flag toggle
  await updatePatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })
  expect(screen.getByTestId('filters-label')).toHaveTextContent('Filters activated: 1 patient(s) out of 6')
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Unflag patient flagged@patient.frFlagged PatientDBLG1N/ANo new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })

  // check the telemonitored toggle
  await updatePatientsFilters({
    ...defaultToggles,
    manualFlagFilterToggle: true,
    telemonitoredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient monitored-patient@diabeloop.frMonitored PatientDBLG1N/ANo new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, telemonitoredFilterToggle: true })

  // check the time spent out of target toggle
  await updatePatientsFilters({
    ...defaultToggles,
    telemonitoredFilterToggle: true,
    outOfRangeFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient time-out-of-range@patient.frTime Out of Range PatientDBLG1N/ANo new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, outOfRangeFilterToggle: true })

  // check the hypoglycemia toggle
  await updatePatientsFilters({
    ...defaultToggles,
    outOfRangeFilterToggle: true,
    hypoglycemiaFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient hypoglycemia@patient.frHypoglycemia PatientDBLG1N/ANo new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, hypoglycemiaFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    hypoglycemiaFilterToggle: true,
    dataNotTransferredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient no-data@patient.frNo Data PatientDBLG1N/ANo new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, dataNotTransferredFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    dataNotTransferredFilterToggle: true,
    unreadMessagesFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient unread-messages@patient.frUnread Messages PatientDBLG1N/AThe patient has sent you new messages')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, unreadMessagesFilterToggle: true })

  await closeFiltersPresentation()

  // Check the click on the pending tab
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)

  const filtersButtonDisabled = screen.getByRole('button', { name: 'Filters' })
  expect(filtersButtonDisabled).toBeDisabled()
  expect(screen.getByTestId('filters-label')).toHaveTextContent('1 pending patient(s)')
  expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()

  expect(within(dataGridRow).getAllByRole('row')).toHaveLength(2)
  expect(dataGridRow).toHaveTextContent('PatientActionsPending invitationpending-patient@diabeloop.frData calculated on the last 7 daysRows per page:101–1 of 1')

  await changeTeamScope(filtersTeamName, myThirdTeamName)
  expect(PatientApi.getPatientsForHcp).toHaveBeenCalledWith(loggedInUserId, myThirdTeamId)

  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)

  // Reset the filters
  await userEvent.click(filtersButton)
  await updatePatientsFilters({
    ...defaultToggles,
    unreadMessagesFilterToggle: true
  })
  expect(within(dataGridRow).getAllByRole('row')).toHaveLength(5)
}

export const checkPatientColumnsFiltersContent = async () => {
  const columnSettingsButton = screen.getByTestId('column-settings-button')

  await userEvent.click(columnSettingsButton)

  const columnSettingsPopover = screen.getByRole('presentation')
  expect(columnSettingsPopover).toHaveTextContent('Show columnPatientMonitoring alertsSystemLast data updateMessagesCancelApply')

  const disabledToggle = screen.getByLabelText('This column cannot be removed')
  await userEvent.hover(disabledToggle)
  expect(await screen.findByText('This column cannot be removed')).toBeVisible()

  const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
}

export const checkPatientColumnsFiltersHideColumns = async () => {
  const columnSettingsButton = screen.getByTestId('column-settings-button')

  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'System' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  await userEvent.click(columnSettingsButton)

  let columnSettingsPopover = screen.getByRole('presentation')
  expect(columnSettingsPopover).toBeVisible()

  const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(columnSettingsPopover).not.toBeVisible()

  await userEvent.click(columnSettingsButton)
  columnSettingsPopover = screen.getByRole('presentation')
  const applyButton = within(columnSettingsPopover).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopover).toBeVisible()

  const patientToggle = within(within(columnSettingsPopover).getByLabelText('Patient')).getByRole('checkbox')
  const monitoringAlertsToggle = within(within(columnSettingsPopover).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggle = within(within(columnSettingsPopover).getByLabelText('System')).getByRole('checkbox')
  const lastUpdateToggle = within(within(columnSettingsPopover).getByLabelText('Last data update')).getByRole('checkbox')
  const messagesToggle = within(within(columnSettingsPopover).getByLabelText('Messages')).getByRole('checkbox')

  expect(patientToggle).toHaveProperty('checked', true)
  expect(patientToggle).toHaveProperty('disabled', true)
  expect(systemToggle).toHaveProperty('checked', true)
  expect(monitoringAlertsToggle).toHaveProperty('checked', true)
  expect(lastUpdateToggle).toHaveProperty('checked', true)
  expect(messagesToggle).toHaveProperty('checked', true)

  await userEvent.click(systemToggle)
  await userEvent.click(monitoringAlertsToggle)
  await userEvent.click(lastUpdateToggle)
  await userEvent.click(messagesToggle)
  expect(systemToggle).toHaveProperty('checked', false)
  expect(monitoringAlertsToggle).toHaveProperty('checked', false)
  expect(lastUpdateToggle).toHaveProperty('checked', false)
  expect(messagesToggle).toHaveProperty('checked', false)

  await userEvent.click(applyButton)

  expect(columnSettingsPopover).not.toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Monitoring alerts' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()
}

export const checkPatientColumnsFiltersShowColumns = async () => {
  const columnSettingsButton = screen.getByTestId('column-settings-button')

  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Monitoring alerts' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  await userEvent.click(columnSettingsButton)

  const columnSettingsPopover = screen.getByRole('presentation')
  expect(columnSettingsPopover).toBeVisible()

  const patientToggle = within(within(columnSettingsPopover).getByLabelText('Patient')).getByRole('checkbox')
  const monitoringAlertsToggle = within(within(columnSettingsPopover).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggle = within(within(columnSettingsPopover).getByLabelText('System')).getByRole('checkbox')
  const lastUpdateToggle = within(within(columnSettingsPopover).getByLabelText('Last data update')).getByRole('checkbox')
  const messagesToggle = within(within(columnSettingsPopover).getByLabelText('Messages')).getByRole('checkbox')

  expect(patientToggle).toHaveProperty('checked', true)
  expect(patientToggle).toHaveProperty('disabled', true)
  expect(systemToggle).toHaveProperty('checked', false)
  expect(monitoringAlertsToggle).toHaveProperty('checked', false)
  expect(lastUpdateToggle).toHaveProperty('checked', false)
  expect(messagesToggle).toHaveProperty('checked', false)

  await userEvent.click(systemToggle)
  await userEvent.click(monitoringAlertsToggle)
  await userEvent.click(lastUpdateToggle)
  await userEvent.click(messagesToggle)
  expect(systemToggle).toHaveProperty('checked', true)
  expect(monitoringAlertsToggle).toHaveProperty('checked', true)
  expect(lastUpdateToggle).toHaveProperty('checked', true)
  expect(messagesToggle).toHaveProperty('checked', true)

  const applyButton = within(columnSettingsPopover).getByRole('button', { name: 'Apply' })
  await userEvent.click(applyButton)

  expect(screen.queryByRole('presentation')).not.toBeInTheDocument()

  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'System' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()
}

export const checkPatientListTooltips = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('patient-list-grid')
  expect(dataGridRows).toHaveTextContent('PatientMonitoring alertsSystemLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientDBLG1N/ANo new messagesFlag patient monitored-patient2@diabeloop.frMonitored Patient 2DBLG1N/ANo new messagesFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolDBLG1N/ANo new messagesFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientDBLG1N/ANo new messagesData calculated on the last 7 daysRows per page:101–4 of 4')
  const monitoringAlertsColumnHeader = within(dataGridRows).getByText('Monitoring alerts')
  const tooltipText = 'Hover over the icons to learn more'
  expect(screen.queryByText(tooltipText)).not.toBeInTheDocument()
  await userEvent.hover(monitoringAlertsColumnHeader)
  expect(await screen.findByText(tooltipText)).toBeVisible()
  await userEvent.unhover(monitoringAlertsColumnHeader)
  expect(screen.queryByText(tooltipText)).not.toBeVisible()
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowTimeSpentOutOfRangeIcon = within(dataGridRows).getAllByTestId('time-spent-out-of-range-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowTimeSpentOutOfRangeIcon)
  const timeSpentOutOfRangeTooltip = await screen.findByRole('tooltip')
  expect(timeSpentOutOfRangeTooltip).toBeVisible()
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('By default, this alert threshold is set to:')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('>25% time spent away from target over the given period.')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowTimeSpentOutOfRangeIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowHypoglycemiaIcon)
  const hypoglycemiaTooltip = await screen.findByRole('tooltip')
  expect(hypoglycemiaTooltip).toBeVisible()
  expect(hypoglycemiaTooltip).toHaveTextContent('By default, this alert threshold is set to: >5% of severe hypoglycemia over the given period. This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowHypoglycemiaIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowNoDataIcon)
  const noDataTooltip = await screen.findByRole('tooltip')
  expect(noDataTooltip).toBeVisible()
  expect(noDataTooltip).toHaveTextContent('By default, this alert threshold is set to: >50% of non transmission data over the given period. This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowNoDataIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowMessageIcon = within(dataGridRows).getAllByTestId('message-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowMessageIcon)
  const messageTooltip = await screen.findByRole('tooltip')
  expect(messageTooltip).toBeVisible()
  expect(messageTooltip).toHaveTextContent('No new messages')
  await userEvent.unhover(firstRowMessageIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
}
