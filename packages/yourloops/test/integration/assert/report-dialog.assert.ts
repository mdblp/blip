/*
 * Copyright (c) 2025, Diabeloop
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

export const checkReportDialogPresets = () => {
  const generateReportDialog = within(screen.getByRole('dialog'))
  expect(generateReportDialog.getByText('Download report')).toBeVisible()
  expect(generateReportDialog.getByText('Choose a fixed period')).toBeVisible()
  expect(generateReportDialog.getByRole('button', { name: '1 week' })).toHaveAttribute('aria-selected', 'true')
  expect(generateReportDialog.getByRole('button', { name: '2 weeks' })).toHaveAttribute('aria-selected', 'false')
  expect(generateReportDialog.getByRole('button', { name: '4 weeks' })).toHaveAttribute('aria-selected', 'false')
  expect(generateReportDialog.getByRole('button', { name: '3 months' })).toHaveAttribute('aria-selected', 'false')
  expect(generateReportDialog.getByText('or a customized period')).toBeVisible()
  expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-15')).toHaveAttribute('aria-selected', 'true')
  expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-09')).toHaveAttribute('aria-selected', 'true')
  expect(generateReportDialog.getByTestId('button-calendar-day-2020-01-08')).toHaveAttribute('aria-selected', 'false')
  expect(generateReportDialog.getByText('Choose an output format')).toBeVisible()
  expect(generateReportDialog.getByRole('radio', { name: 'PDF' })).toBeChecked()
  expect(generateReportDialog.getByRole('radio', { name: 'CSV' })).not.toBeChecked()
  expect(generateReportDialog.getByText('Cancel')).toBeVisible()
}
