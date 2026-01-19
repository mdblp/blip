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

import { act, BoundFunctions, fireEvent, queries, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID,
  ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
  ALARM_EVENT_DANA_OCCLUSION_ID,
  ALARM_EVENT_HYPERGLYCEMIA_ID,
  ALARM_EVENT_HYPOGLYCEMIA_ID,
  ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID,
  ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID,
  ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID,
  ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID,
  ALARM_EVENT_INSIGHT_OCCLUSION_ID,
  ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID,
  ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID,
  ALARM_EVENT_KALEIDO_OCCLUSION_ID,
  ALARM_EVENT_LONG_HYPERGLYCEMIA_ID,
  ALARM_EVENT_LONG_HYPOGLYCEMIA_ID,
  ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID,
  ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID,
  ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
  ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID,
  ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID,
  ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID,
  ALARM_EVENT_URGENT_LOW_SOON_ID,
  BASAL_LOOP_MODE_OFF_ID,
  BASAL_LOOP_MODE_ON_ID,
  BASAL_MANUAL_ID,
  BASAL_TEMP_ID,
  BASAL_TIME_CHANGE_INITAL_TIME_ID,
  CARB_ID,
  CBG_ID,
  CONFIDENTIAL_MODE_ID,
  DUBLIN_TIMEZONE,
  EATING_SHORTLY_BOLUS_ID,
  EATING_SHORTLY_EVENT_ID,
  EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID,
  IOB_ID,
  MANUAL_BOLUS_ID,
  NIGHT_MODE_ID,
  PARAMETER_ID,
  PARIS_TIMEZONE,
  PEN_BOLUS_ID,
  PHYSICAL_ACTIVITY_ID,
  PHYSICAL_ACTIVITY_TIME,
  PHYSICAL_ACTIVITY_WITHOUT_NAME_ID,
  PHYSICAL_ACTIVITY_WITHOUT_NAME_TIME,
  RESERVOIR_CHANGE_ID,
  SMBG_ID,
  WARMUP_01_ID,
  WIZARD_LOW_OVERRIDE_ID,
  WIZARD_LOW_OVERRIDE_INPUT_TIME,
  WIZARD_NEGATIVE_OVERRIDE_ID,
  WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME,
  WIZARD_POSITIVE_OVERRIDE_ID,
  WIZARD_POSITIVE_OVERRIDE_INPUT_TIME,
  WIZARD_UMM_ID,
  WIZARD_UNDELIVERED_ID,
  WIZARD_UNDELIVERED_INPUT_TIME,
  ZEN_MODE_ID,
  ZEN_MODE_ID_WITH_GLY
} from '../mock/data.api.mock'
import moment from 'moment-timezone'
import { checkStatTooltip } from './stats.assert'
import { getTranslation } from '../../utils/i18n'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is 24 hours multiplied by % in range.'
const READINGS_IN_RANGE_TOOLTIP = 'Readings In Range: Number of BGM readings.Derived from 15 BGM readings.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const AVG_GLUCOSE_BGM_TOOLTIP = 'Avg. Glucose (BGM): All BGM glucose values added together, divided by the number of readings.'
const TOTAL_INSULIN_TOOLTIP = 'Total Delivered Insulin: All basal and bolus insulin delivery (in Units) added together.How we calculate this: (%) is the respective total of basal or bolus delivery divided by total insulin delivered for this time period.'
const TIME_IN_LOOP_MODE_TOOLTIP = 'Time In Loop Mode: Time spent in automated basal delivery.How we calculate this: (%) is the duration in loop mode ON or OFF divided by the total duration of basals for this time period. (time) is the estimated time in each mode.'
const TOTAL_CARBS_DECLARED_TOOLTIP = 'Total Carbs: All carb entries from meals or rescue carbs added together.Derived from 5 carb entries, including rescue carbs.'
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

