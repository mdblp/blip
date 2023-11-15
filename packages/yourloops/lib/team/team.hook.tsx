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

import React, { createContext, type FunctionComponent, type PropsWithChildren, useContext } from 'react'
import _ from 'lodash'
import metrics from '../metrics'
import { useAuth } from '../auth'
import { useNotification } from '../notifications/notification.hook'
import TeamApi from './team.api'
import TeamUtils from './team.util'
import { type Team } from './models/team.model'
import { type TeamContext } from './models/team-context.model'
import { type TeamMember } from './models/team-member.model'
import { type ITeam } from './models/i-team.model'
import { TeamMemberRole } from './models/enums/team-member-role.enum'
import { UserInviteStatus } from './models/enums/user-invite-status.enum'
import { TeamType } from './models/enums/team-type.enum'
import { useRevalidator, useRouteLoaderData } from 'react-router-dom'

const ReactTeamContext = createContext<TeamContext>({} as TeamContext)

export const PRIVATE_TEAM_ID = 'private'
export const PRIVATE_TEAM_NAME = 'private'

function TeamContextImpl(): TeamContext {
  const authHook = useAuth()
  const notificationHook = useNotification()
  const teams = useRouteLoaderData('teams-route') as Team[]
  // console.log(teamsFromLoader)
  const { revalidate: refresh } = useRevalidator()
  // const [teams, setTeams] = useState<Team[]>(teamsFromLoader ?? [])
  // const [initialized, setInitialized] = useState<boolean>(!!teamsFromLoader)
  // const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)
  // const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const user = authHook.user
  if (!user) {
    throw new Error('TeamHook need a logged-in user')
  }

  const getTeam = (teamId: string): Team | null => {
    return teams.find((t) => t.id === teamId) ?? null
  }

  // const fetchTeams = useCallback(() => {
  //   TeamApi.getTeams(user)
  //     .then((teams: Team[]) => {
  //       setTeams(teams)
  //       setErrorMessage(null)
  //     })
  //     .catch((reason: unknown) => {
  //       const message = errorTextFromException(reason)
  //       setErrorMessage(message)
  //     })
  //     .finally(() => {
  //       setInitialized(true)
  //       setRefreshInProgress(false)
  //     })
  // }, [user])


  const getMedicalTeams = (): Team[] => {
    return getTeamsByType(TeamType.medical)
  }

  const getPrivateTeam = (): Team => {
    return teams.find((team: Team) => TeamUtils.isPrivate(team))
  }

  const getTeamsByType = (type: TeamType): Team[] => {
    return teams.filter((team: Team) => team.type === type)
  }

  const getDefaultTeamId = (): string => {
    const medicalTeams = getMedicalTeams()
    if (medicalTeams.length) {
      return TeamUtils.sortTeamsByName(medicalTeams)[0].id
    }
    return getPrivateTeam().id
  }

  const inviteMember = async (team: Team, username: string, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    await TeamApi.inviteMember(user.id, team.id, username, role)
    // const result = await TeamApi.inviteMember(user.id, team.id, username, role)
    // setTeams(result.teams)
    refresh()
  }

  const createTeam = async (team: Partial<Team>): Promise<ITeam> => {
    const apiTeam: Partial<ITeam> = {
      address: team.address,
      email: team.email,
      name: team.name,
      phone: team.phone,
      type: team.type
    }
    const newTeam = await TeamApi.createTeam(apiTeam)
    refresh()
    metrics.send('team_management', 'create_care_team', _.isEmpty(team.email) ? 'email_not_filled' : 'email_filled')
    return newTeam
  }

  const updateTeam = async (team: Team): Promise<void> => {
    const apiTeam: ITeam = {
      id: team.id,
      name: team.name,
      phone: team.phone,
      email: team.email,
      address: team.address,
      members: [],
      monitoringAlertsParameters: team.monitoringAlertsParameters
    } as ITeam
    await TeamApi.editTeam(apiTeam)
    refresh()
    metrics.send('team_management', 'edit_care_team')
  }

  const leaveTeam = async (team: Team): Promise<void> => {
    const ourselve = team.members.find((member) => member.userId === user.id)
    if (!ourselve) {
      throw new Error('We are not a member of the team!')
    }
    if (ourselve.role === TeamMemberRole.admin && ourselve.status === UserInviteStatus.Accepted && TeamUtils.teamHasOnlyOneMember(team)) {
      await TeamApi.deleteTeam(team.id)
      metrics.send('team_management', 'delete_team')
    } else {
      await TeamApi.leaveTeam(user.id, team.id)
      metrics.send('team_management', 'leave_team')
    }
    refresh()
  }

  const removeMember = async (member: TeamMember, teamId: string): Promise<void> => {
    if (member.status === UserInviteStatus.Pending) {
      if (!member.invitationId) {
        throw new Error('Missing invite!')
      }
      await notificationHook.cancel(member.invitationId, teamId, member.email)
    } else {
      await TeamApi.removeMember({
        teamId,
        userId: member.userId,
        email: member.email
      })
    }
    refresh()
  }

  const changeMemberRole = async (member: TeamMember, role: TeamMemberRole.admin | TeamMemberRole.member, teamId: string): Promise<void> => {
    await TeamApi.changeMemberRole({
      teamId,
      userId: member.userId,
      email: member.email,
      role
    })
    metrics.send('team_management', 'manage_admin_permission', role === 'admin' ? 'grant' : 'revoke')
    refresh()
  }

  const getTeamFromCode = async (code: string): Promise<Readonly<Team> | null> => {
    const iTeam = await TeamApi.getTeamFromCode(code)
    return iTeam ? { ...iTeam, members: [] } : null
  }

  const joinTeam = async (teamId: string): Promise<void> => {
    await TeamApi.joinTeam(teamId, user.id)
    refresh()
  }

  return {
    teams,
    // initialized,
    // errorMessage,
    // refreshInProgress,
    refresh,
    getTeam,
    getMedicalTeams,
    getPrivateTeam,
    getDefaultTeamId,
    inviteMember,
    createTeam,
    updateTeam,
    leaveTeam,
    removeMember,
    changeMemberRole,
    getTeamFromCode,
    joinTeam
  }
}

export const TeamContextProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const context = TeamContextImpl()
  return <ReactTeamContext.Provider value={context}>{children}</ReactTeamContext.Provider>
  // return context.initialized
  //   ? <ReactTeamContext.Provider value={context}>{children}</ReactTeamContext.Provider>
  //   : <SpinningLoader className="centered-spinning-loader" />
}

export const useTeam = (): TeamContext => {
  return useContext(ReactTeamContext)
}
