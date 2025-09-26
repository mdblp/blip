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
import { screen } from '@testing-library/react'
import { within } from '@testing-library/dom'
import { getTranslation } from '../../utils/i18n'

export const testAlertsViewContent = async (): Promise<void> => {
  await checkAlertsViewContent()
}

export const testRangeViewContent = async (): Promise<void> => {
  await checkRangeViewContent()
}

export const testRangeConfigurationFields = async (): Promise<void> => {
  // Test severe hyperglycemia field
  const severeHyperglycemiaField = await screen.findByTestId('severe-hyperglycemia-field')
  expect(severeHyperglycemiaField).toBeInTheDocument()

  // Test hyperglycemia field
  const hyperglycemiaField = await screen.findByTestId('hyperglycemia-field')
  expect(hyperglycemiaField).toBeInTheDocument()

  // Test hypoglycemia field
  const hypoglycemiaField = await screen.findByTestId('hypoglycemia-field')
  expect(hypoglycemiaField).toBeInTheDocument()

  // Test severe hypoglycemia field
  const severeHypoglycemiaField = await screen.findByTestId('severe-hypoglycemia-field')
  expect(severeHypoglycemiaField).toBeInTheDocument()
}

export const testRangeVisualizationChart = async (): Promise<void> => {
  //Test range visualization component
  const rangeChart = await screen.findByTestId('range-visualization-chart')
  expect(rangeChart).toBeInTheDocument()

  // Test chart elements
  const hyperL2Label = within(rangeChart).getByText(getTranslation('severe-hyperglycemia'))
  const hyperL1Label = within(rangeChart).getByText(getTranslation('hyperglycemia'))
  const hypoL1Label = within(rangeChart).getByText(getTranslation('hypoglycemia'))
  const hypoL2Label = within(rangeChart).getByText(getTranslation('severe-hypoglycemia'))

  expect(hyperL2Label).toBeInTheDocument()
  expect(hyperL1Label).toBeInTheDocument()
  expect(hypoL1Label).toBeInTheDocument()
  expect(hypoL2Label).toBeInTheDocument()
}

export const testRangeFieldValidation = async (): Promise<void> => {
  // Test that range bounds are logically ordered
  const targetLowerBound = await screen.findByTestId('target-lower-bound')
  const targetUpperBound = await screen.findByTestId('target-upper-bound')
  const veryLowThreshold = await screen.findByTestId('very-low-threshold')
  const veryHighThreshold = await screen.findByTestId('very-high-threshold')

  expect(targetLowerBound).toBeInTheDocument()
  expect(targetUpperBound).toBeInTheDocument()
  expect(veryLowThreshold).toBeInTheDocument()
  expect(veryHighThreshold).toBeInTheDocument()

  // Verify logical order of values (if displayed as text content)
  const lowerValue = parseInt(targetLowerBound.textContent || '0')
  const upperValue = parseInt(targetUpperBound.textContent || '0')

  expect(lowerValue).toBeLessThan(upperValue)
}

export const testRangeUnitDisplay = async (expectedUnit: string): Promise<void> => {
  // Test that the correct unit is displayed
  const unitDisplay = await screen.findByText(expectedUnit)
  expect(unitDisplay).toBeInTheDocument()

  // Test unit appears in all range fields
  const rangeFields = screen.getAllByTestId(/.*-field/)
  rangeFields.forEach(field => {
    const unitInField = within(field).queryByText(expectedUnit)
    expect(unitInField).toBeInTheDocument()
  })
}
