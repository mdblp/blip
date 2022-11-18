/*
 * Copyright (c) 2022, Diabeloop
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
import { BoundFunctions, queries, screen, waitFor, within } from '@testing-library/react'

export const checkStatTooltip = async (statsWidgets: BoundFunctions<typeof queries>, infoIconLabel: string, expectedTextContent: string) => {
  const element = statsWidgets.getByText(infoIconLabel)
  const infoIcon = within(element).getByTestId('info-icon')
  userEvent.hover(infoIcon)
  const tooltip = await screen.findByTestId('stat-tooltip-content')
  expect(tooltip).toHaveTextContent(expectedTextContent)
  userEvent.unhover(infoIcon)
  await waitFor(() => expect(screen.queryByTestId('stat-tooltip-content')).not.toBeInTheDocument(), { timeout: 3000 })
}

const hoverOnCBGPercentageStat = (statsWidgets: BoundFunctions<typeof queries>, statId: string, expectedTextContent: string) => {
  userEvent.hover(statsWidgets.getByTestId(statId))
  expect(statsWidgets.getByTestId('cbg-percentage-title')).toHaveTextContent(expectedTextContent)
  userEvent.unhover(statsWidgets.getByTestId(statId))
}

export const checkNoTooltip = (statsWidgets: BoundFunctions<typeof queries>, labelToQuery: string) => {
  const stat = statsWidgets.getByText(labelToQuery)
  expect(stat).toBeVisible()
  expect(within(stat).queryByTestId('info-icon')).not.toBeInTheDocument()
}

export const checkTimeInRangeStatsTitle = () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-veryHigh-timeInRange', 'Time Above Range ( >250 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-high-timeInRange', 'Time Above Range ( 180-250 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-target-timeInRange', 'Time In Range ( 70-180 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-low-timeInRange', 'Time Below Range ( 54-70 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-veryLow-timeInRange', 'Time Below Range ( <54 )')
}

export const checkReadingsInRangeStats = () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-veryHigh-readingsInRange', 'Readings Above Range ( >250 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-high-readingsInRange', 'Readings Above Range ( 180-250 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-target-readingsInRange', 'Readings In Range ( 70-180 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-low-readingsInRange', 'Readings Below Range ( 54-70 )')
  hoverOnCBGPercentageStat(statsWidgets, 'cbg-percentage-stat-veryLow-readingsInRange', 'Readings Below Range ( <54 )')
}

export const checkReadingsInRangeStatsWidgets = async () => {
  const statsWidgets = within(await screen.findByTestId('stats-widgets', {}, { timeout: 3000 }))
  expect(statsWidgets.getByTestId('cbg-percentage-stat-veryHigh-readingsInRange')).toHaveTextContent('213%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-high-readingsInRange')).toHaveTextContent('17%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-target-readingsInRange')).toHaveTextContent('320%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-low-readingsInRange')).toHaveTextContent('427%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-veryLow-readingsInRange')).toHaveTextContent('533%')
  expect(statsWidgets.getByTestId('cbg-percentage-stats-legends')).toHaveTextContent('<5454-7070-180180-250>250mg/dL')
}

export const checkAverageGlucoseStatWidget = (expectedTextContent: string) => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  expect(statsWidgets.getByTestId('cbg-mean-stat')).toHaveTextContent(expectedTextContent)
}

export const checkStandardDeviationStatWidget = (expectedTextContent: string) => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  expect(statsWidgets.getByTestId('cbg-standard-deviation-stat')).toHaveTextContent(expectedTextContent)
}
