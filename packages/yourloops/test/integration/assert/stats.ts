/**
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
import { BoundFunctions, queries, screen, within } from '@testing-library/react'

export const checkStatTooltip = (statsWidgets: BoundFunctions<typeof queries>, infoIconLabel: string, expectedTextContent: string) => {
  const element = statsWidgets.getByText(infoIconLabel)
  const infoIcon = within(element).getByTestId('info-icon')
  userEvent.hover(infoIcon)
  const tooltip = screen.getByTestId('tooltip')
  expect(tooltip).toHaveTextContent(expectedTextContent)
  userEvent.unhover(infoIcon)
}

const hoverOnTimeInRangeStat = (statsWidgets: BoundFunctions<typeof queries>, statId: string, expectedTextContent: string) => {
  userEvent.hover(statsWidgets.getByTestId(statId))
  expect(statsWidgets.getByTestId('time-in-range-stat-title')).toHaveTextContent(expectedTextContent)
  userEvent.unhover(statsWidgets.getByTestId(statId))
}

export const checkTimeInRangeStatsTitle = async () => {
  const statsWidgets = within(await screen.findByTestId('stats-widgets', {}, { timeout: 3000 }))
  hoverOnTimeInRangeStat(statsWidgets, 'time-in-range-stat-veryHigh', 'Time Above Range ( >250 )')
  hoverOnTimeInRangeStat(statsWidgets, 'time-in-range-stat-high', 'Time Above Range ( 180-250 )')
  hoverOnTimeInRangeStat(statsWidgets, 'time-in-range-stat-target', 'Time In Range ( 70-180 )')
  hoverOnTimeInRangeStat(statsWidgets, 'time-in-range-stat-low', 'Time Below Range ( 54-70 )')
  hoverOnTimeInRangeStat(statsWidgets, 'time-in-range-stat-veryLow', 'Time Below Range ( <54 )')
}
