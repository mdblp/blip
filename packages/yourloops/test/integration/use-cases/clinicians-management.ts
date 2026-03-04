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

export const testCliniciansEmptyList = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByRole('button', { name: 'Add a referrer' })).toBeVisible()
  expect(cliniciansSection).toHaveTextContent('Referring HCP allows you to identify the healthcare professionals to contact in case of need.')
}

export const testCliniciansOneClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByRole('button', { name: 'Add a referrer' })).toBeVisible()
  expect(cliniciansSection).toHaveTextContent('Referring HCP allows you to identify the healthcare professionals to contact in case of need.')
}

export const testCliniciansFiveClinicians = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  expect(cliniciansSection.getByRole('button', { name: 'Add a referrer' })).toBeVisible()
  expect(cliniciansSection).toHaveTextContent('Referring HCP allows you to identify the healthcare professionals to contact in case of need.')
}

export const testPatientRemoveClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const removeButtons = cliniciansSection.getAllByRole('button', { name: 'Remove referrer' })
  expect(removeButtons.length).toBeGreaterThan(0)
  removeButtons.forEach((button) => {
    expect(button).toBeVisible()
  })
}

export const testHcpRemoveClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const removeButtons = cliniciansSection.getAllByRole('button', { name: 'Remove clinician' })
  expect(removeButtons.length).toBeGreaterThan(0)
  removeButtons.forEach((button) => {
    expect(button).toBeVisible()
  })
}

export const testPatientAddClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a referrer' })
  expect(addButton).toBeVisible()
}

export const testHcpAddClinician = () => {
  const cliniciansSection = within(screen.getByTestId('patient-clinicians'))
  const addButton = cliniciansSection.getByRole('button', { name: 'Add a clinician' })
  expect(addButton).toBeVisible()
}
