/* eslint-disable no-undef */
/**
 * Copyright (c) 2020, Diabeloop
 * Yourloops API client type definition for shoreline
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

import _ from "lodash";

interface Profile {
  fullName: string;
  firstName?: string;
  lastName?: string;
  patient?: unknown;
}

class User {
  constructor() {
    this.userid = "-1";
    this.username = "no-email";
  }

  /** The user id */
  userid: string;
  /** The username (login) */
  username: string;
  /** Roles of the users  */
  roles?: string[]
  /** Emails of the users */
  emails?: string[];
  /** Date of the last accepted terms */
  termsAccepted?: string;
  /** true if the account has been verified */
  emailVerified?: boolean;
  /** User profile */
  profile?: Profile;

  public get isPatient(): boolean {
    return !_.isEmpty(this.profile?.patient);
  }
}

export { User, Profile };
