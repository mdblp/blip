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
import renderer, { act } from "react-test-renderer";
import MemberRow, { TeamMembersProps } from "../../../components/team/member-row";
import { teamAPI } from "../../lib/team/utils";
import { TeamContextProvider } from "../../../lib/team";
import { TeamMemberRole } from "../../../models/team";
import { UserInvitationStatus } from "../../../models/generic";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { loggedInUsers } from "../../common";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { getTheme } from "../../../components/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { buildInvite, buildTeam, buildTeamMember } from "../../common/utils";

describe("MemberRow", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const refreshParent = jest.fn();

  function renderMemberRow(props: TeamMembersProps) {
    return renderer.create(
      <ThemeProvider theme={getTheme()}>
        <AuthContextProvider value={authHookHcp}>
          <TeamContextProvider teamAPI={teamAPI}>
            <MemberRow
              team={props.team}
              teamMember={props.teamMember}
              refreshParent={props.refreshParent}
            />
          </TeamContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    );
  }

  it("should display correct information when user is a pending admin", () => {
    const teamId = "teamId";
    const teamMember = buildTeamMember(teamId, "fakeUserId", buildInvite());
    const team = buildTeam(teamId, [teamMember]);
    const id = teamMember.user.userid;
    const props: TeamMembersProps = {
      team,
      teamMember,
      refreshParent,
    };
    const component = renderMemberRow(props);
    expect(component.root.findByProps({ id: `${id}-member-full-name` }).props.children).toEqual("--");
    expect(component.root.findByProps({ id: `${id}-pending-icon` })).not.toBeNull();
    expect(component.root.findByProps({ id: `${id}-member-email` }).props.children).toEqual(teamMember.user.username);
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.checked).toBeTruthy();
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.disabled).toBeTruthy();
  });

  it("should display correct information when user is a pending non admin", () => {
    const teamId = "teamId";
    const teamMember = buildTeamMember(
      teamId,
      "fakeUserId",
      buildInvite(teamId, "fakeUserId", TeamMemberRole.member),
      TeamMemberRole.member,
      "fake@username.com",
      "fake full name",
      UserInvitationStatus.pending
    );
    const team = buildTeam(teamId, [teamMember]);
    const id = teamMember.user.userid;
    const props: TeamMembersProps = {
      team,
      teamMember,
      refreshParent,
    };
    const component = renderMemberRow(props);
    expect(component.root.findByProps({ id: `${id}-member-full-name` }).props.children).toEqual("--");
    expect(component.root.findByProps({ id: `${id}-pending-icon` })).not.toBeNull();
    expect(component.root.findByProps({ id: `${id}-member-email` }).props.children).toEqual(teamMember.user.username);
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.checked).toBeFalsy();
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.disabled).toBeTruthy();
  });

  it("should display correct information when user is a not pending and not admin", () => {
    const teamId = "teamId";
    const teamMember = buildTeamMember(
      teamId,
      "fakeUserId",
      buildInvite(teamId, "fakeUserId", TeamMemberRole.member),
      TeamMemberRole.member,
      "fake@username.com",
      "fake full name",
      UserInvitationStatus.accepted
    );
    const team = buildTeam(teamId, [teamMember]);
    const id = teamMember.user.userid;
    const props: TeamMembersProps = {
      team,
      teamMember,
      refreshParent,
    };
    const component = renderMemberRow(props);
    expect(component.root.findByProps({ id: `${id}-member-full-name` }).props.children).toEqual(teamMember.user.profile.fullName);
    expect(component.root.findAllByProps({ id: `${id}-pending-icon` })).toHaveLength(0);
    expect(component.root.findByProps({ id: `${id}-member-email` }).props.children).toEqual(teamMember.user.username);
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.checked).toBeFalsy();
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.disabled).toBeTruthy();
  });

  it("should enable role checkbox when current user is admin is not the only team member", () => {
    const teamId = "teamId";
    const teamMember = buildTeamMember(
      teamId,
      "fakeUserId",
      buildInvite(teamId, "fakeUserId", TeamMemberRole.member),
      TeamMemberRole.member,
      "fake@username.com",
      "fake full name",
      UserInvitationStatus.accepted
    );
    const loggedInUser = buildTeamMember(
      teamId,
      authHcp.user.userid,
      buildInvite(teamId, authHcp.user.userid, TeamMemberRole.admin),
      TeamMemberRole.admin,
      "fake@admin.com",
      "fake admin full name",
      UserInvitationStatus.accepted
    );
    const team = buildTeam(teamId, [teamMember, loggedInUser]);
    const id = teamMember.user.userid;
    const props: TeamMembersProps = {
      team,
      teamMember,
      refreshParent,
    };
    const component = renderMemberRow(props);
    expect(component.root.findByProps({ id: `${id}-member-full-name` }).props.children).toEqual(teamMember.user.profile.fullName);
    expect(component.root.findAllByProps({ id: `${id}-pending-icon` })).toHaveLength(0);
    expect(component.root.findByProps({ id: `${id}-member-email` }).props.children).toEqual(teamMember.user.username);
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.checked).toBeFalsy();
    expect(component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.disabled).toBeFalsy();
  });

  it("should switch user role to admin when ticking checkbox", async () => {
    const teamId = "teamId";
    const teamMember = buildTeamMember(
      teamId,
      "fakeUserId",
      buildInvite(teamId, "fakeUserId", TeamMemberRole.member),
      TeamMemberRole.member,
      "fake@username.com",
      "fake full name",
      UserInvitationStatus.accepted
    );
    const loggedInUser = buildTeamMember(
      teamId,
      authHcp.user.userid,
      buildInvite(teamId, authHcp.user.userid, TeamMemberRole.admin),
      TeamMemberRole.admin,
      "fake@admin.com",
      "fake admin full name",
      UserInvitationStatus.accepted
    );
    const team = buildTeam(teamId, [teamMember, loggedInUser]);
    const id = teamMember.user.userid;
    const props: TeamMembersProps = {
      team,
      teamMember,
      refreshParent,
    };
    const component = renderMemberRow(props);
    await act(async () => {
      component.root.findByProps({ id: `members-row-${id}-role-checkbox` }).props.onChange({ target: { checked: true } });
      await new Promise(process.nextTick);
    });
    expect(teamAPI.changeMemberRole).toHaveBeenCalled();
  });
});

