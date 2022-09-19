/**
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

import React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'

import * as teamHookMock from '../../../../lib/team'
import { buildTeam, buildTeamMember } from '../../common/utils'
import TeamDetailsPage from '../../../../pages/team/team-details-page'
import { getTheme } from '../../../../components/theme'
import { ThemeProvider } from '@material-ui/core'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import * as authHookMock from '../../../../lib/auth'
import { User } from '../../../../lib/auth'

const teamId1 = 'teamId1'

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({
    teamId: teamId1
  })
}))
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/auth')
describe('TeamDetailsPage', () => {
  const teamId2 = 'teamId2'

  const members = [
    buildTeamMember('userId1'),
    buildTeamMember('userId2')
  ]
  const team1 = buildTeam(teamId1, members, 'team1')
  const team2 = buildTeam(teamId2, members, 'team2')
  team2.monitoring = undefined
  const teams = [team1, team2]
  const getTeamMock = jest.fn().mockReturnValue(team1)
  const getMedicalTeamsMock = jest.fn().mockReturnValue(teams)
  const history = createMemoryHistory({ initialEntries: ['/fakeRoute'] })

  beforeEach(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getMedicalTeams: getMedicalTeamsMock, getTeam: getTeamMock }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true, isUserPatient: () => false } as User }
    })
  })

  function getTeamDetailsPageJSX(): JSX.Element {
    return <Router history={history}>
      <ThemeProvider theme={getTheme()}>
        <TeamDetailsPage />
      </ThemeProvider>
    </Router>
  }

  it('should render empty component if there is no selected team', () => {
    getTeamMock.mockReturnValueOnce(null)
    render(getTeamDetailsPageJSX())
    expect(screen.queryByRole('main')).toBeNull()
  })

  it('should render component if there is a selected team', () => {
    render(getTeamDetailsPageJSX())
    expect(screen.queryByRole('main')).not.toBeNull()
  })

  it('should redirect to / when clicking on back button', () => {
    render(getTeamDetailsPageJSX())
    const backButton = screen.getByRole('button', { name: 'back-button' })
    fireEvent.click(backButton)
    expect(history.location.pathname).toBe('/')
  })

  it('should redirect to the team details page when selecting a new team', () => {
    render(getTeamDetailsPageJSX())
    const selectInput = screen.getByRole('button', { name: team1.name })
    fireEvent.mouseDown(selectInput)
    const menuItems = within(screen.getByRole('listbox'))
    fireEvent.click(menuItems.getByText(team2.name))
    expect(history.location.pathname).toBe(`/teams/${team2.id}`)
  })

  it('should display specific information when user is HCP and team is monitored', () => {
    render(getTeamDetailsPageJSX())
    expect(screen.queryByRole('navigation')).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'members' })).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'information' })).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'alarms' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'members' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'information' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'alarms' })).not.toBeNull()
  })

  it('should display specific information when user is HCP and team is not monitored', () => {
    getTeamMock.mockReturnValueOnce(team2)
    render(getTeamDetailsPageJSX())
    expect(screen.queryByRole('navigation')).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'members' })).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'information' })).not.toBeNull()
    expect(screen.queryByRole('link', { name: 'alarms' })).toBeNull()
    expect(screen.queryByRole('region', { name: 'members' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'information' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'alarms' })).toBeNull()
  })

  it('should display specific information when user is patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => false, isUserPatient: () => true } as User }
    })
    render(getTeamDetailsPageJSX())
    expect(screen.queryByRole('navigation')).toBeNull()
    expect(screen.queryByRole('link', { name: 'members' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'information' })).toBeNull()
    expect(screen.queryByRole('link', { name: 'alarms' })).toBeNull()
    expect(screen.queryByRole('region', { name: 'members' })).toBeNull()
    expect(screen.queryByRole('region', { name: 'information' })).not.toBeNull()
    expect(screen.queryByRole('region', { name: 'alarms' })).toBeNull()
  })
})
