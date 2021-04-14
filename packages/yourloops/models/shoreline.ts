/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops API client type definition for shoreline
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

import { Units } from "./generic";
import { MedicalData } from "./device-data";
import config from "../lib/config";

enum UserRoles {
  hcp = "hcp",
  caregiver = "caregiver",
  patient = "patient",
}

/** List of job for an heath care practitioners (hcp).
 *  The value are key used in crowding for translation */
enum Jobs {
  diabetologist = "diabetologist",
  doctor = "doctor",
  nurse = "nurse",
  nurseAssistant = "nurse-assistant",
  studyNurse = "study-nurse",
}

interface Consent {
  AcceptanceDate?: string;
  IsAccepted?: boolean;
}

interface Profile {
  fullName: string;
  firstName?: string;
  lastName?: string;
  patient?: Patient;
  job?: Jobs;
  termsOfUse?: Consent;
  privacyPolicy?: Consent;
}

interface Patient {
  birthday?: string;
  diagnosisDate?: string;
  diagnosisType?: string;
}

interface Settings {
  units?: {
    bg?: Units;
  };
  country?: string;
  a1c?: {
    date: string;
    value: number;
  };
}

interface Preferences {
  displayLanguageCode?: "en" | "de" | "es" | "fr" | "it" | "nl";
  patientsStarred?: string[];
}

interface IUser {
  /** The user id */
  readonly userid: string;
  /** The username (login) */
  readonly username: string;
  /** Role of the user */
  readonly role: UserRoles;
  /** Emails of the users */
  emails?: string[];
  /** true if the account has been verified */
  readonly emailVerified?: boolean;
  /** User profile */
  profile?: Profile;
  /** User settings (read-only for patient only?) */
  settings?: Settings;
  /** User preferences */
  preferences?: Preferences;
  /** Patient medical data. undefined means not fetched, null if the fetch failed */
  medicalData?: MedicalData | null;
}

class User implements IUser {
  userid: string;
  username: string;
  role!: UserRoles;
  emails?: string[];
  emailVerified?: boolean;
  profile?: Profile;
  settings?: Settings;
  preferences?: Preferences;
  medicalData?: MedicalData | null;
  latestConsentChangeDate: Date;

  constructor(id: string, name: string) {
    this.userid = id;
    this.username = name;
    this.latestConsentChangeDate = new Date(0);
    if (config.LATEST_TERMS !== undefined) {
      this.latestConsentChangeDate = new Date(config.LATEST_TERMS);
    }
  }

  /**
   * Return the user first name
   */
  getFirstName(): string {
    return this.profile?.firstName ?? "";
  }

  /**
   * Return the user last name
   */
  getLastName(): string {
    return this.profile?.lastName ?? this.profile?.fullName ?? this.username;
  }

  /**
   * Check If the user should accept is consent at a first login.
   * @description the first login is determined by null consents object
   */
  shouldAcceptConsent(): boolean {

    if (this?.profile?.termsOfUse === undefined || this?.profile?.termsOfUse === null) {
      return true;
    }

    if (this?.profile?.privacyPolicy === undefined || this?.profile?.privacyPolicy === null) {
      return true;
    }

    return false;
  }

  /**
   * Check If the user should renew is consent.
   */
  shouldRenewConsent(): boolean {


    if (this?.profile?.termsOfUse === undefined || this?.profile?.termsOfUse === null) {
      return true;
    }

    if (this?.profile?.privacyPolicy === undefined || this?.profile?.privacyPolicy === null) {
      return true;
    }

    return (
      this.checkConsent(this.profile.termsOfUse) ||
      this.checkConsent(this.profile.privacyPolicy)
    );
  }

  /**
   * Check the given consent against the lastest consent publication date
   * @param consent
   * @returns true if the lastest consent date is greater than the given consent
   */
  checkConsent(consent: Consent): boolean {
    if (consent.AcceptanceDate !== undefined) {
      // A `null` is fine here, because `new Date(null).valueOf() === 0`
      let acceptDate = new Date(consent.AcceptanceDate);
      if (isNaN(acceptDate.getTime())) {
        // if acceptDate is not a valid formatted date string, get user to re-accept terms
        acceptDate = new Date(0);
      }
      return acceptDate.valueOf() > 0 && this.latestConsentChangeDate >= acceptDate;
    }

    return false;
  }
}

export { IUser, User, Profile, Settings, Preferences, UserRoles, Jobs };
