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

import { PatientTableSortFields, SortDirection, UserInvitationStatus } from "../../../models/generic";
import { TeamContextProvider, useTeam } from "../../../lib/team";
import { NotificationContextProvider } from "../../../lib/notifications";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";

import "../../intersectionObserverMock";

import PatientTable from "../../../pages/hcp/patients/table";
import { teamAPI } from "../../lib/team/utils";
import { loggedInUsers } from "../../common";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { stubNotificationContextValue } from "../../lib/notifications/utils";
import { TablePagination, ThemeProvider } from "@material-ui/core";
import { getTheme } from "../../../components/theme";
import renderer from "react-test-renderer";
import PatientRow from "../../../pages/hcp/patients/row";
import { createPatient, createPatientTeam } from "../../common/utils";
import { Patient } from "../../../lib/data/patient";

describe("Patient list table", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  const clickPatientStub = jest.fn();
  const clickFlagPatientStub = jest.fn();
  const clickRemovePatientStub = jest.fn();

  const team1Id = "team1Id";
  const patient1 = createPatient("id1", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient2 = createPatient("id2", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient3 = createPatient("id3", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient4 = createPatient("id4", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient5 = createPatient("id5", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient6 = createPatient("id6", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient7 = createPatient("id7", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient8 = createPatient("id8", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient9 = createPatient("id9", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient10 = createPatient("id10", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const patient11 = createPatient("id11", [createPatientTeam(team1Id, UserInvitationStatus.accepted)]);
  const allPatients = [patient1, patient2, patient3, patient4, patient5, patient6, patient7, patient8, patient9, patient10, patient11];

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
      <ThemeProvider theme={getTheme()}>
        <PatientTable
          patients={patients}
          flagged={[]}
          order={SortDirection.asc}
          orderBy={PatientTableSortFields.patientFullName}
          onClickPatient={clickPatientStub}
          onFlagPatient={clickFlagPatientStub}
          onSortList={jest.fn()}
        />
      </ThemeProvider>
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

  function renderPatientList(teamUsers: Patient[]) {
    return renderer.create(
      <ThemeProvider theme={getTheme()}>
        <AuthContextProvider value={authHookHcp}>
          <TeamContextProvider teamAPI={teamAPI}>
            <PatientTable
              patients={teamUsers}
              flagged={[]}
              order={SortDirection.asc}
              orderBy={PatientTableSortFields.patientFullName}
              onClickPatient={clickPatientStub}
              onFlagPatient={clickFlagPatientStub}
              onSortList={jest.fn()}
            />
          </TeamContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    );
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

  it("should display only 10 patients when number pagination is by 10", () => {
    const component = renderPatientList(allPatients);
    const patientRows = component.root.findAllByType(PatientRow);
    expect(patientRows).toHaveLength(10);
  });

  it("should display all patients when number pagination is by 100", () => {
    const component = renderPatientList(allPatients);
    const tablePagination = component.root.findByType(TablePagination);
    tablePagination.props.onRowsPerPageChange({ target: { value: "100" } });
    const patientRows = component.root.findAllByType(PatientRow);
    expect(patientRows).toHaveLength(allPatients.length);
  });
});

