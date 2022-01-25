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
import dayjs, { Dayjs, isDayjs } from "dayjs";

import {
  CalendarOrientation,
  ChangeMonthDirection,
  CalendarChangeMonth,
  CalendarDatesRange,
  TRANSITION_DURATION,
} from "./models";
import PickerToolbar from "./picker-toolbar";
import CalendarBox from "./calendar-box";

interface CalendarViewProps {
  showToolbar?: boolean;
  selectedDate?: Dayjs;
  selectedDatesRange?: CalendarDatesRange;
  selectableDatesRange?: CalendarDatesRange;
  maxSelectableDays?: number;
  minDate: Dayjs;
  maxDate: Dayjs;
  orientation: CalendarOrientation;
  onChange: (d: Dayjs) => void;
}

function toYearMonth(d: Dayjs): number {
  return d.year() * 100 + d.month();
}

function CalendarView(props: CalendarViewProps): JSX.Element {
  const { selectedDate, selectedDatesRange, minDate, maxDate, orientation, onChange } = props;

  const [selectingYear, setSelectingYear] = React.useState<boolean>(false);
  const [changingMonth, setChangingMonth] = React.useState<CalendarChangeMonth | null>(null);

  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(() => {
    if (selectedDate) {
      return selectedDate.startOf("month");
    }
    if (selectedDatesRange) {
      const lastMonth = selectedDatesRange.end.startOf("month");
      if (isDayjs(minDate) && lastMonth.subtract(1, "day").isBefore(minDate)) {
        // Don't display an unselectable month
        return lastMonth.add(1, "month");
      }
      return lastMonth;
    }
    // Will crash after (see end of the function)
    return dayjs();
  });

  const prevMonth = React.useMemo(() => {
    return currentMonth.subtract(1, "month");
  }, [currentMonth]);

  const changingPrevMonth = React.useMemo<CalendarChangeMonth | null>(() => {
    if (changingMonth && !selectedDate) {
      return {
        direction: changingMonth.direction,
        onAnimationEnd: changingMonth.onAnimationEnd,
        toMonth: changingMonth.toMonth.subtract(1, "month"),
      };
    }
    return null;
  }, [changingMonth, selectedDate]);

  const minMonth = toYearMonth(minDate);
  const maxMonth = toYearMonth(maxDate);

  const changeCurrentMonth = (toMonth: Dayjs, direction: ChangeMonthDirection) => {
    const ym = toYearMonth(toMonth);
    if (ym < minMonth || ym > maxMonth) {
      return;
    }
    const transitionTimeoutThreshold = 150;
    let timeoutTransition = 0;
    const onAnimationEnd = () => {
      if (timeoutTransition > 0) {
        window.clearTimeout(timeoutTransition);
        timeoutTransition = 0;
        setCurrentMonth(toMonth);
        setChangingMonth(null);
      }
    };
    timeoutTransition = window.setTimeout(onAnimationEnd, TRANSITION_DURATION + transitionTimeoutThreshold);
    setChangingMonth({
      direction,
      toMonth,
      onAnimationEnd,
    });
  };

  const canGoPrevMonth = minMonth < toYearMonth(selectedDate ? currentMonth : prevMonth);
  const handlePrevMonth = canGoPrevMonth ? (): void => {
    changeCurrentMonth(currentMonth.subtract(1, "month"), "left");
  } : undefined;
  const canGoNextMonth = maxMonth > toYearMonth(currentMonth);
  const handleNextMonth = canGoNextMonth ? (): void => {
    changeCurrentMonth(currentMonth.add(1, "month"), "right");
  } : undefined;

  if (selectedDatesRange) {
    return (
      <React.Fragment>
        <PickerToolbar
          showToolbar={props.showToolbar}
          maxSelectableDays={props.maxSelectableDays}
          selectedDatesRange={selectedDatesRange}
          orientation={orientation}
        />
        <CalendarBox
          position="first"
          orientation={orientation}
          currentMonth={prevMonth}
          selectedDatesRange={selectedDatesRange}
          selectableDatesRange={props.selectableDatesRange}
          minDate={minDate}
          maxDate={maxDate}
          changingMonth={changingPrevMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onChange={onChange}
        />
        <CalendarBox
          position="last"
          orientation={orientation}
          currentMonth={currentMonth}
          selectedDatesRange={selectedDatesRange}
          selectableDatesRange={props.selectableDatesRange}
          minDate={minDate}
          maxDate={maxDate}
          changingMonth={changingMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onChange={onChange}
        />
      </React.Fragment>
    );
  }

  if (selectedDate) {
    const handleSelectedYear = selectingYear ? (year: number) => {
      setSelectingYear(false);
      let date = selectedDate.set("year", year);
      if (date.isBefore(minDate)) {
        date = minDate;
      } else if (date.isAfter(maxDate)) {
        date = maxDate;
      }
      props.onChange(date);
      setCurrentMonth(date.startOf("month"));
    } : undefined;

    const onChangeSelectedDate = (date: Dayjs, updateCurrentMonth?: boolean): void => {
      if (date.isBefore(minDate) || date.isAfter(maxDate)) {
        return;
      }
      if (updateCurrentMonth) {
        const dMonth = toYearMonth(date) - toYearMonth(currentMonth);
        if (dMonth > 0 && handleNextMonth) {
          handleNextMonth();
        } else if (dMonth < 0 && handlePrevMonth) {
          handlePrevMonth();
        }
      }
      onChange(date);
    };

    return (
      <React.Fragment>
        <PickerToolbar
          showToolbar={props.showToolbar}
          selectedDate={selectedDate}
          orientation={orientation}
          onClickYear={() => setSelectingYear(true)}
        />
        <CalendarBox
          orientation={orientation}
          currentMonth={currentMonth}
          selectedDate={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          changingMonth={changingMonth}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          onChange={onChangeSelectedDate}
          onSelectYear={handleSelectedYear}
        />
      </React.Fragment>
    );
  }

  throw new Error("[CalendarView] Missing selectedDate or selectedDatesRange");
}

export default CalendarView;
