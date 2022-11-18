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

import User from './user'
import { LanguageCodes } from '../../models/locales'
import { Preferences, Profile, Settings, UserRoles } from '../../models/user'
import { HcpProfession } from '../../models/hcp-profession'

export enum SignupFormKey {
  AccountRole = 'accountRole',
  Feedback = 'feedback',
  HcpProfession = 'hcpProfession',
  PrivacyPolicy = 'privacyPolicy',
  ProfileCountry = 'profileCountry',
  ProfileFirstname = 'profileFirstname',
  ProfileLastname = 'profileLastname',
  Terms = 'terms'
}

export interface SignupForm {
  accountRole: UserRoles
  feedback?: boolean // Consent to be contacted by Diabeloop
  hcpProfession?: HcpProfession
  preferencesLanguage: LanguageCodes
  privacyPolicy: boolean
  profileCountry: string
  profileFirstname: string
  profileLastname: string
  terms: boolean
}

/**
 * The auth provider hook return values.
 */
export interface AuthContext {
  fetchingUser: boolean
  flagPatient: (userId: string) => Promise<void> // Flag or un-flag one patient
  getFlagPatients: () => string[]
  isLoggedIn: boolean
  logout: () => Promise<void>
  redirectToProfessionalAccountLogin: () => void
  setFlagPatients: (userIds: string[]) => Promise<void> // Set the flagged patient
  completeSignup: (signupForm: SignupForm) => Promise<void>
  switchRoleToHCP: (feedbackConsent: boolean, hcpProfession: HcpProfession) => Promise<void> // Switch user role from caregiver to hcp
  updatePreferences: (preferences: Preferences) => Promise<void>
  updateProfile: (profile: Profile) => Promise<void>
  updateSettings: (settings: Settings) => Promise<void>
  user: Readonly<User> | null
}
