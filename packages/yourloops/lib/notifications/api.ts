/**
 * Copyright (c) 2021, Diabeloop
 * API calls to hydrophone
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

import { HttpHeaderKeys, HttpHeaderValues } from "../../models/api";
import HttpStatus from "../http-status-codes";
import appConfig from "../config";
import { Session } from "../auth/models";
import { errorFromHttpStatus } from "../utils";

import { INotification, NotificationAPI } from "./models";

const log = bows("Notifcation API");

async function getInvitations(session: Readonly<Session>, url: URL): Promise<INotification[]> {
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      [HttpHeaderKeys.contentType]: HttpHeaderValues.json,
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
      [HttpHeaderKeys.traceToken]: session.traceToken,
    },
    cache: "no-cache",
  });

  if (response.ok) {
    return response.json() as Promise<INotification[]>;
  } else if (response.status === HttpStatus.StatusNotFound) {
    log.info("No new notification for the current user");
    return Promise.resolve([]);
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

/**
 * Get a notifications for the current user.
 * @param {Readonly<Session>} auth Generally an email
 * @return {Promise<INotification[]>} Return the logged-in user or a promise rejection.
 */
function getReceivedInvitations(session: Readonly<Session>): Promise<INotification[]> {
  const confirmURL = new URL(`/confirm/invitations/${session.user.userid}`, appConfig.API_HOST);
  return getInvitations(session, confirmURL);
}

/**
 * Get a notifications for the current user.
 * @param {Readonly<Session>} auth Generally an email
 * @return {Promise<INotification[]>} Return the logged-in user or a promise rejection.
 */
function getSentInvitations(session: Readonly<Session>): Promise<INotification[]> {
  const confirmURL = new URL(`/confirm/invite/${session.user.userid}`, appConfig.API_HOST);
  return getInvitations(session, confirmURL);
}

async function updateInvitation(session: Readonly<Session>, url: URL, key: string): Promise<void> {
  const response = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      [HttpHeaderKeys.sessionToken]: session.sessionToken,
      [HttpHeaderKeys.traceToken]: session.traceToken,
    },
    cache: "no-cache",
    body: JSON.stringify({ key }),
  });

  if (response.ok) {
    console.info("updateInvitation response:", await response.text());
    return Promise.resolve();
  }

  return Promise.reject(errorFromHttpStatus(response, log));
}

function acceptTeamInvitation(session: Readonly<Session>, key: string): Promise<void> {
  const confirmURL = new URL(`/confirm/accept/team/invite`, appConfig.API_HOST);
  return updateInvitation(session, confirmURL, key);
}

function declineTeamInvitation(session: Readonly<Session>, key: string, teamID: string): Promise<void> {
  const confirmURL = new URL(`/confirm/dismiss/team/invite/${teamID}`, appConfig.API_HOST);
  return updateInvitation(session, confirmURL, key);
}

function acceptDirectShareInvitation(session: Readonly<Session>, key: string, invitedBy: string): Promise<void> {
  // /accept/invite/{userid}/{invitedby} [put]
  const confirmURL = new URL(`/confirm/accept/invite/${session.user.userid}/${invitedBy}`, appConfig.API_HOST);
  return updateInvitation(session, confirmURL, key);
}

function declineDirectShareInvitation(session: Readonly<Session>, key: string, invitedBy: string): Promise<void> {
  // /dismiss/invite/{userid}/{invitedby} [put]
  const confirmURL = new URL(`/confirm/dismiss/invite/${session.user.userid}/${invitedBy}`, appConfig.API_HOST);
  return updateInvitation(session, confirmURL, key);
}

const notificationAPI: NotificationAPI = {
  getReceivedInvitations,
  getSentInvitations,
  acceptTeamInvitation,
  declineTeamInvitation,
  acceptDirectShareInvitation,
  declineDirectShareInvitation,
};
export default notificationAPI;
