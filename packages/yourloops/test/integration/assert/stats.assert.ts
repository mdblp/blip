/*
 * Copyright (c) 2022-2024, Diabeloop
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

import userEvent from '@testing-library/user-event'
import { type BoundFunctions, type queries, screen, waitFor, within } from '@testing-library/react'

export const checkStatTooltip = async (patientStatistics: BoundFunctions<typeof queries>, infoIconLabel: string, expectedTextContent: string) => {
  const element = patientStatistics.getByText(infoIconLabel)
  const infoIcon = within(element).getByTestId('info-icon')
  await userEvent.hover(infoIcon)
  const tooltip = await screen.findByTestId('stat-tooltip-content')
  expect(tooltip).toHaveTextContent(expectedTextContent)
  await userEvent.unhover(infoIcon)

  await waitFor(() => {
    expect(screen.queryByTestId('stat-tooltip-content')).not.toBeInTheDocument()
  }, { timeout: 3000 })
}

const hoverOnCBGPercentageStat = async (patientStatistics: BoundFunctions<typeof queries>, statId: string, expectedTextContent: string) => {
  await userEvent.hover(patientStatistics.getByTestId(statId))
  expect(patientStatistics.getByTestId('cbg-percentage-title')).toHaveTextContent(expectedTextContent)
  await userEvent.unhover(patientStatistics.getByTestId(statId))
}

export const checkTooltip = (element: BoundFunctions<typeof queries>, labelToQuery: string) => {
  const stat = element.getByText(labelToQuery)
  expect(stat).toBeVisible()
  expect(within(stat).queryByTestId('info-icon')).toBeInTheDocument()
}

export const checkTimeInRangeStatsTitle = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-veryHigh-timeInRange', 'Time Above Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-high-timeInRange', 'Time Above Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-target-timeInRange', 'Time In Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-low-timeInRange', 'Time Below Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-veryLow-timeInRange', 'Time Below Range')
}

export const checkReadingsInRangeStats = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-veryHigh-readingsInRange', 'Readings Above Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-high-readingsInRange', 'Readings Above Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-target-readingsInRange', 'Readings In Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-low-readingsInRange', 'Readings Below Range')
  await hoverOnCBGPercentageStat(patientStatistics, 'cbg-percentage-stat-veryLow-readingsInRange', 'Readings Below Range')
}

export const checkReadingsInRangeStatsWidgets = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryHigh-readingsInRange')).toHaveTextContent('213%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-high-readingsInRange')).toHaveTextContent('17%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-target-readingsInRange')).toHaveTextContent('320%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-low-readingsInRange')).toHaveTextContent('427%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryLow-readingsInRange')).toHaveTextContent('533%')
  expect(patientStatistics.getByTestId('cbg-percentage-stats-legends')).toHaveTextContent('<5454-7070-180180-250>250mg/dL')
}

export const checkAverageGlucoseStatWidget = async (expectedTextContent: string) => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent(expectedTextContent)
}

export const checkStandardDeviationStatWidget = async (expectedTextContent: string) => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent(expectedTextContent)
}

export const checkTotalInsulinStatWidget = async (expectedTextContent: string) => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('container-insulin-stats')).toHaveTextContent(expectedTextContent)
}

export const checkGlucoseManagementIndicator = async (expectedTextContent: string) => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('glucose-management-indicator-stat')).toHaveTextContent(expectedTextContent)
}

export const checkCoefficientOfVariationStatWidget = async (expectedTextContent: string) => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('coefficient-of-variation-stat')).toHaveTextContent(expectedTextContent)
}
