/**
 * Copyright (c) 2021, Diabeloop
 * Calendar view: Bring the calendar, the header and the toolbar together
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
import * as sinon from "sinon";
import { expect } from "chai";
import dayjs from "dayjs";

import RangeDatePicker from "../../../components/date-pickers/range-date-picker";

function testRangeDatePicker(): void {
  const handleResultStub = sinon.stub<[string|undefined, string|undefined], void>();
  const handleSelectedDateChange = sinon.stub<[string|undefined, string|undefined], void>();
  let container: HTMLDivElement | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    handleResultStub.reset();
    handleSelectedDateChange.reset();
  });
  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
      container = null;
    }
  });

  it("should render the provided title", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker onResult={handleResultStub} onSelectedDateChange={handleSelectedDateChange}>
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });
    const titleElem = document.getElementById("the-range-title");
    expect(titleElem).to.be.not.null;

    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem).to.be.null;
    expect(handleResultStub.called, "handleResultStub").to.be.false;
    expect(handleSelectedDateChange.called, "handleSelectedDateChange").to.be.false;
  });

  it("should render the calendar when clicking on the button", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker
            id="range-date-picker-show"
            onResult={handleResultStub}
            onSelectedDateChange={handleSelectedDateChange}
            showToolbar
          >
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("range-date-picker-show");
    expect(elem, "range-date-picker-show").to.be.not.null;
    elem.click();

    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem, "calendar-box-first").to.be.not.null;
    expect(handleResultStub.called, "handleResultStub").to.be.false;
    expect(handleSelectedDateChange.calledOnce, "handleSelectedDateChange").to.be.true;
  });

  it("should render the calendar when using the enter key on the button", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker id="range-date-picker-show" onResult={handleResultStub} onSelectedDateChange={handleSelectedDateChange}>
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("range-date-picker-show");
    expect(elem, "range-date-picker-show").to.be.not.null;
    Simulate.keyUp(elem, { key: "Enter" });

    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem, "calendar-box-first").to.be.not.null;
    expect(handleResultStub.called, "handleResultStub").to.be.false;
    expect(handleSelectedDateChange.calledOnce, "handleSelectedDateChange").to.be.true;
  });

  it("should render the calendar when using the space key on the button", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker id="range-date-picker-show" onResult={handleResultStub} onSelectedDateChange={handleSelectedDateChange}>
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("range-date-picker-show");
    expect(elem, "range-date-picker-show").to.be.not.null;
    Simulate.keyUp(elem, { key: " " });

    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem, "calendar-box-first").to.be.not.null;
    expect(handleResultStub.called, "handleResultStub").to.be.false;
    expect(handleSelectedDateChange.calledOnce, "handleSelectedDateChange").to.be.true;
  });

  it("should tell when the calendar is closed using the cancel button", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker id="range-date-picker-show" onResult={handleResultStub}>
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("range-date-picker-show");
    expect(elem, "range-date-picker-show").to.be.not.null;
    elem.click();

    const buttonCancel = document.getElementById("date-picker-button-cancel");
    expect(buttonCancel, "date-picker-button-cancel").to.be.not.null;
    buttonCancel.click();

    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem, "calendar-box-first").to.be.null;
    expect(handleResultStub.calledOnce, "handleResultStub").to.be.true;
    expect(handleResultStub.firstCall.args).to.be.empty;
  });

  it("should restrict selected date to min/max dates", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker
            onSelectedDateChange={handleSelectedDateChange}
            start="2021-01-01"
            end="2022-12-01"
            minDate="2022-01-01"
            maxDate="2022-01-30"
          >
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("date-picker-button-show-calendar");
    expect(elem, "date-picker-button-show-calendar").to.be.not.null;
    elem.click();

    expect(handleSelectedDateChange.calledOnce, "handleSelectedDateChange").to.be.true;
    expect(handleSelectedDateChange.firstCall.args).to.be.deep.eq(["2022-01-01", "2022-01-30"]);

    // no onResultStub set, should not crash
    const buttonCancel = document.getElementById("date-picker-button-cancel");
    expect(buttonCancel, "date-picker-button-cancel").to.be.not.null;
    Simulate.keyUp(buttonCancel, { key: " " });
    expect(handleResultStub.calledOnce, "handleResultStub").to.be.false;

    // The calendar should have vanished
    const calendarElem = document.getElementById("calendar-box-last");
    expect(calendarElem, "calendar-box-last").to.be.null;
  });

  it("should handle wrong dates inputs", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker
            onResult={handleResultStub}
            start="2022-12-01"
            end="2021-01-01"
            minDate="2022-01-30"
            maxDate="2022-01-01"
          >
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("date-picker-button-show-calendar");
    expect(elem, "date-picker-button-show-calendar").to.be.not.null;
    elem.click();

    const buttonOk = document.getElementById("date-picker-button-ok");
    expect(buttonOk, "date-picker-button-ok").to.be.not.null;
    buttonOk.click();
    expect(handleResultStub.calledOnce, "handleResultStub").to.be.true;
    expect(handleResultStub.firstCall.args).to.be.deep.eq(["2022-01-01", "2022-01-30"]);
  });

  it("should return the selected date", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker
            onResult={handleResultStub}
            start="2022-01-01"
            end="2022-01-05"
          >
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("date-picker-button-show-calendar");
    expect(elem, "date-picker-button-show-calendar").to.be.not.null;
    elem.click();

    const buttonStart = document.getElementById("button-calendar-day-2021-12-15");
    expect(buttonStart).to.be.not.null;
    buttonStart.click();
    const buttonEnd = document.getElementById("button-calendar-day-2022-01-15");
    expect(buttonEnd).to.be.not.null;
    buttonEnd.click();

    const buttonOk = document.getElementById("date-picker-button-ok");
    expect(buttonOk, "date-picker-button-ok").to.be.not.null;
    Simulate.keyUp(buttonOk, { key: " " });

    expect(handleResultStub.calledOnce, "handleResultStub").to.be.true;
    expect(handleResultStub.firstCall.args).to.be.deep.eq(["2021-12-15", "2022-01-15"]);

    // The calendar should have vanished
    const calendarElem = document.getElementById("calendar-box-first");
    expect(calendarElem, "calendar-box-first").to.be.null;
  });

  it("should respect the max selectable days parameter", async () => {
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <RangeDatePicker
            onResult={handleResultStub}
            onSelectedDateChange={handleSelectedDateChange}
            start="2022-01-01"
            end="2022-01-05"
            maxSelectableDays={10}
          >
            <span id="the-range-title">Date range</span>
          </RangeDatePicker>, container, resolve);
      });
    });

    const elem = document.getElementById("date-picker-button-show-calendar");
    expect(elem, "date-picker-button-show-calendar").to.be.not.null;
    elem.click();
    expect(handleSelectedDateChange.calledOnce, "calledOnce").to.be.true;
    expect(handleSelectedDateChange.firstCall.args).to.be.deep.eq(["2022-01-01", "2022-01-05"]);

    const buttonStart = document.getElementById("button-calendar-day-2021-12-31");
    expect(buttonStart).to.be.not.null;
    buttonStart.click();
    expect(handleSelectedDateChange.calledTwice, "calledTwice").to.be.true;
    expect(handleSelectedDateChange.secondCall.args).to.be.deep.eq(["2021-12-31", "2021-12-31"]);

    const rangesAfterFirst = [{
      start: "2021-12-01",
      end: "2021-12-21",
      disabled: true,
    }, {
      start: "2021-12-22",
      end: "2022-01-09",
      disabled: false,
    }, {
      start: "2022-01-10",
      end: "2022-01-31",
      disabled: true,
    }];
    const rangesAfterLast: typeof rangesAfterFirst = [{
      start: "2021-12-01",
      end: "2022-01-31",
      disabled: false,
    }];

    const testRange = (ranges: typeof rangesAfterFirst): void => {
      for (const range of ranges) {
        let day = dayjs(range.start, { utc: true });
        const end = dayjs(range.end, { utc: true }).add(1, "day").format("YYYY-MM-DD");
        let formatedDay = day.format("YYYY-MM-DD");
        while (formatedDay !== end) {
          const dayButton = document.getElementById(`button-calendar-day-${formatedDay}`);
          expect(dayButton).to.be.not.null;
          range.disabled ?
            expect(dayButton.getAttribute("disabled"), formatedDay).to.be.not.null
            : expect(dayButton.getAttribute("disabled"), formatedDay).to.be.null ;
          day = day.add(1, "day");
          formatedDay = day.format("YYYY-MM-DD");
        }
      }
    };

    testRange(rangesAfterFirst);

    // Select the end date, all must be selectabled:
    const buttonEnd = document.getElementById("button-calendar-day-2021-12-24");
    expect(buttonEnd).to.be.not.null;
    buttonEnd.click();
    testRange(rangesAfterLast);

    expect(handleSelectedDateChange.calledThrice, "calledThrice").to.be.true;
    expect(handleSelectedDateChange.thirdCall.args).to.be.deep.eq(["2021-12-24", "2021-12-31"]);
  });
}

export default testRangeDatePicker;
