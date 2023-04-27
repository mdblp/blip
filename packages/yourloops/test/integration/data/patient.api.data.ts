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
import { type PatientMetadata } from '../../../lib/patient/models/patient-metadata.model'
import { type PatientProfile } from '../../../lib/patient/models/patient-profile.model'
import { type PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { type Patient } from '../../../lib/patient/models/patient.model'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { UserInvitationStatus } from '../../../lib/team/models/enums/user-invitation-status.enum'
import { type ITeamMember } from '../../../lib/team/models/i-team-member.model'
import { type Profile } from '../../../lib/auth/models/profile.model'
import { LanguageCodes } from '../../../lib/auth/models/enums/language-codes.enum'
import {
  filtersTeamId,
  monitoringAlertsParameters,
  monitoringAlertsParametersBgUnitMmol,
  mySecondTeamId,
  myTeamId,
  myThirdTeamId
} from '../mock/team.api.mock'
import { type MonitoringAlertsParameters } from '../../../lib/team/models/monitoring-alerts-parameters.model'

export const unmonitoredPatientId = 'unmonitoredPatientId'
export const monitoredPatientId = 'monitoredPatientId'
export const unreadMessagesPatientId = 'unreadMessagesPatientId'
export const monitoredPatientWithMmolId = 'monitoredPatientWithMmolId'
export const timeSpentOutOfTargetRangePatientId = 'timeSpentOutOfTargetRangePatientId'
export const hypoglycemiaPatientId = 'hypoglycemiaPatientId'
export const noDataTransferredPatientId = 'noDataTransferredPatientId'
export const flaggedPatientId = 'flaggedPatientId'

const defaultMonitoringAlertsParameters = monitoringAlertsParameters

const defaultSettings: PatientSettings = {
  system: 'DBLG1'
}

const defaultMetadata: PatientMetadata = {
  hasSentUnreadMessages: false
}

const defaultMonitoringAlert: MonitoringAlerts = {
  timeSpentAwayFromTargetRate: 0,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 0,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 0,
  nonDataTransmissionActive: false
}

export const buildPatient = (
  userid = 'fakePatientId',
  monitoringAlertsParameters: MonitoringAlertsParameters | undefined = undefined,
  profile: Partial<PatientProfile> = undefined,
  settings: Partial<PatientSettings> = undefined,
  metadata: Partial<PatientMetadata> = undefined,
  monitoringAlerts: Partial<MonitoringAlerts> = undefined
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
      flagged: metadata?.flagged,
      medicalData: metadata?.medicalData || null,
      hasSentUnreadMessages: metadata?.hasSentUnreadMessages || false
    },
    monitoringAlertsParameters,
    invitationStatus: UserInvitationStatus.accepted,
    userid
  }
}

export const monitoredPatient: Patient = buildPatient(
  monitoredPatientId,
  defaultMonitoringAlertsParameters,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'monitored-patient@diabeloop.fr',
    firstName: 'Monitored',
    fullName: 'Monitored Patient',
    lastName: 'Patient',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  defaultMonitoringAlert
)

export const unreadMessagesPatient: Patient = buildPatient(
  unreadMessagesPatientId,
  null,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'unread-messages@patient.fr',
    firstName: 'Unread',
    lastName: 'Messages Patient',
    fullName: 'Unread Messages Patient',
    sex: 'M'
  },
  defaultSettings,
  { hasSentUnreadMessages: true },
  defaultMonitoringAlert
)

export const timeSpentOutOfTargetRangePatient: Patient = buildPatient(
  timeSpentOutOfTargetRangePatientId,
  null,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'time-out-of-range@patient.fr',
    firstName: 'Time',
    lastName: 'Out of Range Patient',
    fullName: 'Time Out of Range Patient',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  { ...defaultMonitoringAlert, timeSpentAwayFromTargetActive: true }
)

export const hypoglycemiaPatient: Patient = buildPatient(
  hypoglycemiaPatientId,
  null,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'hypoglycemia@patient.fr',
    firstName: 'Hypoglycemia',
    lastName: 'Patient',
    fullName: 'Hypoglycemia Patient',
    sex: 'F'
  },
  defaultSettings,
  defaultMetadata,
  { ...defaultMonitoringAlert, frequencyOfSevereHypoglycemiaActive: true }
)

