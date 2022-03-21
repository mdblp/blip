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
import enzyme, { mount, ReactWrapper, MountRendererProps } from "enzyme";

import { Team, TeamMember, loadTeams } from "../../../lib/team";
import TeamEditDialog from "../../../pages/hcp/team-edit-dialog";
import { TeamEditModalContentProps } from "../../../pages/hcp/types";
import Adapter from "enzyme-adapter-react-16";
import { loggedInUsers } from "../../common";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";

describe("Team edit dialog", () => {
  const authHcp = loggedInUsers.hcpSession;
  const defaultProps: TeamEditModalContentProps = {
    team: {} as Team,
    onSaveTeam: jest.fn(),
  };
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

  let component: ReactWrapper | null = null;
  const mountOptions: MountRendererProps = {
    attachTo: null,
  };

  beforeAll(async () => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
    mountOptions.attachTo = document.getElementById("app");
    if (mountOptions.attachTo === null) {
      mountOptions.attachTo = document.createElement("div");
      mountOptions.attachTo.id = "app";
      document.body.appendChild(mountOptions.attachTo);
    }
    const { teams } = await loadTeams(authHcp, teamAPI.fetchTeams, teamAPI.fetchPatients);
    defaultProps.team = teams[1];
  });

  afterAll(() => {
    const { attachTo } = mountOptions;
    if (attachTo instanceof HTMLElement) {
      document.body.removeChild(attachTo);
    }
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component.detach();
      expect(document.getElementById("team-edit-dialog")).toBeNull();
      component = null;
    }
    (defaultProps.onSaveTeam as jest.Mock).mockReset();
    resetTeamAPIStubs();
  });

  it("should be closed if teamToEdit is null", () => {
    component = mount(<TeamEditDialog teamToEdit={null} />, mountOptions);
    expect(component.exists("#team-edit-dialog")).toBe(true);
    expect(component.html().length).toBe(0);
  });

  it("should not be closed if teamToEdit exists", () => {
    component = mount(<TeamEditDialog teamToEdit={defaultProps} />, mountOptions);
    expect(component.exists("#team-edit-dialog")).toBe(true);
    expect(component.html().length).toBeGreaterThan(0);
  });

  it("should mockReset() fields when editing a team", () => {
    component = mount(<TeamEditDialog teamToEdit={defaultProps} />, mountOptions);
    expect(component.html().length).toBeGreaterThan(0);

    textFieldIds.forEach((id: string, index: number) => {
      if (component === null) throw new Error("silent typescript");
      const field = component.find(`#${id}`);
      expect(field.get(0).props.value).toBe(_.get(defaultProps.team, textFieldTeamPath[index], "wrong value"));
    });
    expect(component.find("#team-edit-dialog-button-validate").at(0).prop("disabled")).toBe(false);
  });

  it("should have empty fields when creating a new team", () => {
    component = mount(<TeamEditDialog teamToEdit={{ ...defaultProps, team: null }} />, mountOptions);
    textFieldIds.forEach((id: string) => {
      if (component === null) throw new Error("silent typescript");
      const field = component.find(`#${id}`);
      expect(field.get(0).props.value).toBe("");
    });
  });

  it("should not allow to validate if a require info is missing", () => {
    component = mount(<TeamEditDialog teamToEdit={defaultProps} />, mountOptions);
    const event = {
      target: {
        name: "name",
        value: "",
      },
    };
    component.find("input").find("#team-edit-dialog-field-name").at(0).simulate("change", event);
    expect(component.find("#team-edit-dialog-button-validate").at(0).prop("disabled")).toBe(true);
  });

  it("should call the onSaveTeam callback method with null if cancel", () => {
    component = mount(<TeamEditDialog teamToEdit={defaultProps} />, mountOptions);
    component.find("#team-edit-dialog-button-close").at(0).simulate("click");

    expect((defaultProps.onSaveTeam as jest.Mock)).toHaveBeenCalledTimes(1);
    expect((defaultProps.onSaveTeam as jest.Mock)).toHaveBeenCalledWith(null);
  });

  it(
    "should call the onSaveTeam callback method with the changes if validated",
    () => {
      component = mount(<TeamEditDialog teamToEdit={defaultProps} />, mountOptions);

      const event = {
        target: {
          name: "name",
          value: "Updated name",
        },
      };
      const updatedTeam = { ...defaultProps.team, members: [] as TeamMember[], name: event.target.value };

      component.find("input").find("#team-edit-dialog-field-name").at(0).simulate("change", event);
      expect(component.find("#team-edit-dialog-button-validate").at(0).prop("disabled")).toBe(false);

      component.find("#team-edit-dialog-button-validate").at(0).simulate("click");

      const spy = defaultProps.onSaveTeam as jest.Mock;
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith(updatedTeam);
    }
  );
});

