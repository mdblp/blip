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

import { fireEvent, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { monitoredPatientWithMmol, monitoredPatientWithMmolId } from '../data/patient.api.data'
import { Unit } from 'medical-domain'
import PatientApi from '../../../lib/patient/patient.api'
import { myThirdTeamId } from '../mock/team.api.mock'

export const checkMonitoringAlertsDialogContentMgdl = async (): Promise<void> => {
  const configureMonitoringAlertsButton = await screen.findByLabelText('Configure monitoring alerts')
  await userEvent.click(configureMonitoringAlertsButton)
  const dialog = screen.getByRole('dialog')

  expect(dialog).toHaveTextContent('Events configuration1. Time away from targetCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum:​mg/dLMaximum:​mg/dLB. Event trigger thresholdTime spent off target5%​')
  expect(dialog).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below:​mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​')
  expect(dialog).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Default valuesCancelSave')

  const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkMonitoringAlertsDialogContentMmol = async (): Promise<void> => {
  const configureMonitoringAlertsButton = await screen.findByLabelText('Configure monitoring alerts')
  await userEvent.click(configureMonitoringAlertsButton)
  const dialog = screen.getByRole('dialog')
  expect(dialog).toHaveTextContent('Events configuration1. Time away from targetCurrent trigger setting: 5% of time off target (min at 2.8 mmol/L max at 7.8 mmol/L)A. Glycemic targetMinimum:​mmol/LMaximum:​mmol/LB. Event trigger thresholdTime spent off target5%​')
  expect(dialog).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 2.2 mmol/L thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below:​mmol/LB. Event trigger thresholdTime spent in severe hypoglycemia10%​')
  expect(dialog).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Default valuesCancelSave')

  const cancelButton = within(dialog).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}

export const checkMonitoringAlertsDialogSaveButtonMmol = async (): Promise<void> => {
  const configureMonitoringAlertsButton = await screen.findByLabelText('Configure monitoring alerts')
  await userEvent.click(configureMonitoringAlertsButton)
  const dialog = within(screen.getByRole('dialog'))
  const lowBgInput = dialog.getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = dialog.getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = dialog.getByRole('spinbutton', { name: 'Very low blood glucose input' })
  const outOfRangeThreshold = dialog.getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = dialog.getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataTxThreshold = dialog.getByTestId('basic-dropdown-non-data-selector')
  const saveButton = dialog.getByTestId('monitoring-alert-config-save')

  expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
  expect(lowBgInput).toHaveValue(2.8)
  expect(highBgInput).toHaveValue(7.8)
  expect(veryLowBgInput).toHaveValue(2.2)
  expect(within(outOfRangeThreshold).getByRole('button')).toHaveTextContent('5%')
  expect(within(hypoThreshold).getByRole('button')).toHaveTextContent('10%')
  expect(within(nonDataTxThreshold).getByRole('button')).toHaveTextContent('15%')

  expect(saveButton).toBeEnabled()

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '3.55')
  expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '4.8')
  expect(saveButton).toBeEnabled()

  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.55')
  expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '8.8')
  expect(saveButton).toBeEnabled()

  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.55')
  expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '3.2')
  expect(saveButton).toBeEnabled()

  const dopDownOutRange = within(dialog.getByTestId('dropdown-out-of-range'))
  fireEvent.mouseDown(dopDownOutRange.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '15%' }))

  const dropDownHypo = within(dialog.getByTestId('dropdown-hypo'))
  fireEvent.mouseDown(dropDownHypo.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '20%' }))

  const dropDownNonData = within(dialog.getByTestId('dropdown-nonData'))
  fireEvent.mouseDown(dropDownNonData.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '40%' }))

  await userEvent.click(saveButton)

  const expectedMonitoring = {
    ...monitoredPatientWithMmol.monitoring,
    parameters: {
      bgUnit: Unit.MmolPerLiter,
      lowBg: 4.8,
      highBg: 8.8,
      veryLowBg: 3.2,
      outOfRangeThreshold: 15,
      hypoThreshold: 20,
      nonDataTxThreshold: 40,
      reportingPeriod: 7
    }
  }
  expect(PatientApi.updatePatientAlerts).toHaveBeenCalledWith(myThirdTeamId, monitoredPatientWithMmolId, expectedMonitoring)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  expect(screen.getByText('Patient update succeeded')).toBeVisible()
}

export const checkMonitoringAlertsDialogDefaultButtonMgdl = async (): Promise<void> => {
  const configureMonitoringAlertsButton = await screen.findByLabelText('Configure monitoring alerts')
  await userEvent.click(configureMonitoringAlertsButton)
  const dialog = within(screen.getByRole('dialog'))
  const lowBgInput = dialog.getByRole('spinbutton', { name: 'Low blood glucose input' })
  const highBgInput = dialog.getByRole('spinbutton', { name: 'High blood glucose input' })
  const veryLowBgInput = dialog.getByRole('spinbutton', { name: 'Very low blood glucose input' })
  const outOfRangeThreshold = dialog.getByTestId('basic-dropdown-out-of-range-selector')
  const hypoThreshold = dialog.getByTestId('basic-dropdown-hypo-threshold-selector')
  const nonDataThreshold = dialog.getByTestId('basic-dropdown-non-data-selector')
  const saveButton = dialog.getByRole('button', { name: 'Save' })
  const defaultButton = dialog.getByRole('button', { name: 'Default values' })
  const cancelButton = dialog.getByRole('button', { name: 'Cancel' })

  await userEvent.clear(lowBgInput)
  const dropDownOutRange = within(dialog.getByTestId('dropdown-out-of-range'))
  fireEvent.mouseDown(dropDownOutRange.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '15%' }))

  const dropDownHypo = within(dialog.getByTestId('dropdown-hypo'))
  fireEvent.mouseDown(dropDownHypo.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '20%' }))

  const dropDownNonData = within(dialog.getByTestId('dropdown-nonData'))
  fireEvent.mouseDown(dropDownNonData.getByRole('button'))
  fireEvent.click(screen.getByRole('option', { name: '40%' }))

  await userEvent.type(lowBgInput, '50.5')
  expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
  expect(saveButton).toBeDisabled()

  await userEvent.clear(lowBgInput)
  await userEvent.type(lowBgInput, '60')
  expect(saveButton).toBeEnabled()
  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '140.5')
  expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
  expect(saveButton).toBeDisabled()

  await userEvent.clear(highBgInput)
  await userEvent.type(highBgInput, '150')
  expect(saveButton).toBeEnabled()
  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '40.5')
  expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
  expect(saveButton).toBeDisabled()
  await userEvent.clear(veryLowBgInput)
  await userEvent.type(veryLowBgInput, '50')
  expect(dialog.getByText('Current trigger setting: 15% of time off target (min at 60 mg/dL max at 150 mg/dL)')).toBeVisible()
  expect(dialog.getByText('Current trigger setting: 20% of time below 50 mg/dL threshold')).toBeVisible()
  expect(dialog.getByText('Current trigger setting: 40% of data not transmitted over the period')).toBeVisible()

  await userEvent.click(defaultButton)
  expect(lowBgInput).toHaveValue(50)
  expect(highBgInput).toHaveValue(140)
  expect(veryLowBgInput).toHaveValue(40)
  expect(within(outOfRangeThreshold).getByRole('button')).toHaveTextContent('5%')
  expect(within(hypoThreshold).getByRole('button')).toHaveTextContent('10%')
  expect(within(nonDataThreshold).getByRole('button')).toHaveTextContent('15%')
  expect(saveButton).not.toBeDisabled()

  await userEvent.click(cancelButton)
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
}