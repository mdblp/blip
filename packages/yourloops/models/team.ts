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

/*
 * TODO: Review me when we have the team API
 */

import { Profile, Settings, Preferences } from './user'
import { UserInvitationStatus, PostalAddress } from './generic'
import { Alarm } from './alarm'
import { Monitoring } from './monitoring'

export enum TeamType {
  medical = 'medical',
  /** A team for patient: to whom the patient share his data */
  caregiver = 'caregiver',
  /** Virtual team for hcp & caregiver mostly: share 1 to 1 -> which patients share with me */
  private = 'private',
}

export enum TeamMemberRole {
  admin = 'admin',
  member = 'member',
  patient = 'patient',
}

export type TypeTeamMemberRole = keyof typeof TeamMemberRole

/**
 * Team member (API view)
 */
export interface ITeamMember {
  userId: string
  teamId: 'private' | string
  email: string
  role: TeamMemberRole
  invitationStatus: UserInvitationStatus
  profile?: Profile | null
  settings?: Settings | null
  preferences?: Preferences | null
  idVerified: boolean
  alarms?: Alarm
  monitoring?: Monitoring
  unreadMessages?: number
}

/**
 * Team interface (API view)
 */
export interface ITeam {
  readonly id: string
  name: string
  readonly code: string
  readonly type: TeamType
  phone?: string
  email?: string
  address?: PostalAddress
  members: ITeamMember[]
  monitoring?: Monitoring
}
