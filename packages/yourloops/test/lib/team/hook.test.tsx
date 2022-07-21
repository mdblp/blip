/**
 * Copyright (c) 2021-2022, Diabeloop
 * Teams hook tests
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

import { Team, TeamContext, TeamContextProvider, useTeam } from '../../../lib/team'
import { PatientFilterTypes, UserInvitationStatus } from '../../../models/generic'
import * as notificationHookMock from '../../../lib/notifications/hook'
import { TeamMemberRole } from '../../../models/team'
import { UserRoles } from '../../../models/user'
import { buildInvite, buildTeam, buildTeamMember } from '../../common/utils'
import * as authHookMock from '../../../lib/auth'
import TeamUtils from '../../../lib/team/utils'
import { mapTeamUserToPatient } from '../../../components/patient/utils'
import TeamApi from '../../../lib/team/team-api'

jest.mock('../../../lib/auth')
jest.mock('../../../lib/notifications/hook')
describe('Team hook', () => {
  let teamHook: TeamContext
  const memberPatientAccepted1 = buildTeamMember('team1Id', 'memberPatientAccepted1', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.accepted, UserRoles.patient)
  const memberPatientPending1 = buildTeamMember('team1Id', 'memberPatientPending1', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient)
  const memberPatientPending2 = buildTeamMember('team1Id', 'memberPatientPending2', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient)
  const team1 = buildTeam('team1Id', [memberPatientAccepted1, memberPatientPending1])
  const team2 = buildTeam('team2Id', [memberPatientPending1, memberPatientPending2])
  const team3 = buildTeam('team3Id', [])
  const team4 = buildTeam('team4Id', [])
  team4.monitoring.enabled = false
  const unmonitoredTeam = buildTeam('team4Id', [], 'fakeTeamName')
  unmonitoredTeam.monitoring = undefined
  const teams: Team[] = [team1, team2, team3, team4, unmonitoredTeam]

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

  beforeAll(() => {
    jest.spyOn(TeamUtils, 'loadTeams').mockResolvedValue({ teams, flaggedNotInResult: [] });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: {} }
    });
    (notificationHookMock.useNotification as jest.Mock).mockImplementation(() => {
      return {
        initialized: true,
        sentInvitations: []
      }
    })
  })

  describe('filterPatients', () => {
    it('should return correct patients when filter is pending', async () => {
      await mountComponent()
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.pending, '', [])
      expect(patientsReceived).toEqual([mapTeamUserToPatient(memberPatientPending1.user), mapTeamUserToPatient(memberPatientPending2.user)])
    })

    it('should return correct patients when provided a flag list', async () => {
      await mountComponent()
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.flagged, '', [memberPatientAccepted1.user.userid])
      expect(patientsReceived).toEqual([mapTeamUserToPatient(memberPatientAccepted1.user)])
    })
  })

  describe('removeMember', () => {
    it('should throw an error when there is no invitation', async () => {
      await mountComponent()
      const teamMember = buildTeamMember()
      await expect(async () => {
        await teamHook.removeMember(teamMember)
      }).rejects.toThrow()
    })

    it('should throw an error when there is no invitation for the member team', async () => {
      await mountComponent()
      const teamMember = buildTeamMember('fakeTeamId', 'fakeUserId', buildInvite('wrongTeam'))
      await expect(async () => {
        await teamHook.removeMember(teamMember)
      }).rejects.toThrow()
    })
  })

  describe('updateTeamAlerts', () => {
    it('should throw an error when the team is not monitored', async () => {
      await mountComponent()
      await expect(async () => {
        await teamHook.updateTeamAlerts(unmonitoredTeam)
      }).rejects.toThrow()
    })

    it('should throw an error when api called failed', async () => {
      const updateTeamAlertsSpy = jest.spyOn(TeamApi, 'updateTeamAlerts').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await mountComponent()
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
        await waitFor(() => expect(TeamUtils.loadTeams).toHaveBeenCalledTimes(2))
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
})
