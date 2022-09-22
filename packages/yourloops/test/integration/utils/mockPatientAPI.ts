import PatientAPI from '../../../lib/patient/patient-api'
import { ITeamMember, TeamMemberRole } from '../../../models/team'
import { UserInvitationStatus } from '../../../models/generic'
import { MonitoringStatus } from '../../../models/monitoring'
import { monitoringParameters, mySecondTeamId, myThirdTeamId } from './mockTeamAPI'

export const patientNonMonitoredId = '1db524f3b65f2'
export const patientNonMonitoredFirstName = 'Non monitored'
export const patientNonMonitoredLastName = 'Patient'
export const patientNonMonitoredFullName = `${patientNonMonitoredFirstName} ${patientNonMonitoredLastName}`
export const patientMonitoredId = '2db524f3b65f2'
export const patientMonitoredFirstName = 'Monitored'
export const patientMonitoredLastName = 'Patient'
export const patientMonitoredFullName = `${patientMonitoredFirstName} ${patientMonitoredLastName}`

export const monitoredPatient: ITeamMember = {
  userId: patientMonitoredId,
  teamId: mySecondTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: patientMonitoredFirstName,
    fullName: patientMonitoredFullName,
    lastName: patientMonitoredLastName,
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
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

export const unMonitoredPatient: ITeamMember = {
  userId: patientNonMonitoredId,
  teamId: myThirdTeamId,
  role: TeamMemberRole.patient,
  profile: {
    firstName: patientNonMonitoredFirstName,
    fullName: patientNonMonitoredFullName,
    lastName: patientNonMonitoredLastName,
    patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' },
    privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true },
    termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true }
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

export const removePatientMock = jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)
export const mockPatientAPI = () => {
  jest.spyOn(PatientAPI, 'getPatients').mockResolvedValue([monitoredPatient, unMonitoredPatient])
}
