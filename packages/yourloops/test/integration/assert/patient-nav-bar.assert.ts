/*
 * Copyright (c) 2022-2024, Diabeloop
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

import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { patient1Info, patient2Info } from '../data/patient.api.data'
import { type Patient } from '../../../lib/patient/models/patient.model'
import userEvent from '@testing-library/user-event'

const checkPatientNavBarCommon = (expectedTabListTextContent: string) => {
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  expect(patientNavBar.getByTestId('subnav-patient-info')).toBeVisible()
  expect(patientNavBar.getByRole('tablist')).toHaveTextContent(expectedTabListTextContent)
  expect(patientNavBar.getByText('Download report')).toBeVisible()
}

export const checkPatientNavBarAsHcp = () => {
  checkPatientNavBarCommon('DashboardDailyTrendsProfileDevices')
}

export const checkPatientNavBarAsHcpInPrivateTeam = () => {
  checkPatientNavBarCommon('DashboardDailyTrendsDevice')
}

export const checkPatientNavBarAsCaregiver = () => {
  checkPatientNavBarCommon('DashboardDailyTrendsDevice')
}

export const checkPatientNavBarAsPatient = () => {
  checkPatientNavBarCommon('DashboardDailyTrendsDevice')
}

export const checkPatientDropdown = async (initialPatient: Patient, patientToSwitchTo: Patient) => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  const initialPatientHeaderContent = `Patient${initialPatient.profile.lastName} ${initialPatient.profile.firstName}DashboardDailyTrendsProfileDevicesDownload report`
  expect(secondaryHeader).toHaveTextContent(initialPatientHeaderContent)

  fireEvent.mouseDown(within(secondaryHeader).getByText(`${patient1Info.profile.lastName} ${patient1Info.profile.firstName}`))
  fireEvent.click(within(screen.getByRole('listbox')).getByText(`${patient2Info.profile.lastName} ${patient2Info.profile.firstName}`))

  const secondPatientName = `${patientToSwitchTo.profile.lastName} ${patientToSwitchTo.profile.firstName}`
  const secondaryHeaderRefreshed = await screen.findByTestId('patient-nav-bar')
  const secondPatientHeaderContent = `Patient${secondPatientName}DashboardDailyTrendsProfileDevicesDownload report`
  await waitFor(() => {
    expect(secondaryHeaderRefreshed).toHaveTextContent(secondPatientHeaderContent)
  })

  fireEvent.mouseDown(within(await screen.findByTestId('patient-nav-bar')).getByText(`${patientToSwitchTo.profile.lastName} ${patientToSwitchTo.profile.firstName}`))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(`${patientToSwitchTo.profile.lastName} ${patientToSwitchTo.profile.firstName}`))

  expect(secondaryHeader).toHaveTextContent(secondPatientHeaderContent)
}

export const checkPatientNavBarForPatient = async () => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsProfileDevicesDownload report')
}

export const checkPatientNavBarForCaregiver = async () => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsDevicesDownload report')
}
