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
import { mockUserRetrieval } from './utils/auth'
import { mockAuth0Hook } from './utils/auth0Hook'
import { mockTeamAPI } from './utils/mockTeamAPI'
import { mockDataAPI } from './utils/mockDataAPI'
import { mockNotificationAPI } from './utils/mockNotificationAPI'

jest.mock('@auth0/auth0-react')
jest.setTimeout(10000)

describe('Patient dashboard for HCP', () => {
  const patientDashboardRoute = '/patient/1db524f3b65f2/dashboard'
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'
  const history = createMemoryHistory({ initialEntries: [patientDashboardRoute] })

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockTeamAPI()
    mockDataAPI()
    mockUserRetrieval(firstName, lastName)
  })

  function getPatientDashboardForHCP() {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  it('should render correct components when navigating to patient dashboard as an HCP', async () => {
    act(() => {
      render(getPatientDashboardForHCP())
    })

    await waitFor(() => expect(history.location.pathname).toBe('/patient/1db524f3b65f2/dashboard'))
    await waitFor(() => {
      const dashboardLink = screen.getByText('dashboard')
      const dailyLink = screen.getByText('Daily')
      const trendsLink = screen.getByText('Trends')
      expect(dashboardLink).toBeVisible()
      expect(dailyLink).toBeVisible()
      expect(trendsLink).toBeVisible()
      expect(dashboardLink.parentElement).toHaveAttribute('href', '/patient/1db524f3b65f2/dashboard')
      expect(dailyLink.parentElement).toHaveAttribute('href', '/patient/1db524f3b65f2/daily')
      expect(trendsLink.parentElement).toHaveAttribute('href', '/patient/1db524f3b65f2/trends')
    }, { timeout: 5000 })
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()

    /* TODO check widgets based on monitoring or not */
  })

  /* TODO test case to switch patient */
  /* TODO test case to click on nav bar and see if page is changing (daily/trends) */
})
