import PatientAPI from '../../../lib/patient/patient-api'
import { ITeamMember, TeamMemberRole } from '../../../models/team'
import { UserInvitationStatus } from '../../../models/generic'
import { Monitoring, MonitoringStatus } from '../../../models/monitoring'
import { monitoringParameters, mySecondTeamId, myThirdTeamId } from './mockTeamAPI'
import { Patient, PatientMetadata, PatientProfile, PatientSettings, PatientTeam } from '../../../lib/data/patient'
import { Alarm } from '../../../models/alarm'

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
  unreadMessagesSent: 0
}

const defaultAlarm: Alarm = {
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
  alarms: Partial<Alarm> = undefined
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
      unreadMessagesSent: metadata?.unreadMessagesSent || 0
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
    unreadMessages: patient.metadata.unreadMessagesSent,
    alarms: patient.alarms,
    monitoring: patient.monitoring
  }
}

export const monitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatient)
export const unmonitoredPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(unmonitoredPatient)
const monitoredPatientTwoAsTeamMember: ITeamMember = buildTeamMemberFromPatient(monitoredPatientTwo)
export const pendingPatientAsTeamMember: ITeamMember = buildTeamMemberFromPatient(pendingPatient)

export const mockPatientAPIForPatients = () => {
  jest.spyOn(PatientAPI, 'getPatients').mockResolvedValue([monitoredPatientAsTeamMember, unmonitoredPatientAsTeamMember, monitoredPatientTwoAsTeamMember, pendingPatientAsTeamMember])
}
export const mockPatientAPIForHcp = () => {
  jest.spyOn(PatientAPI, 'getPatientsForHcp').mockResolvedValue([monitoredPatient, unmonitoredPatient, monitoredPatientTwo, pendingPatient])
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
    },
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
