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

import { screen, within } from '@testing-library/react'
import { getTranslation } from '../../utils/i18n'

export const checkAlertsViewContent = async (): Promise<void> => {
  const alertsContent = await screen.findByTestId('alerts-container')
  expect(alertsContent).toHaveTextContent(getTranslation('monitoring-alerts'))
  expect(alertsContent).toHaveTextContent('Monitoring alertsSet manually each value or apply care team values.')
}

export const checkRangeViewContent = async (): Promise<void> => {
  const rangeContent = await screen.findByTestId('ranges-container')
  expect(rangeContent).toHaveTextContent(getTranslation('range'))
  expect(rangeContent).toHaveTextContent(getTranslation('range-description'))

  // Test patient type selection chip
  const typeSelectionContainer = within(rangeContent).getByTestId('patient-type-selection')
  expect(typeSelectionContainer).toBeInTheDocument()

  // Verify patient type chips are present
  const type1Type2Chip = within(typeSelectionContainer).getByText(getTranslation('type-1-and-2'))
  const pregnancyType1Chip = within(typeSelectionContainer).getByText(getTranslation('pregnancy-type-1'))
  const customChip = within(typeSelectionContainer).getByText(getTranslation('custom'))

  expect(type1Type2Chip).toBeVisible()
  expect(pregnancyType1Chip).toBeVisible()
  expect(customChip).toBeVisible()

  // Test range configuration form
  const rangeConfigForm = within(rangeContent).getByTestId('range-configuration-form')
  expect(rangeConfigForm).toBeVisible()
}
