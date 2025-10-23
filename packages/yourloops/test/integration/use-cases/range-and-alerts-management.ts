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

import { checkAlertsViewContent, checkRangeViewContent } from '../assert/range-and-alerts-view.assert'
import { screen, waitFor } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { getTranslation } from '../../utils/i18n'
import userEvent from '@testing-library/user-event'
import PatientApi from '../../../lib/patient/patient.api'
import { Unit } from 'medical-domain'
import { myThirdTeamId } from '../mock/team.api.mock'
import { patient1Id } from '../data/patient.api.data'

export const testAlertsViewContent = async (): Promise<void> => {
  await checkAlertsViewContent()
}

export const testRangeViewContent = async (): Promise<void> => {
  await checkRangeViewContent()
}

export const testRangePatientProfileDisplay = async (diabeticTypeTextKey: string, expectedSevereHyper: number, expectedHyper: number, expectedHypo: number, expectedSevereHypo: number): Promise<void> => {
  const selectedChip = within(screen.getByTestId('patient-type-selection')).getByText(getTranslation(diabeticTypeTextKey))
  await userEvent.click(selectedChip)

  const rangeSection = within(screen.getByTestId('range-container'))
  const severeHyperInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-severe-hyperglycemia') })
  expect(severeHyperInput).toBeVisible()
  expect(severeHyperInput).toHaveValue(expectedSevereHyper)

  const hyperInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-hyperglycemia') })
  expect(hyperInput).toBeVisible()
  expect(hyperInput).toHaveValue(expectedHyper)

  const hypoInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-hypoglycemia') })
  expect(hypoInput).toBeVisible()
  expect(hypoInput).toHaveValue(expectedHypo)

  const severeHypoInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-severe-hypoglycemia') })
  expect(severeHypoInput).toBeVisible()
  expect(severeHypoInput).toHaveValue(expectedSevereHypo)

  switch (diabeticTypeTextKey) {
    case "range-profile-type-1-and-2":
      expect(severeHyperInput).toBeDisabled()
      expect(hyperInput).toBeDisabled()
      expect(hypoInput).toBeDisabled()
      expect(severeHypoInput).toBeDisabled()
      break
    case "range-profile-pregnancy-type-1":
      expect(hyperInput).toBeDisabled()
      expect(hypoInput).toBeDisabled()
      break
  }

  const expectedLineCount = 4 // 4 thresholds
  const chart = screen.getByTestId('range-visualization-chart')
  expect(chart).toBeVisible()
  expect(chart.querySelectorAll('line').length).toBe(expectedLineCount)
  // Verify chart renders all threshold text labels with values
  const textElements = chart.querySelectorAll('text')
  const thresholdTexts = Array.from(textElements).map(el => el.textContent)

  // Should contain threshold values with units (mg/dL by default)
  expect(thresholdTexts).toEqual(expect.arrayContaining([
    expect.stringContaining(expectedSevereHyper.toString()),
    expect.stringContaining(expectedHyper.toString()),
    expect.stringContaining(expectedHypo.toString()),
    expect.stringContaining(expectedSevereHypo.toString())
  ]))
}

export const testRangeUnitDisplay = async (expectedUnit: string): Promise<void> => {
  const rangeFields = screen.getAllByTestId(/.*-field/)
  rangeFields.forEach(field => {
    expect(field).toBeVisible()
    expect(field).toHaveTextContent(expectedUnit)
  })
}

