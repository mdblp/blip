/**
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

import TeamApi from '../../../../lib/team/team-api'
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from '../../../../models/team'
import { buildITeam, buildITeamMember, buildTeam } from '../../common/utils'
import { UserInvitationStatus } from '../../../../models/generic'
import TeamUtils from '../../../../lib/team/utils'
import { INotification, NotificationType } from '../../../../lib/notifications/models'
import { Profile } from '../../../../models/user'
import { Team } from '../../../../lib/team'

describe('TeamUtils', () => {
  describe('loadTeams', () => {
    it('should return correct team structure', async () => {
      const userId = 'fakeUserId'
      const team1Id = 'team1Id'
      const team2Id = 'team2Id'
      const team1Member1 = buildITeamMember(team1Id, 'team1Member1', TeamMemberRole.admin, 'team1@member1.com', 'team 1 member 1', UserInvitationStatus.accepted)
      const team1Member2 = buildITeamMember(team1Id, 'team1Member2', TeamMemberRole.admin, 'team1@member2.com', 'team 1 member 2', UserInvitationStatus.pending)
      const team1Members: ITeamMember[] = [team1Member1, team1Member2]
      const team1 = buildITeam(team1Id, team1Members, 'team 1')
      const team2Member1 = buildITeamMember(team2Id, 'team2Member1', TeamMemberRole.admin, 'team2@member1.com', 'team 2 member 1', UserInvitationStatus.accepted)
      const team2Member2 = buildITeamMember(team2Id, 'team2Member2', TeamMemberRole.member, 'team2@member2.com', 'team 2 member 2', UserInvitationStatus.accepted)
      const team2Members: ITeamMember[] = [team2Member1, team2Member2]
      const team2 = buildITeam(team2Id, team2Members, 'team 1')
      const teamsFromApi: ITeam[] = [team1, team2]

      const notification: INotification = {
        metricsType: 'join_team',
        type: NotificationType.careTeamProInvitation,
        creator: { userid: userId, profile: {} as Profile },
        creatorId: userId,
        date: new Date().toISOString(),
        email: team1Member2.email,
        target: { id: team1.id, name: 'fakeName' },
        id: 'fakeId'
      }
      const notifications: INotification[] = [notification]
      const expectedTeams: Team[] = [
        {
          code: 'private',
          id: 'private',
          members: [],
          name: 'private',
          owner: 'fakeUserId',
          type: TeamType.private
        },
        {
          address: team1.address,
          code: team1.code,
          description: team1.description,
          email: team1.email,
          id: team1.id,
          members: [{
            email: team1Member1.email,
            invitation: undefined,
            profile: team1Member1.profile,
            role: team1Member1.role,
            status: team1Member1.invitationStatus,
            userId: team1Member1.userId
          },
          {
            email: team1Member2.email,
            invitation: notification,
            profile: team1Member2.profile,
            role: team1Member2.role,
            status: team1Member2.invitationStatus,
            userId: team1Member2.userId
          }
          ],
          monitoring: team1.monitoring,
          name: team1.name,
          owner: team1.owner,
          phone: team1.phone,
          type: team1.type
        },
        {
          address: team2.address,
          code: team2.code,
          description: team2.description,
          email: team2.email,
          id: team2.id,
          members:
            [
              {
                email: team2Member1.email,
                invitation: undefined,
                profile: team2Member1.profile,
                role: team2Member1.role,
                status: team2Member1.invitationStatus,
                userId: team2Member1.userId
              },
              {
                email: team2Member2.email,
                invitation: undefined,
                profile: team2Member2.profile,
                role: team2Member2.role,
                status: team2Member2.invitationStatus,
                userId: team2Member2.userId
              }],
          monitoring: team2.monitoring,
          name: team2.name,
          owner: team2.owner,
          phone: team2.phone,
          type: team2.type
        }
      ]
      jest.spyOn(TeamApi, 'getTeams').mockResolvedValue(teamsFromApi)

      const teams = await TeamUtils.loadTeams(userId, notifications)
      expect(teams).toEqual(expectedTeams)
    })
  })

  describe('sortTeams', () => {
    it('should sort a list of teams in alphabetical order', () => {
      const teams = [
        buildTeam('fakeId2', [], 'B team'),
        buildTeam('fakeId3', [], 'C team'),
        buildTeam('fakeId1', [], 'A team')
      ]
      const expectedResult = [teams[2], teams[0], teams[1]]
      expect(expectedResult).toEqual(TeamUtils.sortTeams(teams))
    })
  })
})
