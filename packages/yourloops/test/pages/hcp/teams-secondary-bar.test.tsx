/**
 * Copyright (c) 2021, Diabeloop
 * HCP team 2nd nav bar tests
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
import Adapter from "enzyme-adapter-react-16";

import { waitTimeout } from "../../../lib/utils";
import TeamsSecondaryBar from "../../../pages/hcp/teams-secondary-bar";

describe("Team secondary bar", () => {
  const apiTimeout = 50;
  const onShowEditTeamDialog = jest.fn().mockReturnValue(() => Promise.resolve());
  let component: ReactWrapper | null = null;

  beforeAll(() => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
  });

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
    onShowEditTeamDialog.mockReset();
  });

  it("should display the nav bar", () => {
    component = mount(<TeamsSecondaryBar onShowEditTeamDialog={onShowEditTeamDialog} />);
    expect(component.exists("#teams-navbar-item-left")).toBe(true);
    expect(component.exists("#teams-navbar-item-middle")).toBe(true);
    expect(component.exists("#teams-navbar-item-right")).toBe(true);
  });

  it("should call onShowEditTeamDialog when clicking on the button", async () => {
    component = mount(<TeamsSecondaryBar onShowEditTeamDialog={onShowEditTeamDialog} />);

    expect(component.exists("#teams-navbar-add-team")).toBe(true);
    component.find("#teams-navbar-add-team").last().simulate("click");
    await waitTimeout(apiTimeout);
    expect(onShowEditTeamDialog).toHaveBeenCalledTimes(1);
    expect(onShowEditTeamDialog).toHaveBeenCalledWith(null);
  });
});

