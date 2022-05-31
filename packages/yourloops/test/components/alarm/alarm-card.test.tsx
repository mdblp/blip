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
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from "react-dom";

import { ThemeProvider } from "@material-ui/core";

import { PatientInfoWidgetProps } from "../../../components/dashboard-widgets/patient-info-widget";
import { createPatient, triggerMouseEvent } from "../../common/utils";
import i18n from "../../../lib/language";
import * as authHookMock from "../../../lib/auth";
import AlarmCard from "../../../components/alarm/alarm-card";
import User from "../../../lib/auth/user";
import { Alarm } from "../../../models/alarm";
import { Monitoring } from "../../../models/monitoring";
import { getTheme } from "../../../components/theme";

jest.mock("../../../lib/auth");
describe("AlarmCard", () => {
  const patient = createPatient("fakePatientId", []);
  let container: HTMLElement | null = null;

  beforeAll(() => {
    i18n.changeLanguage("en");
    (authHookMock.AuthContextProvider as jest.Mock) = jest.fn().mockImplementation(({ children }) => {
      return children;
    });
  });

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserPatient: () => false } as User };
    });
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
        <ThemeProvider theme={getTheme()}>
          <AlarmCard
            patient={props.patient}
          />
        </ThemeProvider>, container);
    });
  }

  it("should display configure button when logged in user is not a patient", () => {
    mountComponent();
    expect(document.getElementById("configure-icon-button-id")).not.toBeNull();
  });

  it("should not display configure button when logged in user is a patient", () => {
    (authHookMock.useAuth as jest.Mock).mockImplementation(() => {
      return { user: { isUserPatient: () => true } as User };
    });
    mountComponent();
    expect(document.getElementById("configure-icon-button-id")).toBeNull();
  });

  it("should display correct title when patient has no alarms", () => {
    mountComponent();
    expect(document.getElementById("alarm-card-header-id").querySelector(".MuiCardHeader-title").innerHTML).toEqual("events");
  });

  it("should display correct title patient has 2 alarms", () => {
    const alarms: Alarm = {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 5,
      frequencyOfSevereHypoglycemiaActive: true,
      nonDataTransmissionRate: 10,
      nonDataTransmissionActive: true,
    };
    const patientWithAlarms = createPatient("fakePatientId", [], alarms);
    mountComponent({ patient: patientWithAlarms });
    expect(document.getElementById("alarm-card-header-id").querySelector(".MuiCardHeader-title").innerHTML).toEqual("events (+2)");
  });

  it("should display tir alarm", () => {
    const alarms: Alarm = {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: true,
      frequencyOfSevereHypoglycemiaRate: 5,
      frequencyOfSevereHypoglycemiaActive: false,
      nonDataTransmissionRate: 10,
      nonDataTransmissionActive: false,
    };
    const patientWithAlarms = createPatient("fakePatientId", [], alarms);
    mountComponent({ patient: patientWithAlarms });
    expect(document.getElementById("tir-alarm-id")).not.toBeNull();
    expect(document.getElementById("severe-hypo-alarm-id")).toBeNull();
    expect(document.getElementById("non-data-transmission-alarm-id")).toBeNull();
    expect(document.getElementById("no-alarm-active-label-id")).toBeNull();
  });

  it("should display severe hypo alarm", () => {
    const alarms: Alarm = {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 5,
      frequencyOfSevereHypoglycemiaActive: true,
      nonDataTransmissionRate: 10,
      nonDataTransmissionActive: false,
    };
    const patientWithAlarms = createPatient("fakePatientId", [], alarms);
    mountComponent({ patient: patientWithAlarms });
    expect(document.getElementById("tir-alarm-id")).toBeNull();
    expect(document.getElementById("severe-hypo-alarm-id")).not.toBeNull();
    expect(document.getElementById("non-data-transmission-alarm-id")).toBeNull();
    expect(document.getElementById("no-alarm-active-label-id")).toBeNull();
  });

  it("should display non data transmission alarm", () => {
    const alarms: Alarm = {
      timeSpentAwayFromTargetRate: 0,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 5,
      frequencyOfSevereHypoglycemiaActive: false,
      nonDataTransmissionRate: 10,
      nonDataTransmissionActive: true,
    };
    const patientWithAlarms = createPatient("fakePatientId", [], alarms);
    mountComponent({ patient: patientWithAlarms });
    expect(document.getElementById("tir-alarm-id")).toBeNull();
    expect(document.getElementById("severe-hypo-alarm-id")).toBeNull();
    expect(document.getElementById("non-data-transmission-alarm-id")).not.toBeNull();
    expect(document.getElementById("no-alarm-active-label-id")).toBeNull();
  });

  it("should display no alarm active label", () => {
    mountComponent();
    expect(document.getElementById("tir-alarm-id")).toBeNull();
    expect(document.getElementById("severe-hypo-alarm-id")).toBeNull();
    expect(document.getElementById("non-data-transmission-alarm-id")).toBeNull();
    expect(document.getElementById("no-alarm-active-label-id")).not.toBeNull();
  });

  it("should open dialog when clicking on configure button and close it when clicking on cancel", () => {
    const alarm: Alarm = {
      timeSpentAwayFromTargetRate: 10,
      timeSpentAwayFromTargetActive: false,
      frequencyOfSevereHypoglycemiaRate: 20,
      frequencyOfSevereHypoglycemiaActive: false,
      nonDataTransmissionRate: 30,
      nonDataTransmissionActive: false,
    };
    const monitoring: Monitoring = {
      enabled: true,
    };
    const patientWithMonitoring = createPatient("fakePatientId", [], alarm, "", monitoring);
    mountComponent({ patient: patientWithMonitoring });
    const configureButton = document.getElementById("configure-icon-button-id");
    triggerMouseEvent("click", configureButton);
    expect(document.getElementById("patient-alarm-dialog-id")).not.toBeNull();
    const cancelButton = document.getElementById("cancel-button-id");
    triggerMouseEvent("click", cancelButton);
    expect(document.getElementById("patient-alarm-dialog-id")).toBeNull();
  });

});

