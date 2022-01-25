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

import _ from "lodash";
import React from "react";
import { Dayjs } from "dayjs";
import clsx from "clsx";
import { makeStyles, Theme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

import { CalendarPosition, CalendarChangeMonth, CalendarDatesRange, animationStyle } from "./models";
import MonthDayElements, { dayStyles } from "./month-days-elements";

interface CalendarProps {
  position?: CalendarPosition,
  /** Set the displayed month, current month if not set, and the currently selected day */
  currentMonth: Dayjs;
  selectedDate?: Dayjs;
  selectedDatesRange?: CalendarDatesRange;
  selectableDatesRange?: CalendarDatesRange;
  minDate: Dayjs;
  maxDate: Dayjs;
  changeMonth?: CalendarChangeMonth | null;
  onChange: (date: Dayjs, updateCurrentMonth?: boolean) => void;
}

const calendarStyles = makeStyles((theme: Theme) => {
  return {
    calendar: {
      display: "flex",
      flexDirection: "column",
    },
    daysGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, auto)",
      gridTemplateRows: "auto",
      justifyContent: "center",
      rowGap: 3,
      minWidth: "100%",
      [theme.breakpoints.down("sm")]: {
        rowGap: 1,
      },
    },
    oneMonthHeight: {
      // Fix the height to be sure days buttons stay aligned during transition (animation)
      height: "255px", // 6 * 40px + 5*3px (weekdays + 6 lines for days in a month + 5 * rowGap)
      [theme.breakpoints.down("sm")]: {
        height: "233px", // 6 * 38px + 5*1px
      },
    },
    dayLabel: {
      textAlign: "center",
      [theme.breakpoints.down("sm")]: {
        height: "20px",
      },
    },
    divScrollLeft: {
      display: "flex",
      flexDirection: "row-reverse",
    },
    divScrollRight: {
      display: "flex",
      flexDirection: "row",
    },
  };
}, { name: "date-pickers-calendar" });

function Calendar(props: CalendarProps): JSX.Element {
  // use startOf() here to clone the date, and to be sure we use the same timezone offset
  // dayjs don't handle properly the clone of the timezone
  const { currentMonth, selectedDate, selectedDatesRange, changeMonth, position } = props;
  const dayClasses = dayStyles();
  const animClasses = animationStyle();
  const classes = calendarStyles();
  const { daysArray, weekDays, currentMonthNumber } = React.useMemo(() => ({
    daysArray: currentMonth.getWeekArray(),
    weekDays: currentMonth.getWeekdays(),
    currentMonthNumber: currentMonth.month(),
  }), [currentMonth]);

  const mode = selectedDatesRange ? "double" : "single";
  const id = position ? `calendar-month-${position}` : "calendar-month";
  const weekDaysElements = React.useMemo(() => weekDays.map((day: string, index: number) => (
    <Typography
      id={`${id}-weekday-${index}`}
      aria-hidden="true"
      key={day}
      variant="caption"
      color="textSecondary"
      className={`${dayClasses.dayElement} ${classes.dayLabel}`}
    >
      {_.capitalize(day)}
    </Typography>
  )), [weekDays, dayClasses.dayElement, classes.dayLabel, id]);

  const { minDate, maxDate } = React.useMemo(() => {
    const minDate = props.minDate;
    const maxDate= props.maxDate;
    const selectableDatesRange = props.selectableDatesRange;
    if (selectableDatesRange) {
      let start = selectableDatesRange.start;
      if (start.isBefore(minDate)) {
        start = minDate;
      }
      let end = selectableDatesRange.end;
      if (end.isAfter(maxDate)) {
        end = maxDate;
      }
      return { minDate: start, maxDate: end };
    }
    return { minDate, maxDate };
  }, [ props.minDate, props.maxDate, props.selectableDatesRange ]);

  // Disable callback during change month animation:
  const onChange = changeMonth ? _.noop : props.onChange;
  const oneMonthClasses = clsx(classes.daysGrid, classes.oneMonthHeight);
  const weekdaysValues = (
    <div id={`${id}-weekdays-values-current`} role="grid" className={oneMonthClasses}>
      <MonthDayElements
        mode={mode}
        currentMonth={currentMonthNumber}
        daysArray={daysArray}
        onChange={onChange}
        selectedDate={selectedDate}
        selectedDatesRange={selectedDatesRange}
        minDate={minDate}
        maxDate={maxDate}
      />
    </div>
  );

  let weekdaysDiv = weekdaysValues;
  if (changeMonth) {
    const isBefore = changeMonth.direction === "left";
    const newMonth = changeMonth.toMonth.month();
    const newDaysArray = changeMonth.toMonth.getWeekArray();
    const changingWeekdaysValues = (
      <div id={`${id}-weekdays-values-new`} role="grid" className={oneMonthClasses}>
        <MonthDayElements
          mode={mode}
          currentMonth={newMonth}
          daysArray={newDaysArray}
          onChange={onChange}
          selectedDate={selectedDate}
          selectedDatesRange={selectedDatesRange}
          minDate={minDate}
          maxDate={maxDate}
        />
      </div>
    );
    const classChangeMonth = clsx({
      [classes.divScrollLeft]: changeMonth?.direction === "left",
      [classes.divScrollRight]: changeMonth?.direction === "right",
      [animClasses.animatedMonthLTR]: isBefore,
      [animClasses.animatedMonthRTL]: !isBefore,
    });
    weekdaysDiv = (
      <div id={`${id}-change-month-anim`} className={classChangeMonth} onAnimationEnd={changeMonth.onAnimationEnd} aria-busy="true">
        {weekdaysValues}
        {changingWeekdaysValues}
      </div>
    );
  }

  const onKeyUp = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (changeMonth || mode === "double") {
      // TODO Dealing key with range calendar
      return;
    }
    if (!selectedDate) {
      onChange(currentMonth);
      return;
    }
    switch (e.key) {
    case "ArrowUp":
      onChange(selectedDate.subtract(1, "week"), true);
      break;
    case "ArrowDown":
      onChange(selectedDate.add(1, "week"), true);
      break;
    case "ArrowLeft":
      onChange(selectedDate.subtract(1, "day"), true);
      break;
    case "ArrowRight":
      onChange(selectedDate.add(1, "day"), true);
      break;
    }
  };

  return (
    <div id={id} className={classes.calendar} tabIndex={0} onKeyUp={onKeyUp} role="grid">
      <div id={`${id}-weekdays-names`} className={classes.daysGrid}>
        {weekDaysElements}
      </div>
      {weekdaysDiv}
    </div>
  );
}

export default Calendar;
