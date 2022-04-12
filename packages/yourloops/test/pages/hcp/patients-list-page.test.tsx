/**
 * Copyright (c) 2022, Diabeloop
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

import { act } from "react-dom/test-utils";
import { AuthContext, AuthContextProvider } from "../../../lib/auth";
import { NotificationContextProvider } from "../../../lib/notifications";
import { TeamContext, TeamContextProvider, useTeam } from "../../../lib/team";
import {
  FilterType,
  PatientTableSortFields,
  SortDirection,
  UserInvitationStatus,
} from "../../../models/generic";
import PatientListPage, { updatePatientList } from "../../../pages/hcp/patients/page";
import "../../intersectionObserverMock";
import { loggedInUsers } from "../../common";
import { teamAPI } from "../../lib/team/utils";
import { createAuthHookStubs } from "../../lib/auth/utils";
import { stubNotificationContextValue } from "../../lib/notifications/utils";
import { getMainTheme } from "../../../components/theme";
import { ThemeProvider } from "@material-ui/core";
import { Patient } from "../../../models/patient";


describe("Patient list page", () => {
  const authHcp = loggedInUsers.hcpSession;
  const authHookHcp: AuthContext = createAuthHookStubs(authHcp);
  let teamContext: TeamContext;
  let patients: Patient[];

  let container: HTMLElement | null = null;

  const PatientListPageComponent = (): JSX.Element => {
    teamContext = useTeam();
    patients = teamContext.getPatients();

    return (
      <PatientListPage />
    );
  };

  async function mountComponent(): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        render(
          <ThemeProvider theme={getMainTheme()}>
            <AuthContextProvider value={authHookHcp}>
              <NotificationContextProvider value={stubNotificationContextValue}>
                <TeamContextProvider teamAPI={teamAPI}>
                  <PatientListPageComponent />
                </TeamContextProvider>
              </NotificationContextProvider>
            </AuthContextProvider>
          </ThemeProvider>, container, resolve);
      });
    });
  }

  beforeAll(async () => {
    container = document.createElement("div");
    document.body.appendChild(container);
    await mountComponent();
  });

  afterAll(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  it("updatePatientList should return correct patients when filter is pending", () => {
    //given
    const patientExpected = patients.filter(patient => patient.teams.find(team => team.status === UserInvitationStatus.pending) !== undefined);

    //when
    const patientReceived = updatePatientList(teamContext, [], "", FilterType.pending, PatientTableSortFields.patientFullName, SortDirection.asc);

    //then
    expect(patientReceived).toEqual(patientExpected);
  });

  it("updatePatientList should return correct patients when filter is team id", () => {
    //given
    const teamId = patients[0].teams[0].teamId;
    const patientExpected = patients.filter(patient => patient.teams.find(team => teamId === teamId && team.status !== UserInvitationStatus.pending) !== undefined);

    //when
    const patientReceived = updatePatientList(teamContext, [], "", teamId, PatientTableSortFields.patientFullName, SortDirection.asc);

    //then
    expect(patientReceived).toEqual(patientExpected);
  });
});