export const testSaveButtonForRanges = async () : Promise<void>  => {
  const selectedChip = within(screen.getByTestId('patient-type-selection')).getByText(getTranslation('range-profile-custom'))
  await userEvent.click(selectedChip)

  await fillRangeForm( 200, 150, 80, 50)

  const saveButton = screen.getByRole('button', { name: getTranslation('button-save') })
  expect(saveButton).toBeVisible()
  await userEvent.click(saveButton)
  const expectedPayload = {
    type: "custom",
    bloodGlucosePreference: {
      bgUnits: "mg/dL",
      bgBounds: {
        veryHighThreshold: 200,
        targetUpperBound: 150,
        targetLowerBound : 80,
        veryLowThreshold: 50
      },
      bgClasses: {
        veryHigh: 600,
        high: 200,
        target: 150,
        low: 80,
        veryLow: 50
      },
    }
  }

  expect(PatientApi.updatePatientDiabeticProfile).toHaveBeenCalledWith('patient1Id', expectedPayload)

  const dialog = screen.getByTestId('confirm-dialog')
  expect(dialog).toBeVisible()
  expect(dialog).toHaveTextContent(getTranslation('adapt-alerts-title'))
  expect(dialog).toHaveTextContent(getTranslation('adapt-alerts-message'))

  const keepCurrentAlertsButton = within(dialog).getByRole('button', { name: getTranslation('adapt-alerts-close') })
  expect(keepCurrentAlertsButton).toBeVisible()
  const adaptAlertsButton = within(dialog).getByRole('button', { name: getTranslation('adapt-alerts-confirm') })
  expect(adaptAlertsButton).toBeVisible()
  await userEvent.click(adaptAlertsButton)

  // check the api call
  const expectedMonitoringAlertsParameters = {
    bgUnit: Unit.MilligramPerDeciliter,
    lowBg: 80,
    highBg: 150,
    outOfRangeThreshold: 50,
    veryLowBg: 50,
    hypoThreshold: 5,
    nonDataTxThreshold: 50,
    reportingPeriod: 168
  }
  const closingDialogDelayInMS = 400
  expect(PatientApi.updatePatientAlerts).toHaveBeenCalledWith(myThirdTeamId, patient1Id, expectedMonitoringAlertsParameters)
  await waitFor(() => {
    expect(screen.getByText(getTranslation('patient-update-with-alert-success'))).toBeVisible()
  }, { timeout: closingDialogDelayInMS })
}

export const testRangeFormValidation = async () : Promise<void>  => {
  const selectedChip = within(screen.getByTestId('patient-type-selection')).getByText(getTranslation('range-profile-custom'))
  await userEvent.click(selectedChip)

  // test orders Severe hyper > Hyper > Hypo > Severe hypo
  await fillRangeForm( 100, 101, 102, 103)
  const saveButton = screen.getByRole('button', { name: getTranslation('button-save') })
  expect(saveButton).toBeDisabled()
  expect(screen.getByText(getTranslation('error-severe-hyperglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-hyperglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-hypoglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-severe-hypoglycemia'))).toBeVisible()

  await fillRangeForm(100, 100, 100, 100)
  expect(saveButton).toBeDisabled()
  expect(screen.getByText(getTranslation('error-severe-hyperglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-hyperglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-hypoglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-severe-hypoglycemia'))).toBeVisible()

  await fillRangeForm(999, 998, 997, 996)
  expect(saveButton).toBeDisabled()
  // expect only two errors as the min max values are done on the severe hyper and severe hypo fieldsm
  expect(screen.getByText(getTranslation('error-severe-hyperglycemia'))).toBeVisible()
  expect(screen.getByText(getTranslation('error-severe-hypoglycemia'))).toBeVisible()

}

async function fillRangeForm(severeHyper: number, hyper: number, hypo: number, severeHypo: number) {
  const rangeSection = within(screen.getByTestId('range-container'))

  const severeHyperInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-severe-hyperglycemia') })
  expect(severeHyperInput).toBeVisible()
  await userEvent.clear(severeHyperInput)
  await userEvent.type(severeHyperInput, severeHyper.toString())
  expect(severeHyperInput).toHaveValue(severeHyper)

  const hyperInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-hyperglycemia') })
  expect(hyperInput).toBeVisible()
  await userEvent.clear(hyperInput)
  await userEvent.type(hyperInput, hyper.toString())
  expect(hyperInput).toHaveValue(hyper)

  const hypoInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-hypoglycemia') })
  expect(hypoInput).toBeVisible()
  await userEvent.clear(hypoInput)
  await userEvent.type(hypoInput, hypo.toString())
  expect(hypoInput).toHaveValue(hypo)

  const severeHypoInput = rangeSection.getByRole('spinbutton', { name: getTranslation('range-severe-hypoglycemia') })
  expect(severeHypoInput).toBeVisible()
  await userEvent.clear(severeHypoInput)
  await userEvent.type(severeHypoInput, severeHypo.toString())
  expect(severeHypoInput).toHaveValue(severeHypo)
}
