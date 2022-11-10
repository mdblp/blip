/**
 * Copyright (c) 2022, Diabeloop
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

import {
  AuthenticatedUser,
  Consent,
  Preferences,
  Profile,
  Settings,
  AuthenticatedUserMetadata,
  UserRoles
} from '../../models/user'
import { MedicalData } from '../../models/device-data'
import config from '../config'
import { REGEX_BIRTHDATE } from '../utils'

export default class User {
  readonly email: string
  readonly emailVerified: boolean
  readonly latestConsentChangeDate: Date
  readonly latestTrainingDate: Date
  readonly username: string
  id: string
  frProId?: string
  role: UserRoles
  medicalData?: MedicalData
  preferences?: Preferences
  profile?: Profile
  settings?: Settings

  constructor(authenticatedUser: AuthenticatedUser) {
    this.email = authenticatedUser.email
    this.emailVerified = authenticatedUser.email_verified
    this.id = User.getId(authenticatedUser.sub)
    this.role = authenticatedUser[AuthenticatedUserMetadata.Roles][0] as UserRoles
    this.username = authenticatedUser.email
    this.latestConsentChangeDate = new Date(config.LATEST_TERMS ?? 0)
    this.latestTrainingDate = new Date(config.LATEST_TRAINING ?? 0)
  }

  private static getId(sub: string): string {
    const parsedSub = sub.split('|')
    return parsedSub[parsedSub.length - 1]
  }

  get firstName(): string {
    return this.profile?.firstName ?? ''
  }

  get lastName(): string {
    return this.profile?.lastName ?? this.profile?.fullName ?? this.username
  }

  get fullName(): string {
    return this.profile?.fullName ?? this.username
  }

  get birthday(): string | undefined {
    let birthday = this.profile?.patient?.birthday
    if (this.role === UserRoles.patient && birthday) {
      if (birthday.length > 0 && birthday.includes('T')) {
        birthday = birthday.split('T')[0]
      }
      return REGEX_BIRTHDATE.test(birthday) ? birthday : ''
    }
    return undefined
  }

  isUserHcp(): boolean {
    return this.role === UserRoles.hcp
  }

  isUserPatient(): boolean {
    return this.role === UserRoles.patient
  }

  isUserCaregiver(): boolean {
    return this.role === UserRoles.caregiver
  }

  /**
   * Check the given consent against the latest consent publication date
   * @param consent {Consent}
   * @returns true if the latest consent date is greater than the given consent
   */
  checkConsent(consent: Consent): boolean {
    if (consent.acceptanceTimestamp) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      const acceptDate = new Date(consent.acceptanceTimestamp)
      if (!Number.isFinite(acceptDate.getTime())) {
        // if acceptDate is not a valid formatted date string, get user to re-accept terms
        return true
      }
      return this.latestConsentChangeDate >= acceptDate
    }
    return true
  }

  /**
   * Comparing the latest training acknowledgment date of the user to the one provided in the APP
   * If the latest ack is older than the date provided in the app, it means
   * a new training is available
   * @returns a boolean indicating if a new training is available
   */
  newTrainingAvailable(): boolean {
    if (this.profile.trainingAck) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      const acceptDate = new Date(this.profile.trainingAck.acceptanceTimestamp)
      if (!Number.isFinite(acceptDate.getTime())) {
        // if acceptDate is not a valid formatted date string, get user to re-acknowledge training materials
        return true
      }
      return this.latestTrainingDate >= acceptDate
    }
    return true
  }

  /**
   * Check If the user should accept his consent at a first login.
   * @description the first login is determined by null consents object
   */
  shouldAcceptConsent(): boolean {
    return !(this.profile?.termsOfUse?.isAccepted && this.profile.privacyPolicy?.isAccepted)
  }

  /**
   * Check If the user should renew his consent.
   */
  shouldRenewConsent(): boolean {
    if (!this.profile?.termsOfUse || !this.profile.privacyPolicy) {
      return true
    }
    return (this.checkConsent(this.profile.termsOfUse) || this.checkConsent(this.profile.privacyPolicy))
  }

  isFirstLogin(): boolean {
    return this.role === UserRoles.unset
  }

  hasToAcceptNewConsent(): boolean {
    return this.isUserPatient() && !this.isFirstLogin() && this.shouldAcceptConsent()
  }

  hasToRenewConsent(): boolean {
    return !this.isFirstLogin() && this.shouldRenewConsent()
  }

  hasToDisplayTrainingInfoPage(): boolean {
    return this.newTrainingAvailable()
  }
}
