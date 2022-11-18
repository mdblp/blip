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

enum Units {
  mole = 'mmol/L',
  gram = 'mg/dL',
}

enum FilterType {
  all = 'all',
  flagged = 'flagged',
  pending = 'pending',
  private = 'private',
}

enum PatientFilterTypes {
  all = 'all',
  flagged = 'flagged',
  dataNotTransferred = 'data-not-transferred',
  outOfRange = 'out-of-range',
  pending = 'pending',
  private = 'private',
  remoteMonitored = 'remote-monitored',
  renew = 'renew',
  severeHypoglycemia = 'severe-hypoglycemia',
  unread = 'unread-messages',
}

enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

enum SortFields {
  lastname = 'lastname',
  firstname = 'firstname',
  email = 'email',
  /** Time in range */
  tir = 'tir',
  /** Time below range */
  tbr = 'tbr',
  /** Last upload date */
  upload = 'upload',
}

enum PatientTableSortFields {
  alertHypoglycemic = 'alertHypoglycemic',
  alertTimeTarget = 'alertTimeTarget',
  dataNotTransferred = 'dataNotTransferred',
  flag = 'flag',
  /** Last data update */
  ldu = 'ldu',
  patientFullName = 'patientFullName',
  remoteMonitoring = 'remoteMonitoring',
  system = 'system',
}

enum UserInvitationStatus {
  pending = 'pending',
  accepted = 'accepted',
  rejected = 'rejected',
}

interface PostalAddress {
  line1: string
  line2?: string
  zip: string
  city: string
  country: string
}

interface HistoryState {
  from?: {
    pathname?: string
  }
}

/** Number of miliseconds per 24h */
const MS_IN_DAY = 86400000

export {
  HistoryState,
  PostalAddress,
  Units,
  FilterType,
  SortDirection,
  SortFields,
  PatientTableSortFields,
  UserInvitationStatus,
  MS_IN_DAY,
  PatientFilterTypes
}
