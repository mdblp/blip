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
import userEvent from '@testing-library/user-event'
import moment from 'moment/moment'
import { pumpSettingsData } from '../mock/data.api.mock'

export const checkDeviceSettingsContent = () => {
  const deviceSettings = screen.getByTestId('device-settings-container')
  const date = moment.tz(pumpSettingsData.data[0].time, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  expect(deviceSettings).toHaveTextContent(`DeviceLast upload: ${date}Copy as textDBLG1ManufacturerDiabeloopIdentifier1234IMEI1234567890Software version1.0.5.25PumpManufacturerVICENTRASerial number123456Pump versionbetaCartridge expiration4/12/2050CGMManufacturerDexcomProductG6Sensor expiration4/12/2050Transmitter software versionv1Transmitter IDa1234Transmitter expiration4/12/2050SettingValueUnitWEIGHT72.0kgChange historyLevelSettingValueType of changeDateTue, Nov 1, 2022 12:00 AM1BOLUS_AGGRESSIVENESS_FACTOR143 %AddedTue, Nov 1, 2022 12:00 AM1LARGE_MEAL_BREAKFAST150 gAddedTue, Nov 1, 2022 12:00 AM1LARGE_MEAL_DINNER150 gAddedTue, Nov 1, 2022 12:00 AM1LARGE_MEAL_LUNCH70 gAddedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_BREAKFAST_FACTOR100 %AddedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_BREAKFAST_FACTOR110 %UpdatedWed, Nov 2, 2022 5:00 PM1MEAL_RATIO_BREAKFAST_FACTOR100 %UpdatedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_DINNER_FACTOR100 %AddedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_DINNER_FACTOR90 %UpdatedWed, Nov 2, 2022 5:00 PM1MEAL_RATIO_DINNER_FACTOR100 %UpdatedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_LUNCH_FACTOR130 %AddedTue, Nov 1, 2022 12:00 AM1MEAL_RATIO_LUNCH_FACTOR90 %UpdatedMon, Nov 7, 2022 2:01 PM1MEDIUM_MEAL_BREAKFAST70 gAddedTue, Nov 1, 2022 12:00 AM1MEDIUM_MEAL_DINNER60 gAddedTue, Nov 1, 2022 12:00 AM1MEDIUM_MEAL_LUNCH50 gAddedTue, Nov 1, 2022 12:00 AM1PATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA100 %AddedTue, Nov 1, 2022 12:00 AM1PATIENT_GLYCEMIA_TARGET100.0 mg/dLAddedTue, Nov 1, 2022 12:00 AM1PATIENT_GLY_HYPER_LIMIT180.1 mg/dLAddedTue, Nov 1, 2022 12:00 AM1PATIENT_GLY_HYPER_LIMIT140 mg/dLUpdatedWed, Nov 2, 2022 7:00 AM1PATIENT_GLY_HYPER_LIMIT180.1 mg/dLUpdatedTue, Nov 1, 2022 12:00 AM1PATIENT_GLY_HYPO_LIMIT70 mg/dLAddedTue, Nov 1, 2022 12:00 AM1PATIENT_GLY_HYPO_LIMIT60 mg/dLUpdatedWed, Nov 2, 2022 7:00 AM1PATIENT_GLY_HYPO_LIMIT70 mg/dLUpdatedTue, Nov 1, 2022 12:00 AM1SMALL_MEAL_BREAKFAST15 gAddedTue, Nov 1, 2022 12:00 AM1SMALL_MEAL_DINNER20 gAddedTue, Nov 1, 2022 12:00 AM1SMALL_MEAL_LUNCH30 gAddedTue, Nov 1, 2022 12:00 AM1TOTAL_INSULIN_FOR_24H53 UAddedTue, Nov 1, 2022 12:00 AM1WEIGHT69.0 kgAddedTue, Nov 1, 2022 12:00 AM`)
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

  const date = moment.tz(pumpSettingsData.data[0].time, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  const copiedStringToPaste = `${date}\n\n-- DBL --\nManufacturer      Diabeloop\nIdentifier        1234\nIMEI              1234567890\nSoftware version  1.0.5.25\n\n-- Settings --\nName    Value  Unit\nWEIGHT   72.0  kg`
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(copiedStringToPaste))
}

export const checkNavigationToDailyView = async (router, route: string) => {
  const deviceSettings = screen.getByTestId('device-settings-container')
  const parameterTable = within(deviceSettings).getByTestId('history-parameter-table')
  const goToDailyButton = within(parameterTable).getByTestId('daily-button-link-2022-11-01T00:00:00Z')
  await userEvent.click(goToDailyButton)
  expect(router.state.location.pathname).toEqual(route)
}
