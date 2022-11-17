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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  CARB_ID1,
  CARB_ID2,
  CBG_ID,
  PARAMETER_ID,
  PHYSICAL_ACTIVITY_ID,
  PHYSICAL_ACTIVITY_TIME,
  RESERVOIR_CHANGE_ID, SMBG_ID
} from '../mock/mockDataAPI'
import moment from 'moment-timezone'
import { checkStatTooltip } from './stats'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is 24 hours multiplied by % in range.'
const READINGS_IN_RANGE_TOOLTIP = 'Readings In Range: Daily average of the number of BGM readings.Derived from 15 BGM readings.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const AVG_GLUCOSE_BGM_TOOLTIP = 'Avg. Glucose (BGM): All BGM glucose values added together, divided by the number of readings.'
const TOTAL_INSULIN_TOOLTIP = 'Total Insulin: All basal and bolus insulin delivery (in Units) added togetherHow we calculate this: (%) is the respective total of basal or bolus delivery divided by total insulin delivered for this time period.'
const TIME_IN_LOOP_MODE_TOOLTIP = 'Time In Loop Mode: Time spent in automated basal delivery.How we calculate this: (%) is the duration in loop mode ON or OFF divided by the total duration of basals for this time period. (time) is 24 hours multiplied by % in loop mode ON or OFF.'
const TOTAL_CARBS_TOOLTIP = 'Total Carbs: All carb entries from meals or rescue carbs added together.Derived from 2 carb entries, including rescue carbs.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the mean.'
const CV_TOOLTIP = 'CV (Coefficient of Variation): The ratio of the standard deviation to the mean glucose. For any period greater than 1 day, we calculate the mean of daily CV.'

const checkTidelineContainerElementTooltip = async (id: string, expectedTextContent: string) => {
  const carbElement = screen.getByTestId(id)
  expect(carbElement).toBeVisible()
  await userEvent.hover(carbElement)
  const tooltip = screen.getByTestId('tooltip')
  expect(tooltip).toHaveTextContent(expectedTextContent)
  await userEvent.unhover(carbElement)
}

export const checkDailyTidelineContainerTooltips = async () => {
  expect(await screen.findByTestId('poolBG_confidential_group', {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  checkTidelineContainerElementTooltip('poolBG_confidential_group', 'Confidential mode')
  checkTidelineContainerElementTooltip('poolBolus_confidential_group', 'Confidential mode')
  checkTidelineContainerElementTooltip('poolBasal_confidential_group', 'Confidential mode')
  checkTidelineContainerElementTooltip(`wizard_group_${CARB_ID1}`, '8:25 pmMealCarbs45gLoop modeBolus TypeStandardDelivered1.3U')
  checkTidelineContainerElementTooltip(`carb_group_${CARB_ID2}`, '2:00 pmConfirmed15g')
  checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_ID}`, `3:00 pmPhysical ActivityIntensitymediumDuration30 minutesEntered at${moment(PHYSICAL_ACTIVITY_TIME).format('h')}:00 pm`)
  checkTidelineContainerElementTooltip(`reservoir_group_${RESERVOIR_CHANGE_ID}`, '7:00 pmInfusion Site change')
  checkTidelineContainerElementTooltip(`param_group_${PARAMETER_ID}`, '10:00 am10:00 amMEAL_RATIO_LUNCH_FACTOR110→100%')
  checkTidelineContainerElementTooltip(`cbg_${CBG_ID}`, '5:30 pmGlucose189')
  checkTidelineContainerElementTooltip(`smbg_${SMBG_ID}`, '5:15 pmGlucose189Calibration')
}

export const checkDailyStatsWidgetsTooltips = async () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  await checkStatTooltip(statsWidgets, 'Time In Range', TIME_IN_RANGE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Total Insulin', TOTAL_INSULIN_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Time In Loop Mode', TIME_IN_LOOP_MODE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Total Carbs', TOTAL_CARBS_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'CV (CGM)', CV_TOOLTIP)
}

export const checkSMBGDailyStatsWidgetsTooltips = async () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  await checkStatTooltip(statsWidgets, 'Readings In Range', READINGS_IN_RANGE_TOOLTIP)
  await checkStatTooltip(statsWidgets, 'Avg. Glucose (BGM)', AVG_GLUCOSE_BGM_TOOLTIP)
}

export const checkDailyTimeInRangeStatsWidgets = () => {
  const statsWidgets = within(screen.getByTestId('stats-widgets'))
  expect(statsWidgets.getByTestId('cbg-percentage-stat-veryHigh-timeInRange')).toHaveTextContent('10m13%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-high-timeInRange')).toHaveTextContent('5m7%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-target-timeInRange')).toHaveTextContent('15m20%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-low-timeInRange')).toHaveTextContent('20m27%')
  expect(statsWidgets.getByTestId('cbg-percentage-stat-veryLow-timeInRange')).toHaveTextContent('25m33%')
  expect(statsWidgets.getByTestId('cbg-percentage-stats-legends')).toHaveTextContent('<5454-7070-180180-250>250mg/dL')
}
