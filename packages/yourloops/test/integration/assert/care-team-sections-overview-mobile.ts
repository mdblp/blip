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
import userEvent from '@testing-library/user-event/dist/cjs/index.js'

export const checkCareTeamSectionsOverviewVisible = (): void => {
  expect(screen.queryByTestId('care-team-settings-menu-mobile-team-information')).toBeVisible()
  expect(screen.queryByTestId('care-team-settings-menu-mobile-members')).toBeVisible()
  expect(screen.queryByTestId('care-team-settings-menu-mobile-alerts')).toBeVisible()
}

export const checkCareTeamSectionsOverviewNotVisible = (): void => {
  expect(screen.queryByTestId('care-team-settings-menu-mobile-team-information')).not.toBeInTheDocument()
  expect(screen.queryByTestId('care-team-settings-menu-mobile-members')).not.toBeInTheDocument()
  expect(screen.queryByTestId('care-team-settings-menu-mobile-alerts')).not.toBeInTheDocument()
}

export const checkCareTeamSectionCardForInfos = (): void => {
  expect(screen.getByText('Identification code')).toBeVisible()
  expect(screen.getByText('Address')).toBeVisible()
  expect(screen.getByText('City')).toBeVisible()
  expect(screen.getByText('Phone number')).toBeVisible()
}

export const checkCareTeamSectionCardForMembers = (): void => {
  // Checking that the number of admins is displayed correctly
  expect(screen.getByText('Number of admins')).toBeVisible()
  expect(screen.getByText('1')).toBeVisible()
  // Checking that the number of members is displayed correctly
  expect(screen.getByText('Number of members')).toBeVisible()
  expect(screen.getByText('2')).toBeVisible()
}

export const checkCareTeamSectionCardForAlertsDefault = (): void => {
  expect(screen.getByText('Default values applied.')).toBeVisible()
}

export const checkCareTeamSectionCardForAlertsCustom = (): void => {
  expect(screen.getByText('Custom values applied.')).toBeVisible()
}

export const checkClickViewMoreInfos = async (): Promise<void> => {
  const viewMoreInfos = within(screen.getByTestId('care-team-settings-menu-mobile-team-information'))
  await userEvent.click(viewMoreInfos.getByText('View more'))
  const userAccountTitle = await screen.findByText('Team information')
  expect(userAccountTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('app-main-header-mobile'))
  await userEvent.click(header.getByTestId('back-button'))

}

export const checkClickViewMoreMembers = async (): Promise<void> => {
  const viewMoreUserAccount = within(screen.getByTestId('care-team-settings-menu-mobile-members'))
  await userEvent.click(viewMoreUserAccount.getByText('View more'))
  const userDataSharingPageTitle = await screen.findByText('Members')
  expect(userDataSharingPageTitle).toBeInTheDocument()
}

export const checkClickViewMoreAlerts = async (): Promise<void> => {
  const viewMoreUserAccount = within(screen.getByTestId('care-team-settings-menu-mobile-alerts'))
  await userEvent.click(viewMoreUserAccount.getByText('View more'))
  const userDataSharingPageTitle = await screen.findByText('Monitoring alerts configuration')
  expect(userDataSharingPageTitle).toBeInTheDocument()
}
