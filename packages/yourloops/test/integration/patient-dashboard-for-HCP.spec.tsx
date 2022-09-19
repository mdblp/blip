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
import { act, BoundFunctions, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react'
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
  patientMonitoredFullName,
  patientMonitoredId,
  patientNonMonitoredFullName,
  patientNonMonitoredId
} from './utils/mockPatientAPI'
import { mockChatAPI } from './utils/mockChatAPI'
import { mockMedicalFilesAPI } from './utils/mockMedicalFilesAPI'
import { queries } from '@testing-library/dom'
import { mockDirectShareApi } from './utils/mockDirectShareAPI'

describe('Patient dashboard for HCP', () => {
  const patientNonMonitoredDashboardRoute = `/patient/${patientNonMonitoredId}/dashboard`
  const patientMonitoredDashboardRoute = `/patient/${patientMonitoredId}/dashboard`
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

  afterEach(() => {
    cleanup()
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

  function testCommonDisplayForPatient(dashboard: BoundFunctions<typeof queries>, patientId: string, fullname: string) {
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
    expect(patientInfoCard.getByText(fullname)).toBeVisible()

    /* Patient stats widget */
    expect(dashboard.getByText('Patient statistics')).toBeVisible()

    /* Device usage widget */
    expect(dashboard.getByText('Device Usage')).toBeVisible()
  }

  it('should render correct components when navigating to non monitored patient dashboard as an HCP', async () => {
    const history = createMemoryHistory({ initialEntries: [patientNonMonitoredDashboardRoute] })

    act(() => {
      render(getPatientDashboardForHCP(history))
    })

    await waitFor(() => {
      expect(history.location.pathname).toBe(patientNonMonitoredDashboardRoute)
      const dashboard = within(screen.getByTestId('patient-dashboard'))
      testCommonDisplayForPatient(dashboard, patientNonMonitoredId, patientNonMonitoredFullName)
    })
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })

  it('should render correct components when navigating to monitored patient dashboard as an HCP', async () => {
    const history = createMemoryHistory({ initialEntries: [patientMonitoredDashboardRoute] })

    await act(async () => {
      render(getPatientDashboardForHCP(history))

      await waitFor(() => {
        const dashboard = within(screen.getByTestId('patient-dashboard'))
        expect(history.location.pathname).toBe(patientMonitoredDashboardRoute)
        testCommonDisplayForPatient(dashboard, patientMonitoredId, patientMonitoredFullName)
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
      })
      checkHeader(`${firstName} ${lastName}`)
      checkDrawer()
      checkFooter()
    })
  })

  it('should switch between patients by using the dropdown', async () => {
    const history = createMemoryHistory({ initialEntries: [patientMonitoredDashboardRoute] })

    await act(async () => {
      render(getPatientDashboardForHCP(history))
      let patientInfoCard
      let secondaryHeader

      await waitFor(() => {
        patientInfoCard = within(screen.getByTestId('patient-info-card'))
        secondaryHeader = within(screen.getByTestId('patient-data-subnav-outer'))
        expect(patientInfoCard.getByText(patientMonitoredFullName)).toBeVisible()
      })

      fireEvent.mouseDown(secondaryHeader.getByText(patientMonitoredFullName))
      fireEvent.click(screen.getByText(patientNonMonitoredFullName))

      await waitFor(() => {
        // call this to update the card and catch the new patient
        patientInfoCard = within(screen.getByTestId('patient-info-card'))
        expect(patientInfoCard.getByText(patientNonMonitoredFullName)).toBeVisible()
      })
    })
  })
})
