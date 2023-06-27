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

import { act, renderHook, waitFor } from '@testing-library/react'
import PatientUtils from '../../../../lib/patient/patient.util'
import { createPatient } from '../../common/utils'
import * as teamHookMock from '../../../../lib/team'
import * as authHookMock from '../../../../lib/auth'
import PatientApi from '../../../../lib/patient/patient.api'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import usePatientProviderCustomHook from '../../../../lib/patient/patient.hook'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/team')
describe('Patient hook', () => {
  const loggedInUserAsPatient = createPatient('loggedInUserAsPatient', UserInviteStatus.Accepted)
  const refreshTeamsMock = jest.fn()
  const computePatientsSpy = jest.spyOn(PatientUtils, 'computePatients')

  beforeAll(() => {
    computePatientsSpy.mockReset();
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: {
          id: loggedInUserAsPatient.userid,
          profile: loggedInUserAsPatient.profile,
          isUserHcp: () => true,
          preferences: { patientsStarred: [] }
        }
      }
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        refresh: refreshTeamsMock
      }
    })
  })

  async function renderPatientHook() {
    const hook = renderHook(() => usePatientProviderCustomHook())
    await waitFor(() => {
      expect(hook.result.current.patient).toBeDefined()
    })
    return hook
  }

  describe('leaveTeam', () => {
    let customHook

    beforeAll(async () => {
      const res = await renderPatientHook()
      customHook = res.result.current
    })

    it('should call API and refresh team list', async () => {
      const teamId = 'fakeTeamId'

      const removePatientMock = jest.spyOn(PatientApi, 'removePatient').mockResolvedValue(undefined)
      await act(async () => {
        customHook.leaveTeam(teamId)
        expect(removePatientMock).toBeCalledWith(teamId, loggedInUserAsPatient.userid)
      })
      await waitFor(() => {
        expect(refreshTeamsMock).toBeCalled()
      })
    })
  })
})
