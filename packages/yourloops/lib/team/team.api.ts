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
import HttpService, { ErrorMessageStatus } from '../http/http.service'
import { type INotification } from '../notifications/models/i-notification.model'
import { getCurrentLang } from '../language'
import bows from 'bows'
import { type TeamMemberRole } from './models/enums/team-member-role.enum'
import { type Team } from './models/team.model'
import { HttpHeaderKeys } from '../http/models/enums/http-header-keys.enum'
import { type ITeam } from './models/i-team.model'
import { TeamType } from './models/enums/team-type.enum'
import HttpStatus from '../http/models/enums/http-status.enum'
import { UserRole } from '../auth/models/enums/user-role.enum'

const log = bows('Team API')

interface ChangeMemberRoleFirstPayload {
  teamId: string
  email: string
  role: TeamMemberRole.admin | TeamMemberRole.member
}

interface InviteMemberPayload {
  role: TeamMemberRole
}

interface ChangeMemberRoleArgs extends ChangeMemberRoleFirstPayload {
  userId: string
}

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

interface InviteMemberResult {
  invitation: INotification
  teams: Team[]
}

const HCP_ROUTE = 'hcps'
const PATIENTS_ROUTE = 'patients'

export const PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_MESSAGE = 'patient-already-invited-in-team'
const PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_CODE = HttpStatus.StatusConflict

export const GET_TEAMS_CACHE_ID= 'get-teams'

export default class TeamApi {
  static async getTeams(userId: string, userRole: UserRole, useCache: boolean = false): Promise<Team[]> {
    const url = TeamApi.getTeamsApiUrl(userId, userRole)
    const cacheId = useCache ? GET_TEAMS_CACHE_ID : null
    try {
      const { data } = await HttpService.get<Team[]>({ url }, cacheId)
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

  static async inviteMember(userId: string, teamId: string, inviteeEmail: string, role: TeamMemberRole): Promise<InviteMemberResult> {
    const { data } = await HttpService.post<InviteMemberResult, InviteMemberPayload>({
      config: { headers: { [HttpHeaderKeys.language]: getCurrentLang() } },
      payload: { role },
      url: `bff/v1/hcps/${userId}/teams/${teamId}/members/${inviteeEmail}/invite`
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
    try {
      await HttpService.post<void, { userId: string }>({
        url: `/crew/v0/teams/${teamId}/patients`,
        payload: { userId }
      }, [PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_CODE])
    } catch (error) {
      if (error.response.status === PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_CODE) {
        throw new Error(PATIENT_ALREADY_INVITED_IN_TEAM_ERROR_MESSAGE)
      }
      throw error
    }
  }

  private static getTeamsApiUrl(userId: string, userRole: UserRole): string {
    const isUserHcp = userRole === UserRole.Hcp
    if (!isUserHcp && userRole !== UserRole.Patient) {
      throw Error(`User with role ${userRole} cannot retrieve teams`)
    }
    const userRoute = isUserHcp ? HCP_ROUTE : PATIENTS_ROUTE
    return `/bff/v1/${userRoute}/${userId}/teams`
  }
}
