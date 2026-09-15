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

export const checkCareTeamSectionCardForCurrentParameters = (): void => {
  expect(screen.getByText('System')).toBeVisible()
  expect(screen.getByText('Pump')).toBeVisible()
  expect(screen.getByText('CGM')).toBeVisible()
  expect(screen.getByText('Total Daily Insulin')).toBeVisible()
  expect(screen.getByText('Target glucose level')).toBeVisible()
  expect(screen.getByText('Hypoglycemia threshold')).toBeVisible()
}

export const checkCareTeamSectionCardForSafetyBasal = (): void => {
  expect(screen.getByText('In this section you can find the values of the patient safety basal profile.')).toBeVisible()
}

export const checkCareTeamSectionCardForParametersHistory = async () => {
  const changeHistorySection = screen.getByTestId('device-view-overview-card-parameters-history')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Settings HistoryView moreLast update: 01/11/22 - 1:00 amAggressive...130 %90 % Aggressive...100 %110 % Aggressive...100 %90 % Hyperglyce...180.1 mg/dL140.0 mg/dL Hypoglycem...70.0 mg/dL60.0 mg/dL Aggressive...143 % Breakfast ...150.0 g Dinner - l...150.0 g Lunch - la...70.0 g Aggressive...100 % Aggressive...110 %100 % Aggressive...100 % Aggressive...90 %100 % Aggressive...130 % Breakfast ...70.0 g Dinner - a...60.0 g Lunch - av...50.0 g Aggressive...100 % Target glu...100.0 mg/dL Hyperglyce...180.1 mg/dL Hyperglyce...140.0 mg/dL180.1 mg/dL Hypoglycem...70.0 mg/dL Hypoglycem...60.0 mg/dL70.0 mg/dL Breakfast ...15.0 g Dinner - s...20.0 g Lunch - sm...30.0 g Total Dail...53.0 U Weight69.0 kg')
}

export const checkCareTeamSectionCardForDevicesHistory = async () => {
  const changeHistorySection = screen.getByTestId('device-view-overview-card-devices-history')
  expect(changeHistorySection).toBeVisible()
  expect(changeHistorySection).toHaveTextContent('Devices HistoryView moreLast update: 01/11/22 - 1:00 amCGM manufacturerDexcom CGM productG5 HandsetMobiGo+ IMEI0123456789 Software version1.12.12-DBLG1-INS-DEXG6-COMMERCIAL Activation code123-456-789 Software version1.0.0 Pump manufacturerROCHE Pump productInsight Smartphone modelA212F')
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
