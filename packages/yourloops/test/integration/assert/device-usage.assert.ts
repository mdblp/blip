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

import { screen, within } from '@testing-library/react'
import { checkTooltip } from './stats.assert'
import { TWO_WEEKS_AGO_DATE, YESTERDAY_DATE } from '../mock/data.api.mock'
import userEvent from '@testing-library/user-event'

export const checkDeviceUsageWidget = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage1%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 1, 2022 12:00 amBOLUS_AGGRESSIVENESS_FACTOR (143 %)Nov 1, 2022 12:00 amLARGE_MEAL_BREAKFAST (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_DINNER (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_LUNCH (70.0 g)Nov 2, 2022 5:00 pmMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 110 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 %)Nov 2, 2022 5:00 pmMEAL_RATIO_DINNER_FACTOR (100 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 %)Nov 7, 2022 2:01 pmMEAL_RATIO_LUNCH_FACTOR (130 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_LUNCH_FACTOR (130 %)Nov 1, 2022 12:00 amMEDIUM_MEAL_BREAKFAST (70.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_DINNER (60.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_LUNCH (50.0 g)Nov 1, 2022 12:00 amPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100 %)Nov 2, 2022 7:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 140.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 180.1 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL)Nov 2, 2022 7:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 60.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLYCEMIA_TARGET (100.0 mg/dL)Nov 1, 2022 12:00 amSMALL_MEAL_BREAKFAST (15.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_DINNER (20.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_LUNCH (30.0 g)Nov 1, 2022 12:00 amTOTAL_INSULIN_FOR_24H (53.0 U)Nov 1, 2022 12:00 amWEIGHT (69.0 kg)')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesSunMonTueWedThuFriSat')
  const reservoirChange = deviceUsageWidget.getAllByTestId('reservoir-change')
  await userEvent.hover(reservoirChange[0])
  expect(deviceUsageWidget.getByTestId('calendar-day-hover')).toHaveTextContent(`${YESTERDAY_DATE.format('MMM D')}9:40 pm`)
}

export const checkDeviceUsageWidgetWithTwoWeeksOldData = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage2%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 1, 2022 12:00 amBOLUS_AGGRESSIVENESS_FACTOR (143 %)Nov 1, 2022 12:00 amLARGE_MEAL_BREAKFAST (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_DINNER (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_LUNCH (70.0 g)Nov 2, 2022 5:00 pmMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 110 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 %)Nov 2, 2022 5:00 pmMEAL_RATIO_DINNER_FACTOR (100 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 %)Nov 7, 2022 2:01 pmMEAL_RATIO_LUNCH_FACTOR (130 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_LUNCH_FACTOR (130 %)Nov 1, 2022 12:00 amMEDIUM_MEAL_BREAKFAST (70.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_DINNER (60.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_LUNCH (50.0 g)Nov 1, 2022 12:00 amPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100 %)Nov 2, 2022 7:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 140.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 180.1 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL)Nov 2, 2022 7:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 60.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLYCEMIA_TARGET (100.0 mg/dL)Nov 1, 2022 12:00 amSMALL_MEAL_BREAKFAST (15.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_DINNER (20.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_LUNCH (30.0 g)Nov 1, 2022 12:00 amTOTAL_INSULIN_FOR_24H (53.0 U)Nov 1, 2022 12:00 amWEIGHT (69.0 kg)')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesSunMonTueWedThuFriSat')
  const reservoirChange = deviceUsageWidget.getAllByTestId('reservoir-change')
  await userEvent.hover(reservoirChange[0])
  expect(deviceUsageWidget.getByTestId('calendar-day-hover')).toHaveTextContent(`${TWO_WEEKS_AGO_DATE.format('MMM D')}9:40 pm`)
}

export const checkDeviceUsageWidgetNoData = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updates')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesSunMonTueWedThuFriSat')
}
