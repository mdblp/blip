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
  expect(screen.queryByTestId('device-view-overview-card-current-parameters')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-safety-basal')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-parameters-history')).toBeVisible()
  expect(screen.queryByTestId('device-view-overview-card-device-history')).toBeVisible()
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
  expect(screen.getByText('In this section you can find the values of the patient safety basal profile')).toBeVisible()
}

export const checkCareTeamSectionCardForParametersHistory = (): void => {
  expect(screen.getByText('Identification code')).toBeVisible()
  expect(screen.getByText('Address')).toBeVisible()
  expect(screen.getByText('City')).toBeVisible()
  expect(screen.getByText('Phone number')).toBeVisible()
}

export const checkCareTeamSectionCardForDeviceHistory = (): void => {
  expect(screen.getByText('Identification code')).toBeVisible()
  expect(screen.getByText('Address')).toBeVisible()
  expect(screen.getByText('City')).toBeVisible()
  expect(screen.getByText('Phone number')).toBeVisible()
}
