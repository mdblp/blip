/**
 * Copyright (c) 2021-2022, Diabeloop
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

import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate, SyntheticEventData } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";

import { Units } from "../../../models/generic";
import { AuthContextProvider, Session } from "../../../lib/auth";
import { loggedInUsers } from "../../common";
import { NotificationContextProvider } from "../../../lib/notifications";
import ProfilePage from "../../../pages/profile";
import { Preferences, Profile, Settings } from "../../../models/shoreline";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { stubNotificationContextValue } from "../../lib/notifications/utils";

describe("Profile", () => {
  let container: HTMLElement | null = null;
  let updatePreferences: jest.Mock<Promise<Preferences>, [Preferences, boolean | undefined]>;
  let updateProfile: jest.Mock<Promise<Profile>, [Profile, boolean | undefined]>;
  let updateSettings: jest.Mock<Promise<Settings>, [Settings, boolean | undefined]>;

  async function mountProfilePage(session: Session): Promise<void> {
    const context = createAuthHookStubs(session);
    updatePreferences = context.updatePreferences;
    updateProfile = context.updateProfile;
    updateSettings = context.updateSettings;

    await act(() => {
      return new Promise((resolve) => {
        render(
          <BrowserRouter>
            <AuthContextProvider value={context}>
              <NotificationContextProvider value={stubNotificationContextValue}>
                <ProfilePage/>
              </NotificationContextProvider>
            </AuthContextProvider>
          </BrowserRouter>, container, resolve);
      });
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

  it("should be able to render", async () => {
    await mountProfilePage(loggedInUsers.hcpSession);
    expect(container.querySelector("#profile-textfield-firstname").id).toBe("profile-textfield-firstname");
    expect(container.querySelector("#profile-button-save").id).toBe("profile-button-save");
  });

  it("should display mg/dL Units by default if not specified", async () => {
    const session = loggedInUsers.hcpSession;
    delete session.user?.settings?.units?.bg;
    await mountProfilePage(session);
    const selectValue = container.querySelector("#profile-units-selector").innerHTML;
    expect(selectValue).toBe(Units.gram);
  });

  it("should display birthdate if user is a patient", async () => {
    const session = loggedInUsers.patientSession;
    await mountProfilePage(session);
    const birthDateInput = container.querySelector("#profile-textfield-birthdate") as HTMLInputElement;
    expect(birthDateInput?.value).toBe(session.user.profile?.patient?.birthday);
  });

  it("should not display profession if user is a patient", async () => {
    const session = loggedInUsers.patientSession;
    await mountProfilePage(session);
    const hcpProfessionSelectInput = container.querySelector("#profile-hcp-profession-selector + input");
    expect(hcpProfessionSelectInput).toBeNull();
  });

  it("should not display pro sante connect button if user is not a french hcp", async () => {
    const session = loggedInUsers.hcpSession;
    session.user.settings.country = "EN";
    await mountProfilePage(session);
    const proSanteConnectButton = container.querySelector("#pro-sante-connect-button");
    expect(proSanteConnectButton).toBeNull();
  });

  it("should display pro sante connect button if user is a french hcp and his account is not certified", async () => {
    const session = loggedInUsers.hcpSession;
    session.user.frProId = undefined;
    await mountProfilePage(session);
    const proSanteConnectButton = container.querySelector("#pro-sante-connect-button");
    expect(proSanteConnectButton).not.toBeNull();
  });

  it("should display eCPS number if user is a french hcp and his account is certified", async () => {
    const session = loggedInUsers.hcpSession;
    await mountProfilePage(session);
    const textField = container.querySelector("#professional-account-number-text-field");
    expect(textField).not.toBeNull();
  });

  it("should display certified icon if user is a french hcp and his account is certified", async () => {
    const session = loggedInUsers.hcpSession;
    await mountProfilePage(session);
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${session.user.userid}`);
    expect(certifiedIcon).not.toBeNull();
  });

  it("should not display certified icon if user is a french hcp and his account is not certified", async () => {
    const session = loggedInUsers.hcpSession;
    session.user.frProId = undefined;
    await mountProfilePage(session);
    const certifiedIcon = container.querySelector(`#certified-professional-icon-${session.user.userid}`);
    expect(certifiedIcon).toBeNull();
  });

  it("should update settings when saving after changing units", async () => {
    const session = loggedInUsers.hcpSession;
    await mountProfilePage(session);

    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const unitSelectInput = container?.querySelector("#profile-units-selector + input");

    expect(saveButton.disabled).toBeTruthy();
    Simulate.change(unitSelectInput, { target: { value: Units.mole } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBeFalsy();
    Simulate.click(saveButton);
    expect(updateSettings).toHaveBeenCalledTimes(1);
  });

  it("should update preferences when saving after changing language", async () => {
    const session = loggedInUsers.hcpSession;
    await mountProfilePage(session);

    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const languageSelectInput = container.querySelector("#profile-locale-selector + input");

    expect(saveButton.disabled).toBeTruthy();
    Simulate.change(languageSelectInput, { target: { value: "es" } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBeFalsy();
    Simulate.click(saveButton);
    expect(updatePreferences).toHaveBeenCalledTimes(1);
  });

  it("should update profile when saving after changing firstname", async () => {
    const session = loggedInUsers.hcpSession;
    await mountProfilePage(session);

    const saveButton: HTMLButtonElement = container.querySelector("#profile-button-save");
    const firstnameInput: HTMLInputElement = container.querySelector("#profile-textfield-firstname");

    expect(saveButton.disabled).toBe(true);
    Simulate.change(firstnameInput, { target: { value: "Chandler" } } as unknown as SyntheticEventData);
    expect(saveButton.disabled).toBe(false);
    Simulate.click(saveButton);
    expect(updateProfile).toHaveBeenCalledTimes(1);
  });
});

