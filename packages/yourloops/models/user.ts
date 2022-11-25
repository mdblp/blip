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

import { Units } from './generic'
import { LanguageCodes } from './locales'
import { MedicalData } from './device-data'
import { HcpProfession } from './hcp-profession'
import { Alarm } from './alarm'
import { Monitoring } from './monitoring'

export enum UserRoles {
  hcp = 'hcp',
  caregiver = 'caregiver',
  patient = 'patient',
  /** Used only for signup-account-selector */
  unset = 'unset'
}

export interface Consent {
  acceptanceTimestamp?: string
  isAccepted?: boolean
}

export interface ProfilePatientFields {
  birthday?: string
  birthPlace?: string
  diagnosisDate?: string
  diagnosisType?: string
  ins?: string
  sex?: string
  ssn?: string
  referringDoctor?: string
  birthFirstName?: string
  birthLastName?: string
  birthNames?: string
  birthPlaceInseeCode?: string
  oid?: string
}

export interface Profile {
  email: string
  fullName: string
  firstName?: string
  lastName?: string
  patient?: ProfilePatientFields
  termsOfUse?: Consent
  trainingAck?: Consent
  privacyPolicy?: Consent
  contactConsent?: Consent
  hcpProfession?: HcpProfession
}

export interface Settings {
  units?: {
    bg?: Units
  }
  country?: string
  a1c?: {
    date: string
    value: string
  }
}

export interface Preferences {
  displayLanguageCode?: LanguageCodes
  patientsStarred?: string[]
}

export interface UserMetadata {
  preferences: Preferences
  profile: Profile
  settings: Settings
}

export interface CompleteSignupPayload extends UserMetadata {
  email: string
  role: UserRoles
}

export interface IUser {
  emails?: string[]
  readonly emailVerified?: boolean
  frProId?: string
  /** A boolean that indicates if the user has certified another account, like eCPS */
  readonly idVerified?: boolean
  /** Main role of the user */
  readonly role: UserRoles
  roles?: UserRoles[]
  readonly userid: string
  readonly username: string
  profile?: Profile | null
  settings?: Settings | null
  preferences?: Preferences | null
  /** Patient medical data. undefined means not fetched, null if the fetch failed */
  medicalData?: MedicalData | null
  alarms?: Alarm | null
  monitoring?: Monitoring
  unreadMessages?: number
}

export enum AuthenticatedUserMetadata {
  Roles = 'http://your-loops.com/roles',
}

export interface AuthenticatedUser {
  [AuthenticatedUserMetadata.Roles]: string[]
  email: string
  email_verified: boolean
  sub: string
  frProId?: string
}
