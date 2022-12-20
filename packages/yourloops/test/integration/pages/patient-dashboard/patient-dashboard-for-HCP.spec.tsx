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

import { act, BoundFunctions, fireEvent, screen, waitFor, within } from '@testing-library/react'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI, myTeamId } from '../../mock/team.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import {
  mockPatientApiForHcp,
  monitoredPatient,
  monitoredPatientId,
  pendingPatient,
  unmonitoredPatient,
  unmonitoredPatientId
} from '../../mock/patient.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { queries } from '@testing-library/dom'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { checkHCPLayout } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'

describe('Patient dashboard for HCP', () => {
  const unMonitoredPatientDashboardRoute = `/patient/${unmonitoredPatientId}/dashboard`
  const monitoredPatientDashboardRoute = `/patient/${monitoredPatientId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
  })

  function testPatientDashboardCommonDisplay(dashboard: BoundFunctions<typeof queries>, patientId: string, fullName: string) {
    /* Top bar */
    expect(dashboard.getByTestId('subnav-arrow-back')).toBeVisible()
    expect(dashboard.getByTestId('subnav-patient-list')).toBeVisible()
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()
    const dashboardLink = dashboard.getByText('Dashboard')
    const dailyLink = dashboard.getByText('Daily')
    const trendsLink = dashboard.getByText('Trends')
    expect(dashboardLink).toHaveAttribute('href', `/patient/${patientId}/dashboard`)
    expect(dashboardLink).toBeVisible()
    expect(dailyLink).toHaveAttribute('href', `/patient/${patientId}/daily`)
    expect(dailyLink).toBeVisible()
    expect(trendsLink).toHaveAttribute('href', `/patient/${patientId}/trends`)
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
    localStorage.setItem('selectedTeamId', '')

    act(() => {
      renderPage(unMonitoredPatientDashboardRoute)
    })

    const dashboard = within(await screen.findByTestId('patient-dashboard', {}, { timeout: 3000 }))
    testPatientDashboardCommonDisplay(dashboard, unmonitoredPatientId, unmonitoredPatient.profile.fullName)
    checkHCPLayout(`${firstName} ${lastName}`)

    /**
     * TODO YLP-1987 Uncomment this test once the January release is done
     */
    // const header = within(screen.getByTestId('app-main-header'))
    // const teamsDropdown = header.getByText(myThirdTeamName)
    // expect(teamsDropdown).toBeVisible()
  })

  it('should render correct components when navigating to monitored patient dashboard as an HCP', async () => {
    localStorage.setItem('selectedTeamId', myTeamId)

    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    /**
     * TODO YLP-1987 Uncomment this test once the January release is done
     */
    // const header = within(screen.getByTestId('app-main-header'))
    // const teamsDropdown = header.getByText(mySecondTeamName)
    // expect(teamsDropdown).toBeVisible()

    const dashboard = within(await screen.findByTestId('patient-dashboard'))
    testPatientDashboardCommonDisplay(dashboard, monitoredPatientId, monitoredPatient.profile.fullName)
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
    checkHCPLayout(`${firstName} ${lastName}`)
  })

  it('should switch between patients by using the dropdown', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })
    const patientInfoCard = within(await screen.findByTestId('patient-info-card'))
    const secondaryHeader = within(screen.getByTestId('patient-data-subnav-outer'))

    expect(patientInfoCard.getByText(monitoredPatient.profile.fullName)).toBeVisible()
    fireEvent.mouseDown(secondaryHeader.getByText(monitoredPatient.profile.fullName))
    fireEvent.click(screen.getByText(pendingPatient.profile.fullName))

    await waitFor(() => {
      // call this to update the card and catch the new patient
      const patientInfoCard = within(screen.getByTestId('patient-info-card'))
      expect(patientInfoCard.getByText(pendingPatient.profile.fullName)).toBeVisible()
    })
  })
})
