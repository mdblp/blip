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
import { PatientData } from "./device-data";

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

interface Profile {
  fullName: string;
  firstName?: string;
  lastName?: string;
  patient?: Patient;
  job?: Jobs;
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

interface ComputedTIR {
  count: {
    high: number;
    low: number;
    target: number;
    veryHigh: number;
    veryLow: number;
  },
  lastCbgTime: string;
  lastTime: {
    high: string | null;
    low: string | null;
    target: string | null;
    veryLow: string | null;
    veryHigh: string | null;
  },
  totalTime: {
    high: number;
    low: number;
    target: number;
    veryHigh: number;
    veryLow: number;
  },
  userId: string;
}

interface MedicalData {
  data?: PatientData;
  range?: {
    startDate: string;
    endDate: string;
  };
  computedTir?: ComputedTIR;
}

interface User {
  /** The user id */
  readonly userid: string;
  /** The username (login) */
  readonly username: string;
  /** Roles of the users  */
  /*readonly*/ roles?: UserRoles[];
  /** Emails of the users */
  emails?: string[];
  /** Date of the last accepted terms */
  readonly termsAccepted?: string;
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

export { User, Profile, Settings, Preferences, UserRoles, Jobs, ComputedTIR, MedicalData };
