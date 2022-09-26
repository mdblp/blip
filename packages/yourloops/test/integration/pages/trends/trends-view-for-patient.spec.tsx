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

import { screen } from '@testing-library/react'
import { checkPatientHeader } from '../../assert/header'
import { checkDrawerNotVisible } from '../../assert/drawer'
import { checkFooter } from '../../assert/footer'
import { mockPatientLogin } from '../../mock/auth'
import { mySecondTeamId } from '../../mock/mockTeamAPI'
import {
  monitoringParameters,
  patientMonitoredFirstName,
  patientMonitoredFullName,
  patientMonitoredId,
  patientMonitoredLastName
} from '../../mock/mockPatientAPI'
import { checkPatientNavBarAsPatient } from '../../assert/patient-nav-bar'
import { checkTrendsStatsWidgetsTooltips, checkTrendsTidelineContainerTooltips } from '../../assert/trends'
import { ITeamMember, TeamMemberRole } from '../../../../models/team'
import { UserInvitationStatus } from '../../../../models/generic'
import { MonitoringStatus } from '../../../../models/monitoring'
import { mockDataAPIForTrendsView } from '../../mock/mockDataAPI'
import { renderPage } from '../../utils/render'

jest.setTimeout(10000)

describe('Trends view for HCP', () => {
  const patient: ITeamMember = {
    userId: patientMonitoredId,
    teamId: mySecondTeamId,
    role: TeamMemberRole.patient,
    profile: {
      firstName: patientMonitoredFirstName,
      fullName: patientMonitoredFullName,
      lastName: patientMonitoredLastName,
      patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.patient28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0,
    alarms: {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 0,
      frequencyOfSevereHypoglycemiaActive: false,
      nonDataTransmissionRate: 0,
      nonDataTransmissionActive: false
    },
    monitoring: {
      enabled: true,
      monitoringEnd: new Date(Date.now() - 10000),
      status: MonitoringStatus.accepted,
      parameters: monitoringParameters
    }
  }

  beforeAll(() => {
    mockPatientLogin(patient)
    mockDataAPIForTrendsView()
  })

  const renderTrendView = () => {
    renderPage('/trends')
  }

  it('should render correct basic components when navigating to patient trends view', async () => {
    renderTrendView()
    expect(await screen.findByTestId('patient-data-subnav-outer', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsPatient(false)
    checkPatientHeader(`${patient.profile.firstName} ${patient.profile.lastName}`)
    checkDrawerNotVisible()
    checkFooter()
  })

  it('should render correct tooltips', async () => {
    renderTrendView()
    await checkTrendsTidelineContainerTooltips()
    checkTrendsStatsWidgetsTooltips()
  })
})
