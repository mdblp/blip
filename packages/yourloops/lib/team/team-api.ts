/**
 * Copyright (c) 2022, Diabeloop
 * Teams management - API calls
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
import { ITeam, TeamMemberRole, TeamType } from '../../models/team'
import HttpService, { ErrorMessageStatus } from '../../services/http'
import { INotificationAPI } from '../../models/notification'
import { HttpHeaderKeys } from '../../models/api'
import { getCurrentLang } from '../language'
import { Monitoring } from '../../models/monitoring'
import bows from 'bows'
import { Team } from './models'
import { User } from '../auth'

const log = bows('Team API')

interface InviteMemberArgs {
  teamId: string
  email: string
  role: TeamMemberRole.admin | TeamMemberRole.member
}

interface InviteMemberPayload {
  inviteeEmail: string
  role: TeamMemberRole
}

interface ChangeMemberRoleArgs extends ChangeMemberRoleFirstPayload {
  userId: string
}

type ChangeMemberRoleFirstPayload = InviteMemberArgs

interface ChangeMemberRoleSecondPayload {
  teamId: string
  userId: string
  role: TeamMemberRole.admin | TeamMemberRole.member
}

interface RemoveMemberArgs {
  teamId: string
  userId: string
  email: string
}

export default class TeamApi {
  static getTeamsApiUrl(user: User): string {
    if (user.isUserHcp()) {
      return `/bff/front/v1/hcps/${user.id}/teams`
    } else if (user.isUserPatient()) {
      return `/bff/front/v1/patients/${user.id}/teams`
    } else {
      throw Error(`User with role ${user.role} cannot retrieve teams`)
    }
  }

  static async getTeams(user: User): Promise<Team[]> {
    const url = TeamApi.getTeamsApiUrl(user)
    try {
      const { data } = await HttpService.get<Team[]>({ url })
      return data
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('No teams')
        return []
      }
      throw err
    }
  }

  static async inviteMember(userId: string, teamId: string, inviteeEmail: string, role: TeamMemberRole): Promise<{ teams: Team[], invitation: INotificationAPI }> {
    const { data } = await HttpService.post<{ teams: Team[], invitation: INotificationAPI }, InviteMemberPayload>({
      config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } },
      payload: { inviteeEmail, role },
      url: `bff/front/v1/hcps/${userId}/teams/${teamId}/invite`
    })
    return data
  }

  static async createTeam(team: Partial<ITeam>): Promise<ITeam> {
    const { name, address, phone } = team
    if (!name || !address || !phone) {
      throw Error('Missing some mandatory parameters name, address or phone')
    }
    const { data } = await HttpService.post<ITeam, Partial<ITeam>>({
      url: '/crew/v0/teams',
      payload: { ...team, type: TeamType.medical }
    })
    return data
  }

  static async editTeam(team: ITeam): Promise<void> {
    await HttpService.put<void, ITeam>({
      url: `/crew/v0/teams/${team.id}`,
      payload: team
    })
  }

  static async updateTeamAlerts(teamId: string, monitoring: Monitoring): Promise<void> {
    await HttpService.put<void, Monitoring>({
      url: `/crew/v0/teams/${teamId}/remote-monitoring`,
      payload: monitoring
    })
  }

  static async deleteTeam(teamId: string): Promise<void> {
    await HttpService.delete({ url: `/crew/v0/teams/${teamId}` })
  }

  static async leaveTeam(userId: string, teamId: string): Promise<void> {
    await HttpService.delete({ url: `/crew/v0/teams/${teamId}/members/${userId}` })
  }

  static async removeMember({ teamId, userId, email }: RemoveMemberArgs): Promise<void> {
    await HttpService.delete({
      url: `confirm/send/team/leave/${teamId}/${userId}`,
      config: { params: { email } }
    })
  }

  static async changeMemberRole({ teamId, userId, email, role }: ChangeMemberRoleArgs): Promise<void> {
    await HttpService.put<void, ChangeMemberRoleFirstPayload>({
      url: `/confirm/send/team/role/${userId}`,
      payload: { teamId, email, role }
    })

    await HttpService.put<void, ChangeMemberRoleSecondPayload>({
      url: `/crew/v0/teams/${teamId}/members`,
      payload: { teamId, userId, role }
    })
  }

  static async getTeamFromCode(code: string): Promise<ITeam | null> {
    try {
      const { data } = await HttpService.get<ITeam[]>({
        url: '/crew/v0/teams',
        config: { params: { code } }
      })
      return data[0]
    } catch (err) {
      const error = err as Error
      if (error.message === ErrorMessageStatus.NotFound) {
        log.info('no teams')
        return null
      }
      throw err
    }
  }

  static async joinTeam(teamId: string, userId: string): Promise<void> {
    await HttpService.post<void, { userId: string }>({
      url: `/crew/v0/teams/${teamId}/patients`,
      payload: { userId }
    })
  }
}
