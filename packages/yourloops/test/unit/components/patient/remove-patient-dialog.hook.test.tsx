import { act, renderHook } from '@testing-library/react-hooks'
import useRemovePatientDialog from '../../../../components/patient/remove-patient-dialog.hook'
import PatientAPI from '../../../../lib/patient/patient-api'
import { Patient, PatientTeam } from '../../../../lib/data/patient'
import { UserInvitationStatus } from '../../../../models/generic'
import * as usePatientContextMock from '../../../../lib/patient/provider'
import * as teamHookMock from '../../../../lib/team'
import * as alertMock from '../../../../components/utils/snackbar'
import { buildPrivateTeam, buildTeam } from '../../common/utils'
import { Team } from '../../../../lib/team'

jest.mock('../../../../lib/patient/provider')
jest.mock('../../../../lib/team')
jest.mock('../../../../components/utils/snackbar')
describe('Remove patient dialog hook', () => {
  let patientTeam: PatientTeam
  let patient: Patient
  let team: Team

  const removePatientMock = jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)
  const onClose = jest.fn()
  const onSuccessMock = jest.fn()

  beforeEach(() => {
    (usePatientContextMock.usePatientContext as jest.Mock).mockImplementation(() => ({
      removePatient: removePatientMock
    }));
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => ({
      getTeam: () => team
    }));
    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      success: onSuccessMock,
      error: jest.fn()
    }))
  })

  function createDataMock(invitationStatus: UserInvitationStatus, teamId = 'teamId') {
    team = teamId === 'private' ? buildPrivateTeam() : buildTeam(teamId)
    patientTeam = { status: invitationStatus, teamId }
    patient = {
      teams: [patientTeam],
      profile: { firstName: 'alain', lastName: 'tolerant' }
    } as Patient
  }

  it('should show success alert when removing a pending patient', async () => {
    createDataMock(UserInvitationStatus.pending)
    const { result } = renderHook(() => useRemovePatientDialog({ patient, onClose }))
    await act(async () => {
      await result.current.handleOnClickRemove()
    })
    expect(removePatientMock).toHaveBeenCalledWith(patient, patientTeam)
    expect(onSuccessMock).toHaveBeenCalledWith('alert-remove-patient-pending-invitation-success')
  })

  it('should show success alert when removing a patient from a team', async () => {
    createDataMock(UserInvitationStatus.accepted)
    const { result } = renderHook(() => useRemovePatientDialog({ patient, onClose }))
    await result.current.handleOnClickRemove()
    expect(removePatientMock).toHaveBeenCalledWith(patient, patientTeam)
    expect(onSuccessMock).toHaveBeenCalledWith('alert-remove-patient-from-team-success')
  })

  it('should show success alert when removing a private practice patient', async () => {
    createDataMock(UserInvitationStatus.accepted, 'private')
    const { result } = renderHook(() => useRemovePatientDialog({ patient, onClose }))
    await result.current.setSelectedTeamId('private')
    await result.current.handleOnClickRemove()
    expect(removePatientMock).toHaveBeenCalledWith(patient, patientTeam)
    expect(onSuccessMock).toHaveBeenCalledWith('alert-remove-private-practice-success')
  })
})
