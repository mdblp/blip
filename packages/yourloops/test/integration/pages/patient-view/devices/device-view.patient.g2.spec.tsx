/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { act } from '@testing-library/react'
import { mockDataAPI, pumpSettingsDblg2 } from '../../../mock/data.api.mock'
import { patient2Info } from '../../../data/patient.api.data'
import { renderPage } from '../../../utils/render'
import { mockWindowResizer } from '../../../mock/window-resizer.mock'
import { testAppMainLayoutForPatient } from '../../../use-cases/app-main-layout-visualisation'
import { testG2DevicesVisualisation } from '../../../use-cases/device-settings-visualisation'
import { testDeviceSettingsNavigationForPatient } from '../../../use-cases/device-settings-navigation'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { mockPatientLogin } from '../../../mock/patient-login.mock'

describe('Device view for G2 Patient', () => {
  const firstName = patient2Info.profile.firstName
  const lastName = patient2Info.profile.lastName

  const deviceRoute = AppUserRoute.Devices

  beforeEach(() => {
    mockWindowResizer()
    mockPatientLogin(patient2Info)
    mockDataAPI(pumpSettingsDblg2)
  })

  it('should render correct layout', async () => {
    await act(async () => {
      renderPage(deviceRoute)
    })
    await testAppMainLayoutForPatient({ loggedInUserFullName: `${lastName} ${firstName}` })
  })

  it('should display correct parameters', async () => {
    await act(async () => {
      renderPage(deviceRoute)
    })
    await testG2DevicesVisualisation()
  })

  it('should navigate to daily page when clicking on the daily button', async () => {
    let router
    await act(async () => {
      router = renderPage(deviceRoute)
    })
    await testDeviceSettingsNavigationForPatient(router)
  })
})
