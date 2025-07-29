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

import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { patient1Id, patient1Info, patientWithMmolId } from '../data/patient.api.data'
import { Unit } from 'medical-domain'
import PatientApi from '../../../lib/patient/patient.api'
import { buildTeamThree, myThirdTeamId } from '../mock/team.api.mock'
import TeamApi from '../../../lib/team/team.api'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { getTranslation } from '../../utils/i18n'

export const checkMonitoringAlertsLinkToTargetAndAlerts = async (): Promise<void> => {
  const configureMonitoringAlertsButton = await screen.findByLabelText('Configure monitoring alerts')
  await userEvent.click(configureMonitoringAlertsButton)

  const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range-and-alerts'))
  await userEvent.click(menuButton)

  const targetAndAlertsContent = screen.getByTestId('target-and-alerts-container')
  expect(targetAndAlertsContent).toHaveTextContent(getTranslation('range-and-alerts'))
  expect(targetAndAlertsContent).toHaveTextContent('Monitoring alertsSet manually each value or apply care team values.')
}

export const checkContentForPatientMmol = async (): Promise<void> => {
  const monitoringAlertsSection = screen.getByTestId('monitoring-alerts-configuration-section')

  expect(monitoringAlertsSection).toHaveTextContent('Apply care team valuesCustom values are applied for this patient. You can apply the default care team values.')
  expect(monitoringAlertsSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 3 mmol/L max at 7.8 mmol/L)A. Glycemic targetMinimum​mmol/LMaximum​mmol/LB. Event trigger thresholdTime spent off target5%​')
  expect(monitoringAlertsSection).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 2.2 mmol/L thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mmol/LB. Event trigger thresholdTime spent in severe hypoglycemia10%​')
  expect(monitoringAlertsSection).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Save')
}

export const checkMonitoringAlertsParametersTeamAdmin = async (): Promise<void> => {
  jest.spyOn(TeamApi, 'editTeam').mockResolvedValue(undefined)
  const monitoringAlertsParameters = await screen.findByTestId('team-monitoring-alerts-configuration')
  expect(monitoringAlertsParameters).toHaveTextContent('Monitoring alerts configuration1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum​mg/dLMaximum​mg/dLDefault: min at 70 mg/dL and max at 180 mg/dLB. Event trigger thresholdTime spent off target5%​Default: 50%')
  expect(monitoringAlertsParameters).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mg/dLDefault: 54 mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​Default: 5%')
  expect(monitoringAlertsParameters).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Default: 50%Save')

  const lowBgInput = within(monitoringAlertsParameters).getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = within(monitoringAlertsParameters).getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = within(monitoringAlertsParameters).getByRole('spinbutton', { name: 'Very low blood glucose input' })

  const outOfRangeThreshold = within(monitoringAlertsParameters).getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = within(monitoringAlertsParameters).getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataTxThreshold = within(monitoringAlertsParameters).getByTestId('basic-dropdown-non-data-selector')

  expect(lowBgInput).not.toBeDisabled()
  expect(highBgInput).not.toBeDisabled()
  expect(veryLowBgInput).not.toBeDisabled()
  expect(outOfRangeThreshold).not.toHaveClass('Mui-disabled')
  expect(hypoThreshold).not.toHaveClass('Mui-disabled')
  expect(nonDataTxThreshold).not.toHaveClass('Mui-disabled')

  const saveButton = within(monitoringAlertsParameters).getByRole('button', { name: 'Save' })
  expect(saveButton).toBeDisabled() // It should be disabled as no values have been changed yet

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '51')
  expect(saveButton).not.toBeDisabled()

  await userEvent.click(saveButton)

  const thirdTeam = { ...buildTeamThree(), code: undefined, members: [], type: undefined }
  thirdTeam.monitoringAlertsParameters.lowBg = 51
  expect(TeamApi.editTeam).toHaveBeenCalledWith(thirdTeam)
}

