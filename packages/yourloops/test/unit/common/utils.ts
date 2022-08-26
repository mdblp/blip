/**
 * Copyright (c) 2021, Diabeloop
 * Commons utilities for all tests
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

import { UserInvitationStatus } from '../../../models/generic'
import { Patient, PatientTeam } from '../../../lib/data/patient'
import { Alarm } from '../../../models/alarm'
import { Team, TeamMember, TeamUser } from '../../../lib/team'
import { Profile, UserRoles } from '../../../models/user'
import { TeamMemberRole, TeamType } from '../../../models/team'
import { Monitoring, MonitoringStatus } from '../../../models/monitoring'
import { UNITS_TYPE } from '../../../lib/units/utils'
import { INotification, NotificationType } from '../../../lib/notifications/models'

export function triggerMouseEvent(event: string, domElement: Element): void {
  const clickEvent = new MouseEvent(event, { bubbles: true })
  domElement.dispatchEvent(clickEvent)
}

export const createPatient = (
  id = 'fakePatientId',
  teams: PatientTeam[] = [],
  alarm: Alarm = {
    timeSpentAwayFromTargetRate: 10,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 20,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 30,
    nonDataTransmissionActive: false
  },
  fullName = 'fakePatientFullName',
  monitoring: Monitoring | undefined = undefined,
  system: string | undefined = undefined,
  flagged: boolean | undefined = undefined
): Patient => {
  return {
    metadata: {
      alarm,
      flagged,
      medicalData: null,
      unreadMessagesSent: 0
    },
    monitoring,
    profile: {
      birthdate: new Date(),
      firstName: 'fakeFirstname',
      fullName,
      lastName: 'fakeLastname',
      email: 'fake@email.com',
      sex: 'M'
    },
    settings: {
      a1c: { date: new Date().toJSON(), value: 'fakeA1cValue' },
      system
    },
    teams,
    userid: id
  }
}

export const createPatientTeam = (
  id: string,
  status: UserInvitationStatus,
  monitoringStatus: MonitoringStatus | undefined = undefined
): PatientTeam => {
  return {
    teamId: id,
    status,
    monitoringStatus
  } as PatientTeam
}
export const createAlarm = (timeSpentAwayFromTargetRate: number, frequencyOfSevereHypoglycemiaRate: number): Alarm => {
  return {
    timeSpentAwayFromTargetRate,
    frequencyOfSevereHypoglycemiaRate
  } as Alarm
}

export const createTeamUser = (
  id: string,
  members: TeamMember[],
  profile: Profile | undefined = undefined,
  alarms: Alarm = {
    timeSpentAwayFromTargetRate: 10,
    timeSpentAwayFromTargetActive: true,
    frequencyOfSevereHypoglycemiaRate: 10,
    frequencyOfSevereHypoglycemiaActive: true,
    nonDataTransmissionRate: 10,
    nonDataTransmissionActive: true
  },
  username: string = 'fakeUsername'
): TeamUser => {
  return {
    userid: id,
    members,
    profile,
    alarms,
    username,
    monitoring: { enabled: false }
  } as TeamUser
}

export const createTeamMember = (id: string, name: string, teamCode: string, status: UserInvitationStatus): TeamMember => {
  return {
    team: { id, name, code: teamCode } as Team,
    status
  } as TeamMember
}

export function buildTeam(id = 'fakeTeamId', members: TeamMember[] = [], name = 'fake team name'): Team {
  return {
    id,
    name,
    code: '123456789',
    owner: 'fakeOwner',
    email: 'fale@email.com',
    type: TeamType.medical,
    members,
    monitoring: {
      enabled: true,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: 1,
        highBg: 2,
        outOfRangeThreshold: 10,
        veryLowBg: 4,
        hypoThreshold: 15,
        nonDataTxThreshold: 20,
        reportingPeriod: 7
      }
    }
  }
}

export function buildTeamMember(
  teamId = 'fakeTeamId',
  userId = 'fakeUserId',
  invitation: INotification | undefined = undefined,
  role: TeamMemberRole = TeamMemberRole.admin,
  username = 'fake@username.com',
  fullName = 'fake full name',
  status = UserInvitationStatus.pending,
  userRole: UserRoles = UserRoles.hcp
): TeamMember {
  return {
    team: { id: teamId } as Team,
    role,
    status,
    user: {
      role: userRole,
      userid: userId,
      username,
      members: [
        {
          invitation: {} as INotification,
          status,
          team: { id: teamId, code: 'fakeCode', name: 'fakeTeamName' }
        } as TeamMember
      ],
      profile: {
        fullName
      }
    },
    invitation
  }
}

export function buildInvite(teamId = 'fakeTeamId', userId = 'fakeUserId', role = TeamMemberRole.admin): INotification {
  return {
    id: 'fakeInviteId',
    type: NotificationType.careTeamProInvitation,
    metricsType: 'join_team',
    email: 'fake@email.com',
    creatorId: 'fakeCreatorId',
    date: 'fakeDate',
    target: {
      id: teamId,
      name: 'fakeTeamName'
    },
    role,
    creator: {
      userid: userId
    }
  }
}
