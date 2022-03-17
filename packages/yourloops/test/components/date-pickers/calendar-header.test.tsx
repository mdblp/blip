/**
 * Copyright (c) 2021, Diabeloop
 * Calendar header: Allow to change the current displayed month on the calendar
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
import dayjs from "dayjs";

import { CalendarChangeMonth } from "../../../components/date-pickers/models";
import CalendarHeader from "../../../components/date-pickers/calendar-header";
import i18n from "../../../lib/language";


describe("Calendar header", () => {

  let container: HTMLDivElement | null = null;

  beforeAll(() => {
    i18n.addResourceBundle("en", "yourloops", {
      "date-picker-header-date-format": "MMMM YYYY",
      "date-picker-toolbar-date-format": "ddd, MMM D",
    })
      .init({ react: { useSuspense: true } });
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
    const today = dayjs("2021-11-01T12:00:00Z"); // Monday
    const onPrevMonth = jest.fn();
    const onNextMonth = jest.fn();

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <CalendarHeader
            orientation="landscape"
            currentMonth={today}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />, container, resolve);
      });
    });

    expect(document.getElementById("calendar-header")).not.toBeNull();

    const buttonPrevMonth = document.getElementById("calendar-header-button-prev-month");
    expect(buttonPrevMonth).not.toBeNull();
    expect(buttonPrevMonth.nodeName.toLowerCase()).toBe("button");
    expect(buttonPrevMonth.getAttribute("disabled")).toBeNull();
    buttonPrevMonth.click();
    expect(onPrevMonth).toHaveBeenCalledTimes(1);

    const buttonNextMonth = document.getElementById("calendar-header-button-next-month");
    expect(buttonNextMonth).not.toBeNull();
    expect(buttonNextMonth.nodeName.toLowerCase()).toBe("button");
    expect(buttonNextMonth.getAttribute("disabled")).toBeNull();
    buttonNextMonth.click();
    expect(onNextMonth).toHaveBeenCalledTimes(1);

    const displayedMonth = document.getElementById("calendar-header-current-month");
    expect(displayedMonth).not.toBeNull();
    expect(displayedMonth.innerHTML).toBe("November 2021");
  });

  it("should correctly restrict prev/next month when disabled", async () => {
    const today = dayjs("2021-11-01T12:00:00Z"); // Monday

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <CalendarHeader
            orientation="landscape"
            currentMonth={today}
          />, container, resolve);
      });
    });

    const buttonPrevMonth = document.getElementById("calendar-header-button-prev-month");
    expect(buttonPrevMonth).not.toBeNull();
    expect(buttonPrevMonth.getAttribute("disabled")).not.toBeNull();

    const buttonNextMonth = document.getElementById("calendar-header-button-next-month");
    expect(buttonNextMonth).not.toBeNull();
    expect(buttonNextMonth.getAttribute("disabled")).not.toBeNull();
  });

  it("should render the transition when requested", async () => {
    const today = dayjs("2021-11-01T12:00:00Z"); // Monday
    const onPrevMonth = jest.fn();
    const onNextMonth = jest.fn();
    const changingMonth: CalendarChangeMonth = {
      direction: "right",
      toMonth: today.add(1, "month"),
      onAnimationEnd: jest.fn(),
    };

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <CalendarHeader
            orientation="landscape"
            currentMonth={today}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
            changingMonth={changingMonth}
          />, container, resolve);
      });
    });

    const prevMonth = document.getElementById("calendar-header-prev-month");
    expect(prevMonth).not.toBeNull();
    expect(prevMonth.innerHTML).toBe("December 2021");

    const nextMonth = document.getElementById("calendar-header-next-month");
    expect(nextMonth).not.toBeNull();
    expect(nextMonth.innerHTML).toBe("December 2021");
  });

  it("should hide the prev-month button when position is last and orientation islandscape", async () => {
    const today = dayjs("2021-11-01T12:00:00Z"); // Monday
    const onPrevMonth = jest.fn();
    const onNextMonth = jest.fn();

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <CalendarHeader
            orientation="landscape"
            position="last"
            currentMonth={today}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />, container, resolve);
      });
    });

    const buttonPrevMonth = document.getElementById("calendar-header-last-button-prev-month");
    expect(buttonPrevMonth).not.toBeNull();
    expect(buttonPrevMonth.getAttribute("aria-disabled")).toBe("true");
  }
  );

  it("should hide the next-month button when position is first and orientation islandscape", async () => {
    const today = dayjs("2021-11-01T12:00:00Z"); // Monday
    const onPrevMonth = jest.fn();
    const onNextMonth = jest.fn();

    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <CalendarHeader
            orientation="landscape"
            position="first"
            currentMonth={today}
            onPrevMonth={onPrevMonth}
            onNextMonth={onNextMonth}
          />, container, resolve);
      });
    });

    const buttonNextMonth = document.getElementById("calendar-header-first-button-next-month");
    expect(buttonNextMonth).not.toBeNull();
    expect(buttonNextMonth.getAttribute("aria-disabled")).toBe("true");
  });
});
