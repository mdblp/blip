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

import { logoutMock, mockAuth0Hook } from '../../mock/auth0.hook.mock'
import { mockTeamAPI } from '../../mock/team.api.mock'
import { completeDashboardData, mockDataAPI, YESTERDAY_DATE } from '../../mock/data.api.mock'
import { mockNotificationAPI } from '../../mock/notification.api.mock'
import { mockPatientApiForHcp, monitoredPatientId, unmonitoredPatientId } from '../../mock/patient.api.mock'
import { mockChatAPI } from '../../mock/chat.api.mock'
import { mockMedicalFilesAPI } from '../../mock/medical-files.api.mock'
import { mockDirectShareApi } from '../../mock/direct-share.api.mock'
import { renderPage } from '../../utils/render'
import { checkStatTooltip, checkTooltip } from '../../assert/stats'
import { screen, waitFor, within } from '@testing-library/react'
import { mockUserApi } from '../../mock/user.api.mock'
import crypto from 'crypto'
import moment from 'moment-timezone'
import { getTomorrowDate } from '../../utils/helpers'
import userEvent from '@testing-library/user-event'
import { ConfigService } from '../../../../lib/config/config.service'

// window.crypto is not defined in jest...
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr: []) => crypto.randomBytes(arr.length)
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
    const router = renderPage(`/patient/${unmonitoredPatientId}/dashboard`)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/patient/${unmonitoredPatientId}/dashboard`)
    })
    const patientStatistics = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
    checkTooltip(patientStatistics, 'Time In Range')
    checkTooltip(patientStatistics, 'Avg. Glucose (CGM)')
    checkTooltip(patientStatistics, 'Avg. Daily Insulin')
    checkTooltip(patientStatistics, 'Avg. Daily Time In Loop Mode')
    checkTooltip(patientStatistics, 'Avg. Daily Carbs')
    checkTooltip(patientStatistics, 'CV (CGM)')

    const deviceUsageWidget = within(screen.getByTestId('device-usage-card'))
    checkTooltip(deviceUsageWidget, 'Sensor Usage')

    expect(patientStatistics.getByTestId('cbg-percentage-bar-chart')).toHaveTextContent('Time In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dL')
    expect(patientStatistics.getByTestId('cbg-mean-stat')).toHaveTextContent('Avg. Glucose (CGM)mg/dL135')
    expect(patientStatistics.getByTestId('stat-averageDailyDose')).toHaveTextContent('Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kg')
    expect(patientStatistics.getByTestId('loop-mode-stat')).toHaveTextContent('Avg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11m')
    expect(patientStatistics.getByTestId('total-carbs-stat')).toHaveTextContent('Avg. Daily Carbs55gRescue carbs10g')
    expect(deviceUsageWidget.getByTestId('sensor-usage-stat')).toHaveTextContent('Sensor Usage1%')
    expect(deviceUsageWidget.getByTestId('device-usage-device-list')).toHaveTextContent('DevicesCGM:Dexcom G6DBL:DiabeloopPump:VICENTRA')
    expect(deviceUsageWidget.getByTestId('device-usage-updates')).toHaveTextContent('Last updatesNov 1, 2022 12:00 amBOLUS_AGGRESSIVENESS_FACTOR (143 %)Nov 1, 2022 12:00 amLARGE_MEAL_BREAKFAST (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_DINNER (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_LUNCH (70.0 g)Nov 2, 2022 5:00 pmMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 110 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 %)Nov 2, 2022 5:00 pmMEAL_RATIO_DINNER_FACTOR (100 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 %)Nov 7, 2022 2:01 pmMEAL_RATIO_LUNCH_FACTOR (130 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_LUNCH_FACTOR (130 %)Nov 1, 2022 12:00 amMEDIUM_MEAL_BREAKFAST (70.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_DINNER (60.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_LUNCH (50.0 g)Nov 1, 2022 12:00 amPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100 %)Nov 2, 2022 7:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 140.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 180.1 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL)Nov 2, 2022 7:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 60.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLYCEMIA_TARGET (100.0 mg/dL)Nov 1, 2022 12:00 amSMALL_MEAL_BREAKFAST (15.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_DINNER (20.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_LUNCH (30.0 g)Nov 1, 2022 12:00 amTOTAL_INSULIN_FOR_24H (53.0 U)Nov 1, 2022 12:00 amWEIGHT (69.0 kg)')
    expect(await deviceUsageWidget.findByTestId('chart-basics-factory', {}, { timeout: 3000 })).toHaveTextContent('Cartridge changesSunMonTueWedThuFriSat')
    const reservoirChange = deviceUsageWidget.getByTestId('reservoir-change')
    expect(reservoirChange).toBeVisible()
    await userEvent.hover(reservoirChange)
    expect(deviceUsageWidget.getByTestId('calendar-day-hover')).toHaveTextContent(`${YESTERDAY_DATE.format('MMM D')}9:40 pm`)
  })

  it('monitored patient should have correct cards', async () => {
    const router = renderPage(`/patient/${monitoredPatientId}/dashboard`)
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual(`/patient/${monitoredPatientId}/dashboard`)
    })
    const expectedMonitoringEndDate = moment.utc(getTomorrowDate()).format(moment.localeData().longDateFormat('ll')).toString()
    const statsWidgets = await screen.findByTestId('patient-statistics', {}, { timeout: 3000 })
    expect(statsWidgets).toBeVisible()
    expect(statsWidgets).toHaveTextContent('Time In Range2h8%10h42%6h25%4h17%2h8%<5454-7070-180180-250>250mg/dLSensor Usage1%CV (CGM)55%Avg. Glucose (CGM)mg/dL135Avg. Daily Total Insulin(1.3U)Bolus1.3 U100%Basal0.0 U2%Avg. Daily Insulin1.3UWeight72kgDaily Dose ÷ Weight0.02U/kgAvg. Daily Time In Loop ModeONOFF91%21h 49m9%2h 11mAvg. Daily Carbs55gRescue carbs10gStandard Deviation (61-209)mg/dL74')

    const deviceUsageWidget = screen.getByTestId('device-usage-card')
    expect(deviceUsageWidget).toBeVisible()
    expect(deviceUsageWidget).toHaveTextContent('Last updatesNov 1, 2022 12:00 amBOLUS_AGGRESSIVENESS_FACTOR (143 %)Nov 1, 2022 12:00 amLARGE_MEAL_BREAKFAST (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_DINNER (150.0 g)Nov 1, 2022 12:00 amLARGE_MEAL_LUNCH (70.0 g)Nov 2, 2022 5:00 pmMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 110 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_BREAKFAST_FACTOR (100 %)Nov 2, 2022 5:00 pmMEAL_RATIO_DINNER_FACTOR (100 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 % -> 100 %)Nov 1, 2022 12:00 amMEAL_RATIO_DINNER_FACTOR (100 %)Nov 7, 2022 2:01 pmMEAL_RATIO_LUNCH_FACTOR (130 % -> 90 %)Nov 1, 2022 12:00 amMEAL_RATIO_LUNCH_FACTOR (130 %)Nov 1, 2022 12:00 amMEDIUM_MEAL_BREAKFAST (70.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_DINNER (60.0 g)Nov 1, 2022 12:00 amMEDIUM_MEAL_LUNCH (50.0 g)Nov 1, 2022 12:00 amPATIENT_BASAL_AGGRESSIVENESS_FACTOR_LEVEL_IN_EUGLYCAEMIA (100 %)Nov 2, 2022 7:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 140.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL -> 180.1 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPER_LIMIT (180.1 mg/dL)Nov 2, 2022 7:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 60.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL -> 70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLY_HYPO_LIMIT (70.0 mg/dL)Nov 1, 2022 12:00 amPATIENT_GLYCEMIA_TARGET (100.0 mg/dL)Nov 1, 2022 12:00 amSMALL_MEAL_BREAKFAST (15.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_DINNER (20.0 g)Nov 1, 2022 12:00 amSMALL_MEAL_LUNCH (30.0 g)Nov 1, 2022 12:00 amTOTAL_INSULIN_FOR_24H (53.0 U)Nov 1, 2022 12:00 amWEIGHT (69.0 kg)')

    const remoteMonitoringCard = screen.getByTestId('remote-monitoring-card')
    expect(remoteMonitoringCard).toBeVisible()
    expect(remoteMonitoringCard).toHaveTextContent(`Remote monitoring programRemote monitoring:YesRequesting team:MySecondTeamEnd date:${expectedMonitoringEndDate}Remaining time:a dayRenewRemove`)

    const medicalFilesCard = screen.getByTestId('medical-files-card')
    expect(medicalFilesCard).toBeVisible()
    expect(medicalFilesCard).toHaveTextContent('Medical filesMedical report-1 2022-01-10Created by Vishnou LapaixMySecondTeamMedical report-2 2022-01-02Created by Vishnou LapaixMySecondTeamNew')

    const alarmCard = screen.getByTestId('alarm-card')
    expect(alarmCard).toBeVisible()
    expect(alarmCard).toHaveTextContent('EventsCurrent eventsTime spent out of range from target10%Severe hypoglycemia20%Data not transferred30%')

    const chartCard = screen.getByTestId('chat-card')
    expect(chartCard).toBeVisible()
    expect(chartCard).toHaveTextContent('Messages ReplyPrivate')
  })

  it('should automatically log out an idle user', async () => {
    jest.spyOn(ConfigService, 'getIdleTimeout').mockReturnValue(1000)

    renderPage(`/patient/${monitoredPatientId}/dashboard`)

    await waitFor(() => {
      expect(logoutMock).toHaveBeenCalledWith({ logoutParams: { returnTo: 'http://localhost/login?idle=true' } })
    }, { timeout: 3000 })
  })
})
