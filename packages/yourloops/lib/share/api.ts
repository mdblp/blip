/**
 * Copyright (c) 2021, Diabeloop
 * Direct patient / caregivers share API calls
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

import bows from "bows";
import { v4 as uuidv4 } from "uuid";

import { UserInvitationStatus } from "../../models/generic";
import { User, UserRoles } from "../../models/shoreline";
import { HttpHeaderKeys } from "../../models/api";
import appConfig from "../config";
import { errorFromHttpStatus } from "../utils";
import { Session } from "../auth";
import { ShareUser } from "./models";

import { waitTimeout } from "../../lib/utils";

const log = bows("ShareApi");

const directSharesDummy: ShareUser[] = [
  {
    status: UserInvitationStatus.accepted,
    user: {
      userid: "abcdef0000",
      role: UserRoles.caregiver,
      username: "caregiver.test-1@diabeloop.fr",
      emails: ["caregiver.test-1@diabeloop.fr"],
      profile: { firstName: "Caregiver", lastName: "Test01", fullName: "Caregiver Test01" },
    },
  },
  {
    status: UserInvitationStatus.accepted,
    user: {
      userid: "abcdef0001",
      role: UserRoles.caregiver,
      username: "caregiver.test-2@diabeloop.fr",
      emails: ["caregiver.test-2@diabeloop.fr"],
      profile: { firstName: "Caregiver", lastName: "Test02", fullName: "Caregiver Test02" },
    },
  },
  {
    status: UserInvitationStatus.pending,
    user: {
      userid: "abcdef0002",
      role: UserRoles.caregiver,
      username: "caregiver.test-3@diabeloop.fr",
      emails: ["caregiver.test-3@diabeloop.fr"],
      profile: { firstName: "Caregiver", lastName: "Test03", fullName: "Caregiver Test03" },
    },
  },
];
const directShares: ShareUser[] = [];

async function getDirectShares(session: Session): Promise<ShareUser[]> {
  log.info("getDirectShares");

  // await waitTimeout(100);
  const { sessionToken, traceToken, user } = session;

  const apiURL = new URL(`/metadata/users/${user.userid}/users`, appConfig.API_HOST);
  const response = await fetch(apiURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.traceToken]: traceToken,
      [HttpHeaderKeys.sessionToken]: sessionToken,
    },
  });

  if (response.ok) {
    const users = (await response.json()) as (User & { roles: string[] })[];
    directShares.splice(0);
    Array.prototype.push.apply(directShares, directSharesDummy);
    for (const user of users) {
      directShares.push({
        status: UserInvitationStatus.accepted,
        user: { ...user, role: Array.isArray(user.roles) && user.roles.length > 1 ? UserRoles.caregiver : UserRoles.patient },
      });
    }
    return directShares;
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

async function addDirectShare(session: Session, email: string): Promise<void> {
  log.info("addDirectShare", session.traceToken, email);

  await waitTimeout(100);

  if (email.match(/@diabeloop.fr$/) === null) {
    return Promise.reject(new Error("A test problem occurred"));
  }

  let shareUser: ShareUser;
  if (session.user.role === UserRoles.patient) {
    shareUser = {
      status: UserInvitationStatus.pending,
      user: {
        userid: uuidv4(),
        role: UserRoles.caregiver,
        username: email,
        emails: [email],
        profile: {
          firstName: "Caregiver",
          lastName: `Test${directShares.length}`,
          fullName: `Caregiver Test${directShares.length}`,
        },
      },
    };
  } else {
    shareUser = {
      status: UserInvitationStatus.pending,
      user: {
        userid: uuidv4(),
        role: UserRoles.patient,
        username: email,
        emails: [email],
        profile: {
          firstName: "Patient",
          lastName: `Test${directShares.length}`,
          fullName: `Patient Test${directShares.length}`,
        },
      },
    };
  }

  directSharesDummy.push(shareUser);
  return Promise.resolve();
}

async function removeDirectShare(session: Session, userId: string): Promise<void> {
  log.info("removeDirectShare", session.traceToken, userId);

  await waitTimeout(100);

  const idx = directShares.findIndex((sh) => sh.user.userid === userId);
  if (idx < 0) {
    return Promise.reject(new Error("User not found"));
  }

  directShares.splice(idx, 1);
  return Promise.resolve();
}

export default {
  getDirectShares,
  addDirectShare,
  removeDirectShare,
};
