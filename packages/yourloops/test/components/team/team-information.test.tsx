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
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import ThemeProvider from "@material-ui/styles/ThemeProvider";

import * as teamHookMock from "../../../lib/team";
import { TeamContextProvider } from "../../../lib/team";
import * as authHookMock from "../../../lib/auth";
import { AuthContextProvider } from "../../../lib/auth";
import { getTheme } from "../../../components/theme";
import TeamInformation, { TeamInformationProps } from "../../../components/team/team-information";
import { buildTeam, triggerMouseEvent } from "../../common/utils";
import User from "../../../lib/auth/user";

jest.mock("../../../lib/team");
jest.mock("../../../lib/auth");
describe("TeamInformation", () => {
  const refresh = jest.fn();

  const teamId = "teamId";
  const team = buildTeam(teamId, []);
  team.phone = "012345678";
  team.address = {
    line1: "line 1",
    line2: "line 2",
    zip: "08130",
    city: "Vouilly",
    country: "France",
  };

  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user : { isUserPatient : () => true } as User };
    });
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { isUserAdministrator: jest.fn().mockReturnValue(true) };
    });
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    }
  });

  function getTeamInformationJSX(props: TeamInformationProps) {
    return <ThemeProvider theme={getTheme()}>
      <AuthContextProvider>
        <TeamContextProvider>
          <TeamInformation
            team={props.team}
            refreshParent={props.refreshParent}
          />
        </TeamContextProvider>
      </AuthContextProvider>
    </ThemeProvider>;
  }

  function renderTeamInformation(props: TeamInformationProps = { team, refreshParent: refresh }) {
    act(() => {
      ReactDOM.render(getTeamInformationJSX(props), container);
    });
  }

  it("should display correct team information", () => {
    const address = `${team.address?.line1}\n${team.address?.line2}\n${team.address?.zip}\n${team.address?.city}\n${team.address?.country}`;
    renderTeamInformation();
    expect(document.getElementById(`team-information-${teamId}-name`).innerHTML).toEqual(team.name);
    expect(document.getElementById(`team-information-${teamId}-phone`).innerHTML).toEqual(team.phone);
    expect(document.getElementById(`team-information-${teamId}-code`).innerHTML).toEqual(team.code);
    expect(document.getElementById(`team-information-${teamId}-address`).innerHTML).toEqual(address);
  });

  it("should display button to edit team when user is admin", () => {
    renderTeamInformation();
    expect(document.getElementById("edit-team-button")).not.toBeNull();
  });

  it("should open edit team dialog when clicking on edit team button", () => {
    renderTeamInformation();
    act(() => {
      triggerMouseEvent("click", document.getElementById("edit-team-button"));
    });
    expect(document.getElementById("team-edit-dialog")).not.toBeNull();
  });

  it("should not display button to edit team when user is not admin", () => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { isUserAdministrator: jest.fn().mockReturnValue(false) };
    });
    renderTeamInformation();
    expect(document.getElementById("edit-team-button")).toBeNull();
  });

  it("should display button to leave team when user is patient and team is not a monitoring team", () => {
    const teamWithNoMonitoring = buildTeam(teamId, [], );
    teamWithNoMonitoring.monitoring = undefined;
    renderTeamInformation({ team: teamWithNoMonitoring, refreshParent: refresh });
    expect(document.getElementById("leave-team-button")).not.toBeNull();
  });

  it("should not display button to leave team when user is not patient", () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user : { isUserPatient : () => false } as User };
    });
    renderTeamInformation();
    expect(document.getElementById("leave-team-button")).toBeNull();
  });
});

