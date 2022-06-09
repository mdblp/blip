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

import { UserInvitationStatus } from "../../../models/generic";
import { TeamMemberRole } from "../../../models/team";
import { Team, useTeam } from "../../../lib/team";
import TeamCard from "../../../pages/hcp/team-card";
import { teams } from "../../common";
import { TeamInfo } from "../../../components/team/team-card";
import * as teamHookMock from "../../../lib/team";
import { triggerMouseEvent } from "../../common/utils";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

jest.mock("../../../lib/team");
describe("Team card", () => {
  const onShowAddMemberDialog = jest.fn();
  const onShowEditTeamDialog = jest.fn();
  const onShowLeaveTeamDialog = jest.fn();

  let container: HTMLElement | null = null;
  let team: Team;

  function DummyComponent({ teamIndex }: { teamIndex: number }): JSX.Element {
    const { teams } = useTeam();
    team = teams[teamIndex];
    return (
      <TeamCard
        team={team}
        memberRole={TeamMemberRole.admin}
        memberStatus={UserInvitationStatus.accepted}
        onShowEditTeamDialog={onShowEditTeamDialog}
        onShowLeaveTeamDialog={onShowLeaveTeamDialog}
        onShowAddMemberDialog={onShowAddMemberDialog}
      />
    );
  }

  function mountTeamCardComponent(teamIndex = 0): void {
    act(() => render(<DummyComponent teamIndex={teamIndex} />, container));
  }

  function mountTeamInfoComponent(value?: string): void {
    act(() => render(
      <TeamInfo id="test" label="label" value={value} icon={<div id="icon" />} />, container)
    );
  }

  beforeAll(() => {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { teams };
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

  it("should be able to render", () => {
    mountTeamCardComponent();
    expect(document.querySelectorAll(`#team-card-${team.id}-actions`).length).toBe(1);
    expect(document.querySelectorAll(`#team-card-${team.id}-name`).length).toBe(1);
    expect(document.querySelectorAll(`#team-card-${team.id}-infos`).length).toBe(1);
  });

  it("should render the 2nd addr line if present", () => {
    mountTeamCardComponent();
    expect(document.querySelectorAll(`#team-card-info-${team.id}-address-value br`).length).toBe(2);
  });

  it("should not render the 2nd addr line if not present", () => {
    mountTeamCardComponent(2);
    expect(document.querySelectorAll(`#team-card-info-${team.id}-address-value br`).length).toBe(1);
  });

  it("should call onShowAddMemberDialog prop function when clicking on the button", () => {
    mountTeamCardComponent();
    const btn = document.querySelector(`#team-card-${team.id}-button-add-member`);
    expect(btn).toBeDefined();
    act(() => triggerMouseEvent("click", btn));
    expect(onShowAddMemberDialog).toHaveBeenCalledTimes(1);
  });

  it("should call onShowEditTeamDialog prop function when clicking on the button", () => {
    mountTeamCardComponent();
    const btn = document.querySelector(`#team-card-${team.id}-button-edit`);
    expect(btn).toBeDefined();
    act(() => triggerMouseEvent("click", btn));
    expect(onShowEditTeamDialog).toHaveBeenCalledTimes(1);
  });

  it("should call onShowLeaveTeamDialog prop function when clicking on the button", () => {
    mountTeamCardComponent();
    const btn = document.querySelector(`#team-card-${team.id}-button-leave-team`);
    expect(btn).toBeDefined();
    act(() => triggerMouseEvent("click", btn));
    expect(onShowLeaveTeamDialog).toHaveBeenCalledTimes(1);
  });

  describe("Info", () => {
    it("should be able to render", () => {
      mountTeamInfoComponent("value");
      expect(document.querySelectorAll("#team-card-info-test-label").length).toBe(1);
      expect(document.querySelectorAll("#icon").length).toBe(1);
    });

    it("should not render if value is not net", () => {
      mountTeamInfoComponent();
      expect(document.querySelectorAll("#team-card-info-test-label").length).toBe(0);
      expect(document.querySelectorAll("#icon").length).toBe(0);
    });
  });
});

