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
import { Settings } from '../../../../../lib/auth/models/settings.model'
import { Unit } from 'medical-domain'

describe('Target and alerts view for HCP', () => {
  const firstName = 'HCP firstName'
  const lastName = 'HCP lastName'

  const targetAndAlertsRoute = `/teams/${myThirdTeamId}/patients/${patient1Id}${AppUserRoute.TargetAndAlerts}`
  const patientTargetAndAlertsRouteMmoL = `/teams/${myThirdTeamId}/patients/${patientWithMmolId}${AppUserRoute.TargetAndAlerts}`

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
    renderPage(targetAndAlertsRoute)
    await testAppMainLayoutForHcp(appMainLayoutParams)
  })

  it('should display the monitoring alerts configuration in mg/dL', async () => {
    renderPage(targetAndAlertsRoute)

    await testTargetAndAlertsViewContent()
    await testMonitoringAlertsParametersConfigurationForPatientMgdl()
  })

  it('should display the monitoring alerts configuration in mmol/L', async () => {
    const mmolSettings: Settings = { units: { bg: Unit.MmolPerLiter } }
    mockUserApi().mockUserDataFetch({ firstName, lastName, settings: mmolSettings })

    renderPage(patientTargetAndAlertsRouteMmoL)

    await testTargetAndAlertsViewContent()
    await testMonitoringAlertsParametersConfigurationForPatientMmol()
  })
})
