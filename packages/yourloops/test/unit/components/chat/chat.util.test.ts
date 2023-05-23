/*
 * Copyright (c) 2023, Diabeloop
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

import { type Team } from '../../../../lib/team'
import { getUnreadMessagesByTeam } from '../../../../components/chat/chat.util'

describe('ChatUtil', () => {
  describe('getUnreadMessagesByTeamForPatient', () => {
    it('should convert the string-number object into a string-boolean object and mention all teams', () => {
      const teams = [{ id: 'team-1' }, { id: 'team-2' }, { id: 'team-3' }] as Team[]
      const unreadMessagesCountByTeam = {
        'team-1': 3,
        'team-3': 2
      }
      const emptyApiResult = {}

      expect(getUnreadMessagesByTeam(unreadMessagesCountByTeam, teams)).toEqual({
        'team-1': true,
        'team-2': false,
        'team-3': true
      })
      expect(getUnreadMessagesByTeam(emptyApiResult, teams)).toEqual({
        'team-1': false,
        'team-2': false,
        'team-3': false
      })
    })
  })
})
