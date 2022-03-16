/**
 * Copyright (c) 2021, Diabeloop
 * Teams hook tests
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
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { Team, TeamContext, TeamContextProvider, TeamMember, TeamUser, useTeam } from "../../../lib/team";
import { UserInvitationStatus } from "../../../models/generic";
import { loggedInUsers } from "../../common";
import { directShareAPI } from "../direct-share/hook";
import { teamAPI } from "./utils";
import { createAuthHookStubs } from "../auth/utils";

describe("Team hook", () => {

  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  let container: HTMLElement | null = null;

  let teamHook: TeamContext;

  async function mountComponent(): Promise<void> {
    const DummyComponent = (): JSX.Element => {
      teamHook = useTeam();
      return (<div />);
    };
    await act(() => {
      return new Promise(resolve => render(
        <AuthContextProvider value={authHookHcp}>
          <TeamContextProvider teamAPI={teamAPI} directShareAPI={directShareAPI}>
            <DummyComponent />
          </TeamContextProvider>
        </AuthContextProvider>,
        container, resolve)
      );
    });
  }

  beforeEach(async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    await mountComponent();
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  describe("isUserInvitationPending", () => {
    it("should return true when team user has a pending status in given team", () => {
      const teamId = "fakeTeamId";
      const teamUser: TeamUser = {
        members: [
            {
              team: { id: teamId } as Team,
              status: UserInvitationStatus.pending,
            } as TeamMember,
        ],
      } as TeamUser;

      const res = teamHook.isUserInvitationPending(teamUser, teamId);
      expect(res).toBe(true);
    });

    it("should return false when team user does not have a pending status in given team", () => {
      const teamId = "fakeTeamId";
      const teamUser: TeamUser = {
        members: [
            {
              team: { id: teamId } as Team,
              status: UserInvitationStatus.accepted,
            } as TeamMember,
        ],
      } as TeamUser;

      const res = teamHook.isUserInvitationPending(teamUser, teamId);
      expect(res).toBe(false);
    });

    describe("isInAtLeastATeam", () => {
      it("should return false when team user does not have an accepted status in any team", () => {
        const teamUser: TeamUser = {
          members: [
              {
                team: { id: "teamId1" } as Team,
                status: UserInvitationStatus.pending,
              } as TeamMember,
              {
                team: { id: "teamId2" } as Team,
                status: UserInvitationStatus.pending,
              } as TeamMember,
          ],
        } as TeamUser;

        const res = teamHook.isInAtLeastATeam(teamUser);
        expect(res).toBe(false);
      });

      it("should return true when team user does has an accepted status in a team", () => {
        const teamUser: TeamUser = {
          members: [
              {
                team: { id: "teamId1" } as Team,
                status: UserInvitationStatus.pending,
              } as TeamMember,
              {
                team: { id: "teamId2" } as Team,
                status: UserInvitationStatus.accepted,
              } as TeamMember,
          ],
        } as TeamUser;

        const res = teamHook.isInAtLeastATeam(teamUser);
        expect(res).toBe(true);
      });
    });
  });
});
