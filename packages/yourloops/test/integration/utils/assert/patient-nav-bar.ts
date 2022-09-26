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

export const checkPatientNavBar = (canGenerateReport = true, isUserPatient = false) => {
  const patientNavBar = within(screen.getByTestId('patient-data-subnav-outer'))
  const dashboardLink = patientNavBar.getByText('Dashboard')
  const dailyLink = patientNavBar.getByText('Daily')
  const trendsLink = patientNavBar.getByText('Trends')
  expect(dashboardLink.parentElement).toHaveAttribute('href', isUserPatient ? '/dashboard' : `/patient/${patientNonMonitoredId}/dashboard`)
  expect(dashboardLink).toBeVisible()
  expect(dailyLink.parentElement).toHaveAttribute('href', isUserPatient ? '/daily' : `/patient/${patientNonMonitoredId}/daily`)
  expect(dailyLink).toBeVisible()
  expect(trendsLink.parentElement).toHaveAttribute('href', isUserPatient ? '/trends' : `/patient/${patientNonMonitoredId}/trends`)
  expect(trendsLink).toBeVisible()
  if (canGenerateReport) {
    expect(patientNavBar.getByText('Generate report')).toBeVisible()
  } else {
    expect(patientNavBar.queryByText('Generate report')).not.toBeInTheDocument()
  }
}
