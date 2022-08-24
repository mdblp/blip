/**
 * Copyright (c) 2021, Diabeloop
 * Teams management & helpers - hook version
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

import React, { useCallback } from 'react'
import _ from 'lodash'
import bows from 'bows'

import { UserInvitationStatus } from '../../models/generic'
import { UserRoles } from '../../models/user'
import { ITeam, TeamMemberRole, TeamType } from '../../models/team'

import { errorTextFromException } from '../utils'
import metrics from '../metrics'
import { useAuth } from '../auth'
import { useNotification } from '../notifications/hook'
import { Team, TeamContext, TeamMember, TeamUser } from './models'
import TeamApi from './team-api'
import TeamUtils from './utils'
import { notificationConversion } from '../notifications/utils'

const log = bows('TeamHook')
const ReactTeamContext = React.createContext<TeamContext>({} as TeamContext)
/** hackish way to prevent 2 or more consecutive loading */
let lock = false

function TeamContextImpl(): TeamContext {
  // hooks (private or public variables)
  // TODO: Transform the React.useState with React.useReducer
  const authHook = useAuth()
  const notificationHook = useNotification()
  const [teams, setTeams] = React.useState<Team[]>([])
  const [initialized, setInitialized] = React.useState<boolean>(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  const user = authHook.user
  if (!user) {
    throw new Error('TeamHook need a logged-in user')
  }

  // public methods

  const getTeam = (teamId: string): Team | null => {
    return teams.find((t) => t.id === teamId) ?? null
  }

  const getUser = (userId: string): TeamUser | null => {
    // Sorry for the "for", I know it's now forbidden
    // But today it's too late for me to think how to use a magic function
    // to have this info.
    for (const team of teams) {
      for (const member of team.members) {
        if (member.user.userid === userId) {
          return member.user
        }
      }
    }
    return null
  }

  const getMapUsers = (): Map<string, TeamUser> => {
    const users = new Map<string, TeamUser>()
    for (const team of teams) {
      for (const member of team.members) {
        if (!users.has(member.user.userid)) {
          users.set(member.user.userid, member.user)
        }
      }
    }
    return users
  }

  const refresh = (forceRefresh: boolean): void => {
    if (initialized || forceRefresh) {
      setInitialized(false)
    }
  }

  const getMedicalTeams = (): Team[] => {
    return teams.filter((team: Team): boolean => team.type === TeamType.medical)
  }

  const getRemoteMonitoringTeams = (): Team[] => {
    return teams.filter(team => team.monitoring?.enabled)
  }

  const inviteMember = async (team: Team, username: string, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    const apiInvitation = await TeamApi.inviteMember({ teamId: team.id, email: username, role })
    const invitation = notificationConversion(apiInvitation)

    let user = TeamUtils.getUserByEmail(teams, invitation.email)
    if (user === null) {
      user = {
        userid: invitation.id,
        role: UserRoles.hcp,
        username,
        emails: [username],
        members: []
      }
    }
    const member: TeamMember = {
      role: role as TeamMemberRole,
      status: UserInvitationStatus.pending,
      team,
      user,
      invitation
    }
    user.members.push(member)
    team.members.push(member)
    setTeams(teams)
  }

  const createTeam = async (team: Partial<Team>): Promise<void> => {
    const apiTeam: Partial<ITeam> = {
      address: team.address,
      description: team.description,
      email: team.email,
      name: team.name,
      phone: team.phone,
      type: team.type
    }
    const iTeam = await TeamApi.createTeam(apiTeam)
    const users = getMapUsers()
    const newTeam = TeamUtils.iTeamToTeam(iTeam, users)
    teams.push(newTeam)
    setTeams(teams)
    metrics.send('team_management', 'create_care_team', _.isEmpty(team.email) ? 'email_not_filled' : 'email_filled')
  }

  const editTeam = async (team: Team): Promise<void> => {
    const apiTeam: ITeam = {
      ...team,
      members: []
    }
    await TeamApi.editTeam(apiTeam)
    const cachedTeam = teams.find((t: Team) => t.id === team.id)
    if (typeof cachedTeam === 'object') {
      cachedTeam.name = team.name
      cachedTeam.phone = team.phone
      cachedTeam.address = team.address
      if (typeof team.email === 'string') {
        cachedTeam.email = team.email
      }
      setTeams(teams)
    } else {
      log.warn('editTeam(): Team not found', team)
    }
    metrics.send('team_management', 'edit_care_team')
  }

  const updateTeamAlerts = async (team: Team): Promise<void> => {
    if (!team.monitoring) {
      throw Error('Cannot update team monitoring with undefined')
    }
    try {
      await TeamApi.updateTeamAlerts(team.id, team.monitoring)
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update team with id ${team.id}`)
    }
    refresh(true)
  }

  const removeTeamFromList = useCallback((teamId: string) => {
    const idx = teams.findIndex((t: Team) => t.id === teamId)
    if (idx > -1) {
      teams.splice(idx, 1)
      setTeams(teams)
    }
  }, [teams])

  const leaveTeam = async (team: Team): Promise<void> => {
    const ourselve = team.members.find((member) => member.user.userid === user.id)
    if (_.isNil(ourselve)) {
      throw new Error('We are not a member of the team!')
    }
    log.info('leaveTeam', { ourselve, team })
    if (ourselve.role === TeamMemberRole.admin && ourselve.status === UserInvitationStatus.accepted && TeamUtils.teamHasOnlyOneMember(team)) {
      await TeamApi.deleteTeam(team.id)
      metrics.send('team_management', 'delete_team')
    } else {
      await TeamApi.leaveTeam(user.id, team.id)
      metrics.send('team_management', 'leave_team')
    }
    removeTeamFromList(team.id)
  }

  const removeMember = async (member: TeamMember): Promise<void> => {
    if (member.status === UserInvitationStatus.pending) {
      if (!member.invitation || member.team.id !== member.invitation.target?.id) {
        throw new Error('Missing invitation!')
      }
      await notificationHook.cancel(member.invitation)
    } else {
      await TeamApi.removeMember({
        teamId: member.team.id,
        userId: member.user.userid,
        email: member.user.username
      })
    }
    const { team } = member
    const idx = team.members.findIndex((m: TeamMember) => m.user.userid === member.user.userid)
    if (idx > -1) {
      team.members.splice(idx, 1)
      setTeams(teams)
    } else {
      log.warn('removeMember(): Member not found', member)
    }
  }

  const changeMemberRole = async (member: TeamMember, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    await TeamApi.changeMemberRole({
      teamId: member.team.id,
      userId: member.user.userid,
      email: member.user.username,
      role
    })
    member.role = role
    setTeams(teams)
    metrics.send('team_management', 'manage_admin_permission', role === 'admin' ? 'grant' : 'revoke')
  }

  const getTeamFromCode = async (code: string): Promise<Readonly<Team> | null> => {
    const iTeam = await TeamApi.getTeamFromCode(code)
    return iTeam ? { ...iTeam, members: [] } : null
  }

  const joinTeam = async (teamId: string): Promise<void> => {
    await TeamApi.joinTeam(teamId, user.id)
    refresh(true)
  }

  const initHook = (): void => {
    if (initialized || lock || !notificationHook.initialized) {
      return
    }
    log.info('init')
    lock = true

    TeamUtils.loadTeams(user)
      .then((teams: Team[]) => {
        log.debug('Loaded teams: ', teams)
        for (const invitation of notificationHook.sentInvitations) {
          const user = TeamUtils.getUserByEmail(teams, invitation.email)
          if (user) {
            for (const member of user.members) {
              if (member.status === UserInvitationStatus.pending) {
                member.invitation = invitation
              }
            }
          }
        }

        setTeams(teams)
        if (errorMessage !== null) {
          setErrorMessage(null)
        }
      })
      .catch((reason: unknown) => {
        log.error(reason)
        const message = errorTextFromException(reason)
        if (message !== errorMessage) {
          setErrorMessage(message)
        }
      })
      .finally(() => {
        log.debug('Initialized !')
        setInitialized(true)
        // Clear the lock
        lock = false
      })
  }

  React.useEffect(initHook, [initialized, errorMessage, teams, authHook, notificationHook, user])

  return {
    teams,
    initialized,
    errorMessage,
    refresh,
    getTeam,
    getUser,
    getMedicalTeams,
    getRemoteMonitoringTeams,
    inviteMember,
    createTeam,
    editTeam,
    updateTeamAlerts,
    leaveTeam,
    removeMember,
    changeMemberRole,
    getTeamFromCode,
    joinTeam,
    removeTeamFromList
  }
}

/**
 * Provider component that wraps your app and makes auth object available to any child component that calls useTeam().
 * @param props for team provider & children
 */
export function TeamContextProvider({ children }: { children: JSX.Element }): JSX.Element {
  const context = TeamContextImpl()
  return <ReactTeamContext.Provider value={context}>{children}</ReactTeamContext.Provider>
}

/**
 * Hook for child components to get the teams functionalities
 *
 * Trigger a re-render when it change.
 */
export function useTeam(): TeamContext {
  return React.useContext(ReactTeamContext)
}
