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

import { MedicalData } from "../../models/device-data";
import { Alarm } from "../../models/alarm";
import { UserInvitationStatus } from "../../models/generic";
import { INotification } from "../notifications";
import { Monitoring } from "../../models/monitoring";

interface PatientTeam {
  code: string;
  invitation?: INotification;
  status: UserInvitationStatus;
  teamId: string;
  teamName: string;
}

interface PatientProfile {
  birthdate?: Date;
  firstName?: string;
  fullName: string;
  lastName?: string;
  email: string;
}

interface PatientSettings {
  a1c?: {
    date: string;
    value: string;
  };
  system?: string;
}

interface PatientMetadata {
  alarm: Alarm;
  flagged?: boolean;
  /** Patient medical data. undefined means not fetched, null if the fetch failed */
  medicalData?: MedicalData | null;
  unreadMessagesSent: number;
}

interface Patient {
  profile: PatientProfile;
  settings: PatientSettings;
  metadata: PatientMetadata;
  monitoring?: Monitoring;
  teams: PatientTeam[];
  readonly userid: string;
}

export { Patient, PatientTeam };
