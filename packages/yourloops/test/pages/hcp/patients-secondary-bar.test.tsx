/**
 * Copyright (c) 2021, Diabeloop
 * HCP patient list bar tests
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

import { FilterType } from "../../../models/generic";
import { waitTimeout } from "../../../lib/utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { TeamContextProvider } from "../../../lib/team";
import PatientsSecondaryBar, { PatientListBarProps } from "../../../components/patient/secondary-bar";

import Adapter from "enzyme-adapter-react-16";
import { loggedInUsers } from "../../common";
import { resetTeamAPIStubs, teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";

describe("Patient secondary bar", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const apiTimeout = 50;
  const defaultProps: PatientListBarProps = {
    filter: "",
    filterType: FilterType.all,
    onFilter: jest.fn(),
    onFilterType: jest.fn(),
    onInvitePatient: jest.fn(),
  };

  let component: ReactWrapper | null = null;

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
    resetTeamAPIStubs();
  });

  beforeAll(() => {
    enzyme.configure({
      adapter: new Adapter(),
      disableLifecycleMethods: true,
    });
  });

  it("should be able to render", async () => {
    component = mount(
      <AuthContextProvider value={authHookHcp}>
        <TeamContextProvider teamAPI={teamAPI}>
          <PatientsSecondaryBar {...defaultProps} />
        </TeamContextProvider>
      </AuthContextProvider>
    );
    // component.update();
    await waitTimeout(apiTimeout);
    expect(component.find("#patients-list-toolbar-item-left").length).toBe(1);
  });
});

