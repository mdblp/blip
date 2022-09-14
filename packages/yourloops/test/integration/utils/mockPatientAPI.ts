import PatientAPI from '../../../lib/patient/patient-api'
import { TeamMemberRole } from '../../../models/team'
import { UserInvitationStatus } from '../../../models/generic'
import { UNITS_TYPE } from '../../../lib/units/utils'
import { MIN_HIGH_BG, MIN_LOW_BG, MIN_VERY_LOW_BG } from '../../../components/alarm/alarms-content-configuration'
import { MonitoringStatus } from '../../../models/monitoring'

export const mockPatientAPI = (patientId: string, isMonitored: boolean) => {
  jest.spyOn(PatientAPI, 'getPatients').mockResolvedValue([{
    userId: patientId,
    teamId: '62fe00defc9374b2fed32bcd',
    role: TeamMemberRole.patient,
    profile: { firstName: 'Yourloops UI 28', fullName: 'Yourloops UI 28 Patient 1', lastName: 'Patient 1', patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' }, privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true }, termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true } },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.patient28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0,
    alarms: { timeSpentAwayFromTargetRate: 0, timeSpentAwayFromTargetActive: false, frequencyOfSevereHypoglycemiaRate: 0, frequencyOfSevereHypoglycemiaActive: false, nonDataTransmissionRate: 0, nonDataTransmissionActive: false },
    monitoring: isMonitored ? {
      enabled: true,
      monitoringEnd: new Date(Date.now() + 10000),
      status: MonitoringStatus.accepted,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7
      }
    } : null
  }, {
    userId: patientId,
    teamId: '62fe00defc9374b2fed32bce',
    role: TeamMemberRole.patient,
    profile: { firstName: 'Yourloops UI 28', fullName: 'Yourloops UI 28 Patient 1', lastName: 'Patient 1', patient: { birthday: '1980-01-01T10:44:34+01:00', diagnosisType: 'type1' }, privacyPolicy: { acceptanceTimestamp: '2021-05-22', isAccepted: true }, termsOfUse: { acceptanceTimestamp: '2021-05-22', isAccepted: true } },
    settings: null,
    preferences: { displayLanguageCode: 'en' },
    invitationStatus: UserInvitationStatus.accepted,
    email: 'ylp.ui.test.patient28@diabeloop.fr',
    idVerified: false,
    unreadMessages: 0,
    alarms: { timeSpentAwayFromTargetRate: 0, timeSpentAwayFromTargetActive: false, frequencyOfSevereHypoglycemiaRate: 0, frequencyOfSevereHypoglycemiaActive: false, nonDataTransmissionRate: 0, nonDataTransmissionActive: false },
    monitoring: isMonitored ? {
      enabled: true,
      monitoringEnd: new Date(Date.now() + 10000),
      status: MonitoringStatus.accepted,
      parameters: {
        bgUnit: UNITS_TYPE.MGDL,
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7
      }
    } : null
  }])
}
