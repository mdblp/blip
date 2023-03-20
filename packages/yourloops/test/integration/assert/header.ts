/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { type BoundFunctions, type queries, screen, within } from '@testing-library/react'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'
import { type Team } from '../../../lib/team'
import userEvent from '@testing-library/user-event'

const PRIVATE_TEAM_NAME = 'private'

const checkHeader = (header: BoundFunctions<typeof queries>) => {
  expect(header.getByLabelText('YourLoops Logo')).toBeVisible()
  expect(header.getByLabelText('Go to notifications list')).toBeVisible()
}

const getIconTestIdByRole = (role: UserRole): string => {
  switch (role) {
    case UserRole.Caregiver:
      return 'caregiver-icon'
    case UserRole.Hcp:
      return 'hcp-icon'
    case UserRole.Patient:
      return 'patient-icon'
  }
}

const checkUserMenu = async (header: BoundFunctions<typeof queries>, userName: string, role: UserRole) => {
  const iconTestId = getIconTestIdByRole(role)

  expect(header.getByTestId(iconTestId)).toBeVisible()
  expect(header.getByText(userName)).toBeVisible()

  await userEvent.click(header.getByText(userName))

  const userMenu = within(screen.getByTestId('user-menu'))
  expect(userMenu.getByText('Profile settings')).toBeVisible()
  expect(userMenu.getByText('Customer support')).toBeVisible()
  expect(userMenu.getByText('Logout')).toBeVisible()

  await userEvent.click(screen.getByRole('presentation').firstChild as HTMLElement)
  expect(screen.queryByTestId('user-menu')).not.toBeInTheDocument()
}

const checkTeamScopeMenu = async (header: BoundFunctions<typeof queries>, selectedTeamParams: { teamName: string, isPrivate?: boolean }, availableTeams: Team[]) => {
  const teamScopeMenuIcon = selectedTeamParams.isPrivate ? 'private-practice-icon' : 'medical-team-icon'
  const teamScopeMenuText = selectedTeamParams.isPrivate ? 'My private practice' : selectedTeamParams.teamName

  expect(header.getByLabelText('Open team selection menu')).toBeVisible()
  expect(header.getByTestId(teamScopeMenuIcon)).toBeVisible()
  expect(header.getByText(teamScopeMenuText)).toBeVisible()

  await userEvent.click(header.getByText(teamScopeMenuText))

  const teamScopeMenu = within(screen.getByTestId('team-scope-menu'))
  expect(teamScopeMenu.getByText('My private practice')).toBeVisible()
  expect(teamScopeMenu.getByText('Care teams')).toBeVisible()
  availableTeams.forEach((team: Team) => {
    if (team.name === PRIVATE_TEAM_NAME) {
      return
    }
    expect(teamScopeMenu.getByText(team.name)).toBeVisible()
  })
  expect(teamScopeMenu.getByText('Create a new care team')).toBeVisible()

  await userEvent.click(screen.getByRole('presentation').firstChild as HTMLElement)
  expect(screen.queryByTestId('team-scope-menu')).not.toBeInTheDocument()
}

export const checkHcpHeader = async (fullName: string, selectedTeamParams: { teamName: string, isPrivate?: boolean }, availableTeams: Team[]) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.getByLabelText('Toggle left drawer')).toBeVisible()

  expect(header.getByText('Patients')).toBeVisible()
  if (selectedTeamParams.isPrivate) {
    expect(header.queryByText('Care team')).not.toBeInTheDocument()
  } else {
    expect(header.getByText('Care team')).toBeVisible()
  }

  await checkTeamScopeMenu(header, selectedTeamParams, availableTeams)
  await checkUserMenu(header, fullName, UserRole.Hcp)
  checkHeader(header)
}

export const checkCaregiverHeader = async (fullName: string) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.getByLabelText('Toggle left drawer')).toBeVisible()
  expect(header.queryByLabelText('Open team menu')).not.toBeInTheDocument()

  await checkUserMenu(header, fullName, UserRole.Caregiver)
  checkHeader(header)
}

export const checkPatientHeader = async (fullName: string) => {
  const header = within(screen.getByTestId('app-main-header'))
  expect(header.queryByLabelText('Toggle left drawer')).not.toBeInTheDocument()
  expect(header.getByLabelText('Open team menu')).toBeVisible()

  await checkUserMenu(header, fullName, UserRole.Patient)
  checkHeader(header)
}
