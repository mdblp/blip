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
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { renderToString } from "react-dom/server";
import { Router } from "react-router-dom";
import { createMemoryHistory } from "history";

import FaceIcon from "@material-ui/icons/Face";
import RoundedHospitalIcon from "../../../components/icons/RoundedHospitalIcon";
import StethoscopeIcon from "../../../components/icons/StethoscopeIcon";

import { AuthContextProvider } from "../../../lib/auth";
import { createAuthHookStubs } from "../../lib/auth/utils";
import UserMenu from "../../../components/menus/user-menu";
import { loggedInUsers } from "../../common";
import { triggerMouseEvent } from "../../common/utils";
import User from "../../../lib/auth/user";

describe("User Menu", () => {
  let container: HTMLElement | null = null;
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const hcp = loggedInUsers.getHcp();
  const caregiver = loggedInUsers.getCaregiver();
  const patient = loggedInUsers.getPatient();
  let authContext = createAuthHookStubs(hcp);

  function openMenu(): void {
    const userMenu = document.getElementById("user-menu");
    triggerMouseEvent("click", userMenu);
  }

  async function mountComponent(user: User): Promise<void> {
    authContext = createAuthHookStubs(user);

    await act(() => {
      return new Promise((resolve) => {
        render(
          <Router history={history}>
            <AuthContextProvider value={authContext}>
              <UserMenu />
            </AuthContextProvider>
          </Router>, container, resolve);
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

  it("should display the hcp icon", async () => {
    await mountComponent(hcp);
    const roleIcon = document.querySelector("#user-role-icon");
    expect(roleIcon.innerHTML).toEqual(renderToString(<StethoscopeIcon />));
  });

  it("should display the caregiver icon", async () => {
    await mountComponent(caregiver);
    const roleIcon = document.querySelector("#user-role-icon");
    expect(roleIcon.innerHTML).toEqual(renderToString(<RoundedHospitalIcon />));
  });

  it("should display the patient icon", async () => {
    await mountComponent(patient);
    const roleIcon = document.querySelector("#user-role-icon");
    expect(roleIcon.innerHTML).toEqual(renderToString(<FaceIcon />));
  });

  it("should redirect to '/preferences' route when clicking on profile link", async () => {
    await mountComponent(hcp);
    openMenu();
    const profileItem = document.getElementById("user-menu-settings-item");
    triggerMouseEvent("click", profileItem);
    expect(history.location.pathname).toBe("/preferences");
  });

  it("should logout the user when clicking on logout item", async () => {
    await mountComponent(hcp);
    openMenu();
    const logoutItem = document.getElementById("user-menu-logout-item");
    triggerMouseEvent("click", logoutItem);
    expect(authContext.logout).toBeCalledTimes(1);
  });
});
