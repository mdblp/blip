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
import { render, screen } from '@testing-library/react'
import { MainLayout } from '../../pages/main-layout'
import * as authHookMock from '../../lib/auth'
import { User } from '../../lib/auth'
import * as teamHookMock from '../../lib/team'
import * as notificationsHookMock from '../../lib/notifications/hook'
import { UserRoles } from '../../models/user'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'

const profilePageTestId = 'mock-profile-page'
const notificationsPageTestId = 'mock-notifications-page'
const teamDetailsPageTestId = 'mock-team-details-page'
const certifyAccountPageTestId = 'mock-certify-account-page'
const patientDataPageTestId = 'mock-patient-data-page'
const caregiverPageTestId = 'mock-caregivers-page'
const homePagePageTestId = 'mock-caregivers-page'
const allTestIds = [
  profilePageTestId,
  notificationsPageTestId,
  teamDetailsPageTestId,
  certifyAccountPageTestId,
  patientDataPageTestId,
  caregiverPageTestId,
  homePagePageTestId
]

/* eslint-disable react/display-name */
jest.mock('../../lib/auth')
jest.mock('../../lib/team')
jest.mock('../../lib/notifications/hook')
jest.mock('../../components/layouts/dashboard-layout', () => (props: { children: JSX.Element }) => {
  return <> {props.children} </>
})
jest.mock('../../pages/profile', () => () => {
  return <div data-testid={profilePageTestId} />
})
jest.mock('../../pages/notifications', () => () => {
  return <div data-testid={notificationsPageTestId} />
})
jest.mock('../../pages/team/team-details-page', () => () => {
  return <div data-testid={teamDetailsPageTestId} />
})
jest.mock('../../pages/hcp/certify-account-page', () => () => {
  return <div data-testid={certifyAccountPageTestId} />
})
jest.mock('../../components/patient-data', () => () => {
  return <div data-testid={patientDataPageTestId} />
})
jest.mock('../../pages/patient/caregivers/page', () => () => {
  return <div data-testid={caregiverPageTestId} />
})
jest.mock('../../pages/home-page', () => () => {
  return <div data-testid={homePagePageTestId} />
})
describe('MainLayout', () => {
  function getMainLayoutJSX(history: MemoryHistory): JSX.Element {
    return (
      <Router history={history}>
        <MainLayout />
      </Router>
    )
  }

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (notificationsHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    })
  })

  beforeEach(() => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.hcp,
          isUserHcp: () => true,
          isUserCaregiver: () => false,
          isUserPatient: () => false
        } as User
      }
    })
  })

  function mockCurrentUserAsCaregiver() {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.caregiver,
          isUserHcp: () => false,
          isUserCaregiver: () => true,
          isUserPatient: () => false
        } as User
      }
    })
  }

  function mockCurrentUserAsPatient() {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.patient,
          isUserHcp: () => false,
          isUserCaregiver: () => false,
          isUserPatient: () => true
        } as User
      }
    })
  }

  function checkInDocument(testId: string) {
    expect(screen.queryByTestId(testId)).toBeInTheDocument()
    allTestIds.filter(id => testId !== id).forEach(id => {
      expect(screen.queryByTestId(id)).not.toBeInTheDocument()
    })
  }

  it('should render profile page when route is /preferences', () => {
    const history = createMemoryHistory({ initialEntries: ['/preferences'] })
    render(getMainLayoutJSX(history))
    checkInDocument(profilePageTestId)
  })

  it('should render notifications page when route is /notifications', () => {
    const history = createMemoryHistory({ initialEntries: ['/notifications'] })
    render(getMainLayoutJSX(history))
    checkInDocument(notificationsPageTestId)
  })

  it('should render home page when route is /home and user is hcp', () => {
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    render(getMainLayoutJSX(history))
    checkInDocument(homePagePageTestId)
  })

  it('should render home page when route is / and user is hcp', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(getMainLayoutJSX(history))
    checkInDocument(homePagePageTestId)
    expect(history.location.pathname).toBe('/home')
  })

  it('should render home page when route is /home and user is caregiver', () => {
    mockCurrentUserAsCaregiver()
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    render(getMainLayoutJSX(history))
    checkInDocument(homePagePageTestId)
  })

  it('should render home page when route is / and user is caregiver', () => {
    mockCurrentUserAsCaregiver()
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(getMainLayoutJSX(history))
    checkInDocument(homePagePageTestId)
    expect(history.location.pathname).toBe('/home')
  })

  it('should render patient data page when route is /home and user is patient', () => {
    mockCurrentUserAsPatient()
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
  })

  it('should render patient data page when route is / and user is patient', () => {
    mockCurrentUserAsPatient()
    const history = createMemoryHistory({ initialEntries: ['/'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
    expect(history.location.pathname).toBe('/dashboard')
  })

  it('should render patient data page when user is patient and route is unknown', () => {
    mockCurrentUserAsPatient()
    const history = createMemoryHistory({ initialEntries: ['/wrongRoute'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
    expect(history.location.pathname).toBe('/wrongRoute')
  })

  it('should render patient data page when route matches /patient/:patientId and user is hcp', () => {
    const history = createMemoryHistory({ initialEntries: ['/patient/fakePatientId'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
  })

  it('should render patient data page when route matches /patient/:patientId and user is caregiver', () => {
    mockCurrentUserAsCaregiver()
    const history = createMemoryHistory({ initialEntries: ['/patient/fakePatientId'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
  })

  it('should redirect to /not-found when route is /home and user as unknown role', () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          role: UserRoles.unset,
          isUserHcp: () => false,
          isUserCaregiver: () => false,
          isUserPatient: () => false
        } as User
      }
    })
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    render(getMainLayoutJSX(history))
    expect(history.location.pathname).toBe('/not-found')
  })

  it('should render team details page when route matches /teams/:teamId and user is hcp', () => {
    const history = createMemoryHistory({ initialEntries: ['/teams/fakeTeamId'] })
    render(getMainLayoutJSX(history))
    checkInDocument(teamDetailsPageTestId)
  })

  it('should render team details page when route matches /teams/:teamId and user is patient', () => {
    mockCurrentUserAsPatient()
    const history = createMemoryHistory({ initialEntries: ['/teams/fakeTeamId'] })
    render(getMainLayoutJSX(history))
    checkInDocument(teamDetailsPageTestId)
  })

  it('should render certify account page when route is /certify and user is hcp', () => {
    const history = createMemoryHistory({ initialEntries: ['/certify'] })
    render(getMainLayoutJSX(history))
    checkInDocument(certifyAccountPageTestId)
  })

  it('should redirect to /not-found when route is unknown for user with hcp role', () => {
    const history = createMemoryHistory({ initialEntries: ['/wrongRoute'] })
    render(getMainLayoutJSX(history))
    expect(history.location.pathname).toBe('/not-found')
  })

  it('should redirect to /not-found when route is unknown for user with caregiver role', () => {
    mockCurrentUserAsCaregiver()
    const history = createMemoryHistory({ initialEntries: ['/wrongRoute'] })
    render(getMainLayoutJSX(history))
    expect(history.location.pathname).toBe('/not-found')
  })
})
