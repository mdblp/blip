/* eslint-disable indent */
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

export enum ActionType {
  accept = "accept",
  decline = "dismiss",
}

function format(notif: any, index:number): INotification {
  return {
    id: notif.key,
    type: notif.type,
    creator: {
      userid: notif.creator.userid,
      profile: {
        fullName: notif.creator.profile.fullName,
      },
      role: UserRoles.patient,
    },
    created: notif.created,
    target: { id: index.toString(), name: "test" }, //FIXME wait the api update
  };
}

function buildUrl(baseUrl: string, userid: string | undefined, targetId: string | undefined): URL {
  if (_.isEmpty(userid)) {
    log.error("forbidden call to api, user id is missing");
    throw new Error("error-http-40x");
  }

  if (targetId === undefined || _.isEmpty(targetId)) {
    log.error("forbidden call to api, targetId is missing");
    throw new Error("error-http-40x");
  }

  return new URL(
    `/confirm/${baseUrl}/invite/${userid}/${targetId}`,
    appConfig.API_HOST
  );
}

async function updateInvitation(
  url: URL,
  id: string | undefined,
  auth: Readonly<Session>
): Promise<void> {
  if (id === undefined || _.isEmpty(id)) {
    log.error("forbidden call to api, id is missing");
    throw new Error("error-http-40x");
  }

  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      [HttpHeaderKeys.sessionToken]: auth.sessionToken,
      [HttpHeaderKeys.traceToken]: auth.traceToken,
    },
    cache: "no-cache",
    body: JSON.stringify({ key: id }),
  });

  if (response.ok) {
    return Promise.resolve();
  }

  log.error(response?.status, response?.statusText);

  switch (response?.status) {
    case HttpStatus.StatusServiceUnavailable:
    case HttpStatus.StatusInternalServerError:
      throw new Error("error-http-500");
    default:
      throw new Error("error-http-40x");
  }
}

/**
 * Get a notifications for a userId.
 * @param {Readonly<Session>} auth Generally an email
 * @param {string} userId The account password
 * @return {Promise<INotification[]>} Return the logged-in user or a promise rejection.
 */
async function getPendingInvitations(
  auth: Readonly<Session>,
  userId: string
): Promise<INotification[]> {
  log.debug(userId);
  // const fakeNotif1: INotification = {
  //   id: "10",
  //   created: new Date().toISOString(),
  //   creator: {
  //     userid: "0",
  //     profile: {
  //       fullName: "Jean Dujardin",
  //     },
  //     role: UserRoles.hcp,
  //   },
  //   type: NotificationType.careteam,
  //   target: { id: "110", name: "Service de Diabétologie CH Angers" },
  // };
  // const fakeNotif2: INotification = {
  //   id: "11",
  //   created: "2021-02-18T10:00:00",
  //   creator: {
  //     userid: "1",
  //     profile: {
  //       fullName: "Jeanne Dubois",
  //     },
  //     role: UserRoles.patient,
  //   },
  //   type: NotificationType.directshare,
  // };
  // const fakeNotif3: INotification = {
  //   id: "12",
  //   created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // yesterday date
  //   creator: {
  //     // creator
  //     userid: "2",
  //     profile: {
  //       fullName: "Bob l'eponge",
  //     },
  //     role: UserRoles.hcp,
  //   },
  //   type: NotificationType.careteam,
  //   target: { id: "111", name:  "Crabe croustillant" }, // TeamID
  // };
  const notifs: INotification[] = [];

  if (_.isEmpty(auth?.user?.userid)) {
    log.error("forbidden call to api, user id is missing");
    throw new Error("error-http-40x");
  }

  const confirmURL = new URL(`/confirm/invitations/${auth?.user?.userid}`, appConfig.API_HOST);

  const response = await fetch(confirmURL.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.sessionToken]: auth.sessionToken,
      [HttpHeaderKeys.traceToken]: auth.traceToken,
    },
    cache: "no-cache",
  });

  if (response.ok) {
    await response.json().then((res) => res.map((notif: any, index: number) => notifs.push(format(notif, index))));
    log.debug("return object", notifs);
    return Promise.resolve(notifs);
  }

  switch (response?.status) {
    case HttpStatus.StatusServiceUnavailable:
    case HttpStatus.StatusInternalServerError:
        log.error(response?.status, response?.statusText);
      throw new Error("error-http-500");
    default:
      log.debug(response?.status, response?.statusText);
      return Promise.resolve(notifs);
  }
}

async function accept(
  auth: Readonly<Session>,
  id: string,
  creatorId: string | undefined,
  targetId: string | undefined,
  type: NotificationType
): Promise<void> {
  log.debug(auth.traceToken, creatorId, type);

  let url;

  switch (type) {
    case NotificationType.careteam:
      url = buildUrl(`${ActionType.accept}/team`, auth?.user?.userid, targetId);
      await updateInvitation(url, id, auth);
      break;
    case NotificationType.directshare:
      url = buildUrl(`${ActionType.accept}`, auth?.user?.userid, creatorId);
      await updateInvitation(url, id, auth);
      break;
    default:
      log.error("invalid notification type use to call notification api");
      throw new Error("error-http-40x");
  }
}

async function decline(
  auth: Readonly<Session>,
  id: string,
  creatorId: string | undefined,
  targetId: string | undefined,
  type: NotificationType
): Promise<void> {

  log.debug(auth.traceToken, auth?.user?.userid, creatorId, type, targetId);

  let url;

  switch (type) {
    case NotificationType.careteam:
      url = buildUrl(`${ActionType.decline}/team`, auth?.user?.userid, targetId);
      await updateInvitation(url, id, auth);
      break;
    case NotificationType.directshare:
      url = buildUrl(`${ActionType.decline}`, auth?.user?.userid, creatorId);
      await updateInvitation(url, id, auth);
      break;
    default:
      log.error("invalid notification type use to call notification api");
      throw new Error("error-http-40x");
  }
}

export default {
  getPendingInvitations,
  accept,
  decline,
};
