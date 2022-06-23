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
import ReactDOM, { unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";

import MainDrawer, { mainDrawerDefaultWidth, mainDrawerMiniVariantWidth } from "../../../components/menus/main-drawer";
import { buildTeam, buildTeamMember, triggerMouseEvent } from "../../common/utils";
import * as teamHookMock from "../../../lib/team";
import * as authHookMock from "../../../lib/auth";
import { PatientFilterStats } from "../../../lib/team/models";
import User from "../../../lib/auth/user";
import { PatientFilterTypes } from "../../../models/generic";

jest.mock("../../../lib/team");
jest.mock("../../../lib/auth");
describe("Main Drawer", () => {
  let container: HTMLElement | null = null;
  const patientsFilterStats: PatientFilterStats = {
    all: 1,
    pending: 2,
    directShare: 3,
    unread: 4,
    outOfRange: 5,
    severeHypoglycemia: 6,
    dataNotTransferred: 7,
    remoteMonitored: 8,
    renew: 9,
  };
  const history = createMemoryHistory({ initialEntries: ["/"] });
  const flaggedPatients = ["fakeFlaggedPatientId"];
  const userId = "fakeUserId";
  const teamMember = buildTeamMember("fakeTeamId", userId);
  const monitoredTeam = buildTeam("fakeTeamId", [teamMember]);

  const getRemoteMonitoringTeamsMock = jest.fn().mockReturnValue([monitoredTeam]);
  const getFlagPatientsMock = jest.fn().mockReturnValue(flaggedPatients);


  function getMainDrawerJSX(miniVariant = true): JSX.Element {
    return <Router history={history}>
      <MainDrawer miniVariant={miniVariant} />
    </Router>;
  }

  async function mountComponent(miniVariant = true): Promise<void> {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(getMainDrawerJSX(miniVariant), container, resolve);
      });
    });
  }

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { patientsFilterStats, getRemoteMonitoringTeams: getRemoteMonitoringTeamsMock };
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserHcp: () => true, userid: userId } as User, getFlagPatients: getFlagPatientsMock };
    });
  });

  beforeAll(() => {
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
  });


  afterEach(() => {
    if (container) {
      unmountComponentAtNode(container);
      container.remove();
      container = null;
    }
  });

  async function checkFilterAction(filterLabel: string, urlFilterName: string, filterNumber?: number) {
    render(getMainDrawerJSX());
    const buttonName = filterNumber ? `${filterLabel} (${filterNumber})` : filterLabel;
    await waitFor(() => expect(screen.queryByRole("button", { name: buttonName })).not.toBeNull());
    const link = await screen.findByRole("link", { name: urlFilterName });
    fireEvent.click(link);
    await waitFor(() => expect(`${history.location.pathname}${history.location.search}`).toBe(`/home?filter=${urlFilterName}`));
  }

  async function checkFilterLabel(patientsFilterStatsUpdated: PatientFilterStats, buttonLabel: string) {
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return {
        patientsFilterStats: patientsFilterStatsUpdated,
        getRemoteMonitoringTeams: getRemoteMonitoringTeamsMock,
      };
    });
    render(getMainDrawerJSX());
    await waitFor(() => expect(screen.queryByRole("button", { name: buttonLabel })).not.toBeNull());
  }

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

  it("should display correct filter value for all patients and redirect to proper url", async () => {
    await checkFilterAction("all-patients", PatientFilterTypes.all.toString(), patientsFilterStats.all);
  });

  it("should display correct filter value for flagged patients and redirect to proper url", async () => {
    await checkFilterAction(PatientFilterTypes.flagged.toString(), PatientFilterTypes.flagged.toString(), flaggedPatients.length);
  });

  it("should display correct filter value for pending patients and redirect to proper url", async () => {
    await checkFilterAction(PatientFilterTypes.pending.toString(), PatientFilterTypes.pending.toString(), patientsFilterStats.pending);
  });

  it("should display correct filter value for private patients and redirect to proper url", async () => {
    await checkFilterAction("private-practice", PatientFilterTypes.private.toString(), patientsFilterStats.directShare);
  });

  it("should display correct filter value for monitored patient sand redirect to proper url", async () => {
    await checkFilterAction("monitored-patients", PatientFilterTypes.remoteMonitored.toString(), patientsFilterStats.remoteMonitored);
  });

  it("should display correct filter value for soon to renew patients and redirect to proper url", async () => {
    await checkFilterAction(`incoming-renewal ${patientsFilterStats.renew}`, PatientFilterTypes.renew.toString());
  });

  it("should display correct filter value for out of range alert patients and redirect to proper url", async () => {
    await checkFilterAction(`time-away-from-target ${patientsFilterStats.outOfRange}`, PatientFilterTypes.outOfRange.toString());
  });

  it("should display correct filter value for severe hypoglycemia alert patients and redirect to proper url", async () => {
    await checkFilterAction(`alert-hypoglycemic ${patientsFilterStats.severeHypoglycemia}`, PatientFilterTypes.severeHypoglycemia.toString());
  });

  it("should display correct filter value for data not transferred alert patients and redirect to proper url", async () => {
    await checkFilterAction(`data-not-transferred ${patientsFilterStats.dataNotTransferred}`, PatientFilterTypes.dataNotTransferred.toString());
  });

  it("should display correct filter value for data not transferred alert patients and redirect to proper url", async () => {
    await checkFilterAction(`unread-messages ${patientsFilterStats.unread}`, PatientFilterTypes.unread.toString());
  });

  it("renew filter should not display a number when there are 0 incoming renewal", async () => {
    const patientsFilterStatsUpdated: PatientFilterStats = { ...patientsFilterStats, renew: 0 };
    await checkFilterLabel(patientsFilterStatsUpdated, "incoming-renewal");
  });

  it("time out of range filter should not display a number when there are 0 patients in this alert", async () => {
    const patientsFilterStatsUpdated: PatientFilterStats = { ...patientsFilterStats, outOfRange: 0 };
    await checkFilterLabel(patientsFilterStatsUpdated, "time-away-from-target");
  });

  it("alert hypoglycemic filter should not display a number when there are 0 patients in this alert", async () => {
    const patientsFilterStatsUpdated: PatientFilterStats = { ...patientsFilterStats, severeHypoglycemia: 0 };
    await checkFilterLabel(patientsFilterStatsUpdated, "alert-hypoglycemic");
  });

  it("data not transferred filter should not display a number when there are 0 patients in this alert", async () => {
    const patientsFilterStatsUpdated: PatientFilterStats = { ...patientsFilterStats, dataNotTransferred: 0 };
    await checkFilterLabel(patientsFilterStatsUpdated, "data-not-transferred");
  });

  it("unread messages filter should not display a number when there are 0 patients in this alert", async () => {
    const patientsFilterStatsUpdated: PatientFilterStats = { ...patientsFilterStats, unread: 0 };
    await checkFilterLabel(patientsFilterStatsUpdated, "unread-messages");
  });
});
