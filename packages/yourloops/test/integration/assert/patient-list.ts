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

import { screen, waitFor, within } from '@testing-library/react'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import userEvent from '@testing-library/user-event'

export const checkDataGridAfterSinglePatientFilter = (dataGridRow: HTMLElement, rowContent: string): void => {
  expect(screen.getByTestId('filters-label')).toHaveTextContent('Filters activated: 1 patient(s) out of 6')
  expect(screen.getByTestId('reset-filters-link')).toHaveTextContent('Reset')
  const allRows = within(dataGridRow).getAllByRole('row')
  expect(allRows).toHaveLength(2)
  expect(allRows[1]).toHaveTextContent(rowContent)
}

export const checkPatientListHeader = (role: UserRole.Hcp | UserRole.Caregiver = UserRole.Hcp) => {
  const header = screen.getByTestId('patient-list-header')
  expect(header).toBeInTheDocument()
  expect(screen.getByPlaceholderText('Search for a patient...')).toBeVisible()
  expect(within(header).getByLabelText('Search by first name, last name or birthdate (dd/mm/yyyy)')).toBeVisible()
  expect(within(header).getByTestId('column-settings-button')).toBeVisible()
  expect(screen.getByTestId('patient-list-grid')).toBeVisible()
  expect(screen.getByText('Data calculated on the last 7 days')).toBeVisible()
  expect(screen.getByRole('tab', { name: 'Current' })).toBeVisible()
  if (role === UserRole.Hcp) {
    expect(within(header).getByRole('button', { name: 'Filters' })).toBeVisible()
    expect(within(header).getByRole('button', { name: 'Add new patient' })).toBeVisible()
    expect(screen.getByRole('tab', { name: 'Pending' })).toBeVisible()
  } else {
    expect(within(header).queryByRole('button', { name: 'Filters' })).not.toBeInTheDocument()
    expect(screen.queryByTestId('filters-label')).not.toBeInTheDocument()
    expect(within(header).queryByRole('button', { name: 'Add new patient' })).not.toBeInTheDocument()
    expect(screen.queryByRole('tab', { name: 'Pending' })).not.toBeInTheDocument()
  }
}

export const checkPatientListTooltips = async (dataGridRows: HTMLElement): Promise<void> => {
  const monitoringAlertsColumnHeader = within(dataGridRows).getByText('Monitoring alerts')
  const tooltipText = 'Hover over the icons to learn more'
  expect(screen.queryByText(tooltipText)).not.toBeInTheDocument()
  await userEvent.hover(monitoringAlertsColumnHeader)
  expect(screen.getByText(tooltipText)).toBeVisible()
  await userEvent.unhover(monitoringAlertsColumnHeader)
  expect(screen.queryByText(tooltipText)).not.toBeVisible()
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowTimeSpentOutOfRangeIcon = within(dataGridRows).getAllByTestId('time-spent-out-of-range-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowTimeSpentOutOfRangeIcon)
  const timeSpentOutOfRangeTooltip = await screen.findByRole('tooltip')
  expect(timeSpentOutOfRangeTooltip).toBeVisible()
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('By default, this alert threshold is set to:')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('>25% time spent away from target over the given period.')
  expect(timeSpentOutOfRangeTooltip).toHaveTextContent('This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowTimeSpentOutOfRangeIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowHypoglycemiaIcon = within(dataGridRows).getAllByTestId('hypoglycemia-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowHypoglycemiaIcon)
  const hypoglycemiaTooltip = await screen.findByRole('tooltip')
  expect(hypoglycemiaTooltip).toBeVisible()
  expect(hypoglycemiaTooltip).toHaveTextContent('By default, this alert threshold is set to: >5% of severe hypoglycemia over the given period. This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowHypoglycemiaIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowNoDataIcon = within(dataGridRows).getAllByTestId('no-data-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowNoDataIcon)
  const noDataTooltip = await screen.findByRole('tooltip')
  expect(noDataTooltip).toBeVisible()
  expect(noDataTooltip).toHaveTextContent('By default, this alert threshold is set to: >50% of non transmission data over the given period. This value can be modified either at the level of all remotely monitored patients, or patient by patient.')
  await userEvent.unhover(firstRowNoDataIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  const firstRowMessageIcon = within(dataGridRows).getAllByTestId('message-icon')[0]
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  await userEvent.hover(firstRowMessageIcon)
  const messageTooltip = await screen.findByRole('tooltip')
  expect(messageTooltip).toBeVisible()
  expect(messageTooltip).toHaveTextContent('No new messages')
  await userEvent.unhover(firstRowMessageIcon)
  await waitFor(() => {
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })
}
