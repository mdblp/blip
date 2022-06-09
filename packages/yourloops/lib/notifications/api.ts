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

import HttpStatus from "../http-status-codes";
import { Session } from "../auth/models";

import { INotificationAPI } from "../../models/notification";
import {
  AcceptedNotification,
  INotification,
  NotificationAPI,
  NotificationType,
  RemoteMonitoringNotification,
} from "./models";
import { notificationConversion } from "./utils";
import HttpService from "../../services/http";

const log = bows("Notification API");

async function getInvitations(_session: Readonly<Session>, url: string): Promise<INotification[]> {

  const response = await HttpService.get<INotificationAPI[]>({ url });
  // an equivalent to ok
  if (response.status >= 200 && response.status <= 299) {
    //const notificationsFromAPI = await response.json() as INotificationAPI[];
    if (Array.isArray(response.data)) {
      // TODO remove me when all notifications types are supported
      const notifications: INotification[] = [];
      for (const nfa of response.data) {
        const notification = notificationConversion(nfa);
        if (notification) {
          notifications.push(notification);
        }
      }
      return notifications;
      // END TODO
      // return notificationsFromAPI.map(notificationConversion);
    }
    return Promise.reject(new Error("Invalid response from API"));
  } else if (response.status === HttpStatus.StatusNotFound) {
    log.info("No new notification for the current user");
    return Promise.resolve([]);
  }

  return Promise.reject(new Error(response.statusText));
}

/**
 * Get a notifications for the current user.
 * @param {Readonly<Session>} auth Generally an email
 * @return {Promise<INotification[]>} Return the logged-in user or a promise rejection.
 */
function getReceivedInvitations(session: Readonly<Session>): Promise<INotification[]> {
  const confirmURL = `/confirm/invitations/${session.user.userid}`;
  return getInvitations(session, confirmURL);
}

/**
 * Get a notifications for the current user.
 * @param {Readonly<Session>} auth Generally an email
 * @return {Promise<INotification[]>} Return the logged-in user or a promise rejection.
 */
function getSentInvitations(session: Readonly<Session>): Promise<INotification[]> {
  const confirmURL = `/confirm/invite/${session.user.userid}`;
  return getInvitations(session, confirmURL);
}

async function updateInvitation(_session: Readonly<Session>, url: string, key: string): Promise<void> {

  const response = await HttpService.put<string, AcceptedNotification>({
    url: url.toString(),
    payload: { key : key },
  });

  if (response.status >= 200 && response.status <= 299) {
    log.info("updateInvitation response:", await response.statusText);
    return Promise.resolve();
  }

  return Promise.reject(response.statusText);
}

function acceptInvitation(session: Readonly<Session>, notification: INotification): Promise<void> {
  let confirmURL: string;
  switch (notification.type) {
  case NotificationType.directInvitation:
    confirmURL = `/confirm/accept/invite/${session.user.userid}/${notification.creatorId}`;
    return updateInvitation(session, confirmURL, notification.id);
  case NotificationType.careTeamProInvitation:
  case NotificationType.careTeamPatientInvitation:
    confirmURL = "/confirm/accept/team/invite";
    return updateInvitation(session, confirmURL, notification.id);
  case NotificationType.careTeamMonitoringInvitation:
    confirmURL = `/confirm/accept/team/monitoring/${notification.target?.id}/${session.user.userid}`;
    return updateInvitation(session, confirmURL, notification.id);
  default:
    log.info("TODO accept", notification);
    return Promise.reject(new Error(`Unknown notification ${notification.type}`));
  }
}

async function cancelRemoteMonitoringInvite(_session: Session, teamId: string, userId: string): Promise<void> {

  const response = await HttpService.put<string, string>({
    url: `/confirm/dismiss/team/monitoring/${teamId}/${userId}`,
  });

  if (response.status >= 200 && response.status <= 299) {
    return Promise.resolve();
  }

  return Promise.reject(response.statusText);
}

function declineInvitation(session: Readonly<Session>, notification: INotification): Promise<void> {
  let confirmURL: string;
  switch (notification.type) {
  case NotificationType.directInvitation:
    confirmURL = `/confirm/dismiss/invite/${session.user.userid}/${notification.creatorId}`;
    return updateInvitation(session, confirmURL, notification.id);
  case NotificationType.careTeamProInvitation:
  case NotificationType.careTeamPatientInvitation: {
    const teamId = notification.target?.id;
    if (typeof teamId !== "string") {
      return Promise.reject(new Error("Invalid target team id"));
    }
    confirmURL = `/confirm/dismiss/team/invite/${teamId}`;
    return updateInvitation(session, confirmURL, notification.id);
  }
  case NotificationType.careTeamMonitoringInvitation:
    if (!notification.target) {
      throw Error("Cannot decline notification as team id is not specified");
    }
    return cancelRemoteMonitoringInvite(session, notification.target?.id, session.user.userid);
  default:
    log.info("TODO accept", notification);
    return Promise.reject(new Error(`Unknown notification ${notification.type}`));
  }
}

async function cancelInvitation(_session: Readonly<Session>, notification: INotification): Promise<void> {
  const body: Partial<INotificationAPI> = {
    key: notification.id,
  };

  let id: string | undefined;
  switch (notification.type) {
  case NotificationType.careTeamProInvitation:
  case NotificationType.careTeamPatientInvitation:
    id = notification.target?.id;
    if (typeof id !== "string") {
      throw new Error("Missing or invalid team ID in notification");
    }
    body.target = notification.target;
    break;
  case NotificationType.directInvitation:
    body.email = notification.email;
    break;
  default:
    throw new Error("Invalid notification type");
  }

  const response = await HttpService.post<string, Partial<INotificationAPI>>({
    url: "/confirm/cancel/invite",
    payload: body,
  });

  if (response.status === 200 || response.status === HttpStatus.StatusNotFound) {
    log.info("cancelInvitation response:", await response.statusText);
    return Promise.resolve();
  }

  return Promise.reject(response.statusText);
}

async function inviteToRemoteMonitoring(_session: Session, teamId: string, userId: string, monitoringEnd: Date): Promise<void> {

  const response = await HttpService.post<string, RemoteMonitoringNotification>({
    url: `/confirm/send/team/monitoring/${teamId}/${userId}`,
    payload: { monitoringEnd: monitoringEnd.toJSON() },
  });

  if (response.status >= 200 && response.status <= 299) {
    return Promise.resolve();
  }

  return Promise.reject(response.statusText);
}

const notificationAPI: NotificationAPI = {
  getReceivedInvitations,
  getSentInvitations,
  acceptInvitation,
  declineInvitation,
  cancelInvitation,
  inviteToRemoteMonitoring,
  cancelRemoteMonitoringInvite,
};
export default notificationAPI;
