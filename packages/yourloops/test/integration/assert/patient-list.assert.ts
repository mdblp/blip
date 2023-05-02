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

import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import { filtersTeamName, myThirdTeamId, myThirdTeamName } from '../mock/team.api.mock'
import PatientApi from '../../../lib/patient/patient.api'
import {
  checkPatientsFilters,
  closeFiltersPresentation,
  defaultToggles,
  updatePatientsFilters
} from './patient-filters.assert'
import { changeTeamScope } from './header.assert'
import { type createBrowserRouter } from 'react-router-dom'
import {
  monitoredPatient,
  monitoredPatientTwo,
  monitoredPatientWithMmol,
  unmonitoredPatient
} from '../data/patient.api.data'

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

export const checkPatientListHeaderForHcp = () => {
  const header = screen.getByTestId('patient-list-header')
  checkPatientListHeader(header)
  expect(within(header).getByRole('button', { name: 'Filters' })).toBeVisible()
  expect(within(header).getByRole('button', { name: 'Add new patient' })).toBeVisible()
  expect(screen.getByRole('tab', { name: 'Pending' })).toBeVisible()
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
  expect(dataGridRow).toHaveTextContent('PatientDate of birthMonitoring alertsMessagesLast data updateActionsUnflag patient flagged@patient.frFlagged PatientJan 1, 1980No new messagesN/AFlag patient hypoglycemia@patient.frHypoglycemia PatientJan 1, 1980No new messagesN/AFlag patient monitored-patient@diabeloop.frMonitored PatientJan 1, 1980No new messagesN/AFlag patient no-data@patient.frNo Data PatientJan 1, 1980No new messagesN/AFlag patient time-out-of-range@patient.frTime Out of Range PatientJan 1, 1980No new messagesN/AFlag patient unread-messages@patient.frUnread Messages PatientJan 1, 1980The patient has sent you new messagesN/AData calculated on the last 7 daysRows per page:101–6 of 6')

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
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Unflag patient flagged@patient.frFlagged PatientJan 1, 1980No new messagesN/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })

  // check the telemonitored toggle
  await updatePatientsFilters({
    ...defaultToggles,
    manualFlagFilterToggle: true,
    telemonitoredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient monitored-patient@diabeloop.frMonitored PatientJan 1, 1980No new messagesN/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, telemonitoredFilterToggle: true })

  // check the time spent out of target toggle
  await updatePatientsFilters({
    ...defaultToggles,
    telemonitoredFilterToggle: true,
    outOfRangeFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient time-out-of-range@patient.frTime Out of Range PatientJan 1, 1980No new messagesN/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, outOfRangeFilterToggle: true })

  // check the hypoglycemia toggle
  await updatePatientsFilters({
    ...defaultToggles,
    outOfRangeFilterToggle: true,
    hypoglycemiaFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient hypoglycemia@patient.frHypoglycemia PatientJan 1, 1980No new messagesN/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, hypoglycemiaFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    hypoglycemiaFilterToggle: true,
    dataNotTransferredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient no-data@patient.frNo Data PatientJan 1, 1980No new messagesN/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, dataNotTransferredFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    dataNotTransferredFilterToggle: true,
    unreadMessagesFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRow, 'Flag patient unread-messages@patient.frUnread Messages PatientJan 1, 1980The patient has sent you new messagesN/A')
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
  expect(columnSettingsPopover).toHaveTextContent('Show columnPatientAgeDate of birthGenderSystemMonitoring alertsMessagesLast data updateCancelApply')

  const disabledToggle = screen.getByLabelText('This column cannot be removed')
  await userEvent.hover(disabledToggle)
  expect(await screen.findByText('This column cannot be removed')).toBeVisible()

  const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('presentation')).not.toBeInTheDocument()
}

