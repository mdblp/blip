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

export const checkCareTeamSectionsOverviewVisible = () => {
  expect(screen.queryByTestId('care-team-settings-overview-section-team-information')).toBeVisible()
  expect(screen.queryByTestId('care-team-settings-overview-section-members')).toBeVisible()
  expect(screen.queryByTestId('care-team-settings-overview-section-alerts')).toBeVisible()
}

export const checkCareTeamSectionsOverviewNotVisible  = () => {
  expect(screen.queryByTestId('care-team-settings-overview-section-team-information')).not.toBeInTheDocument()
  expect(screen.queryByTestId('care-team-settings-overview-section-members')).not.toBeInTheDocument()
  expect(screen.queryByTestId('care-team-settings-overview-section-alerts')).not.toBeInTheDocument()
}

export const checkCareTeamSectionCardForInfos  = () => {
  expect(screen.getByText('Name')).toBeVisible()
  expect(screen.getByText('Identification code')).toBeVisible()
  expect(screen.getByText('Address')).toBeVisible()
  expect(screen.getByText('City')).toBeVisible()
  expect(screen.getByText('Phone number')).toBeVisible()
}

export const checkCareTeamSectionCardForMembers = () => {
  // Checking that the number of admins is displayed correctly
  expect(screen.getByText('Number of admins')).toBeVisible()
  expect(screen.getByText('1')).toBeVisible()
  // Checking that the total number of members (admins included) is displayed correctly
  expect(screen.getByText('Total number of members')).toBeVisible()
  expect(screen.getByText('2')).toBeVisible()
}

export const checkCareTeamSectionCardForAlerts  = () => {
  expect(screen.getByText('Monitoring alerts configuration')).toBeVisible()
}

export const checkClickViewMoreInfos = async () => {
  const InformationSectionCard = within(screen.getByTestId('care-team-settings-overview-section-team-information'))
  await userEvent.click(InformationSectionCard.getByText('View more'))
  const teamInformationSectionTitle = await screen.findByText('Team information')
  expect(teamInformationSectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('app-main-header-mobile'))
  await userEvent.click(header.getByTestId('back-button'))

}

export const checkClickViewMoreMembers = async () => {
  const MembersSectionCard = within(screen.getByTestId('care-team-settings-overview-section-members'))
  await userEvent.click(MembersSectionCard.getByText('View more'))
  const membersSectionTitle = await screen.findByText('Members')
  expect(membersSectionTitle).toBeInTheDocument()
  const header = within(await screen.findByTestId('app-main-header-mobile'))
  await userEvent.click(header.getByTestId('back-button'))
}

export const checkClickViewMoreAlerts  = async () => {
  const AlertsSectionCard = within(screen.getByTestId('care-team-settings-overview-section-alerts'))
  await userEvent.click(AlertsSectionCard.getByText('View more'))
  const alertsSectionTitle = await screen.findByText('Monitoring alerts configuration')
  expect(alertsSectionTitle).toBeInTheDocument()
}
