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
import userEvent from '@testing-library/user-event'

interface FilterPatientsPresentationToggles {
  manualFlagFilterToggle: boolean
  outOfRangeFilterToggle: boolean
  hypoglycemiaFilterToggle: boolean
  dataNotTransferredFilterToggle: boolean
  unreadMessagesFilterToggle: boolean
}

export const defaultToggles: FilterPatientsPresentationToggles = {
  manualFlagFilterToggle: false,
  outOfRangeFilterToggle: false,
  hypoglycemiaFilterToggle: false,
  dataNotTransferredFilterToggle: false,
  unreadMessagesFilterToggle: false
}

export const checkPatientsFilters = (toggles: FilterPatientsPresentationToggles = defaultToggles): void => {
  const filtersPresentation = screen.getByRole('presentation')
  expect(filtersPresentation).toHaveTextContent('Personal settingsManual flagMonitoring alertsTime spent out of the target rangeBelow rangeData not transmittedNotificationMessagesCancelApply')
  const manualFlagFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients being flagged')).getByRole('switch')
  const outOfRangeFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Time out of the range" monitoring alert')).getByRole('switch')
  const hypoglycemiaFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Hypoglycemia" monitoring alert')).getByRole('switch')
  const dataNotTransferredFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Data not transmitted" monitoring alert')).getByRole('switch')
  const unreadMessagesFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having sent unread messages')).getByRole('switch')
  expect(manualFlagFilterToggle).toHaveProperty('checked', toggles.manualFlagFilterToggle)
  expect(outOfRangeFilterToggle).toHaveProperty('checked', toggles.outOfRangeFilterToggle)
  expect(hypoglycemiaFilterToggle).toHaveProperty('checked', toggles.hypoglycemiaFilterToggle)
  expect(dataNotTransferredFilterToggle).toHaveProperty('checked', toggles.dataNotTransferredFilterToggle)
  expect(unreadMessagesFilterToggle).toHaveProperty('checked', toggles.unreadMessagesFilterToggle)
}

export const checkPatientFiltersForPrivateTeam = async (): Promise<void> => {
  const filterButton = screen.getByRole('button', { name: 'Filters' })
  await userEvent.click(filterButton)
  const toggleFiltersList = screen.getByRole('presentation')
  expect(toggleFiltersList).toHaveTextContent('Personal settingsManual flagCancelApply')
}

export const updatePatientsFilters = async (toggles: FilterPatientsPresentationToggles = defaultToggles): Promise<void> => {
  const filtersPresentation = screen.getByRole('presentation')
  if (toggles.manualFlagFilterToggle) {
    const manualFlagFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients being flagged')).getByRole('switch')
    await userEvent.click(manualFlagFilterToggle)
  }
  if (toggles.outOfRangeFilterToggle) {
    const outOfRangeFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Time out of the range" monitoring alert')).getByRole('switch')
    await userEvent.click(outOfRangeFilterToggle)
  }
  if (toggles.hypoglycemiaFilterToggle) {
    const hypoglycemiaFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Hypoglycemia" monitoring alert')).getByRole('switch')
    await userEvent.click(hypoglycemiaFilterToggle)
  }
  if (toggles.dataNotTransferredFilterToggle) {
    const dataNotTransferredFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having a "Data not transmitted" monitoring alert')).getByRole('switch')
    await userEvent.click(dataNotTransferredFilterToggle)
  }
  if (toggles.unreadMessagesFilterToggle) {
    const unreadMessagesFilterToggle = within(within(filtersPresentation).getByLabelText('Filter patients having sent unread messages')).getByRole('switch')
    await userEvent.click(unreadMessagesFilterToggle)
  }

  const applyButton = within(filtersPresentation).getByRole('button', { name: 'Apply' })
  await userEvent.click(applyButton)
  expect(filtersPresentation).not.toBeInTheDocument()
}

export const closeFiltersPresentation = async (): Promise<void> => {
  const filtersPresentation = screen.getByRole('presentation')
  const cancelButton = within(filtersPresentation).getByRole('button', { name: 'Cancel' })
  await userEvent.click(cancelButton)
  expect(filtersPresentation).not.toBeInTheDocument()
}
