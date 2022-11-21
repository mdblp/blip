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
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

import * as notificationHookMock from '../../../../lib/notifications/hook'
import * as authHookMock from '../../../../lib/auth'
import * as teamHookMock from '../../../../lib/team'
import { Team } from '../../../../lib/team'
import { buildTeam, triggerMouseEvent } from '../../common/utils'
import MainHeader from '../../../../components/header-bars/main-header'
import DirectShareApi from '../../../../lib/share/direct-share-api'
import { Profile, UserRoles } from '../../../../models/user'
import User from '../../../../lib/auth/user'
import { INotification, NotificationType } from '../../../../lib/notifications/models'

jest.mock('../../../../lib/notifications/hook')
jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
describe('Main Header', () => {
  let container: HTMLElement | null = null
  const history = createMemoryHistory({ initialEntries: ['/preferences'] })
  const onClickLeftIcon = jest.fn()
  const notifications: INotification[] = [{
    metricsType: 'join_team',
    type: NotificationType.careTeamProInvitation,
    creator: { userid: 'creatorUserId', profile: {} as Profile },
    creatorId: 'creatorId',
    date: new Date().toISOString(),
    email: 'fake@email.com',
    id: 'fakeId'
  }]
  const teams: Team[] = [buildTeam('team1Id', []), buildTeam('team1Id', [])]

  function mountComponent(withLeftIcon?: boolean): void {
    act(() => {
      render(
        <Router history={history}>
          <MainHeader withShrinkIcon={withLeftIcon} onClickShrinkIcon={onClickLeftIcon} />
        </Router>, container)
    })
  }

  beforeAll(() => {
    jest.spyOn(DirectShareApi, 'getDirectShares').mockResolvedValue([]);
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        initialized: true,
        sentInvitations: [],
        getReceivedInvitations: jest.fn().mockResolvedValue(notifications),
        receivedInvitations: notifications
      }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { teams }
    })
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container);
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { role: UserRoles.hcp, isUserHcp: () => true, isUserPatient: () => false } as User
      }
    })
  })

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container)
      container.remove()
      container = null
    }
  })

  it("should redirect to '/' route when clicking on logo", () => {
    mountComponent()
    const logo = document.getElementById('header-main-logo')
    triggerMouseEvent('click', logo)
    expect(history.location.pathname).toBe('/')
  })

  it("should redirect to '/notifications' route when clicking on notification icon", () => {
    mountComponent()
    const notificationLink = document.getElementById('notification-count-badge')
    triggerMouseEvent('click', notificationLink)
    expect(history.location.pathname).toBe('/notifications')
  })

  it('Should display the number of pending notifications', () => {
    mountComponent()
    const notificationBadge = container.querySelector('#notification-count-badge')
    expect(notificationBadge.textContent).toEqual(notifications.length.toString())
  })

  it('Team Menu should not be rendered for Caregivers', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { role: UserRoles.caregiver } as User
      }
    })
    mountComponent()
    const teamMenu = container.querySelector('#team-menu')
    expect(teamMenu).toBeNull()
  })

  it('Team Menu should be rendered for Hcp', () => {
    mountComponent()
    const teamMenu = container.querySelector('#team-menu')
    expect(teamMenu).toBeTruthy()
  })

  it('Team Menu should be rendered for Patient', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { role: UserRoles.patient, isUserHcp: () => false, isUserPatient: () => true } as User
      }
    })
    mountComponent()
    const teamMenu = container.querySelector('#team-menu')
    expect(teamMenu).toBeTruthy()
  })

  it('Should display left menu icon if activated', () => {
    mountComponent(true)
    const leftIcon = document.getElementById('left-menu-icon')
    expect(leftIcon).toBeTruthy()
  })

  it('Should call onClickLeftIcon when clicking left menu icon', () => {
    mountComponent(true)
    const leftIcon = document.getElementById('left-menu-icon')
    triggerMouseEvent('click', leftIcon)
    expect(onClickLeftIcon).toBeCalledTimes(1)
  })
})