export const checkDailyTidelineContainerTooltipsMgdl = async () => {
  expect(await screen.findByTestId(`poolBG_confidential_group_${CONFIDENTIAL_MODE_ID}`, {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  await checkTidelineContainerElementTooltip(`poolBG_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`poolBolus_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`poolBasal_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_UNDELIVERED_ID}`, `Meal8:25 pmCarbs45gHigh fat mealEntered at ${moment(WIZARD_UNDELIVERED_INPUT_TIME).format('h:mm a')}IOB3.18ULoop modeBolus TypeStandardRecommended25.0UUndelivered2.70UDelivered22.3U`)
  expect(screen.queryByTestId(`wizard_group_${WIZARD_UMM_ID}`)).not.toBeInTheDocument()
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_POSITIVE_OVERRIDE_ID}`, `Meal8:45 pmCarbs100gEntered at ${moment(WIZARD_POSITIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.12ULoop modeBolus TypeStandardRecommended14.35UOverride+5.00UDelivered19.35U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_NEGATIVE_OVERRIDE_ID}`, `Meal8:55 pmCarbs100gEntered at ${moment(WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.06ULoop modeBolus TypeStandardRecommended10.05UOverride−1.0UDelivered9.05U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_LOW_OVERRIDE_ID}`, `Meal9:05 pmCarbs100gEntered at ${moment(WIZARD_LOW_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.06ULoop modeBolus TypeStandardDelivered10.05U`)
  await checkTidelineContainerElementTooltip(`bolus_pen_${PEN_BOLUS_ID}`, 'Pen9:55 pmDelivered4.05U')
  await checkTidelineContainerElementTooltip(`bolus_manual_${MANUAL_BOLUS_ID}`, 'Manual10:55 pmBolus TypeStandardDelivered5.05U')
  await checkTidelineContainerElementTooltip(`carb_group_${CARB_ID}`, '2:00 pmRecommended16gConfirmed15g')
  await checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_ID}`, `Physical Activity3:00 pmNameRunningIntensitymoderateDuration30 minutesEntered at${moment(PHYSICAL_ACTIVITY_TIME).format('h')}:00 pm`)
  await checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_WITHOUT_NAME_ID}`, `Physical Activity4:00 pmIntensitymoderateDuration30 minutesEntered at${moment(PHYSICAL_ACTIVITY_WITHOUT_NAME_TIME).format('h')}:00 pm`)
  await checkTidelineContainerElementTooltip(`reservoir_group_${RESERVOIR_CHANGE_ID}`, 'Pump7:00 pmCartridge change')
  await checkTidelineContainerElementTooltip(`param_group_${PARAMETER_ID}`, 'Settings change6:00 pmAggressiveness for lunch110→100%')
  await checkTidelineContainerElementTooltip(`cbg_${CBG_ID}`, 'Glycemia5:30 pmGlucose189')
  await checkTidelineContainerElementTooltip(`smbg_group_${SMBG_ID}`, 'Glycemia5:15 pmGlucose189Calibration')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPERGLYCEMIA_ID}`, 'Alert 101132:00 amHyperglycemiaG6 readings are above a configurable threshold (250 mg/dL by default).IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPOGLYCEMIA_ID}`, 'Alarm 120003:00 amHypoglycemiaYour glycemia is below 55 mg/dL.IMPORTANT this alarm is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 710023:30 amCartridge emptyThere is no insulin left in the cartridge. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 710014:00 amPump empty batteryThe battery in your pump is dead. Insert a new battery.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID}`, 'Alert 101174:30 amHypoglycemia alertG6 readings are below a configurable threshold (70 mg/dL by default).IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID}`, 'Alarm 710035:00 amIncompatible actions on the pumpSome actions on the pump are not supported. Loop mode is now off and cannot be restarted for up to 3 hours.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 710205:30 amInsulin cartridge expiredInsulin cartridge has expired. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_OCCLUSION_ID}`, 'Alarm 710046:00 amOcclusionThe insulin cannot flow freely. Change the complete infusion set. If the message occurs again, change the cartridge as well.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 410026:30 amEmpty insulin cartridgeYour pump stopped because the insulin cartridge is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 410017:00 amEmpty pump batteryThe pump will stop because its battery is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 410037:30 amInsulin cartridge expiredYour pump stopped because the insulin cartridge has expired.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_OCCLUSION_ID}`, 'Alarm 410048:00 amOcclusionThe pump stopped because it has detected an occlusion.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPERGLYCEMIA_ID}`, 'Alarm 150008:30 amHyperglycemiaThe G6 readings have been higher than 320 mg/dL for more than 20 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPOGLYCEMIA_ID}`, 'Alarm 240009:00 amHypoglycemiaYour G6 reading has been below 60 mg/dL for at least 25 minutes.IMPORTANT: this alarm is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID}`, 'Alert 201009:30 am15 minutes without G6 readings and hypoglycemia riskThe system has not received any G6 reading for 15 minutes. However, the last known G6 reading was less than 100 mg/dL.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID}`, 'Alarm 1100010:00 amSensor session expiredThe sensor session has expired.IMPORTANT: If loop mode was ON, it will stop within the next 30 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID}`, 'Alert 2010210:30 amA sudden rise in glycemia has been notedA sudden rise in glycemia was detected.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_URGENT_LOW_SOON_ID}`, 'Alert 1011211:00 amUrgent low soonThe transmitter predicts that your glucose will be at or below 55 mg/dL in 20 minutes.IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 5100111:30 amPump battery emptyThe pump battery is empty.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID}`, 'Alarm 5100212:00 pmReservoir emptyThere is no insulin left in the reservoir.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID}`, 'Alarm 5100312:30 pmIncompatible action on the pumpCertain actions on the pump are not supported. Loop mode is now OFF and cannot be restarted for up to 3 hours.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_OCCLUSION_ID}`, 'Alarm 510041:00 pmOcclusionAn occlusion was detected, which means that insulin delivery is not working at all or is restricted.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 910011:30 pmPump battery emptyThe pump battery is empty.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID}`, 'Alarm 910022:00 pmReservoir emptyThere is no insulin left in the reservoir.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_OCCLUSION_ID}`, 'Alarm 910042:30 pmOcclusionAn occlusion was detected, which means that insulin delivery is not working at all or is restricted.')
  await checkTidelineContainerElementTooltip(`warmup_group_${WARMUP_01_ID}`,'Sensor warmup6:30 pmSession end9:00 pm')
  await checkTidelineContainerElementTooltip(`event_group_${ZEN_MODE_ID}`,'Zen mode11:00 pmDuration2hours')
  await checkTidelineContainerElementTooltip(`event_group_${ZEN_MODE_ID_WITH_GLY}`,'Zen mode10:00 pmTarget glucose level130mg/dLSet target110mg/dLDifference+20mg/dLDuration2hours')
  await checkTidelineContainerElementTooltip(`basal_group_${BASAL_LOOP_MODE_ON_ID}`,'Basal rate6:30 pmEnd time6:30 pmLoop modeONDelivered0.80U/h')
  await checkTidelineContainerElementTooltip(`basal_group_${BASAL_LOOP_MODE_OFF_ID}`,'Basal rate6:31 pmEnd time6:31 pmLoop modeOFFDelivered0.20U/h')
  await checkTidelineContainerElementTooltip(`basal_group_${BASAL_TEMP_ID}`,'Basal rate6:32 pmEnd time6:32 pmTemp basalDelivered0.30U/h')
  await checkTidelineContainerElementTooltip(`basal_group_${BASAL_MANUAL_ID}`,'Basal rate6:33 pmEnd time6:33 pmLoop modeOFFDelivered0.10U/h')
}

