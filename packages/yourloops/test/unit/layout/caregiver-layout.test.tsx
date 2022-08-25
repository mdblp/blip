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
import * as authHookMock from '../../../lib/auth'
import { User } from '../../../lib/auth'
import * as patientHookMock from '../../../lib/patient/hook'
import * as notificationsHookMock from '../../../lib/notifications/hook'
import { UserRoles } from '../../../models/user'
import { Router } from 'react-router-dom'
import { createMemoryHistory, MemoryHistory } from 'history'
import { CaregiverLayout } from '../../../layout/caregiver-layout'

const profilePageTestId = 'mock-profile-page'
const notificationsPageTestId = 'mock-notifications-page'
const patientDataPageTestId = 'mock-patient-data-page'
const caregiverPageTestId = 'mock-caregivers-page'
const homePagePageTestId = 'mock-caregivers-page'
const allTestIds = [
  profilePageTestId,
  notificationsPageTestId,
  patientDataPageTestId,
  caregiverPageTestId,
  homePagePageTestId
]

/* eslint-disable react/display-name */
jest.mock('../../../lib/auth')
jest.mock('../../../lib/notifications/hook')
jest.mock('../../../lib/patient/hook')
jest.mock('../../../components/layouts/dashboard-layout', () => (props: { children: JSX.Element }) => {
  return <> {props.children} </>
})
jest.mock('../../../pages/profile', () => () => {
  return <div data-testid={profilePageTestId} />
})
jest.mock('../../../pages/notifications', () => () => {
  return <div data-testid={notificationsPageTestId} />
})
jest.mock('../../../components/patient-data', () => () => {
  return <div data-testid={patientDataPageTestId} />
})
jest.mock('../../../pages/patient/caregivers/page', () => () => {
  return <div data-testid={caregiverPageTestId} />
})
jest.mock('../../../pages/home-page', () => () => {
  return <div data-testid={homePagePageTestId} />
})
describe('Caregiver Layout', () => {
  function getMainLayoutJSX(history: MemoryHistory): JSX.Element {
    return (
      <Router history={history}>
        <CaregiverLayout />
      </Router>
    )
  }

  beforeAll(() => {
    (patientHookMock.PatientProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (notificationsHookMock.NotificationContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children
    });
    (notificationsHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return { cancel: jest.fn() }
    })
  })

  beforeEach(() => {
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
  })

  async function checkInDocument(testId: string) {
    expect(screen.getByTestId(testId)).toBeInTheDocument()
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

  it('should render home page when route is /home and user is caregiver', () => {
    const history = createMemoryHistory({ initialEntries: ['/home'] })
    render(getMainLayoutJSX(history))
    checkInDocument(homePagePageTestId)
  })

  it('should render home page when route is / and user is caregiver', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })
    const { container } = render(getMainLayoutJSX(history))
    console.log(container)
    checkInDocument(homePagePageTestId)
    expect(history.location.pathname).toBe('/home')
  })

  it('should render patient data page when route matches /patient/:patientId and user is caregiver', () => {
    const history = createMemoryHistory({ initialEntries: ['/patient/fakePatientId'] })
    render(getMainLayoutJSX(history))
    checkInDocument(patientDataPageTestId)
  })

  it('should redirect to /not-found when route is unknown for user with caregiver role', () => {
    const history = createMemoryHistory({ initialEntries: ['/wrongRoute'] })
    render(getMainLayoutJSX(history))
    expect(history.location.pathname).toBe('/not-found')
  })
})
