/*
 * Copyright (c) 2023-2024, Diabeloop
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
import { RESERVOIR_CHANGE_TODAY_DATE } from '../mock/data.api.mock'
import userEvent from '@testing-library/user-event'
import moment from 'moment-timezone'
import format from '../../../../tideline/js/data/util/format'

const reservoirChangeDate = new Date()
reservoirChangeDate.setHours(17)
reservoirChangeDate.setMinutes(0)
const reservoirChangeDateAsString = reservoirChangeDate.toISOString().split('T')

export const checkDeviceUsageWidget = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage3%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 7, 2022 3:01 PMMEAL_RATIO_LUNCH_FACTOR (130% ➞ 90%)Nov 2, 2022 6:00 PMMEAL_RATIO_BREAKFAST_FACTOR (100% ➞ 110%)Nov 2, 2022 6:00 PMMEAL_RATIO_DINNER_FACTOR (100% ➞ 90%)Nov 2, 2022 8:00 AMPATIENT_GLY_HYPER_LIMIT (180.1mg/dL ➞ 140.0mg/dL)Nov 2, 2022 8:00 AMPATIENT_GLY_HYPO_LIMIT (70.0mg/dL ➞ 60.0mg/dL)Nov 1, 2022 1:00 AMBOLUS_AGGRESSIVENESS_FACTOR (143%)Nov 1, 2022 1:00 AMLARGE_MEAL_BREAKFAST (150.0g)Nov 1, 2022 1:00 AMLARGE_MEAL_DINNER (150.0g)Nov 1, 2022 1:00 AMLARGE_MEAL_LUNCH (70.0g)Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR (100%)Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR (110% ➞ 100%)Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR (100%)Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR (90% ➞ 100%)Nov 1, 2022 1:00 AMMEAL_RATIO_LUNCH_FACTOR (130%)Nov 1, 2022 1:00 AMMEDIUM_MEAL_BREAKFAST (70.0g)Nov 1, 2022 1:00 AMMEDIUM_MEAL_DINNER (60.0g)Nov 1, 2022 1:00 AMMEDIUM_MEAL_LUNCH (50.0g)Nov 1, 2022 1:00 AMPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100%)Nov 1, 2022 1:00 AMPATIENT_GLYCEMIA_TARGET (100.0mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT (180.1mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT (140.0mg/dL ➞ 180.1mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT (70.0mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT (60.0mg/dL ➞ 70.0mg/dL)Nov 1, 2022 1:00 AMSMALL_MEAL_BREAKFAST (15.0g)Nov 1, 2022 1:00 AMSMALL_MEAL_DINNER (20.0g)Nov 1, 2022 1:00 AMSMALL_MEAL_LUNCH (30.0g)Nov 1, 2022 1:00 AMTOTAL_INSULIN_FOR_24H (53.0U)Nov 1, 2022 1:00 AMWEIGHT (69.0kg)')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changes')
  const reservoirChange = deviceUsageWidget.getByTestId('reservoir-change')
  await userEvent.hover(reservoirChange)
  expect(deviceUsageWidget.getByTestId('calendar-day-hover')).toHaveTextContent(`${RESERVOIR_CHANGE_TODAY_DATE.format('MMM D')}${format.timestamp(reservoirChangeDateAsString, moment.tz('Europe/Paris').utcOffset())}`)
}

export const checkDeviceUsageWidgetWithTwoWeeksOldData = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage2%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 7, 2022 3:01 PMMEAL_RATIO_LUNCH_FACTOR (130% ➞ 90%)Nov 2, 2022 6:00 PMMEAL_RATIO_BREAKFAST_FACTOR (100% ➞ 110%)Nov 2, 2022 6:00 PMMEAL_RATIO_DINNER_FACTOR (100% ➞ 90%)Nov 2, 2022 8:00 AMPATIENT_GLY_HYPER_LIMIT (180.1mg/dL ➞ 140.0mg/dL)Nov 2, 2022 8:00 AMPATIENT_GLY_HYPO_LIMIT (70.0mg/dL ➞ 60.0mg/dL)Nov 1, 2022 1:00 AMBOLUS_AGGRESSIVENESS_FACTOR (143%)Nov 1, 2022 1:00 AMLARGE_MEAL_BREAKFAST (150.0g)Nov 1, 2022 1:00 AMLARGE_MEAL_DINNER (150.0g)Nov 1, 2022 1:00 AMLARGE_MEAL_LUNCH (70.0g)Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR (100%)Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR (110% ➞ 100%)Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR (100%)Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR (90% ➞ 100%)Nov 1, 2022 1:00 AMMEAL_RATIO_LUNCH_FACTOR (130%)Nov 1, 2022 1:00 AMMEDIUM_MEAL_BREAKFAST (70.0g)Nov 1, 2022 1:00 AMMEDIUM_MEAL_DINNER (60.0g)Nov 1, 2022 1:00 AMMEDIUM_MEAL_LUNCH (50.0g)Nov 1, 2022 1:00 AMPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100%)Nov 1, 2022 1:00 AMPATIENT_GLYCEMIA_TARGET (100.0mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT (180.1mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT (140.0mg/dL ➞ 180.1mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT (70.0mg/dL)Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT (60.0mg/dL ➞ 70.0mg/dL)Nov 1, 2022 1:00 AMSMALL_MEAL_BREAKFAST (15.0g)Nov 1, 2022 1:00 AMSMALL_MEAL_DINNER (20.0g)Nov 1, 2022 1:00 AMSMALL_MEAL_LUNCH (30.0g)Nov 1, 2022 1:00 AMTOTAL_INSULIN_FOR_24H (53.0U)Nov 1, 2022 1:00 AMWEIGHT (69.0kg)')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changes')
  const reservoirChange = deviceUsageWidget.getByTestId('reservoir-change')
  await userEvent.hover(reservoirChange)
  expect(deviceUsageWidget.getByTestId('calendar-day-hover')).toHaveTextContent(`${RESERVOIR_CHANGE_TODAY_DATE.format('MMM D')}${format.timestamp(reservoirChangeDateAsString, moment.tz('Europe/Paris').utcOffset())}`)
}

export const checkDeviceUsageWidgetNoData = async () => {
  const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
  checkTooltip(deviceUsageWidget, 'Sensor Usage')
  expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0%')
  expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
  expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updates')
  expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesNothing to display!')
}