export const checkDailyTidelineContainerTooltipsDBLG2OrRecentSoftware = async () => {
  expect(await screen.findByTestId(`alarmEvent_group_${ALARM_EVENT_HYPERGLYCEMIA_ID}`, {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPERGLYCEMIA_ID}`, 'Alert 101132:00 amYour glucose is highG6 readings are above a configurable threshold (250 mg/dL by default).IMPORTANT: this alert is triggered only if loop mode is OFF.Occurred multiple times with a frequency of 30 minutes or less:at 2:10 am')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPOGLYCEMIA_ID}`, 'Alarm 120003:00 amUrgent LowYour glycemia is below 55 mg/dL.IMPORTANT this alarm is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 710023:30 amCartridge emptyThere is no insulin left in the cartridge. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 710014:00 amPump empty batteryThe battery in your pump is dead. Insert a new battery.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID}`, 'Alert 101174:30 amHypoglycemia alertG6 readings are below a configurable threshold (70 mg/dL by default).IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID}`, 'Alarm 710035:00 amIncompatible actions on the pumpSome actions on the pump are not supported. Loop mode is now off and cannot be restarted for up to 3 hours.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 710205:30 amInsulin cartridge expiredInsulin cartridge has expired. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_OCCLUSION_ID}`, 'Alarm 710046:00 amOcclusionThe insulin cannot flow freely. Change the complete infusion set. If the message occurs again, change the cartridge as well.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 410026:30 amEmpty insulin cartridgeYour pump stopped because the insulin cartridge is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 410017:00 amEmpty pump batteryThe pump will stop because its battery is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 410037:30 amInsulin cartridge expiredYour pump stopped because the insulin cartridge has expired.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_OCCLUSION_ID}`, 'Alarm 410048:00 amOcclusionThe pump stopped because it has detected an occlusion.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPERGLYCEMIA_ID}`, 'Alarm 150008:30 amYour glucose is highHyperglycemia during a period')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPOGLYCEMIA_ID}`, 'Alarm 240009:00 amUrgent LowYour G6 reading has been below 60 mg/dL for at least 25 minutes.IMPORTANT: this alarm is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID}`, 'Alert 201009:30 amNo glucose readings for over 15 minutes. Risk of hypoglycemia.The system has not received any G6 reading for 15 minutes. However, the last known G6 reading was less than 100 mg/dL.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID}`, 'Alarm 1100010:00 amSensor session expiredThe sensor session has expired.IMPORTANT: If loop mode was ON, it will stop within the next 30 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID}`, 'Alert 2010210:30 amRapid rise in glycemiaA sudden rise in glycemia was detected.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_URGENT_LOW_SOON_ID}`, 'Alert 1011211:00 amUrgent low soonThe transmitter predicts that your glucose will be at or below 55 mg/dL in 20 minutes.IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 5100111:30 amPump battery emptyThe pump battery is empty.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_EMPTY_RESERVOIR_ID}`, 'Alarm 5100212:00 pmReservoir emptyThere is no insulin left in the reservoir.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_INCOMPATIBLE_ACTIONS_ON_PUMP_ID}`, 'Alarm 5100312:30 pmIncompatible action on the pumpCertain actions on the pump are not supported. Loop mode is now OFF and cannot be restarted for up to 3 hours.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_DANA_OCCLUSION_ID}`, 'Alarm 510041:00 pmOcclusionAn occlusion was detected, which means that insulin delivery is not working at all or is restricted.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 910011:30 pmPump battery emptyThe pump battery is empty.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_EMPTY_RESERVOIR_ID}`, 'Alarm 910022:00 pmReservoir emptyThere is no insulin left in the reservoir.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_MEDISAFE_OCCLUSION_ID}`, 'Alarm 910042:30 pmOcclusionAn occlusion was detected, which means that insulin delivery is not working at all or is restricted.')
}

