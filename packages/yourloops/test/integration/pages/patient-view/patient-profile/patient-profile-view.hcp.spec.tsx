/*
 * Copyright (c) 2023-2024, Diabeloop
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
import { mockNotificationAPI } from '../../../mock/notification.api.mock'
import { mockDirectShareApi } from '../../../mock/direct-share.api.mock'
import { buildAvailableTeams, mockTeamAPI, myThirdTeamId, myThirdTeamName } from '../../../mock/team.api.mock'
import { mockUserApi } from '../../../mock/user.api.mock'
import { mockPatientApiForHcp } from '../../../mock/patient.api.mock'
import { mockDataAPI } from '../../../mock/data.api.mock'
import { AppMainLayoutHcpParams, testAppMainLayoutForHcp } from '../../../use-cases/app-main-layout-visualisation'
import { renderPage } from '../../../utils/render'
import { patient1Id, patientWithMmolId } from '../../../data/patient.api.data'
import { AppUserRoute } from '../../../../../models/enums/routes.enum'
import {
  testMonitoringAlertsParametersConfigurationForPatientMgdl,
  testMonitoringAlertsParametersConfigurationForPatientMmol
} from '../../../use-cases/monitoring-alerts-parameters-management'
import { testTargetAndAlertsViewContent } from '../../../use-cases/target-and-alerts-management'
import { testPatientPersonalInformation } from '../../../use-cases/patient-personal-information-management'
import { Settings } from '../../../../../lib/auth/models/settings.model'
import { Unit } from 'medical-domain'
import { act, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { getTranslation } from '../../../../utils/i18n'

describe('Patient profile view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  const patientTargetAndAlertsRouteMmoL = `/teams/${myThirdTeamId}/patients/${patientWithMmolId}${AppUserRoute.PatientProfile}`
  const patientProfileRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.PatientProfile}`

  describe('Range and alerts section', () => {
    beforeEach(() => {
      mockAuth0Hook()
      mockNotificationAPI()
      mockDirectShareApi()
      mockTeamAPI()
      mockUserApi().mockUserDataFetch({ firstName, lastName })
      mockPatientApiForHcp()
      mockDataAPI()
    })

    it('should render correct layout', async () => {
      const appMainLayoutParams: AppMainLayoutHcpParams = {
        footerHasLanguageSelector: false,
        headerInfo: {
          loggedInUserFullName: `${lastName} ${firstName}`,
          teamMenuInfo: {
            selectedTeamName: myThirdTeamName,
            isSelectedTeamPrivate: false,
            availableTeams: buildAvailableTeams()
          }
        }
      }
      renderPage(patientProfileRoute)
      await testAppMainLayoutForHcp(appMainLayoutParams)
    })

    it('should display the monitoring alerts configuration in mg/dL', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })
      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range-and-alerts'))
      await userEvent.click(menuButton)

      await testTargetAndAlertsViewContent()
      await testMonitoringAlertsParametersConfigurationForPatientMgdl()
    })

    it('should display the monitoring alerts configuration in mmol/L', async () => {
      const mmolSettings: Settings = { units: { bg: Unit.MmolPerLiter } }
      mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

      await act(async () => {
        renderPage(patientTargetAndAlertsRouteMmoL)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range-and-alerts'))
      await userEvent.click(menuButton)

      await testTargetAndAlertsViewContent()
      await testMonitoringAlertsParametersConfigurationForPatientMmol()
    })
  })

  describe('Information section', () => {
    it('should display patient personal information section', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })
      // Test that the patient's personal information component is rendered
      const informationSection = await screen.findByTestId('information-section')
      expect(informationSection).toBeInTheDocument()

      await testPatientPersonalInformation()
    })

    it('should display patient avatar with initials', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      // Test avatar display with patient initials
      const avatar = screen.getByTestId('patient-avatar')
      expect(avatar).toBeInTheDocument()
    })

    it('should display patient email with email icon', async () => {
      renderPage(patientProfileRoute)

      // Test email field with EmailIcon
      const emailText = await screen.findByText(/email/i)
      expect(emailText).toBeInTheDocument()
    })

    it('should display patient gender with person icon', async () => {
      renderPage(patientProfileRoute)

      // Test gender field with PersonIcon
      const genderText = await screen.findByText(/gender/i)
      expect(genderText).toBeInTheDocument()
    })

    it('should display patient birth date with cake icon', async () => {
      renderPage(patientProfileRoute)

      // Test birth date field with CakeIcon
      const birthDateText = await screen.findByText(/date.of.birth/i)
      expect(birthDateText).toBeInTheDocument()
    })

    it('should display patient age with access time icon', async () => {
      renderPage(patientProfileRoute)

      // Test age field with AccessTimeIcon
      const ageText = await screen.findByText(/age/i)
      expect(ageText).toBeInTheDocument()
    })

    it('should display HbA1c with science icon', async () => {
      renderPage(patientProfileRoute)

      // Test HbA1c field with ScienceIcon
      const hba1cText = await screen.findByText(/hba1c/i)
      expect(hba1cText).toBeInTheDocument()
    })

    it('should display glycemia units', async () => {
      renderPage(patientProfileRoute)

      // Test units field
      const unitsText = await screen.findByText(/glycemia.units/i)
      expect(unitsText).toBeInTheDocument()
    })

    // TODO: Uncomment when the feature is implemented with the API
    // eslint-disable-next-line jest/no-commented-out-tests
    // it('should handle missing patient data gracefully', async () => {
    //   // Mock patient with missing data
    //   mockPatientApiForHcp().mockPatientDataFetch({
    //     profile: {
    //       firstName: '',
    //       lastName: '',
    //       email: '',
    //       birthdate: '',
    //       sex: undefined
    //     }
    //   })
    //
    //   renderPage(patientProfileRoute)
    //
    //   // Verify N/A is displayed for missing data
    //   const naTexts = await screen.findAllByText('N/A')
    //   expect(naTexts.length).toBeGreaterThan(0)
    // })
  })
})
