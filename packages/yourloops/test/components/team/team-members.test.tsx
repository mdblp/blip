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

import { buildTeam, buildTeamMember } from "../../common/utils";
import TeamUtils from "../../../lib/team/utils";
import { fireEvent, render, screen, within } from "@testing-library/react";
import TeamMembers, { TeamMembersProps } from "../../../components/team/team-members";

describe("TeamMembers", () => {
  const refresh = jest.fn();

  const teamId = "teamId";
  const members = [
    buildTeamMember(teamId, "userId1"),
    buildTeamMember(teamId, "userId2"),
    buildTeamMember(teamId, "userId3"),
    buildTeamMember(teamId, "userId4"),
  ];
  const team = buildTeam(teamId, members);

  beforeEach(() => {
    jest.spyOn(TeamUtils, "isUserAdministrator").mockReturnValue(true);
  });

  function getTeamMembersJSX(props: TeamMembersProps = { team, refreshParent: refresh }) {
    return <TeamMembers
      team={props.team}
      refreshParent={props.refreshParent}
    />;
  }

  it("should hide add member button when logged in user is not admin", () => {
    jest.spyOn(TeamUtils, "isUserAdministrator").mockReturnValue(false);
    render(getTeamMembersJSX());
    expect(screen.queryByRole("button", { name: /add-member/i })).toBeNull();
  });

  it("should show add member button when logged in user is admin", () => {
    render(getTeamMembersJSX());
    expect(screen.queryByRole("button", { name: /add-member/i })).not.toBeNull();
  });

  it("should open the invite member dialog when clicking on the add member button", () => {
    render(getTeamMembersJSX());
    expect(screen.queryByRole("dialog")).toBeNull();
    const addMemberButton = screen.getByRole("button", { name: /add-member/i });
    fireEvent.click(addMemberButton);
    expect(screen.queryByRole("dialog")).not.toBeNull();
  });

  it("should hide the delete member table header when logged in user is not admin", () => {
    jest.spyOn(TeamUtils, "isUserAdministrator").mockReturnValue(false);
    render(getTeamMembersJSX());
    const tableHeaders = screen.getAllByRole("rowgroup")[0];
    const columns = within(tableHeaders).getAllByRole("columnheader");
    expect(columns).toHaveLength(4);
    expect(columns[3].innerHTML).toBe("admin");
  });

  it("should show the delete member table header when logged in is not admin", () => {
    render(getTeamMembersJSX());
    const tableHeaders = screen.getAllByRole("rowgroup")[0];
    const columns = within(tableHeaders).getAllByRole("columnheader");
    expect(columns).toHaveLength(5);
    expect(columns[4].innerHTML).toBe("");
  });

  it("should create the correct number of row", () => {
    render(getTeamMembersJSX());
    const tableHeaders = screen.getAllByRole("rowgroup")[1];
    const columns = within(tableHeaders).getAllByRole("row");
    expect(columns).toHaveLength(members.length);
  });
});

