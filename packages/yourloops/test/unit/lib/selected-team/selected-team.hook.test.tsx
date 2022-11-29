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
import * as teamHookMock from '../../../../lib/team'
import { act, renderHook } from '@testing-library/react-hooks'
import { useSelectedTeamProviderCustomHook } from '../../../../lib/selected-team/selected-team.hook'

jest.mock('../../../../lib/team')
describe('Selected team hook', () => {
  const initialTeamId = 'initial-team-id'
  const otherTeamId = '1-other-team-id'

  const getMedicalAndPrivateTeamsMock = jest.fn().mockReturnValue([
    { id: initialTeamId, name: 'Initial team' },
    { id: 'a-team-id', name: 'A team' },
    { id: otherTeamId, name: '1 - Other team' }
  ])

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        getMedicalAndPrivateTeams: getMedicalAndPrivateTeamsMock
      }
    })
  })

  describe('selectedTeamId', () => {
    it('should be initialized with the value from local storage if it is valid', () => {
      localStorage.setItem('selectedTeamId', initialTeamId)

      const { result } = renderHook(() => useSelectedTeamProviderCustomHook())

      expect(result.current.selectedTeamId).toEqual(initialTeamId)
    })

    it('should be initialized with the id of the first team by alphabetical order if the local storage value is invalid', () => {
      localStorage.setItem('selectedTeamId', 'invalid-value')

      const { result } = renderHook(() => useSelectedTeamProviderCustomHook())

      expect(result.current.selectedTeamId).toEqual(otherTeamId)
    })
  })

  describe('selectTeam', () => {
    it('should store the new team id in state and local storage', async () => {
      const newTeamId = 'new-team-id'
      localStorage.setItem('selectedTeamId', initialTeamId)

      const { result } = renderHook(() => useSelectedTeamProviderCustomHook())
      await act(async () => {
        result.current.selectTeam(newTeamId)
      })

      expect(localStorage.getItem('selectedTeamId')).toEqual(newTeamId)
      expect(result.current.selectedTeamId).toEqual(newTeamId)
    })
  })
})
