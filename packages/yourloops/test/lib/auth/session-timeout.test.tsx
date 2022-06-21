/**
 * Copyright (c) 2021, Diabeloop
 * Session timeout manager (auto logout the user when idle for a period)
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
import ReactDOM from "react-dom";
import { MemoryRouter } from "react-router-dom";
import { act } from "react-dom/test-utils";

import config from "../../../lib/config";
import { waitTimeout } from "../../../lib/utils";
import { AuthContextProvider, SessionTimeout } from "../../../lib/auth";
import { loggedInUsers } from "../../common";
import { AuthContextStubs, createAuthHookStubs, resetAuthHookStubs } from "./utils";

describe("Session timeout", () => {

  const sessionTimeoutDelay = 100;
  const authHookHcpStubs = createAuthHookStubs(loggedInUsers.hcpUser);
  let container: HTMLDivElement | null = null;

  function TestSessionTimeoutComponent(props: { hookStubs: AuthContextStubs }): JSX.Element {
    return (
      <MemoryRouter initialEntries={["/"]}>
        <AuthContextProvider value={props.hookStubs}>
          <SessionTimeout sessionTimeoutDelay={sessionTimeoutDelay} />
        </AuthContextProvider>
      </MemoryRouter>
    );
  }

  function mountSessionTimeoutComponent(hookStubs: AuthContextStubs): Promise<void> {
    return act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(<TestSessionTimeoutComponent hookStubs={hookStubs} />, container, resolve);
      });
    });
  }

  beforeAll(() => {
    config.SESSION_TIMEOUT = 10 * sessionTimeoutDelay;
  });

  afterAll(() => {
    config.SESSION_TIMEOUT = 1800000;
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });
  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    }
    resetAuthHookStubs(authHookHcpStubs, loggedInUsers.hcpUser);
  });

  it.skip("should do nothing if isAuthInProgress is true", async () => {
    authHookHcpStubs.isLoggedIn = true;
    await mountSessionTimeoutComponent(authHookHcpStubs);
    expect(window.clearSessionTimeout).toBeUndefined();
  });

  it("should setup the test interval if isAuthInProgress is false", async () => {
    await mountSessionTimeoutComponent(authHookHcpStubs);
    expect(typeof window.clearSessionTimeout).toBe("function");

    // Unmount should remove the timer
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;

    expect(window.clearSessionTimeout).toBeUndefined();
  });

  it.skip("should logout the user if no action after config.SESSION_TIMEOUT is done", async () => {
    authHookHcpStubs.logout.mockImplementation(async () => {
      window.clearSessionTimeout();
      return waitTimeout(1);
    });
    await mountSessionTimeoutComponent(authHookHcpStubs);
    await waitTimeout(config.SESSION_TIMEOUT + sessionTimeoutDelay);
    expect(authHookHcpStubs.logout).toHaveBeenCalledTimes(1);
    expect(authHookHcpStubs.logout.mock.calls[0][0]).toBe(true);
  });

  it("should not logout the user when receive an event", async () => {
    authHookHcpStubs.logout.mockImplementation(async () => {
      window.clearSessionTimeout();
      return waitTimeout(1);
    });
    await mountSessionTimeoutComponent(authHookHcpStubs);
    await waitTimeout(6 * sessionTimeoutDelay); // eslint-disable-line no-magic-numbers
    expect(authHookHcpStubs.logout).toHaveBeenCalledTimes(0);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "a" }));
    await waitTimeout(5 * sessionTimeoutDelay);
    expect(authHookHcpStubs.logout).toHaveBeenCalledTimes(0);
    await waitTimeout(config.SESSION_TIMEOUT);
    expect(authHookHcpStubs.logout).toHaveBeenCalledTimes(1);
  }, 3 * config.SESSION_TIMEOUT);
});

