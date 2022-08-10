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
import { ITeam, TeamMemberRole } from '../../../models/team'
import { UserRoles } from '../../../models/user'
import { buildInvite, buildTeam, buildTeamMember, createPatient, createPatientTeam } from '../../common/utils'
import * as authHookMock from '../../../lib/auth'
import TeamUtils from '../../../lib/team/utils'
import { mapTeamUserToPatient } from '../../../components/patient/utils'
import TeamApi from '../../../lib/team/team-api'
import { Monitoring } from '../../../models/monitoring'
import { PatientTeam } from '../../../lib/data/patient'
import { APINotificationType } from '../../../models/notification'
import { INotification } from '../../../lib/notifications/models'
import DirectShareApi from '../../../lib/share/direct-share-api'

jest.mock('../../../lib/auth')
jest.mock('../../../lib/notifications/hook')
describe('Team hook', () => {
  let teamHook: TeamContext
  const memberPatientAccepted1 = buildTeamMember('team1Id', 'memberPatientAccepted1', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.accepted, UserRoles.patient)
  memberPatientAccepted1.user.profile.firstName = 'donkey'
  const memberPatientPending1 = buildTeamMember('team1Id', 'memberPatientPending1', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient)
  const memberPatientPending2 = buildTeamMember('team1Id', 'memberPatientPending2', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.pending, UserRoles.patient)
  const memberHcp1 = buildTeamMember('team1Id', 'memberHcp', undefined, TeamMemberRole.member)
  const memberHcp2 = buildTeamMember('team3Id', 'memberHcpAdmin', undefined, TeamMemberRole.admin, undefined, undefined, UserInvitationStatus.accepted)
  const team1 = buildTeam('team1Id', [memberPatientAccepted1, memberPatientPending1, memberHcp1])
  const team2 = buildTeam('team2Id', [memberPatientPending1, memberPatientPending2])
  const team3 = buildTeam('team3Id', [memberHcp2])
  const team4 = buildTeam('team4Id', [])
  team4.monitoring.enabled = false
  const unmonitoredTeam = buildTeam('team4Id', [], 'fakeTeamName')
  unmonitoredTeam.monitoring = undefined
  const teams: Team[] = [team1, team2, team3, team4, unmonitoredTeam]
  const patientTeam1 = createPatientTeam('team1Id', UserInvitationStatus.accepted)
  const patientTeam2 = createPatientTeam('team2Id', UserInvitationStatus.accepted)
  const monitoredPatient1 = createPatient('memberPatientAccepted1', [patientTeam1], undefined, undefined, {} as Monitoring)
  const monitoredPatient2 = createPatient('memberPatientPending1', [patientTeam2], undefined, undefined, {} as Monitoring)
  const unknownPatient = createPatient('nigma')
  const notificationHookCancelMock = jest.fn()
  const authHookGetFlagPatientMock = jest.fn().mockReturnValue(['flaggedPatient'])
  const authHookFlagPatientMock = jest.fn()

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

    it('should return correct patients when provided a search filter', async () => {
      await mountComponent()
      const patientsReceived = teamHook.filterPatients(PatientFilterTypes.all, 'donkey', [])
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

  describe('editPatientRemoteMonitoring', () => {
    it('should throw an error if patient is not found', async () => {
      await mountComponent()
      expect(() => teamHook.editPatientRemoteMonitoring(unknownPatient)).toThrowError()
    })

    it('should update patient monitoring', async () => {
      await mountComponent()
      await act(() => {
        teamHook.editPatientRemoteMonitoring(monitoredPatient1)
      })
      expect(teams[0].members[0].user.monitoring).toBeTruthy()
    })
  })

  describe('getPatientRemoteMonitoringTeam', () => {
    it('should throw an error if patient is not monitored', async () => {
      await mountComponent()
      expect(() => teamHook.getPatientRemoteMonitoringTeam(unknownPatient)).toThrowError('Cannot get patient remote monitoring team as patient is not remote monitored')
    })

    it('should throw an error if patient team could not be found', async () => {
      const monitoredPatientWithUnknownTeam = createPatient('memberPatientAccepted1', undefined, undefined, undefined, {} as Monitoring)
      await mountComponent()
      expect(() => teamHook.getPatientRemoteMonitoringTeam(monitoredPatientWithUnknownTeam)).toThrowError('Could not find team to which patient is remote monitored')
    })

    it('should return the patient monitored team', async () => {
      const expectedResult = {
        teamId: 'team1Id',
        status: UserInvitationStatus.accepted,
        teamName: 'fakeTeamName'
      } as PatientTeam
      await mountComponent()
      const team = teamHook.getPatientRemoteMonitoringTeam(monitoredPatient1)
      expect(team).toEqual(expectedResult)
    })
  })

  describe('getTeam', () => {
    it('should return a team if exists or null', async () => {
      await mountComponent()
      let team = teamHook.getTeam('team1Id')
      expect(team).toEqual(team1)
      team = teamHook.getTeam('unknownId')
      expect(team).toBeNull()
    })
  })

  describe('getMedicalTeams', () => {
    it('should return an array of medical teams', async () => {
      await mountComponent()
      const medicalTeams = teamHook.getMedicalTeams()
      expect(medicalTeams).toEqual(teams)
    })
  })

  describe('createTeam', () => {
    it('should create a new team', async () => {
      const initialTeamsLength = teams.length
      expect(teams).toHaveLength(initialTeamsLength)
      const newTeam = { id: 'newTeamId', email: 'fake@email.com', members: [] } as Team
      jest.spyOn(TeamApi, 'createTeam').mockResolvedValueOnce({
        id: 'newTeamId',
        email: 'fake@email.com',
        members: []
      } as ITeam)
      await mountComponent()
      await act(async () => {
        await teamHook.createTeam(newTeam)
        expect(teams).toHaveLength(initialTeamsLength + 1)
      })
    })
  })

  describe('getPatient', () => {
    it('should return a patient if existing in a team or null if not', async () => {
      await mountComponent()
      let patient = teamHook.getPatient('memberPatientAccepted1')
      expect(patient).toBeTruthy()
      patient = teamHook.getPatient('unknownId')
      expect(patient).toBeFalsy()
    })
  })

  describe('getPatients', () => {
    it('should return an array of patients', async () => {
      await mountComponent()
      const patients = teamHook.getPatients()
      expect(patients).toBeInstanceOf(Array)
      expect(patients.length).toEqual(3)
    })
  })

  describe('getPatientsAsTeamUsers', () => {
    it('should return an array of team users', async () => {
      await mountComponent()
      const teamUsers = teamHook.getPatientsAsTeamUsers()
      expect(teamUsers).toBeInstanceOf(Array)
      expect(teamUsers.length).toEqual(3)
    })
  })

  describe('invitePatient', () => {
    it('should invite and add a patient in a team', async () => {
      jest.spyOn(TeamApi, 'invitePatient').mockResolvedValueOnce({
        key: 'key',
        type: APINotificationType.medicalTeamPatientInvitation,
        email: 'fake@username.com',
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })
      const initialTeamMembersLength = team1.members.length
      await mountComponent()
      expect(team1.members.length).toEqual(initialTeamMembersLength)
      await act(async () => {
        await teamHook.invitePatient(team1, 'new-patient@mail.com')
      })
      expect(team1.members.length).toEqual(initialTeamMembersLength + 1)
    })
  })

  describe('inviteMember', () => {
    it('should invite and add a member in a team', async () => {
      jest.spyOn(TeamApi, 'inviteMember').mockResolvedValueOnce({
        key: 'key',
        type: APINotificationType.medicalTeamProInvitation,
        email: 'hcp@username.com',
        creatorId: 'currentUserId',
        created: 'now',
        shortKey: 'short',
        creator: { userid: 'currentUserId' }
      })
      const initialTeamMembersLength = team1.members.length
      await mountComponent()
      expect(team1.members.length).toEqual(initialTeamMembersLength)
      await act(async () => {
        await teamHook.inviteMember(team1, 'new-hcp@mail.com', TeamMemberRole.admin)
      })
      expect(team1.members.length).toEqual(initialTeamMembersLength + 1)
    })
  })

  describe('updatePatientMonitoring', () => {
    it('should throw an error if patient is not monitored', async () => {
      await mountComponent()
      await expect(async () => {
        await teamHook.updatePatientMonitoring(unknownPatient)
      }).rejects.toThrowError('Cannot update patient monitoring with undefined')
    })

    it('should throw an error if patient team does not exists', async () => {
      const patientWithUnknownTeam = createPatient('id', [createPatientTeam('id', UserInvitationStatus.accepted)])
      patientWithUnknownTeam.monitoring = { enabled: true }
      await mountComponent()
      await expect(async () => {
        await teamHook.updatePatientMonitoring(patientWithUnknownTeam)
      }).rejects.toThrowError('Cannot find monitoring team in which patient is')
    })

    it('should update patient alerts', async () => {
      const updatePatientAlertsMock = jest.spyOn(TeamApi, 'updatePatientAlerts').mockResolvedValue(undefined)
      await mountComponent()
      await teamHook.updatePatientMonitoring(monitoredPatient1)
      expect(updatePatientAlertsMock).toHaveBeenCalled()
    })
  })

  describe('removePatient', () => {
    const removeDirectShareMock = jest.spyOn(DirectShareApi, 'removeDirectShare').mockResolvedValue(undefined)
    const removePatientMock = jest.spyOn(TeamApi, 'removePatient').mockResolvedValue(undefined)

    it('should throw an error if invitation is missing', async () => {
      const pendingPatientTeam = createPatientTeam('pendingTeam', UserInvitationStatus.pending)
      await mountComponent()
      await expect(async () => {
        await teamHook.removePatient(monitoredPatient1, pendingPatientTeam, 'teamId')
      }).rejects.toThrowError('Missing invitation!')
    })

    it('should call notification hook cancel method if invitation is pending and call removePatient method', async () => {
      const pendingPatientTeam = createPatientTeam('pendingTeam', UserInvitationStatus.pending)
      pendingPatientTeam.invitation = {} as INotification
      await mountComponent()
      await teamHook.removePatient(monitoredPatient1, pendingPatientTeam, 'team1Id')
      expect(notificationHookCancelMock).toHaveBeenCalled()
      expect(removePatientMock).toHaveBeenCalled()
    })

    it('should call removeDirectShare API method if private practice and throw error it does not exists in teams', async () => {
      await mountComponent()
      await expect(async () => {
        await teamHook.removePatient(monitoredPatient1, patientTeam1, 'private')
        expect(removeDirectShareMock).toHaveBeenCalled()
      }).rejects.toThrowError('Could not find team with id private')
    })

    it('should remove patient from team', async () => {
      const initialTeamMembersLength = team2.members.length
      await mountComponent()
      await act(async () => {
        await teamHook.removePatient(monitoredPatient2, patientTeam2, 'team2Id')
      })
      expect(team2.members.length).toEqual(initialTeamMembersLength - 1)
    })

    it('should unflag a patient if he is the last member of the team', async () => {
      const teamId = 'teamId'
      const teamMember = buildTeamMember(teamId, 'flaggedPatient', undefined, TeamMemberRole.patient, undefined, undefined, UserInvitationStatus.accepted, UserRoles.patient)
      const team = buildTeam(teamId, [teamMember])
      teams.push(team)
      const patientTeam = createPatientTeam('team', UserInvitationStatus.accepted)
      const patient = createPatient('flaggedPatient', [patientTeam1], undefined, undefined, {} as Monitoring)

      await mountComponent()
      await act(async () => {
        await teamHook.removePatient(patient, patientTeam, teamId)
      })
      expect(team.members.length).toEqual(0)
      expect(authHookGetFlagPatientMock).toHaveBeenCalled()
      expect(authHookFlagPatientMock).toHaveBeenCalled()
    })
  })

  describe('changeMemberRole', () => {
    it('should change the member role', async () => {
      jest.spyOn(TeamApi, 'changeMemberRole').mockResolvedValue(undefined)
      await mountComponent()
      await act(async () => {
        await teamHook.changeMemberRole(memberHcp1, TeamMemberRole.admin)
      })
      expect(team1.members[team1.members.length - 1].role).toEqual(TeamMemberRole.admin)
    })
  })

  describe('getUser', () => {
    it('should return the given user or null if does not exist', async () => {
      await mountComponent()
      let user = teamHook.getUser('memberPatientAccepted1')
      expect(user).toBeTruthy()
      user = teamHook.getUser('unknownUser')
      expect(user).toBeFalsy()
    })
  })

  describe('leaveTeam', () => {
    it('should remove patient if user is a patient', async () => {
      const removePatientMock = jest.spyOn(TeamApi, 'removePatient').mockResolvedValue(undefined)
      const initialTeamLength = teams.length
      await mountComponent()
      expect(teams.length).toEqual(initialTeamLength)
      await act(async () => {
        await teamHook.leaveTeam(team1)
      })
      expect(teams.length).toEqual(initialTeamLength - 1)
      expect(removePatientMock).toHaveBeenCalled()
    })

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
  })
})
