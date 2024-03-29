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

import { buildTeam } from '../../common/utils'
import TeamUtils from '../../../../lib/team/team.util'

describe('TeamUtils', () => {
  describe('sortTeamsByName', () => {
    it('should sort a list of teams in alphabetical order', () => {
      const teams = [
        buildTeam('fakeId2', [], 'B team'),
        buildTeam('fakeId3', [], 'C team'),
        buildTeam('fakeId1', [], 'A team')
      ]
      const expectedResult = [teams[2], teams[0], teams[1]]
      expect(expectedResult).toEqual(TeamUtils.sortTeamsByName(teams))
    })
  })

  describe('isPrivate', () => {
    it('should check whether the given team is the private team', () => {
      expect(TeamUtils.isPrivate('teamId')).toEqual(false)
      expect(TeamUtils.isPrivate('private')).toEqual(true)
    })
  })
})
