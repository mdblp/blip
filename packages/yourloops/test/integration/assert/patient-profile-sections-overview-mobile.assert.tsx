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

import { screen } from '@testing-library/react'

export const checkPatientProfileSectionsOverviewVisible = (): void => {
  expect(screen.queryByTestId('patient-profile-overview-section-information')).toBeVisible()
  expect(screen.queryByTestId('patient-profile-overview-section-lead-clinicians')).toBeVisible()
  expect(screen.queryByTestId('patient-profile-overview-section-range')).toBeVisible()
  expect(screen.queryByTestId('patient-profile-overview-section-alerts')).toBeVisible()
}

export const checkPatientProfileSectionCardForInformation = (): void => {
  expect(screen.getByText('Age')).toBeVisible()
  expect(screen.getByText('Weight')).toBeVisible()
  expect(screen.getByText('Height')).toBeVisible()
  expect(screen.getByText('Equipment date')).toBeVisible()
  expect(screen.getByText('Insulin type')).toBeVisible()
}

export const checkPatientProfileSectionCardForLeadClinicians = (): void => {
  expect(screen.getByText('Number of lead clinicians')).toBeVisible()
}

export const checkPatientProfileSectionCardForRange = (): void => {
  expect(screen.getByText('Profile')).toBeVisible()
}

export const checkPatientProfileSectionCardForAlerts = (): void => {
  expect(screen.getByText('Monitoring alerts configuration')).toBeVisible()
}
