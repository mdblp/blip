/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { UserInvitationStatus } from '../../../models/generic.model'
import { Patient, PatientMetadata, PatientProfile, PatientSettings, PatientTeam } from '../../../lib/data/patient.model'
import { Alarm } from '../../../models/alarm.model'
import { Team, TeamMember } from '../../../lib/team'
import { TeamMemberRole, TeamType } from '../../../models/team'
import { Monitoring, MonitoringStatus } from '../../../models/monitoring.model'
import { UNITS_TYPE } from '../../../lib/units/utils'

export function triggerMouseEvent(event: string, domElement: Element): void {
  const clickEvent = new MouseEvent(event, { bubbles: true })
  domElement.dispatchEvent(clickEvent)
}

export const createPatient = (
  id = 'fakePatientId',
  teams: PatientTeam[] = [],
  monitoring: Monitoring | undefined = undefined,
  profile: Partial<PatientProfile> = undefined,
  settings: Partial<PatientSettings> = undefined,
  metadata: Partial<PatientMetadata> = undefined
): Patient => {
  return {
    profile: {
      birthdate: profile?.birthdate || new Date(),
      firstName: profile?.firstName || 'fakeFirstname',
      fullName: profile?.fullName || 'fakePatientFullName',
      lastName: profile?.lastName || 'fakeLastname',
      email: profile?.email || 'fake@email.com',
      sex: profile?.sex || 'M'
    },
    settings: {
      a1c: settings?.a1c || { date: new Date().toJSON(), value: 'fakeA1cValue' },
      system: settings?.system
    },
    metadata: {
      alarm: metadata?.alarm || {
        timeSpentAwayFromTargetRate: 10,
        timeSpentAwayFromTargetActive: false,
        frequencyOfSevereHypoglycemiaRate: 20,
        frequencyOfSevereHypoglycemiaActive: false,
        nonDataTransmissionRate: 30,
        nonDataTransmissionActive: false
      },
      flagged: metadata?.flagged,
      medicalData: metadata?.medicalData || null,
      unreadMessagesSent: metadata?.unreadMessagesSent || 0
    },
    monitoring,
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

export function buildPrivateTeam(): Team {
  return {
    code: TeamType.private,
    id: TeamType.private,
    members: [],
    name: TeamType.private,
    type: TeamType.private
  }
}

export function buildTeam(id = 'fakeTeamId', members: TeamMember[] = [], name = 'fake team name'): Team {
  return {
    id,
    name,
    code: '123456789',
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
  userId = 'fakeUserId',
  invitationId?: string,
  role: TeamMemberRole = TeamMemberRole.admin,
  email = 'fake@username.com',
  fullName = 'fake full name',
  status = UserInvitationStatus.pending
): TeamMember {
  return {
    userId,
    email,
    profile: { fullName, email },
    role,
    status,
    invitationId
  }
}
