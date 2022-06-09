/**
 * Copyright (c) 2021, Diabeloop
 * HCP team edit dialog tests
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

import _ from "lodash";
import React from "react";

import { Team, TeamMember, useTeam } from "../../../lib/team";
import TeamEditDialog from "../../../pages/hcp/team-edit-dialog";
import { teams } from "../../common";
import * as teamHookMock from "../../../lib/team";
import { act, Simulate, SyntheticEventData } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";
import { triggerMouseEvent } from "../../common/utils";

jest.mock("../../../lib/team");
describe("Team edit dialog", () => {
  const onSaveTeam = jest.fn();
  const textFieldIds = [
    "team-edit-dialog-field-name",
    "team-edit-dialog-field-line1",
    "team-edit-dialog-field-line2",
    "team-edit-dialog-field-zip",
    "team-edit-dialog-field-city",
    "team-edit-dialog-field-phone",
    "team-edit-dialog-field-email",
  ];
  /** paths to be used with lodash.get(...) */
  const textFieldTeamPath = ["name", "address.line1", "address.line2", "address.zip", "address.city", "phone", "email"];

  let container: HTMLElement | null = null;
  let team: Team;


  function DummyComponent({ noTeamToEdit, nullTeam }: { noTeamToEdit: true, nullTeam: true }): JSX.Element {
    const { teams } = useTeam();
    team = teams[0];
    return (<TeamEditDialog teamToEdit={noTeamToEdit ? null : { team: nullTeam ? null : team, onSaveTeam }} />);
  }

  function mountComponent(args?: { noTeamToEdit?: true, nullTeam?: true }): void {
    act(() => render(
      <DummyComponent noTeamToEdit={args?.noTeamToEdit} nullTeam={args?.nullTeam} />, container)
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

  it("should be closed if teamToEdit is null", () => {
    mountComponent({ noTeamToEdit: true });
    expect(document.querySelector("#team-edit-dialog")).toBeNull();
  });

  it("should not be closed if teamToEdit exists", () => {
    mountComponent();
    expect(document.querySelector("#team-edit-dialog")).not.toBeNull();
  });

  it("should mockReset() fields when editing a team", () => {
    mountComponent();
    textFieldIds.forEach((id: string, index: number) => {
      if (!document) throw new Error("silent typescript");
      const field = document.querySelector(`#${id}`) as HTMLInputElement;
      expect(field.value).toBe(_.get(team, textFieldTeamPath[index], "wrong value"));
    });
    expect((document.querySelector("#team-edit-dialog-button-validate") as HTMLButtonElement).disabled).toBe(false);
  });

  it("should have empty fields when creating a new team", () => {
    mountComponent({ nullTeam: true });
    textFieldIds.forEach((id: string) => {
      if (document === null) throw new Error("silent typescript");
      const field = document.querySelector(`#${id}`) as HTMLInputElement;
      expect(field.value).toBe("");
    });
  });

  it("should not allow to validate if a require info is missing", () => {
    mountComponent();
    const input = document.querySelector("#team-edit-dialog-field-name");
    Simulate.change(input, { target: { name: "name", value: "" } } as unknown as SyntheticEventData);
    expect((document.querySelector("#team-edit-dialog-button-validate") as HTMLButtonElement).disabled).toBe(true);
  });

  it("should call the onSaveTeam callback method with null if cancel", () => {
    mountComponent();
    const button = document.querySelector("#team-edit-dialog-button-close") as HTMLButtonElement;
    triggerMouseEvent("click", button);
    expect(onSaveTeam).toHaveBeenCalledTimes(1);
    expect(onSaveTeam).toHaveBeenCalledWith(null);
  });

  it("should call the onSaveTeam callback method with the changes if validated", () => {
    mountComponent();
    const event = {
      target: {
        name: "name",
        value: "Updated name",
      },
    };
    const updatedTeam = { ...team, members: [] as TeamMember[], name: event.target.value };
    const input = document.querySelector("#team-edit-dialog-field-name");
    Simulate.change(input, { target: event.target } as unknown as SyntheticEventData);
    expect((document.querySelector("#team-edit-dialog-button-validate") as HTMLButtonElement).disabled).toBe(false);
    const button = document.querySelector("#team-edit-dialog-button-validate") as HTMLButtonElement;
    triggerMouseEvent("click", button);

    expect(onSaveTeam).toHaveBeenCalledTimes(1);
    expect(onSaveTeam).toHaveBeenCalledWith(updatedTeam);
  });
});

