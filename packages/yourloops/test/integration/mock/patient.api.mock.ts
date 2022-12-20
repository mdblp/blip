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

import { Alarms } from '../../../lib/patient/models/alarms.model'
import { PatientMetadata } from '../../../lib/patient/models/patient-metadata.model'
import { PatientProfile } from '../../../lib/patient/models/patient-profile.model'
import { PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { PatientTeam } from '../../../lib/patient/models/patient-team.model'
import { Patient } from '../../../lib/patient/models/patient.model'
import { MonitoringStatus } from '../../../lib/team/models/enums/monitoring-status.enum'
import { TeamMemberRole } from '../../../lib/team/models/enums/team-member-role.enum'
import { UserInvitationStatus } from '../../../lib/team/models/enums/user-invitation-status.enum'
import { ITeamMember } from '../../../lib/team/models/i-team-member.model'
import { Monitoring } from '../../../lib/team/models/monitoring.model'
import { monitoringParameters, mySecondTeamId, myThirdTeamId } from './mockTeamAPI'
import PatientApi from '../../../lib/patient/patient.api'
import { Profile } from '../../../lib/auth/models/profile.model'

export const unmonitoredPatientId = 'unmonitoredPatientId'
export const monitoredPatientId = 'monitoredPatientId'

const defaultMonitoring: Monitoring = {
  enabled: true,
  monitoringEnd: new Date(Date.now() - 10000),
  status: MonitoringStatus.accepted,
  parameters: monitoringParameters
}

const defaultSettings: PatientSettings = {
  system: 'DBLG1'
}

const defaultMetadata: PatientMetadata = {
  hasSentUnreadMessages: false
}

const defaultAlarm: Alarms = {
  timeSpentAwayFromTargetRate: 0,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 0,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 0,
  nonDataTransmissionActive: false
}

export const buildPatient = (
  userid = 'fakePatientId',
  teams: PatientTeam[] = [],
  monitoring: Monitoring | undefined = undefined,
  profile: Partial<PatientProfile> = undefined,
  settings: Partial<PatientSettings> = undefined,
  metadata: Partial<PatientMetadata> = undefined,
  alarms: Partial<Alarms> = undefined
): Patient => {
  return {
    alarms: {
      timeSpentAwayFromTargetRate: alarms?.timeSpentAwayFromTargetRate || 10,
      timeSpentAwayFromTargetActive: alarms?.timeSpentAwayFromTargetActive || false,
      frequencyOfSevereHypoglycemiaRate: alarms?.frequencyOfSevereHypoglycemiaRate || 20,
      frequencyOfSevereHypoglycemiaActive: alarms?.frequencyOfSevereHypoglycemiaActive || false,
      nonDataTransmissionRate: alarms?.nonDataTransmissionRate || 30,
      nonDataTransmissionActive: alarms?.nonDataTransmissionActive || false
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
    monitoring,
    teams,
    userid
  }
}

export const monitoredPatient: Patient = buildPatient(
  monitoredPatientId,
  [
    {
      teamId: mySecondTeamId,
      status: UserInvitationStatus.accepted,
      monitoringStatus: MonitoringStatus.accepted
    }
  ],
  defaultMonitoring,
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
  defaultAlarm
)

export const unmonitoredPatient: Patient = buildPatient(
  unmonitoredPatientId,
  [
    {
      teamId: myThirdTeamId,
      status: UserInvitationStatus.accepted
    }
  ],
  undefined,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'unmonitored-patient@diabeloop.fr',
    firstName: 'Unmonitored',
    fullName: 'Unmonitored Patient',
    lastName: 'Patient',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  defaultAlarm
)

export const monitoredPatientTwo: Patient = buildPatient(
  'monitored-patient-two',
  [
    {
      teamId: myThirdTeamId,
      status: UserInvitationStatus.accepted,
      monitoringStatus: MonitoringStatus.accepted
    }
  ],
  defaultMonitoring,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'monitored-patient2@diabeloop.fr',
    firstName: 'Monitored',
    fullName: 'Patient 2',
    lastName: 'Monitored Patient 2',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  defaultAlarm
)

export const pendingPatient: Patient = buildPatient(
  'pending-patient',
  [
    {
      teamId: myThirdTeamId,
      status: UserInvitationStatus.pending
    }
  ],
  undefined,
  {
    birthdate: new Date('1980-01-01T10:44:34+01:00'),
    email: 'pending-patient@diabeloop.fr',
    firstName: 'Pending',
    fullName: 'Pending Patient',
    lastName: 'Patient',
    sex: 'M'
  },
  defaultSettings,
  defaultMetadata,
  defaultAlarm
)

export const buildTeamMemberFromPatient = (patient: Patient): ITeamMember => {
  return {
    userId: patient.userid,
    teamId: patient.teams[0].teamId,
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
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: patient.teams[0].status,
    email: patient.profile.email,
    idVerified: false,
    unreadMessages: patient.metadata.hasSentUnreadMessages ? 1 : 0,
    alarms: patient.alarms,
    monitoring: patient.monitoring
  }
}

export const monitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatient)
export const unmonitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(unmonitoredPatient)
const monitoredPatientTwoAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatientTwo)
export const pendingPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(pendingPatient)

export const mockPatientApiForPatients = () => {
  jest.spyOn(PatientApi, 'getPatients').mockResolvedValue([monitoredPatientAsTeamMember, unmonitoredPatientAsTeamMember, monitoredPatientTwoAsTeamMember, pendingPatientAsTeamMember])
}
export const mockPatientApiForHcp = () => {
  jest.spyOn(PatientApi, 'getPatientsForHcp').mockResolvedValue([monitoredPatient, unmonitoredPatient, monitoredPatientTwo, pendingPatient])
}

export const buildPatientAsTeamMember = (member: Partial<ITeamMember>): ITeamMember => {
  return {
    userId: member.userId ?? 'fakeUserId',
    teamId: member.teamId ?? 'fakeUserTeamId',
    role: TeamMemberRole.patient,
    profile: {
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
    alarms: member.alarms,
    monitoring: member.monitoring
  }
}
