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
import { createMemoryHistory } from 'history'
import { Router } from 'react-router-dom'
import { act, render, screen, waitFor } from '@testing-library/react'
import { AuthContextProvider } from '../../lib/auth'
import { MainLobby } from '../../app/main-lobby'
import { checkHeader } from './utils/header'
import { checkDrawer } from './utils/drawer'
import { checkFooter } from './utils/footer'
import { mockUserDataFetch } from './utils/auth'
import { mockAuth0Hook } from './utils/mockAuth0Hook'
import { mockTeamAPI } from './utils/mockTeamAPI'
import { mockDataAPI } from './utils/mockDataAPI'
import { mockNotificationAPI } from './utils/mockNotificationAPI'
import { mockPatientAPI } from './utils/mockPatientAPI'

jest.mock('@auth0/auth0-react')
jest.setTimeout(10000)

describe('Patient dashboard for HCP', () => {
  const patientNonMonitoredId = '1db524f3b65f2'
  const patientMonitoredId = '2db524f3b65f2'
  const patientNonMonitoredDashboardRoute = `/patient/${patientNonMonitoredId}/dashboard`
  const patientMonitoredDashboardRoute = `/patient/${patientMonitoredId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
  })

  function getPatientDashboardForHCP(history) {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  function getByTextAndExpectVisible(text: string) {
    const element = screen.getByText(text)
    expect(element).toBeVisible()
    return element
  }

  function getByTestIdAndExpectVisible(testid: string) {
    const element = screen.getByTestId(testid)
    expect(element).toBeVisible()
    return element
  }

  function testCommonDisplayForPatient(patientId: string) {
    getByTestIdAndExpectVisible('subnav-arrow-back')
    getByTestIdAndExpectVisible('subnav-patient-list')
    getByTextAndExpectVisible('dashboard-header-period-text')
    const dashboardLink = getByTextAndExpectVisible('dashboard')
    const dailyLink = getByTextAndExpectVisible('Daily')
    const trendsLink = getByTextAndExpectVisible('Trends')
    expect(dashboardLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/dashboard`)
    expect(dailyLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/daily`)
    expect(trendsLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/trends`)
    getByTextAndExpectVisible('pdf-generate-report')
    getByTextAndExpectVisible('patient-info')
    getByTextAndExpectVisible('patient-statistics')
    getByTextAndExpectVisible('device-usage')
  }

  it('should render correct components when navigating to non monitored patient dashboard as an HCP', async () => {
    mockPatientAPI(patientNonMonitoredId, false)
    mockDataAPI(patientNonMonitoredId)
    const history = createMemoryHistory({ initialEntries: [patientNonMonitoredDashboardRoute] })

    act(() => {
      render(getPatientDashboardForHCP(history))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(patientNonMonitoredDashboardRoute)
      testCommonDisplayForPatient(patientNonMonitoredId)
    }, { timeout: 5000 })
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })

  it('should render correct components when navigating to monitored patient dashboard as an HCP', async () => {
    mockPatientAPI(patientMonitoredId, true)
    mockDataAPI(patientMonitoredId)
    const history = createMemoryHistory({ initialEntries: [patientMonitoredDashboardRoute] })

    act(() => {
      render(getPatientDashboardForHCP(history))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(patientMonitoredDashboardRoute)
      testCommonDisplayForPatient(patientMonitoredId)
    }, { timeout: 5000 })
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })
})
