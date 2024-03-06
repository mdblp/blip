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
import userEvent from '@testing-library/user-event'
import moment from 'moment-timezone'
import { pumpSettingsData } from '../mock/data.api.mock'

export const checkDeviceSettingsContent = () => {
  const deviceSettings = screen.getByTestId('device-settings-container')
  const date = moment.tz(pumpSettingsData.data.pumpSettings[0].normalTime, 'UTC').tz(new Intl.DateTimeFormat().resolvedOptions().timeZone).format('LLLL')
  expect(deviceSettings).toHaveTextContent(`DeviceLast update: ${date}Copy as textDBLG1ManufacturerDiabeloopIdentifier1234IMEI1234567890Software version1.0.5.25PumpManufacturerVICENTRAProducttestPumpSerial number123456Pump versionbetaCGMManufacturerDexcomProductG6Sensor expirationApr 12, 2050Transmitter software versionv1Transmitter IDa1234Transmitter expirationApr 12, 2050SettingValueUnitMEDIUM_MEAL_BREAKFAST36.0gMEDIUM_MEAL_LUNCH96.0gMEDIUM_MEAL_DINNER96.0gWEIGHT72.0kgPATIENT_GLY_HYPER_LIMIT180.0mg/dLPATIENT_GLY_HYPO_LIMIT75.0mg/dLPATIENT_GLYCEMIA_TARGET110.0mg/dLPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA100%BOLUS_AGGRESSIVENESS_FACTOR100%MEAL_RATIO_BREAKFAST_FACTOR100%MEAL_RATIO_LUNCH_FACTOR100%MEAL_RATIO_DINNER_FACTOR80%SMALL_MEAL_BREAKFAST18.0gLARGE_MEAL_BREAKFAST54.0gSMALL_MEAL_LUNCH48.0gLARGE_MEAL_LUNCH144.0gSMALL_MEAL_DINNER48.0gLARGE_MEAL_DINNER144.0gChange historySettingValueType of changeDateTue, Nov 1, 2022 1:00 AMMEAL_RATIO_LUNCH_FACTOR130 %90 %UpdatedMon, Nov 7, 2022 3:01 PMMEAL_RATIO_BREAKFAST_FACTOR100 %110 %UpdatedWed, Nov 2, 2022 6:00 PMMEAL_RATIO_DINNER_FACTOR100 %90 %UpdatedWed, Nov 2, 2022 6:00 PMPATIENT_GLY_HYPER_LIMIT180.1 mg/dL140.0 mg/dLUpdatedWed, Nov 2, 2022 8:00 AMPATIENT_GLY_HYPO_LIMIT70.0 mg/dL60.0 mg/dLUpdatedWed, Nov 2, 2022 8:00 AMBOLUS_AGGRESSIVENESS_FACTOR143 %AddedTue, Nov 1, 2022 1:00 AMLARGE_MEAL_BREAKFAST150.0 gAddedTue, Nov 1, 2022 1:00 AMLARGE_MEAL_DINNER150.0 gAddedTue, Nov 1, 2022 1:00 AMLARGE_MEAL_LUNCH70.0 gAddedTue, Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR100 %AddedTue, Nov 1, 2022 1:00 AMMEAL_RATIO_BREAKFAST_FACTOR110 %100 %UpdatedTue, Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR100 %AddedTue, Nov 1, 2022 1:00 AMMEAL_RATIO_DINNER_FACTOR90 %100 %UpdatedTue, Nov 1, 2022 1:00 AMMEAL_RATIO_LUNCH_FACTOR130 %AddedTue, Nov 1, 2022 1:00 AMMEDIUM_MEAL_BREAKFAST70.0 gAddedTue, Nov 1, 2022 1:00 AMMEDIUM_MEAL_DINNER60.0 gAddedTue, Nov 1, 2022 1:00 AMMEDIUM_MEAL_LUNCH50.0 gAddedTue, Nov 1, 2022 1:00 AMPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA100 %AddedTue, Nov 1, 2022 1:00 AMPATIENT_GLYCEMIA_TARGET100.0 mg/dLAddedTue, Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT180.1 mg/dLAddedTue, Nov 1, 2022 1:00 AMPATIENT_GLY_HYPER_LIMIT140.0 mg/dL180.1 mg/dLUpdatedTue, Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT70.0 mg/dLAddedTue, Nov 1, 2022 1:00 AMPATIENT_GLY_HYPO_LIMIT60.0 mg/dL70.0 mg/dLUpdatedTue, Nov 1, 2022 1:00 AMSMALL_MEAL_BREAKFAST15.0 gAddedTue, Nov 1, 2022 1:00 AMSMALL_MEAL_DINNER20.0 gAddedTue, Nov 1, 2022 1:00 AMSMALL_MEAL_LUNCH30.0 gAddedTue, Nov 1, 2022 1:00 AMTOTAL_INSULIN_FOR_24H53.0 UAddedTue, Nov 1, 2022 1:00 AMWEIGHT69.0 kgAddedTue, Nov 1, 2022 1:00 AM`)
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
  const copiedStringToPaste = `${date}\n\n-- DBL --\nManufacturer      Diabeloop\nIdentifier        1234\nIMEI              1234567890\nSoftware version  1.0.5.25\n\n-- Settings --\nName                                                      Value  Unit\nMEDIUM_MEAL_BREAKFAST                                      36.0  g\nMEDIUM_MEAL_LUNCH                                          96.0  g\nMEDIUM_MEAL_DINNER                                         96.0  g\nWEIGHT                                                     72.0  kg\nPATIENT_GLY_HYPER_LIMIT                                   180.0  mg/dL\nPATIENT_GLY_HYPO_LIMIT                                     75.0  mg/dL\nPATIENT_GLYCEMIA_TARGET                                   110.0  mg/dL\nPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA    100  %\nBOLUS_AGGRESSIVENESS_FACTOR                                 100  %\nMEAL_RATIO_BREAKFAST_FACTOR                                 100  %\nMEAL_RATIO_LUNCH_FACTOR                                     100  %\nMEAL_RATIO_DINNER_FACTOR                                     80  %\nSMALL_MEAL_BREAKFAST                                       18.0  g\nLARGE_MEAL_BREAKFAST                                       54.0  g\nSMALL_MEAL_LUNCH                                           48.0  g\nLARGE_MEAL_LUNCH                                          144.0  g\nSMALL_MEAL_DINNER                                          48.0  g\nLARGE_MEAL_DINNER                                         144.0  g`
  expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining(copiedStringToPaste))
}

export const checkNavigationToDailyView = async (router, route: string) => {
  const deviceSettings = screen.getByTestId('device-settings-container')
  const parameterTable = within(deviceSettings).getByTestId('history-parameter-table')
  const goToDailyButton = within(parameterTable).getByTestId('daily-button-link-2022-11-01T00:00:00Z')
  await userEvent.click(goToDailyButton)
  expect(router.state.location.pathname).toEqual(route)
}
