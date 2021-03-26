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

import bows from "bows";
import _ from "lodash";

// import { APIErrorResponse } from "models/error";
import { HttpHeaderKeys, HttpHeaderValues } from "../../models/api";
import HttpStatus from "../http-status-codes";
import { Session } from "../auth/models";
import { UserRoles } from "../../models/shoreline";
import { INotification, NotificationType } from "./models";
import appConfig from "../config";

const log = bows("Notifcation API");

function format(notif: any): INotification {
  return {
    type: notif.type,
    creator: {
      userid: notif.creator.userid,
      profile: {
        fullName: notif.creator.profile.fullName,
      },
      role: UserRoles.patient,
    },
    created: notif.created,
    target: "0", //FIXME wait the api update
  };
}

/**
 * Get a notifications for a userId.
 * @param {string} username Generally an email
 * @param {string} password The account password
 * @param {string} traceToken A generated uuidv4 trace token
 * @return {Promise<User>} Return the logged-in user or a promise rejection.
 */
async function getInvitations(auth: Readonly<Session>, userId: string): Promise<INotification[]> {
  log.debug(userId);
  const fakeNotif1: INotification = {
    created: new Date().toISOString(),
    creator: {
      userid: "0",
      profile: {
        fullName: "Jean Dujardin",
      },
      role: UserRoles.hcp,
    },
    type: NotificationType.careteam,
    target: "Service de Diabétologie CH Angers",
  };
  const fakeNotif2: INotification = {
    created: "2021-02-18T10:00:00",
    creator: {
      userid: "1",
      profile: {
        fullName: "Jeanne Dubois",
      },
      role: UserRoles.patient,
    },
    type: NotificationType.directshare,
    target: "1", // CreatorId
  };
  const fakeNotif3: INotification = {
    created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday date
    creator: {
      // creator
      userid: "2",
      profile: {
        fullName: "Bob l'eponge",
      },
      role: UserRoles.hcp,
    },
    type: NotificationType.careteam,
    target: "Crabe croustillant", // TeamID
  };
  const notifs: INotification[] = [fakeNotif1, fakeNotif2, fakeNotif3];


  if (_.isEmpty(auth?.user?.userid)) {
    log.error("forbidden call to Account Validation api, user id is missing");
    throw new Error("error-http-40x");
  }

  const confirmURL = new URL(
    `/confirm/invitations/${auth?.user?.userid}`,
    appConfig.API_HOST
  );

  const response = await fetch(confirmURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.sessionToken]: auth.sessionToken,
      [HttpHeaderKeys.traceToken]: auth.traceToken,
    },
    cache: "no-cache",
  });

  await response.json()
    .then(res => res.map((notif: any) => notifs.push(format(notif))));

  log.debug("return object", notifs);

  if (response.ok) {
    return Promise.resolve(notifs);
  }

  log.error(response?.status, response?.statusText);

  switch (response?.status) {
    case HttpStatus.StatusServiceUnavailable:
    case HttpStatus.StatusInternalServerError:
      throw new Error("error-http-500");
    default:
      // throw new Error("error-http-40x");
      return Promise.resolve(notifs); // FIXME
  }
}

async function accept(
  auth: Readonly<Session>,
  creatorId: string | undefined,
  type: NotificationType
): Promise<void> {
  log.debug(auth, creatorId, type);
  return Promise.resolve();
}

async function decline(
  auth: Readonly<Session>,
  creatorId: string | undefined,
  type: NotificationType
): Promise<void> {
  log.debug(auth, creatorId, type);
  return Promise.resolve();
}

export default {
  getInvitations,
  accept,
  decline,
};
