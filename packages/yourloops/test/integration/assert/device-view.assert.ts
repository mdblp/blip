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
import userEvent from '@testing-library/user-event'
import moment from 'moment-timezone'
import { pumpSettingsData } from '../mock/data.api.mock'
import { formatCurrentDate } from 'dumb'

export const checkDevicesMenuLayoutWithBasalSafetyProfile = () => {
  const devicesMenu = screen.getByTestId('devices-view-menu')
  expect(devicesMenu).toHaveTextContent('DevicesCurrent settingsBasal safety profileSettings change historyDevices change history')
}

export const checkDevicesMenuLayoutWithoutBasalSafetyProfile = () => {
  const devicesMenu = screen.getByTestId('devices-view-menu')
  expect(devicesMenu).toHaveTextContent('DevicesCurrent settingsSettings change historyDevices change history')
}

export const checkCurrentParametersContent = () => {
  const deviceSettings = screen.getByTestId('current-parameters-section')
  const date = moment.tz(pumpSettingsData.data.pumpSettings[0].normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  expect(deviceSettings).toHaveTextContent(`Devices and current settingsLast update: ${date}Copy as textDBLG1ManufacturerDiabeloopIdentifier1234IMEI1234567890Software version1.0.5.25PumpManufacturerVICENTRAProducttestPumpSerial number123456Pump versionbetaCGMManufacturerDexcomProductG6Sensor expirationApr 12, 2050Transmitter software versionv1Transmitter IDa1234Transmitter expirationApr 12, 2050SettingValueUnitBreakfast - average36.0gLunch - average96.0gDinner - average96.0gWeight72.0kgHyperglycemia threshold180.0mg/dLHypoglycemia threshold75.0mg/dLTarget glucose level110.0mg/dLAggressiveness in normoglycemia100%Aggressiveness in hyperglycemia100%Aggressiveness for breakfast100%Aggressiveness for lunch100%Aggressiveness for dinner80%Breakfast - small18.0gBreakfast - large54.0gLunch - small48.0gLunch - large144.0gDinner - small48.0gDinner - large144.0g`)
}

export const checkG2CurrentParametersContent = () => {
  const deviceSettings = screen.getByTestId('current-parameters-section')
  const date = moment.tz(pumpSettingsData.data.pumpSettings[0].normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  expect(deviceSettings).toHaveTextContent(`Devices and current settingsLast update: ${date}Copy as textMobile applicationManufacturerDiabeloopNameDBLG2Software version1.0.0Activation code123 - 456 - 789Identifieree2bfb587758Smartphone modelA25Smartphone OS version14PumpManufacturerVICENTRAProducttestPumpSerial number123456Pump versionbetaCGMManufacturerDexcomProductG6Sensor expirationApr 12, 2050Transmitter software versionv1Transmitter IDa1234Transmitter expirationApr 12, 2050SettingValueUnitBreakfast - average36.0gLunch - average96.0gDinner - average96.0gWeight72.0kgHyperglycemia threshold180.0mg/dLHypoglycemia threshold75.0mg/dLTarget glucose level110.0mg/dLAggressiveness in normoglycemia100%Aggressiveness in hyperglycemia100%Aggressiveness for breakfast100%Aggressiveness for lunch100%Aggressiveness for dinner80%Breakfast - small18.0gBreakfast - large54.0gLunch - small48.0gLunch - large144.0gDinner - small48.0gDinner - large144.0g`)
}

export const checkCopyTextButton = async () => {
  const writeText = jest.fn()
  Object.assign(navigator, {
    clipboard: {
      writeText
    }
  })
  const deviceSettings = screen.getByTestId('device-settings-container')
  const copyTextButton = within(deviceSettings).getByRole('button', { name: 'Copy as text' })
  await userEvent.click(copyTextButton)

  const date = moment.tz(pumpSettingsData.data.pumpSettings[0].normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  const copiedStringToPaste = `${date}\n\n-- DBL --\nManufacturer      Diabeloop\nIdentifier        1234\nIMEI              1234567890\nSoftware version  1.0.5.25\n\n-- Settings on ${formatCurrentDate()} --\nName                             Value  Unit\nBreakfast - average               36.0  g\nLunch - average                   96.0  g\nDinner - average                  96.0  g\nWeight                            72.0  kg\nHyperglycemia threshold          180.0  mg/dL\nHypoglycemia threshold            75.0  mg/dL\nTarget glucose level             110.0  mg/dL\nAggressiveness in normoglycemia    100  %\nAggressiveness in hyperglycemia    100  %\nAggressiveness for breakfast       100  %\nAggressiveness for lunch           100  %\nAggressiveness for dinner           80  %\nBreakfast - small                 18.0  g\nBreakfast - large                 54.0  g\nLunch - small                     48.0  g\nLunch - large                    144.0  g\nDinner - small                    48.0  g\nDinner - large                   144.0  g`
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(copiedStringToPaste))
}

export const checkG2CopyTextButton = async () => {
  const writeText = jest.fn()
  Object.assign(navigator, {
    clipboard: {
      writeText
    }
  })
  const deviceSettings = screen.getByTestId('device-settings-container')
  const copyTextButton = within(deviceSettings).getByRole('button', { name: 'Copy as text' })
  await userEvent.click(copyTextButton)

  const date = moment.tz(pumpSettingsData.data.pumpSettings[0].normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')

  const copiedStringToPaste = `${date}\n\n-- Mobile application --\nManufacturer           Diabeloop\nName                   DBLG2\nSoftware version       1.0.0\nActivation code        123456789\nIdentifier             ee2bfb587758\nSmartphone model       A25\nSmartphone OS version  14\n\n-- Settings on ${formatCurrentDate()} --\nName                             Value  Unit\nBreakfast - average               36.0  g\nLunch - average                   96.0  g\nDinner - average                  96.0  g\nWeight                            72.0  kg\nHyperglycemia threshold          180.0  mg/dL\nHypoglycemia threshold            75.0  mg/dL\nTarget glucose level             110.0  mg/dL\nAggressiveness in normoglycemia    100  %\nAggressiveness in hyperglycemia    100  %\nAggressiveness for breakfast       100  %\nAggressiveness for lunch           100  %\nAggressiveness for dinner           80  %\nBreakfast - small                 18.0  g\nBreakfast - large                 54.0  g\nLunch - small                     48.0  g\nLunch - large                    144.0  g\nDinner - small                    48.0  g\nDinner - large                   144.0  g`
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(copiedStringToPaste))
}

export const checkSafetyBasalProfileContent = async () => {
  const safetyBasalProfileButton = within(screen.getByTestId('devices-view-menu')).getByText('Basal safety profile')
  await userEvent.click(safetyBasalProfileButton)

  const safetyBasalProfileSection = screen.getByTestId('safety-basal-profile-section')
  expect(safetyBasalProfileSection).toBeVisible()
  expect(safetyBasalProfileSection).toHaveTextContent('Basal safety profileStart timeEnd timeBasal rate12:00 AM8:30 AM1 U/h8:30 AM2:00 PM2 U/h2:00 PM12:00 AM0.4 U/h')
}

export const checkSafetyBasalProfileErrorMessage = async (errorMessage: string) => {
  const safetyBasalProfileButton = within(screen.getByTestId('devices-view-menu')).getByText('Basal safety profile')
  await userEvent.click(safetyBasalProfileButton)

  const safetyBasalProfileSection = screen.getByTestId('safety-basal-profile-section')
  expect(safetyBasalProfileSection).toBeVisible()
  expect(safetyBasalProfileSection).toHaveTextContent(`Basal safety profile${errorMessage}`)
}

export const checkChangeHistoryContent = async () => {
  const changeHistoryButton = within(screen.getByTestId('devices-view-menu')).getByText('Settings change history')
  await userEvent.click(changeHistoryButton)

  const changeHistorySection = screen.getByTestId('change-history-section')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Settings change historySettingValueType of changeDateTue, Nov 1, 2022 1:00 AMAggressiveness for lunch130 %90 %UpdatedMon, Nov 7, 2022 3:01 PMAggressiveness for breakfast100 %110 %UpdatedWed, Nov 2, 2022 6:00 PMAggressiveness for dinner100 %90 %UpdatedWed, Nov 2, 2022 6:00 PMHyperglycemia threshold180.1 mg/dL140.0 mg/dLUpdatedWed, Nov 2, 2022 8:00 AMHypoglycemia threshold70.0 mg/dL60.0 mg/dLUpdatedWed, Nov 2, 2022 8:00 AMAggressiveness in hyperglycemia143 %AddedTue, Nov 1, 2022 1:00 AMBreakfast - large150.0 gAddedTue, Nov 1, 2022 1:00 AMDinner - large150.0 gAddedTue, Nov 1, 2022 1:00 AMLunch - large70.0 gAddedTue, Nov 1, 2022 1:00 AMAggressiveness for breakfast100 %AddedTue, Nov 1, 2022 1:00 AMAggressiveness for breakfast110 %100 %UpdatedTue, Nov 1, 2022 1:00 AMAggressiveness for dinner100 %AddedTue, Nov 1, 2022 1:00 AMAggressiveness for dinner90 %100 %UpdatedTue, Nov 1, 2022 1:00 AMAggressiveness for lunch130 %AddedTue, Nov 1, 2022 1:00 AMBreakfast - average70.0 gAddedTue, Nov 1, 2022 1:00 AMDinner - average60.0 gAddedTue, Nov 1, 2022 1:00 AMLunch - average50.0 gAddedTue, Nov 1, 2022 1:00 AMAggressiveness in normoglycemia100 %AddedTue, Nov 1, 2022 1:00 AMTarget glucose level100.0 mg/dLAddedTue, Nov 1, 2022 1:00 AMHyperglycemia threshold180.1 mg/dLAddedTue, Nov 1, 2022 1:00 AMHyperglycemia threshold140.0 mg/dL180.1 mg/dLUpdatedTue, Nov 1, 2022 1:00 AMHypoglycemia threshold70.0 mg/dLAddedTue, Nov 1, 2022 1:00 AMHypoglycemia threshold60.0 mg/dL70.0 mg/dLUpdatedTue, Nov 1, 2022 1:00 AMBreakfast - small15.0 gAddedTue, Nov 1, 2022 1:00 AMDinner - small20.0 gAddedTue, Nov 1, 2022 1:00 AMLunch - small30.0 gAddedTue, Nov 1, 2022 1:00 AMTotal Daily Insulin53.0 UAddedTue, Nov 1, 2022 1:00 AMWeight69.0 kgAddedTue, Nov 1, 2022 1:00 AM')
}

export const checkDeviceHistoryContent = async () => {
  const changeHistoryButton = within(screen.getByTestId('devices-view-menu')).getByText('Devices change history')
  await userEvent.click(changeHistoryButton)

  const changeHistorySection = screen.getByTestId('device-history-section')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Devices change history')
}

export const checkNavigationToDailyView = async (router, route: string) => {
  const changeHistoryButton = within(screen.getByTestId('devices-view-menu')).getByText('Settings change history')
  await userEvent.click(changeHistoryButton)

  const changeHistorySection = screen.getByTestId('change-history-section')
  const parameterTable = within(changeHistorySection).getByTestId('history-parameter-table')
  const goToDailyButton = within(parameterTable).getByTestId('daily-button-link-2022-11-01T00:00:00Z')
  await userEvent.click(goToDailyButton)
  expect(router.state.location.pathname).toEqual(route)
}
