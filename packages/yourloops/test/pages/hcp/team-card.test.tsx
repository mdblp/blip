/**
 * Copyright (c) 2021, Diabeloop
 * HCP team card tests
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
import Adapter from "enzyme-adapter-react-16";

import enzyme, { mount, shallow, ReactWrapper, ShallowWrapper } from "enzyme";
import { UserInvitationStatus } from "../../../models/generic";
import { TeamMemberRole } from "../../../models/team";
import { Team, loadTeams } from "../../../lib/team";
import { TeamInfo } from "../../../components/team-card"; // TODO move theses tests
import TeamCard, { TeamCardProps } from "../../../pages/hcp/team-card";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";
import { loggedInUsers } from "../../common";

describe("Team card", () => {
  const authHcp = loggedInUsers.hcpSession;
  let teams: Team[] = [];
  const defaultProps: TeamCardProps = {
    team: {} as Team,
    memberRole: TeamMemberRole.admin,
    memberStatus: UserInvitationStatus.accepted,
    onShowAddMemberDialog: jest.fn(),
    onShowEditTeamDialog: jest.fn(),
    onShowLeaveTeamDialog: jest.fn(),
  };

  let component: ReactWrapper | ShallowWrapper | null = null;

  const resetSpys = () => {
    resetTeamAPIStubs();
    (defaultProps.onShowEditTeamDialog as jest.Mock).mockReset();
    (defaultProps.onShowLeaveTeamDialog as jest.Mock).mockReset();
    (defaultProps.onShowAddMemberDialog as jest.Mock).mockReset();
  };

  beforeAll(async () => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
    resetSpys();
    const result = await loadTeams(authHcp, teamAPI.fetchTeams, teamAPI.fetchPatients);
    teams = result.teams;
    defaultProps.team = teams[1];
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
    resetSpys();
  });

  it("should be able to render", () => {
    component = mount(<TeamCard {...defaultProps} />);
    expect(component.find(`#team-card-${defaultProps.team.id}-actions`).length).toBe(1);
    expect(component.find(`#team-card-${defaultProps.team.id}-name`).length).toBe(1);
    expect(component.find(`#team-card-${defaultProps.team.id}-infos`).length).toBe(1);
  });

  it("should render the 2nd addr line if present", () => {
    component = mount(<TeamCard {...defaultProps} />);
    expect(component.find(`#team-card-info-${defaultProps.team.id}-address-value`).find("br").length).toBe(2);
  });

  it("should not render the 2nd addr line if not present", () => {
    const props: TeamCardProps = {
      ...defaultProps,
      team: teams[2],
    };
    component = mount(<TeamCard {...props} />);
    expect(component.find(`#team-card-info-${props.team.id}-address-value`).find("br").length).toBe(1);
  });

  it("should call onShowAddMemberDialog prop function when clicking on the button", () => {
    component = shallow(<TeamCard {...defaultProps} />);
    const btn = component.find(`#team-card-${defaultProps.team.id}-button-add-member`);
    expect(btn.length).toBe(1);
    btn.at(0).simulate("click");
    expect(defaultProps.onShowAddMemberDialog).toHaveBeenCalledTimes(1);
  });

  it("should call onShowEditTeamDialog prop function when clicking on the button", () => {
    component = shallow(<TeamCard {...defaultProps} />);
    const btn = component.find(`#team-card-${defaultProps.team.id}-button-edit`);
    expect(btn.length).toBe(1);
    btn.at(0).simulate("click");
    expect(defaultProps.onShowEditTeamDialog).toHaveBeenCalledTimes(1);
  });

  it("should call onShowLeaveTeamDialog prop function when clicking on the button", () => {
    component = shallow(<TeamCard {...defaultProps} />);
    const btn = component.find(`#team-card-${defaultProps.team.id}-button-leave-team`);
    expect(btn.length).toBe(1);
    btn.at(0).simulate("click");
    expect(defaultProps.onShowLeaveTeamDialog).toHaveBeenCalledTimes(1);
  });

  describe("Info", () => {
    it("should be able to render", () => {
      component = shallow(<TeamInfo id="test" label="label" value="value" icon={<div id="icon" />} />);
      expect(component.find("#team-card-info-test-label").length).toBe(1);
      expect(component.find("#icon").length).toBe(1);
    });

    it("should not render if value is not net", () => {
      component = shallow(<TeamInfo id="test" label="label" value={null} icon={<div id="icon" />} />);
      expect(component.find("#team-card-info-test-label").length).toBe(0);
      expect(component.find("#icon").length).toBe(0);
      expect(component.html()).toBeNull();
    });
  });
});

