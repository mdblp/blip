/*
 * Copyright (c) 2023-2026, Diabeloop
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
import { getTranslation } from '../../utils/i18n'

async function assertInfoRow(iconDataTestId: string, boxDataTestId: string, expectedTransKeyLabel: string, expectedTextValue: string) {
  const icon = await screen.findByTestId(iconDataTestId)
  expect(icon).toBeVisible()
  const label = within(screen.getByTestId(boxDataTestId)).getByText(getTranslation(expectedTransKeyLabel))
  expect(label).toBeVisible()
  const textValue = within(screen.getByTestId(boxDataTestId)).getByText(expectedTextValue)
  expect(textValue).toBeVisible()
}

export const testPatientPersonalInformation = async (): Promise<void> => {
  // Verify the information section container
  const informationSection = screen.getByTestId('information-section')
  expect(informationSection).toBeVisible()

  const avatar = screen.getByTestId('patient-avatar')
  expect(avatar).toBeInTheDocument()

  // Test birthdate section
  await assertInfoRow('date-of-birth-icon', 'date-of-birth-box', 'date-of-birth', 'Jan 1, 1980 (46 years old)')

  // Test gender section
  await assertInfoRow('gender-icon', 'gender-box', 'gender', 'Female')

  // Test weight section
  await assertInfoRow('weight-icon', 'weight-box', 'WEIGHT', '70 Kg')

  // Test height section
  await assertInfoRow('height-icon', 'height-box', 'HEIGHT', '170 cm')

  // Test email section
  await assertInfoRow('email-icon', 'email-box', 'email', 'patient1@diabeloop.fr')

  // Test equipment date section
  await assertInfoRow('equipment-date-icon', 'equipment-date-box', 'equipment-date', 'N/A')

  // Test HbA1c section
  await assertInfoRow('hba1c-icon', 'hba1c-box', 'hba1c', 'fakeA1cValue% - (May 26, 2023)')

  // Test glycemia units section
  await assertInfoRow('glycemia-units-icon', 'glycemia-units-box', 'glycemia-units', 'mg/dL')

  // Test insulin type section
  await assertInfoRow('insulin-type-icon', 'insulin-type-box', 'INSULIN_TYPE', 'Novorapid® U100')
}
