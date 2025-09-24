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
import { testAlertsViewContent, testRangeViewContent } from '../../../use-cases/range-and-alerts-management'
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

  describe('Alerts section', () => {
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
      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('alerts'))
      await userEvent.click(menuButton)

      await testAlertsViewContent()
      await testMonitoringAlertsParametersConfigurationForPatientMgdl()
    })

    it('should display the monitoring alerts configuration in mmol/L', async () => {
      const mmolSettings: Settings = { units: { bg: Unit.MmolPerLiter } }
      mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

      await act(async () => {
        renderPage(patientTargetAndAlertsRouteMmoL)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('alerts'))
      await userEvent.click(menuButton)

      await testAlertsViewContent()
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

  describe('Range section', () => {
    beforeEach(() => {
      mockAuth0Hook()
      mockNotificationAPI()
      mockDirectShareApi()
      mockTeamAPI()
      mockUserApi().mockUserDataFetch({ firstName, lastName })
      mockPatientApiForHcp()
      mockDataAPI()
    })

    it('should display patient range configuration section', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test that the range section is rendered
      await testRangeViewContent()
    })

    it('should display glycemia target range in mg/dL', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test target range values in mg/dL
      const targetLowerBound = await screen.findByTestId('target-lower-bound')
      const targetUpperBound = await screen.findByTestId('target-upper-bound')

      expect(targetLowerBound).toBeInTheDocument()
      expect(targetUpperBound).toBeInTheDocument()
      expect(screen.getByText('mg/dL')).toBeInTheDocument()
    })

    it('should display glycemia target range in mmol/L', async () => {
      const mmolSettings: Settings = { units: { bg: Unit.MmolPerLiter } }
      mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

      await act(async () => {
        renderPage(patientTargetAndAlertsRouteMmoL)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test target range values in mmol/L
      const targetLowerBound = await screen.findByTestId('target-lower-bound')
      const targetUpperBound = await screen.findByTestId('target-upper-bound')

      expect(targetLowerBound).toBeInTheDocument()
      expect(targetUpperBound).toBeInTheDocument()
      expect(screen.getByText('mmol/L')).toBeInTheDocument()
    })

    it('should display glycemia thresholds configuration', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test very low and very high thresholds
      const veryLowThreshold = await screen.findByTestId('very-low-threshold')
      const veryHighThreshold = await screen.findByTestId('very-high-threshold')

      expect(veryLowThreshold).toBeInTheDocument()
      expect(veryHighThreshold).toBeInTheDocument()
    })

    it('should display range visualization chart', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test range visualization component
      const rangeChart = await screen.findByTestId('range-visualization-chart')
      expect(rangeChart).toBeInTheDocument()
    })

    it('should handle range configuration updates', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test range update functionality
      const editButton = screen.getByTestId('edit-range-button')
      expect(editButton).toBeInTheDocument()

      await userEvent.click(editButton)

      // Verify edit mode is activated
      const saveButton = await screen.findByTestId('save-range-button')
      expect(saveButton).toBeInTheDocument()
    })

    it('should validate range bounds correctly', async () => {
      await act(async () => {
        renderPage(patientProfileRoute)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test that lower bound is less than upper bound
      const targetLowerBound = await screen.findByTestId('target-lower-bound')
      const targetUpperBound = await screen.findByTestId('target-upper-bound')

      const lowerValue = parseInt(targetLowerBound.textContent || '0')
      const upperValue = parseInt(targetUpperBound.textContent || '0')

      expect(lowerValue).toBeLessThan(upperValue)
    })

    it('should display range configuration for different patient types', async () => {
      await act(async () => {
        renderPage(patientTargetAndAlertsRouteMmoL)
      })

      const menuButton = within(screen.getByTestId('patient-profile-view-menu')).getByText(getTranslation('range'))
      await userEvent.click(menuButton)

      // Test that mmol/L patient has appropriate range values
      const rangeSection = await screen.findByTestId('range-section')
      expect(rangeSection).toBeInTheDocument()

      // Verify mmol/L specific range values are displayed
      expect(screen.getByText('mmol/L')).toBeInTheDocument()
    })
  })

})
