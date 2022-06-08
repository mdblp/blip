/**
 * Copyright (c) 2021, Diabeloop
 * HCP team add dialog member
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
import enzyme, { mount, ReactWrapper } from "enzyme";

import { TeamMemberRole } from "../../../models/team";
import { waitTimeout } from "../../../lib/utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { Team, TeamMember, TeamContextProvider, loadTeams } from "../../../lib/team";
import SwitchRoleDialog, { SwitchRoleDialogProps } from "../../../pages/hcp/team-member-switch-role-dialog";
import { SwitchRoleDialogContentProps } from "../../../pages/hcp/types";

import Adapter from "enzyme-adapter-react-16";
import { loggedInUsers } from "../../common";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";

describe("Team member switch role dialog", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const apiTimeout = 50;
  const defaultProps: SwitchRoleDialogContentProps = {
    member: {} as TeamMember,
    role: TeamMemberRole.member,
    onDialogResult: jest.fn(),
  };

  let teams: Team[] = [];
  let component: ReactWrapper | null = null;

  function TestSwitchRoleDialog(props: SwitchRoleDialogProps): JSX.Element {
    return (
      <AuthContextProvider value={authHookHcp}>
        <TeamContextProvider>
          <SwitchRoleDialog switchAdminRole={props.switchAdminRole} />
        </TeamContextProvider>
      </AuthContextProvider>
    );
  }

  beforeAll(async () => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
    const result = await loadTeams(authHcp, teamAPI.fetchTeams, teamAPI.fetchPatients);
    teams = result.teams;
    defaultProps.member = teams[1].members[0];
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
    (defaultProps.onDialogResult as jest.Mock).mockReset();
    resetTeamAPIStubs();
  });

  it("should be closed if switchAdminRole is null", () => {
    component = mount(<SwitchRoleDialog switchAdminRole={null} />);
    expect(component.exists("#team-members-dialog-switch-role")).toBe(false);
    expect(component.html()).toBeNull();
  });

  it("should be closed if switchAdminRole is called with wrong user", async () => {
    const member = teams[1].members[1];
    component = mount(<TestSwitchRoleDialog switchAdminRole={{ ...defaultProps, member }} />);
    await waitTimeout(apiTimeout);
    expect(component.exists("#team-members-dialog-switch-role")).toBe(false);
    expect(component.html().length).toBe(0);
    const spy = defaultProps.onDialogResult as jest.Mock;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it("should not be closed if switchAdminRole exists", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    await waitTimeout(apiTimeout);
    expect(component.exists("#team-members-dialog-switch-role")).toBe(true);
    expect(component.html().length).toBeGreaterThan(0);
  });

  it("should return false if click on the cancel button", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    component.find("#team-members-dialog-switch-role-button-cancel").last().simulate("click");
    await waitTimeout(apiTimeout);
    const spy = defaultProps.onDialogResult as jest.Mock;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(false);
  });

  it("should return true if click on the ok button", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    component.find("#team-members-dialog-switch-role-button-ok").last().simulate("click");
    await waitTimeout(apiTimeout);
    const spy = defaultProps.onDialogResult as jest.Mock;
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(true);
  });
});

