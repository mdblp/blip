/*
 * Copyright (c) 2023-2024, Diabeloop
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

export const testPatientPersonalInformation = async (): Promise<void> => {
  // Test birthdate section
  const cakeIcon = await screen.findByTestId('CakeIcon')
  expect(cakeIcon).toBeInTheDocument()

  // Test gender section
  const personIcon = await screen.findByTestId('PersonIcon')
  expect(personIcon).toBeInTheDocument()

  // Test email section
  const emailIcon = await screen.findByTestId('EmailIcon')
  expect(emailIcon).toBeInTheDocument()

  // Test email section
  const equipmentDate = await screen.findByTestId('PhoneAndroidIcon')
  expect(equipmentDate).toBeInTheDocument()

  // Test weight section
  const weightIcon = await screen.findByTestId('MonitorWeightIcon')
  expect(weightIcon).toBeInTheDocument()

  // Test height section
  const heightIcon = await screen.findByTestId('HeightIcon')
  expect(heightIcon).toBeInTheDocument()

  // Test HbA1c section
  const scienceIcon = await screen.findByTestId('StraightenIcon')
  expect(scienceIcon).toBeInTheDocument()

  // Test glycemia units section
  const scaleIcon = await screen.findByTestId('ScaleIcon')
  expect(scaleIcon).toBeInTheDocument()

  // Test insulin type section
  const insulinIcon = await screen.findByTestId('basal-icon')
  expect(insulinIcon).toBeInTheDocument()

  // Verify the information section container
  const informationSection = screen.getByTestId('information-section')
  expect(informationSection).toBeInTheDocument()
}

export const testPatientPersonalInformationWithMedicalData = async (): Promise<void> => {
  // Test HbA1c value display with percentage
  const hba1cValue = await screen.findByText(/%/)
  expect(hba1cValue).toBeInTheDocument()

  // Test units display (mg/dL or mmol/L)
  const unitsText = await screen.findByText(/mg.*dL|mmol.*L/i)
  expect(unitsText).toBeInTheDocument()

  // Test age calculation display
  const ageValue = await screen.findByText(/years.old/i)
  expect(ageValue).toBeInTheDocument()
}
