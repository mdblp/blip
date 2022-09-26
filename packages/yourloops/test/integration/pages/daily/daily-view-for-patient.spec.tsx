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
import { act, render, screen } from '@testing-library/react'
import { AuthContextProvider } from '../../../../lib/auth'
import { MainLobby } from '../../../../app/main-lobby'
import { checkHeader } from '../../utils/assert/header'
import { checkDrawerNotVisible } from '../../utils/assert/drawer'
import { checkFooter } from '../../utils/assert/footer'
import { mockPatientLogin } from '../../utils/mock/auth'
import { mySecondTeamId } from '../../utils/mock/mockTeamAPI'
import {
  monitoringParameters,
  patientMonitoredFirstName,
  patientMonitoredFullName,
  patientMonitoredId,
  patientMonitoredLastName
} from '../../utils/mock/mockPatientAPI'
import { checkPatientNavBar } from '../../utils/assert/patient-nav-bar'
import { checkDailyStatsWidgetsTooltips, checkDailyTidelineContainerTooltips } from '../../utils/assert/daily'
import { ITeamMember, TeamMemberRole } from '../../../../models/team'
import { UserInvitationStatus } from '../../../../models/generic'
import { MonitoringStatus } from '../../../../models/monitoring'
import { mockDataAPIForDailyView } from '../../utils/mock/mockDataAPI'

jest.setTimeout(10000)

describe('Daily view for patient', () => {
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
    mockDataAPIForDailyView()
  })

  function getPatientDailyView(history) {
    return (
      <Router history={history}>
        <AuthContextProvider>
          <MainLobby />
        </AuthContextProvider>
      </Router>
    )
  }

  const renderDailyView = () => {
    const history = createMemoryHistory({ initialEntries: ['/daily'] })
    act(() => {
      render(getPatientDailyView(history))
    })
    expect(history.location.pathname).toBe('/daily')
  }

  it('should render correct basic components when navigating to patient daily view as an HCP', async () => {
    renderDailyView()
    expect(await screen.findByTestId('patient-data-subnav-outer', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBar(true, true)
    checkHeader(`${patient.profile.firstName} ${patient.profile.lastName}`, true)
    checkDrawerNotVisible()
    checkFooter()
  })

  it('should render correct tooltips', async () => {
    renderDailyView()
    await checkDailyTidelineContainerTooltips()
    checkDailyStatsWidgetsTooltips()
  })
})
