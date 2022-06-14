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

import React from "react";
import bows from "bows";
import { INotification, NotificationContext, NotificationProvider } from "./models";
import { useAuth } from "../auth/hook";
import NotificationApi from "./notification-api";

const ReactNotificationContext = React.createContext<NotificationContext>({} as NotificationContext);
const log = bows("NotificationHook");

/** hackish way to prevent 2 or more consecutive loading */
let lock = false;

function NotificationContextImpl(): NotificationContext {
  const authHook = useAuth();
  const [receivedInvitations, setReceivedInvitations] = React.useState<INotification[]>([]);
  const [sentInvitations, setSentInvitations] = React.useState<INotification[]>([]);
  const [initialized, setInitialized] = React.useState(false);
  const session = authHook.session();

  if (session === null) {
    throw new Error("User must be logged-in to use the Notification hook");
  }

  const update = (): void => {
    setInitialized(false);
  };

  const accept = async (notification: INotification): Promise<void> => {
    log.info("Accept invitation", notification);
    await NotificationApi.acceptInvitation(session.user.userid, notification);
    const r = await NotificationApi.getReceivedInvitations(session.user.userid);
    setReceivedInvitations(r);
  };

  const decline = async (notification: INotification): Promise<void> => {
    log.info("Decline invitation", notification);
    await NotificationApi.declineInvitation(session.user.userid, notification);
    const r = await NotificationApi.getReceivedInvitations(session.user.userid);
    setReceivedInvitations(r);
  };

  const cancel = async (notification: INotification): Promise<void> => {
    log.info("Cancel invitation", notification);
    await NotificationApi.cancelInvitation(notification);
    const r = await NotificationApi.getSentInvitations(session.user.userid);
    setSentInvitations(r);
  };

  const inviteRemoteMonitoring = async (teamId: string, userId: string, monitoringEnd: Date, referringDoctor?: string): Promise<void> => {
    await NotificationApi.inviteToRemoteMonitoring(teamId, userId, monitoringEnd, referringDoctor);
  };

  const cancelRemoteMonitoringInvite = async (teamId: string, userId: string): Promise<void> => {
    await NotificationApi.cancelRemoteMonitoringInvite(teamId, userId);
  };

  const initHook = () => {
    if (initialized || lock) {
      return;
    }

    log.info("init");
    lock = true;

    Promise.all([
      NotificationApi.getReceivedInvitations(session.user.userid),
      NotificationApi.getSentInvitations(session.user.userid),
    ]).then((result: [INotification[], INotification[]]) => {
      setReceivedInvitations(result[0]);
      setSentInvitations(result[1]);
    }).catch((reason: unknown) => {
      log.error(reason);
    }).finally(() => {
      setInitialized(true);
      lock = false;
    });
  };

  React.useEffect(initHook, [session, initialized]);

  return {
    initialized,
    receivedInvitations,
    sentInvitations,
    update,
    accept,
    decline,
    cancel,
    inviteRemoteMonitoring,
    cancelRemoteMonitoringInvite,
  };
}

// Hook for child components to get the  object
// and re-render when it changes.
export function useNotification(): NotificationContext {
  return React.useContext(ReactNotificationContext);
}

/**
 *
 */
export function NotificationContextProvider(props: NotificationProvider): JSX.Element {
  const { children, value } = props;
  const notifValue = value ?? NotificationContextImpl(); // eslint-disable-line new-cap
  return (
    <ReactNotificationContext.Provider value={notifValue}>
      {children}
    </ReactNotificationContext.Provider>
  );
}
