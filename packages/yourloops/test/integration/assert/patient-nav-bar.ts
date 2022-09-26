/**
 * Copyright (c) 2022, Diabeloop
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
import { patientNonMonitoredId } from '../mock/mockPatientAPI'

const checkPatientNavBar = (canGenerateReport = true, dashboardUrl: string, dailyUrl: string, trendsUrl: string) => {
  const patientNavBar = within(screen.getByTestId('patient-data-subnav-outer'))
  const dashboardLink = patientNavBar.getByText('Dashboard')
  const dailyLink = patientNavBar.getByText('Daily')
  const trendsLink = patientNavBar.getByText('Trends')
  expect(dashboardLink.parentElement).toHaveAttribute('href', dashboardUrl)
  expect(dashboardLink).toBeVisible()
  expect(dailyLink.parentElement).toHaveAttribute('href', dailyUrl)
  expect(dailyLink).toBeVisible()
  expect(trendsLink.parentElement).toHaveAttribute('href', trendsUrl)
  expect(trendsLink).toBeVisible()
  if (canGenerateReport) {
    expect(patientNavBar.getByText('Generate report')).toBeVisible()
  } else {
    expect(patientNavBar.queryByText('Generate report')).not.toBeInTheDocument()
  }
}

export const checkPatientNavBarAsHCP = (canGenerateReport = true, patientId = patientNonMonitoredId) => {
  const dashboardURL = `/patient/${patientId}/dashboard`
  const dailyURL = `/patient/${patientId}/daily`
  const trendsURL = `/patient/${patientId}/trends`
  checkPatientNavBar(canGenerateReport, dashboardURL, dailyURL, trendsURL)
}

export const checkPatientNavBarAsPatient = (canGenerateReport = true) => {
  checkPatientNavBar(canGenerateReport, '/dashboard', '/daily', '/trends')
}
