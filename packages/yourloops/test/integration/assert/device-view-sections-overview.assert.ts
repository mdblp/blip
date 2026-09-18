/*
 * Copyright (c) 2026, Diabeloop
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
import userEvent from '@testing-library/user-event/dist/cjs/index.js'

export const checkDeviceSectionsOverviewVisible = (): void => {
  expect(screen.queryByTestId('device-view-overview-card-current-settings')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-basal-safety')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-parameters-history')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-devices-history')).toBeVisible()
}

export const checkDeviceSectionCardForCurrentParameters = (): void => {
  const currentSettingsSection = screen.getByTestId('device-view-overview-card-current-settings')
  expect(currentSettingsSection).toBeVisible()
  expect(currentSettingsSection).toHaveTextContent('System')
  expect(currentSettingsSection).toHaveTextContent('Pump')
  expect(currentSettingsSection).toHaveTextContent('CGM')
  expect(currentSettingsSection).toHaveTextContent('Total Daily Insulin')
  expect(currentSettingsSection).toHaveTextContent('Target glucose level')
  expect(currentSettingsSection).toHaveTextContent('Hypoglycemia threshold')
}

export const checkDeviceSectionCardForSafetyBasal = (): void => {
  expect(screen.getByText('Values of the patient\'s safety basal profile.')).toBeVisible()
}

export const checkDeviceSectionCardForParametersHistory = async () => {
  const changeHistorySection = screen.getByTestId('device-view-overview-card-parameters-history')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Settings HistoryView moreLast update: 01/11/22 - 1:00 amAggressiveness for lunch130 %90 %Aggressiveness for breakfast100 %110 %Aggressiveness for dinner100 %90 %Hyperglycemia threshold180.1 mg/dL140.0 mg/dLHypoglycemia threshold70.0 mg/dL60.0 mg/dLAggressiveness in hyperglycemia143 %Breakfast - large150.0 gDinner - large150.0 gLunch - large70.0 gAggressiveness for breakfast100 %Aggressiveness for breakfast110 %100 %Aggressiveness for dinner100 %Aggressiveness for dinner90 %100 %Aggressiveness for lunch130 %Breakfast - average70.0 gDinner - average60.0 gLunch - average50.0 gAggressiveness in normoglycemia100 %Target glucose level100.0 mg/dLHyperglycemia threshold180.1 mg/dLHyperglycemia threshold140.0 mg/dL180.1 mg/dLHypoglycemia threshold70.0 mg/dLHypoglycemia threshold60.0 mg/dL70.0 mg/dLBreakfast - small15.0 gDinner - small20.0 gLunch - small30.0 gTotal Daily Insulin53.0 UWeight69.0 kg')
}

export const checkDeviceSectionCardForDevicesHistory = async () => {
  const changeHistorySection = screen.getByTestId('device-view-overview-card-devices-history')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Devices HistoryView moreLast update: 01/11/22 - 1:00 amCGM manufacturerDexcomCGM productG5HandsetMobiGo+IMEI0123456789Software version1.12.12-DBLG1-INS-DEXG6-COMMERCIALActivation code123-456-789Software version1.0.0Pump manufacturerROCHEPump productInsightSmartphone modelA212F')
}

export const checkClickViewMoreCurrentSettings = async () => {
  const viewMoreCurrentSettings = within(screen.getByTestId('device-view-overview-card-current-settings'))
  await userEvent.click(viewMoreCurrentSettings.getByText('View more'))
  const CurrentSettingsSectionTitle = await screen.findByText('Devices and current settings')
  expect(CurrentSettingsSectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('bottom-part-main-header'))
  await userEvent.click(header.getByTestId('back-button'))

}

export const checkClickViewMoreBasalSafety = async () => {
  const viewMoreBasalSafety = within(screen.getByTestId('device-view-overview-card-basal-safety'))
  await userEvent.click(viewMoreBasalSafety.getByText('View more'))
  const basalSafetySectionTitle = await screen.findByText('Basal safety profile')
  expect(basalSafetySectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('bottom-part-main-header'))
  await userEvent.click(header.getByTestId('back-button'))
}

export const checkClickViewMoreSettingsHistory = async () => {
  const viewMoreSettingsHistory = within(screen.getByTestId('device-view-overview-card-parameters-history'))
  await userEvent.click(viewMoreSettingsHistory.getByText('View more'))
  const settingsHistorySectionTitle = await screen.findByText('Settings change history')
  expect(settingsHistorySectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('bottom-part-main-header'))
  await userEvent.click(header.getByTestId('back-button'))
}

export const checkClickViewMoreDevicesHistory = async () => {
  const viewMoreDevicesHistory = within(screen.getByTestId('device-view-overview-card-devices-history'))
  await userEvent.click(viewMoreDevicesHistory.getByText('View more'))
  const devicesHistorySectionTitle = await screen.findByText('Devices change history')
  expect(devicesHistorySectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('bottom-part-main-header'))
  await userEvent.click(header.getByTestId('back-button'))
}
