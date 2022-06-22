/**
 * Copyright (c) 2021, Diabeloop
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

import _ from "lodash";
import { MedicalData } from "../../models/device-data";
import { Consent, IUser, Preferences, Profile, Settings, UserRoles } from "../../models/user";
import config from "../config";

class User implements IUser {
  emails?: string[];
  emailVerified: boolean;
  frProId?: string;
  idVerified?: boolean;
  latestConsentChangeDate: Date;
  medicalData?: MedicalData | null;
  preferences?: Preferences | null;
  profile?: Profile | null;
  role: UserRoles;
  settings?: Settings | null;
  userid: string;
  username: string;

  constructor(u: IUser | User) {
    // TODO validate the user before
    this.userid = u.userid;
    this.username = u.username;
    this.frProId = u.frProId;
    this.idVerified = u.idVerified;

    if (u.role) {
      this.role = u.role;
    } else {
      const roles = (u as IUser).roles;
      if (Array.isArray(roles) && roles.length > 0) {
        this.role = roles[0];
      } else {
        this.role = UserRoles.unverified;
      }
    }

    this.emailVerified = u.emailVerified === true;
    if (Array.isArray(u.emails)) {
      this.emails = Array.from(u.emails);
    } else {
      this.emails = [this.username];
    }
    this.profile = u.profile ? _.cloneDeep(u.profile) : null;
    this.settings = u.settings ? _.cloneDeep(u.settings) : null;
    this.preferences = u.preferences ? _.cloneDeep(u.preferences) : null;
    this.medicalData = u.medicalData ? _.cloneDeep(u.medicalData) : null;

    if (u instanceof User) {
      this.latestConsentChangeDate = u.latestConsentChangeDate;
    } else if (config.LATEST_TERMS) {
      this.latestConsentChangeDate = new Date(config.LATEST_TERMS);
    } else {
      this.latestConsentChangeDate = new Date(0);
    }
  }

  /**
   * Return the user first name
   */
  get firstName(): string {
    return this.profile?.firstName ?? "";
  }

  /**
   * Return the user last name
   */
  get lastName(): string {
    return this.profile?.lastName ?? this.profile?.fullName ?? this.username;
  }

  get fullName(): string {
    return this.profile?.fullName || this.username;
  }

  /**
   * Check If the user should update their Hcp Profession at login.
   * @description the first login is determined by null consents object
   */
  shouldUpdateHcpProfession(): boolean {
    return this.role === UserRoles.hcp && this.profile?.hcpProfession === undefined;
  }

  isUserHcp() {
    return this.role === UserRoles.hcp;
  }

  isUserPatient() {
    return this.role === UserRoles.patient;
  }

  isUserCaregiver() {
    return this.role === UserRoles.caregiver;
  }

  /**
   * Check the given consent against the latest consent publication date
   * @param consent {Consent}
   * @returns true if the latest consent date is greater than the given consent
   */
  checkConsent(consent: Consent): boolean {
    if (consent.acceptanceTimestamp) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      const acceptDate = new Date(consent.acceptanceTimestamp);
      if (!Number.isFinite(acceptDate.getTime())) {
        // if acceptDate is not a valid formatted date string, get user to re-accept terms
        return true;
      }
      return this.latestConsentChangeDate >= acceptDate;
    }
    return true;
  }

  /**
   * Check If the user should accept his consent at a first login.
   * @description the first login is determined by null consents object
   */
  shouldAcceptConsent(): boolean {
    return !(this.profile?.termsOfUse?.isAccepted && this.profile.privacyPolicy?.isAccepted);
  }

  /**
   * Check If the user should renew his consent.
   */
  shouldRenewConsent(): boolean {
    if (!this.profile?.termsOfUse || !this.profile.privacyPolicy) {
      return true;
    }
    return (this.checkConsent(this.profile.termsOfUse) || this.checkConsent(this.profile.privacyPolicy));
  }

  isFirstLogin(): boolean {
    return !this.profile;
  }

  hasToAcceptNewConsent(): boolean {
    return this.isUserPatient() && !this.isFirstLogin() && this.shouldAcceptConsent();
  }

  hasToRenewConsent(): boolean {
    return !this.isFirstLogin() && this.shouldRenewConsent();
  }

  getParsedFrProId(): string | null {
    if (this.frProId) {
      const parsedId = this.frProId.split(":");
      return parsedId[2];
    }
    return null;
  }
}

export default User;
