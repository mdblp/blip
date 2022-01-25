/**
 * Copyright (c) 2021, Diabeloop
 * Display the days off a month
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
import clsx from "clsx";
import { Dayjs, isDayjs } from "dayjs";
import { makeStyles, Theme } from "@material-ui/core/styles";

import { CalendarMode, CalendarDatesRange } from "./models";
import Day from "./day";

interface MonthDayElementsProps {
  mode: CalendarMode;
  daysArray: Dayjs[];
  /** For single day calendar */
  selectedDate?: Dayjs;
  /** For range days calendar */
  selectedDatesRange?: CalendarDatesRange;
  currentMonth: number;
  minDate: Dayjs;
  maxDate: Dayjs;
  onChange: (date: Dayjs) => void;
  onHoverDay?: (data: Dayjs) => void;
}

export const dayStyles = makeStyles((theme: Theme) => ({
  dayElement: {
    width: 40,
    height: 40,
    placeSelf: "center",
    borderRadius: "50%",
    [theme.breakpoints.down("sm")]: {
      width: 32,
      height: 32,
    },
  },
  middleDay: {
    opacity: 0.9,
  },
  squareLeftRadius: {
    borderTopLeftRadius: "0%",
    borderBottomLeftRadius: "0%",
  },
  squareRightRadius: {
    borderTopRightRadius: "0%",
    borderBottomRightRadius: "0%",
  },
}), { name: "date-pickers-day" });

const weekDaysCount = 7;
const weekDayLastIdx = 6;

function MonthDayElements(props: MonthDayElementsProps): JSX.Element {
  const classes = dayStyles();
  const { selectedDate, selectedDatesRange, currentMonth, daysArray, onChange, onHoverDay, minDate, maxDate } = props;

  const getADay = (index: number, day: Dayjs, dateOfMonth: number, month: number, dayISO: string): JSX.Element => {
    // Split this code to getADay(), because the function complexity (eslint) is above 20, if not doing so
    const dayClasses = [classes.dayElement];
    let selected = isDayjs(selectedDate) && selectedDate.isSame(day, "day");
    if (selectedDatesRange) {
      const daysInMonth = day.daysInMonth();
      const firstDay = selectedDatesRange.start.isSame(day, "day");
      const lastDay = selectedDatesRange.end.isSame(day, "day");
      const after = selectedDatesRange.start.isBefore(day);
      const before = selectedDatesRange.end.isAfter(day);

      if (firstDay || lastDay || (after && before)) {
        selected = true;
        // The class selection for the radius is a little bit more complicated here
        // We want the first and last element of a row to be rounded (left or right)
        // and the first/last day of a month to be also rounded
        const rowPos = index % weekDaysCount;
        const firstDayInMonth = dateOfMonth === 1;
        const lastDayInMonth = dateOfMonth === daysInMonth;
        const firstWeekday = rowPos === 0;
        const lastWeekday = rowPos === weekDayLastIdx;
        if (!(firstDay || firstDayInMonth || firstWeekday)) {
          dayClasses.push(classes.squareLeftRadius);
        }
        if (!(lastDay || lastDayInMonth || lastWeekday)) {
          dayClasses.push(classes.squareRightRadius);
        }
        if (!(firstDay || lastDay)) {
          dayClasses.push(classes.middleDay);
        }
      }
    }

    const disabled = month !== currentMonth || day.isBefore(minDate) || day.isAfter(maxDate);

    return (
      <Day
        id={`button-calendar-day-${dayISO}`}
        key={`day-${dayISO}`}
        day={dateOfMonth.toString(10)}
        selected={selected}
        color="primary"
        disabled={disabled}
        aria-selected={selected}
        aria-hidden={disabled}
        className={clsx(dayClasses)}
        onClick={() => onChange(day)}
        onMouseEnter={() => { if (onHoverDay) onHoverDay(day); }}
      />
    );
  };

  const monthDaysElements = daysArray.map((day, index) => {
    const dateOfMonth = day.date();
    const month = day.month();
    const dayISO = day.format("YYYY-MM-DD");
    if (month !== currentMonth && props.mode === "double") {
      return <span id={`hidden-calendar-day-${dayISO}`} key={`day-${dayISO}`} style={{ visibility: "hidden" }}>{dateOfMonth}</span>;
    }
    return getADay(index, day, dateOfMonth, month, dayISO);
  });

  return (
    <React.Fragment>
      {monthDaysElements}
    </React.Fragment>
  );
}

export default MonthDayElements;
