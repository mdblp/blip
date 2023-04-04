/*
 * Copyright (c) 2023, Diabeloop
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
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'

export const checkPatientListHeader = (role: UserRole.Hcp | UserRole.Caregiver = UserRole.Hcp) => {
  const header = screen.getByTestId('patient-list-header')
  expect(header).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Search for a patient...')).toBeVisible()
  expect(within(header).getByLabelText('Search by first name, last name or birthdate (dd/mm/yyyy)')).toBeVisible()
  expect(within(header).getByTestId('column-settings-button')).toBeVisible()
  expect(screen.getByTestId('patient-list-grid')).toBeVisible()
  expect(screen.getByText('Data calculated on the last 7 days')).toBeVisible()

  if (role === UserRole.Hcp) {
    expect(within(header).getByRole('button', { name: 'Filters' })).toBeVisible()
    expect(within(header).getByRole('button', { name: 'Add new patient' })).toBeVisible()
  } else {
    expect(within(header).queryByRole('button', { name: 'Filters' })).not.toBeInTheDocument()
    expect(within(header).queryByRole('button', { name: 'Add new patient' })).not.toBeInTheDocument()
  }
}
