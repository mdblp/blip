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

import { type MonitoringAlerts } from '../../../lib/patient/models/monitoring-alerts.model'
import { type PatientSettings } from '../../../lib/patient/models/patient-settings.model'
import { type Patient, type PatientMetrics } from '../../../lib/patient/models/patient.model'
import { UserInviteStatus } from '../../../lib/team/models/enums/user-invite-status.enum'
import { type ITeamMember } from '../../../lib/team/models/i-team-member.model'
import {
  filtersTeamId,
  monitoringAlertsParameters,
  monitoringAlertsParametersBgUnitMmol,
  myFirstTeamId,
  mySecondTeamId,
  myThirdTeamId,
  NEW_TEAM_ID
} from '../mock/team.api.mock'
import { Gender } from '../../../lib/auth/models/enums/gender.enum'
import { loggedInUserId } from '../mock/auth0.hook.mock'
import { buildPatient, buildPatientMetrics, buildTeamMemberFromPatient } from './patient-builder.data'

export const patient1Id = 'patient1Id'
export const patient2Id = 'patient2Id'
export const patient3Id = 'patient3Id'
export const unreadMessagesPatientId = 'unreadMessagesPatientId'
export const patientWithMmolId = 'patientWithMmolId'
export const timeSpentOutOfTargetRangePatientId = 'timeSpentOutOfTargetRangePatientId'
export const hypoglycemiaPatientId = 'hypoglycemiaPatientId'
export const noDataTransferredPatientId = 'noDataTransferredPatientId'
export const flaggedPatientId = 'flaggedPatientId'
const pendingPatientId = 'pending-patient'

const defaultMonitoringAlertsParameters = monitoringAlertsParameters

const defaultSettings: PatientSettings = {
  system: 'DBLG1'
}

const defaultMonitoringAlerts: MonitoringAlerts = {
  timeSpentAwayFromTargetRate: 10,
  timeSpentAwayFromTargetActive: false,
  frequencyOfSevereHypoglycemiaRate: 20,
  frequencyOfSevereHypoglycemiaActive: false,
  nonDataTransmissionRate: 30,
  nonDataTransmissionActive: false
}

export const patient1Info: Patient = buildPatient({
  userid: patient1Id,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'patient1@diabeloop.fr',
    firstName: 'Patient1',
    fullName: 'Patient1 Groby',
    lastName: 'Groby',
    sex: Gender.Male
  },
  settings: { ...defaultSettings, system: 'DBLG2' }
})

export const patient1Metrics: PatientMetrics = buildPatientMetrics({ userId: patient1Id })

export const unreadMessagesPatientInfo: Patient = buildPatient({
  userid: unreadMessagesPatientId,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'unread-messages@patient.fr',
    firstName: 'Unread',
    lastName: 'Messages Patient',
    fullName: 'Unread Messages Patient',
    sex: Gender.Male
  },
  settings: defaultSettings,
  hasSentUnreadMessages: true
})

const unreadMessagesPatientMetrics: PatientMetrics = buildPatientMetrics({ userId: unreadMessagesPatientId })

export const timeSpentOutOfTargetRangePatientInfo: Patient = buildPatient({
  userid: timeSpentOutOfTargetRangePatientId,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'time-out-of-range@patient.fr',
    firstName: 'Time',
    lastName: 'Out of Range Patient',
    fullName: 'Time Out of Range Patient',
    sex: Gender.Male
  },
  settings: defaultSettings
})

const timeSpentOutOfRangePatientMetrics: PatientMetrics = buildPatientMetrics({
  userId: timeSpentOutOfTargetRangePatientId,
  monitoringAlerts: { ...defaultMonitoringAlerts, timeSpentAwayFromTargetActive: true }
})

export const hypoglycemiaPatientInfo: Patient = buildPatient({
  userid: hypoglycemiaPatientId,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'hypoglycemia@patient.fr',
    firstName: 'Hypoglycemia',
    lastName: 'Patient',
    fullName: 'Hypoglycemia Patient',
    sex: Gender.Female
  },
  settings: defaultSettings
})

export const hypoglycemiaPatientMetrics: PatientMetrics = buildPatientMetrics({
  userId: hypoglycemiaPatientId,
  monitoringAlerts: { ...defaultMonitoringAlerts, frequencyOfSevereHypoglycemiaActive: true },
  medicalData: { range: { startDate: '1980-01-01T10:44:34+01:00', endDate: '2023-01-01T10:44:34+01:00' } }
})

export const noDataTransferredPatientInfo: Patient = buildPatient({
  userid: noDataTransferredPatientId,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'z-no-data@patient.fr',
    firstName: 'Z - No Data',
    lastName: 'Patient',
    fullName: 'Z - No Data Patient',
    sex: Gender.Female
  },
  settings: defaultSettings
})

const noDataTransferredPatientMetrics: PatientMetrics = buildPatientMetrics({
  userId: noDataTransferredPatientId,
  monitoringAlerts: {
    nonDataTransmissionActive: true,
    nonDataTransmissionRate: 100,
    timeSpentAwayFromTargetActive: false,
    timeSpentAwayFromTargetRate: null,
    frequencyOfSevereHypoglycemiaActive: false,
    frequencyOfSevereHypoglycemiaRate: null
  }
})

