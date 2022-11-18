/*
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

import { BoundFunctions, queries, screen, within } from '@testing-library/react'

const checkHeader = (header: BoundFunctions<typeof queries>, fullName: string) => {
  expect(header.getByLabelText('YourLoops Logo')).toBeVisible()
  expect(header.getByLabelText('Go to notifications list')).toBeVisible()
  expect(header.getByText(fullName)).toBeVisible()
}

export const checkHCPHeader = (fullName: string) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.getByLabelText('Toggle left drawer')).toBeVisible()
  expect(header.getByLabelText('Open team menu')).toBeVisible()
  checkHeader(header, fullName)
}

export const checkCaregiverHeader = (fullName: string) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.getByLabelText('Toggle left drawer')).toBeVisible()
  expect(header.queryByLabelText('Open team menu')).not.toBeInTheDocument()
  checkHeader(header, fullName)
}

export const checkPatientHeader = (fullName: string) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.queryByLabelText('Toggle left drawer')).not.toBeInTheDocument()
  expect(header.getByLabelText('Open team menu')).toBeVisible()
  checkHeader(header, fullName)
}