export const checkMonitoringAlertsParametersTeamMember = async (): Promise<void> => {
  const monitoringAlertsParameters = within(await screen.findByTestId('team-monitoring-alerts-configuration'))
  const lowBgInput = monitoringAlertsParameters.getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = monitoringAlertsParameters.getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = monitoringAlertsParameters.getByRole('spinbutton', { name: 'Very low blood glucose input' })

  const outOfRangeThreshold = monitoringAlertsParameters.getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = monitoringAlertsParameters.getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataTxThreshold = monitoringAlertsParameters.getByTestId('basic-dropdown-non-data-selector')

  expect(lowBgInput).toBeDisabled()
  expect(highBgInput).toBeDisabled()
  expect(veryLowBgInput).toBeDisabled()
  expect(outOfRangeThreshold).toHaveClass('Mui-disabled')
  expect(hypoThreshold).toHaveClass('Mui-disabled')
  expect(nonDataTxThreshold).toHaveClass('Mui-disabled')

  const saveButton = monitoringAlertsParameters.queryByRole('button', { name: 'Save' })
  expect(saveButton).not.toBeInTheDocument()
}

export const checkSaveButtonForMmolForPatient = async (): Promise<void> => {
  const monitoringAlertsSection = within(screen.getByTestId('monitoring-alerts-configuration-section'))

  const lowBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'Very low blood glucose input' })
  const outOfRangeThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataTxThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-non-data-selector')
  const saveButton = monitoringAlertsSection.getByTestId('monitoring-alert-config-save')

  expect(within(monitoringAlertsSection.getByTestId('low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(monitoringAlertsSection.getByTestId('high-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(monitoringAlertsSection.getByTestId('very-low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(lowBgInput).toHaveValue(3)
  expect(highBgInput).toHaveValue(7.8)
  expect(veryLowBgInput).toHaveValue(2.2)
  expect(within(outOfRangeThreshold).getByRole('combobox')).toHaveTextContent('5%')
  expect(within(hypoThreshold).getByRole('combobox')).toHaveTextContent('10%')
  expect(within(nonDataTxThreshold).getByRole('combobox')).toHaveTextContent('15%')

  expect(saveButton).toBeDisabled() // No value has been changed, button should be disabled

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '4.8')
  expect(saveButton).toBeEnabled()

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '3.55')
  expect(within(monitoringAlertsSection.getByTestId('low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '4.8')
  expect(saveButton).toBeEnabled()

  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.55')
  expect(within(monitoringAlertsSection.getByTestId('high-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.8')
  expect(saveButton).toBeEnabled()

  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.55')
  expect(within(monitoringAlertsSection.getByTestId('very-low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.2')
  expect(saveButton).toBeEnabled()

  const dropDownOutRange = within(monitoringAlertsSection.getByTestId('dropdown-out-of-range'))
  fireEvent.mouseDown(dropDownOutRange.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '15%' }))

  const dropDownHypo = within(monitoringAlertsSection.getByTestId('dropdown-hypo'))
  fireEvent.mouseDown(dropDownHypo.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '20%' }))

  const dropDownNonData = within(monitoringAlertsSection.getByTestId('dropdown-nonData'))
  fireEvent.mouseDown(dropDownNonData.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '40%' }))

  await userEvent.click(saveButton)

  const expectedMonitoringAlertsParameters = {
    bgUnit: Unit.MmolPerLiter,
    lowBg: 4.8,
    highBg: 8.8,
    veryLowBg: 3.2,
    outOfRangeThreshold: 15,
    hypoThreshold: 20,
    nonDataTxThreshold: 40,
    reportingPeriod: 7
  }
  expect(PatientApi.updatePatientAlerts).toHaveBeenCalledWith(myThirdTeamId, patientWithMmolId, expectedMonitoringAlertsParameters)
  expect(screen.getByText('Patient update succeeded')).toBeVisible()
}

export const checkDiscardButtonForPatient = async (): Promise<void> => {
  const monitoringAlertsSection = within(screen.getByTestId('monitoring-alerts-configuration-section'))

  const lowBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = monitoringAlertsSection.getByRole('spinbutton', { name: 'Very low blood glucose input' })
  const outOfRangeThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataTxThreshold = monitoringAlertsSection.getByTestId('basic-dropdown-non-data-selector')

  expect(within(monitoringAlertsSection.getByTestId('low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(monitoringAlertsSection.getByTestId('high-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(monitoringAlertsSection.getByTestId('very-low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(lowBgInput).toHaveValue(3)
  expect(highBgInput).toHaveValue(7.8)
  expect(veryLowBgInput).toHaveValue(2.2)
  expect(within(outOfRangeThreshold).getByRole('combobox')).toHaveTextContent('5%')
  expect(within(hypoThreshold).getByRole('combobox')).toHaveTextContent('10%')
  expect(within(nonDataTxThreshold).getByRole('combobox')).toHaveTextContent('15%')
  expect(monitoringAlertsSection.queryByRole('button', { name: 'Discard changes' })).not.toBeInTheDocument()
  expect(monitoringAlertsSection.queryByRole('button', { name: 'Apply care team values' })).toBeEnabled()

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '3.55')
  expect(within(monitoringAlertsSection.getByTestId('low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '4.8')

  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.55')
  expect(within(monitoringAlertsSection.getByTestId('high-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.8')

  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.55')
  expect(within(monitoringAlertsSection.getByTestId('very-low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.2')

  const dropDownOutRange = within(monitoringAlertsSection.getByTestId('dropdown-out-of-range'))
  fireEvent.mouseDown(dropDownOutRange.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '15%' }))

  const dropDownHypo = within(monitoringAlertsSection.getByTestId('dropdown-hypo'))
  fireEvent.mouseDown(dropDownHypo.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '20%' }))

  const dropDownNonData = within(monitoringAlertsSection.getByTestId('dropdown-nonData'))
  fireEvent.mouseDown(dropDownNonData.getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: '40%' }))

  expect(monitoringAlertsSection.getByTestId('monitoring-alerts-patient-status-label')).toHaveTextContent('Custom values have been entered. Please save the changes.')
  const discardButton = monitoringAlertsSection.getByRole('button', { name: 'Discard changes' })
  await userEvent.click(discardButton)

  expect(lowBgInput).toHaveValue(3)
  expect(highBgInput).toHaveValue(7.8)
  expect(veryLowBgInput).toHaveValue(2.2)
  expect(within(outOfRangeThreshold).getByRole('combobox')).toHaveTextContent('5%')
  expect(within(hypoThreshold).getByRole('combobox')).toHaveTextContent('10%')
  expect(within(nonDataTxThreshold).getByRole('combobox')).toHaveTextContent('15%')
  expect(monitoringAlertsSection.getByTestId('monitoring-alerts-patient-status-label')).toHaveTextContent('Custom values are applied for this patient. You can apply the default care team values.')
  expect(monitoringAlertsSection.queryByRole('button', { name: 'Apply care team values' })).toBeEnabled()
  expect(monitoringAlertsSection.queryByRole('button', { name: 'Discard changes' })).not.toBeInTheDocument()
}

export const checkTeamValuesButtonMgdl = async (): Promise<void> => {
  const monitoringAlertsSection = screen.getByTestId('monitoring-alerts-configuration-section')

  expect(monitoringAlertsSection).toHaveTextContent('Apply care team valuesCustom values are applied for this patient. You can apply the default care team values.')
  expect(monitoringAlertsSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum​mg/dLMaximum​mg/dLB. Event trigger thresholdTime spent off target5%')
  expect(monitoringAlertsSection).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%')
  expect(monitoringAlertsSection).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Save')

  const saveButton = screen.getByRole('button', { name: 'Save' })
  const careTeamValuesButton = screen.getByRole('button', { name: 'Apply care team values' })
  expect(saveButton).toBeDisabled()

  await userEvent.click(careTeamValuesButton)
  expect(saveButton).toBeEnabled()
  expect(monitoringAlertsSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum​mg/dLMaximum​mg/dLB. Event trigger thresholdTime spent off target5%​')
  expect(monitoringAlertsSection).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​')
  expect(monitoringAlertsSection).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Discard changesSave')
  expect(screen.getByText('The care team values have been entered. Please save the changes.')).toBeVisible()

  jest.spyOn(PatientApi, 'deletePatientAlerts').mockReturnValueOnce(null)
  jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValueOnce([{
    ...patient1Info,
    isUsingTeamAlertParameters: true,
    invitationStatus: UserInviteStatus.Accepted
  }])

  await userEvent.click(saveButton)
  expect(PatientApi.deletePatientAlerts).toHaveBeenCalledWith(myThirdTeamId, patient1Id)
  expect(monitoringAlertsSection).toHaveTextContent('Care team values applied ✔The care team values have been applied to this patient.')
  expect(monitoringAlertsSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum​mg/dLMaximum​mg/dLB. Event trigger thresholdTime spent off target5%​')
  expect(monitoringAlertsSection).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below​mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​')
  expect(monitoringAlertsSection).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Save')
}
