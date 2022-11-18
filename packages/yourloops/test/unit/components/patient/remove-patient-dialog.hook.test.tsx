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
