/*
 * Copyright (c) 2023, Diabeloop
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

import { screen, within } from '@testing-library/react'
import { myThirdTeamAddress, myThirdTeamCode, myThirdTeamName, myThirdTeamPhoneNumber } from '../mock/team.api.mock'
import { loggedInUserEmail, loggedInUserFullName, userTimEmail, userTimFullName } from '../mock/auth0.hook.mock'

export const checkCareTeamInformation = async () => {
  const teamInformationSection = within(await screen.findByTestId('team-information'))

  expect(teamInformationSection.getByText('Information')).toBeVisible()
  expect(teamInformationSection.getByText('Edit information')).toBeVisible()
  expect(teamInformationSection.getByText('Edit information')).toBeEnabled()

  expect(teamInformationSection.getByText('Team name')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamName)).toBeVisible()
  expect(teamInformationSection.getByText('Phone number')).toBeVisible()
  expect(teamInformationSection.getByText(`(+44) ${myThirdTeamPhoneNumber}`)).toBeVisible()
  expect(teamInformationSection.getByText('Identification code')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamCode)).toBeVisible()
  expect(teamInformationSection.getByText('Address')).toBeVisible()
  expect(teamInformationSection.getByText(myThirdTeamAddress)).toBeVisible()
}

export const checkCareTeamMembers = () => {
  const teamMembersSection = within(screen.getByTestId('team-members'))

  expect(teamMembersSection.getByText('Members (2)')).toBeVisible()
  expect(teamMembersSection.getByText('Leave team')).toBeVisible()
  expect(teamMembersSection.getByText('Leave team')).toBeEnabled()
  expect(teamMembersSection.getByText('Add healthcare professional')).toBeVisible()
  expect(teamMembersSection.getByText('Add healthcare professional')).toBeEnabled()

  expect(screen.getByTestId('team-members-list-table')).toHaveTextContent(`MemberEmailAdmin${loggedInUserFullName}${loggedInUserEmail}${userTimFullName}${userTimEmail}`)
}

export const checkCareTeamMonitoringAlertsConfiguration = () => {
  const monitoringAlertsConfigurationSection = screen.getByTestId('team-monitoring-alerts-configuration')

  expect(within(monitoringAlertsConfigurationSection).getByText('Monitoring alerts configuration')).toBeVisible()
  const saveButton = within(monitoringAlertsConfigurationSection).getByRole('button', { name: 'Save' })
  expect(saveButton).toBeVisible()
  expect(saveButton).toBeDisabled() // No monitoring value has been changed, button should be disabled

  expect(monitoringAlertsConfigurationSection).toHaveTextContent('Monitoring alerts configuration1. Time away from target range')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('1. Time away from target rangeCurrent trigger setting: 5% of time off target (min at 50 mg/dL max at 140 mg/dL)A. Glycemic targetMinimum:​mg/dLMaximum:​mg/dLDefault: min at 70 mg/dL and max at 180 mg/dLB. Event trigger thresholdTime spent off target5%​Default: 50%')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('2. Severe hypoglycemiaCurrent trigger setting: 10% of time below 40 mg/dL thresholdA. Severe hypoglycemia threshold:Severe hypoglycemia below:​mg/dLDefault: 54 mg/dLB. Event trigger thresholdTime spent in severe hypoglycemia10%​Default: 5%')
  expect(monitoringAlertsConfigurationSection).toHaveTextContent('3. Data not transmittedCurrent trigger setting: 15% of data not transmitted over the periodA. Event trigger thresholdTime spent without uploaded data15%​Default: 50%')
}
