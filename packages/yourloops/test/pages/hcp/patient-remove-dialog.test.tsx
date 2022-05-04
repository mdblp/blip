/**
 * Copyright (c) 2021, Diabeloop
 * HCP remove patient dialog tests
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
import { act, Simulate, SyntheticEventData } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { TeamContextProvider, useTeam } from "../../../lib/team";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { NotificationContextProvider } from "../../../lib/notifications";

import { directShareAPI } from "../../lib/direct-share/hook";

import RemoveDialog from "../../../pages/hcp/patients/remove-dialog";
import { waitTimeout } from "../../../lib/utils";
import { loggedInUsers } from "../../common";
import { teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { stubNotificationContextValue } from "../../lib/notifications/utils";
import { Patient } from "../../../lib/data/patient";


describe("Patient remove dialog", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  let container: HTMLElement | null = null;
  let patient: Patient | undefined;

  const onCloseStub = jest.fn();

  const RemoveDialogComponent = (props: { dialogOpened: boolean }): JSX.Element => {
    const team = useTeam();
    patient = team.getPatients()[0];

    return (
      <RemoveDialog
        isOpen={props.dialogOpened}
        onClose={onCloseStub}
        patient={patient}
      />
    );
  };

  async function mountComponent(props: { dialogOpened: boolean }): Promise<void> {
    await act(() => {
      return new Promise(resolve => render(
        <AuthContextProvider value={authHookHcp}>
          <NotificationContextProvider value={stubNotificationContextValue}>
            <TeamContextProvider teamAPI={teamAPI} directShareAPI={directShareAPI}>
              <RemoveDialogComponent {...props} />
            </TeamContextProvider>
          </NotificationContextProvider>
        </AuthContextProvider>, container, resolve)
      );
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
      patient = undefined;
    }
  });

  it("should be closed if isOpen is false", async () => {
    await mountComponent({ dialogOpened: false });
    const dialog = document.getElementById("remove-hcp-patient-dialog");
    expect(dialog).toBeNull();
  });

  it("should be opened if isOpen is true", async () => {
    await mountComponent({ dialogOpened: true });
    const dialog = document.getElementById("remove-hcp-patient-dialog");
    expect(dialog).not.toBeNull();
  });

  it("should not allow to validate if no team is selected", async () => {
    await mountComponent({ dialogOpened: true });
    const validateButton: HTMLButtonElement = document.querySelector("#remove-patient-dialog-validate-button");
    expect(validateButton.disabled).toBe(true);
  });

  it("should be able to remove patient after selecting a team", async () => {
    await mountComponent({ dialogOpened: true });
    const validateButton: HTMLButtonElement = document.querySelector("#remove-patient-dialog-validate-button");
    const teamSelect = document.querySelector("#patient-team-selector + input");

    Simulate.change(teamSelect, { target: { value: "private" } } as unknown as SyntheticEventData);
    expect(validateButton.disabled).toBe(false);

    Simulate.click(validateButton);
    await waitTimeout(1);
    expect(onCloseStub).toHaveBeenCalledTimes(1);
  });
});