export const noDataTransferredPatient: Patient = buildPatient(
  noDataTransferredPatientId,
  null,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'no-data@patient.fr',
    firstName: 'No Data',
    lastName: 'Patient',
    fullName: 'No Data Patient',
    sex: 'F'
  },
  defaultSettings,
  defaultMetadata,
  { ...defaultMonitoringAlert, nonDataTransmissionActive: true }
)

export const flaggedPatient: Patient = buildPatient(
  flaggedPatientId,
  null,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'flagged@patient.fr',
    firstName: 'Flagged',
    lastName: 'Patient',
    fullName: 'Flagged Patient',
    sex: 'F'
  },
  defaultSettings,
  { ...defaultMetadata, flagged: true },
  defaultMonitoringAlert
)

export const unmonitoredPatient: Patient = buildPatient(
  unmonitoredPatientId,
  undefined,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'unmonitored-patient@diabeloop.fr',
    firstName: 'Unmonitored',
    fullName: 'Unmonitored Patient',
    lastName: 'Patient',
    sex: 'M'
  },
  { ...defaultSettings, a1c: { value: '8.9', date: '2023-11-21T12:30:38.473Z' } },
  defaultMetadata,
  defaultMonitoringAlert
)

export const monitoredPatientTwo: Patient = buildPatient(
  'monitored-patient-two',
  defaultMonitoringAlertsParameters,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'monitored-patient2@diabeloop.fr',
    firstName: 'Monitored',
    lastName: 'Patient 2',
    fullName: 'Monitored Patient 2',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  defaultMonitoringAlert
)

export const monitoredPatientWithMmol: Patient = buildPatient(
  monitoredPatientWithMmolId,
  monitoringAlertsParametersBgUnitMmol,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'monitored-patient-mmol@diabeloop.fr',
    firstName: 'Monitored',
    lastName: 'Patient mmol',
    fullName: 'Monitored Patient mmol',
    sex: 'F'
  },
  defaultSettings,
  defaultMetadata,
  defaultMonitoringAlert
)

export const pendingPatient: Patient = buildPatient(
  'pending-patient',
  undefined,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'pending-patient@diabeloop.fr',
    firstName: 'Pending',
    fullName: 'Pending Patient',
    lastName: 'Patient',
    sex: 'F',
    referringDoctor: 'Doc Eur'
  },
  { ...defaultSettings, a1c: { value: '8.3', date: '2022-12-16T08:18:38.473Z' } },
  defaultMetadata,
  defaultMonitoringAlert
)

export const buildTeamMemberFromPatient = (patient: Patient, teamId: string, invitationStatus: UserInvitationStatus): ITeamMember => {
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
    unreadMessages: patient.metadata.hasSentUnreadMessages ? 1 : 0,
    alarms: patient.monitoringAlerts
  }
}

export const monitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatient, mySecondTeamId, UserInvitationStatus.accepted)
export const unmonitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(unmonitoredPatient, myThirdTeamId, UserInvitationStatus.accepted)
export const monitoredPatientTwoAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatientTwo, myThirdTeamId, UserInvitationStatus.accepted)
export const pendingPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(pendingPatient, mySecondTeamId, UserInvitationStatus.pending)

export const PATIENTS_BY_TEAMID: Record<string, Patient[]> = {
  [myTeamId]: [],
  [mySecondTeamId]: [
    {
      ...monitoredPatient,
      invitationStatus: UserInvitationStatus.accepted
    }, {
      ...pendingPatient,
      invitationStatus: UserInvitationStatus.pending
    }
  ],
  [myThirdTeamId]: [
    {
      ...monitoredPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...unmonitoredPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...monitoredPatientTwo,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...monitoredPatientWithMmol,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...pendingPatient,
      invitationStatus: UserInvitationStatus.pending
    }
  ],
  [filtersTeamId]: [
    {
      ...monitoredPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...unreadMessagesPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...timeSpentOutOfTargetRangePatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...hypoglycemiaPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...noDataTransferredPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...flaggedPatient,
      invitationStatus: UserInvitationStatus.accepted
    },
    {
      ...pendingPatient,
      invitationStatus: UserInvitationStatus.pending
    }
  ]
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
    invitationStatus: member.invitationStatus ?? UserInvitationStatus.accepted,
    email: member.email ?? 'fake@patient.email',
    idVerified: member.idVerified ?? true,
    unreadMessages: member.unreadMessages ?? 0,
    alarms: member.alarms
  }
}
