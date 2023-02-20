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

import React from 'react'
import ReactDOM, { unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'

import * as teamHookMock from '../../../../lib/team'
import { type Team } from '../../../../lib/team'
import { buildTeam, triggerMouseEvent } from '../../common/utils'
import { createMemoryHistory } from 'history'
import * as authHookMock from '../../../../lib/auth'
import { type User } from '../../../../lib/auth'
import DirectShareApi from '../../../../lib/share/direct-share.api'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import * as alertHookMock from '../../../../components/utils/snackbar'
import { type ShareUser } from '../../../../lib/share/models/share-user.model'
import { UserInvitationStatus } from '../../../../lib/team/models/enums/user-invitation-status.enum'
import { type IUser } from '../../../../lib/data/models/i-user.model'
import { TeamMenuMemoized as TeamMenu } from '../../../../components/menus/team-menu'

// eslint-disable-next-line react/display-name
jest.mock('../../../../lib/team')
jest.mock('../../../../lib/auth')
jest.mock('../../../../components/utils/snackbar')
describe('Team Menu', () => {
  let container: HTMLElement | null = null
  const history = createMemoryHistory({ initialEntries: ['/'] })
  const teams: Team[] = [buildTeam('team1Id', []), buildTeam('team2Id', [])]

  const caregivers: ShareUser[] = [
    { user: {} as IUser, status: UserInvitationStatus.accepted },
    { user: {} as IUser, status: UserInvitationStatus.accepted }
  ]

  const createTeamMock = jest.fn()
  const joinTeamMock = jest.fn()
  const successMock = jest.fn()
  const errorMock = jest.fn()

  function openMenu(): void {
    const teamMenu = document.getElementById('team-menu')
    triggerMouseEvent('click', teamMenu)
  }

  function getTeamMenuJSX(): JSX.Element {
    return <Router history={history}>
      <TeamMenu />
    </Router>
  }

  function mountComponent(): void {
    act(() => {
      ReactDOM.render(getTeamMenuJSX(), container)
    })
  }

  beforeAll(() => {
    jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue(caregivers);
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { teams, createTeam: createTeamMock, joinTeam: joinTeamMock }
    });
    (teamHookMock.getDisplayTeamCode as jest.Mock).mockImplementation(() => {
      return '123-456-788'
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successMock, error: errorMock }
    })
  })

  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true, isUserPatient: () => false } as User }
    })
    container = document.createElement('div')
    document.body.appendChild(container)
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  it('should display number of teams user belongs to', () => {
    mountComponent()
    const teamBadge = container.querySelector('#team-menu-count-badge')
    expect(teams.length.toString()).toEqual(teamBadge.textContent)
  })

  it('should list all the teams user belongs to', () => {
    mountComponent()
    openMenu()
    const teamListItems = document.querySelectorAll('div.team-menu-list-item')
    expect(teams.length).toEqual(teamListItems.length)
  })

  it('should redirect to team details page when clicking on a team name', () => {
    mountComponent()
    const teamToSelect = teams[0]
    openMenu()
    const teamElement = document.getElementById(`team-menu-list-item-${teamToSelect.id}`)
    triggerMouseEvent('click', teamElement)
    expect(history.location.pathname).toBe(`/teams/${teamToSelect.id}`)
  })

  it('should redirect to caregiver list when clicking on my caregivers', async () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => false, isUserPatient: () => true } as User }
    })
    await act(async () => {
      render(getTeamMenuJSX())
      await waitFor(() => {
        expect(screen.queryByRole('button')).not.toBeNull()
      })
      fireEvent.click(screen.getByRole('button'))
      await waitFor(() => {
        expect(screen.queryByText('my-caregivers (2)')).not.toBeNull()
      })
      const redirectToCaregiversButton = screen.getByRole('menuitem', { name: /my-caregivers/ })
      fireEvent.click(redirectToCaregiversButton)
    })
    expect(history.location.pathname).toBe('/caregivers')
  })
})
