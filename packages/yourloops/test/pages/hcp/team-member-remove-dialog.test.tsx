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

import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import React from "react";

import { Team, TeamMember, TeamUser } from "../../../lib/team";
import RemoveMemberDialog, { RemoveMemberDialogProps } from "../../../pages/hcp/team-member-remove-dialog";
import { Profile } from "../../../models/shoreline";
import { triggerMouseEvent } from "../../common/utils";

describe("RemoveMemberDialog", () => {
  let container: HTMLElement | null = null;
  const user: TeamUser = { profile: { firstName: "fakeFirstName", lastName: "fakeLastName" } as Profile } as TeamUser;
  const onDialogResult = jest.fn();
  const defaultProps: RemoveMemberDialogProps = {
    userToBeRemoved: {
      member: {
        team: { name: "fakeTeamName" } as Team,
        user,
      } as TeamMember,
      onDialogResult,
    },
  };

  function mountComponent(props: RemoveMemberDialogProps = defaultProps): void {
    act(() => {
      return render(
        <RemoveMemberDialog userToBeRemoved={props.userToBeRemoved} />, container);
    });
  }

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

  it("should be closed if addMember is null", () => {
    mountComponent({ userToBeRemoved: null });
    expect(document.getElementById("team-members-dialog-rmmember")).toBeNull();
  });

  it("should not be closed if addMember exists", () => {
    mountComponent();
    expect(document.getElementById("team-members-dialog-rmmember")).not.toBeNull();
    const question = document.getElementById("team-members-dialog-rmmember-question");
    expect(question.innerHTML).toBe(
      `Are you sure you want to remove ${user.profile?.firstName} ${user.profile?.lastName} from this medical team?`
    );
  });

  it("should return false if the user click on the cancel button", () => {
    mountComponent();
    const cancelButton = document.getElementById("team-members-dialog-rmmember-button-cancel");
    triggerMouseEvent("click", cancelButton);
    expect(onDialogResult).toHaveBeenCalledTimes(1);
    expect(onDialogResult).toHaveBeenCalledWith(false);
  });

  it("should return true if the user click on the OK button", () => {
    mountComponent();
    const cancelButton = document.getElementById("team-members-dialog-rmmember-button-remove");
    triggerMouseEvent("click", cancelButton);
    expect(onDialogResult).toHaveBeenCalledTimes(1);
    expect(onDialogResult).toHaveBeenCalledWith(true);
  });
});
