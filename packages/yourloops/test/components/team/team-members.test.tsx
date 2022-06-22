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
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import * as teamHookMock from "../../../lib/team";
import { buildTeam, buildTeamMember } from "../../common/utils";
import TeamUtils from "../../../lib/team/utils";
import TeamMembers, { TeamMembersProps } from "../../../components/team/team-members";
import { TeamMemberRole } from "../../../models/team";
import { UserRoles } from "../../../models/user";
import { UserInvitationStatus } from "../../../models/generic";
import * as alertHookMock from "../../../components/utils/snackbar";

jest.mock("../../../components/utils/snackbar");
jest.mock("../../../lib/team");
describe("TeamMembers", () => {
  const refresh = jest.fn();

  const teamId = "teamId";
  const members = [
    buildTeamMember(teamId, "userId1"),
    buildTeamMember(teamId, "userId2"),
    buildTeamMember(teamId, "userId3"),
    buildTeamMember(teamId, "userId4"),
    buildTeamMember(
      teamId,
      "patientUserId",
      undefined,
      TeamMemberRole.patient,
      "fakePatient",
      "patientFullName",
      UserInvitationStatus.accepted,
      UserRoles.patient
    ),
  ];
  const team = buildTeam(teamId, members);
  const nbNonPatientTeamMembers = 4;
  const inviteMemberMock = jest.fn();
  const successMock = jest.fn();
  const errorMock = jest.fn();

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { inviteMember: inviteMemberMock, getTeam: jest.fn().mockReturnValue(team) };
    });
    (alertHookMock.SnackbarContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (alertHookMock.useAlert as jest.Mock).mockImplementation(() => {
      return { success: successMock, error: errorMock };
    });
  });

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
    expect(screen.queryByRole("button", { name: "button-team-add-member" })).toBeNull();
  });

  it("should show add member button when logged in user is admin", () => {
    render(getTeamMembersJSX());
    expect(screen.queryByRole("button", { name: "button-team-add-member" })).not.toBeNull();
  });

  it("should open the invite member dialog when clicking on the add member button", () => {
    render(getTeamMembersJSX());
    expect(screen.queryByRole("dialog")).toBeNull();
    const addMemberButton = screen.getByRole("button", { name: "button-team-add-member" });
    fireEvent.click(addMemberButton);
    expect(screen.queryByRole("dialog")).not.toBeNull();
  });

  it("should call teamHook when inviting a member and succeed", async () => {
    const email = "fake@email.com";
    render(getTeamMembersJSX());
    const addMemberButton = screen.getByRole("button", { name: "button-team-add-member" });
    fireEvent.click(addMemberButton);
    const inviteMemberDialog = within(screen.queryByRole("dialog"));
    const emailInput = inviteMemberDialog.getByRole("textbox", { name: "email" });
    await userEvent.type(emailInput, email);
    const adminCheckbox = inviteMemberDialog.getByRole("checkbox");
    fireEvent.click(adminCheckbox);
    const inviteButton = inviteMemberDialog.getByRole("button", { name: "button-invite" });
    await act(async () => {
      fireEvent.click(inviteButton);
      await waitFor(() => expect(inviteMemberMock).toHaveBeenCalledWith(team, email, TeamMemberRole.admin));
      await waitFor(() => expect(successMock).toHaveBeenCalledWith("team-page-success-invite-hcp"));
    });
  });

  it("should call teamHook when inviting a member and fail when an error is thrown", async () => {
    const email = "fake@email.com";
    inviteMemberMock.mockRejectedValueOnce(Error("This is a mock error thrown on purpose"));
    render(getTeamMembersJSX());
    const addMemberButton = screen.getByRole("button", { name: "button-team-add-member" });
    fireEvent.click(addMemberButton);
    const inviteMemberDialog = within(screen.queryByRole("dialog"));
    const emailInput = inviteMemberDialog.getByRole("textbox", { name: "email" });
    await userEvent.type(emailInput, email);
    const inviteButton = inviteMemberDialog.getByRole("button", { name: "button-invite" });
    await act(async () => {
      fireEvent.click(inviteButton);
      await waitFor(() => expect(inviteMemberMock).toHaveBeenCalledWith(team, email, TeamMemberRole.member));
      await waitFor(() => expect(errorMock).toHaveBeenCalledWith("team-page-failed-invite-hcp"));
    });
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
    expect(columns).toHaveLength(nbNonPatientTeamMembers);
  });
});

