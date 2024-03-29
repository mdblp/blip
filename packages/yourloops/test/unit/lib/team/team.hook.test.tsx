/*
 * Copyright (c) 2021-2023, Diabeloop
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

import React from 'react'
import { act, render, waitFor } from '@testing-library/react'

import { type Team, type TeamContext, TeamContextProvider, useTeam } from '../../../../lib/team'
import * as notificationHookMock from '../../../../lib/notifications/notification.hook'
import { buildTeam, buildTeamMember } from '../../common/utils'
import * as authHookMock from '../../../../lib/auth'
import TeamApi from '../../../../lib/team/team.api'
import { TeamMemberRole } from '../../../../lib/team/models/enums/team-member-role.enum'
import { UserInviteStatus } from '../../../../lib/team/models/enums/user-invite-status.enum'
import { type ITeam } from '../../../../lib/team/models/i-team.model'
import { INotificationType } from '../../../../lib/notifications/models/enums/i-notification-type.enum'
import { TeamType } from '../../../../lib/team/models/enums/team-type.enum'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/notifications/notification.hook')
describe('Team hook', () => {
  let teamHook: TeamContext

  const memberHcp1 = buildTeamMember('memberHcp', undefined, TeamMemberRole.member)
  const memberHcp2 = buildTeamMember('memberHcpAdmin', undefined, TeamMemberRole.admin, undefined, undefined, UserInviteStatus.Accepted)
  const team1 = buildTeam('team1Id', [memberHcp1])
  const team2 = buildTeam('team2Id', [])
  const team3 = buildTeam('team3Id', [memberHcp2])
  const team4 = buildTeam('team4Id', [])
  const unmonitoredTeam = buildTeam('team4Id', [], 'fakeTeamName')
  const privateTeam = buildTeam('private', undefined, undefined, TeamType.private)
  const caregiverTeam = buildTeam('caregiverId', undefined, undefined, TeamType.caregiver)
  const teams: Team[] = [team1, team2, team3, team4, unmonitoredTeam, privateTeam, caregiverTeam]

  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue(['flaggedPatient'])
  const authHookFlagPatientMock = jest.fn()
  const getTeamsSpy = jest.spyOn(TeamApi, 'getTeams')

  async function mountComponent() {
    const DummyComponent = (): JSX.Element => {
      teamHook = useTeam()
      return (<div />)
    }
    await act(async () => {
      render(
        <TeamContextProvider>
          <DummyComponent />
        </TeamContextProvider>
      )
    })
    await waitFor(() => {
      expect(teamHook.teams.length).toBeGreaterThan(0)
    })
  }

  beforeAll(async () => {
    getTeamsSpy.mockReset()
    getTeamsSpy.mockResolvedValue(teams);
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        user: { id: 'memberPatientAccepted1' },
        getFlagPatients: authHookGetFlagPatientMock,
        flagPatient: authHookFlagPatientMock
      }
    });
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        initialized: true,
        sentInvitations: [],
        cancel: notificationHookCancelMock
      }
    })
    await mountComponent()
  })

  describe('removeMember', () => {
    it('should throw an error when there is no invite', async () => {
      const teamMember = buildTeamMember()
      await expect(async () => {
        await teamHook.removeMember(teamMember, 'fakeTeamId')
      }).rejects.toThrow()
    })

    it('should throw an error when there is no invite for the member team', async () => {
      const teamMember = buildTeamMember('fakeUserId')
      await expect(async () => {
        await teamHook.removeMember(teamMember, 'fakeTeamId')
      }).rejects.toThrow()
    })
  })

  describe('getTeam', () => {
    it('should return a team if exists or null', () => {
      const teamWithKnownId = teamHook.getTeam('team1Id')
      expect(teamWithKnownId).toEqual(team1)
      const teamWithUnknownId = teamHook.getTeam('unknownId')
      expect(teamWithUnknownId).toBeNull()
    })
  })

  describe('getMedicalTeams', () => {
    it('should return an array of medical teams', () => {
      const teams = teamHook.getMedicalTeams()
      expect(teams).toEqual([
        team1,
        team2,
        team3,
        team4,
        unmonitoredTeam
      ])
    })
  })

  describe('getPrivateTeam', () => {
    it('should return the private team', () => {
      const team = teamHook.getPrivateTeam()
      expect(team).toEqual(privateTeam)
    })
  })

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const initialTeamsLength = teams.length
      const newTeam = { id: 'newTeamId', email: 'fake@email.com', members: [] } as Team
      jest.spyOn(TeamApi, 'createTeam').mockResolvedValueOnce({
        id: 'newTeamId',
        email: 'fake@email.com',
        members: []
      } as ITeam)

      expect(teams).toHaveLength(initialTeamsLength)
      await act(async () => {
        await teamHook.createTeam(newTeam)
        expect(getTeamsSpy).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('inviteMember', () => {
    it('should invite and add a member in a team', async () => {
      jest.spyOn(TeamApi, 'inviteMember').mockResolvedValueOnce({
        invitation: {
          key: 'key',
          type: INotificationType.medicalTeamProInvitation,
          email: 'hcp@username.com',
          creatorId: 'currentUserId',
          created: 'now',
          shortKey: 'short',
          creator: { userid: 'currentUserId' }
        },
        teams
      })
      const initialTeamMembersLength = team1.members.length

      expect(team1.members.length).toEqual(initialTeamMembersLength)
      await act(async () => {
        await teamHook.inviteMember(team1, 'new-hcp@mail.com', TeamMemberRole.admin)
      })
    })
  })

  describe('changeMemberRole', () => {
    it('should change the member role', async () => {
      jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValue(undefined)
      await act(async () => {
        await teamHook.changeMemberRole(memberHcp1, TeamMemberRole.admin, 'fakeTeamId')
      })
      expect(getTeamsSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('leaveTeam', () => {
    it('should delete team if user is hcp admin and the last member', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return {
          user: { id: 'memberHcpAdmin' }
        }
      })
      const deleteTeamMock = jest.spyOn(TeamApi, 'deleteTeam').mockResolvedValue(undefined)
      await mountComponent()

      await act(async () => {
        await teamHook.leaveTeam(team3)
      })

      expect(deleteTeamMock).toHaveBeenCalled()
    })

    it('should leave team if user is hcp and not admin', async () => {
      (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
        return {
          user: { id: 'memberHcp' }
        }
      })
      const leaveTeamMock = jest.spyOn(TeamApi, 'leaveTeam').mockResolvedValue(undefined)
      await mountComponent()

      await act(async () => {
        await teamHook.leaveTeam(team1)
      })
      expect(leaveTeamMock).toHaveBeenCalled()
    })

    it('should throw an error if user is not a member of the team', async () => {
      await expect(async () => {
        await teamHook.leaveTeam(team3)
      }).rejects.toThrow('We are not a member of the team!')
    })
  })
})
