/*
 * Copyright (c) 2026, Diabeloop
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
} from './patient-filters-mobile.assert'
import { changeTeamScope } from './header-mobile.assert'
import {
  hyperglycemiaPatientInfo,
  hypoglycemiaPatientInfo,
  noDataTransferredPatientInfo,
  timeSpentOutOfTargetRangePatientInfo
} from '../data/patient.api.data'
import { Router } from '../models/router.model'
import { AppUserRoute } from '../../../models/enums/routes.enum'

export const checkDataGridAfterSinglePatientFilter = (dataGridRow: HTMLElement): void => {
  const allRows = within(dataGridRow).getAllByRole('row')
  expect(allRows).toHaveLength(2)
}

const checkPatientListHeaderMobile = (header: HTMLElement) => {
  expect(header).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Search for a patient...')).toBeVisible()
  expect(screen.getByTestId('current-patient-list-grid')).toBeVisible()
}

export const checkPatientListHeaderCaregiverMobile = () => {
  const header = screen.getByTestId('patient-list-header')
  checkPatientListHeaderMobile(header)
  expect(within(header).queryByRole('button', { name: 'Filters' })).not.toBeInTheDocument()
  expect(screen.queryByTestId('filters-label')).not.toBeInTheDocument()
  expect(within(header).queryByRole('button', { name: 'Add new patient' })).not.toBeInTheDocument()
}

export const checkPatientListHeaderForHcpMobile = async () => {
  const header = await screen.findByTestId('patient-list-header')
  checkPatientListHeaderMobile(header)
  expect(within(header).getByTestId('filters-button')).toBeVisible()
  expect(within(header).getByTestId('add-patient-button')).toBeVisible()
}

export const checkPatientListFiltersMobile = async () => {
  await changeTeamScope(myThirdTeamName, filtersTeamName)
  expect(PatientApi.getPatientsForHcp).toHaveBeenCalledWith(loggedInUserId, filtersTeamId)

  expect(screen.queryByTestId('reset-filters-link')).not.toBeInTheDocument()
  await waitFor(() => expect(screen.queryByRole('progressbar')).not.toBeInTheDocument())

  const dataGridRowCurrent = screen.getByTestId('current-patient-list-grid')
  expect(within(dataGridRowCurrent).getAllByRole('row')).toHaveLength(8)

  // Check the default values
  const filtersButton = screen.getByTestId('filters-button')
  await userEvent.click(filtersButton)
  checkPatientsFilters()

  // Check the cancel button
  await closeFiltersPresentation()
  await userEvent.click(filtersButton)

  // check the time spent out of target toggle
  await updatePatientsFilters({
    ...defaultToggles,
    outOfRangeFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent)
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, outOfRangeFilterToggle: true })

  // check the hypoglycemia toggle
  await updatePatientsFilters({
    ...defaultToggles,
    outOfRangeFilterToggle: true,
    hypoglycemiaFilterToggle: true
  })
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, hypoglycemiaFilterToggle: true })

  // check the hypoglycemia toggle
  await updatePatientsFilters({
    ...defaultToggles,
    hypoglycemiaFilterToggle: true,
    hyperglycemiaFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent)
  await userEvent.click(filtersButton)
  checkPatientsFilters({ ...defaultToggles, hyperglycemiaFilterToggle: true })


  // check the no data toggle
  await updatePatientsFilters({
    ...defaultToggles,
    hyperglycemiaFilterToggle: true,
    dataNotTransferredFilterToggle: true
  })
  checkDataGridAfterSinglePatientFilter(dataGridRowCurrent)
  await userEvent.click(filtersButton)

  await closeFiltersPresentation()

  await changeTeamScope(filtersTeamName, myThirdTeamName)
  expect(PatientApi.getPatientsForHcp).toHaveBeenCalledWith(loggedInUserId, myThirdTeamId)

  // Reset the filters
  await userEvent.click(filtersButton)
  await updatePatientsFilters({
    ...defaultToggles
  })

  //Pourquoi 2 et plus 6 ?
  expect(within(screen.getByTestId('current-patient-list-grid')).getAllByRole('row')).toHaveLength(2)
}

export const checkPatientListHideShowColumnsMobile = async () => {
  // Assert only mandatory columns are displayed
  expect(screen.getByRole('columnheader', { name: 'Patient' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'Profile' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Age' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Date of birth' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Gender' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Lead clinicians' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Alerts' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'System' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Last data update' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Messages' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'TIR' })).toBeVisible()
  expect(screen.queryByRole('columnheader', { name: 'GMI (estimated HbA1c of last 14 days)' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Below range' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Coefficient of Variation' })).not.toBeInTheDocument()
  expect(screen.queryByRole('columnheader', { name: 'Actions' })).not.toBeInTheDocument()
}

const openAckDialogForPatient = async (testId: string, rowIndex: number): Promise<HTMLElement> => {
  const user = userEvent.setup();
  const rows = screen.getAllByRole('row');

  const targetRow = rows[rowIndex + 1];

  const button = within(targetRow).getByTestId(testId);

  await user.click(button);
  return await screen.findByRole('dialog');
}

// Check the content of the Acknowledge monitoring alert dialog for a hypoglycemia alert, then close it with the close button
export const checkAckMonitoringAlertDialogContentMobile = async (): Promise<void> => {
  const hypoglycemiaPatientName = `${hypoglycemiaPatientInfo.profile.firstName} ${hypoglycemiaPatientInfo.profile.lastName}`
  const dialog = await openAckDialogForPatient('hypoglycemia-icon', 5)

  expect(within(dialog).getByRole('heading')).toHaveTextContent('Acknowledge Hypoglycemia monitoring alert')
  expect(within(dialog).getByText(/Do you wish to acknowledge/)).toHaveTextContent(`Do you wish to acknowledge the Hypoglycemia monitoring alert for the patient ${hypoglycemiaPatientName}? The current monitoring alert will be muted temporarily for all HCP users in the team`)
  expect(within(dialog).getByRole('alert')).toBeVisible()

  expect(within(dialog).getByRole('button', { name: 'Acknowledge the alert' })).toBeVisible()
  expect(within(dialog).getByRole('button', { name: 'Analyze the alert' })).toBeVisible()

  const closeButton = within(dialog).getByRole('button', { name: 'Close' })
  await userEvent.click(closeButton)
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())

}

export const checkAckMonitoringAlertDialogCloseOnAnalyseMobile = async (router: Router): Promise<void> => {
  const dialog = await openAckDialogForPatient('hypoglycemia-icon', 5)

  const analyseButton = within(dialog).getByRole('button', { name: 'Analyze the alert' })
  await userEvent.click(analyseButton)

  // Dialog should be closed after clicking Analyse
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(router.state.location.pathname).toEqual(`${AppUserRoute.Teams}/${filtersTeamId}/patients/${hypoglycemiaPatientInfo.userid}/dashboard`)
}

export const checkAckMonitoringAlertHypoglycemiaMobile = async (withError = false): Promise<void> => {
  const hypoglycemiaPatientName = `${hypoglycemiaPatientInfo.profile.lastName} ${hypoglycemiaPatientInfo.profile.firstName}`
  const dialog = await openAckDialogForPatient('hypoglycemia-icon', 5)

  const acknowledgeButton = within(dialog).getByRole('button', { name: 'Acknowledge the alert' })
  await userEvent.click(acknowledgeButton)

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  if (withError) {
    await checkAndCloseAckAlert(`Error while acknowledging monitoring alert for patient ${hypoglycemiaPatientName}. Please try again later.`)
  } else {
    await checkAndCloseAckAlert(`Monitoring alert Hypoglycemia acknowledged successfully for patient ${hypoglycemiaPatientName}`)
  }
  // Check the API was called with the correct patientId and hypoglycemia date set
  expect(PatientApi.acknowledgePatientAlerts).toHaveBeenCalledWith(
    filtersTeamId,
    hypoglycemiaPatientInfo.userid,
    expect.objectContaining({
      hypoglycemia: expect.any(Date),
      hyperglycemia: null,
      nonDataTransmission: null,
      timeOutOfRange: null
    })
  )
}

export const checkAckMonitoringAlertHyperglycemiaMobile = async (): Promise<void> => {
  const hyperglycemiaPatientName = `${hyperglycemiaPatientInfo.profile.lastName} ${hyperglycemiaPatientInfo.profile.firstName}`
  const dialog = await openAckDialogForPatient('hyperglycemia-icon', 4)

  const acknowledgeButton = within(dialog).getByRole('button', { name: 'Acknowledge the alert' })
  await userEvent.click(acknowledgeButton)

  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await checkAndCloseAckAlert(`Monitoring alert Hyperglycemia acknowledged successfully for patient ${hyperglycemiaPatientName}`)
  // Check the API was called with the correct patientId and hyperglycemia date set
  expect(PatientApi.acknowledgePatientAlerts).toHaveBeenCalledWith(
    filtersTeamId,
    hyperglycemiaPatientInfo.userid,
    expect.objectContaining({
      hyperglycemia: expect.any(Date),
      hypoglycemia: null,
      nonDataTransmission: null,
      timeOutOfRange: null
    })
  )
}

export const checkAckMonitoringAlertTimeOutOfRangeMobile = async (): Promise<void> => {
  const PatientName = `${timeSpentOutOfTargetRangePatientInfo.profile.lastName} ${timeSpentOutOfTargetRangePatientInfo.profile.firstName}`
  const dialog = await openAckDialogForPatient('time-spent-out-of-range-icon', 2)

  const acknowledgeButton = within(dialog).getByTestId('acknowledge-monitoring-alert-dialog-acknowledge-button')
  await userEvent.click(acknowledgeButton)
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  await checkAndCloseAckAlert(`Monitoring alert Time spent out of range acknowledged successfully for patient ${PatientName}`)
  expect(PatientApi.acknowledgePatientAlerts).toHaveBeenCalledWith(
    filtersTeamId,
    timeSpentOutOfTargetRangePatientInfo.userid,
    expect.objectContaining({
      timeOutOfRange: expect.any(Date),
      hyperglycemia: null,
      hypoglycemia: null,
      nonDataTransmission: null
    })
  )
}

export const checkAckMonitoringAlertNoDataMobile = async (): Promise<void> => {
  const dialog = await openAckDialogForPatient('no-data-icon', 6)
  const PatientName = `${noDataTransferredPatientInfo.profile.lastName} ${noDataTransferredPatientInfo.profile.firstName}`
  const acknowledgeButton = within(dialog).getByTestId('acknowledge-monitoring-alert-dialog-acknowledge-button')
  await userEvent.click(acknowledgeButton)
  await checkAndCloseAckAlert(`Monitoring alert Data not transmitted acknowledged successfully for patient ${PatientName}`)
  await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  expect(PatientApi.acknowledgePatientAlerts).toHaveBeenCalledWith(
    filtersTeamId,
    noDataTransferredPatientInfo.userid,
    expect.objectContaining({
      nonDataTransmission: expect.any(Date),
      hyperglycemia: null,
      hypoglycemia: null,
      timeOutOfRange: null
    })
  )
}

export const goBackToPatientsListMobile = async (router: Router): Promise<void> => {
  await userEvent.click(screen.getByTestId('back-button'))
  expect(router.state.location.pathname).toEqual(`${AppUserRoute.Teams}/${filtersTeamId}/patients`)
}

export const checkAndCloseAckAlert = async (alertText: string): Promise<void> => {

  const messageElement = await screen.findByText(alertText);

  const confirmationAlert = (messageElement.closest('.MuiAlert-root') || messageElement) as HTMLElement;

  expect(confirmationAlert).toHaveTextContent(alertText);

  const closeButton = within(confirmationAlert).getByRole('button', { name: 'Close', hidden: true });
  await userEvent.click(closeButton);
}
