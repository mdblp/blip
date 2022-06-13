/**
 * Copyright (c) 2021, Diabeloop
 * Auth hook tests
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
import { render } from "react-dom";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { waitTimeout } from "../../../lib/utils";
import * as authHookMock from "../../../lib/auth/hook";
import { Session } from "../../../lib/auth";
import { INotification, NotificationContext, NotificationType } from "../../../lib/notifications/models";
import { NotificationContextProvider, useNotification } from "../../../lib/notifications/hook";
import { loggedInUsers } from "../../common";
import User from "../../../lib/auth/user";
import NotificationApi from "../../../lib/notifications/notification-api";

jest.mock("../../../lib/auth/hook");
describe("Notification hook", () => {

  const session: Session = { user: {} as User, sessionToken: "fakeSessionToken", traceToken: "fakeTraceToken" };

  let container: HTMLDivElement | null = null;
  let notifications: NotificationContext | null = null;

  jest.spyOn(NotificationApi, "getReceivedInvitations").mockResolvedValue([]);
  jest.spyOn(NotificationApi, "getSentInvitations").mockResolvedValue([]);
  jest.spyOn(NotificationApi, "cancelInvitation").mockResolvedValue();
  jest.spyOn(NotificationApi, "declineInvitation").mockResolvedValue();
  jest.spyOn(NotificationApi, "acceptInvitation").mockResolvedValue();

  const initNotificationContext = async (): Promise<void> => {
    const DummyComponent = (): JSX.Element => {
      notifications = useNotification();
      return (<div />);
    };
    await act(() => {
      return new Promise(resolve => render(
        <BrowserRouter>
          <NotificationContextProvider>
            <DummyComponent />
          </NotificationContextProvider>
        </BrowserRouter>, container, resolve));
    });
  };

  beforeAll(() => {
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { session: () => session };
    });
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  describe("Initialization", () => {
    it("should initialize", async () => {
      await initNotificationContext();
      expect(notifications.initialized).toBe(true);
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1);
    });
  });

  describe("Update", () => {
    it("should re-fetch invitations from the api", async () => {
      await initNotificationContext();
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1);
      notifications.update();
      await waitTimeout(100);
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(2);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(2);
    });
  });

  describe("Accept", () => {
    it("should call the api to accept the invitation and refresh", async () => {
      await initNotificationContext();
      const currentUser = loggedInUsers.hcp;
      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };
      await notifications.accept(notification);
      await waitTimeout(100);
      expect(NotificationApi.acceptInvitation).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(2);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1);
    });
  });

  describe("Decline", () => {
    it("should call the api to decline the invitation and refresh", async () => {
      await initNotificationContext();
      const currentUser = loggedInUsers.hcp;
      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };
      await notifications.decline(notification);
      await waitTimeout(100);
      expect(NotificationApi.declineInvitation).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(2);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(1);
    });
  });

  describe("Cancel", () => {
    it("should call the api to decline the invitation and refresh", async () => {
      await initNotificationContext();
      const currentUser = loggedInUsers.hcp;
      const caregiver = loggedInUsers.caregiver;
      const notification: INotification = {
        id: uuidv4(),
        metricsType: "join_team",
        type: NotificationType.careTeamProInvitation,
        creator: caregiver,
        creatorId: caregiver.userid,
        date: new Date().toISOString(),
        email: currentUser.username,
        target: {
          id: uuidv4(),
          name: "A team",
        },
      };
      await notifications.cancel(notification);
      await waitTimeout(100);
      expect(NotificationApi.cancelInvitation).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getReceivedInvitations).toHaveBeenCalledTimes(1);
      expect(NotificationApi.getSentInvitations).toHaveBeenCalledTimes(2);
    });
  });
});
