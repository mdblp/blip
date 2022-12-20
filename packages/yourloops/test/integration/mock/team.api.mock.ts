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

import TeamAPI from '../../../lib/team/team.api'
import { MIN_HIGH_BG, MIN_LOW_BG, MIN_VERY_LOW_BG } from '../../../components/alarm/alarms-content-configuration'
import { loggedInUserId } from './auth0.hook.mock'
import { HcpProfession } from '../../../lib/auth/models/enums/hcp-profession.enum'
import { UnitsType } from '../../../lib/units/models/enums/units-type.enum'
import { TeamType } from '../../../lib/team/models/enums/team-type.enum'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { UserInvitationStatus } from '../../../lib/team/models/enums/user-invitation-status.enum'
import { MonitoringStatus } from '../../../lib/team/models/enums/monitoring-status.enum'
import { Team } from '../../../lib/team'
import { Profile } from '../../../lib/auth/models/profile.model'

export const monitoringParameters = {
  bgUnit: UnitsType.MGDL,
  lowBg: MIN_LOW_BG,
  highBg: MIN_HIGH_BG,
  outOfRangeThreshold: 5,
  veryLowBg: MIN_VERY_LOW_BG,
  hypoThreshold: 10,
  nonDataTxThreshold: 15,
  reportingPeriod: 7
}

export const mySecondTeamId = '62fe00defc9374b2fed32bcd'
export const myThirdTeamId = '62fe00defc9374b2fed32bce'

export const teamOne: Team = {
  name: 'MyTeam',
  id: '62fe00defc9374b2fed32bcc',
  code: '036038775',
  type: TeamType.medical,
  phone: '0476000000',
  email: 'hey@hey.hey',
  address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
  members: [{
    userId: loggedInUserId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    } as Profile,
    status: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr'
  }]
}

export const teamTwo: Team = {
  name: 'MySecondTeam',
  id: mySecondTeamId,
  code: '241548778',
  type: TeamType.medical,
  phone: '0476000000',
  email: 'hey@hey.hey',
  address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
  members: [{
    userId: loggedInUserId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    } as Profile,
    status: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr'
  }],
  monitoring: {
    enabled: true,
    monitoringEnd: null,
    status: MonitoringStatus.accepted,
    parameters: monitoringParameters
  }
}

export const teamThree: Team = {
  name: 'MyThirdTeam - to be deleted',
  id: myThirdTeamId,
  code: '263381988',
  type: TeamType.medical,
  phone: '0476000000',
  email: 'hey@third.hey',
  address: { line1: 'Guiness Road', line2: '', zip: 'W1D 1BS', city: 'Dublin', country: 'IE' },
  members: [{
    userId: loggedInUserId,
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.0',
      fullName: 'Yourloops UI 28.0 HCP 0',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 0',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    } as Profile,
    status: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28@diabeloop.fr'
  }, {
    userId: '4d9afc649ae4',
    role: TeamMemberRole.admin,
    profile: {
      firstName: 'Yourloops UI 28.1',
      fullName: 'Yourloops UI 28.1 HCP 1',
      hcpProfession: HcpProfession.other,
      lastName: 'HCP 1',
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
    } as Profile,
    status: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.hcp.28.1@diabeloop.fr'
  }]
}

export const mockTeamAPI = () => {
  jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue([teamOne, teamTwo, teamThree])
}
