/**
 * Copyright (c) 2021, Diabeloop
 * Teams utility functions
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

import { Team, TEAM_CODE_LENGTH, TeamMember } from './models'
import TeamApi from './team-api'
import { ITeam, ITeamMember, TeamMemberRole, TeamType } from '../../models/team'
import { UserInvitationStatus } from '../../models/generic'
import { INotification } from '../notifications/models'

/**
 * Get the team code for display - Can be use with partial code.
 * @param code 9 digit string team code
 * @returns `123 - 456 - 789`
 */
export function getDisplayTeamCode(code: string): string {
  const SEP_POS = [2, 5]
  let displayCode = ''
  const codeLen = Math.min(code.length, TEAM_CODE_LENGTH)
  for (let i = 0; i < codeLen; i++) {
    displayCode += code[i]
    if (SEP_POS.includes(i) && i + 1 < codeLen) {
      displayCode += ' - '
    }
  }
  return displayCode
}

export default class TeamUtils {
  static isUserTheOnlyAdministrator = (team: Team, userId: string): boolean => {
    const admins = team.members.filter((member) => member.role === TeamMemberRole.admin && member.status === UserInvitationStatus.accepted)
    return admins.length === 1 && admins[0].userId === userId
  }

  static isUserAdministrator = (team: Team, userId: string): boolean => {
    const result = team.members.find((member) => member.role === TeamMemberRole.admin && member.userId === userId)
    return typeof result === 'object'
  }

  static teamHasOnlyOneMember = (team: Team): boolean => {
    const numMembers = team.members.reduce((p, t) => t.role === TeamMemberRole.patient ? p : p + 1, 0)
    return numMembers < 2
  }

  static getNumMedicalMembers = (team: Team): number => {
    return team.members.reduce<number>((num, member) => {
      return member.role === TeamMemberRole.patient ? num : num + 1
    }, 0)
  }

  static iMemberToMember(iTeamMember: ITeamMember, teamId: string, invitations: INotification[]): TeamMember {
    const {
      userId,
      invitationStatus,
      role,
      email,
      profile
    } = iTeamMember
    return {
      userId,
      email,
      profile,
      role,
      status: invitationStatus,
      invitation: invitations.find(invitation => invitation.target.id === teamId && invitation.email === email)
    }
  }

  static async loadTeams(userId: string, invitations: INotification[]): Promise<Team[]> {
    const iTeams = await TeamApi.getTeams()

    const privateTeam: Team = {
      code: TeamType.private,
      id: TeamType.private,
      members: [],
      name: TeamType.private,
      owner: userId,
      type: TeamType.private
    }

    const teams: Team[] = [privateTeam]
    iTeams.forEach((iTeam: ITeam) => {
      const members = iTeam.members.map(iTeamMember => TeamUtils.iMemberToMember(iTeamMember, iTeam.id, invitations))
      const team: Team = {
        id: iTeam.id,
        name: iTeam.name,
        code: iTeam.code,
        type: iTeam.type,
        owner: iTeam.owner,
        phone: iTeam.phone,
        email: iTeam.email,
        address: iTeam.address,
        description: iTeam.description,
        members,
        monitoring: iTeam.monitoring
      }
      teams.push(team)
    })

    return teams
  }

  static sortTeams(teams: Team[]): Team[] {
    return teams.sort((a, b) => a.name.localeCompare(b.name))
  }
}
