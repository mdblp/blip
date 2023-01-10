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

import { mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { completeDashboardData, mockDataAPI } from '../../mock/data.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockPatientApiForHcp, monitoredPatientId, unmonitoredPatientId } from '../../mock/patient.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { renderPage } from '../../utils/render'
import { screen, within } from '@testing-library/react'
import { checkNoTooltip } from '../../assert/stats'
import { mockUserApi } from '../../mock/user.api.mock'
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
    mockUserApi().mockUserDataFetch({ firstName, lastName })
    mockPatientApiForHcp()
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

    const remoteMonitoringCard = screen.getByTestId('remote-monitoring-card')
    expect(remoteMonitoringCard).toBeVisible()
    expect(remoteMonitoringCard).toHaveTextContent('Remote monitoring programRemote monitoring:No')
  })

  it('monitored patient should have correct cards', async () => {
    renderPage(`/patient/${monitoredPatientId}/dashboard`)
    const statsWidgets = await screen.findByTestId('patient-statistics', {}, { timeout: 3000 })
    expect(statsWidgets).toBeVisible()
    expect(statsWidgets).toHaveTextContent('Patient statisticsTime In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dLAvg. Glucose (CGM)mg/dL135Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kgAvg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11mAvg. Daily Carbs55gRescue carbs10g')

    const deviceUsageWidget = screen.getByTestId('device-usage-card')
    expect(deviceUsageWidget).toBeVisible()
    expect(deviceUsageWidget).toHaveTextContent('Device UsageDevicesDBL:DiabeloopPump:VICENTRACGM:Dexcom G6Last updatesSensor Usage1%')

    const remoteMonitoringCard = screen.getByTestId('remote-monitoring-card')
    expect(remoteMonitoringCard).toBeVisible()
    expect(remoteMonitoringCard).toHaveTextContent('Remote monitoring programRemote monitoring:YesRequesting team:MySecondTeamEnd date:Jan 10, 2023Remaining time:a few secondsRenewRemove')

    const medicalFilesCard = screen.getByTestId('medical-files-card')
    expect(medicalFilesCard).toBeVisible()
    expect(medicalFilesCard).toHaveTextContent('Medical filesPrescriptionsPrescription_2022-01-02Weekly reportsWeekly_report_2022-01-02Medical recordsMedical_record_2022-01-02New')

    const alarmCard = screen.getByTestId('alarm-card')
    expect(alarmCard).toBeVisible()
    expect(alarmCard).toHaveTextContent('EventsCurrent eventsTime spent out of range from target10%Severe hypoglycemia20%Data not transferred30%')

    const chartCard = screen.getByTestId('chat-card')
    expect(chartCard).toBeVisible()
    expect(chartCard).toHaveTextContent('Messages ReplyPrivate')
  })
})