export const checkDailyTidelineContainerTooltipsDblg2 = async () => {
  expect(await screen.findByTestId(`nightMode_group_${NIGHT_MODE_ID}`, {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  await checkTidelineContainerElementTooltip(`nightMode_group_${NIGHT_MODE_ID}`, 'Night mode11:00 pmDuration10 hours')
  await checkTidelineContainerElementTooltip(`iob_${IOB_ID}`,'Active insulin5:30 pmInsulin on board (IOB)Insulin25.00U')
  await checkTidelineContainerElementTooltip(`bolus_eating_shortly_${EATING_SHORTLY_BOLUS_ID}`, 'Meal5:30 pmMeal without carb countingLoop modeBolus TypeStandardDelivered0.5U')
  await checkTidelineContainerElementTooltip(`eating_shortly_event_${EATING_SHORTLY_EVENT_ID}`, 'Meal5:30 pmMeal without carb counting')
}

export const checkDailyTidelineContainerTooltipsMmolL = async () => {
  expect(await screen.findByTestId(`poolBG_confidential_group_${CONFIDENTIAL_MODE_ID}`, {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  await checkTidelineContainerElementTooltip(`poolBG_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`poolBolus_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`poolBasal_confidential_group_${CONFIDENTIAL_MODE_ID}`, 'Confidential mode')
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_UNDELIVERED_ID}`, `Meal8:25 pmCarbs45gHigh fat mealEntered at ${moment(WIZARD_UNDELIVERED_INPUT_TIME).format('h:mm a')}IOB3.18ULoop modeBolus TypeStandardRecommended25.0UUndelivered2.70UDelivered22.3U`)
  expect(screen.queryByTestId(`wizard_group_${WIZARD_UMM_ID}`)).not.toBeInTheDocument()
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_POSITIVE_OVERRIDE_ID}`, `Meal8:45 pmCarbs100gEntered at ${moment(WIZARD_POSITIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.12ULoop modeBolus TypeStandardRecommended14.35UOverride+5.00UDelivered19.35U`)
  await checkTidelineContainerElementTooltip(`wizard_group_${WIZARD_NEGATIVE_OVERRIDE_ID}`, `Meal8:55 pmCarbs100gEntered at ${moment(WIZARD_NEGATIVE_OVERRIDE_INPUT_TIME).format('h:mm a')}IOB3.06ULoop modeBolus TypeStandardRecommended10.05UOverride−1.0UDelivered9.05U`)
  await checkTidelineContainerElementTooltip(`carb_group_${CARB_ID}`, 'Rescue carbs2:00 pmRecommended16gConfirmed15g')
  await checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_ID}`, `Physical Activity3:00 pmNameRunningIntensitymoderateDuration30 minutesEntered at${moment(PHYSICAL_ACTIVITY_TIME).format('h')}:00 pm`)
  await checkTidelineContainerElementTooltip(`reservoir_group_${RESERVOIR_CHANGE_ID}`, 'Pump7:00 pmCartridge change')
  await checkTidelineContainerElementTooltip(`param_group_${PARAMETER_ID}`, 'Settings change6:00 pmAggressiveness for lunch110→100%')
  await checkTidelineContainerElementTooltip(`cbg_${CBG_ID}`, 'Glycemia5:30 pmGlucose10.5')
  await checkTidelineContainerElementTooltip(`smbg_group_${SMBG_ID}`, 'Glycemia5:15 pmGlucose10.5Calibration')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPERGLYCEMIA_ID}`, 'Alert 101132:00 amHyperglycemiaG6 readings are above a configurable threshold (13.9 mmol/L by default).IMPORTANT: this alert is triggered only if loop mode is OFF.Occurred multiple times with a frequency of 30 minutes or less:at 2:10 am')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_HYPOGLYCEMIA_ID}`, 'Alarm 120003:00 amHypoglycemiaYour glycemia is below 3.1 mmol/L.IMPORTANT this alarm is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 710023:30 amCartridge emptyThere is no insulin left in the cartridge. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 710014:00 amPump empty batteryThe battery in your pump is dead. Insert a new battery.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_HYPOGLYCEMIA_ID}`, 'Alert 101174:30 amHypoglycemia alertG6 readings are below a configurable threshold (3.9 mmol/L by default).IMPORTANT: this alert is triggered only if loop mode is OFF.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INCOMPATIBLE_ACTIONS_ON_PUMP_ID}`, 'Alarm 710035:00 amIncompatible actions on the pumpSome actions on the pump are not supported. Loop mode is now off and cannot be restarted for up to 3 hours.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 710205:30 amInsulin cartridge expiredInsulin cartridge has expired. Insert a new cartridge.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_INSIGHT_OCCLUSION_ID}`, 'Alarm 710046:00 amOcclusionThe insulin cannot flow freely. Change the complete infusion set. If the message occurs again, change the cartridge as well.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_INSULIN_CARTRIDGE_ID}`, 'Alarm 410026:30 amEmpty insulin cartridgeYour pump stopped because the insulin cartridge is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_EMPTY_PUMP_BATTERY_ID}`, 'Alarm 410017:00 amEmpty pump batteryThe pump will stop because its battery is empty.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_INSULIN_CARTRIDGE_EXPIRED_ID}`, 'Alarm 410037:30 amInsulin cartridge expiredYour pump stopped because the insulin cartridge has expired.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_KALEIDO_OCCLUSION_ID}`, 'Alarm 410048:00 amOcclusionThe pump stopped because it has detected an occlusion.The pump can no longer deliver insulin.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPERGLYCEMIA_ID}`, 'Alarm 150008:30 amHyperglycemiaThe G6 readings have been higher than 17.8 mmol/L for more than 20 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_LONG_HYPOGLYCEMIA_ID}`, 'Alarm 240009:00 amHypoglycemiaYour G6 reading has been below 3.3 mmol/L for at least 25 minutes.IMPORTANT: this alarm is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_NO_READINGS_HYPOGLYCEMIA_RISK_ID}`, 'Alert 201009:30 am15 minutes without G6 readings and hypoglycemia riskThe system has not received any G6 reading for 15 minutes. However, the last known G6 reading was less than 5.6 mmol/L.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SENSOR_SESSION_EXPIRED_ID}`, 'Alarm 1100010:00 amSensor session expiredThe sensor session has expired.IMPORTANT: If loop mode was ON, it will stop within the next 30 minutes.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_SUDDEN_RISE_IN_GLYCEMIA_ID}`, 'Alert 2010210:30 amA sudden rise in glycemia has been notedA sudden rise in glycemia was detected.IMPORTANT: this alert is triggered only if loop mode is ON.')
  await checkTidelineContainerElementTooltip(`alarmEvent_group_${ALARM_EVENT_URGENT_LOW_SOON_ID}`, 'Alert 1011211:00 amUrgent low soonThe transmitter predicts that your glucose will be at or below 3.1 mmol/L in 20 minutes.IMPORTANT: this alert is triggered only if loop mode is OFF.')
}

export const checkDailyStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Time In Range', TIME_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
  await checkStatTooltip(patientStatistics, getTranslation('total-insulin'), TOTAL_INSULIN_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Time In Loop Mode', TIME_IN_LOOP_MODE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Total of declared carbs', TOTAL_CARBS_DECLARED_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'CV (CGM)', CV_TOOLTIP)
}

export const checkSMBGDailyStatsWidgetsTooltips = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  await checkStatTooltip(patientStatistics, 'Readings In Range', READINGS_IN_RANGE_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Avg. Glucose (BGM)', AVG_GLUCOSE_BGM_TOOLTIP)
  await checkStatTooltip(patientStatistics, 'Standard Deviation', STANDARD_DEVIATION_BGM_TOOLTIP)
}

export const checkEventsSuperposition = async () => {
  const eventSuperposition = screen.getByTestId(`eventSuperposition_group_${EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID}`)
  expect(eventSuperposition).toBeVisible()
  expect(eventSuperposition).toHaveTextContent('6')

  await act(async () => fireEvent.mouseDown(eventSuperposition))
  const popover = screen.getByTestId(`events-superposition-popover-${EVENT_SUPERPOSITION_ALARM_EVENT_MEDISAFE_OCCLUSION_ID}`)
  expect(popover).toBeVisible()

  const alarmEventMedisafeOcclusionContentMultipleOccurrences = 'Alarm 910043:00 pmAn occlusion was detected, which means that insulin delivery is not working at all or is restricted.Occurred multiple times with a frequency of 30 minutes or less:at 3:02 pm'
  const alarmEventUrgentLowSoonContent = 'Alert 101123:10 pmThe transmitter predicts that your glucose will be at or below 55 mg/dL in 20 minutes.IMPORTANT: this alert is triggered only if loop mode is OFF.'
  const alarmEventSuddenRiseInGlycemiaContent = 'Alert 201023:20 pmA sudden rise in glycemia was detected.IMPORTANT: this alert is triggered only if loop mode is ON.'
  const warmupContent = 'Sensor warmup3:05 pmSession end9:00 pm'
  const reservoirChangeContent = 'Cartridge change3:15 pm'

  expect(popover).toHaveTextContent(`${alarmEventMedisafeOcclusionContentMultipleOccurrences}${warmupContent}${alarmEventUrgentLowSoonContent}${reservoirChangeContent}${alarmEventSuddenRiseInGlycemiaContent}`)
}

const checkDailyViewChartsCommon = () => {
  const glucoseChartLabel = screen.getByTestId('poolBG-chart-label')
  expect(glucoseChartLabel).toHaveTextContent('Glucose (mg/dL)')

  const eventsChartLabel = screen.getByTestId('poolEvents-chart-label')
  expect(eventsChartLabel).toHaveTextContent('Events')

  const bolusChartLabel = screen.getByTestId('poolBolus-chart-label')
  expect(bolusChartLabel).toHaveTextContent('Bolus (U) & Carbohydrates (g)')

  const basalChartLabel = screen.getByTestId('poolBasal-chart-label')
  expect(basalChartLabel).toHaveTextContent('Basal Rates (U/h)')
}

export const checkDailyViewChartsDblg1 = () => {
  checkDailyViewChartsCommon()

  expect(screen.queryByTestId('poolIob-chart-label')).not.toBeInTheDocument()

  const bolusChartLegend = screen.getByTestId('poolBolus_legend_bolus')
  expect(bolusChartLegend).not.toHaveTextContent('Meal without carb counting')
}

export const checkDailyViewChartsDblg2 = () => {
  checkDailyViewChartsCommon()

  const iobChartLabel = screen.getByTestId('poolIob-chart-label')
  expect(iobChartLabel).toHaveTextContent('Active insulin (U)')

  const bolusChartLegend = screen.getByTestId('poolBolus_legend_bolus')
  expect(bolusChartLegend).toHaveTextContent('Meal without carb counting')
}

export const checkDailyTimeInRangeStatsWidgetsMgdl = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkDailyTimeInRangeStatsWidgetsPercentages(patientStatistics)
  expect(patientStatistics.getByTestId('timeInRange-stats-legends')).toHaveTextContent('<5454-7070-180180-250>250mg/dL')

  expect(patientStatistics.getByTestId('cbg-percentage-stat-tightRange-timeInTightRange')).toHaveTextContent('15m20%')
  expect(patientStatistics.getByTestId('timeInTightRange-stats-legends')).toHaveTextContent('70-140mg/dL')
}

export const checkDailyTimeInRangeStatsWidgetsMmolL = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  checkDailyTimeInRangeStatsWidgetsPercentages(patientStatistics)
  expect(patientStatistics.getByTestId('timeInRange-stats-legends')).toHaveTextContent('<33-44-1010-14>14mmol/L')

  expect(patientStatistics.getByTestId('cbg-percentage-stat-tightRange-timeInTightRange')).toHaveTextContent('15m20%')
  expect(patientStatistics.getByTestId('timeInTightRange-stats-legends')).toHaveTextContent('4-8mmol/L')
}

export const checkTotalCarbsStatContent = async () => {
  const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
  expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Total of declared carbs360gMeal carbs345gRescue carbs15g')
}

export const checkTimeChangeIndicator = async () => {
  expect(await screen.findByTestId(`basal_group_${BASAL_TIME_CHANGE_INITAL_TIME_ID}`, {}, { timeout: 3000 })).toBeVisible() // This is used to wait for the container to be fully initialized
  await checkTidelineContainerElementTooltip(`timechange_${PARIS_TIMEZONE}_${PARIS_TIMEZONE}`,'Time Change2:59 amPrevious time2:00 amNew time2:59 am')
  await checkTidelineContainerElementTooltip(`timechange_${PARIS_TIMEZONE}_${DUBLIN_TIMEZONE}`,'Timezone Change10:30 pmPrevious time11:30 pmEurope/ParisNew time10:30 pmEurope/Dublin')
}

const checkDailyTimeInRangeStatsWidgetsPercentages = (patientStatistics: BoundFunctions<typeof queries>) => {
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryHigh-timeInRange')).toHaveTextContent('10m13%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-high-timeInRange')).toHaveTextContent('5m7%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-target-timeInRange')).toHaveTextContent('15m20%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-low-timeInRange')).toHaveTextContent('20m27%')
  expect(patientStatistics.getByTestId('cbg-percentage-stat-veryLow-timeInRange')).toHaveTextContent('25m33%')
}

export const checkTimeInRangeDefaultStats = async () => {
  const TIRDT1 = within(await screen.findByTestId('time-in-range-dt1-chart'))
  expect(await screen.findByText('70-180', {}, { timeout: 3000 })).toBeVisible()
  expect (TIRDT1.getByTestId('cbg-percentage-stat-timeInRangeDt1-timeInRangeDt1')).toHaveTextContent('15m20%')
}
