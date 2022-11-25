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

import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState } from 'react'
import _ from 'lodash'

import { UserInvitationStatus } from '../../models/generic'
import { ITeam, TeamMemberRole, TeamType } from '../../models/team'

import { errorTextFromException } from '../utils'
import metrics from '../metrics'
import { useAuth } from '../auth'
import { useNotification } from '../notifications/hook'
import { Team, TeamContext, TeamMember } from './models'
import TeamApi from './team-api'
import TeamUtils from './utils'
import { CircularProgress } from '@material-ui/core'

const ReactTeamContext = createContext<TeamContext>({} as TeamContext)

function TeamContextImpl(): TeamContext {
  const authHook = useAuth()
  const notificationHook = useNotification()
  const [teams, setTeams] = useState<Team[]>([])
  const [initialized, setInitialized] = useState<boolean>(false)
  const [refreshInProgress, setRefreshInProgress] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const user = authHook.user
  if (!user) {
    throw new Error('TeamHook need a logged-in user')
  }

  const getTeam = (teamId: string): Team | null => {
    return teams.find((t) => t.id === teamId) ?? null
  }

  const fetchTeams = useCallback(() => {
    TeamApi.getTeams(user)
      .then((teams: Team[]) => {
        setTeams(teams)
        setErrorMessage(null)
      })
      .catch((reason: unknown) => {
        const message = errorTextFromException(reason)
        setErrorMessage(message)
      })
      .finally(() => {
        setInitialized(true)
        setRefreshInProgress(false)
      })
  }, [user])

  const refresh = (): void => {
    setRefreshInProgress(true)
    fetchTeams()
  }

  const getMedicalTeams = (): Team[] => {
    return teams.filter((team: Team): boolean => team.type === TeamType.medical)
  }

  const getRemoteMonitoringTeams = (): Team[] => {
    return teams.filter(team => team.monitoring?.enabled)
  }

  const inviteMember = async (team: Team, username: string, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    const result = await TeamApi.inviteMember(user.id, team.id, username, role)
    setTeams(result.teams)
  }

  const createTeam = async (team: Partial<Team>): Promise<void> => {
    const apiTeam: Partial<ITeam> = {
      address: team.address,
      email: team.email,
      name: team.name,
      phone: team.phone,
      type: team.type
    }
    await TeamApi.createTeam(apiTeam)
    refresh()
    metrics.send('team_management', 'create_care_team', _.isEmpty(team.email) ? 'email_not_filled' : 'email_filled')
  }

  const editTeam = async (team: Team): Promise<void> => {
    const apiTeam: ITeam = {
      ...team,
      members: []
    }
    await TeamApi.editTeam(apiTeam)
    refresh()
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
    refresh()
  }

  const leaveTeam = async (team: Team): Promise<void> => {
    const ourselve = team.members.find((member) => member.userId === user.id)
    if (!ourselve) {
      throw new Error('We are not a member of the team!')
    }
    if (ourselve.role === TeamMemberRole.admin && ourselve.status === UserInvitationStatus.accepted && TeamUtils.teamHasOnlyOneMember(team)) {
      await TeamApi.deleteTeam(team.id)
      metrics.send('team_management', 'delete_team')
    } else {
      await TeamApi.leaveTeam(user.id, team.id)
      metrics.send('team_management', 'leave_team')
    }
    refresh()
  }

  const removeMember = async (member: TeamMember, teamId: string): Promise<void> => {
    if (member.status === UserInvitationStatus.pending) {
      if (!member.invitationId) {
        throw new Error('Missing invitation!')
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

  useEffect(() => {
    if (!initialized) {
      fetchTeams()
    }
  }, [initialized, fetchTeams])

  return {
    teams,
    initialized,
    errorMessage,
    refreshInProgress,
    refresh,
    getTeam,
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
    joinTeam
  }
}

export const TeamContextProvider: FunctionComponent = ({ children }) => {
  const context = TeamContextImpl()
  return context.initialized
    ? <ReactTeamContext.Provider value={context}>{children}</ReactTeamContext.Provider>
    : <CircularProgress className="centered-spinning-loader" />
}

export const useTeam = (): TeamContext => {
  return useContext(ReactTeamContext)
}
