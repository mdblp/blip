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

import { type BoundFunctions, fireEvent, type queries, screen, within } from '@testing-library/react'
import { type Team } from '../../../lib/team'
import userEvent from '@testing-library/user-event'
import { PRIVATE_TEAM_NAME } from '../../../lib/team/team.util'

interface TeamMenuInfo {
  selectedTeamName?: string
  isSelectedTeamPrivate?: boolean
  availableTeams: Team[]
}

export interface HeaderInfoMobile {
  loggedInUserFullName: string
  teamMenuInfo: TeamMenuInfo
}

const checkHeader = (header: BoundFunctions<typeof queries>) => {
  expect(header.getByLabelText('YourLoops Logo')).toBeVisible()
  expect(header.getByLabelText('Go to notifications list')).toBeVisible()
}

const checkUserMenu = async (header: BoundFunctions<typeof queries>, userName: string) => {
  const buttonUserMenuTestId = 'user-menu-button'

  expect(header.getByTestId(buttonUserMenuTestId)).toBeVisible()
  expect(header.queryByText(userName)).not.toBeInTheDocument()

  await userEvent.click(header.getByTestId(buttonUserMenuTestId))

  const userMenu = within(screen.getByTestId('user-menu'))
  expect(userMenu.getByText('User account')).toBeVisible()
  expect(userMenu.getByText('Customer support')).toBeVisible()
  expect(userMenu.getByText('Logout')).toBeVisible()

  await userEvent.click(screen.getByRole('presentation').firstChild as HTMLElement)
  expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument()
}

const checkTeamScopeMenu = async (header: BoundFunctions<typeof queries>, teamMenuInfo: TeamMenuInfo) => {
  const teamScopeMenuIcon = teamMenuInfo.isSelectedTeamPrivate ? 'private-practice-icon' : 'medical-team-icon'
  const teamScopeMenuText = teamMenuInfo.isSelectedTeamPrivate ? 'My private practice' : teamMenuInfo.selectedTeamName

  expect(header.getByLabelText('Open team selection menu')).toBeVisible()
  expect(header.queryByTestId(teamScopeMenuIcon)).not.toBeInTheDocument()
  expect(header.getByText(teamScopeMenuText)).toBeVisible()

  await userEvent.click(header.getByText(teamScopeMenuText))

  const teamScopeMenu = within(screen.getByTestId('team-scope-menu'))
  expect(teamScopeMenu.getByText('My private practice')).toBeVisible()
  expect(teamScopeMenu.getByText('Care teams')).toBeVisible()
  teamMenuInfo.availableTeams.forEach((team: Team) => {
    if (team.name === PRIVATE_TEAM_NAME) {
      return
    }
    expect(teamScopeMenu.getByText(team.name)).toBeVisible()
  })
  expect(teamScopeMenu.getByText('Create a care team')).toBeVisible()

  await userEvent.click(screen.getByRole('presentation').firstChild as HTMLElement)
  expect(screen.queryByTestId('team-scope-menu')).not.toBeInTheDocument()
}

export const checkHcpHeaderMobile = async (headerInfo: HeaderInfoMobile) => {
  const header = within(await screen.findByTestId('app-main-header-mobile'))

  if (headerInfo.teamMenuInfo.isSelectedTeamPrivate) {
    expect(header.queryByTestId('main-header-hcp-care-team-settings-button')).not.toBeInTheDocument()
  } else {
    expect(header.getByTestId('main-header-hcp-care-team-settings-button')).toBeVisible()
  }

  expect(header.queryByTestId('back-button')).not.toBeInTheDocument()

  //Go to notification tab and go back using the back button
  await userEvent.click(header.getByTestId("notification-icon"))
  expect(header.queryByTestId('team-selection-tab')).not.toBeInTheDocument()
  await userEvent.click(header.getByTestId("back-button"))

  expect(header.queryByTestId('team-selection-tab')).toBeVisible()

  await checkTeamScopeMenu(header, headerInfo.teamMenuInfo)
  await checkUserMenu(header, headerInfo.loggedInUserFullName)
  checkHeader(header)
}

export const checkCaregiverHeaderMobile = async (fullName: string) => {
  const header = within(await screen.findByTestId('app-main-header-mobile'))
  expect(header.queryByLabelText('Open team menu')).not.toBeInTheDocument()
  expect(header.queryByTestId('main-header-hcp-care-team-settings-button')).not.toBeInTheDocument()

  //Go to notification tab and go back using the back button
  await userEvent.click(header.getByTestId("notification-icon"))
  await userEvent.click(header.getByTestId("back-button"))

  await checkUserMenu(header, fullName)
  checkHeader(header)
}

export const checkPatientHeaderMobile = async (fullName: string) => {
  const header = within(await screen.findByTestId('app-main-header-mobile', {}, { timeout: 3000 }))
  const bottomPartHeader = within(await screen.findByTestId('bottom-part-main-header', {}, { timeout: 3000 }))
  expect(header.getByLabelText('Open team menu')).toBeVisible()

  expect(bottomPartHeader.getByTestId("download-report-mobile")).toBeVisible()

  await checkUserMenu(header, fullName)
  checkHeader(header)
}

export const changeTeamScope = async (currentTeamName: string, wantedTeamName: string) => {
  const header = within(screen.getByTestId('app-main-header-mobile'))
  await userEvent.click(header.getByText(currentTeamName))

  const teamScopeMenu = within(screen.getByTestId('team-scope-menu'))
  await userEvent.click(teamScopeMenu.getByText(wantedTeamName))
}

export const checkBannerLanguageChangeMobile = async () => {
  expect(await screen.getByTestId('dbl-banner-alert')).toHaveTextContent('This is a <b>critical banner message</b> for all users.')

  fireEvent.mouseDown(within(screen.getByTestId('user-account-locale-selector')).getByRole('combobox'))
  fireEvent.click(screen.getByRole('option', { name: 'English' }))
  const saveButton = screen.getByRole('button', { name: 'Save' })

  await userEvent.click(saveButton)

  expect(await screen.findByRole('banner')).toHaveTextContent('This is a <b>critical banner message</b> for all users.')
}
