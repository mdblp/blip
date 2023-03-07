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

import { act, type BoundFunctions, fireEvent, screen, within } from '@testing-library/react'
import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI, myTeamId, myThirdTeamId } from '../../mock/team.api.mock'
import { mockDataAPI } from '../../mock/data.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import {
  mockPatientApiForHcp,
  monitoredPatient,
  monitoredPatientId,
  monitoredPatientWithMmol,
  monitoredPatientWithMmolId,
  pendingPatient,
  unmonitoredPatientId
} from '../../mock/patient.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { type queries } from '@testing-library/dom'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { checkHCPLayout } from '../../assert/layout'
import { renderPage } from '../../utils/render'
import { mockUserApi } from '../../mock/user.api.mock'
import userEvent from '@testing-library/user-event'
import moment from 'moment-timezone'
import PatientApi from '../../../../lib/patient/patient.api'
import { UnitsType } from 'dumb'
import { getTomorrowDate } from '../../utils/helpers'
import { checkPatientNavBarAsHCP } from '../../assert/patient-nav-bar'
import { checkMedicalWidgetForHcp } from '../../assert/medical-widget'

describe('Patient dashboard for HCP', () => {
  const unMonitoredPatientDashboardRoute = `/patient/${unmonitoredPatientId}/dashboard`
  const monitoredPatientDashboardRoute = `/patient/${monitoredPatientId}/dashboard`
  const monitoredPatientDashboardRouteMmoL = `/patient/${monitoredPatientWithMmolId}/dashboard`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'
  const mgdlSettings = { units: { bg: UnitsType.MGDL } }
  const mmolSettings = { units: { bg: UnitsType.MMOLL } }

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mgdlSettings })
    mockPatientApiForHcp()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
  })

  function testPatientDashboardCommonDisplay(dashboard: BoundFunctions<typeof queries>) {
    expect(dashboard.getByText('Data calculated on the last 7 days')).toBeVisible()

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
    checkPatientNavBarAsHCP()
    testPatientDashboardCommonDisplay(dashboard)
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
    const expectedMonitoringEndDate = moment.utc(getTomorrowDate()).format(moment.localeData().longDateFormat('ll')).toString()
    const dashboard = within(await screen.findByTestId('patient-dashboard'))
    testPatientDashboardCommonDisplay(dashboard)
    /* Patient info widget */
    expect(dashboard.getByText('Renew')).toBeVisible()
    expect(dashboard.getByText('Remove')).toBeVisible()
    /* Medical files widget */
    await checkMedicalWidgetForHcp()

    /* Events widget */
    expect(dashboard.getByText('Events')).toBeVisible()

    /* Chat widget */
    expect(dashboard.getByText('Messages')).toBeVisible()
    const emojiButton = dashboard.getByTestId('chat-widget-emoji-button')
    expect(emojiButton).toBeEnabled()

    /* Remote Monitoring widget */
    expect(dashboard.getByTestId('remote-monitoring-card')).toHaveTextContent(`Remote monitoring programRemote monitoring:YesRequesting team:MySecondTeamEnd date:${expectedMonitoringEndDate}Remaining time:a dayRenewRemove`)
    expect(dashboard.getByText('Renew')).toBeVisible()
    expect(dashboard.getByText('Remove')).toBeVisible()
    checkHCPLayout(`${firstName} ${lastName}`)
  })

  it('should switch between patients by using the dropdown', async () => {
    await act(async () => {
      renderPage(monitoredPatientDashboardRoute)
    })
    const secondaryHeader = await screen.findByTestId('patient-nav-bar')
    expect(secondaryHeader).toHaveTextContent('PatientMonitored PatientDate of birth:01/01/1980Diabete type:Type 1Gender:MaleRemote monitoring:YesShow moreDashboardDailyTrendsGenerate report')

    fireEvent.mouseDown(within(secondaryHeader).getByText(monitoredPatient.profile.fullName))
    fireEvent.click(screen.getByText(pendingPatient.profile.fullName))

    const secondaryHeaderRefreshed = await screen.findByTestId('patient-nav-bar')
    expect(secondaryHeaderRefreshed).toHaveTextContent('PatientPending PatientDate of birth:01/01/1980Diabete type:Type 1Gender:FemaleRemote monitoring:NoShow moreDashboardDailyTrendsGenerate report')

    await userEvent.click(within(secondaryHeaderRefreshed).getByText('Show more'))
    expect(secondaryHeaderRefreshed).toHaveTextContent('PatientPending PatientDate of birth:01/01/1980Diabete type:Type 1Gender:FemaleRemote monitoring:NoReferring doctor:N/Ahba1c:8.3 (12/16/2022)Email:pending-patient@diabeloop.frShow lessDashboardDailyTrendsGenerate report')
    await userEvent.click(within(secondaryHeaderRefreshed).getByText('Show less'))
    expect(secondaryHeaderRefreshed).toHaveTextContent('PatientPending PatientDate of birth:01/01/1980Diabete type:Type 1Gender:FemaleRemote monitoring:NoShow moreDashboardDailyTrendsGenerate report')
  })

  describe('Alarms configuration dialog', () => {
    it('should have units in mg/dL and cancel/default values buttons working', async () => {
      await act(async () => {
        renderPage(monitoredPatientDashboardRoute)
      })
      const configureAlarmsButton = await screen.findByLabelText('Configure alarms')
      await userEvent.click(configureAlarmsButton)
      const dialog = within(screen.getByRole('dialog'))
      const lowBgInput = dialog.getByRole('spinbutton', { name: 'Low blood glucose input' })
      const highBgInput = dialog.getByRole('spinbutton', { name: 'High blood glucose input' })
      const veryLowBgInput = dialog.getByRole('spinbutton', { name: 'Very low blood glucose input' })
      const outOfRangeThreshold = dialog.getByTestId('basic-dropdown-out-of-range-selector')
      const hypoThreshold = dialog.getByTestId('basic-dropdown-hypo-threshold-selector')
      const nonDataThreshold = dialog.getByTestId('basic-dropdown-non-data-selector')
      const saveButton = dialog.getByRole('button', { name: 'Save' })
      const defaultButton = dialog.getByRole('button', { name: 'Default values' })
      const cancelButton = dialog.getByRole('button', { name: 'Cancel' })

      expect(dialog.getByText('Events configuration')).toBeVisible()
      expect(dialog.getByText('1. Time away from target')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)')).toBeVisible()
      expect(dialog.getByText('A. Glycemic target')).toBeVisible()
      expect(dialog.getByText('Minimum:')).toBeVisible()
      expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
      expect(dialog.getByText('Maximum:')).toBeVisible()
      expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
      expect(within(dialog.getByTestId('time-target')).getByText('B. Event trigger threshold')).toBeVisible()
      expect(dialog.getByText('Time spent off target')).toBeVisible()

      expect(dialog.getByText('2. Severe hypoglycemia')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 10% of time below 40 mg/dL threshold')).toBeVisible()
      expect(dialog.getByText('A. Severe hypoglycemia threshold:')).toBeVisible()
      expect(dialog.getByText('Severe hypoglycemia below:')).toBeVisible()
      expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('mg/dL')).toBeVisible()
      expect(within(dialog.getByTestId('severe-hypoglycemia')).getByText('B. Event trigger threshold')).toBeVisible()
      expect(dialog.getByText('Time spent in severe hypoglycemia')).toBeVisible()

      expect(dialog.getByText('3. Data not transmitted')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 15% of data not transmitted over the period')).toBeVisible()
      expect(dialog.getByText('A. Event trigger threshold')).toBeVisible()
      expect(dialog.getByText('Time spent without uploaded data')).toBeVisible()

      expect(lowBgInput).toHaveValue(50)
      expect(highBgInput).toHaveValue(140)
      expect(veryLowBgInput).toHaveValue(40)
      expect(within(outOfRangeThreshold).getByRole('button')).toHaveTextContent('5%')
      expect(within(hypoThreshold).getByRole('button')).toHaveTextContent('10%')
      expect(within(nonDataThreshold).getByRole('button')).toHaveTextContent('15%')
      expect(saveButton).toBeEnabled()
      expect(cancelButton).toBeEnabled()
      expect(defaultButton).toBeEnabled()

      await userEvent.clear(lowBgInput)
      const dropDownOutRange = within(dialog.getByTestId('dropdown-out-of-range'))
      fireEvent.mouseDown(dropDownOutRange.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '15%' }))

      const dropDownHypo = within(dialog.getByTestId('dropdown-hypo'))
      fireEvent.mouseDown(dropDownHypo.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '20%' }))

      const dropDownNonData = within(dialog.getByTestId('dropdown-nonData'))
      fireEvent.mouseDown(dropDownNonData.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '40%' }))

      await userEvent.type(lowBgInput, '50.5')
      expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
      expect(saveButton).toBeDisabled()

      await userEvent.clear(lowBgInput)
      await userEvent.type(lowBgInput, '60')
      expect(saveButton).toBeEnabled()
      await userEvent.clear(highBgInput)
      await userEvent.type(highBgInput, '140.5')
      expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
      expect(saveButton).toBeDisabled()

      await userEvent.clear(highBgInput)
      await userEvent.type(highBgInput, '150')
      expect(saveButton).toBeEnabled()
      await userEvent.clear(veryLowBgInput)
      await userEvent.type(veryLowBgInput, '40.5')
      expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('Value must be an integer')).toBeVisible()
      expect(saveButton).toBeDisabled()
      await userEvent.clear(veryLowBgInput)
      await userEvent.type(veryLowBgInput, '50')
      expect(dialog.getByText('Current trigger setting: 15% of time off target (min at 60 mg/dL max at 150 mg/dL)')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 20% of time below 50 mg/dL threshold')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 40% of data not transmitted over the period')).toBeVisible()

      await userEvent.click(defaultButton)
      expect(lowBgInput).toHaveValue(50)
      expect(highBgInput).toHaveValue(140)
      expect(veryLowBgInput).toHaveValue(40)
      expect(within(outOfRangeThreshold).getByRole('button')).toHaveTextContent('5%')
      expect(within(hypoThreshold).getByRole('button')).toHaveTextContent('10%')
      expect(within(nonDataThreshold).getByRole('button')).toHaveTextContent('15%')
      expect(saveButton).not.toBeDisabled()

      await userEvent.click(cancelButton)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('should have units in mmol/L and save button working', async () => {
      mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

      await act(async () => {
        renderPage(monitoredPatientDashboardRouteMmoL)
      })
      const configureAlarmsButton = await screen.findByLabelText('Configure alarms')
      await userEvent.click(configureAlarmsButton)
      const dialog = within(screen.getByRole('dialog'))
      const lowBgInput = dialog.getByRole('spinbutton', { name: 'Low blood glucose input' })
      const highBgInput = dialog.getByRole('spinbutton', { name: 'High blood glucose input' })
      const veryLowBgInput = dialog.getByRole('spinbutton', { name: 'Very low blood glucose input' })
      const outOfRangeThreshold = dialog.getByTestId('basic-dropdown-out-of-range-selector')
      const hypoThreshold = dialog.getByTestId('basic-dropdown-hypo-threshold-selector')
      const nonDataTxThreshold = dialog.getByTestId('basic-dropdown-non-data-selector')
      const saveButton = dialog.getByTestId('alarm-config-save')

      expect(dialog.getByText('Current trigger setting: 5% of time off target (min at 2.8 mmol/L max at 7.8 mmol/L)')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 10% of time below 2.2 mmol/L threshold')).toBeVisible()
      expect(dialog.getByText('Current trigger setting: 15% of data not transmitted over the period')).toBeVisible()
      expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
      expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
      expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('mmol/L')).toBeVisible()
      expect(lowBgInput).toHaveValue(2.8)
      expect(highBgInput).toHaveValue(7.8)
      expect(veryLowBgInput).toHaveValue(2.2)
      expect(within(outOfRangeThreshold).getByRole('button')).toHaveTextContent('5%')
      expect(within(hypoThreshold).getByRole('button')).toHaveTextContent('10%')
      expect(within(nonDataTxThreshold).getByRole('button')).toHaveTextContent('15%')

      expect(saveButton).not.toBeDisabled()

      await userEvent.clear(lowBgInput)
      await userEvent.type(lowBgInput, '3.55')
      expect(within(dialog.getByTestId('low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
      await userEvent.clear(lowBgInput)
      await userEvent.type(lowBgInput, '4.8')
      expect(saveButton).toBeEnabled()

      await userEvent.clear(highBgInput)
      await userEvent.type(highBgInput, '8.55')
      expect(within(dialog.getByTestId('high-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
      await userEvent.clear(highBgInput)
      await userEvent.type(highBgInput, '8.8')
      expect(saveButton).toBeEnabled()

      await userEvent.clear(veryLowBgInput)
      await userEvent.type(veryLowBgInput, '3.55')
      expect(within(dialog.getByTestId('very-low-bg-text-field-id')).getByText('Value must be a number')).toBeInTheDocument()
      expect(saveButton).toBeDisabled()
      await userEvent.clear(veryLowBgInput)
      await userEvent.type(veryLowBgInput, '3.2')
      expect(saveButton).toBeEnabled()

      const dopDownOutRange = within(dialog.getByTestId('dropdown-out-of-range'))
      fireEvent.mouseDown(dopDownOutRange.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '15%' }))

      const dropDownHypo = within(dialog.getByTestId('dropdown-hypo'))
      fireEvent.mouseDown(dropDownHypo.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '20%' }))

      const dropDownNonData = within(dialog.getByTestId('dropdown-nonData'))
      fireEvent.mouseDown(dropDownNonData.getByRole('button'))
      fireEvent.click(screen.getByRole('option', { name: '40%' }))

      await userEvent.click(saveButton)

      const expectedMonitoring = {
        ...monitoredPatientWithMmol.monitoring,
        parameters: {
          bgUnit: UnitsType.MMOLL,
          lowBg: 4.8,
          highBg: 8.8,
          veryLowBg: 3.2,
          outOfRangeThreshold: 15,
          hypoThreshold: 20,
          nonDataTxThreshold: 40,
          reportingPeriod: 7
        }
      }
      expect(PatientApi.updatePatientAlerts).toHaveBeenCalledWith(myThirdTeamId, monitoredPatientWithMmolId, expectedMonitoring)
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
      expect(screen.getByText('Patient update succeeded')).toBeVisible()
    })
  })
})
