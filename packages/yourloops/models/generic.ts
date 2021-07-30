/**
 * Copyright (c) 2021, Diabeloop
 * Yourloops API client generic type definition
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 */

/**
 * Strings constants for glycemia units used
 */
enum Units {
  mole = "mmol/L",
  gram = "mg/dL",
}
enum GlyLimits {
  hypoMgdL = 70,
  hyperMgdL = 180,
  hypoMmolL = 3.9,
  hyperMmolL = 10.0,
}
enum FilterType {
  all = "all",
  flagged = "flagged",
  pending = "pending",
  private = "private",
}
enum SortDirection {
  asc = "asc",
  desc = "desc",
}
enum SortFields {
  lastname = "lastname",
  firstname = "firstname",
  email = "email",
  /** Time in range */
  tir = "tir",
  /** Time below range */
  tbr = "tbr",
  /** Last upload date */
  upload = "upload",
}
enum UserInvitationStatus {
  pending = "pending",
  accepted = "accepted",
  rejected = "rejected",
}

interface PostalAddress {
  line1: string;
  line2?: string;
  zip: string;
  city: string;
  country: string;
}

interface HistoryState {
  from?: {
    pathname?: string;
  };
}

/** Number of miliseconds per 24h */
const MS_IN_DAY = 86400000;

export {
  HistoryState,
  PostalAddress,
  Units,
  GlyLimits,
  FilterType,
  SortDirection,
  SortFields,
  UserInvitationStatus,
  MS_IN_DAY,
};
