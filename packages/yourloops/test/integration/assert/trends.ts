/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { checkStatTooltip } from './stats'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Daily average of the time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is number of readings in range multiplied by the sample frequency.'
const READINGS_IN_RANGE_TOOLTIP = 'Readings In Range: Daily average of the number of BGM readings.Derived from 15 BGM readings.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const AVG_GLUCOSE_BGM_TOOLTIP = 'Avg. Glucose (BGM): All BGM glucose values added together, divided by the number of readings.'
const SENSOR_USAGE_TOOLTIP = 'Sensor Usage: Time the CGM collected data, divided by the total time represented in this view.'
const GMI_TOOLTIP = 'GMI (Glucose Management Indicator): Tells you what your approximate A1C level is likely to be, based on the average glucose level from your CGM readings.Why is this stat empty? There is not enough data present in this view to calculate it.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the mean.'
const CV_TOOLTIP = 'CV (Coefficient of Variation): The ratio of the standard deviation to the mean glucose. For any period greater than 1 day, we calculate the mean of daily CV.'

export const checkTrendsTidelineContainerTooltips = async () => {
  // Test tooltips when hovering a cbg slice
  const cbgSlice = await screen.findByTestId('cbg-slice-rectangle-innerQuartiles')
  await userEvent.hover(cbgSlice)
  const tooltipsOnCbgSlice = await screen.findAllByTestId('tooltip')
  expect(tooltipsOnCbgSlice).toHaveLength(3)
  const trendsTooltips = screen.getByTestId('trends-tooltips')
  expect(trendsTooltips).toHaveTextContent('11:00 am - 11:30 am196177')

  // Test tooltips when hovering a cbg circle (cbg slice must still be hovered)
  const cbgCircles = await screen.findAllByTestId('trends-cbg-circle')
  expect(cbgCircles).toHaveLength(4)
  await userEvent.hover(cbgCircles[0])
  const tooltipsOnCbgCircle = await screen.findAllByTestId('tooltip')
  expect(tooltipsOnCbgCircle).toHaveLength(4)
  expect(tooltipsOnCbgCircle[0]).toHaveTextContent('Saturday, January 18')
  expect(tooltipsOnCbgCircle[1]).toHaveTextContent('11:00 am - 11:30 am')
  expect(tooltipsOnCbgCircle[2]).toHaveTextContent('196')
  expect(tooltipsOnCbgCircle[3]).toHaveTextContent('177')

  // Test tooltips when unhovering cbg circle
  await userEvent.unhover(cbgCircles[0])
  const tooltipsOnCbgCircle2 = await screen.findAllByTestId('tooltip')
  expect(tooltipsOnCbgCircle2).toHaveLength(3)
  expect(tooltipsOnCbgCircle2[0]).toHaveTextContent('11:00 am - 11:30 am')
  expect(tooltipsOnCbgCircle2[1]).toHaveTextContent('196')
  expect(tooltipsOnCbgCircle2[2]).toHaveTextContent('177')

  // Test tooltips when unhovering cbg slice
  await userEvent.unhover(cbgSlice)
  expect(screen.queryAllByTestId('tooltip')).toHaveLength(0)
}

export const checkTrendsStatsWidgetsTooltips = async () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  await checkStatTooltip(statsWidgets, 'Avg. Daily Time In Range', TIME_IN_RANGE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Sensor Usage', SENSOR_USAGE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'GMI (estimated HbA1c)', GMI_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'CV (CGM)', CV_TOOLTIP)
}

