/**
 * Copyright (c) 2021, Diabeloop
 * Profile page tests
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
import { BrowserRouter } from "react-router-dom";
import { expect } from "chai";
import { mount, ReactWrapper } from "enzyme";

import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { authHookHcp, authHookPatient } from "../../lib/auth/hook.test";
import { NotificationContextProvider } from "../../../lib/notifications";
import { stubNotficationContextValue } from "../../lib/notifications/hook.test";
import { Units } from "../../../models/generic";
import { UserRoles } from "../../../models/shoreline";
import PatientProfileForm from "../../../pages/profile/patient-form";
import ProfilePage from "../../../pages/profile";

function testProfile(): void {
  let component: ReactWrapper | null = null;
  const defaultUrl = "/professional/patients";

  function ProfilePageTestComponent(props: AuthContext): JSX.Element {
    return (
      <BrowserRouter>
        <AuthContextProvider value={props}>
          <NotificationContextProvider value={stubNotficationContextValue}>
            <ProfilePage defaultURL={defaultUrl} />
          </NotificationContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    );
  }

  function mountProfilePage(authHook: AuthContext): ReactWrapper {
    return mount(<ProfilePageTestComponent {...authHook} />);
  }

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
  });

  it("should be able to render", () => {
    component = mountProfilePage(authHookHcp);
    expect(component.exists("#profile-textfield-firstname")).to.be.true;
    expect(component.exists("#profile-button-save")).to.be.true;
  });

  it("should display mg/dL Units by default if not specified", () => {
    const { user } = authHookHcp;
    delete user?.settings?.units?.bg;
    component = mountProfilePage(authHookHcp);
    const selectValue = component.find("#profile-units-selector").first().prop("value");
    expect(selectValue).to.be.equal(Units.gram);
  });

  it("should display birthdate if user is a patient", () => {
    const { user } = authHookPatient;
    if (user?.role === UserRoles.patient) {
      component = mountProfilePage(authHookPatient);
      expect(component.find(PatientProfileForm).prop("birthDate"))
        .to.be.equal(user.profile?.patient?.birthday);
    }
  });
}

export default testProfile;
