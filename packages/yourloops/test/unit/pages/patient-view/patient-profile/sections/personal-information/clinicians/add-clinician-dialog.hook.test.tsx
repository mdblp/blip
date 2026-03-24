/*
 * Copyright (c) 2026, Diabeloop
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

import type { Team } from '../../../../../../../../lib/team'
import * as teamHookMock from '../../../../../../../../lib/team'
import * as authHookMock from '../../../../../../../../lib/auth'
import { User } from '../../../../../../../../lib/auth'
import * as router from 'react-router'
import { renderHook } from '@testing-library/react'
import {
  useAddClinicianDialog
} from '../../../../../../../../pages/patient-view/patient-profile/sections/personal-information/clinicians/add-clinician-dialog/add-clinician-dialog.hook'

jest.mock('../../../../../../../../lib/team')
jest.mock('../../../../../../../../lib/auth')
describe('Add clinician dialog hook', () => {
  let team: Team
  let user: User

  const memberId1 = 'memberId1'
  const memberId2 = 'memberId2'
  const memberId3 = 'memberId3'
  const memberId4 = 'memberId4'
  const memberId5 = 'memberId5'

  const team1 = {
    id: 'teamId1',
    members: [
      { userId: memberId1 },
      { userId: memberId2 },
      { userId: memberId3 }
    ]
  } as Team

  const team2 = {
    id: 'teamId2',
    members: [
      { userId: memberId4 },
      { userId: memberId5 }
    ]
  } as Team

  const teams = [team1, team2]

  const useParamHookMock = jest.fn().mockReturnValue({ teamId: 'teamId' })

  beforeAll(() => {
    jest.spyOn(router, 'useParams').mockImplementation(useParamHookMock)
  })

  beforeEach(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => ({
      getTeam: () => team,
      teams
    }));
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => ({
      user
    }));
  })

  describe('getAvailableHcps', () => {
    it('should return the list of HCPs that are not already referring hcps for a patient', () => {
      user = {
        isUserHcp: () => false,
        isUserPatient: () => true
      } as User

      const { result } = renderHook(() => useAddClinicianDialog({
        clinicianIds: [memberId2, memberId3],
        patientId: 'patientId',
        selectedHcpId: 'hcpId',
        onSuccess: () => {},
        onClose: () => {}
      }))
      expect(result.current.getAvailableHcps()).toEqual(
        [
          { userId: memberId1 },
          { userId: memberId4 },
          { userId: memberId5 }
        ]
      )
    })

    it('should return the list of HCPs that are not already referring hcps for a HCP', () => {
      user = {
        isUserHcp: () => true,
        isUserPatient: () => false
      } as User

      team = team1

      const { result } = renderHook(() => useAddClinicianDialog({
        clinicianIds: [memberId2, memberId3],
        patientId: 'patientId',
        selectedHcpId: 'hcpId',
        onSuccess: () => {},
        onClose: () => {}
      }))
      expect(result.current.getAvailableHcps()).toEqual(
        [
          { userId: memberId1 }
        ]
      )
    })
  })
})
