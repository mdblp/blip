/*
 * Copyright (c) 2026, Diabeloop
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

import { mockAuth0Hook } from '../../../mock/auth0.hook.mock'
import { mockDataAPI } from '../../../mock/data.api.mock'
import { renderPage } from '../../../utils/render'
import { patient1Info } from '../../../data/patient.api.data'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import { act, screen } from '@testing-library/react'
import { mockLeadCliniciansApi } from '../../../mock/clinicians.api.mock'
import { mockErrorApi } from '../../../mock/error.api.mock'
import { mockAnalyticsApi } from '../../../mock/analytics.api.mock'
import { mockMobileScreen } from '../../../mock/mobile-screen.mock'
import {
  testClickViewMoreInformation,
  testClickViewMoreLeadClinicians,
  testPatientProfileSectionsOverviewVisiblePatient
} from '../../../use-cases/patient-profile-sections-overview'
import { UserRole } from '../../../../../lib/auth/models/enums/user-role.enum'
import { mockPatientLogin } from '../../../mock/patient-login.mock'

describe('Patient profile view for HCP', () => {
  beforeEach(() => {
    mockAuth0Hook(UserRole.Patient)
    mockPatientLogin(patient1Info)
    mockDataAPI()
    mockLeadCliniciansApi()
    mockErrorApi()
    mockAnalyticsApi()
    mockMobileScreen()
  })

  const patientProfileRoute = `${AppUserRoute.PatientProfile}`

  /**
   * @see https://github.com/testing-library/react-testing-library/issues/651
   * @description SVGElement.getBBOx is not implemented in JSDOM yet.
   */
  Object.defineProperty(globalThis.SVGElement.prototype, 'getBBox', {
    writable: true,
    value: jest.fn().mockReturnValue({
      x: 0,
      y: 0
    })
  });

  const renderPatientProfileSectionsOverviewPage = async (route: string) => {
    await act(async () => {
      renderPage(route)
    })
  }

  describe('Patient profile sections overview for patient in mobile version', () => {

    it('should render the sections overview in mobile version', async () => {
      await renderPatientProfileSectionsOverviewPage(patientProfileRoute)
      await screen.findByTestId('patient-profile-overview-section-information')
      testPatientProfileSectionsOverviewVisiblePatient()
    })

    it('should be able to access the pages linked by the cards', async () => {
      await renderPatientProfileSectionsOverviewPage(patientProfileRoute)

      await screen.findByTestId('patient-profile-overview-section-information')

      await testClickViewMoreInformation()
      await testClickViewMoreLeadClinicians()
    })

  })

})
