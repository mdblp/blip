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

import ThemeProvider from "@material-ui/styles/ThemeProvider";
import { getTheme } from "../../../components/theme";
import PatientInfoWidget, { PatientInfoWidgetProps } from "../../../components/dashboard-widgets/patient-info-widget";
import { createPatient } from "../../common/utils";
import { render, unmountComponentAtNode } from "react-dom";
import i18n from "../../../lib/language";
import * as authHookMock from "../../../lib/auth";
import { AuthContextProvider } from "../../../lib/auth";
import User from "../../../lib/auth/user";
import { Monitoring, MonitoringStatus } from "../../../models/monitoring";

jest.mock("../../../lib/auth");
describe("PatientInfoWidget", () => {
  const patient = createPatient("fakePatientId", []);
  let container: HTMLElement | null = null;

  beforeAll(() => {
    i18n.changeLanguage("en");
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserCaregiver: () => false, isUserHcp: () => true } as User };
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

  function mountComponent(props: PatientInfoWidgetProps) {
    act(() => {
      render(
        <ThemeProvider theme={getTheme()}>
          <AuthContextProvider>
            <PatientInfoWidget
              patient={props.patient}
            />
          </AuthContextProvider>
        </ThemeProvider>, container);
    });
  }

  it("should display correct patient information", () => {
    const props: PatientInfoWidgetProps = { patient };
    mountComponent(props);
    const birthDate = moment.utc(patient.profile.birthdate).format("L");
    const a1cDate = moment.utc(patient.settings.a1c.date).format("L");
    expect(document.getElementById("patient-info-patient-value").innerHTML).toEqual(`${patient.profile.firstName} ${patient.profile.lastName}`);
    expect(document.getElementById("patient-info-birthdate-value").innerHTML).toEqual(birthDate);
    expect(document.getElementById("patient-info-email-value").innerHTML).toEqual(patient.profile.username);
    expect(document.getElementById("patient-info-hba1c-value").innerHTML).toEqual(`${patient.settings?.a1c?.value} (${a1cDate})`);
    expect(document.getElementById("patient-info-remote-monitoring-value")).toBeNull();
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display cancel invite button when patient is not monitored and status is pending", () => {
    const patientMonitoring = { enabled: false, status: MonitoringStatus.pending } as Monitoring;
    const nonMonitoredPatient = createPatient("fakePatientId", [], null, "", patientMonitoring);
    mountComponent({ patient: nonMonitoredPatient });
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).not.toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display renew and remove button when patient is not monitored and status is accepted", () => {
    const patientMonitoring = { enabled: false, status: MonitoringStatus.accepted } as Monitoring;
    const nonMonitoredPatient = createPatient("fakePatientId", [], null, "", patientMonitoring);
    mountComponent({ patient: nonMonitoredPatient });
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).not.toBeNull();
    expect(document.getElementById("remove-button-id")).not.toBeNull();
  });

  it("should display invite button when patient is not monitored and status is undefined", () => {
    const patientMonitoring = { enabled: false, status: undefined } as Monitoring;
    const nonMonitoredPatient = createPatient("fakePatientId", [], null, "", patientMonitoring);
    mountComponent({ patient: nonMonitoredPatient });
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("no");
    expect(document.getElementById("invite-button-id")).not.toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).toBeNull();
    expect(document.getElementById("remove-button-id")).toBeNull();
  });

  it("should display cancel renew and remove button when patient is monitored", () => {
    const patientMonitoring = { enabled: true, status: undefined } as Monitoring;
    const monitoredPatient = createPatient("fakePatientId", [], null, "", patientMonitoring);
    mountComponent({ patient: monitoredPatient });
    expect(document.getElementById("patient-info-remote-monitoring-value").innerHTML).toEqual("yes");
    expect(document.getElementById("invite-button-id")).toBeNull();
    expect(document.getElementById("cancel-invite-button-id")).toBeNull();
    expect(document.getElementById("renew-button-id")).not.toBeNull();
    expect(document.getElementById("remove-button-id")).not.toBeNull();
  });
});

