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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { checkStatTooltip } from './tooltip'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Daily average of the time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is number of readings in range multiplied by the sample frequency.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const SENSOR_USAGE_TOOLTIP = 'Sensor Usage: Time the CGM collected data, divided by the total time represented in this view.'
const GMI_TOOLTIP = 'GMI (Glucose Management Indicator): Tells you what your approximate A1C level is likely to be, based on the average glucose level from your CGM readings.Why is this stat empty? There is not enough data present in this view to calculate it.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the mean.'
const CV_TOOLTIP = 'CV (Coefficient of Variation): The ratio of the standard deviation to the mean glucose. For any period greater than 1 day, we calculate the mean of daily CV.'

export const checkTrendsTidelineContainerTooltips = async () => {
  const cbgSlice = await screen.findByTestId('cbg-slice-rectangle-innerQuartiles')
  userEvent.hover(cbgSlice)
  const tooltips = await screen.findAllByTestId('tooltip')
  expect(tooltips).toHaveLength(3)
  expect(tooltips[0]).toHaveTextContent('11:00 am - 11:30 am')
  const trendsTooltips = screen.getByTestId('trends-tooltips')
  expect(within(trendsTooltips).getByText('189')).toBeVisible()
  expect(within(trendsTooltips).getByText('169')).toBeVisible()
  userEvent.unhover(cbgSlice)
}

export const checkTrendsStatsWidgetsTooltips = () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  checkStatTooltip(statsWidgets, 'Avg. Daily Time In Range', TIME_IN_RANGE_TOOLTIP)
  checkStatTooltip(statsWidgets, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  checkStatTooltip(statsWidgets, 'Sensor Usage', SENSOR_USAGE_TOOLTIP)
  checkStatTooltip(statsWidgets, 'GMI (estimated HbA1c)', GMI_TOOLTIP)
  checkStatTooltip(statsWidgets, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  checkStatTooltip(statsWidgets, 'CV (CGM)', CV_TOOLTIP)
}
