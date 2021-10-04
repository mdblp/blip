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
import { mount, ReactWrapper, ShallowWrapper } from "enzyme";

import { AuthContextProvider } from "../../../lib/auth";
import { NotificationContextProvider } from "../../../lib/notifications";
import ProfilePage from "../../../pages/profile";
import { authHookHcp } from "../../lib/auth/hook.test";
import { stubNotficationContextValue } from "../../lib/notifications/hook.test";

function testProfile(): void {
  let component: ReactWrapper | ShallowWrapper | null = null;
  const defaultUrl = "/professional/patients";

  function ProfilePageTestComponent(): JSX.Element {
    return (
      <BrowserRouter>
        <AuthContextProvider value={authHookHcp}>
          <NotificationContextProvider value={stubNotficationContextValue}>
            <ProfilePage defaultURL={defaultUrl} />
          </NotificationContextProvider>
        </AuthContextProvider>
      </BrowserRouter>
    );
  }

  afterEach(() => {
    if (component !== null) {
      component.unmount();
      component = null;
    }
  });

  it("should be able to render", () => {
    component = mount(<ProfilePageTestComponent />);
    expect(component.exists("#profile-textfield-firstname")).to.be.true;
    expect(component.exists("#profile-button-save")).to.be.true;
  });
}

export default testProfile;
