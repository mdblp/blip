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

import * as teamHookMock from "../../../lib/team";
import { Team } from "../../../lib/team";
import TeamMenu from "../../../components/menus/team-menu";
import { buildTeam, triggerMouseEvent } from "../../common/utils";
import { createMemoryHistory } from "history";
import * as shareLib from "../../../lib/share";
import * as authHookMock from "../../../lib/auth";
import { Session } from "../../../lib/auth";
import User from "../../../lib/auth/user";

jest.mock("../../../lib/share");
jest.mock("../../../lib/team");
jest.mock("../../../lib/auth");
describe("Team Menu", () => {
  let container: HTMLElement | null = null;
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const teams: Team[] = [buildTeam("team1Id", []), buildTeam("team1Id", [])];
  const session: Session = { user: {} as User, sessionToken: "fakeSessionToken", traceToken: "fakeTraceToken" };

  function openMenu(): void {
    const teamMenu = document.getElementById("team-menu");
    triggerMouseEvent("click", teamMenu);
  }

  function mountComponent(): void {
    act(() => {
      render(
        <Router history={history}>
          <TeamMenu />
        </Router>, container);
    });
  }

  beforeAll(() => {
    jest.spyOn(shareLib, "getDirectShares").mockResolvedValue([]);
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { teams };
    });
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return {
        session: () => session,
      };
    });
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

  it("should display number of teams user belongs to", () => {
    mountComponent();
    const teamBadge = container.querySelector("#team-menu-count-badge");
    expect(teams.length.toString()).toEqual(teamBadge.textContent);
  });

  it("should list all the teams user belongs to", () => {
    mountComponent();
    openMenu();
    const teamListItems = document.querySelectorAll("div.team-menu-list-item");
    expect(teams.length).toEqual(teamListItems.length);
  });

  it("should redirect to team details page when clicking on a team name", () => {
    mountComponent();
    const teamToSelect = teams[0];
    openMenu();
    const teamElement = document.getElementById(`team-menu-list-item-${teamToSelect.id}`);
    triggerMouseEvent("click", teamElement);
    expect(history.location.pathname).toBe(`/teams/${teamToSelect.id}`);
  });
});
