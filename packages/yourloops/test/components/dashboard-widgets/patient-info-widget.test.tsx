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
import moment from "moment-timezone";
import { act } from "react-dom/test-utils";

import PatientInfoWidget, { PatientInfoWidgetProps } from "../../../components/dashboard-widgets/patient-info-widget";
import { buildTeam, buildTeamMember, createPatient } from "../../common/utils";
import { render, unmountComponentAtNode } from "react-dom";
import i18n from "../../../lib/language";
import * as authHookMock from "../../../lib/auth";
import { AuthContextProvider } from "../../../lib/auth";
import * as teamHookMock from "../../../lib/team";
import User from "../../../lib/auth/user";
import { genderLabels } from "../../../lib/auth/helpers";
import { Monitoring, MonitoringStatus } from "../../../models/monitoring";

jest.mock("../../../lib/auth");
jest.mock("../../../lib/team");
describe("PatientInfoWidget", () => {
  const patient = createPatient("fakePatientId", []);
  let container: HTMLElement | null = null;
  const adminMember = buildTeamMember();
  const patientMember = buildTeamMember("fakeTeamId", patient.userid);
  const remoteMonitoringTeam = buildTeam("fakeTeamId", [adminMember, patientMember]);

  beforeAll(() => {
    i18n.changeLanguage("en");
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserCaregiver: () => false, isUserHcp: () => true, id: adminMember.user.userid } as User };
    });
    (teamHookMock.TeamContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (teamHookMock.useTeam as jest.Mock).mockImplementation(() => {
      return { getRemoteMonitoringTeams: () => [remoteMonitoringTeam] };
    });
  });

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

  function mountComponent(props: PatientInfoWidgetProps = { patient }) {
    act(() => {
      render(
        <AuthContextProvider>
          <PatientInfoWidget
            patient={props.patient}
          />
        </AuthContextProvider>, container);
    });
  }

  it("should display correct patient information", () => {
    mountComponent();
    const birthDate = moment.utc(patient.profile.birthdate).format("L");
    const a1cDate = moment.utc(patient.settings.a1c.date).format("L");
    const gender = patient.profile.sex ?? "";
    expect(document.getElementById("patient-info-patient-value").innerHTML).toEqual(patient.profile.fullName);
    expect(document.getElementById("patient-info-gender-value").innerHTML).toEqual(genderLabels()[gender]);
    expect(document.getElementById("patient-info-birthdate-value").innerHTML).toEqual(birthDate);
    expect(document.getElementById("patient-info-email-value").innerHTML).toEqual(patient.profile.email);
    expect(document.getElementById("patient-info-hba1c-value").innerHTML).toEqual(`${patient.settings?.a1c?.value} (${a1cDate})`);
    expect(document.getElementById("patient-info-remote-monitoring-value")).toBeNull();
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display cancel invite button when patient is not monitored and status is pending", () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.pending } as Monitoring;
    mountComponent();
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).not.toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display renew and remove button when patient is not monitored and status is accepted", () => {
    patient.monitoring = { enabled: false, status: MonitoringStatus.accepted } as Monitoring;
    mountComponent();
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).not.toBeNull();
    expect(document.getElementById("remove-button-id")).not.toBeNull();
  });

  it("should display invite button when patient is not monitored and status is undefined", () => {
    patient.monitoring = { enabled: false, status: undefined } as Monitoring;
    mountComponent();
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).not.toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display cancel renew and remove button when patient is monitored", () => {
    patient.monitoring = { enabled: true, status: undefined } as Monitoring;
    mountComponent();
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("yes");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).not.toBeNull();
    expect(document.getElementById("remove-button-id")).not.toBeNull();
  });
});

