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
import { act, BoundFunctions, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
import {
  mockPatientAPI,
  monitoredPatientFullName,
  monitoredPatientId,
  unMonitoredPatientFullName,
  unMonitoredPatientId
} from './utils/mockPatientAPI'
import { mockChatAPI } from './utils/mockChatAPI'
import { mockMedicalFilesAPI } from './utils/mockMedicalFilesAPI'
import { queries } from '@testing-library/dom'
import { mockDirectShareApi } from './utils/mockDirectShareAPI'

jest.setTimeout(15000)

describe('Patient dashboard for HCP', () => {
  const unMonitoredPatientDashboardRoute = `/patient/${unMonitoredPatientId}/dashboard`
  const monitoredPatientDashboardRoute = `/patient/${monitoredPatientId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
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

  function testPatientDashboardCommonDisplay(dashboard: BoundFunctions<typeof queries>, patientId: string, fullName: string) {
    /* Top bar */
    expect(dashboard.getByTestId('subnav-arrow-back')).toBeVisible()
    expect(dashboard.getByTestId('subnav-patient-list')).toBeVisible()
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()
    const dashboardLink = dashboard.getByText('Dashboard')
    const dailyLink = dashboard.getByText('Daily')
    const trendsLink = dashboard.getByText('Trends')
    expect(dashboardLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/dashboard`)
    expect(dashboardLink).toBeVisible()
    expect(dailyLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/daily`)
    expect(dailyLink).toBeVisible()
    expect(trendsLink.parentElement).toHaveAttribute('href', `/patient/${patientId}/trends`)
    expect(trendsLink).toBeVisible()
    expect(dashboard.getByText('Generate report')).toBeVisible()

    /* Patient info widget */
    const patientInfoCard = within(dashboard.getByTestId('patient-info-card'))
    expect(patientInfoCard.getByText('Patient Information')).toBeVisible()
    expect(patientInfoCard.getByText(fullName)).toBeVisible()

    /* Patient stats widget */
    expect(dashboard.getByText('Patient statistics')).toBeVisible()

    /* Device usage widget */
    expect(dashboard.getByText('Device Usage')).toBeVisible()
  }

  it('should render correct components when navigating to non monitored patient dashboard as an HCP', async () => {
    const history = createMemoryHistory({ initialEntries: [unMonitoredPatientDashboardRoute] })

    act(() => {
      render(getPatientDashboardForHCP(history))
    })

    const dashboard = within(await screen.findByTestId('patient-dashboard', {}, { timeout: 3000 }))
    expect(history.location.pathname).toBe(unMonitoredPatientDashboardRoute)
    testPatientDashboardCommonDisplay(dashboard, unMonitoredPatientId, unMonitoredPatientFullName)
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })

  it('should render correct components when navigating to monitored patient dashboard as an HCP', async () => {
    const history = createMemoryHistory({ initialEntries: [monitoredPatientDashboardRoute] })

    await act(async () => {
      render(getPatientDashboardForHCP(history))

      const dashboard = within(await screen.findByTestId('patient-dashboard'))
      expect(history.location.pathname).toBe(monitoredPatientDashboardRoute)
      testPatientDashboardCommonDisplay(dashboard, monitoredPatientId, monitoredPatientFullName)
      /* Patient info widget */
      expect(dashboard.getByText('Renew')).toBeVisible()
      expect(dashboard.getByText('Remove')).toBeVisible()

      /* Medical files widget */
      expect(dashboard.getByText('Prescription_2022-01-02')).toBeVisible()
      expect(dashboard.getByText('Weekly_report_2022-01-02')).toBeVisible()

      /* Events widget */
      expect(dashboard.getByText('Events')).toBeVisible()

      /* Chat widget */
      expect(dashboard.getByText('Messages')).toBeVisible()
      checkHeader(`${firstName} ${lastName}`)
      checkDrawer()
      checkFooter()
    })
  })

  it('should switch between patients by using the dropdown', async () => {
    const history = createMemoryHistory({ initialEntries: [monitoredPatientDashboardRoute] })

    await act(async () => {
      render(getPatientDashboardForHCP(history))
      let patientInfoCard

      patientInfoCard = within(await screen.findByTestId('patient-info-card'))
      const secondaryHeader = within(await screen.findByTestId('patient-data-subnav-outer'))

      expect(patientInfoCard.getByText(monitoredPatientFullName)).toBeVisible()
      fireEvent.mouseDown(secondaryHeader.getByText(monitoredPatientFullName))
      fireEvent.click(screen.getByText(unMonitoredPatientFullName))

      await waitFor(() => {
        // call this to update the card and catch the new patient
        patientInfoCard = within(screen.getByTestId('patient-info-card'))
        expect(patientInfoCard.getByText(unMonitoredPatientFullName)).toBeVisible()
      })
    })
  })
})
