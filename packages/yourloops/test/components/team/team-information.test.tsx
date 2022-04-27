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
import renderer from "react-test-renderer";
import { teamAPI } from "../../lib/team/utils";
import { TeamContextProvider } from "../../../lib/team";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { loggedInUsers } from "../../common";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { getTheme } from "../../../components/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import TeamInformation, { TeamInformationProps } from "../../../components/team/team-information";
import { buildTeam } from "../../common/utils";

describe("TeamInformation", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const refresh = jest.fn();

  function renderTeamInformation(props: TeamInformationProps) {
    return renderer.create(
      <ThemeProvider theme={getTheme()}>
        <AuthContextProvider value={authHookHcp}>
          <TeamContextProvider teamAPI={teamAPI}>
            <TeamInformation
              team={props.team}
              refresh={props.refresh}
            />
          </TeamContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    );
  }

  it("should display correct team information", () => {
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
    const props: TeamInformationProps = { team, refresh };
    const address = `${team.address?.line1}\n${team.address?.line2}\n${team.address?.zip}\n${team.address?.city}\n${team.address?.country}`;
    const component = renderTeamInformation(props);
    expect(component.root.findByProps({ id: `team-information-${teamId}-name` }).props.children).toEqual(team.name);
    expect(component.root.findByProps({ id: `team-information-${teamId}-phone` }).props.children).toEqual(team.phone);
    expect(component.root.findByProps({ id: `team-information-${teamId}-code` }).props.children).toEqual(team.code);
    expect(component.root.findByProps({ id: `team-information-${teamId}-address` }).props.children).toEqual(address);
  });
});

