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

import TeamAPI from '../../../lib/team/team.api'
import { loggedInUserId } from './auth0.hook.mock'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { TeamType } from '../../../lib/team/models/enums/team-type.enum'
import { HcpProfession } from '../../../lib/auth/models/enums/hcp-profession.enum'

import { UserInvitationStatus } from '../../../lib/team/models/enums/user-invitation-status.enum'
import { type Team } from '../../../lib/team'
import { type Profile } from '../../../lib/auth/models/profile.model'
import { DEFAULT_THRESHOLDS_IN_MGDL } from '../../../components/monitoring-alert/monitoring-alert.default'
import { type ITeam } from '../../../lib/team/models/i-team.model'
import { Unit } from 'medical-domain'
import { PRIVATE_TEAM_ID, PRIVATE_TEAM_NAME } from '../../../lib/team/team.hook'
import { type MonitoringAlertsParameters } from '../../../lib/team/models/monitoring-alerts-parameters.model'

const {
  minVeryLowBg,
  minLowBg,
  minHighBg
} = DEFAULT_THRESHOLDS_IN_MGDL
export const monitoringAlertsParameters: MonitoringAlertsParameters = {
  bgUnit: Unit.MilligramPerDeciliter,
  lowBg: minLowBg,
  highBg: minHighBg,
  outOfRangeThreshold: 5,
  veryLowBg: minVeryLowBg,
  hypoThreshold: 10,
  nonDataTxThreshold: 15,
  reportingPeriod: 7
}
export const monitoringAlertsParametersBgUnitMmol: MonitoringAlertsParameters = {
  bgUnit: Unit.MmolPerLiter,
  lowBg: 2.8,
  highBg: 7.8,
  outOfRangeThreshold: 5,
  veryLowBg: 2.2,
  hypoThreshold: 10,
  nonDataTxThreshold: 15,
  reportingPeriod: 7
}

export const myTeamId = 'myTeamId'
export const mySecondTeamId = 'mySecondTeamId'
export const myThirdTeamId = 'myThirdTeamId'
export const filtersTeamId = 'filtersTeamId'
export const myFirstTeamName = 'MyFirstTeam'
export const mySecondTeamName = 'MySecondTeam'
export const myThirdTeamName = 'A - MyThirdTeam - to be deleted'
export const filtersTeamName = 'Team used to test the patients filters'

export const buildTeamOne = (): Team => {
  return {
    name: myFirstTeamName,
    id: myTeamId,
    code: '036038775',
    type: TeamType.medical,
    phone: '0476000000',
    email: 'hey@hey.hey',
    address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
    members: [{
      userId: loggedInUserId,
      role: TeamMemberRole.admin,
      profile: {
        email: 'hey@hey.hey',
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
}

export const buildTeamTwo = (): Team => {
  return {
    name: mySecondTeamName,
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
        email: 'ylp.ui.test.hcp.28@diabeloop.fr',
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
    monitoringAlertsParameters
  }
}

export const buildTeamThree = (): Team => {
  return {
    name: myThirdTeamName,
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
        email: 'ylp.ui.test.hcp.28@diabeloop.fr',
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
        email: 'ylp.ui.test.hcp.28@diabeloop.fr',
        firstName: 'Yourloops UI 28.1',
        fullName: 'Yourloops UI 28.1 HCP 1',
        hcpProfession: HcpProfession.other,
        lastName: 'HCP 1',
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInvitationStatus.accepted,
      email: 'ylp.ui.test.hcp.28.1@diabeloop.fr'
    }],
    monitoringAlertsParameters
  }
}

export const buildFiltersTeam = (): Team => {
  return {
    name: filtersTeamName,
    id: filtersTeamId,
    code: '126534897',
    type: TeamType.medical,
    phone: '0476000001',
    email: 'filters@team.com',
    address: { line1: 'Vaucansson', line2: '', zip: '380000', city: 'Grenoble', country: 'FR' },
    members: [{
      userId: loggedInUserId,
      role: TeamMemberRole.admin,
      profile: {
        email: 'filters@user.com',
        firstName: 'Test',
        lastName: 'Patients Filters',
        fullName: 'Test Patients Filters',
        hcpProfession: HcpProfession.other,
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInvitationStatus.accepted,
      email: 'filters@user.com'
    }]
  }
}

export const buildPrivateTeam = (): Team => {
  return {
    name: PRIVATE_TEAM_NAME,
    id: PRIVATE_TEAM_ID,
    code: 'private',
    type: TeamType.private,
    phone: '',
    email: '',
    members: []
  }
}

export const iTeamOne: ITeam = {
  name: 'iTeamOne',
  id: 'iTeamOneId',
  code: '679517388',
  type: TeamType.medical,
  phone: '0478780000',
  email: 'iTeamOne@hey.hey',
  address: {
    line1: '6 rue des champs',
    line2: '',
    zip: '75000',
    city: 'Paris',
    country: 'FR'
  },
  members: null,
  monitoringAlertsParameters
}

export const buildAvailableTeams = (): Team[] => {
  return [buildTeamOne(), buildTeamTwo(), buildTeamThree(), buildFiltersTeam(), buildPrivateTeam()]
}

export const mockTeamAPI = () => {
  jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue(buildAvailableTeams())
}
