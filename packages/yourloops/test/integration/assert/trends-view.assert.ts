/*
 * Copyright (c) 2022-2025, Diabeloop
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
import { checkStatTooltip } from './stats.assert'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is 24 hours multiplied by % in range.'
const READINGS_IN_RANGE_TOOLTIP = 'Readings In Range: Number of BGM readings.Derived from 15 BGM readings.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const AVG_GLUCOSE_BGM_TOOLTIP = 'Avg. Glucose (BGM): All BGM glucose values added together, divided by the number of readings.'
const SENSOR_USAGE_TOOLTIP = 'Sensor Usage: Time the CGM collected data, divided by the total time represented in this view.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the average.'
const STANDARD_DEVIATION_BGM_TOOLTIP = 'SD (Standard Deviation): How far values are from the average.Derived from 15 BGM readings.'
const CV_TOOLTIP = 'CV (Coefficient of Variation): The ratio of the standard deviation to the mean glucose. For any period greater than 1 day, we calculate the mean of daily CV.'
const LOOP_MODE_TOOLTIP = 'Time In Loop Mode: Daily average of the time spent in automated basal delivery.How we calculate this: (%) is the duration in loop mode ON or OFF divided by the total duration of basals for this time period. (time) is the average daily time spent in loop mode ON or OFF.'
const AVG_DAILY_CARBS_DECLARED_TOOLTIP = 'Total Carbs: All carb entries added together (meals and rescue carbs), then divided by the number of days in this view.Derived from 6 carb entries, including rescue carbs.'
export const GMI_TOOLTIP_EMPTY_VALUE = 'GMI (Glucose Management Indicator): Tells you what your calculated HbA1c level is likely to be, based on the average glucose level from your CGM readings.Why is this stat empty? There is not enough data present in this view to calculate it.'
export const GMI_TOOLTIP = 'GMI (Glucose Management Indicator): Tells you what your calculated HbA1c level is likely to be, based on the average glucose level from your CGM readings.'

export const checkTrendsTidelineContainerTooltips = async () => {
  // Test tooltips when hovering a cbg slice
  const cbgSlice = await screen.findByTestId('cbg-slice-rectangle-innerQuartiles')
  await userEvent.hover(cbgSlice)
  const tooltipsOnCbgSlice = await screen.findAllByTestId('tooltip')
  expect(tooltipsOnCbgSlice).toHaveLength(3)
  const trendsTooltips = screen.getByTestId('trends-tooltips')
  expect(trendsTooltips).toHaveTextContent('11:00 am - 11:30 am196177')
  const cbgSliceAnimated = screen.getByTestId('cbg-slice-animated')
  expect(cbgSliceAnimated).toBeVisible()
  expect(cbgSliceAnimated).toHaveAttribute('y', '292.2543352601156')
  expect(cbgSliceAnimated).toHaveAttribute('height', '19.768786127167573')

  // Test tooltips when hovering a cbg circle (cbg slice must still be hovered)
  const cbgCircles = await screen.findAllByTestId('trends-cbg-circle')
  expect(cbgCircles).toHaveLength(5)
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
  expect(screen.queryByTestId('cbg-slice-animated')).not.toBeInTheDocument()
}

export const checkTrendsStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Time In Range', TIME_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Sensor Usage', SENSOR_USAGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'CV (CGM)', CV_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Total of declared carbs', AVG_DAILY_CARBS_DECLARED_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'GMI (estimated HbA1c)', GMI_TOOLTIP_EMPTY_VALUE)
  await checkStatTooltip(patientStatistics, 'Time In Loop Mode', LOOP_MODE_TOOLTIP)
}

export const checkTrendsTimeInRangeStatsWidgets = async () => {
  expect(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  expect(screen.getByTestId('cbg-percentage-stat-veryHigh-timeInRange')).toHaveTextContent('1h 30m6%')
  expect(screen.getByTestId('cbg-percentage-stat-high-timeInRange')).toHaveTextContent('7h 30m31%')
  expect(screen.getByTestId('cbg-percentage-stat-target-timeInRange')).toHaveTextContent('3h13%')
  expect(screen.getByTestId('cbg-percentage-stat-low-timeInRange')).toHaveTextContent('4h 30m19%')
  expect(screen.getByTestId('cbg-percentage-stat-veryLow-timeInRange')).toHaveTextContent('7h 30m31%')
}

export const checkSMBGTrendsStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Readings In Range', READINGS_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (BGM)', AVG_GLUCOSE_BGM_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_BGM_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'CV (BGM)', CV_TOOLTIP)
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

  await userEvent.click(medianCheckBox)
  expect(screen.queryAllByTestId('cbgMedian-median')).toHaveLength(0)

  await userEvent.click(medianCheckBox)
  expect(screen.getAllByTestId('cbgMedian-median')).toHaveLength(1)
}

export const checkTrendsLayout = () => {
  const background = screen.getByTestId('trends-background')
  expect(background).toBeVisible()

  const xAxisLabels = screen.getByTestId('trends-x-axis-labels')
  expect(xAxisLabels).toHaveTextContent('12 am3 am6 am9 am12 pm3 pm6 pm9 pm')

  const yAxisLabels = screen.getByTestId('trends-y-axis-labels')
  const veryHighThresholdValue = '250'
  const targetUpperBoundValue = '180'
  const targetLowerBoundValue = '70'
  const veryLowThresholdValue = '54'
  expect(yAxisLabels).toHaveTextContent(`${veryHighThresholdValue}${targetUpperBoundValue}${targetLowerBoundValue}${veryLowThresholdValue}`)

  const targetRangeLines = screen.getByTestId('trends-target-range-lines')
  expect(targetRangeLines).toBeVisible()
}

export const checkTrendsBolusAndCarbsAverage = async () => {
  const wrapper = screen.getByTestId('rescue-carbs-and-manual-bolus-average')
  const rescueCarbsAndManualBolusTitle = screen.getByTestId("title-rescue-carbs-and-manual-bolus-average")

  expect(wrapper).toBeVisible()

  expect(rescueCarbsAndManualBolusTitle).toHaveTextContent("Rescue carb intakes & manual & pen bolus over a period of 2 weeks")
  const mondayButton= screen.getByRole('button', { name: 'M' })

  await userEvent.click(mondayButton)
  expect(rescueCarbsAndManualBolusTitle).toHaveTextContent("Rescue carb intakes & manual & pen bolus over a period of 12 days")
  await userEvent.click(mondayButton)

  expect(within(wrapper).getAllByTestId('carbs-and-bolus-cell')).toHaveLength(8)

  const caption = within(wrapper).getByTestId('rescue-carbs-and-manual-bolus-average-caption')
  expect(caption).toHaveTextContent('Number of rescue carbsNumber of manual & pen bolus')

  expect(within(wrapper).getByTestId('rescue-carbs-cell-12am')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('manual-bolus-cell-12am')).toHaveTextContent('2')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-3am')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('manual-bolus-cell-3am')).toHaveTextContent('4')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-6am')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('manual-bolus-cell-6am')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-9am')).toHaveTextContent('1')
  expect(within(wrapper).getByTestId('manual-bolus-cell-9am')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-12pm')).toHaveTextContent('1')
  expect(within(wrapper).getByTestId('manual-bolus-cell-12pm')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-3pm')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('manual-bolus-cell-3pm')).toHaveTextContent('3')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-6pm')).toHaveTextContent('2')
  expect(within(wrapper).getByTestId('manual-bolus-cell-6pm')).toHaveTextContent('')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-9pm')).toHaveTextContent('1')
  expect(within(wrapper).getByTestId('manual-bolus-cell-9pm')).toHaveTextContent('')

  const carbsCell = within(wrapper).getByTestId('rescue-carbs-cell-6pm')
  await userEvent.hover(carbsCell)
  const rescueCarbsTooltip = screen.getByTestId('tooltip')
  expect(rescueCarbsTooltip).toHaveTextContent('Rescue carbsNumber of rescue carbs2Number of rescue carbs modified0Avg. Recommended carbs128g')
  await userEvent.unhover(carbsCell)

  const bolusCell = within(wrapper).getByTestId('manual-bolus-cell-3pm')
  await userEvent.hover(bolusCell)
  const bolusTooltip = screen.getByTestId('tooltip')
  expect(bolusTooltip).toHaveTextContent('Manual and pen bolusTotal number of bolus3Avg. Confirmed dose11U')
  await userEvent.unhover(bolusCell)

  const oneWeekButton = screen.getByRole('button', { name: '1 week' })
  await userEvent.click(oneWeekButton)
  expect(rescueCarbsAndManualBolusTitle).toHaveTextContent('Rescue carb intakes & manual & pen bolus over a period of 1 week')

  expect(within(wrapper).getByTestId('manual-bolus-cell-12am')).toHaveTextContent('2')
  expect(within(wrapper).getByTestId('manual-bolus-cell-3am')).toHaveTextContent('4')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-9am')).toHaveTextContent('1')
  expect(within(wrapper).getByTestId('manual-bolus-cell-3pm')).toHaveTextContent('3')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-6pm')).toHaveTextContent('2')
  expect(within(wrapper).getByTestId('rescue-carbs-cell-9pm')).toHaveTextContent('1')
}

export const checkReadings100 = async () => {
  const reading100 = screen.getByRole('checkbox', { name: '100% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(1)

  await userEvent.click(reading100)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(0)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(0)

  await userEvent.click(reading100)
  expect(await screen.findAllByTestId('cbg-slice-rectangle-top10')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-bottom10')).toHaveLength(1)
}

export const checkReadings80 = async () => {
  const reading80 = screen.getByRole('checkbox', { name: '80% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(1)

  await userEvent.click(reading80)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(0)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(0)

  await userEvent.click(reading80)
  expect(await screen.findAllByTestId('cbg-slice-rectangle-upper15')).toHaveLength(1)
  expect(screen.getAllByTestId('cbg-slice-rectangle-lower15')).toHaveLength(1)
}

export const checkReadings50 = async () => {
  const reading50 = screen.getByRole('checkbox', { name: '50% of readings' })
  expect(screen.getAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(1)

  await userEvent.click(reading50)
  expect(screen.queryAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(0)

  await userEvent.click(reading50)
  expect(await screen.findAllByTestId('cbg-slice-rectangle-innerQuartiles')).toHaveLength(1)
}