export const checkPatientListHideShowColumns = async () => {
  const dataGridCurrentRows = screen.getByTestId('patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(5)

  const columnSettingsButton = screen.getByTestId('column-settings-button')

  // Assert default columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Messages' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  expect(dataGridCurrentRows).toHaveTextContent('PatientDate of birthMonitoring alertsMessagesLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientJan 1, 1980No new messagesN/AFlag patient monitored-patient2@diabeloop.frMonitored Patient 2Jan 1, 1980No new messagesN/AFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolJan 1, 1980No new messagesN/AFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientJan 1, 1980No new messagesN/AData calculated on the last 7 daysRows per page:101–4 of 4')

  await userEvent.click(columnSettingsButton)

  const columnSettingsPopover = screen.getByRole('presentation')
  expect(columnSettingsPopover).toBeVisible()

  const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(columnSettingsPopover).not.toBeVisible()

  await userEvent.click(columnSettingsButton)
  const columnSettingsPopoverForHide = screen.getByRole('presentation')
  const applyButtonForHide = within(columnSettingsPopoverForHide).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopoverForHide).toBeVisible()

  const patientToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Patient')).getByRole('checkbox')
  const ageToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Messages')).getByRole('checkbox')
  const lastUpdateToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert default columns are checked
  expect(patientToggleForHide).toHaveProperty('checked', true)
  expect(patientToggleForHide).toBeDisabled()
  expect(ageToggleForHide).toHaveProperty('checked', false)
  expect(dateOfBirthToggleForHide).toHaveProperty('checked', true)
  expect(genderToggleForHide).toHaveProperty('checked', false)
  expect(systemToggleForHide).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForHide).toHaveProperty('checked', true)
  expect(messagesToggleForHide).toHaveProperty('checked', true)
  expect(lastUpdateToggleForHide).toHaveProperty('checked', true)

  // Hide all hideable columns
  await userEvent.click(dateOfBirthToggleForHide)
  await userEvent.click(monitoringAlertsToggleForHide)
  await userEvent.click(messagesToggleForHide)
  await userEvent.click(lastUpdateToggleForHide)
  expect(dateOfBirthToggleForHide).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForHide).toHaveProperty('checked', false)
  expect(messagesToggleForHide).toHaveProperty('checked', false)
  expect(lastUpdateToggleForHide).toHaveProperty('checked', false)

  await userEvent.click(applyButtonForHide)

  expect(columnSettingsPopoverForHide).not.toBeVisible()

  // Assert only mandatory columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Date of birth' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Monitoring alerts' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  expect(dataGridCurrentRows).toHaveTextContent('PatientActionsFlag patient monitored-patient@diabeloop.frMonitored PatientFlag patient monitored-patient2@diabeloop.frMonitored Patient 2Flag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientData calculated on the last 7 daysRows per page:101–4 of 4')

  await userEvent.click(columnSettingsButton)
  const columnSettingsPopoverForShow = screen.getByRole('presentation')
  const applyButtonForShow = within(columnSettingsPopoverForShow).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopoverForShow).toBeVisible()

  const patientToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Patient')).getByRole('checkbox')
  const ageToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Messages')).getByRole('checkbox')
  const lastUpdateToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert only mandatory columns are checked
  expect(patientToggleForShow).toHaveProperty('checked', true)
  expect(patientToggleForShow).toBeDisabled()
  expect(ageToggleForShow).toHaveProperty('checked', false)
  expect(dateOfBirthToggleForShow).toHaveProperty('checked', false)
  expect(genderToggleForShow).toHaveProperty('checked', false)
  expect(systemToggleForShow).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForShow).toHaveProperty('checked', false)
  expect(messagesToggleForShow).toHaveProperty('checked', false)
  expect(lastUpdateToggleForShow).toHaveProperty('checked', false)

  // Show all columns
  await userEvent.click(ageToggleForShow)
  await userEvent.click(dateOfBirthToggleForShow)
  await userEvent.click(genderToggleForShow)
  await userEvent.click(systemToggleForShow)
  await userEvent.click(monitoringAlertsToggleForShow)
  await userEvent.click(messagesToggleForShow)
  await userEvent.click(lastUpdateToggleForShow)
  expect(ageToggleForShow).toHaveProperty('checked', true)
  expect(dateOfBirthToggleForShow).toHaveProperty('checked', true)
  expect(genderToggleForShow).toHaveProperty('checked', true)
  expect(systemToggleForShow).toHaveProperty('checked', true)
  expect(monitoringAlertsToggleForShow).toHaveProperty('checked', true)
  expect(messagesToggleForShow).toHaveProperty('checked', true)
  expect(lastUpdateToggleForShow).toHaveProperty('checked', true)

  await userEvent.click(applyButtonForShow)

  expect(columnSettingsPopoverForShow).not.toBeVisible()

  // Assert all columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Age' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Gender' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'System' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Messages' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  expect(dataGridCurrentRows).toHaveTextContent('PatientAgeDate of birthGenderSystemMonitoring alertsMessagesLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored Patient43Jan 1, 1980MaleDBLG1No new messagesN/AFlag patient monitored-patient2@diabeloop.frMonitored Patient 243Jan 1, 1980MaleDBLG1No new messagesN/AFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmol43Jan 1, 1980FemaleDBLG1No new messagesN/AFlag patient unmonitored-patient@diabeloop.frUnmonitored Patient43Jan 1, 1980MaleDBLG1No new messagesN/AData calculated on the last 7 daysRows per page:101–4 of 4')

  await userEvent.click(columnSettingsButton)
  const columnSettingsPopoverForReset = screen.getByRole('presentation')
  const applyButtonForReset = within(columnSettingsPopoverForReset).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopoverForReset).toBeVisible()

  const patientToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Patient')).getByRole('checkbox')
  const ageToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Messages')).getByRole('checkbox')
  const lastUpdateToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert all columns are checked
  expect(patientToggleForReset).toHaveProperty('checked', true)
  expect(patientToggleForReset).toBeDisabled()
  expect(ageToggleForReset).toHaveProperty('checked', true)
  expect(dateOfBirthToggleForReset).toHaveProperty('checked', true)
  expect(genderToggleForReset).toHaveProperty('checked', true)
  expect(systemToggleForReset).toHaveProperty('checked', true)
  expect(monitoringAlertsToggleForReset).toHaveProperty('checked', true)
  expect(messagesToggleForReset).toHaveProperty('checked', true)
  expect(lastUpdateToggleForReset).toHaveProperty('checked', true)

  // Show only default columns
  await userEvent.click(ageToggleForReset)
  await userEvent.click(genderToggleForReset)
  await userEvent.click(systemToggleForReset)
  expect(ageToggleForReset).toHaveProperty('checked', false)
  expect(genderToggleForReset).toHaveProperty('checked', false)
  expect(systemToggleForReset).toHaveProperty('checked', false)

  await userEvent.click(applyButtonForReset)

  expect(columnSettingsPopoverForReset).not.toBeVisible()

  // Assert default columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Messages' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  expect(dataGridCurrentRows).toHaveTextContent('PatientDate of birthMonitoring alertsMessagesLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientJan 1, 1980No new messagesN/AFlag patient monitored-patient2@diabeloop.frMonitored Patient 2Jan 1, 1980No new messagesN/AFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolJan 1, 1980No new messagesN/AFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientJan 1, 1980No new messagesN/AData calculated on the last 7 daysRows per page:101–4 of 4')
}