export const flaggedPatientInfo: Patient = buildPatient({
  userid: flaggedPatientId,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'flagged@patient.fr',
    firstName: 'Flagged',
    lastName: 'Patient',
    fullName: 'Flagged Patient',
    sex: Gender.Female
  },
  settings: defaultSettings,
  flagged: true
})

const flaggedPatientMetrics: PatientMetrics = buildPatientMetrics({ userId: flaggedPatientId })

export const patient2Info: Patient = buildPatient({
  userid: patient2Id,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'patient2@diabeloop.fr',
    firstName: 'Patient2',
    fullName: 'Patient2 Rouis',
    lastName: 'Rouis',
    sex: Gender.Female
  },
  settings: { ...defaultSettings, a1c: { value: '8.9', date: '2023-11-21T12:30:38.473Z' } }
})

const patient2Metrics: PatientMetrics = buildPatientMetrics({ userId: patient2Id })

export const patient3Info: Patient = buildPatient({
  userid: patient3Id,
  monitoringAlertsParameters: defaultMonitoringAlertsParameters,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'patient3@diabeloop.fr',
    firstName: 'Patient3',
    lastName: 'Srairi',
    fullName: 'Patient3 Srairi',
    sex: Gender.Male
  },
  settings: defaultSettings
})

const patient3Metrics: PatientMetrics = buildPatientMetrics({ userId: patient3Id })

export const patientWithMmolInfo: Patient = buildPatient({
  userid: patientWithMmolId,
  monitoringAlertsParameters: monitoringAlertsParametersBgUnitMmol,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'patient-mmol@diabeloop.fr',
    firstName: 'PatientMmol',
    lastName: 'Perotto',
    fullName: 'PatientMmol Perotto',
    sex: Gender.Male
  },
  settings: defaultSettings
})

const patientWithMmolMetrics: PatientMetrics = buildPatientMetrics({ userId: patientWithMmolId })

export const pendingPatient: Patient = buildPatient({
  userid: pendingPatientId,
  monitoringAlertsParameters: undefined,
  profile: {
    birthdate: '1980-01-01T10:44:34+01:00',
    email: 'pending-patient@diabeloop.fr',
    firstName: 'Pending',
    fullName: 'Pending Patient',
    lastName: 'Patient',
    sex: Gender.Female
  },
  settings: { ...defaultSettings, a1c: { value: '8.3', date: '2022-12-16T08:18:38.473Z' } }
})

const pendingPatientMetrics: PatientMetrics = buildPatientMetrics({ userId: pendingPatientId })

export const patient1AsTeamMember: ITeamMember = buildTeamMemberFromPatient(patient1Info, patient1Metrics, mySecondTeamId, UserInviteStatus.Accepted)
export const patient2AsTeamMember: ITeamMember = buildTeamMemberFromPatient(patient2Info, patient2Metrics, myThirdTeamId, UserInviteStatus.Accepted)
export const patient3AsTeamMember: ITeamMember = buildTeamMemberFromPatient(patient3Info, patient3Metrics, myThirdTeamId, UserInviteStatus.Accepted)
export const pendingPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(pendingPatient, pendingPatientMetrics, mySecondTeamId, UserInviteStatus.Pending)

export const PATIENTS_INFO_BY_TEAMID: Record<string, Patient[]> = {
  private: [],
  [NEW_TEAM_ID]: [],
  [myFirstTeamId]: [],
  [mySecondTeamId]: [
    {
      ...patient1Info,
      invitationStatus: UserInviteStatus.Accepted
    }, {
      ...pendingPatient,
      invitationStatus: UserInviteStatus.Pending
    }
  ],
  [myThirdTeamId]: [
    {
      ...patient1Info,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...patient2Info,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...patient3Info,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...patientWithMmolInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...noDataTransferredPatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...pendingPatient,
      invitationStatus: UserInviteStatus.Pending,
      invite: {
        id: 'fakeInviteId',
        creatorId: loggedInUserId,
        creationDate: '2023-05-17T11:37:42.638Z'
      }
    }
  ],
  [filtersTeamId]: [
    {
      ...patient1Info,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...unreadMessagesPatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...timeSpentOutOfTargetRangePatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...hypoglycemiaPatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...noDataTransferredPatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...flaggedPatientInfo,
      invitationStatus: UserInviteStatus.Accepted
    },
    {
      ...pendingPatient,
      invitationStatus: UserInviteStatus.Pending
    }
  ]
}

export const PATIENTS_METRICS_BY_TEAMID: Record<string, PatientMetrics[]> = {
  [myFirstTeamId]: [],
  [mySecondTeamId]: [patient1Metrics],
  [myThirdTeamId]: [
    patient1Metrics,
    patient2Metrics,
    patient3Metrics,
    patientWithMmolMetrics,
    noDataTransferredPatientMetrics
  ],
  [filtersTeamId]: [
    patient1Metrics,
    unreadMessagesPatientMetrics,
    timeSpentOutOfRangePatientMetrics,
    hypoglycemiaPatientMetrics,
    noDataTransferredPatientMetrics,
    flaggedPatientMetrics
  ]
}