export const checkTrendsTimeInRangeStatsWidgets = async () => {
  expect(await screen.findByTestId('stats-widgets', {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  expect(screen.getByTestId('cbg-percentage-stat-veryHigh-timeInRange')).toHaveTextContent('1h 36m7%')
  expect(screen.getByTestId('cbg-percentage-stat-high-timeInRange')).toHaveTextContent('6h 24m27%')
  expect(screen.getByTestId('cbg-percentage-stat-target-timeInRange')).toHaveTextContent('3h 12m13%')
  expect(screen.getByTestId('cbg-percentage-stat-low-timeInRange')).toHaveTextContent('4h 48m20%')
  expect(screen.getByTestId('cbg-percentage-stat-veryLow-timeInRange')).toHaveTextContent('8h33%')
}

export const checkSMBGTrendsStatsWidgetsTooltips = async () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  await checkStatTooltip(statsWidgets, 'Readings In Range', READINGS_IN_RANGE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Avg. Glucose (BGM)', AVG_GLUCOSE_BGM_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'CV (BGM)', CV_TOOLTIP)
}

export const checkRangeSelection = async () => {
  const rangeSelection = within(screen.getByTestId('range-selection'))
  expect(rangeSelection.getByLabelText('100% of readings')).toBeChecked()
  expect(rangeSelection.getByLabelText('80% of readings')).toBeChecked()
  expect(rangeSelection.getByLabelText('50% of readings')).toBeChecked()
  expect(rangeSelection.getByLabelText('Median')).toBeChecked()

  expect(screen.getAllByTestId('cbg-slice-segments')).toHaveLength(1)

  await checkMedian()
  await checkReadings100()
  await checkReadings80()
  await checkReadings50()
}

export const checkDaysSelection = async () => {
  const weekdaysSelection = within(screen.getByTestId('weekdays-selection'))

  expect(weekdaysSelection.getByText('M')).toBeEnabled()
  expect(weekdaysSelection.getByText('Tu')).toBeEnabled()
  expect(weekdaysSelection.getByText('W')).toBeEnabled()
  expect(weekdaysSelection.getByText('Th')).toBeEnabled()
  expect(weekdaysSelection.getByText('F')).toBeEnabled()

  const weekdaysCheckbox = weekdaysSelection.getByRole('checkbox')
  expect(weekdaysCheckbox).toBeChecked()

  const weekendSelection = within(screen.getByTestId('weekend-selection'))

  expect(weekendSelection.getByText('Sa')).toBeEnabled()
  expect(weekendSelection.getByText('Su')).toBeEnabled()

  const weekendCheckbox = weekendSelection.getByRole('checkbox')
  expect(weekendCheckbox).toBeChecked()

  await userEvent.click(weekdaysCheckbox)
  await userEvent.click(weekendCheckbox)

  const dataUnselectedText = screen.getByText('Hang on there! You unselected all of the data!')

  expect(dataUnselectedText).toBeVisible()

  await userEvent.click(weekdaysCheckbox)
  await userEvent.click(weekendCheckbox)

  expect(dataUnselectedText).not.toBeVisible()
}

export const checkMedian = async () => {
  const medianCheckBox = screen.getByRole('checkbox', { name: 'Median' })
  expect(screen.getAllByTestId('cbgMedian-median')).toHaveLength(1)

  await act(async () => {
    await userEvent.click(medianCheckBox)
  })
  expect(screen.queryAllByTestId('cbgMedian-median')).toHaveLength(0)

  await act(async () => {
    await userEvent.click(medianCheckBox)
  })
  expect(screen.getAllByTestId('cbgMedian-median')).toHaveLength(1)
}

export const checkTrendsLayout = () => {
  const background = screen.getByTestId('trends-background')
  expect(background).toBeVisible()

  const xAxisLabels = screen.getByTestId('trends-x-axis-labels')
  expect(xAxisLabels).toHaveTextContent('12 am3 am6 am9 am12 pm3 pm6 pm9 pm')
}

export const checkReadings100 = async () => {
  const reading100 = screen.getByRole('checkbox', { name: '100% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(1)

  await act(async () => {
    await userEvent.click(reading100)
  })
  expect(screen.queryAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(0)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(0)

  await act(async () => {
    await userEvent.click(reading100)
  })
  expect(screen.getAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(1)
}

export const checkReadings80 = async () => {
  const reading80 = screen.getByRole('checkbox', { name: '80% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(1)

  await act(async () => {
    await userEvent.click(reading80)
  })
  expect(screen.queryAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(0)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(0)

  await act(async () => {
    await userEvent.click(reading80)
  })
  expect(screen.getAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(1)
}

export const checkReadings50 = async () => {
  const reading50 = screen.getByRole('checkbox', { name: '50% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(1)

  await act(async () => {
    await userEvent.click(reading50)
  })
  expect(screen.queryAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(0)

  await act(async () => {
    await userEvent.click(reading50)
  })
  expect(screen.getAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(1)
}
