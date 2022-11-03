import PatientAPI from '../../../lib/patient/patient-api'
import { ITeamMember, TeamMemberRole } from '../../../models/team'
import { UserInvitationStatus } from '../../../models/generic'
import { MonitoringStatus } from '../../../models/monitoring'
import { monitoringParameters, mySecondTeamId, myThirdTeamId } from './mockTeamAPI'

export const unmonitoredPatientId = '1db524f3b65f2'
export const unmonitoredPatientFirstName = 'Unmonitored'
export const unmonitoredPatientLastName = 'Patient'
export const unmonitoredPatientFullName = `${unmonitoredPatientFirstName} ${unmonitoredPatientLastName}`
export const monitoredPatientId = '2db524f3b65f2'
export const monitoredPatientFirstName = 'Monitored'
export const monitoredPatientLastName = 'Patient'
export const monitoredPatientFullName = `${monitoredPatientFirstName} ${monitoredPatientLastName}`

export const monitoredPatient: ITeamMember = {
  userId: monitoredPatientId,
  teamId: mySecondTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: monitoredPatientFirstName,
    fullName: monitoredPatientFullName,
    lastName: monitoredPatientLastName,
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  },
  settings: null,
  preferences: { displayLanguageCode: 'en' },
  invitationStatus: UserInvitationStatus.accepted,
  email: 'ylp.ui.test.patient28@diabeloop.fr',
  idVerified: false,
  unreadMessages: 0,
  alarms: {
    timeSpentAwayFromTargetRate: 0,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 0,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 0,
    nonDataTransmissionActive: false
  },
  monitoring: {
    enabled: true,
    monitoringEnd: new Date(Date.now() - 10000),
    status: MonitoringStatus.accepted,
    parameters: monitoringParameters
  }
}

export const unmonitoredPatient: ITeamMember = {
  userId: unmonitoredPatientId,
  teamId: myThirdTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: unmonitoredPatientFirstName,
    fullName: unmonitoredPatientFullName,
    lastName: unmonitoredPatientLastName,
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  },
  settings: null,
  preferences: { displayLanguageCode: 'en' },
  invitationStatus: UserInvitationStatus.accepted,
  email: 'ylp.ui.test.patient28@diabeloop.fr',
  idVerified: false,
  unreadMessages: 0,
  alarms: {
    timeSpentAwayFromTargetRate: 0,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 0,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 0,
    nonDataTransmissionActive: false
  },
  monitoring: null
}
const monitoredPatientTwo: ITeamMember = {
  userId: monitoredPatientId,
  teamId: myThirdTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: monitoredPatientFirstName,
    fullName: monitoredPatientFullName,
    lastName: monitoredPatientLastName,
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  },
  settings: null,
  preferences: { displayLanguageCode: 'en' },
  invitationStatus: UserInvitationStatus.accepted,
  email: 'ylp.ui.test.patient28@diabeloop.fr',
  idVerified: false,
  unreadMessages: 0,
  alarms: {
    timeSpentAwayFromTargetRate: 0,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 0,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 0,
    nonDataTransmissionActive: false
  },
  monitoring: {
    enabled: true,
    monitoringEnd: new Date(Date.now() - 10000),
    status: MonitoringStatus.accepted,
    parameters: monitoringParameters
  }
}

export const pendingPatient: ITeamMember = {
  userId: '1db524f3b65g4',
  teamId: myThirdTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: 'Pending',
    fullName: 'Pending Patient',
    lastName: 'Patient',
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    trainingAck: { acceptanceTimestamp: '2022-10-11', isAccepted: true }
  },
  settings: null,
  preferences: { displayLanguageCode: 'en' },
  invitationStatus: UserInvitationStatus.pending,
  email: 'ylp.ui.test.patient29@diabeloop.fr',
  idVerified: false,
  unreadMessages: 0,
  alarms: {
    timeSpentAwayFromTargetRate: 0,
    timeSpentAwayFromTargetActive: false,
    frequencyOfSevereHypoglycemiaRate: 0,
    frequencyOfSevereHypoglycemiaActive: false,
    nonDataTransmissionRate: 0,
    nonDataTransmissionActive: false
  },
  monitoring: null
}

export const removePatientMock = jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)
export const mockPatientAPI = () => {
  jest.spyOn(PatientAPI, 'getPatients').mockResolvedValue([monitoredPatient, unmonitoredPatient, monitoredPatientTwo, pendingPatient])
}
