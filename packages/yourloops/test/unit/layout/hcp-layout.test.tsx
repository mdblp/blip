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

import React from 'react'
import { render, screen } from '@testing-library/react'
import * as authHookMock from '../../../lib/auth'
import { type User } from '../../../lib/auth'
import * as teamHookMock from '../../../lib/team'
import * as notificationsHookMock from '../../../lib/notifications/notification.hook'
import { MemoryRouter } from 'react-router-dom'
import * as patientHookMock from '../../../lib/patient/patient.provider'
import * as selectedTeamHookMock from '../../../lib/selected-team/selected-team.provider'
import { HcpLayout } from '../../../layout/hcp-layout'
import { UserRole } from '../../../lib/auth/models/enums/user-role.enum'

const profilePageTestId = 'mock-profile-page'
const notificationsPageTestId = 'mock-notifications-page'
const teamDetailsPageTestId = 'mock-team-details-page'
const allTestIds = [
  profilePageTestId,
  notificationsPageTestId,
  teamDetailsPageTestId
]

/* eslint-disable react/display-name */
jest.mock('../../../lib/auth')
jest.mock('../../../lib/team')
jest.mock('../../../lib/notifications/notification.hook')
jest.mock('../../../layout/dashboard-layout', () => (props: { children: JSX.Element }) => {
  return <> {props.children} </>
})
jest.mock('../../../pages/profile/profile-page', () => () => {
  return <div data-testid={profilePageTestId} />
})
jest.mock('../../../pages/notifications', () => () => {
  return <div data-testid={notificationsPageTestId} />
})
jest.mock('../../../pages/team/team-details-page', () => () => {
  return <div data-testid={teamDetailsPageTestId} />
})
describe('Hcp Layout', () => {
  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (patientHookMock.PatientProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (selectedTeamHookMock.SelectedTeamProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (notificationsHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (notificationsHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return { cancel: jest.fn() }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { removeTeamFromList: jest.fn() }
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRole.Hcp,
          isUserHcp: () => true,
          isUserCaregiver: () => false,
          isUserPatient: () => false
        } as User
      }
    })
  })

  function getMainLayoutJSX(initialEntry: string): JSX.Element {
    return (
      <MemoryRouter initialEntries={[initialEntry]}>
        <HcpLayout />
      </MemoryRouter>
    )
  }

  function checkInDocument(testId: string) {
    expect(screen.queryByTestId(testId)).toBeInTheDocument()
    allTestIds.filter(id => testId !== id).forEach(id => {
      expect(screen.queryByTestId(id)).not.toBeInTheDocument()
    })
  }

  it('should render profile page when route is /preferences', () => {
    render(getMainLayoutJSX('/preferences'))
    checkInDocument(profilePageTestId)
  })

  it('should render notifications page when route is /notifications', () => {
    render(getMainLayoutJSX('/notifications'))
    checkInDocument(notificationsPageTestId)
  })

  it('should render team details page when route matches /teams/:teamId and user is hcp', () => {
    render(getMainLayoutJSX('/teams/fakeTeamId'))
    checkInDocument(teamDetailsPageTestId)
  })
})
