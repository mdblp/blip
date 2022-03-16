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
import { render, unmountComponentAtNode } from "react-dom";
import { act, Simulate } from "react-dom/test-utils";

import { SortDirection, SortFields } from "../../../models/generic";
import { useTeam, TeamContextProvider } from "../../../lib/team";
import { NotificationContextProvider } from "../../../lib/notifications";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";

import { stubNotificationContextValue } from "../../lib/notifications/hook.test";
import "../../intersectionObserverMock";

import PatientListTable from "../../../pages/hcp/patients/table";
import { teamAPI } from "../../lib/team/utils";
import { loggedInUsers } from "../../common";
import { createAuthHookStubs } from "../../lib/auth/utils";

describe("Patient list table", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const clickPatientStub = jest.fn();
  const clickFlagPatientStub = jest.fn();
  const clickRemovePatientStub = jest.fn();

  let container: HTMLElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    clickPatientStub.mockReset();
    clickFlagPatientStub.mockReset();
    clickRemovePatientStub.mockReset();
  });

  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  const PatientListTableComponent = (): JSX.Element => {
    const team = useTeam();
    const patients = team.getPatients();

    return (
      <PatientListTable
        patients={patients}
        flagged={[]}
        order={SortDirection.asc}
        orderBy={SortFields.lastname}
        onClickPatient={clickPatientStub}
        onFlagPatient={clickFlagPatientStub}
        onSortList={jest.fn()}
        onClickRemovePatient={clickRemovePatientStub}
      />
    );
  };


  async function mountComponent(): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <AuthContextProvider value={authHookHcp}>
            <NotificationContextProvider value={stubNotificationContextValue}>
              <TeamContextProvider teamAPI={teamAPI}>
                <PatientListTableComponent />
              </TeamContextProvider>
            </NotificationContextProvider>
          </AuthContextProvider>, container, resolve);
      });
    });
  }

  it("should be able to render", async () => {
    await mountComponent();
    const table = document.getElementById("patients-list-table");
    expect(table).not.toBeNull();
  });

  it("should fetch and display patients", async () => {
    await mountComponent();
    const rows = document.querySelectorAll(".patients-list-row");
    expect(rows.length).not.toBeNull();
  });

  it("should call onClickPatient method when clicking on a row", async () => {
    await mountComponent();
    const firstRow = document.querySelector(".patients-list-row");
    Simulate.click(firstRow);
    expect(clickPatientStub).toHaveBeenCalledTimes(1);
  });

  it("should call onFlagPatient method when clicking on a flag", async () => {
    await mountComponent();
    const firstRow = document.querySelector(".patients-list-row");
    const flagButton = firstRow.querySelector(".patient-flag-button");
    Simulate.click(flagButton);
    expect(clickFlagPatientStub).toHaveBeenCalledTimes(1);
  });

  /*
  * TODO Can't add this feature for the moment
  *  we need to wait until yourloops will be certified to level 2 of medical device
  *  see YLP-370 (https://diabeloop.atlassian.net/browse/YLP-370)
   */
  // it("should call onRemovePatient method when clicking on a remove icon", async () => {
  //   await mountComponent();
  //   const firstRow = document.querySelector(".patients-list-row");
  //   const removeButton = firstRow.querySelector(".remove-patient-hcp-view-button");
  //   Simulate.click(removeButton);
  //   expect(clickRemovePatientStub.calledOnce).toBeTruthy();
  // });
});

