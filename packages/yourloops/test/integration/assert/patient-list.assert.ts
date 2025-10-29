/*
 * Copyright (c) 2023-2024, Diabeloop
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
import { filtersTeamId, filtersTeamName, myThirdTeamId, myThirdTeamName } from '../mock/team.api.mock'
import PatientApi from '../../../lib/patient/patient.api'
import {
  checkPatientsFilters,
  closeFiltersPresentation,
  defaultToggles,
  updatePatientsFilters
} from './patient-filters.assert'
import { changeTeamScope } from './header.assert'
import {
  hypoglycemiaPatientMetrics,
  noDataTransferredPatientInfo,
  patient1Info,
  patient2Info,
  patient3Info,
  patientWithMmolInfo,
  pendingPatient
} from '../data/patient.api.data'
import NotificationApi from '../../../lib/notifications/notification.api'
import { type Router } from '../models/router.model'
import moment from 'moment-timezone'

const SVG_ICON_DISABLED_CLASS = 'MuiSvgIcon-colorDisabled'
const SVG_ICON_FILL = 'currentColor'

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
  expect(within(header).getByRole('button', { name: 'Change columns settings' })).toBeVisible()
  expect(screen.getByTestId('current-patient-list-grid')).toBeVisible()
  expect(screen.getByText('Data calculated on the last 14 days (current day excluded). The values correspond to the average of the daily values.')).toBeVisible()
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

export const checkPatientListHeaderForHcp = async () => {
  const header = await screen.findByTestId('patient-list-header')
  checkPatientListHeader(header)
  expect(within(header).getByRole('button', { name: 'Filters' })).toBeVisible()
  expect(within(header).getByRole('button', { name: 'Add new patient' })).toBeVisible()
  expect(screen.getByRole('tab', { name: 'Pending' })).toBeVisible()
}

export const checkPatientListPendingTab = async (router: Router) => {
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)
  const dataGridPendingRows = screen.getByTestId('pending-patient-list-grid')
  expect(within(dataGridPendingRows).getAllByRole('row')).toHaveLength(2)
  expect(dataGridPendingRows).toHaveTextContent('Invite sent byDateEmailActionsBlanc YannMay 17, 2023pending-patient@diabeloop.frResend inviteCancel')

  await userEvent.click(within(dataGridPendingRows).getAllByRole('row')[1])
  expect(router.state.location.pathname).toEqual(`/teams/${myThirdTeamId}/patients`)
}

export const checkPatientListCurrentTab = async () => {
  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
  const dataGridCurrentRows = screen.getByTestId('current-patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(6)
  expect(dataGridCurrentRows).toHaveTextContent('PatientProfileDate of birthMonitoring alertsMessagesTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient-mmol@diabeloop.frPerotto PatientMmolType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient2@diabeloop.frRouis Patient2Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient3@diabeloop.frSrairi Patient3Type 1Jan 1, 1980No new messages from the patient0%0%N/A')
}

export const checkPatientListCurrentTabForPrivateTeam = async () => {
  const currentTab = await screen.findByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
  const dataGridCurrentRows = screen.getByTestId('current-patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(2)
  expect(dataGridCurrentRows).toHaveTextContent('PatientProfileDate of birthTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 19800%0%N/A')
}

export const checkPatientListFilters = async () => {
  await changeTeamScope(myThirdTeamName, filtersTeamName)
  expect(PatientApi.getPatientsForHcp).toHaveBeenCalledWith(loggedInUserId, filtersTeamId)

  expect(screen.getByTestId('filters-label')).toHaveTextContent('Filters deactivated: 6 patient(s) out of 6')
  expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()
  const dataGridRowCurrent = screen.getByTestId('current-patient-list-grid')
  expect(within(dataGridRowCurrent).getAllByRole('row')).toHaveLength(7)

  const lastDataUploadDate = moment.tz(hypoglycemiaPatientMetrics.medicalData.range.endDate, new Intl.DateTimeFormat().resolvedOptions().timeZone).format('lll')
  expect(dataGridRowCurrent).toHaveTextContent(`PatientProfileDate of birthMonitoring alertsMessagesTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient unread-messages@patient.frMessages Patient UnreadType 1Jan 1, 1980The patient has sent you new messages0%0%N/AFlag patient time-out-of-range@patient.frOut of Range Patient TimeType 1Jan 1, 1980No new messages from the patient0%0%N/AUnflag patient flagged@patient.frPatient FlaggedType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient hypoglycemia@patient.frPatient HypoglycemiaType 1Jan 1, 1980No new messages from the patient0%0%Jan 1, 2023 9:44 AMFlag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/AData calculated on the last 14 days (current day excluded). The values correspond to the average of the daily values.Rows per page:101–6 of 6`)

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
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent, 'Unflag patient flagged@patient.frPatient FlaggedType 1Jan 1, 1980No new messages from the patient0%0%N/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, manualFlagFilterToggle: true })

  // check the time spent out of target toggle
  await updatePatientsFilters({
    ...defaultToggles,
    manualFlagFilterToggle: true,
    outOfRangeFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent, 'Flag patient time-out-of-range@patient.frOut of Range Patient TimeType 1Jan 1, 1980No new messages from the patient0%0%N/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, outOfRangeFilterToggle: true })

  // check the hypoglycemia toggle
  await updatePatientsFilters({
    ...defaultToggles,
    outOfRangeFilterToggle: true,
    hypoglycemiaFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent, `Flag patient hypoglycemia@patient.frPatient HypoglycemiaType 1Jan 1, 1980No new messages from the patient0%0%${lastDataUploadDate}`)
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, hypoglycemiaFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    hypoglycemiaFilterToggle: true,
    dataNotTransferredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent, 'Flag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, dataNotTransferredFilterToggle: true })

  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    dataNotTransferredFilterToggle: true,
    unreadMessagesFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent, 'Flag patient unread-messages@patient.frMessages Patient UnreadType 1Jan 1, 1980The patient has sent you new messages0%0%N/A')
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, unreadMessagesFilterToggle: true })

  await closeFiltersPresentation()

  // Check the click on the pending tab
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)

  const filtersButtonDisabled = screen.getByRole('button', { name: 'Filters' })
  expect(filtersButtonDisabled).toBeDisabled()
  expect(screen.getByTestId('filters-label')).toHaveTextContent('1 pending patient(s)')

  const dataGridRowPending = screen.getByTestId('pending-patient-list-grid')
  expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()

  expect(within(dataGridRowPending).getAllByRole('row')).toHaveLength(2)
  expect(dataGridRowPending).toHaveTextContent('Invite sent byDateEmailActions')
  expect(dataGridRowPending).toHaveTextContent('N/AN/Apending-patient@diabeloop.fr')
  expect(dataGridRowPending).toHaveTextContent('Rows per page:101–1 of 1')
  expect(within(dataGridRowPending).queryByRole('button', { name: 'Resend invite' })).not.toBeInTheDocument()
  expect(within(dataGridRowPending).queryByRole('button', { name: 'Cancel' })).not.toBeInTheDocument()

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

  expect(within(screen.getByTestId('current-patient-list-grid')).getAllByRole('row')).toHaveLength(6)
}

export const checkPendingPatientColumnsSettingsMedicalTeam = async () => {
  // We go to the pending tab
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)

  // Check that the buttons are disabled
  const columnSettingsButton = screen.getByRole('button', { name: 'Change columns settings' })
  expect(columnSettingsButton).toBeDisabled()

  // We go back to the current tab
  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
}

export const checkPatientColumnsFiltersContent = async () => {
  const columnSettingsButton = screen.getByRole('button', { name: 'Change columns settings' })

  await userEvent.click(columnSettingsButton)

  const columnSettingsPopover = screen.getByRole('presentation')
  expect(columnSettingsPopover).toHaveTextContent('Show columnPatientProfileAgeDate of birthGenderSystemMonitoring alertsMessagesTIRGMI (estimated HbA1c)Below rangeCVLast data updateCancelApply')

  const disabledToggle = screen.getByLabelText('This column cannot be removed')
  await userEvent.hover(disabledToggle)
  expect(await screen.findByText('This column cannot be removed')).toBeVisible()

  const cancelButton = within(columnSettingsPopover).getByRole('button', { name: 'Cancel' })

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('presentation', { name: 'Show columns' })).not.toBeInTheDocument()
}

export const checkPatientListHideShowColumns = async () => {
  const dataGridCurrentRows = screen.getByTestId('current-patient-list-grid')
  expect(within(dataGridCurrentRows).getAllByRole('row')).toHaveLength(6)

  const columnSettingsButton = screen.getByRole('button', { name: 'Change columns settings' })

  // Assert default columns are displayed
  checkDefaultColumnsDisplay()

  expect(dataGridCurrentRows).toHaveTextContent('PatientProfileDate of birthMonitoring alertsMessagesTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient-mmol@diabeloop.frPerotto PatientMmolType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient2@diabeloop.frRouis Patient2Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient3@diabeloop.frSrairi Patient3Type 1Jan 1, 1980No new messages from the patient0%0%N/A')

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
  const patientProfileToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Profile')).getByRole('checkbox')
  const ageToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Messages')).getByRole('checkbox')
  const tirToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('TIR')).getByRole('checkbox')
  const hypoglycemiaToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Below range')).getByRole('checkbox')
  const lastUpdateToggleForHide = within(within(columnSettingsPopoverForHide).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert default columns are checked
  expect(patientToggleForHide).toHaveProperty('checked', true)
  expect(patientToggleForHide).toBeDisabled()
  expect(patientProfileToggleForHide).toHaveProperty('checked', true)
  expect(ageToggleForHide).toHaveProperty('checked', false)
  expect(dateOfBirthToggleForHide).toHaveProperty('checked', true)
  expect(genderToggleForHide).toHaveProperty('checked', false)
  expect(systemToggleForHide).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForHide).toHaveProperty('checked', true)
  expect(messagesToggleForHide).toHaveProperty('checked', true)
  expect(tirToggleForHide).toHaveProperty('checked', true)
  expect(hypoglycemiaToggleForHide).toHaveProperty('checked', true)
  expect(lastUpdateToggleForHide).toHaveProperty('checked', true)

  // Hide all hideable columns
  await userEvent.click(patientProfileToggleForHide)
  await userEvent.click(dateOfBirthToggleForHide)
  await userEvent.click(monitoringAlertsToggleForHide)
  await userEvent.click(messagesToggleForHide)
  await userEvent.click(tirToggleForHide)
  await userEvent.click(hypoglycemiaToggleForHide)
  await userEvent.click(lastUpdateToggleForHide)
  expect(patientProfileToggleForHide).toHaveProperty('checked', false)
  expect(dateOfBirthToggleForHide).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForHide).toHaveProperty('checked', false)
  expect(messagesToggleForHide).toHaveProperty('checked', false)
  expect(tirToggleForHide).toHaveProperty('checked', false)
  expect(hypoglycemiaToggleForHide).toHaveProperty('checked', false)
  expect(lastUpdateToggleForHide).toHaveProperty('checked', false)

  await userEvent.click(applyButtonForHide)

  expect(columnSettingsPopoverForHide).not.toBeVisible()

  // Assert only mandatory columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Profile' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Date of birth' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Monitoring alerts' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Time In Range' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'GMI (estimated HbA1c of last 14 days)' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Below range' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Coefficient of Variation' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  expect(dataGridCurrentRows).toHaveTextContent('PatientActionsFlag patient patient1@diabeloop.frGroby Patient1Flag patient z-no-data@patient.frPatient Z - No DataFlag patient patient-mmol@diabeloop.frPerotto PatientMmolFlag patient patient2@diabeloop.frRouis Patient2Flag patient patient3@diabeloop.frSrairi Patient3')

  await userEvent.click(columnSettingsButton)
  const columnSettingsPopoverForShow = screen.getByRole('presentation')
  const applyButtonForShow = within(columnSettingsPopoverForShow).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopoverForShow).toBeVisible()

  const patientToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Patient')).getByRole('checkbox')
  const patientProfileForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Profile')).getByRole('checkbox')
  const ageToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Messages')).getByRole('checkbox')
  const tirToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('TIR')).getByRole('checkbox')
  const gmiToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('GMI (estimated HbA1c)')).getByRole('checkbox')
  const hypoglycemiaToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Below range')).getByRole('checkbox')
  const varianceToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('CV')).getByRole('checkbox')
  const lastUpdateToggleForShow = within(within(columnSettingsPopoverForShow).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert only mandatory columns are checked
  expect(patientToggleForShow).toHaveProperty('checked', true)
  expect(patientToggleForShow).toBeDisabled()
  expect(patientProfileForShow).toHaveProperty('checked', false)
  expect(ageToggleForShow).toHaveProperty('checked', false)
  expect(dateOfBirthToggleForShow).toHaveProperty('checked', false)
  expect(genderToggleForShow).toHaveProperty('checked', false)
  expect(systemToggleForShow).toHaveProperty('checked', false)
  expect(monitoringAlertsToggleForShow).toHaveProperty('checked', false)
  expect(messagesToggleForShow).toHaveProperty('checked', false)
  expect(tirToggleForShow).toHaveProperty('checked', false)
  expect(gmiToggleForShow).toHaveProperty('checked', false)
  expect(hypoglycemiaToggleForShow).toHaveProperty('checked', false)
  expect(varianceToggleForShow).toHaveProperty('checked', false)
  expect(lastUpdateToggleForShow).toHaveProperty('checked', false)

  // Show all columns
  await userEvent.click(patientProfileForShow)
  await userEvent.click(ageToggleForShow)
  await userEvent.click(dateOfBirthToggleForShow)
  await userEvent.click(genderToggleForShow)
  await userEvent.click(systemToggleForShow)
  await userEvent.click(monitoringAlertsToggleForShow)
  await userEvent.click(messagesToggleForShow)
  await userEvent.click(tirToggleForShow)
  await userEvent.click(gmiToggleForShow)
  await userEvent.click(hypoglycemiaToggleForShow)
  await userEvent.click(varianceToggleForShow)
  await userEvent.click(lastUpdateToggleForShow)
  expect(patientProfileForShow).toHaveProperty('checked', true)
  expect(ageToggleForShow).toHaveProperty('checked', true)
  expect(dateOfBirthToggleForShow).toHaveProperty('checked', true)
  expect(genderToggleForShow).toHaveProperty('checked', true)
  expect(systemToggleForShow).toHaveProperty('checked', true)
  expect(monitoringAlertsToggleForShow).toHaveProperty('checked', true)
  expect(messagesToggleForShow).toHaveProperty('checked', true)
  expect(tirToggleForShow).toHaveProperty('checked', true)
  expect(gmiToggleForShow).toHaveProperty('checked', true)
  expect(hypoglycemiaToggleForShow).toHaveProperty('checked', true)
  expect(varianceToggleForShow).toHaveProperty('checked', true)
  expect(lastUpdateToggleForShow).toHaveProperty('checked', true)

  await userEvent.click(applyButtonForShow)

  expect(columnSettingsPopoverForShow).not.toBeVisible()

  // Assert all columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Profile' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Age' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Gender' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'System' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Messages' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'TIR' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'GMI' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Below range' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'CV' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()

  await checkTooltipsColumnHeader(dataGridCurrentRows)

  expect(dataGridCurrentRows).toHaveTextContent('PatientProfileAgeDate of birthGenderSystemMonitoring alertsMessagesTIRGMIBelow rangeCVLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 145Jan 1, 1980MaleDBLG2No new messages from the patient0%N/A0%N/AN/AFlag patient z-no-data@patient.frPatient Z - No DataType 145Jan 1, 1980FemaleDBLG1No new messages from the patient0%N/A0%N/AN/AFlag patient patient-mmol@diabeloop.frPerotto PatientMmolType 145Jan 1, 1980MaleDBLG1No new messages from the patient0%N/A0%N/AN/AFlag patient patient2@diabeloop.frRouis Patient2Type 145Jan 1, 1980FemaleDBLG1No new messages from the patient0%N/A0%N/AN/AFlag patient patient3@diabeloop.frSrairi Patient3Type 145Jan 1, 1980MaleDBLG1No new messages from the patient0%N/A0%N/AN/A')

  await userEvent.click(columnSettingsButton)
  const columnSettingsPopoverForReset = screen.getByRole('presentation')
  const applyButtonForReset = within(columnSettingsPopoverForReset).getByRole('button', { name: 'Apply' })

  expect(columnSettingsPopoverForReset).toBeVisible()

  const patientToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Patient')).getByRole('checkbox')
  const patientProfileToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Profile')).getByRole('checkbox')
  const ageToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Age')).getByRole('checkbox')
  const dateOfBirthToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Date of birth')).getByRole('checkbox')
  const genderToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Gender')).getByRole('checkbox')
  const monitoringAlertsToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Monitoring alerts')).getByRole('checkbox')
  const systemToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('System')).getByRole('checkbox')
  const messagesToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Messages')).getByRole('checkbox')
  const tirToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('TIR')).getByRole('checkbox')
  const gmiToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('GMI (estimated HbA1c)')).getByRole('checkbox')
  const hypoglycemiaToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Below range')).getByRole('checkbox')
  const varianceToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('CV')).getByRole('checkbox')
  const lastUpdateToggleForReset = within(within(columnSettingsPopoverForReset).getByLabelText('Last data update')).getByRole('checkbox')

  // Assert all columns are checked
  expect(patientToggleForReset).toHaveProperty('checked', true)
  expect(patientToggleForReset).toBeDisabled()
  expect(patientProfileToggleForReset).toHaveProperty('checked', true)
  expect(ageToggleForReset).toHaveProperty('checked', true)
  expect(dateOfBirthToggleForReset).toHaveProperty('checked', true)
  expect(genderToggleForReset).toHaveProperty('checked', true)
  expect(systemToggleForReset).toHaveProperty('checked', true)
  expect(monitoringAlertsToggleForReset).toHaveProperty('checked', true)
  expect(messagesToggleForReset).toHaveProperty('checked', true)
  expect(tirToggleForReset).toHaveProperty('checked', true)
  expect(gmiToggleForReset).toHaveProperty('checked', true)
  expect(hypoglycemiaToggleForReset).toHaveProperty('checked', true)
  expect(varianceToggleForReset).toHaveProperty('checked', true)
  expect(lastUpdateToggleForReset).toHaveProperty('checked', true)

  // Show only default columns
  await userEvent.click(ageToggleForReset)
  await userEvent.click(genderToggleForReset)
  await userEvent.click(systemToggleForReset)
  await userEvent.click(gmiToggleForReset)
  await userEvent.click(varianceToggleForReset)
  expect(ageToggleForReset).toHaveProperty('checked', false)
  expect(genderToggleForReset).toHaveProperty('checked', false)
  expect(systemToggleForReset).toHaveProperty('checked', false)
  expect(gmiToggleForReset).toHaveProperty('checked', false)
  expect(varianceToggleForReset).toHaveProperty('checked', false)

  await userEvent.click(applyButtonForReset)

  expect(columnSettingsPopoverForReset).not.toBeVisible()

  // Assert default columns are displayed
  checkDefaultColumnsDisplay()

  expect(dataGridCurrentRows).toHaveTextContent('PatientProfileDate of birthMonitoring alertsMessagesTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient-mmol@diabeloop.frPerotto PatientMmolType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient2@diabeloop.frRouis Patient2Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient3@diabeloop.frSrairi Patient3Type 1Jan 1, 1980No new messages from the patient0%0%N/A')
}

const checkPatientListMonitoringAlertsIcons = async (outOfRangeTooltipValue: string, hypoglycemiaTooltipValue: string): Promise<void> => {
  await waitFor(() => {
    expect(screen.queryByTestId('current-patient-list-grid')).toHaveTextContent('PatientProfileDate of birthMonitoring alertsMessagesTIRBelow rangeLast data updateActionsFlag patient patient1@diabeloop.frGroby Patient1Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient z-no-data@patient.frPatient Z - No DataType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient-mmol@diabeloop.frPerotto PatientMmolType 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient2@diabeloop.frRouis Patient2Type 1Jan 1, 1980No new messages from the patient0%0%N/AFlag patient patient3@diabeloop.frSrairi Patient3Type 1Jan 1, 1980No new messages from the patient0%0%N/A')
  })
  const dataGridRows = screen.getByTestId('current-patient-list-grid')
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
  expect(firstRowTimeSpentOutOfRangeIcon).toHaveAttribute('fill', SVG_ICON_FILL)
  expect(firstRowTimeSpentOutOfRangeIcon.getAttribute('class').includes(SVG_ICON_DISABLED_CLASS)).toEqual(true)

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowTimeSpentOutOfRangeIcon)
  const timeSpentOutOfRangeTooltip = await screen.findByRole('tooltip')
  expect(timeSpentOutOfRangeTooltip).toBeVisible()
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('Out of the range: 10%')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent(outOfRangeTooltipValue)
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(firstRowTimeSpentOutOfRangeIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[0]
  expect(firstRowHypoglycemiaIcon).toHaveAttribute('fill', SVG_ICON_FILL)
  expect(firstRowHypoglycemiaIcon.getAttribute('class').includes(SVG_ICON_DISABLED_CLASS)).toEqual(true)

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowHypoglycemiaIcon)
  const hypoglycemiaTooltip = await screen.findByRole('tooltip')
  expect(hypoglycemiaTooltip).toBeVisible()
  expect(hypoglycemiaTooltip).toHaveTextContent('Hypoglycemia: 20%')
  expect(hypoglycemiaTooltip).toHaveTextContent(hypoglycemiaTooltipValue)
  expect(hypoglycemiaTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(firstRowHypoglycemiaIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[0]
  expect(firstRowNoDataIcon).toHaveAttribute('fill', SVG_ICON_FILL)
  expect(firstRowNoDataIcon.getAttribute('class').includes(SVG_ICON_DISABLED_CLASS)).toEqual(true)

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowNoDataIcon)
  const noDataTooltip = await screen.findByRole('tooltip')
  expect(noDataTooltip).toBeVisible()
  expect(noDataTooltip).toHaveTextContent('Data not transmitted: 30%')
  expect(noDataTooltip).toHaveTextContent('Alert triggered when 15% of data are not transmitted over the period considered.')
  expect(noDataTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(firstRowNoDataIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  }, { timeout: 3000 })

  const firstRowMessageIcon = within(dataGridRows).getAllByTestId('message-icon')[0]
  expect(firstRowMessageIcon).toHaveAttribute('fill', SVG_ICON_FILL)
  expect(firstRowMessageIcon.getAttribute('class').includes(SVG_ICON_DISABLED_CLASS)).toEqual(true)

  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowMessageIcon)
  const messageTooltip = await screen.findByRole('tooltip')
  expect(messageTooltip).toBeVisible()
  expect(messageTooltip).toHaveTextContent('No new messages from the patient')
  await userEvent.unhover(firstRowMessageIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
}

export const checkPatientListTooltipsMgDL = async (): Promise<void> => {
  const outOfRangeTooltip = 'Alert triggered when more than 5% of time over the period considered are off target (50-140 mg/dL).'
  const hypoglycemiaTooltip = 'Alert triggered when 10% of time below 40 mg/dL threshold over the period considered.'
  await checkPatientListMonitoringAlertsIcons(outOfRangeTooltip, hypoglycemiaTooltip)
}

export const checkPatientListTooltipsMmolL = async (): Promise<void> => {
  const outOfRangeTooltip = 'Alert triggered when more than 5% of time over the period considered are off target (2.8-7.8 mmol/L).'
  const hypoglycemiaTooltip = 'Alert triggered when 10% of time below 2.2 mmol/L threshold over the period considered.'
  await checkPatientListMonitoringAlertsIcons(outOfRangeTooltip, hypoglycemiaTooltip)
}

export const checkPatientListTooltipsNoData = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('current-patient-list-grid')
  const noDataPatientIndex = 1

  const noDataPatientTimeSpentOutOfRangeIcon = within(dataGridRows).getAllByTestId('time-spent-out-of-range-icon')[noDataPatientIndex]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(noDataPatientTimeSpentOutOfRangeIcon)
  const timeSpentOutOfRangeTooltip = await screen.findByRole('tooltip')
  expect(timeSpentOutOfRangeTooltip).toBeVisible()
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('Out of the range: N/A')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('Alert triggered when more than 5% of time over the period considered are off target (50-140 mg/dL).')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(noDataPatientTimeSpentOutOfRangeIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const noDataPatientHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[noDataPatientIndex]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(noDataPatientHypoglycemiaIcon)
  const hypoglycemiaTooltip = await screen.findByRole('tooltip')
  expect(hypoglycemiaTooltip).toBeVisible()
  expect(hypoglycemiaTooltip).toHaveTextContent('Hypoglycemia: N/A')
  expect(hypoglycemiaTooltip).toHaveTextContent('Alert triggered when 10% of time below 40 mg/dL threshold over the period considered.')
  expect(hypoglycemiaTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(noDataPatientHypoglycemiaIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const noDataPatientNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[noDataPatientIndex]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(noDataPatientNoDataIcon)
  const noDataTooltip = await screen.findByRole('tooltip')
  expect(noDataTooltip).toBeVisible()
  expect(noDataTooltip).toHaveTextContent('Data not transmitted: 100%')
  expect(noDataTooltip).toHaveTextContent('Alert triggered when 15% of data are not transmitted over the period considered.')
  expect(noDataTooltip).toHaveTextContent('This value can be modified either in the care team settings or patient by patient.')
  await userEvent.unhover(noDataPatientNoDataIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
}

export const checkPatientListColumnSort = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('current-patient-list-grid')

  const patientColumnHeader = within(dataGridRows).getByRole('columnheader', { name: 'Patient' })
  const allRowsBeforeSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsBeforeSort[1]).toHaveTextContent(`${patient1Info.profile.lastName} ${patient1Info.profile.firstName}`)
  expect(allRowsBeforeSort[2]).toHaveTextContent(`${noDataTransferredPatientInfo.profile.lastName} ${noDataTransferredPatientInfo.profile.firstName}`)
  expect(allRowsBeforeSort[3]).toHaveTextContent(`${patientWithMmolInfo.profile.lastName} ${patientWithMmolInfo.profile.firstName}`)
  expect(allRowsBeforeSort[4]).toHaveTextContent(`${patient2Info.profile.lastName} ${patient2Info.profile.firstName}`)
  expect(allRowsBeforeSort[5]).toHaveTextContent(`${patient3Info.profile.lastName} ${patient3Info.profile.firstName}`)

  const sortButton = within(patientColumnHeader).getByRole('button', { hidden: true })
  await userEvent.click(sortButton)

  const allRowsAfterFirstSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsAfterFirstSort[1]).toHaveTextContent(`${patient3Info.profile.lastName} ${patient3Info.profile.firstName}`)
  expect(allRowsAfterFirstSort[2]).toHaveTextContent(`${patient2Info.profile.lastName} ${patient2Info.profile.firstName}`)
  expect(allRowsAfterFirstSort[3]).toHaveTextContent(`${patientWithMmolInfo.profile.lastName} ${patientWithMmolInfo.profile.firstName}`)
  expect(allRowsAfterFirstSort[4]).toHaveTextContent(`${noDataTransferredPatientInfo.profile.lastName} ${noDataTransferredPatientInfo.profile.firstName}`)
  expect(allRowsAfterFirstSort[5]).toHaveTextContent(`${patient1Info.profile.lastName} ${patient1Info.profile.firstName}`)

  await userEvent.click(sortButton)

  const allRowsAfterSecondSort = within(dataGridRows).getAllByRole('row')
  expect(allRowsAfterSecondSort[1]).toHaveTextContent(`${patient1Info.profile.lastName} ${patient1Info.profile.firstName}`)
  expect(allRowsAfterSecondSort[2]).toHaveTextContent(`${noDataTransferredPatientInfo.profile.lastName} ${noDataTransferredPatientInfo.profile.firstName}`)
  expect(allRowsAfterSecondSort[3]).toHaveTextContent(`${patientWithMmolInfo.profile.lastName} ${patientWithMmolInfo.profile.firstName}`)
  expect(allRowsAfterSecondSort[4]).toHaveTextContent(`${patient2Info.profile.lastName} ${patient2Info.profile.firstName}`)
  expect(allRowsAfterSecondSort[5]).toHaveTextContent(`${patient3Info.profile.lastName} ${patient3Info.profile.firstName}`)
}

export const checkMonitoringAlertsIconsInactiveForFirstPatient = async (): Promise<void> => {
  const dataGridRows = screen.getByTestId('current-patient-list-grid')
  const disabledColorAsRgba = 'rgba(0, 0, 0, 0.26)'

  const firstRowTimeSpentOutOfRangeIcon = within(dataGridRows).getAllByTestId('time-spent-out-of-range-icon')[0]
  expect(firstRowTimeSpentOutOfRangeIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)

  const firstRowHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[0]
  expect(firstRowHypoglycemiaIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)

  const firstRowNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[0]
  expect(firstRowNoDataIcon).toHaveStyle(`color: ${disabledColorAsRgba};`)
}

export const checkRemovePendingPatientMedicalTeam = async () => {
  // We go to the pending tab
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)

  // We check that the patient list is correct
  const pendingPatientList = screen.getByTestId('pending-patient-list-grid')
  expect(pendingPatientList).toHaveTextContent('Invite sent byDateEmailActions')
  expect(pendingPatientList).toHaveTextContent('Blanc YannMay 17, 2023pending-patient@diabeloop.frResend inviteCancel')
  expect(pendingPatientList).toHaveTextContent('Rows per page:101–1 of 1')

  // We open the dialog to cancel a pending invite
  const cancelInviteButton = screen.getByRole('button', { name: 'Remove patient pending-patient@diabeloop.fr' })
  await userEvent.click(cancelInviteButton)
  const cancelInviteDialog = screen.getByRole('dialog')
  expect(cancelInviteDialog).toHaveTextContent('Are you sure you want to cancel the invite of pending-patient@diabeloop.fr?')
  expect(cancelInviteDialog).toHaveTextContent('The patient will no longer see on YourLoops the invite notification to share their data.')

  const closeButtonDialog = within(cancelInviteDialog).getByRole('button', { name: 'Keep it' })
  await userEvent.click(closeButtonDialog)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  // We open the dialog again and click on the remove button
  await userEvent.click(cancelInviteButton)
  const removeInviteButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'Cancel invite' })
  await userEvent.click(removeInviteButton)

  // We check that the API has been properly called
  expect(NotificationApi.cancelInvitation).toHaveBeenCalledWith('fakeInviteId', undefined, pendingPatient.profile.email)
  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, pendingPatient.userid)

  // We check that the alert is successful
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('The invite has been canceled')

  // We check that the pending patient list is still the same
  expect(pendingPatientList).toHaveTextContent('Invite sent byDateEmailActions')
  expect(pendingPatientList).toHaveTextContent('Blanc YannMay 17, 2023pending-patient@diabeloop.frResend inviteCancel')
  expect(pendingPatientList).toHaveTextContent('Rows per page:101–1 of 1')

  // We go back to the current tab
  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
}

export const checkReinvitePendingPatientMedicalTeam = async () => {
  // We go to the pending tab
  const pendingTab = screen.getByRole('tab', { name: 'Pending' })
  await userEvent.click(pendingTab)

  // We check that the patient list is correct
  const pendingPatientList = screen.getByTestId('pending-patient-list-grid')
  expect(pendingPatientList).toHaveTextContent('Invite sent byDateEmailActions')
  expect(pendingPatientList).toHaveTextContent('Blanc YannMay 17, 2023pending-patient@diabeloop.frResend inviteCancel')
  expect(pendingPatientList).toHaveTextContent('Rows per page:101–1 of 1')

  // We open the dialog to resend an invite to a pending patient
  const cancelInviteButton = screen.getByRole('button', { name: 'Resend invite pending-patient@diabeloop.fr' })
  await userEvent.click(cancelInviteButton)
  const cancelInviteDialog = screen.getByRole('dialog')
  expect(cancelInviteDialog).toHaveTextContent('Resend an invite to a patient')
  expect(cancelInviteDialog).toHaveTextContent('Are you sure you want to reinvite pending-patient@diabeloop.fr to A - MyThirdTeam - to be deleted?CancelResend invite')

  // We click on cancel
  const cancelButtonDialog = within(cancelInviteDialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButtonDialog)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  // We open the dialog again and click on the resend invite button
  await userEvent.click(cancelInviteButton)
  const removeInviteButton = within(screen.getByRole('dialog')).getByRole('button', { name: 'Resend invite' })
  await userEvent.click(removeInviteButton)

  // We check that the API has been properly called
  expect(NotificationApi.cancelInvitation).toHaveBeenCalledWith('fakeInviteId', undefined, pendingPatient.profile.email)
  expect(PatientApi.removePatient).toHaveBeenCalledWith(myThirdTeamId, pendingPatient.userid)
  expect(PatientApi.invitePatient).toHaveBeenCalledWith({ teamId: myThirdTeamId, email: pendingPatient.profile.email })

  // We check that the alert is successful
  expect(screen.getByTestId('alert-snackbar')).toHaveTextContent('pending-patient@diabeloop.fr has been reinvited to A - MyThirdTeam - to be deleted')

  // We check that the team code dialog is opened with the correct content and we close it
  const teamCodeDialog = screen.getByRole('dialog')
  expect(teamCodeDialog).toHaveTextContent('A - MyThirdTeam - to be deletedCommunicate this identification code to your patient during a consultation so they can verify your identity.')
  expect(teamCodeDialog).toHaveTextContent('This identification code is always available in the Care team settings page.263 - 381 - 988Ok')
  const closeTeamCodeDialogButton = within(teamCodeDialog).getByRole('button', { name: 'Ok' })
  await userEvent.click(closeTeamCodeDialogButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

  // We check that the pending patient list is still the same
  expect(pendingPatientList).toHaveTextContent('Invite sent byDateEmailActions')
  expect(pendingPatientList).toHaveTextContent('Blanc YannMay 17, 2023pending-patient@diabeloop.frResend inviteCancel')
  expect(pendingPatientList).toHaveTextContent('Rows per page:101–1 of 1')

  // We go back to the current tab
  const currentTab = screen.getByRole('tab', { name: 'Current' })
  await userEvent.click(currentTab)
}

const checkDefaultColumnsDisplay = () => {
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Profile' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Date of birth' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Monitoring alerts' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Messages' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'TIR' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'GMI' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Below range' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'CV' })).not.toBeInTheDocument()
  expect(screen.getByRole('columnheader', { name: 'Last data update' })).toBeVisible()
  expect(screen.getByRole('columnheader', { name: 'Actions' })).toBeVisible()
}

const checkTooltipsColumnHeader = async (dataGridRows) => {
  const monitoringAlertsColumnHeader = within(dataGridRows).getByText('Monitoring alerts')
  const messagesColumnHeader = within(dataGridRows).getByText('Messages')
  const timeInRangeColumnHeader = within(dataGridRows).getByText('TIR')
  const managementGlucoseColumnHeader = within(dataGridRows).getByText('GMI')
  const belowRangeColumnHeader = within(dataGridRows).getByText('Below range')
  const variantColumnHeader = within(dataGridRows).getByText('CV')
  const lastDataUpdateColumnHeader = within(dataGridRows).getByText('Last data update')

  await userEvent.hover(monitoringAlertsColumnHeader)
  expect(await screen.findByText('Hover over the icons to learn more')).toBeVisible()
  await userEvent.unhover(monitoringAlertsColumnHeader)

  await userEvent.hover(messagesColumnHeader)
  expect(await screen.findByText('Messages')).toBeVisible()
  await userEvent.unhover(messagesColumnHeader)

  await userEvent.hover(timeInRangeColumnHeader)
  expect(await screen.findByText('Time In Range')).toBeVisible()
  await userEvent.unhover(timeInRangeColumnHeader)

  await userEvent.hover(managementGlucoseColumnHeader)
  expect(await screen.findByText('GMI (estimated HbA1c)')).toBeVisible()
  await userEvent.unhover(managementGlucoseColumnHeader)

  await userEvent.hover(variantColumnHeader)
  expect(await screen.findByText('Coefficient of Variation')).toBeVisible()
  await userEvent.unhover(variantColumnHeader)

  await userEvent.hover(belowRangeColumnHeader)
  // Using `findByRole()` instead of `findByText()` because the tooltip has the same name as the column header
  expect(await screen.findByRole('tooltip', { name: 'Below range' })).toBeVisible()
  await userEvent.unhover(belowRangeColumnHeader)

  await userEvent.hover(lastDataUpdateColumnHeader)
  // Using `findByRole()` instead of `findByText()` because the tooltip has the same name as the column header
  expect(await screen.findByRole('tooltip', { name: 'Last data update' })).toBeVisible()
  await userEvent.unhover(lastDataUpdateColumnHeader)
}
