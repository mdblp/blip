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
import { BrowserRouter } from "react-router-dom";

import MainDrawer, { mainDrawerDefaultWidth, mainDrawerMiniVariantWidth } from "../../../components/menus/main-drawer";
import { triggerMouseEvent } from "../../common/utils";
import { TeamContextProvider } from "../../../lib/team";
import { teamAPI } from "../../lib/team/utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { loggedInUsers } from "../../common";
import { createAuthHookStubs } from "../../lib/auth/utils";

describe("Main Drawer", () => {
  let container: HTMLElement | null = null;
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);

  async function mountComponent(miniVariant = true): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <BrowserRouter>
            <AuthContextProvider value={authHookHcp}>
              <TeamContextProvider teamAPI={teamAPI}>
                <MainDrawer miniVariant={miniVariant} />
              </TeamContextProvider>
            </AuthContextProvider>
          </BrowserRouter>
          ,container ,resolve);
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

  it("Should render miniVariant by default", async () => {
    await mountComponent();
    const drawer = document.querySelector("#main-left-drawer .MuiPaper-root");
    expect(getComputedStyle(drawer).width).toEqual(mainDrawerMiniVariantWidth);
  });

  it("Should render full width when miniVariant is set to false", async () => {
    await mountComponent(false);
    const drawer = document.querySelector("#main-left-drawer .MuiPaper-root");
    expect(getComputedStyle(drawer).width).toEqual(mainDrawerDefaultWidth);
  });

  it("Should open the drawer when hover it", async () => {
    await mountComponent();
    const drawer = document.querySelector("#main-left-drawer .MuiPaper-root");
    triggerMouseEvent("mouseover", drawer);
    expect(getComputedStyle(drawer).width).toEqual(mainDrawerDefaultWidth);
  });

  it("Hover should be disabled when miniVariant is set to false", async () => {
    await mountComponent(false);
    const drawer = document.querySelector("#main-left-drawer .MuiPaper-root");
    triggerMouseEvent("mouseover", drawer);
    expect(getComputedStyle(drawer).width).toEqual(mainDrawerDefaultWidth);
  });
});
