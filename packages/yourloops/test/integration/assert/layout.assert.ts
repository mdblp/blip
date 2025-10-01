/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { checkCaregiverHeader, checkPatientHeader } from './header.assert'
import { screen, within } from '@testing-library/react'
import { checkFooterForCaregiver, checkFooterForPatient } from './footer.assert'

export interface PatientDashboardLayoutParams {
  isChatCardVisible: boolean
  isMedicalFilesCardVisible: boolean
  isMonitoringAlertCardVisible: boolean
}

export const checkCaregiverLayout = async (fullName: string, needFooterLanguageSelector?: true) => {
  await checkCaregiverHeader(fullName)
  checkFooterForCaregiver(needFooterLanguageSelector)
}

export const checkPatientLayout = async (fullName: string, needFooterLanguageSelector?: true) => {
  await checkPatientHeader(fullName)
  checkFooterForPatient(needFooterLanguageSelector)
}

export const checkPatientDashboardLayout = async (patientDashboardLayout: PatientDashboardLayoutParams) => {
  const dashboard = within(await screen.findByTestId('patient-dashboard'))
  expect(dashboard.getByText('Data calculated on the last 14 days (current day excluded)')).toBeVisible()
  expect(dashboard.getByText('Avg. Daily declared carbs')).toBeVisible()
  expect(dashboard.getByText('Devices')).toBeVisible()

  if (patientDashboardLayout.isChatCardVisible) {
    expect(dashboard.queryByTestId('chat-card')).toBeVisible()
  } else {
    expect(dashboard.queryByTestId('chat-card')).not.toBeInTheDocument()
  }

  if (patientDashboardLayout.isMedicalFilesCardVisible) {
    expect(dashboard.queryByTestId('medical-files-card')).toBeVisible()
  } else {
    expect(dashboard.queryByTestId('medical-files-card')).not.toBeInTheDocument()
  }

  if (patientDashboardLayout.isMonitoringAlertCardVisible) {
    expect(dashboard.queryByTestId('monitoring-alerts-card')).toBeVisible()
  } else {
    expect(dashboard.queryByTestId('monitoring-alerts-card')).not.toBeInTheDocument()
  }
}
