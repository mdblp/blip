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

import { screen, waitFor } from '@testing-library/react'
import { mockPatientLogin } from '../../mock/patient-login.mock'
import { checkPatientNavBarAsPatient } from '../../assert/patient-nav-bar'
import { minimalTrendViewData, mockDataAPI } from '../../mock/data.api.mock'
import { renderPage } from '../../utils/render'
import { checkPatientLayout } from '../../assert/layout'
import { unmonitoredPatientAsTeamMember } from '../../data/patient.api.data'

describe('Trends view for patient', () => {
  beforeAll(() => {
    mockPatientLogin(unmonitoredPatientAsTeamMember)
  })

  it('should render correct layout', async () => {
    mockDataAPI(minimalTrendViewData)
    const router = renderPage('/trends')
    await waitFor(() => {
      expect(router.state.location.pathname).toEqual('/trends')
    })

    expect(await screen.findByTestId('patient-nav-bar', {}, { timeout: 3000 })).toBeVisible()
    checkPatientNavBarAsPatient()
    await checkPatientLayout(`${unmonitoredPatientAsTeamMember.profile.firstName} ${unmonitoredPatientAsTeamMember.profile.lastName}`)
  })
})