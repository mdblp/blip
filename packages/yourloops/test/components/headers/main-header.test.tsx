/**
 * Copyright (c) 2022, Diabeloop
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
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";
import { v4 as uuidv4 } from "uuid";

import { AuthContextProvider, Session } from "../../../lib/auth";
import { INotification, NotificationContextProvider, NotificationType } from "../../../lib/notifications";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { notificationAPIStub } from "../../lib/notifications/utils";
import { TeamContextProvider } from "../../../lib/team";
import { teamAPI } from "../../lib/team/utils";
import { loggedInUsers } from "../../common";
import { triggerMouseEvent } from "../../common/utils";
import MainHeader from "../../../components/header-bars/main-header";
import * as shareLib from "../../../lib/share";

jest.mock("../../../lib/share");

describe("Main Header", () => {
  let container: HTMLElement | null = null;
  const history = createMemoryHistory({ initialEntries: ["/preferences"] });
  const { hcpSession } = loggedInUsers;
  const onClickLeftIcon = jest.fn();

  async function mountComponent(session: Session, withLeftIcon?: boolean): Promise<void> {
    const authContext = createAuthHookStubs(session);

    await act(() => {
      return new Promise((resolve) => {
        render(
          <Router history={history}>
            <AuthContextProvider value={authContext}>
              <TeamContextProvider>
                <NotificationContextProvider api={notificationAPIStub}>
                  <MainHeader withShrinkIcon={withLeftIcon} onClickShrinkIcon={onClickLeftIcon} />
                </NotificationContextProvider>
              </TeamContextProvider>
            </AuthContextProvider>
          </Router>, container, resolve);
      });
    });
  }

  beforeAll(() => {
    jest.spyOn(shareLib, "getDirectShares").mockResolvedValue([]);
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("should redirect to '/' route when clicking on logo", async () => {
    await mountComponent(hcpSession);
    const logo = document.getElementById("header-main-logo");
    triggerMouseEvent("click", logo);
    expect(history.location.pathname).toBe("/");
  });

  it("should redirect to '/notifications' route when clicking on notification icon", async () => {
    await mountComponent(hcpSession);
    const notificationLink = document.getElementById("notification-count-badge");
    triggerMouseEvent("click", notificationLink);
    expect(history.location.pathname).toBe("/notifications");
  });

  it("Should display the number of pending notifications", async () => {
    const notifications: INotification[] = [{
      metricsType: "join_team",
      type: NotificationType.careTeamDoAdmin,
      creator: { userid: hcpSession.user.userid, profile: hcpSession.user.profile },
      creatorId: hcpSession.user.userid,
      date: new Date().toISOString(),
      email: hcpSession.user.username,
      id: uuidv4(),
    }];
    notificationAPIStub.getReceivedInvitations.mockResolvedValue(notifications);
    await mountComponent(hcpSession);
    const notificationBadge = container.querySelector("#notification-count-badge");
    expect(notificationBadge.textContent).toEqual(notifications.length.toString());
  });

  it("Team Menu should not be rendered for Caregivers", async () => {
    await mountComponent(loggedInUsers.caregiverSession);
    const teamMenu = container.querySelector("#team-menu");
    expect(teamMenu).toBeNull();
  });

  it("Team Menu should be rendered for Hcp", async () => {
    await mountComponent(hcpSession);
    const teamMenu = container.querySelector("#team-menu");
    expect(teamMenu).toBeTruthy();
  });

  it("Team Menu should be rendered for Patient", async () => {
    await mountComponent(loggedInUsers.patientSession);
    const teamMenu = container.querySelector("#team-menu");
    expect(teamMenu).toBeTruthy();
  });

  it("Should display left menu icon if activated", async () => {
    await mountComponent(loggedInUsers.patientSession, true);
    const leftIcon = document.getElementById("left-menu-icon");
    expect(leftIcon).toBeTruthy();
  });

  it("Should call onClickLeftIcon when clicking left menu icon", async () => {
    await mountComponent(loggedInUsers.patientSession, true);
    const leftIcon = document.getElementById("left-menu-icon");
    triggerMouseEvent("click", leftIcon);
    expect(onClickLeftIcon).toBeCalledTimes(1);
  });
});

