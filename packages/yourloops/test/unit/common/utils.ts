/*
 * Copyright (c) 2021-2025, Diabeloop
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

import { type MonitoringAlerts } from '../../../lib/patient/models/monitoring-alerts.model'
import { type Team, type TeamMember } from '../../../lib/team'
import { type ProfilePatient } from '../../../lib/patient/models/patient-profile.model'
import { type PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { TeamType } from '../../../lib/team/models/enums/team-type.enum'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { DiabeticType, Unit, type MonitoringAlertsParameters } from 'medical-domain'
import { Gender } from '../../../lib/auth/models/enums/gender.enum'
import { type MedicalData } from '../../../lib/data/models/medical-data.model'
import { act } from '@testing-library/react'

export function triggerMouseEvent(event: string, domElement: Element): void {
  const clickEvent = new MouseEvent(event, { bubbles: true })
  act(() => {
    domElement.dispatchEvent(clickEvent)
  })
}

export const createPatient = (
  id = 'fakePatientId',
  invitationStatus: UserInviteStatus = UserInviteStatus.Accepted,
  monitoringAlertsParameters: MonitoringAlertsParameters | undefined = undefined,
  profile: Partial<ProfilePatient> = undefined,
  settings: Partial<PatientSettings> = undefined,
  monitoringAlerts: Partial<MonitoringAlerts> = undefined,
  flagged: boolean = false,
  hasSentUnreadMessages: boolean = false,
  medicalData: MedicalData = null
): Patient => {
  return {
    monitoringAlerts: {
      timeSpentAwayFromTargetRate: monitoringAlerts?.timeSpentAwayFromTargetRate || 10,
      timeSpentAwayFromTargetActive: monitoringAlerts?.timeSpentAwayFromTargetActive || false,
      frequencyOfSevereHypoglycemiaRate: monitoringAlerts?.frequencyOfSevereHypoglycemiaRate || 20,
      frequencyOfSevereHypoglycemiaActive: monitoringAlerts?.frequencyOfSevereHypoglycemiaActive || false,
      nonDataTransmissionRate: monitoringAlerts?.nonDataTransmissionRate || 30,
      nonDataTransmissionActive: monitoringAlerts?.nonDataTransmissionActive || false
    },
    profile: {
      birthdate: profile?.birthdate || new Date().toString(),
      firstName: profile?.firstName || 'fakeFirstname',
      fullName: profile?.fullName || 'fakePatientFullName',
      lastName: profile?.lastName || 'fakeLastname',
      email: profile?.email || 'fake@email.com',
      sex: profile?.sex || Gender.Male,
      drugTreatment: "",
      diet: ['no-specific-diet'],
      profession: "space explorer",
      hobbies: 'master light saber,fly spaceship',
      physicalActivities: ['Mixed'],
      hoursSpentOnPhysicalActivitiesPerWeek: 4,
      comments: "i am your father"
    },
    diabeticProfile: {
      type: DiabeticType.DT1DT2,
      bloodGlucosePreference: {
        bgUnits: Unit.MilligramPerDeciliter,
        bgClasses: { veryLow: 54, low: 70, target: 180, high: 250, veryHigh: 400 },
        bgBounds:{
          veryHighThreshold: 250,
          targetUpperBound: 180,
          targetLowerBound: 70,
          veryLowThreshold: 54
        }
      },
    },
    settings: {
      a1c: settings?.a1c || { date: new Date().toJSON(), value: 'fakeA1cValue' },
      system: settings?.system
    },
    flagged,
    medicalData,
    hasSentUnreadMessages,
    monitoringAlertsParameters,
    invitationStatus,
    userid: id
  }
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

export function buildTeam(id = 'fakeTeamId', members: TeamMember[] = [], name = 'fake team name', type = TeamType.medical): Team {
  return {
    id,
    name,
    code: '123456789',
    email: 'fale@email.com',
    type,
    members,
    monitoringAlertsParameters: {
      bgUnit: Unit.MilligramPerDeciliter,
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

export function buildTeamMember(
  userId = 'fakeUserId',
  invitationId?: string,
  role: TeamMemberRole = TeamMemberRole.admin,
  email = 'fake@username.com',
  fullName = 'fake full name',
  status = UserInviteStatus.Pending
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
