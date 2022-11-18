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

import { PostalAddress, UserInvitationStatus } from '../../models/generic'
import { Profile } from '../../models/user'
import { INotification } from '../notifications/models'
import { TeamMemberRole, TeamType, TypeTeamMemberRole } from '../../models/team'
import { Monitoring } from '../../models/monitoring'

export const TEAM_CODE_LENGTH = 9
export const REGEX_TEAM_CODE = /^[0-9]{9}$/
export const REGEX_TEAM_CODE_DISPLAY = /^[0-9]{3} - [0-9]{3} - [0-9]{3}$/

export interface TeamMember {
  userId: string
  email: string
  profile?: Profile | null
  role: TeamMemberRole
  status: UserInvitationStatus
  invitation?: INotification
}

export interface Team {
  readonly id: string
  name: string
  readonly code: string
  readonly type: TeamType
  readonly owner: string
  phone?: string
  email?: string
  address?: PostalAddress
  description?: string
  members: TeamMember[]
  monitoring?: Monitoring
}

export interface TeamContext {
  teams: Array<Readonly<Team>>
  /** true if an initial team fetch has been done */
  initialized: boolean
  /** true if the teams are being retrieved */
  refreshInProgress: boolean
  /** The error message set if there is any error */
  errorMessage: string | null
  /**
   * Refresh the team list & members.
   */
  refresh: () => void
  /**
   * Return the medical teams only
   */
  getMedicalTeams: () => Array<Readonly<Team>>
  /**
   * Return the remote monitoring teams only
   */
  getRemoteMonitoringTeams: () => Array<Readonly<Team>>
  /**
   * Return the team for a teamId or null of not found
   * @param teamId The technical team id
   */
  getTeam: (teamId: string) => Readonly<Team> | null

  /**
   * As an HCP invite a member (non patient)
   * @param team The team to invite the member
   * @param username The member email
   * @param role The member role
   */
  inviteMember: (team: Team, username: string, role: Exclude<TypeTeamMemberRole, 'patient'>) => Promise<void>

  /**
   * Create a new team
   * @param team The team to create
   */
  createTeam: (team: Partial<Team>) => Promise<void>

  /**
   * Change some team infos (name, address...)
   * @param team The updated team
   */
  editTeam: (team: Team) => Promise<void>

  /**
   * Update team alarm configuration
   * @param team The updated team
   */
  updateTeamAlerts: (team: Team) => Promise<void>

  /**
   * Leave a team
   * @param team The team to leave
   */
  leaveTeam: (team: Team) => Promise<void>

  /**
   * Remove a team member from a team
   * @param member The member to remove
   * @param teamId The id of the team the member should be removed from
   */
  removeMember: (member: TeamMember, teamId: string) => Promise<void>

  /**
   * Change a member role
   * @param member The concerned member
   * @param role The new role
   * @param teamId The id of the team the member should have his role changed
   */
  changeMemberRole: (member: TeamMember, role: Exclude<TypeTeamMemberRole, 'patient'>, teamId: string) => Promise<void>

  /**
   * Retreive a team from it's 9 digit code.
   * Used by patient users to join a team
   */
  getTeamFromCode: (code: string) => Promise<Readonly<Team> | null>
  /**
   * Join a specific team.
   */
  joinTeam: (teamId: string) => Promise<void>
}

export interface PatientFilterStats {
  all: number
  pending: number
  directShare: number
  unread: number
  outOfRange: number
  severeHypoglycemia: number
  dataNotTransferred: number
  remoteMonitored: number
  renew: number
}
