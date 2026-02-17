/*
 * Copyright (c) 2023-2025, Diabeloop
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
import { RESERVOIR_CHANGE_13_DAYS_AGO_DATE } from '../mock/data.api.mock'

const reservoirChangeDate = new Date()
reservoirChangeDate.setHours(17)
reservoirChangeDate.setMinutes(0)

export const checkDeviceUsageWidget = async () => {
  const devicesUsageCard = within(screen.getByTestId('devices-usage-card'))
  checkTooltip(devicesUsageCard, 'Sensor Usage')
  expect(devicesUsageCard.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage2%')

  expect(screen.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGMDexcom G6DBLDiabeloopPumpVICENTRA')
  expect(screen.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 7, 2022 3:01 PMAggressiveness for lunch (130% ➞ 90%)Nov 2, 2022 6:00 PMAggressiveness for breakfast (100% ➞ 110%)Nov 2, 2022 6:00 PMAggressiveness for dinner (100% ➞ 90%)Nov 2, 2022 8:00 AMHyperglycemia threshold (180.1mg/dL ➞ 140.0mg/dL)Nov 2, 2022 8:00 AMHypoglycemia threshold (70.0mg/dL ➞ 60.0mg/dL)Nov 1, 2022 1:00 AMAggressiveness in hyperglycemia (143%)Nov 1, 2022 1:00 AMBreakfast - large (150.0g)Nov 1, 2022 1:00 AMDinner - large (150.0g)Nov 1, 2022 1:00 AMLunch - large (70.0g)Nov 1, 2022 1:00 AMAggressiveness for breakfast (100%)Nov 1, 2022 1:00 AMAggressiveness for breakfast (110% ➞ 100%)Nov 1, 2022 1:00 AMAggressiveness for dinner (100%)Nov 1, 2022 1:00 AMAggressiveness for dinner (90% ➞ 100%)Nov 1, 2022 1:00 AMAggressiveness for lunch (130%)Nov 1, 2022 1:00 AMBreakfast - average (70.0g)Nov 1, 2022 1:00 AMDinner - average (60.0g)Nov 1, 2022 1:00 AMLunch - average (50.0g)Nov 1, 2022 1:00 AMAggressiveness in normoglycemia (100%)Nov 1, 2022 1:00 AMTarget glucose level (100.0mg/dL)Nov 1, 2022 1:00 AMHyperglycemia threshold (180.1mg/dL)Nov 1, 2022 1:00 AMHyperglycemia threshold (140.0mg/dL ➞ 180.1mg/dL)Nov 1, 2022 1:00 AMHypoglycemia threshold (70.0mg/dL)Nov 1, 2022 1:00 AMHypoglycemia threshold (60.0mg/dL ➞ 70.0mg/dL)Nov 1, 2022 1:00 AMBreakfast - small (15.0g)Nov 1, 2022 1:00 AMDinner - small (20.0g)Nov 1, 2022 1:00 AMLunch - small (30.0g)Nov 1, 2022 1:00 AMTotal Daily Insulin (53.0U)Nov 1, 2022 1:00 AMWeight (69.0kg)')

  expect(await screen.findByTestId('cartridge-changes-stat', {}, { timeout: 3000 })).toHaveTextContent(`Cartridge changesNo cartridge changes over the period`)}

export const checkDeviceUsageWidgetWithTwoWeeksOldData = async () => {
  const devicesUsageCard = within(screen.getByTestId('devices-usage-card'))
  checkTooltip(devicesUsageCard, 'Sensor Usage')
  expect(devicesUsageCard.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage2%')

  expect(screen.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGMDexcom G6DBLDiabeloopPumpVICENTRA')
  expect(screen.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 7, 2022 3:01 PMAggressiveness for lunch (130% ➞ 90%)Nov 2, 2022 6:00 PMAggressiveness for breakfast (100% ➞ 110%)Nov 2, 2022 6:00 PMAggressiveness for dinner (100% ➞ 90%)Nov 2, 2022 8:00 AMHyperglycemia threshold (180.1mg/dL ➞ 140.0mg/dL)Nov 2, 2022 8:00 AMHypoglycemia threshold (70.0mg/dL ➞ 60.0mg/dL)Nov 1, 2022 1:00 AMAggressiveness in hyperglycemia (143%)Nov 1, 2022 1:00 AMBreakfast - large (150.0g)Nov 1, 2022 1:00 AMDinner - large (150.0g)Nov 1, 2022 1:00 AMLunch - large (70.0g)Nov 1, 2022 1:00 AMAggressiveness for breakfast (100%)Nov 1, 2022 1:00 AMAggressiveness for breakfast (110% ➞ 100%)Nov 1, 2022 1:00 AMAggressiveness for dinner (100%)Nov 1, 2022 1:00 AMAggressiveness for dinner (90% ➞ 100%)Nov 1, 2022 1:00 AMAggressiveness for lunch (130%)Nov 1, 2022 1:00 AMBreakfast - average (70.0g)Nov 1, 2022 1:00 AMDinner - average (60.0g)Nov 1, 2022 1:00 AMLunch - average (50.0g)Nov 1, 2022 1:00 AMAggressiveness in normoglycemia (100%)Nov 1, 2022 1:00 AMTarget glucose level (100.0mg/dL)Nov 1, 2022 1:00 AMHyperglycemia threshold (180.1mg/dL)Nov 1, 2022 1:00 AMHyperglycemia threshold (140.0mg/dL ➞ 180.1mg/dL)Nov 1, 2022 1:00 AMHypoglycemia threshold (70.0mg/dL)Nov 1, 2022 1:00 AMHypoglycemia threshold (60.0mg/dL ➞ 70.0mg/dL)Nov 1, 2022 1:00 AMBreakfast - small (15.0g)Nov 1, 2022 1:00 AMDinner - small (20.0g)Nov 1, 2022 1:00 AMLunch - small (30.0g)Nov 1, 2022 1:00 AMTotal Daily Insulin (53.0U)Nov 1, 2022 1:00 AMWeight (69.0kg)')

  const zone = 'Europe/Paris';
  const changeDateUTC = RESERVOIR_CHANGE_13_DAYS_AGO_DATE.clone()
    .hour(15)
    .minute(0)
    .utc()
  const changeDate2UTC = RESERVOIR_CHANGE_13_DAYS_AGO_DATE.clone()
    .hour(17)
    .minute(0)
    .utc()
  const changeDate = changeDateUTC.tz(zone).format('ll LT')
  const changeDate2 = changeDate2UTC.tz(zone).format('ll LT')
  expect(await screen.findByTestId('cartridge-changes-stat', {}, { timeout: 3000 })).toHaveTextContent(`Cartridge changes${changeDate}--${changeDate2}2hours`)
}

export const checkDeviceUsageWidgetNoData = async () => {
  const devicesUsageCard = within(screen.getByTestId('devices-usage-card'))
  checkTooltip(devicesUsageCard, 'Sensor Usage')
  expect(devicesUsageCard.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage0%')

  expect(screen.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGMDexcom G6DBLDiabeloopPumpVICENTRA')
  expect(screen.getByTestId('device-usage-updates')).toHaveTextContent('Last updates')
  expect(await screen.findByTestId('cartridge-changes-stat', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesNo cartridge changes over the period')
}
