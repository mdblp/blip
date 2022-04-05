/**
 * Copyright (c) 2021-2022, Diabeloop
 * Profile page tests
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
import { loadTeams, Team, TeamContextProvider } from "../../../lib/team";
import TeamMenu from "../../../components/menus/team-menu";
import { teamAPI } from "../../lib/team/utils";
import { AuthContextProvider, Session } from "../../../lib/auth";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { loggedInUsers } from "../../common";
import { NotificationContextProvider } from "../../../lib/notifications";
import { stubNotificationContextValue } from "../../lib/notifications/utils";
import { triggerMouseClick } from "../../common/utils";

describe("Team Menu", () => {
  let container: HTMLElement | null = null;
  let filteredTeams: Team[];
  const { hcpSession } = loggedInUsers;

  function openMenu(): void {
    const teamMenu = document.getElementById("team-menu");
    triggerMouseClick(teamMenu);
  }

  async function mountComponent(session: Session): Promise<void> {
    const context = createAuthHookStubs(session);
    const { teams } = await loadTeams(hcpSession, teamAPI.fetchTeams, teamAPI.fetchPatients);
    filteredTeams = teams.filter(team => team.code !== "private");

    await act(() => {
      return new Promise((resolve) => {
        render(
          <AuthContextProvider value={context}>
            <NotificationContextProvider value={stubNotificationContextValue}>
              <TeamContextProvider teamAPI={teamAPI}>
                <TeamMenu />
              </TeamContextProvider>
            </NotificationContextProvider>
          </AuthContextProvider>, container, resolve);
      });
    });
  }

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

  it("should display number of teams user belongs to", async () => {
    await mountComponent(hcpSession);
    const teamBadge = container.querySelector("#team-menu-count-badge");
    expect(filteredTeams.length.toString()).toEqual(teamBadge.textContent);
  });

  it("should list all the teams user belongs to", async () => {
    await mountComponent(hcpSession);
    openMenu();
    const teamListItems = document.querySelectorAll("li.team-menu-list-item");
    expect(filteredTeams.length).toEqual(teamListItems.length);
  });
});
