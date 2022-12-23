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

import { act, BoundFunctions, fireEvent, screen, within } from '@testing-library/react'
import { mockUserDataFetch } from '../../mock/auth'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockTeamAPI, myTeamId } from '../../mock/mockTeamAPI'
import { mockDataAPI } from '../../mock/mockDataAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import {
  mockPatientApiForHcp,
  monitoredPatient,
  monitoredPatientId,
  pendingPatient,
  unmonitoredPatientId
} from '../../mock/mockPatientAPI'
import { mockChatAPI } from '../../mock/mockChatAPI'
import { mockMedicalFilesAPI } from '../../mock/mockMedicalFilesAPI'
import { queries } from '@testing-library/dom'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { checkHCPLayout } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import userEvent from '@testing-library/user-event'

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
    mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
  })

  function testPatientDashboardCommonDisplay(dashboard: BoundFunctions<typeof queries>, patientId: string) {
    /* Top bar */
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
    const patientInfoCard = within(dashboard.getByTestId('remote-monitoring-card'))
    expect(patientInfoCard.getByText('Remote monitoring program')).toBeVisible()

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
    testPatientDashboardCommonDisplay(dashboard, unmonitoredPatientId)
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
    testPatientDashboardCommonDisplay(dashboard, monitoredPatientId)
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
    const secondaryHeader = await screen.findByTestId('patient-nav-bar')
    expect(secondaryHeader).toHaveTextContent('PatientMonitored PatientLast Name:PatientDate of birth:01/01/1980Diabete type:Type 1Referring doctor:N/AFirst Name:MonitoredGender:MaleRemote monitoring:YesEmail:monitored-patient@diabeloop.frShow moreDashboardDailyTrendsGenerate report')

    fireEvent.mouseDown(within(secondaryHeader).getByText(monitoredPatient.profile.fullName))
    fireEvent.click(screen.getByText(pendingPatient.profile.fullName))

    const secondarHeaderRefreshed = await screen.findByTestId('patient-nav-bar')
    expect(secondarHeaderRefreshed).toHaveTextContent('PatientPending PatientLast Name:PatientDate of birth:01/01/1980Diabete type:Type 1Referring doctor:N/AFirst Name:PendingGender:FemaleRemote monitoring:NoEmail:pending-patient@diabeloop.frShow moreDashboardDailyTrendsGenerate report')

    await userEvent.click(within(secondarHeaderRefreshed).getByText('Show more'))
    expect(secondarHeaderRefreshed).toHaveTextContent('PatientPending PatientLast Name:PatientDate of birth:01/01/1980Diabete type:Type 1Referring doctor:N/AFirst Name:PendingGender:FemaleRemote monitoring:NoEmail:pending-patient@diabeloop.frShow morehba1c:8.3 (12/16/2022)DashboardDailyTrendsGenerate report')

    await userEvent.click(within(secondarHeaderRefreshed).getByText('Show more'))
    expect(secondarHeaderRefreshed).toHaveTextContent('PatientPending PatientLast Name:PatientDate of birth:01/01/1980Diabete type:Type 1Referring doctor:N/AFirst Name:PendingGender:FemaleRemote monitoring:NoEmail:pending-patient@diabeloop.frShow moreDashboardDailyTrendsGenerate report')
  })
})
