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
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";

import ThemeProvider from "@material-ui/styles/ThemeProvider";

import { getTheme } from "../../../components/theme";
import TeamAlarmsContent, {
  MIN_HIGH_BG, MIN_VERY_LOW_BG,
  MIN_LOW_BG,
  TeamAlarmsContentProps,
} from "../../../components/team/team-alarms-content";
import { triggerMouseEvent } from "../../common/utils";

describe("TeamInformation", () => {
  const onSave = jest.fn();
  const monitoring = {
    enabled: true,
    parameters: {
      bgUnit: "bgUnits",
      lowBg: MIN_LOW_BG,
      highBg: MIN_HIGH_BG,
      outOfRangeThreshold: 5,
      veryLowBg: MIN_VERY_LOW_BG,
      hypoThreshold: 10,
      nonDataTxThreshold: 15,
      reportingPeriod: 7,
    },
  };

  let container: HTMLDivElement | null = null;

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
  });

  function getTeamAlarmsContentJSX(props: TeamAlarmsContentProps) {
    return <ThemeProvider theme={getTheme()}>
      <TeamAlarmsContent
        monitoring={props.monitoring}
        onSave={props.onSave}
      />
    </ThemeProvider>;
  }

  function renderTeamAlarmsContent(props: TeamAlarmsContentProps = { monitoring, onSave }) {
    act(() => {
      ReactDOM.render(getTeamAlarmsContentJSX(props), container);
    });
  }

  it("should display correct alarm information and execute save function on click", () => {
    renderTeamAlarmsContent();
    expect((document.getElementById("low-bg-text-field-id") as HTMLInputElement).value).toEqual(monitoring.parameters.lowBg.toString());
    expect((document.getElementById("high-bg-text-field-id") as HTMLInputElement).value).toEqual(monitoring.parameters.highBg.toString());
    expect((document.getElementById("very-low-bg-text-field-id") as HTMLInputElement).value).toEqual(monitoring.parameters.veryLowBg.toString());
    expect(document.getElementById("basic-dropdown-out-of-range-selector").innerHTML).toEqual(`${monitoring.parameters.outOfRangeThreshold}%`);
    expect(document.getElementById("basic-dropdown-hypo-threshold-selector").innerHTML).toEqual(`${monitoring.parameters.hypoThreshold}%`);
    expect(document.getElementById("basic-dropdown-non-data-selector").innerHTML).toEqual(`${monitoring.parameters.nonDataTxThreshold}%`);
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeFalsy();
    triggerMouseEvent("click", saveButton);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith(monitoring);
  });

  it("save button should be disabled when low bg value is not in correct range", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG - 1,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });

  it("save button should be disabled when high bg value is not in correct range", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG - 1,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });

  it("save button should be disabled when very low bg value is not in correct range", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG - 1,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });

  it("save button should be disabled when outOfRangeThreshold is not correct", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 8,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 15,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });

  it("save button should be disabled when hypoThreshold is not correct", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 11,
        nonDataTxThreshold: 15,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });

  it("save button should be disabled when nonDataTxThreshold is not correct", () => {
    const incorrectMonitoring = {
      enabled: true,
      parameters: {
        bgUnit: "bgUnits",
        lowBg: MIN_LOW_BG,
        highBg: MIN_HIGH_BG,
        outOfRangeThreshold: 5,
        veryLowBg: MIN_VERY_LOW_BG,
        hypoThreshold: 10,
        nonDataTxThreshold: 150,
        reportingPeriod: 7,
      },
    };
    renderTeamAlarmsContent({ monitoring : incorrectMonitoring, onSave });
    const saveButton = document.getElementById("save-button-id");
    expect((saveButton as HTMLButtonElement).disabled).toBeTruthy();
  });
});
