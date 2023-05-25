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
import { patient1, patient2 } from '../data/patient.api.data'
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

export const checkPatientDropdown = async (initialPatient: Patient, patientToSwitchTo: Patient) => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  const initialPatientHeaderContent = `Patient${initialPatient.profile.firstName} ${initialPatient.profile.lastName}Date of birth:${moment(initialPatient.profile.birthdate).format('L')}Diabetes type:Type 1Gender:MaleHbA1c:fakeA1cValue (05/25/2023)Email:patient1@diabeloop.frDashboardDailyTrendsDownload report`
  expect(secondaryHeader).toHaveTextContent(initialPatientHeaderContent)

  fireEvent.mouseDown(within(secondaryHeader).getByText(patient1.profile.fullName))
  fireEvent.click(within(screen.getByRole('listbox')).getByText(patient2.profile.fullName))

  const secondPatientDateOfBirth = moment(patientToSwitchTo.profile.birthdate).format('L')
  const secondPatientName = `${patientToSwitchTo.profile.firstName} ${patientToSwitchTo.profile.lastName}`
  const secondaryHeaderRefreshed = await screen.findByTestId('patient-nav-bar')
  const secondPatientHeaderContent = `Patient${secondPatientName}Date of birth:${secondPatientDateOfBirth}Diabetes type:Type 1Gender:FemaleHbA1c:8.9 (11/21/2023)Email:patient2@diabeloop.frDashboardDailyTrendsDownload report`
  await waitFor(() => { expect(secondaryHeaderRefreshed).toHaveTextContent(secondPatientHeaderContent) })

  fireEvent.mouseDown(within(await screen.findByTestId('patient-nav-bar')).getByText(patientToSwitchTo.profile.fullName))
  await userEvent.click(within(screen.getByRole('listbox')).getByText(initialPatient.profile.fullName))

  expect(secondaryHeader).toHaveTextContent(initialPatientHeaderContent)
}

export const checkPatientNavBarForPatient = async () => {
  const secondaryHeader = await screen.findByTestId('patient-nav-bar')
  expect(secondaryHeader).toHaveTextContent('DashboardDailyTrendsDownload report')
}
