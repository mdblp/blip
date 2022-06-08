/**
 * Copyright (c) 2021, Diabeloop
 * HCP team members table tests
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
import enzyme, { mount, MountRendererProps, ReactWrapper } from "enzyme";
import renderer from "react-test-renderer";

import { waitTimeout } from "../../../lib/utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { loadTeams, Team, TeamContextProvider, useTeam } from "../../../lib/team";
import TeamMembers, { MembersTableBody, TeamMembersProps } from "../../../pages/hcp/team-members-table";

import { loggedInUsers, teams } from "../../common";
import { TeamMemberRole } from "../../../models/team";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { buildInvite, buildTeam, buildTeamMember, triggerMouseEvent } from "../../common/utils";
import { UserInvitationStatus } from "../../../models/generic";
import * as teamHookMock from "../../../lib/team";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

jest.mock("../../../lib/team");
describe("Team member table", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);

  const onShowRemoveTeamMemberDialog = jest.fn();
  const onSwitchAdminRole = jest.fn();

  let container: HTMLElement | null = null;
  let team: Team;
  const teamId = "fakeTeamId";

  const teamAdmin = buildTeamMember(
    teamId,
    authHcp.user.userid,
    buildInvite(teamId, authHcp.user.userid, TeamMemberRole.admin),
    TeamMemberRole.admin,
    "fake@admin.com",
    "fake admin full name",
    UserInvitationStatus.accepted
  );

  function DummyComponent(): JSX.Element {
    const { teams } = useTeam();
    team = teams[1];
    return (
      <TeamMembers
        team={team}
        onShowRemoveTeamMemberDialog={onShowRemoveTeamMemberDialog}
        onSwitchAdminRole={onSwitchAdminRole}
      />
    );
  }

  function mountTeamMembersComponent(openTable = false): void {
    act(() => render(
      <AuthContextProvider value={authHookHcp}>
        <DummyComponent />
      </AuthContextProvider>, container)
    );
    if (openTable) {
      const header = document.querySelector(`#team-members-list-${team.id}-header`);
      triggerMouseEvent("click", header);
    }
  }

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        teams,
        getNumMedicalMembers: () => 2,
        isUserAdministrator: () => true,
        isUserTheOnlyAdministrator: () => true,
        getMedicalMembers: (): [] => [],
      };
    });
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });
  //
  // async function displayDefaultTable(): Promise<ReactWrapper> {
  //   component = mount(<TestTeamMembersComponent {...defaultProps} />, mountOptions);
  //   component.find(`#team-members-list-${team.id}-header`).last().simulate("click");
  //   component.update();
  //   await waitTimeout(apiTimeout);
  //   return component;
  // }

  it("should display a collapse accordion by default", async () => {
    component = mount(<TestTeamMembersComponent {...defaultProps} />, mountOptions);
    await waitTimeout(apiTimeout);
    expect(component.exists(`#team-members-list-${defaultProps.team.id}`)).toBe(true);
    expect(component.exists(`team-members-list-${defaultProps.team.id}-table`)).toBe(false);
  });

  it("should display the member table when clicking on the accordion", async () => {
    component = await displayDefaultTable();
    expect(component.exists(`#team-members-list-${defaultProps.team.id}-table`)).toBe(true);
  });

  it("should display all the team members", async () => {
    component = await displayDefaultTable();
    const teamId = team.id;
    const { members } = defaultProps.team;
    expect(members.length).toBeGreaterThan(0);
    for (const member of members) {
      const rowId = `#team-members-list-${teamId}-row-${member.user.userid}`;
      expect(component.exists(rowId)).toBe(member.role !== TeamMemberRole.patient);
    }
  });

  describe("MembersTableBody", () => {

    function renderMemberTableBody(props: TeamMembersProps) {
      return renderer.create(
        <AuthContextProvider value={authHookHcp}>
          <MembersTableBody {...props} />
        </AuthContextProvider>
      );
    }

    it("should disable the remove button for pending member that has no invite", () => {
      const memberWithNoInvite = buildTeamMember();
      const props = {
        team: buildTeam(teamId, [memberWithNoInvite, teamAdmin]),
        onShowRemoveTeamMemberDialog: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
        onSwitchAdminRole: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
      };
      const component = renderMemberTableBody(props);
      const rowId = `team-members-list-${props.team.id}-row-${memberWithNoInvite.user.userid}-action-remove`;
      const removePatientIconDisabled = component.root.findByProps({ id: rowId });
      expect(removePatientIconDisabled.props.disabled).toBeTruthy();
      expect(removePatientIconDisabled.props.tooltip).toBe("team-member-cannot-cancel-pending");
    });

    it("should disable the remove button for pending member that was not invited by the current user", () => {
      const memberWithWrongInvite = buildTeamMember(teamId, "fakeUserId", buildInvite("wrongTeamId"));
      const props = {
        team: buildTeam(teamId, [memberWithWrongInvite, teamAdmin]),
        onShowRemoveTeamMemberDialog: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
        onSwitchAdminRole: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
      };
      const component = renderMemberTableBody(props);
      const rowId = `team-members-list-${props.team.id}-row-${memberWithWrongInvite.user.userid}-action-remove`;
      const removePatientIconDisabled = component.root.findByProps({ id: rowId });
      expect(removePatientIconDisabled.props.disabled).toBeTruthy();
      expect(removePatientIconDisabled.props.tooltip).toBe("team-member-cannot-cancel-pending");
    });

    it("should enable the remove button for pending member that was invited by the current user", () => {
      const memberWithInvite = buildTeamMember(teamId, "fakeUserId", buildInvite());
      const props = {
        team: buildTeam(teamId, [memberWithInvite, teamAdmin]),
        onShowRemoveTeamMemberDialog: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
        onSwitchAdminRole: jest.fn().mockReturnValue(waitTimeout(apiTimeout)),
      };
      const component = renderMemberTableBody(props);
      const rowId = `team-members-list-${props.team.id}-row-${memberWithInvite.user.userid}-action-remove`;
      const removePatientIconDisabled = component.root.findByProps({ id: rowId });
      expect(removePatientIconDisabled.props.disabled).toBeFalsy();
      expect(removePatientIconDisabled.props.tooltip).toBe("team-member-remove");
    });
  });

  describe("Admin", () => {
    it("should display the remove button for others team members", async () => {
      component = await displayDefaultTable();

      const teamId = team.id;
      const { members } = defaultProps.team;
      expect(members.length).toBeGreaterThan(0);
      for (const member of members) {
        const rowId = `#team-members-list-${teamId}-row-${member.user.userid}-action-remove`;
        if (member.role === TeamMemberRole.patient) {
          expect(component.exists(rowId)).toBe(false);
        } else if (member.user.userid === loggedInUsers.hcp.userid) {
          expect(component.exists(rowId)).toBe(false);
        } else {
          expect(component.exists(rowId)).toBe(true);
        }
      }
    });

    it("should call onSwitchAdminRole when clicking on the checkbox", async () => {
      component = await displayDefaultTable();

      const teamId = team.id;
      const member = teams[1].members[0];
      const memberId = member.user.userid;
      const event = { target: { name: memberId, checked: true } };
      component.find(`#team-members-list-${teamId}-row-${memberId}-role-checkbox`).last().simulate("change", event);
      // Add a wait here to make react happy, not sure to fully understand why
      component.update();
      await waitTimeout(apiTimeout);

      const spy = defaultProps.onSwitchAdminRole as jest.Mock;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(member, TeamMemberRole.admin);
    });

    it("should call onShowRemoveTeamMemberDialog when clicking on the button", async () => {
      component = await displayDefaultTable();
      const teamId = team.id;
      const member = teams[1].members[1];
      const memberId = member.user.userid;
      component.find(`#team-members-list-${teamId}-row-${memberId}-action-remove`).last().simulate("click");
      component.update();

      const spy = defaultProps.onShowRemoveTeamMemberDialog as jest.Mock;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(member);
    });
  });

  describe("Viewer", () => {
    it("should display certified icon if the member is a certified professional", () => {
      const team = teams[1];
      const certifiedHcp = team.members.find(member => member.user.idVerified).user;

      component = mount(<TestTeamMembersComponent {...{ ...defaultProps, team }} />, mountOptions);
      component.find(`#team-members-list-${team.id}-header`).last().simulate("click");
      component.update();

      expect(component.exists(`#certified-professional-icon-${certifiedHcp.userid}`)).toBeTruthy();
    });

    it("should not display certified icon if the member is not a certified professional", () => {
      const team = teams[1];
      const patient = team.members.find(member => !member.user.idVerified).user;

      component = mount(<TestTeamMembersComponent {...{ ...defaultProps, team }} />, mountOptions);
      component.find(`#team-members-list-${team.id}-header`).last().simulate("click");
      component.update();

      expect(component.exists(`#certified-professional-icon-${patient.userid}`)).toBeFalsy();
    });

    it("should not display the remove team member button and switch role checkbox must be disabled", async () => {
      const props: TeamMembersProps = {
        ...defaultProps,
        team: teams[2],
      };
      component = mount(<TestTeamMembersComponent {...props} />, mountOptions);
      const teamId = props.team.id;
      component.find(`#team-members-list-${teamId}-header`).last().simulate("click");
      component.update();
      await waitTimeout(apiTimeout);
    });

    it("should not display the remove team member button and switch role checkbox must be disabled", async () => {
      const props: TeamMembersProps = {
        ...defaultProps,
        team: teams[2],
      };
      component = mount(<TestTeamMembersComponent {...props} />, mountOptions);
      const teamId = props.team.id;
      component.find(`#team-members-list-${teamId}-header`).last().simulate("click");
      component.update();
      await waitTimeout(apiTimeout);

      const { members } = props.team;
      expect(members.length).toBeGreaterThan(0);
      for (const member of members) {
        if (member.role === TeamMemberRole.patient) {
          continue;
        }
        const memberId = member.user.userid;
        expect(component.exists(`#team-members-list-${teamId}-row-${memberId}-action-remove`)).toBe(false);
        expect(component.exists(`#team-members-list-${teamId}-row-${memberId}-role-checkbox`)).toBe(true);
        const checkBox = component.find(`#team-members-list-${teamId}-row-${memberId}-role-checkbox`).last();
        expect(checkBox.prop("disabled")).toBe(true);
      }
    });
  });
});
