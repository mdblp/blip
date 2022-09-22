import MedicalFilesApi from '../../../lib/medical-files/medical-files-api'
import { monitoredPatientId } from './mockPatientAPI'
import { monitoringParameters } from './mockTeamAPI'

export const mockMedicalFilesAPI = () => {
  jest.spyOn(MedicalFilesApi, 'getWeeklyReports').mockResolvedValue([{
    id: 'weeklyReportMocked',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    parameters: monitoringParameters,
    alarms: {
      timeSpentAwayFromTargetRate: 20,
      timeSpentAwayFromTargetActive: true,
      frequencyOfSevereHypoglycemiaRate: 20,
      frequencyOfSevereHypoglycemiaActive: true,
      nonDataTransmissionRate: 20,
      nonDataTransmissionActive: true
    },
    creationDate: '2022-01-02T08:34:06.898Z'
  }])
  jest.spyOn(MedicalFilesApi, 'getPrescriptions').mockResolvedValue([{
    id: 'prescriptionMocked',
    name: 'patientPrescription',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    prescriptorId: 'prescriptorId',
    link: 'https://linkToPrescription',
    uploadedAt: '2022-01-02T08:34:06.898Z'
  }])
  jest.spyOn(MedicalFilesApi, 'getMedicalRecords').mockResolvedValue([{
    id: 'medicalRecordId',
    authorId: 'authorId',
    creationDate: '2022-01-02T08:34:06.898Z',
    patientId: monitoredPatientId,
    teamId: 'team1234',
    diagnosis: 'whatever diagnosis',
    progressionProposal: 'whatever proposal',
    trainingSubject: 'here is the subject'
  }])
}
