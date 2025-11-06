/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { type Consent } from './consent.model'
import config from '../../config/config'
import { UserRole } from './enums/user-role.enum'
import { type MedicalData } from '../../data/models/medical-data.model'
import { type Preferences } from './preferences.model'
import { type UserAccount } from './user-account.model'
import { type Settings } from './settings.model'
import { type AuthenticatedUser } from './authenticated-user.model'
import { AuthenticatedUserMetadata } from './enums/authenticated-user-metadata.enum'
import { REGEX_BIRTHDATE } from '../../utils'
import { InformationPage } from '../../dbl-communication/models/page.model'
import { isDblCommunicationAcknowledged } from '../../dbl-communication/storage'

export default class User {
  readonly email: string
  readonly emailVerified: boolean
  readonly latestConsentChangeDate: Date
  readonly latestTrainingDate: Date
  readonly username: string
  id: string
  frProId?: string
  role: UserRole
  medicalData?: MedicalData
  preferences?: Preferences
  account?: UserAccount
  settings?: Settings
  newDblCommunication?: InformationPage

  constructor(authenticatedUser: AuthenticatedUser) {
    this.email = authenticatedUser.email
    this.emailVerified = authenticatedUser.email_verified
    this.id = User.getId(authenticatedUser.sub)
    this.role = authenticatedUser[AuthenticatedUserMetadata.Roles][0] as UserRole
    this.username = authenticatedUser.email
    this.latestConsentChangeDate = new Date(config.LATEST_TERMS ?? 0)
    this.latestTrainingDate = new Date(config.LATEST_TRAINING ?? 0)
  }

  private static getId(sub: string): string {
    const parsedSub = sub.split('|')
    return parsedSub[parsedSub.length - 1]
  }

  get firstName(): string {
    return this.account?.firstName ?? ''
  }

  get lastName(): string {
    return this.account?.lastName ?? this.account?.fullName ?? this.username
  }

  get fullName(): string {
    return this.account?.fullName ?? this.username
  }

  get birthday(): string | undefined {
    if (this.role !== UserRole.Patient) {
      return undefined
    }
    const birthday = this.getRawBirthday()
    return REGEX_BIRTHDATE.test(birthday) ? birthday : ''
  }

  private getRawBirthday(): string {
    const birthday = this.account?.patient?.birthday
    if (birthday && birthday.length > 0 && birthday.includes('T')) {
      return birthday.split('T')[0]
    }
    return birthday
  }

  isUserHcp(): boolean {
    return this.role === UserRole.Hcp
  }

  isUserPatient(): boolean {
    return this.role === UserRole.Patient
  }

  isUserCaregiver(): boolean {
    return this.role === UserRole.Caregiver
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
    if (this.account?.trainingAck) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      const acceptDate = new Date(this.account.trainingAck.acceptanceTimestamp)
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
    return !(this.account?.termsOfUse?.isAccepted && this.account.privacyPolicy?.isAccepted)
  }

  /**
   * Check If the user should renew his consent.
   */
  shouldRenewConsent(): boolean {
    if (!this.account?.termsOfUse || !this.account.privacyPolicy) {
      return true
    }
    return (this.checkConsent(this.account.termsOfUse) || this.checkConsent(this.account.privacyPolicy))
  }

  isFirstLogin(): boolean {
    return this.role === UserRole.Unset
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

  hasToDisplayDblCommunicationPage(): boolean {
    return (
      this.newDblCommunication !== undefined &&
      this.newDblCommunication !== null &&
      !isDblCommunicationAcknowledged(this.newDblCommunication.id)
    )
  }


}
