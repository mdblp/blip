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

import React, { useCallback, useMemo } from 'react'
import _ from 'lodash'
import bows from 'bows'
import moment from 'moment-timezone'

import { PatientFilterTypes, UserInvitationStatus } from '../../models/generic'
import { MedicalData } from '../../models/device-data'
import { UserRoles } from '../../models/user'
import { ITeam, TeamMemberRole, TeamType } from '../../models/team'

import { errorTextFromException } from '../utils'
import metrics from '../metrics'
import { useAuth } from '../auth'
import { useNotification } from '../notifications/hook'
import { LoadTeams, Team, TeamContext, TeamMember, TeamUser } from './models'
import { Patient, PatientTeam } from '../data/patient'
import { mapTeamUserToPatient } from '../../components/patient/utils'
import TeamApi from './team-api'
import TeamUtils from './utils'
import DirectShareApi from '../share/direct-share-api'
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

  const getPatientsAsTeamUsers = useCallback(() => {
    const patients = new Map<string, TeamUser>()
    const nTeams = teams.length
    for (let i = 0; i < nTeams; i++) {
      const team = teams[i]
      const members = team.members
      const nMembers = members.length
      for (let j = 0; j < nMembers; j++) {
        const member = members[j]
        if (member.role === TeamMemberRole.patient && !patients.has(member.user.userid)) {
          patients.set(member.user.userid, member.user)
        }
      }
    }
    return Array.from(patients.values())
  }, [teams])

  const getPatients = useCallback(() => {
    const teamUsers = getPatientsAsTeamUsers()
    return teamUsers.map(teamUser => mapTeamUserToPatient(teamUser))
  }, [getPatientsAsTeamUsers])

  const buildPatientFiltersStats = useCallback(() => {
    const patients = getPatients()
    return {
      all: patients.filter((patient) => !TeamUtils.isOnlyPendingInvitation(patient)).length,
      pending: patients.filter((patient) => TeamUtils.isInvitationPending(patient)).length,
      directShare: patients.filter((patient) => patient.teams.find(team => team.teamId === 'private')).length,
      unread: patients.filter(patient => patient.metadata.unreadMessagesSent > 0).length,
      outOfRange: patients.filter(patient => patient.metadata.alarm.timeSpentAwayFromTargetActive).length,
      severeHypoglycemia: patients.filter(patient => patient.metadata.alarm.frequencyOfSevereHypoglycemiaActive).length,
      dataNotTransferred: patients.filter(patient => patient.metadata.alarm.nonDataTransmissionActive).length,
      remoteMonitored: patients.filter(patient => patient.monitoring?.enabled).length,
      renew: patients.filter(patient => patient.monitoring?.enabled && patient.monitoring.monitoringEnd && new Date(patient.monitoring.monitoringEnd).getTime() - moment.utc(new Date()).add(14, 'd').toDate().getTime() < 0).length
    }
  }, [getPatients])

  const patientsFilterStats = useMemo(() => buildPatientFiltersStats(), [buildPatientFiltersStats])

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

  const getPatient = (userId: string): Patient | null => {
    // Sorry for the "for", I know it's now forbidden
    // But today it's too late for me to think how to use a magic function
    // to have this info.
    for (const team of teams) {
      for (const member of team.members) {
        if (member.user.userid === userId) {
          return mapTeamUserToPatient(member.user)
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

  const getPatientRemoteMonitoringTeam = (patient: Patient): PatientTeam => {
    if (!patient.monitoring) {
      throw Error('Cannot get patient remote monitoring team as patient is not remote monitored')
    }
    const res = patient.teams.find(team => getRemoteMonitoringTeams().find(t => t.id === team.teamId) !== undefined)
    if (!res) {
      throw Error('Could not find team to which patient is remote monitored')
    }
    return res
  }

  const editPatientRemoteMonitoring = (patient: Patient): void => {
    const user = getUser(patient.userid)
    if (!user) {
      throw Error('Cannot update user monitoring as user was not found')
    }
    user.monitoring = patient.monitoring
    setTeams(teams)
  }

  const filterPatients = (filterType: PatientFilterTypes, search: string, flaggedPatients: string[]): Patient[] => {
    const allPatients = getPatients()
    let patients = TeamUtils.extractPatients(allPatients, filterType, flaggedPatients)
    const searchByName = search.length > 0
    if (searchByName) {
      const searchText = search.toLocaleLowerCase()
      patients = patients.filter((patient: Patient): boolean => {
        const firstName = patient.profile.firstName ?? ''
        if (firstName.toLocaleLowerCase().includes(searchText)) {
          return true
        }
        const lastName = patient.profile.lastName ?? ''
        return lastName.toLocaleLowerCase().includes(searchText)
      })
    }
    return patients
  }

  const invitePatient = async (team: Team, username: string): Promise<void> => {
    const apiInvitation = await TeamApi.invitePatient({ teamId: team.id, email: username })
    const invitation = notificationConversion(apiInvitation)
    if (invitation === null) {
      // Should not be possible
      throw new Error('Invalid invitation type')
    }
    let user = TeamUtils.getUserByEmail(teams, invitation.email)
    if (user === null) {
      user = {
        userid: invitation.id,
        role: UserRoles.patient,
        username,
        emails: [username],
        members: []
      }
    }
    const member: TeamMember = {
      role: TeamMemberRole.patient,
      status: UserInvitationStatus.pending,
      team,
      user,
      invitation
    }
    user.members.push(member)
    team.members.push(member)
    setTeams(teams)
  }

  const inviteMember = async (team: Team, username: string, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    const apiInvitation = await TeamApi.inviteMember({ teamId: team.id, email: username, role })
    const invitation = notificationConversion(apiInvitation)
    if (invitation === null) {
      // Should not be possible
      throw new Error('Invalid invitation type')
    }
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

  const markPatientMessagesAsRead = (patient: Patient): void => {
    const clonedTeams = teams
    clonedTeams.forEach(team => {
      const patientAsTeamUser = team.members.find(member => member.user.userid === patient.userid)
      if (patientAsTeamUser) {
        patientAsTeamUser.user.unreadMessages = 0
      }
    })
    setTeams(clonedTeams)
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

  const updatePatientMonitoring = async (patient: Patient): Promise<void> => {
    if (!patient.monitoring) {
      throw Error('Cannot update patient monitoring with undefined')
    }
    const team = teams.find(t => t.monitoring?.enabled && t.members.find(member => member.user.userid === patient.userid))
    if (!team) {
      throw Error('Cannot find monitoring team in which patient is')
    }
    try {
      await TeamApi.updatePatientAlerts(team.id, patient.userid, patient.monitoring)
    } catch (error) {
      console.error(error)
      throw Error(`Failed to update patient with id ${patient.userid}`)
    }
    refresh(true)
  }

  const leaveTeam = async (team: Team): Promise<void> => {
    const ourselve = team.members.find((member) => member.user.userid === user.id)
    if (_.isNil(ourselve)) {
      throw new Error('We are not a member of the team!')
    }
    log.info('leaveTeam', { ourselve, team })
    if (ourselve.role === TeamMemberRole.patient) {
      await TeamApi.removePatient(team.id, ourselve.user.userid)
      metrics.send('team_management', 'leave_team')
    } else if (ourselve.role === TeamMemberRole.admin && ourselve.status === UserInvitationStatus.accepted && TeamUtils.teamHasOnlyOneMember(team)) {
      await TeamApi.deleteTeam(team.id)
      metrics.send('team_management', 'delete_team')
    } else {
      await TeamApi.leaveTeam(user.id, team.id)
      metrics.send('team_management', 'leave_team')
    }
    const idx = teams.findIndex((t: Team) => t.id === team.id)
    if (idx > -1) {
      teams.splice(idx, 1)
      setTeams(teams)
    } else {
      log.warn('leaveTeam(): Team not found', team)
    }
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

  const removePatient = async (patient: Patient, member: PatientTeam, teamId: string): Promise<void> => {
    if (member.status === UserInvitationStatus.pending) {
      if (_.isNil(member.invitation)) {
        throw new Error('Missing invitation!')
      }
      await notificationHook.cancel(member.invitation)
    }
    if (teamId === 'private') {
      await DirectShareApi.removeDirectShare(patient.userid, user.id)
    } else {
      await TeamApi.removePatient(teamId, patient.userid)
    }

    const team = teams.find(team => team.id === teamId)
    if (!team) {
      throw Error(`Could not find team with id ${teamId}`)
    }
    const memberIndex = team.members.findIndex(member => member.user.userid === patient.userid)
    team.members.splice(memberIndex, 1)
    setTeams(teams)

    if (team.members.length < 1) {
      const isFlagged = authHook.getFlagPatients().includes(patient.userid)
      if (isFlagged) {
        await authHook.flagPatient(patient.userid)
      }
    }
  }

  const changeMemberRole = async (member: TeamMember, role: TeamMemberRole.admin | TeamMemberRole.member): Promise<void> => {
    await TeamApi.changeMemberRole({
      teamId: member.team.id,
      userId: member.user.userid,
      email: member.user.username,
      role
    })
    member.role = role as TeamMemberRole
    setTeams(teams)
    metrics.send('team_management', 'manage_admin_permission', role === 'admin' ? 'grant' : 'revoke')
  }

  const setPatientMedicalData = (userId: string, medicalData: MedicalData | null): void => {
    const user = getUser(userId)
    if (user !== null && user.role === UserRoles.patient) {
      user.medicalData = medicalData
    }
  }

  const getTeamFromCode = async (code: string): Promise<Readonly<Team> | null> => {
    const iTeam = await TeamApi.getTeamFromCode(code)
    return iTeam ? { ...iTeam, members: [] } : null
  }

  const joinTeam = async (teamId: string): Promise<void> => {
    await TeamApi.joinTeam(user.id, teamId)
    refresh(true)
  }

  const initHook = (): void => {
    if (initialized || lock || !notificationHook.initialized) {
      return
    }
    log.info('init')
    lock = true

    TeamUtils.loadTeams(user)
      .then(({ teams, flaggedNotInResult }: LoadTeams) => {
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

        if (flaggedNotInResult.length > 0) {
          // For some reason, the flagged list is not accurate - update it
          log.warn('Missing patients in team list', flaggedNotInResult)
          const validUserIds = authHook.getFlagPatients().filter((userId: string) => !flaggedNotInResult.includes(userId))
          authHook.setFlagPatients(validUserIds)
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
    patientsFilterStats,
    refresh,
    getTeam,
    getUser,
    getPatient,
    getMedicalTeams,
    getRemoteMonitoringTeams,
    getPatientsAsTeamUsers,
    getPatients,
    filterPatients,
    getPatientRemoteMonitoringTeam,
    invitePatient,
    inviteMember,
    markPatientMessagesAsRead,
    createTeam,
    editTeam,
    updatePatientMonitoring,
    editPatientRemoteMonitoring,
    updateTeamAlerts,
    leaveTeam,
    removeMember,
    removePatient,
    changeMemberRole,
    setPatientMedicalData,
    getTeamFromCode,
    joinTeam
  }
}

/**
 * Provider component that wraps your app and makes auth object available to any child component that calls useTeam().
 * @param props for team provider & children
 */
export function TeamContextProvider({ children }: { children: JSX.Element }): JSX.Element {
  const context = TeamContextImpl() // eslint-disable-line new-cap
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
