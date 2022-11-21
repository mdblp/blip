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
import { mockDataAPI } from '../../mock/mockDataAPI'
import { mockNotificationAPI } from '../../mock/mockNotificationAPI'
import { mockPatientAPIForHcp, unmonitoredPatientId } from '../../mock/mockPatientAPI'
import { mockChatAPI } from '../../mock/mockChatAPI'
import { mockMedicalFilesAPI } from '../../mock/mockMedicalFilesAPI'
import { mockDirectShareApi } from '../../mock/mockDirectShareAPI'
import { renderPage } from '../../utils/render'
import { screen, within } from '@testing-library/react'
import { checkNoTooltip } from '../../assert/stats'

describe('Patient dashboard for anyone', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  beforeAll(() => {
    mockAuth0Hook()
    mockNotificationAPI()
    mockDirectShareApi()
    mockTeamAPI()
    mockUserDataFetch(firstName, lastName)
    mockPatientAPIForHcp()
    mockChatAPI()
    mockMedicalFilesAPI()
    mockDataAPI()
  })

  it('should not render tooltips on patient statistics', async () => {
    renderPage(`/patient/${unmonitoredPatientId}/dashboard`)
    const statsWidgets = within(await screen.findByTestId('patient-statistics', {}, { timeout: 3000 }))
    checkNoTooltip(statsWidgets, 'Time In Range')
    checkNoTooltip(statsWidgets, 'Avg. Glucose (CGM)')
    checkNoTooltip(statsWidgets, 'Avg. Daily Insulin')
    checkNoTooltip(statsWidgets, 'Avg. Daily Time In Loop Mode')
    checkNoTooltip(statsWidgets, 'Avg. Daily Carbs')
  })
})
