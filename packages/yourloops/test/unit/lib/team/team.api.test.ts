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

import TeamApi from '../../../../lib/team/team.api'
import HttpService, { ErrorMessageStatus } from '../../../../lib/http/http.service'
import { type AxiosResponse } from 'axios'
import { type INotification } from '../../../../lib/notifications/models/i-notification.model'
import { getCurrentLang } from '../../../../lib/language'
import { type User } from '../../../../lib/auth'
import { TeamMemberRole } from '../../../../lib/team/models/enums/team-member-role.enum'
import { type ITeam } from '../../../../lib/team/models/i-team.model'
import { HttpHeaderKeys } from '../../../../lib/http/models/enums/http-header-keys.enum'
import { type PostalAddress } from '../../../../lib/team/models/postal-address.model'
import { TeamType } from '../../../../lib/team/models/enums/team-type.enum'

describe('TeamApi', () => {
  const userId = 'userId'
  const teamId = 'teamId'
  const email = 'email@test.com'
  const role = TeamMemberRole.admin
  const hcpUser = { id: 'fakeUserId', isUserHcp: () => true } as User
  const patientUser = { id: 'fakeUserId', isUserHcp: () => false, isUserPatient: () => true } as User

  describe('getTeams', () => {
    it('should get a list a teams when user is HCP', async () => {
      const data: ITeam[] = [
        { name: 'team1' } as ITeam,
        { name: 'team2' } as ITeam
      ]
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

      const teams = await TeamApi.getTeams(hcpUser)
      expect(teams).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url: `/bff/v1/hcps/${hcpUser.id}/teams` })
    })

    it('should get a list a teams when user is patient', async () => {
      const data: ITeam[] = [
        { name: 'team1' } as ITeam,
        { name: 'team2' } as ITeam
      ]
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data } as AxiosResponse)

      const teams = await TeamApi.getTeams(patientUser)
      expect(teams).toEqual(data)
      expect(HttpService.get).toHaveBeenCalledWith({ url: `/bff/v1/patients/${patientUser.id}/teams` })
    })

    it('should return an empty array if not found', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await TeamApi.getTeams(hcpUser)
      expect(response).toBeInstanceOf(Array)
    })

    it('should throw an error if http call failed', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await TeamApi.getTeams(hcpUser)
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
    })
  })

  describe('inviteMember', () => {
    it('should invite a new member in a team and get a notification if success', async () => {
      const data = { creatorId: 'creatorId' } as INotification
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data } as AxiosResponse)

      const notification = await TeamApi.inviteMember(userId, teamId, email, role)
      expect(notification).toEqual(data)
      expect(HttpService.post).toHaveBeenCalledWith({
        config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } },
        payload: { role },
        url: `bff/v1/hcps/${userId}/teams/${teamId}/members/${email}/invite`
      })
    })
  })

  describe('createTeam', () => {
    const name = 'super team'
    const phone = 'iPhone 5'
    const address = { city: 'grenoble' } as PostalAddress
    const newTeam = { name, phone, address } as ITeam

    it('should create a new team', async () => {
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce({ data: newTeam } as AxiosResponse)
      const team = await TeamApi.createTeam(newTeam)
      expect(team).toEqual(newTeam)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: '/crew/v0/teams',
        payload: { ...newTeam, type: TeamType.medical }
      })
    })

    it('should failed if missing mandatory parameters', async () => {
      const wrongTeam = { name }
      const wrongTeam2 = { address }
      const wrongTeam3 = { phone, name }

      await expect(async () => {
        await TeamApi.createTeam(wrongTeam)
      }).rejects.toThrow()

      await expect(async () => {
        await TeamApi.createTeam(wrongTeam2)
      }).rejects.toThrow()

      await expect(async () => {
        await TeamApi.createTeam(wrongTeam3)
      }).rejects.toThrow()
    })
  })

  describe('editTeam', () => {
    it('should edit a team', async () => {
      const editedTeam = { name: 'updated name', id: '1234' } as ITeam
      jest.spyOn(HttpService, 'put').mockResolvedValue(undefined)
      await TeamApi.editTeam(editedTeam)
      expect(HttpService.put).toHaveBeenCalledWith({
        url: `/crew/v0/teams/${editedTeam.id}`,
        payload: editedTeam
      })
    })
  })

  describe('deleteTeam', () => {
    it('should delete a team', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
      await TeamApi.deleteTeam(teamId)
      expect(HttpService.delete).toHaveBeenCalledWith({ url: `/crew/v0/teams/${teamId}` })
    })
  })

  describe('leaveTeam', () => {
    it('should leave a team', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
      await TeamApi.leaveTeam(userId, teamId)
      expect(HttpService.delete).toHaveBeenCalledWith({ url: `/crew/v0/teams/${teamId}/members/${userId}` })
    })
  })

  describe('removeMember', () => {
    it('should remove a member from a team', async () => {
      jest.spyOn(HttpService, 'delete').mockResolvedValueOnce(undefined)
      await TeamApi.removeMember({ teamId, userId, email })
      expect(HttpService.delete).toHaveBeenCalledWith({
        url: `confirm/send/team/leave/${teamId}/${userId}`,
        config: { params: { email } }
      })
    })
  })

  describe('changeMemberRole', () => {
    it('should change the member role in the team', async () => {
      const httpCall = jest.spyOn(HttpService, 'put').mockResolvedValueOnce(undefined)
      await TeamApi.changeMemberRole({ teamId, userId, email, role })
      expect(httpCall).toHaveBeenNthCalledWith(1, {
        url: `/confirm/send/team/role/${userId}`,
        payload: { teamId, email, role }
      })
      expect(httpCall).toHaveBeenNthCalledWith(2, {
        url: `/crew/v0/teams/${teamId}/members`,
        payload: { teamId, userId, role }
      })
    })
  })

  describe('getTeamFromCode', () => {
    const code = '123 456 789'
    const team = { code } as ITeam

    it('should get a team with if exists', async () => {
      jest.spyOn(HttpService, 'get').mockResolvedValueOnce({ data: [team] } as AxiosResponse)
      const response = await TeamApi.getTeamFromCode(code)
      expect(response).toEqual(team)
      expect(HttpService.get).toHaveBeenCalledWith({
        url: '/crew/v0/teams',
        config: { params: { code } }
      })
    })

    it('should return null if team doesn\'t exists', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error(ErrorMessageStatus.NotFound))
      const response = await TeamApi.getTeamFromCode(code)
      expect(response).toEqual(null)
    })

    it('should throw an error if http call failed', async () => {
      jest.spyOn(HttpService, 'get').mockRejectedValueOnce(Error('This error was thrown by a mock on purpose'))
      await expect(async () => {
        await TeamApi.getTeamFromCode(code)
      }).rejects.toThrowError('This error was thrown by a mock on purpose')
    })
  })

  describe('joinTeam', () => {
    it('should join a team', async () => {
      jest.spyOn(HttpService, 'post').mockResolvedValueOnce(undefined)
      await TeamApi.joinTeam(teamId, userId)
      expect(HttpService.post).toHaveBeenCalledWith({
        url: `/crew/v0/teams/${teamId}/patients`,
        payload: { userId }
      }, [409])
    })
  })
})
