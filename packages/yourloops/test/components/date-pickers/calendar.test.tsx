/**
 * Copyright (c) 2021, Diabeloop
 * Allow to select a date (day/month/year) by displaying each days in a specific month
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
import { act, Simulate } from "react-dom/test-utils";
import dayjs from "dayjs";

import Calendar from "../../../components/date-pickers/calendar";
import initDayJS from "../../../lib/dayjs";

describe("Calendar", () => {

  const minDate = dayjs("2010-01-01", { utc: true });
  const maxDate = dayjs("2040-01-01", { utc: true });
  let container: HTMLDivElement | null = null;

  beforeAll(() => {
    initDayJS();
  });

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

  it("should correctly render a month", async () => {
    const today = dayjs("2021-11-09");
    const onChange = jest.fn();

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Calendar
            currentMonth={today}
            selection={{ mode: "single", selected: today }}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
          />, container, resolve);
      });
    });

    const calendarElem = document.getElementById("calendar-month");
    expect(calendarElem).not.toBeNull();
    expect(calendarElem.nodeName.toLowerCase()).toBe("div");

    const firstDay = document.getElementById("calendar-month-weekday-0");
    expect(firstDay).not.toBeNull();
    expect(firstDay.innerHTML).toBe("Su");

    const todayButton = document.getElementById("button-calendar-day-2021-11-09");
    expect(todayButton).not.toBeNull();
    expect(todayButton.getAttribute("aria-selected")).toBe("true");
    expect(todayButton.getAttribute("type")).toBe("button");
    expect(todayButton.nodeName.toLowerCase()).toBe("button");

    const tomorrowElem = document.getElementById("button-calendar-day-2021-11-10");
    expect(tomorrowElem).not.toBeNull();
    tomorrowElem.click();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].format("YYYY-MM-DD")).toBe("2021-11-10");
  });

  it("should react to arrows keys to change the selected date", async () => {
    const today = dayjs("2021-11-09");
    const onChange = jest.fn();

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <Calendar
            currentMonth={today}
            selection={{ mode: "single", selected: today }}
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
          />, container, resolve);
      });
    });

    const calendarElem = document.getElementById("calendar-month");
    Simulate.keyUp(calendarElem, { key: "ArrowUp" });
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].format("YYYY-MM-DD")).toBe("2021-11-02");

    Simulate.keyUp(calendarElem, { key: "ArrowDown" });
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange.mock.calls[1][0].format("YYYY-MM-DD")).toBe("2021-11-16");

    Simulate.keyUp(calendarElem, { key: "ArrowLeft" });
    expect(onChange).toHaveBeenCalledTimes(3);
    expect(onChange.mock.calls[2][0].format("YYYY-MM-DD")).toBe("2021-11-08");

    Simulate.keyUp(calendarElem, { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange.mock.calls[3][0].format("YYYY-MM-DD")).toBe("2021-11-10");
  });
});

