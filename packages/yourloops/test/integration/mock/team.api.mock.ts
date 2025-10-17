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
import {
  loggedInUserEmail,
  loggedInUserFirstName,
  loggedInUserFullName,
  loggedInUserId,
  loggedInUserLastName,
  userHugoEmail,
  userHugoFirstName,
  userHugoFullName,
  userHugoId,
  userHugoLastName,
  userTimEmail,
  userTimFirstName,
  userTimFullName,
  userTimId,
  userTimLastName,
  userYdrisEmail,
  userYdrisFirstName,
  userYdrisFullName,
  userYdrisId,
  userYdrisLastName
} from './auth0.hook.mock'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { TeamType } from '../../../lib/team/models/enums/team-type.enum'
import { HcpProfession } from '../../../lib/auth/models/enums/hcp-profession.enum'

import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { type Team } from '../../../lib/team'
import { type Profile } from '../../../lib/auth/models/profile.model'
import { DEFAULT_THRESHOLDS_IN_MGDL } from '../../../components/monitoring-alert/monitoring-alert.default'
import { type ITeam } from '../../../lib/team/models/i-team.model'
import { Unit } from 'medical-domain'
import { type MonitoringAlertsParameters } from 'medical-domain'
import { PRIVATE_TEAM_ID, PRIVATE_TEAM_NAME } from '../../../lib/team/team.util'

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
  lowBg: 3.0,
  highBg: 7.8,
  outOfRangeThreshold: 5,
  veryLowBg: 2.2,
  hypoThreshold: 10,
  nonDataTxThreshold: 15,
  reportingPeriod: 7
}

export const myFirstTeamId = 'myTeamId'
export const mySecondTeamId = 'mySecondTeamId'
export const myThirdTeamId = 'myThirdTeamId'
export const filtersTeamId = 'filtersTeamId'
export const myFirstTeamName = 'MyFirstTeam'
export const mySecondTeamName = 'MySecondTeam'
export const myThirdTeamName = 'A - MyThirdTeam - to be deleted'
export const myThirdTeamPhoneNumber = '0476000000'
export const myThirdTeamCode = '263381988'
export const myThirdTeamAddress = 'Guinness Road W1D 1BS Dublin GB'
export const filtersTeamName = 'Team used to test the patients filters'
export const NEW_TEAM_ID = 'new-team-id'

export const buildTeamOne = (): Team => {
  return {
    name: myFirstTeamName,
    id: myFirstTeamId,
    code: '036038775',
    type: TeamType.medical,
    phone: '0476000000',
    email: 'hey@hey.hey',
    address: { line1: '6 Road 66', line2: '', zip: 'W1D 1BS', city: 'London', country: 'GB' },
    members: [{
      userId: loggedInUserId,
      role: TeamMemberRole.admin,
      profile: {
        email: loggedInUserEmail,
        firstName: 'Yourloops UI 28.0',
        fullName: 'Yourloops UI 28.0 HCP 0',
        hcpProfession: HcpProfession.other,
        lastName: 'HCP 0',
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInviteStatus.Accepted,
      email: loggedInUserEmail
    }, {
      userId: userTimId,
      role: TeamMemberRole.admin,
      profile: {
        email: userTimEmail,
        firstName: userTimFirstName,
        fullName: userTimFullName,
        hcpProfession: HcpProfession.other,
        lastName: userTimLastName,
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInviteStatus.Accepted,
      email: userTimEmail
    }],
    monitoringAlertsParameters
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
        email: loggedInUserEmail,
        firstName: 'Yourloops UI 28.0',
        fullName: 'Yourloops UI 28.0 HCP 0',
        hcpProfession: HcpProfession.other,
        lastName: 'HCP 0',
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInviteStatus.Accepted,
      email: loggedInUserEmail
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
    address: { line1: 'Guinness Road', line2: '', zip: 'W1D 1BS', city: 'Dublin', country: 'GB' },
    members: [
      {
        userId: loggedInUserId,
        role: TeamMemberRole.admin,
        profile: {
          email: loggedInUserEmail,
          firstName: loggedInUserFirstName,
          fullName: loggedInUserFullName,
          hcpProfession: HcpProfession.other,
          lastName: loggedInUserLastName,
          privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
          termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
        } as Profile,
        status: UserInviteStatus.Accepted,
        email: loggedInUserEmail
      },
      {
        userId: userTimId,
        role: TeamMemberRole.member,
        profile: {
          email: userTimEmail,
          firstName: userTimFirstName,
          fullName: userTimFullName,
          hcpProfession: HcpProfession.other,
          lastName: userTimLastName,
          privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
          termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
        } as Profile,
        status: UserInviteStatus.Accepted,
        email: userTimEmail
      }, {
        userId: userHugoId,
        role: TeamMemberRole.member,
        profile: {
          email: userHugoEmail,
          firstName: userHugoFirstName,
          fullName: userHugoFullName,
          hcpProfession: HcpProfession.other,
          lastName: userHugoLastName,
          privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
          termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
        } as Profile,
        status: UserInviteStatus.Pending,
        email: userHugoEmail,
        invitationId: 'fakeInvitationId'
      }, {
        userId: userYdrisId,
        role: TeamMemberRole.member,
        profile: {
          email: userYdrisEmail,
          firstName: userYdrisFirstName,
          fullName: userYdrisFullName,
          hcpProfession: HcpProfession.other,
          lastName: userYdrisLastName,
          privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
          termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
        } as Profile,
        status: UserInviteStatus.Pending,
        email: userYdrisEmail
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
      role: TeamMemberRole.member,
      profile: {
        email: loggedInUserEmail,
        firstName: loggedInUserFirstName,
        lastName: loggedInUserLastName,
        fullName: loggedInUserFullName,
        hcpProfession: HcpProfession.other,
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInviteStatus.Accepted,
      email: 'filters@user.com'
    }, {
      userId: userTimId,
      role: TeamMemberRole.admin,
      profile: {
        email: userTimEmail,
        firstName: userTimFirstName,
        fullName: userTimFullName,
        hcpProfession: HcpProfession.other,
        lastName: userTimLastName,
        privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
        termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
      } as Profile,
      status: UserInviteStatus.Accepted,
      email: userTimEmail
    }],
    monitoringAlertsParameters
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
  jest.spyOn(TeamAPI, 'createTeam').mockRejectedValue('Mocked error')
}

export const mockTeamApiForTeamCreation = () => {
  const newTeam = { id: NEW_TEAM_ID, name: '🦁', type: TeamType.medical, members: [], monitoringAlertsParameters }
  jest.spyOn(TeamAPI, 'getTeams').mockResolvedValue(buildAvailableTeams().concat(newTeam as Team))
  jest.spyOn(TeamAPI, 'createTeam').mockResolvedValue(newTeam as ITeam)
}
