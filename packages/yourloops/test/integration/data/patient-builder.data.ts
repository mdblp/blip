/*
 * Copyright (c) 2023, Diabeloop
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
import { type MedicalData } from '../../../lib/data/models/medical-data.model'
import { type Patient, type PatientMetrics } from '../../../lib/patient/models/patient.model'
import { type GlycemiaIndicators } from '../../../lib/patient/models/glycemia-indicators.model'
import { type MonitoringAlertsParameters } from '../../../lib/team/models/monitoring-alerts-parameters.model'
import { type PatientProfile } from '../../../lib/patient/models/patient-profile.model'
import { type PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { Gender } from '../../../lib/auth/models/enums/gender.enum'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { type ITeamMember } from '../../../lib/team/models/i-team-member.model'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { LanguageCodes } from '../../../lib/auth/models/enums/language-codes.enum'
import { type Profile } from '../../../lib/auth/models/profile.model'

const defaultGlycemiaIndicators: GlycemiaIndicators = {
  timeInRange: 0,
  glucoseManagementIndicator: null,
  coefficientOfVariation: null,
  hypoglycemia: 0
}

const defaultMedicalData = { range: { startDate: '', endDate: '' } }

export const buildPatient = (params: {
  userid: string
  monitoringAlertsParameters?: MonitoringAlertsParameters
  profile?: Partial<PatientProfile>
  settings?: Partial<PatientSettings>
  flagged?: boolean
  hasSentUnreadMessages?: boolean
}): Patient => {
  return {
    profile: {
      birthdate: params.profile?.birthdate || new Date().toString(),
      firstName: params.profile?.firstName || 'fakeFirstname',
      fullName: params.profile?.fullName || 'fakePatientFullName',
      lastName: params.profile?.lastName || 'fakeLastname',
      email: params.profile?.email || 'fake@email.com',
      sex: params.profile?.sex || Gender.Male
    },
    settings: {
      a1c: params.settings?.a1c || { date: '2023-05-26T12:28:36.047Z', value: 'fakeA1cValue' },
      system: params.settings?.system
    },
    flagged: params.flagged,
    hasSentUnreadMessages: params.hasSentUnreadMessages || false,
    monitoringAlertsParameters: params.monitoringAlertsParameters,
    invitationStatus: UserInviteStatus.Accepted,
    userid: params.userid
  }
}

export const buildPatientMetrics = (params: {
  userId: string
  monitoringAlerts?: Partial<MonitoringAlerts>
  medicalData?: Partial<MedicalData>
}): PatientMetrics => {
  const timeSpentAwayFromTargetRate = params.monitoringAlerts?.timeSpentAwayFromTargetRate
  const frequencyOfSevereHypoglycemiaRate = params.monitoringAlerts?.frequencyOfSevereHypoglycemiaRate
  const nonDataTransmissionRate = params.monitoringAlerts?.nonDataTransmissionRate

  return {
    userid: params.userId,
    monitoringAlerts: {
      timeSpentAwayFromTargetRate: timeSpentAwayFromTargetRate !== undefined ? timeSpentAwayFromTargetRate : 10,
      timeSpentAwayFromTargetActive: params.monitoringAlerts?.timeSpentAwayFromTargetActive || false,
      frequencyOfSevereHypoglycemiaRate: frequencyOfSevereHypoglycemiaRate !== undefined ? frequencyOfSevereHypoglycemiaRate : 20,
      frequencyOfSevereHypoglycemiaActive: params.monitoringAlerts?.frequencyOfSevereHypoglycemiaActive || false,
      nonDataTransmissionRate: nonDataTransmissionRate !== undefined ? nonDataTransmissionRate : 30,
      nonDataTransmissionActive: params.monitoringAlerts?.nonDataTransmissionActive || false
    },
    glycemiaIndicators: defaultGlycemiaIndicators,
    medicalData: params.medicalData || defaultMedicalData
  }
}

export const buildTeamMemberFromPatient = (patient: Patient, metrics: PatientMetrics, teamId: string, invitationStatus: UserInviteStatus): ITeamMember => {
  return {
    userId: patient.userid,
    teamId,
    role: TeamMemberRole.patient,
    profile: {
      email: patient.profile.email,
      firstName: patient.profile.firstName,
      fullName: patient.profile.fullName,
      lastName: patient.profile.lastName,
      patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
      privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
      trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
    },
    settings: null,
    preferences: { displayLanguageCode: LanguageCodes.En },
    invitationStatus,
    email: patient.profile.email,
    idVerified: false,
    unreadMessages: patient.hasSentUnreadMessages ? 1 : 0,
    alarms: metrics?.monitoringAlerts,
    glycemiaIndicators: metrics?.glycemiaIndicators,
    medicalData: metrics?.medicalData
  }
}

export const buildPatientAsTeamMember = (member: Partial<ITeamMember>): ITeamMember => {
  return {
    userId: member.userId ?? 'fakeUserId',
    teamId: member.teamId ?? 'fakeUserTeamId',
    role: TeamMemberRole.patient,
    profile: {
      email: member.profile.email,
      firstName: member.profile.firstName ?? 'fakeFirstName',
      fullName: member.profile.fullName ?? 'fakeFullName',
      lastName: member.profile.lastName ?? 'fakeLastName',
      patient: {
        birthday: member.profile.patient.birthday ?? '1980-01-01T10:44:34+01:00',
        diagnosisType: member.profile.patient.diagnosisType ?? 'type1'
      },
      privacyPolicy: {
        acceptanceTimestamp: member.profile.privacyPolicy?.acceptanceTimestamp ?? '2021-05-22',
        isAccepted: member.profile.privacyPolicy?.isAccepted ?? true
      },
      termsOfUse: {
        acceptanceTimestamp: member.profile.termsOfUse?.acceptanceTimestamp ?? '2021-05-22',
        isAccepted: member.profile.termsOfUse?.isAccepted ?? true
      },
      trainingAck: {
        acceptanceTimestamp: member.profile.trainingAck?.acceptanceTimestamp ?? '2022-10-11',
        isAccepted: member.profile.trainingAck?.isAccepted ?? true
      }
    } as Profile,
    settings: member.settings,
    preferences: member.preferences,
    invitationStatus: member.invitationStatus ?? UserInviteStatus.Accepted,
    email: member.email ?? 'fake@patient.email',
    idVerified: member.idVerified ?? true,
    unreadMessages: member.unreadMessages ?? 0,
    alarms: member.alarms,
    glycemiaIndicators: member.glycemiaIndicators,
    medicalData: member.medicalData || { range: { startDate: '', endDate: '' } }
  }
}
