/*
 * Copyright (c) 2021-2022, Diabeloop
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

import { Team, TeamContext, TeamContextProvider, useTeam } from '../../../../lib/team'
import { UserInvitationStatus } from '../../../../models/generic.model'
import * as notificationHookMock from '../../../../lib/notifications/hook'
import { ITeam, TeamMemberRole } from '../../../../models/team'
import { buildTeam, buildTeamMember } from '../../common/utils'
import * as authHookMock from '../../../../lib/auth'
import TeamApi from '../../../../lib/team/team.api'
import { APINotificationType } from '../../../../models/notification-api.model'

jest.mock('../../../../lib/auth')
jest.mock('../../../../lib/notifications/hook')
describe('Team hook', () => {
  let teamHook: TeamContext
  const memberHcp1 = buildTeamMember('memberHcp', undefined, TeamMemberRole.member)
  const memberHcp2 = buildTeamMember('memberHcpAdmin', undefined, TeamMemberRole.admin, undefined, undefined, UserInvitationStatus.accepted)
  const team1 = buildTeam('team1Id', [memberHcp1])
  const team2 = buildTeam('team2Id', [])
  const team3 = buildTeam('team3Id', [memberHcp2])
  const team4 = buildTeam('team4Id', [])
  team4.monitoring.enabled = false
  const unmonitoredTeam = buildTeam('team4Id', [], 'fakeTeamName')
  unmonitoredTeam.monitoring = undefined
  const teams: Team[] = [team1, team2, team3, team4, unmonitoredTeam]
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
      await waitFor(() => expect(teamHook.teams.length).toBeGreaterThan(0))
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
    it('should throw an error when there is no invitation', async () => {
      const teamMember = buildTeamMember()
      await expect(async () => {
        await teamHook.removeMember(teamMember, 'fakeTeamId')
      }).rejects.toThrow()
    })

    it('should throw an error when there is no invitation for the member team', async () => {
      const teamMember = buildTeamMember('fakeUserId')
      await expect(async () => {
        await teamHook.removeMember(teamMember, 'fakeTeamId')
      }).rejects.toThrow()
    })
  })

  describe('updateTeamAlerts', () => {
    it('should throw an error when the team is not monitored', async () => {
      await expect(async () => {
        await teamHook.updateTeamAlerts(unmonitoredTeam)
      }).rejects.toThrow()
    })

    it('should throw an error when api called failed', async () => {
      const updateTeamAlertsSpy = jest.spyOn(TeamApi, 'updateTeamAlerts').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await teamHook.updateTeamAlerts(team1)
      }).rejects.toThrow()
      expect(updateTeamAlertsSpy).toHaveBeenCalled()
    })

    it('should refresh team hook when api called succeeded', async () => {
      const updateTeamAlertsSpy = jest.spyOn(TeamApi, 'updateTeamAlerts').mockResolvedValue(null)
      await mountComponent()
      await act(async () => {
        await teamHook.updateTeamAlerts(team1)
        expect(updateTeamAlertsSpy).toHaveBeenCalled()
        await waitFor(() => expect(getTeamsSpy).toHaveBeenCalledTimes(3))
      })
    })
  })

  describe('getRemoteMonitoringTeams', () => {
    it('should only return teams with monitoring enabled', async () => {
      const expectedResult = [team1, team2, team3]
      await mountComponent()
      const monitoredTeams = teamHook.getRemoteMonitoringTeams()
      expect(monitoredTeams).toEqual(expectedResult)
    })
  })

  describe('getTeam', () => {
    it('should return a team if exists or null', () => {
      let team = teamHook.getTeam('team1Id')
      expect(team).toEqual(team1)
      team = teamHook.getTeam('unknownId')
      expect(team).toBeNull()
    })
  })

  describe('getMedicalTeams', () => {
    it('should return an array of medical teams', () => {
      const medicalTeams = teamHook.getMedicalTeams()
      expect(medicalTeams).toEqual(teams)
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
        expect(getTeamsSpy).toBeCalledTimes(1)
      })
    })
  })

  describe('inviteMember', () => {
    it('should invite and add a member in a team', async () => {
      jest.spyOn(TeamApi, 'inviteMember').mockResolvedValueOnce({
        invitation: {
          key: 'key',
          type: APINotificationType.medicalTeamProInvitation,
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
      expect(getTeamsSpy).toBeCalledTimes(1)
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
      }).rejects.toThrowError('We are not a member of the team!')
    })
  })
})