export const checkPatientListTooltips = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('patient-list-grid')
  expect(dataGridRows).toHaveTextContent('PatientDate of birthMonitoring alertsMessagesLast data updateActionsFlag patient monitored-patient@diabeloop.frMonitored PatientJan 1, 1980No new messagesN/AFlag patient monitored-patient2@diabeloop.frMonitored Patient 2Jan 1, 1980No new messagesN/AFlag patient monitored-patient-mmol@diabeloop.frMonitored Patient mmolJan 1, 1980No new messagesN/AFlag patient unmonitored-patient@diabeloop.frUnmonitored PatientJan 1, 1980No new messagesN/AData calculated on the last 7 daysRows per page:101–4 of 4')
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

export const checkPatientListColumnSort = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('patient-list-grid')

  const patientColumnHeader = within(dataGridRows).getByRole('columnheader', { name: 'Patient' })
  const allRowsBeforeSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsBeforeSort[1]).toHaveTextContent(monitoredPatient.profile.fullName)
  expect(allRowsBeforeSort[2]).toHaveTextContent(monitoredPatientTwo.profile.fullName)
  expect(allRowsBeforeSort[3]).toHaveTextContent(monitoredPatientWithMmol.profile.fullName)
  expect(allRowsBeforeSort[4]).toHaveTextContent(unmonitoredPatient.profile.fullName)

  const sortButton = within(patientColumnHeader).getByRole('button', { hidden: true })
  await userEvent.click(sortButton)

  const allRowsAfterFirstSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsAfterFirstSort[1]).toHaveTextContent(unmonitoredPatient.profile.fullName)
  expect(allRowsAfterFirstSort[2]).toHaveTextContent(monitoredPatientWithMmol.profile.fullName)
  expect(allRowsAfterFirstSort[3]).toHaveTextContent(monitoredPatientTwo.profile.fullName)
  expect(allRowsAfterFirstSort[4]).toHaveTextContent(monitoredPatient.profile.fullName)

  await userEvent.click(sortButton)

  const allRowsAfterSecondSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsAfterSecondSort[1]).toHaveTextContent(monitoredPatient.profile.fullName)
  expect(allRowsAfterSecondSort[2]).toHaveTextContent(monitoredPatientTwo.profile.fullName)
  expect(allRowsAfterSecondSort[3]).toHaveTextContent(monitoredPatientWithMmol.profile.fullName)
  expect(allRowsAfterSecondSort[4]).toHaveTextContent(unmonitoredPatient.profile.fullName)
}

export const checkMonitoringAlertsIconsInactiveForFirstPatient = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('patient-list-grid')
  const disabledColorAsRgba = 'rgba(0, 0, 0, 0.26)'

  const firstRowTimeSpentOutOfRangeIcon = within(dataGridRows).getAllByTestId('time-spent-out-of-range-icon')[0]
  expect(firstRowTimeSpentOutOfRangeIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)

  const firstRowHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[0]
  expect(firstRowHypoglycemiaIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)

  const firstRowNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[0]
  expect(firstRowNoDataIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)
}
