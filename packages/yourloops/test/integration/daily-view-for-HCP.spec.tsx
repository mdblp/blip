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
import { act, render, screen, within } from '@testing-library/react'
import { AuthContextProvider } from '../../lib/auth'
import { MainLobby } from '../../app/main-lobby'
import { checkHeader } from './utils/header'
import { checkDrawer } from './utils/drawer'
import { checkFooter } from './utils/footer'
import { mockUserDataFetch } from './utils/auth'
import { mockAuth0Hook } from './utils/mockAuth0Hook'
import { mockTeamAPI } from './utils/mockTeamAPI'
import {
  CARB_ID1,
  CARB_ID2, CBG_ID,
  mockDataAPI,
  PARAMETER_ID,
  PHYSICAL_ACTIVITY_ID,
  RESERVOIR_CHANGE_ID
} from './utils/mockDataAPI'
import { mockNotificationAPI } from './utils/mockNotificationAPI'
import { mockPatientAPI, patientNonMonitoredId } from './utils/mockPatientAPI'
import { mockChatAPI } from './utils/mockChatAPI'
import { mockMedicalFilesAPI } from './utils/mockMedicalFilesAPI'
import { mockDirectShareApi } from './utils/mockDirectShareAPI'
import { checkPatientNavBar } from './utils/patient-nav-bar'
import userEvent from '@testing-library/user-event'
import { BoundFunctions } from '@testing-library/dom/types/get-queries-for-element'
import { queries } from '@testing-library/dom'

const TIME_IN_RANGE_TOOLTIP = 'Time In Range: Time spent in range, based on CGM readings.How we calculate this: (%) is the number of readings in range divided by all readings for this time period. (time) is 24 hours multiplied by % in range.'
const AVG_GLUCOSE_TOOLTIP = 'Avg. Glucose (CGM): All CGM glucose values added together, divided by the number of readings.'
const TOTAL_INSULIN_TOOLTIP = 'Total Insulin: All basal and bolus insulin delivery (in Units) added togetherHow we calculate this: (%) is the respective total of basal or bolus delivery divided by total insulin delivered for this time period.'
const TIME_IN_LOOP_MODE_TOOLTIP = 'Time In Loop Mode: Time spent in automated basal delivery.How we calculate this: (%) is the duration in loop mode ON or OFF divided by the total duration of basals for this time period. (time) is 24 hours multiplied by % in loop mode ON or OFF.'
const TOTAL_CARBS_TOOLTIP = 'Total Carbs: All carb entries from meals or rescue carbs added together.Derived from 2 carb entries, including rescue carbs.'
const STANDARD_DEVIATION_TOOLTIP = 'SD (Standard Deviation): How far values are from the mean.'
const CV_TOOLTIP = 'CV (Coefficient of Variation): The ratio of the standard deviation to the mean glucose. For any period greater than 1 day, we calculate the mean of daily CV.'

describe('Patient dashboard for HCP', () => {
  const patient = `/patient/${patientNonMonitoredId}/daily`
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPI()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
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
    const history = createMemoryHistory({ initialEntries: [patient] })

    act(() => {
      render(getPatientDailyView(history))
    })
    expect(history.location.pathname).toBe(patient)
  }

  const checkTidelineContainerElementTooltip = (id: string, expectedTextContent: string) => {
    const carbElement = screen.getByTestId(id)
    expect(carbElement).toBeVisible()
    userEvent.hover(carbElement)
    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveTextContent(expectedTextContent)
    userEvent.unhover(carbElement)
  }

  const checkTidelineContainerTooltips = async () => {
    expect(await screen.findByTestId('poolBG_confidential_group')).toBeVisible() // This is used to wait for the container to be fully initialized
    checkTidelineContainerElementTooltip('poolBG_confidential_group', 'Confidential mode')
    checkTidelineContainerElementTooltip('poolBolus_confidential_group', 'Confidential mode')
    checkTidelineContainerElementTooltip('poolBasal_confidential_group', 'Confidential mode')
    checkTidelineContainerElementTooltip(`wizard_group_${CARB_ID1}`, '8:25 pmMealCarbs45gLoop modeBolus TypeStandardDelivered1.3U')
    checkTidelineContainerElementTooltip(`carb_group_${CARB_ID2}`, '2:00 pmConfirmed15g')
    checkTidelineContainerElementTooltip(`pa_group_${PHYSICAL_ACTIVITY_ID}`, '3:00 pmPhysical ActivityIntensitymediumDuration30 minutesEntered at3:00 pm')
    checkTidelineContainerElementTooltip(`reservoir_group_${RESERVOIR_CHANGE_ID}`, '7:00 pmInfusion Site change')
    checkTidelineContainerElementTooltip(`param_group_${PARAMETER_ID}`, '10:00 am10:00 amMEAL_RATIO_LUNCH_FACTOR110→100%')
    checkTidelineContainerElementTooltip(`cbg_${CBG_ID}`, '5:30 pmGlucose189')
  }

  const checkStatTooltip = (statsWidgets: BoundFunctions<typeof queries>, infoIconLabel: string, expectedTextContent: string) => {
    const element = statsWidgets.getByText(infoIconLabel)
    const infoIcon = within(element).getByTestId('info-icon')
    userEvent.hover(infoIcon)
    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip).toHaveTextContent(expectedTextContent)
    userEvent.unhover(infoIcon)
  }

  const checkStatsWidgetsTooltips = () => {
    const statsWidgets = within(screen.getByTestId('stats-widgets'))
    checkStatTooltip(statsWidgets, 'Time In Range', TIME_IN_RANGE_TOOLTIP)
    checkStatTooltip(statsWidgets, 'Avg. Glucose (CGM)', AVG_GLUCOSE_TOOLTIP)
    checkStatTooltip(statsWidgets, 'Total Insulin', TOTAL_INSULIN_TOOLTIP)
    checkStatTooltip(statsWidgets, 'Time In Loop Mode', TIME_IN_LOOP_MODE_TOOLTIP)
    checkStatTooltip(statsWidgets, 'Total Carbs', TOTAL_CARBS_TOOLTIP)
    checkStatTooltip(statsWidgets, 'Standard Deviation', STANDARD_DEVIATION_TOOLTIP)
    checkStatTooltip(statsWidgets, 'CV (CGM)', CV_TOOLTIP)
  }

  it('should render correct basic components when navigating to patient daily view as an HCP', async () => {
    renderDailyView()
    expect(await screen.findByTestId('patient-data-subnav-outer')).toBeVisible()
    checkPatientNavBar()
    checkHeader(`${firstName} ${lastName}`)
    checkDrawer()
    checkFooter()
  })

  it('should render correct tooltips', async () => {
    renderDailyView()
    await checkTidelineContainerTooltips()
    checkStatsWidgetsTooltips()
  })
})
