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

import { mockUserDataFetch } from '../../mock/auth'
import { mockAuth0Hook } from '../../mock/mockAuth0Hook'
import { mockTeamAPI } from '../../mock/mockTeamAPI'
import { completeDashboardData, mockDataAPI } from '../../mock/mockDataAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockPatientAPI, unmonitoredPatientId } from '../../mock/mockPatientAPI'
import { mockChatAPI } from '../../mock/mockChatAPI'
import { mockMedicalFilesAPI } from '../../mock/mockMedicalFilesAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { renderPage } from '../../utils/render'
import { screen, within } from '@testing-library/react'
import { checkNoTooltip } from '../../assert/stats'
import crypto from 'crypto'

// window.crypto is not defined in jest...
Object.defineProperty(global, 'crypto', {
  value: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length)
  }
})

describe('Patient dashboard for anyone', () => {
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
    mockDataAPI(completeDashboardData)
  })

  it('statistics should be displayed without tooltips and with correct labels', async () => {
    renderPage(`/patient/${unmonitoredPatientId}/dashboard`)
    const statsWidgets = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
    checkNoTooltip(statsWidgets, 'Time In Range')
    checkNoTooltip(statsWidgets, 'Avg. Glucose (CGM)')
    checkNoTooltip(statsWidgets, 'Avg. Daily Insulin')
    checkNoTooltip(statsWidgets, 'Avg. Daily Time In Loop Mode')
    checkNoTooltip(statsWidgets, 'Avg. Daily Carbs')

    const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
    checkNoTooltip(deviceUsageWidget, 'Sensor Usage')

    expect(statsWidgets.getByTestId('stat-timeInRange')).toHaveTextContent('Time In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dL')
    expect(statsWidgets.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL135')
    expect(statsWidgets.getByTestId('stat-averageDailyDose')).toHaveTextContent('Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kg')
    expect(statsWidgets.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11m')
    expect(statsWidgets.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs55gRescue carbs10g')
    expect(deviceUsageWidget.getByTestId('stat-sensorUsage')).toHaveTextContent('Sensor Usage1%')
  })
})
