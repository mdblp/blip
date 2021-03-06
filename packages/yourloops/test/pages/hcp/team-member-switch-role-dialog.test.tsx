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

import * as React from "react";
import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";
import sinon from "sinon";

import { TeamMemberRole } from "../../../models/team";
import { waitTimeout } from "../../../lib/utils";
import { AuthContextProvider } from "../../../lib/auth";
import { Team, TeamMember, TeamContextProvider, loadTeams } from "../../../lib/team";
import SwitchRoleDialog, { SwitchRoleDialogProps } from "../../../pages/hcp/team-member-switch-role-dialog";
import { SwitchRoleDialogContentProps } from "../../../pages/hcp/types";

import { authHookHcp, authHcp } from "../../lib/auth/hook.test";
import { teamAPI, resetTeamAPIStubs } from "../../lib/team/hook.test";

function testTeamSwitchRoleDialog(): void {
  const apiTimeout = 50;
  const defaultProps: SwitchRoleDialogContentProps = {
    member: {} as TeamMember,
    role: TeamMemberRole.member,
    onDialogResult: sinon.spy(),
  };

  let teams: Team[] = [];
  let component: ReactWrapper | null = null;

  function TestSwitchRoleDialog(props: SwitchRoleDialogProps): JSX.Element {
    return (
      <AuthContextProvider value={authHookHcp}>
        <TeamContextProvider api={teamAPI}>
          <SwitchRoleDialog switchAdminRole={props.switchAdminRole} />
        </TeamContextProvider>
      </AuthContextProvider>
    );
  }

  before(async () => {
    const result = await loadTeams(authHcp, teamAPI.fetchTeams, teamAPI.fetchPatients);
    teams = result.teams;
    defaultProps.member = teams[1].members[0];
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
    (defaultProps.onDialogResult as sinon.SinonSpy).resetHistory();
    resetTeamAPIStubs();
  });

  it("should be closed if switchAdminRole is null", () => {
    component = mount(<SwitchRoleDialog switchAdminRole={null} />);
    expect(component.exists("#team-members-dialog-switch-role")).to.be.false;
    expect(component.html()).to.be.null;
  });

  it("should be closed if switchAdminRole is called with wrong user", async () => {
    const member = teams[1].members[1];
    component = mount(<TestSwitchRoleDialog switchAdminRole={{ ...defaultProps, member }} />);
    await waitTimeout(apiTimeout);
    expect(component.exists("#team-members-dialog-switch-role")).to.be.false;
    expect(component.html()).to.be.a("string").empty;
    const spy = defaultProps.onDialogResult as sinon.SinonSpy;
    expect(spy.calledOnce, "calledOnce").to.be.true;
    expect(spy.calledWith(true), "calledWith(true)").to.be.true;
  });

  it("should not be closed if switchAdminRole exists", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    await waitTimeout(apiTimeout);
    expect(component.exists("#team-members-dialog-switch-role"), "dialog id found").to.be.true;
    expect(component.html(), "html not empty").to.be.a("string").not.empty;
  });

  it("should return false if click on the cancel button", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    component.find("#team-members-dialog-switch-role-button-cancel").last().simulate("click");
    await waitTimeout(apiTimeout);
    const spy = defaultProps.onDialogResult as sinon.SinonSpy;
    expect(spy.calledOnce, "calledOnce").to.be.true;
    expect(spy.calledWith(false), "calledWith(false)").to.be.true;
  });

  it("should return true if click on the ok button", async () => {
    component = mount(<TestSwitchRoleDialog switchAdminRole={defaultProps} />);
    component.find("#team-members-dialog-switch-role-button-ok").last().simulate("click");
    await waitTimeout(apiTimeout);
    const spy = defaultProps.onDialogResult as sinon.SinonSpy;
    expect(spy.calledOnce, "calledOnce").to.be.true;
    expect(spy.calledWith(true), "calledWith(true)").to.be.true;
  });
}

export default testTeamSwitchRoleDialog;
