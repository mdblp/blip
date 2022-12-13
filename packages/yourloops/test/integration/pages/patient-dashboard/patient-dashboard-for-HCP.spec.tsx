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
import { mockUserDataFetch } from '../../mock/auth'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockTeamAPI, monitoringParameters } from '../../mock/mockTeamAPI'
import { mockDataAPI } from '../../mock/mockDataAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import {
  mockPatientAPI,
  monitoredPatientFullName,
  monitoredPatientId,
  monitoredPatientWithMmolId,
  unmonitoredPatientFullName,
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
  const monitoredPatientDashboardRouteMmoL = `/patient/${monitoredPatientWithMmolId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch({ firstName, lastName })
    mockPatientAPI()
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
    act(() => {
      renderPage(unMonitoredPatientDashboardRoute)
    })

    const dashboard = within(await screen.findByTestId('patient-dashboard', {}, { timeout: 3000 }))
    testPatientDashboardCommonDisplay(dashboard, unmonitoredPatientId, unmonitoredPatientFullName)
    checkHCPLayout(`${firstName} ${lastName}`)
  })

  it('should render correct components when navigating to monitored patient dashboard as an HCP', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })

    const dashboard = within(await screen.findByTestId('patient-dashboard'))
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
    checkHCPLayout(`${firstName} ${lastName}`)
  })

  it('should switch between patients by using the dropdown', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })
    const patientInfoCard = within(await screen.findByTestId('patient-info-card'))
    const secondaryHeader = within(screen.getByTestId('patient-data-subnav-outer'))

    expect(patientInfoCard.getByText(monitoredPatientFullName)).toBeVisible()
    fireEvent.mouseDown(secondaryHeader.getByText(monitoredPatientFullName))
    fireEvent.click(screen.getByText(unmonitoredPatientFullName))

    await waitFor(() => {
      // call this to update the card and catch the new patient
      const patientInfoCardUpdated = within(screen.getByTestId('patient-info-card'))
      expect(patientInfoCardUpdated.getByText(unmonitoredPatientFullName)).toBeVisible()
    })
  })

  it('Should have units in mg/dL, integer values in the inputs and the button displayed', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })
    // logDOM()
    const configureAlarmsButton = await screen.findByRole('button', { name: 'Configure alarms' }, { timeout: 3000 })
    await userEvent.click(configureAlarmsButton)
    const dialog = screen.getByRole('dialog')
    const lowBgInput = within(dialog).getByRole('spinbutton', { name: 'Low blood glucose input' })
    const highBgInput = within(dialog).getByRole('spinbutton', { name: 'High blood glucose input' })
    const veryLowBgInput = within(dialog).getByRole('spinbutton', { name: 'Very low blood glucose input' })
    const outOfRangeTreshold = within(dialog).getByTestId('basic-dropdown-out-of-range-selector')
    const hypoTreshold = within(dialog).getByTestId('basic-dropdown-hypo-threshold-selector')
    const nonDataThreshold = within(dialog).getByTestId('basic-dropdown-non-data-selector')
    const saveButton = within(dialog).getByTestId('alarm-config-save')

    expect(within(dialog).getByText('Current trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)')).toBeVisible()
    expect(within(dialog).getByText('Current trigger setting: 10% of time below 40 mg/dL threshold')).toBeVisible()
    expect(within(dialog).getByText('Current trigger setting: 15% of data not transmitted over the period')).toBeVisible()
    expect(within(within(dialog).getByTestId('low-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
    expect(within(within(dialog).getByTestId('high-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
    expect(within(within(dialog).getByTestId('very-low-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
    expect(lowBgInput).toHaveValue(50)
    expect(highBgInput).toHaveValue(140)
    expect(veryLowBgInput).toHaveValue(40)
    expect(within(outOfRangeTreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.outOfRangeThreshold}%`)
    expect(within(hypoTreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.hypoThreshold}%`)
    expect(within(nonDataThreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.nonDataTxThreshold}%`)
    expect(saveButton).not.toBeDisabled()

    await userEvent.clear(lowBgInput)
    await userEvent.type(lowBgInput, '50.5')
    expect(within(within(dialog).getByTestId('low-bg-text-field-id')).getByText('Enter a integer number')).toBeVisible()
    expect(saveButton).toBeDisabled()

    await userEvent.clear(lowBgInput)
    await userEvent.type(lowBgInput, '50')
    await userEvent.clear(highBgInput)
    await userEvent.type(highBgInput, '140.5')
    expect(within(within(dialog).getByTestId('high-bg-text-field-id')).getByText('Enter a integer number')).toBeVisible()
    expect(saveButton).toBeDisabled()

    await userEvent.clear(highBgInput)
    await userEvent.type(highBgInput, '140')
    await userEvent.clear(veryLowBgInput)
    await userEvent.type(veryLowBgInput, '40.5')
    expect(within(within(dialog).getByTestId('very-low-bg-text-field-id')).getByText('Enter a integer number')).toBeVisible()
    expect(saveButton).toBeDisabled()

    await userEvent.clear(veryLowBgInput)
    await userEvent.type(veryLowBgInput, '40')
  })

  it('Should have units in mmol/L, integer values in the inputs and the button displayed', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRouteMmoL)
    })
    const configureAlarmsButton = await screen.findByRole('button', { name: 'Configure alarms' }, { timeout: 3000 })
    await userEvent.click(configureAlarmsButton)
    const dialog = screen.getByRole('dialog')
    const lowBgInput = within(dialog).getByRole('spinbutton', { name: 'Low blood glucose input' })
    const highBgInput = within(dialog).getByRole('spinbutton', { name: 'High blood glucose input' })
    const veryLowBgInput = within(dialog).getByRole('spinbutton', { name: 'Very low blood glucose input' })
    const outOfRangeTreshold = within(dialog).getByTestId('basic-dropdown-out-of-range-selector')
    const hypoTreshold = within(dialog).getByTestId('basic-dropdown-hypo-threshold-selector')
    const nonDataThreshold = within(dialog).getByTestId('basic-dropdown-non-data-selector')
    const saveButton = within(dialog).getByTestId('alarm-config-save')

    expect(within(dialog).getByText('Current trigger setting: 5% of time off target (min at 2.8 mmol/L max at 7.8 mmol/L)')).toBeVisible()
    expect(within(dialog).getByText('Current trigger setting: 10% of time below 2.2 mmol/L threshold')).toBeVisible()
    expect(within(dialog).getByText('Current trigger setting: 15% of data not transmitted over the period')).toBeVisible()
    expect(within(within(dialog).getByTestId('low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
    expect(within(within(dialog).getByTestId('high-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
    expect(within(within(dialog).getByTestId('very-low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
    expect(lowBgInput).toHaveValue(2.8)
    expect(highBgInput).toHaveValue(7.8)
    expect(veryLowBgInput).toHaveValue(2.2)
    expect(within(outOfRangeTreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.outOfRangeThreshold}%`)
    expect(within(hypoTreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.hypoThreshold}%`)
    expect(within(nonDataThreshold).getByRole('button')).toHaveTextContent(`${monitoringParameters.nonDataTxThreshold}%`)

    expect(saveButton).not.toBeDisabled()

    await userEvent.clear(lowBgInput)
    await userEvent.type(lowBgInput, '3')
    expect(within(within(dialog).getByTestId('low-bg-text-field-id')).getByText('Enter a float number')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
    await userEvent.clear(lowBgInput)
    await userEvent.type(lowBgInput, '2.8')

    await userEvent.clear(highBgInput)
    await userEvent.type(highBgInput, '8')
    expect(within(within(dialog).getByTestId('high-bg-text-field-id')).getByText('Enter a float number')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
    await userEvent.clear(highBgInput)
    await userEvent.type(highBgInput, '7.8')

    // Value in the field very lowBg false test of the button save disable
    await userEvent.clear(veryLowBgInput)
    await userEvent.type(veryLowBgInput, '3')
    expect(within(within(dialog).getByTestId('very-low-bg-text-field-id')).getByText('Enter a float number')).toBeInTheDocument()
    expect(saveButton).toBeDisabled()
    await userEvent.clear(veryLowBgInput)
    await userEvent.type(veryLowBgInput, '2.2')
  })
})
