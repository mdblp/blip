/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { type BoundFunctions, fireEvent, type queries, screen, waitFor, within } from '@testing-library/react'
import { monitoredPatient, unmonitoredPatient } from '../data/patient.api.data'
import { type Patient } from '../../../lib/patient/models/patient.model'
import moment from 'moment-timezone'
import userEvent from '@testing-library/user-event'

const checkPatientNavBar = (patientNavBar: BoundFunctions<typeof queries>) => {
  const dashboardTab = patientNavBar.getByText('Dashboard')
  const dailyTab = patientNavBar.getByText('Daily')
  const trendsTab = patientNavBar.getByText('Trends')
  expect(dashboardTab).toBeVisible()
  expect(dailyTab).toBeVisible()
  expect(trendsTab).toBeVisible()
  expect(patientNavBar.getByText('Download report')).toBeVisible()
}

export const checkPatientNavBarAsHCP = () => {
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  expect(patientNavBar.getByTestId('subnav-patient-list')).toBeVisible()
  expect(patientNavBar.getByTestId('patient-dropdown')).toBeVisible()
  checkPatientNavBar(patientNavBar)
}

export const checkPatientNavBarAsCaregiver = () => {
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  expect(patientNavBar.getByTestId('subnav-patient-list')).toBeVisible()
  expect(patientNavBar.getByTestId('patient-dropdown')).toBeVisible()
  checkPatientNavBar(patientNavBar)
}

export const checkPatientNavBarAsPatient = () => {
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  checkPatientNavBar(patientNavBar)
}

export const testPatientDropdown = async (initialPatient: Patient, patientToSwitchTo: Patient) => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  const initialPatientHeaderContent = `${initialPatient.profile.lastName}${initialPatient.profile.firstName} PatientDate of birth:${moment(initialPatient.profile.birthdate).format('L')}Diabete type:Type 1Gender:MaleRemote monitoring:YesShow moreDashboardDailyTrendsDownload report`
  expect(secondaryHeader).toHaveTextContent(initialPatientHeaderContent)

  fireEvent.mouseDown(within(secondaryHeader).getByText(monitoredPatient.profile.fullName))
  fireEvent.click(within(screen.getByRole('listbox')).getByText(unmonitoredPatient.profile.fullName))

  const secondPatientDateOfBirth = moment(patientToSwitchTo.profile.birthdate).format('L')
  const secondPatientName = `${patientToSwitchTo.profile.lastName}${patientToSwitchTo.profile.firstName}`
  const secondaryHeaderRefreshed = await screen.findByTestId('patient-nav-bar')
  const secondPatientHeaderContent = `${secondPatientName} PatientDate of birth:${secondPatientDateOfBirth}Diabete type:Type 1Gender:MaleRemote monitoring:NoShow moreDashboardDailyTrendsDownload report`
  await waitFor(() => { expect(secondaryHeaderRefreshed).toHaveTextContent(secondPatientHeaderContent) })

  await userEvent.click(within(secondaryHeaderRefreshed).getByText('Show more'))
  const secondPatientHeaderContentExtended = `${secondPatientName} PatientDate of birth:${secondPatientDateOfBirth}Diabete type:Type 1Gender:MaleRemote monitoring:NoReferring doctor:N/Ahba1c:8.9 (11/21/2023)Email:${patientToSwitchTo.profile.email}Show lessDashboardDailyTrendsDownload report`
  expect(secondaryHeaderRefreshed).toHaveTextContent(secondPatientHeaderContentExtended)
  await userEvent.click(within(secondaryHeaderRefreshed).getByText('Show less'))
  expect(secondaryHeaderRefreshed).toHaveTextContent(secondPatientHeaderContent)

  fireEvent.mouseDown(within(await screen.findByTestId('patient-nav-bar')).getByText(patientToSwitchTo.profile.fullName))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(initialPatient.profile.fullName))

  expect(secondaryHeader).toHaveTextContent(initialPatientHeaderContent)
}

export const testPatientNavBar = async () => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsDownload report')
}
