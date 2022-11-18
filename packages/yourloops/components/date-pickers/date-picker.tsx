/*
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

import React from 'react'
import { Dayjs } from 'dayjs'

import {
  CalendarOrientation,
  CalendarSelectionSingle
} from './models'
import { useChangeMonthState, toYearMonth } from './change-month'
import PickerToolbar from './picker-toolbar'
import CalendarBox from './calendar-box'

interface DatePickerProps {
  showToolbar?: boolean
  selection: CalendarSelectionSingle
  minDate: Dayjs
  maxDate: Dayjs
  orientation: CalendarOrientation
  onChange: (d: Dayjs) => void
}

/**
 * A single month calendar
 */
function DatePicker(props: DatePickerProps): JSX.Element {
  const { selection, minDate, maxDate, orientation, onChange } = props

  const [selectingYear, setSelectingYear] = React.useState<boolean>(false)

  const [currentMonth, setCurrentMonth] = React.useState<Dayjs>(selection.selected.startOf('month'))
  const [changingMonth, handlePrevMonth, handleNextMonth] = useChangeMonthState({
    currentMonth,
    setCurrentMonth,
    minDate,
    maxDate,
    mode: selection.mode
  })

  const handleSelectedYear = selectingYear ? (year: number) => {
    setSelectingYear(false)
    let date = selection.selected.set('year', year)
    if (date.isBefore(minDate)) {
      date = minDate
    } else if (date.isAfter(maxDate)) {
      date = maxDate
    }
    props.onChange(date)
    setCurrentMonth(date.startOf('month'))
  } : undefined

  const onChangeSelectedDate = (date: Dayjs, updateCurrentMonth?: boolean): void => {
    if (date.isBefore(minDate) || date.isAfter(maxDate)) {
      return
    }
    if (updateCurrentMonth) {
      const dMonth = toYearMonth(date) - toYearMonth(currentMonth)
      if (dMonth > 0 && handleNextMonth) {
        handleNextMonth()
      } else if (dMonth < 0 && handlePrevMonth) {
        handlePrevMonth()
      }
    }
    onChange(date)
  }

  return (
    <React.Fragment>
      {props.showToolbar && <PickerToolbar
        selection={selection}
        orientation={orientation}
        onClickYear={() => setSelectingYear(true)}
      />}
      <CalendarBox
        orientation={orientation}
        currentMonth={currentMonth}
        selection={selection}
        minDate={minDate}
        maxDate={maxDate}
        changingMonth={changingMonth}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onChange={onChangeSelectedDate}
        onSelectYear={handleSelectedYear}
      />
    </React.Fragment>
  )
}

export default DatePicker
