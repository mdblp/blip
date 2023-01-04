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

import { BoundFunctions, queries, screen, within } from '@testing-library/react'
import { unmonitoredPatientId } from '../mock/mockPatientAPI'

const checkPatientNavBar = (patientNavBar: BoundFunctions<typeof queries>, dashboardUrl: string, dailyUrl: string, trendsUrl: string) => {
  const dashboardLink = patientNavBar.getByText('Dashboard')
  const dailyLink = patientNavBar.getByText('Daily')
  const trendsLink = patientNavBar.getByText('Trends')
  expect(dashboardLink).toHaveAttribute('href', dashboardUrl)
  expect(dashboardLink).toBeVisible()
  expect(dailyLink).toHaveAttribute('href', dailyUrl)
  expect(dailyLink).toBeVisible()
  expect(trendsLink).toHaveAttribute('href', trendsUrl)
  expect(trendsLink).toBeVisible()
  expect(patientNavBar.getByText('Generate report')).toBeVisible()
}

export const checkPatientNavBarAsHCP = (patientId = unmonitoredPatientId) => {
  const dashboardURL = `/patient/${patientId}/dashboard`
  const dailyURL = `/patient/${patientId}/daily`
  const trendsURL = `/patient/${patientId}/trends`
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  expect(patientNavBar.getByTestId('patient-dropdown')).toBeVisible()
  checkPatientNavBar(patientNavBar, dashboardURL, dailyURL, trendsURL)
}

export const checkPatientNavBarAsCaregiver = (patientId = unmonitoredPatientId) => {
  const dashboardURL = `/patient/${patientId}/dashboard`
  const dailyURL = `/patient/${patientId}/daily`
  const trendsURL = `/patient/${patientId}/trends`
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  expect(patientNavBar.getByTestId('patient-dropdown')).toBeVisible()
  checkPatientNavBar(patientNavBar, dashboardURL, dailyURL, trendsURL)
}

export const checkPatientNavBarAsPatient = () => {
  const patientNavBar = within(screen.getByTestId('patient-nav-bar'))
  checkPatientNavBar(patientNavBar, '/dashboard', '/daily', '/trends')
}
