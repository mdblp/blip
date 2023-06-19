/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { renderHook } from '@testing-library/react'
import useRemovePatientDialog from '../../../../components/patient/remove-patient-dialog/remove-patient-dialog.hook'
import PatientAPI from '../../../../lib/patient/patient.api'
import * as usePatientContextMock from '../../../../lib/patient/patients.provider'
import * as teamHookMock from '../../../../lib/team'
import { type Team } from '../../../../lib/team'
import * as selectedTeamHookMock from '../../../../lib/selected-team/selected-team.provider'
import * as alertMock from '../../../../components/utils/snackbar'
import { buildPrivateTeam, buildTeam } from '../../common/utils'
import { type Patient } from '../../../../lib/patient/models/patient.model'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { TeamType } from '../../../../lib/team/models/enums/team-type.enum'

jest.mock('../../../../lib/patient/patients.provider')
jest.mock('../../../../lib/team')
jest.mock('../../../../components/utils/snackbar')
jest.mock('../../../../lib/selected-team/selected-team.provider')
describe('Remove patient dialog hook', () => {
  let patient: Patient
  let team: Team
  jest.spyOn(PatientAPI, 'removePatient').mockResolvedValue(undefined)

  const removePatientMock = jest.fn()
  const onClose = jest.fn()
  const onSuccessMock = jest.fn()
  const isPrivateMock = jest.fn()

  beforeEach(() => {
    (usePatientContextMock.usePatientsContext as jest.Mock).mockImplementation(() => ({
      removePatient: removePatientMock
    }));
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => ({
      getTeam: () => team,
      isPrivate: isPrivateMock
    }));
    (alertMock.useAlert as jest.Mock).mockImplementation(() => ({
      success: onSuccessMock,
      error: jest.fn()
    }));
    (selectedTeamHookMock.useSelectedTeamContext as jest.Mock).mockImplementation(() => ({
      selectedTeam: team
    }))
  })

  function createDataMock(invitationStatus: UserInviteStatus, teamId = 'teamId') {
    team = teamId === 'private' ? buildPrivateTeam() : buildTeam(teamId)
    patient = {
      profile: { firstName: 'alain', lastName: 'tolerant' },
      invitationStatus
    } as Patient
  }

  describe('handleOnClickRemove', () => {
    it('should show success alert when removing a patient from a team', async () => {
      createDataMock(UserInviteStatus.Accepted)
      isPrivateMock.mockReturnValueOnce(false)

      const { result } = renderHook(() => useRemovePatientDialog({ patient, onClose }))
      await result.current.handleOnClickRemove()

      expect(removePatientMock).toHaveBeenCalledWith(patient)
      expect(onSuccessMock).toHaveBeenCalledWith('alert-remove-patient-from-team-success')
    })

    it('should show success alert when removing a private practice patient', async () => {
      team = { id: 'private', type: TeamType.private, name: 'private' } as Team
      createDataMock(UserInviteStatus.Accepted, 'private')
      isPrivateMock.mockReturnValueOnce(true)

      const { result } = renderHook(() => useRemovePatientDialog({ patient, onClose }))
      await result.current.handleOnClickRemove()

      expect(removePatientMock).toHaveBeenCalledWith(patient)
      expect(onSuccessMock).toHaveBeenCalledWith('alert-remove-private-practice-success')
    })
  })
})
