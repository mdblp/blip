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

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ALARM_EVENT_EMPTY_INSULIN_CARTRIDGE_ID,
  ALARM_EVENT_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_HYPERGLYCEMIA_ID,
  ALARM_EVENT_HYPOGLYCEMIA_ID,
  ALARM_EVENT_INSULIN_CARTRIDGE_EXPIRED_ID,
  ALARM_EVENT_LONG_HYPERGLYCEMIA_ID,
  ALARM_EVENT_LONG_HYPOGLYCEMIA_ID,
  ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID,
  ALARM_EVENT_OCCLUSION_ID,
  ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID,
  ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
  ALARM_EVENT_URGENT_LOW_SOON_ID,
  CARB_ID,
  CBG_ID,
  PARAMETER_ID,
  PHYSICAL_ACTIVITY_ID,
  PHYSICAL_ACTIVITY_TIME,
  RESERVOIR_CHANGE_ID,
  SMBG_ID,
  WIZARD_NEGATIVE_OVERRIDE_ID,
  WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME,
  WIZARD_POSITIVE_OVERRIDE_ID,
  WIZARD_POSITIVE_OVERRIDE_INPUT_TIME,
  WIZARD_UMM_ID,
  WIZARD_UMM_INPUT_TIME,
  WIZARD_UNDELIVERED_ID,
  WIZARD_UNDELIVERED_INPUT_TIME
} from '../mock/data.api.mock'
import moment from 'moment-timezone'
import { checkStatTooltip } from './stats.assert'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is 24 hours multiplied by % in range.'
const READINGS_IN_RANGE_TOOLTIP = 'Readings In Range: Daily average of the number of BGM readings.Derived from 15 BGM readings.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const AVG_GLUCOSE_BGM_TOOLTIP = 'Avg. Glucose (BGM): All BGM glucose values added together, divided by the number of readings.'
const TOTAL_INSULIN_TOOLTIP = 'Total Insulin: All basal and bolus insulin delivery (in Units) added togetherHow we calculate this: (%) is the respective total of basal or bolus delivery divided by total insulin delivered for this time period.'
const TIME_IN_LOOP_MODE_TOOLTIP = 'Time In Loop Mode: Time spent in automated basal delivery.How we calculate this: (%) is the duration in loop mode ON or OFF divided by the total duration of basals for this time period. (time) is the estimated time in each mode.'
const TOTAL_CARBS_TOOLTIP = 'Total Carbs: All carb entries from meals or rescue carbs added together.Derived from 5 carb entries, including rescue carbs.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the average.'
const STANDARD_DEVIATION_BGM_TOOLTIP = 'SD (Standard Deviation): How far values are from the average.Derived from 15 BGM readings.'
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
  await checkTidelineContainerElementTooltip('poolBG_confidential_group', 'Confidential mode')
  await checkTidelineContainerElementTooltip('poolBolus_confidential_group', 'Confidential mode')
  await checkTidelineContainerElementTooltip('poolBasal_confidential_group', 'Confidential mode')
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_UNDELIVERED_ID}`, `8:25 pmMealCarbs45gHigh fat mealEntered at ${moment(WIZARD_UNDELIVERED_INPUT_TIME).format('h:mm a')}IOB3.18ULoop modeBolus TypeStandardRecommended25.0UUndelivered2.70UDelivered22.3U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_UMM_ID}`, `8:35 pmUnannounced mealEstimated carbs50gEntered at ${moment(WIZARD_UMM_INPUT_TIME).format('h:mm a')}Loop modeBolus TypeStandardDelivered1.3U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_POSITIVE_OVERRIDE_ID}`, `8:45 pmMealCarbs100gEntered at ${moment(WIZARD_POSITIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.12ULoop modeBolus TypeStandardRecommended14.35UOverride+5.00UDelivered19.35U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_NEGATIVE_OVERRIDE_ID}`, `8:55 pmMealCarbs100gEntered at ${moment(WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.06ULoop modeBolus TypeStandardRecommended10.05UOverride−1.0UDelivered9.05U`)
  await checkTidelineContainerElementTooltip(`carb_group_${CARB_ID}`, '2:00 pmRecommended16gConfirmed15g')
  await checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_ID}`, `3:00 pmPhysical ActivityIntensitymoderateDuration30 minutesEntered at${moment(PHYSICAL_ACTIVITY_TIME).format('h')}:00 pm`)
  await checkTidelineContainerElementTooltip(`reservoir_group_${RESERVOIR_CHANGE_ID}`, '7:00 pmCartridge change')
  await checkTidelineContainerElementTooltip(`param_group_${PARAMETER_ID}`, '10:00 am10:00 amMEAL_RATIO_LUNCH_FACTOR110→100%')
  await checkTidelineContainerElementTooltip(`cbg_${CBG_ID}`, '5:30 pmGlucose189')
  await checkTidelineContainerElementTooltip(`smbg_${SMBG_ID}`, '5:15 pmGlucose189Calibration')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_EMPTY_INSULIN_CARTRIDGE_ID}`, '11:00 amAlarm 41002Empty insulin cartridgeYour pump stopped because the insulin cartridge is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_EMPTY_PUMP_BATTERY_ID}`, '11:05 amAlarm 41001Empty pump batteryThe pump will stop because its battery is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSULIN_CARTRIDGE_EXPIRED_ID}`, '11:10 amAlarm 41003Insulin cartridge expiredYour pump stopped because the insulin cartridge has expired.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPERGLYCEMIA_ID}`, '11:15 amAlert 10113HyperglycemiaG6 readings are above a configurable threshold (250 mg/dL by default).IMPORTANT this alert is triggered only if loop mode is deactivated.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPOGLYCEMIA_ID}`, '11:20 amAlarm 12000HypoglycemiaYour glycemia is below 55 mg/dL.IMPORTANT this alarm is triggered only if loop mode is deactivated.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPERGLYCEMIA_ID}`, '11:25 amAlarm 15000HyperglycemiaThe G6 readings have been higher than 320 mg/dL for more than 20 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPOGLYCEMIA_ID}`, '11:30 amAlarm 24000HypoglycemiaYour G6 reading has been below 61 mg/dL for at least 25 minutes.IMPORTANT this alarm is triggered only if loop mode is activated.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID}`, '11:35 amAlert 20100No readings and hypoglycemia riskThe system has not received any G6 reading for 15 minutes. However, the last known G6 reading was less than 100 mg/dL.IMPORTANT this alert is triggered only if loop mode is activated.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_OCCLUSION_ID}`, '11:40 amAlarm 41004OcclusionThe pump stopped because it has detected an occlusion.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID}`, '11:45 amAlarm 11000Sensor session expiredThe sensor session has expired.IMPORTANT If loop mode was running, it will stop within the next 30 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID}`, '11:50 amAlert 20102A sudden rise in glycemiaA sudden rise in glycemia was detected.IMPORTANT this alert is triggered only if loop mode is activated.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_URGENT_LOW_SOON_ID}`, '11:55 amAlert 10112Urgent low soonThe transmitter predicts that your sensor glucose will be at or below 55 mg/dL in 2 minutes.IMPORTANT this alert is triggered only if loop mode is deactivated.')
}

export const checkDailyStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Time In Range', TIME_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Total Insulin', TOTAL_INSULIN_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Time In Loop Mode', TIME_IN_LOOP_MODE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Total Carbs', TOTAL_CARBS_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'CV (CGM)', CV_TOOLTIP)
}

export const checkSMBGDailyStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Readings In Range', READINGS_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (BGM)', AVG_GLUCOSE_BGM_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_BGM_TOOLTIP)
}

export const checkDailyTimeInRangeStatsWidgets = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryHigh-timeInRange')).toHaveTextContent('10m13%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-high-timeInRange')).toHaveTextContent('5m7%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-target-timeInRange')).toHaveTextContent('15m20%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-low-timeInRange')).toHaveTextContent('20m27%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryLow-timeInRange')).toHaveTextContent('25m33%')
  expect(patientStatistics.getByTestId('cbg-percentage-stats-legends')).toHaveTextContent('<5454-7070-180180-250>250mg/dL')
}
