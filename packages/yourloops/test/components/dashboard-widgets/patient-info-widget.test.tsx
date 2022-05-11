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
import renderer from "react-test-renderer";
import moment from "moment-timezone";
import { loggedInUsers } from "../../common";
import { getTheme } from "../../../components/theme";
import ThemeProvider from "@material-ui/styles/ThemeProvider";
import PatientInfoWidget, { PatientInfoWidgetProps } from "../../../components/dashboard-widgets/patient-info-widget";

describe("PatientInfoWidget", () => {
  const authPatient = loggedInUsers.patient;

  function renderPatientInfoWidget(props: PatientInfoWidgetProps) {
    return renderer.create(
      <ThemeProvider theme={getTheme()}>
        <PatientInfoWidget
          patient={props.patient}
        />
      </ThemeProvider>
    );
  }

  it("should display correct patient information", () => {
    const props: PatientInfoWidgetProps = { patient: authPatient };
    const component = renderPatientInfoWidget(props);
    const birthDate = moment.utc(authPatient.profile.patient.birthday).format("L");
    const a1cDate = moment.utc(authPatient.settings.a1c.date).format("L");
    expect(component.root.findByProps({ id: "patient-info-patient-value" }).props.children).toEqual(`${authPatient.firstName} ${authPatient.lastName}`);
    expect(component.root.findByProps({ id: "patient-info-birthdate-value" }).props.children).toEqual(birthDate);
    expect(component.root.findByProps({ id: "patient-info-email-value" }).props.children).toEqual(authPatient.username);
    expect(component.root.findByProps({ id: "patient-info-hba1c-value" }).props.children).toEqual(`${authPatient.settings?.a1c?.value} (${a1cDate})`);
  });
});

