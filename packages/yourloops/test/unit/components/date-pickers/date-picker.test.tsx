/*
 * Copyright (c) 2021-2023, Diabeloop
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
import { Simulate } from 'react-dom/test-utils'
import dayjs from 'dayjs'

import { waitTimeout } from '../../../../lib/utils'
import DatePicker from '../../../../components/date-pickers/date-picker'
import initDayJS from '../../../../lib/dayjs'
import i18n from '../../../../lib/language'
import { act, render, waitFor } from '@testing-library/react'

describe('Date picker', () => {
  const minDate = dayjs('2000-01-01', { utc: true })
  const maxDate = dayjs('2100-01-01', { utc: true })

  beforeAll(() => {
    initDayJS()
    i18n.addResourceBundle('en', 'yourloops', {
      'date-picker-header-date-format': 'MMMM YYYY',
      'date-picker-toolbar-date-format': 'ddd, MMM D'
    })
      .init({ react: { useSuspense: true } })
    window.HTMLElement.prototype.scrollIntoView = () => {
      // This is a stub
    }
  })

  it('should correctly render a month', async () => {
    const today = dayjs('2021-11-09')
    const onChange = jest.fn()

    render(
      <DatePicker
        orientation="portrait"
        minDate={minDate}
        maxDate={maxDate}
        selection={{ mode: 'single', selected: today }}
        onChange={onChange}
        showToolbar
      />)

    let calendarElem = document.getElementById('calendar-box')
    expect(calendarElem).not.toBeNull()
    expect(calendarElem.nodeName.toLowerCase()).toBe('div')

    calendarElem = document.getElementById('calendar-month')
    expect(calendarElem).not.toBeNull()
    expect(calendarElem.nodeName.toLowerCase()).toBe('div')

    calendarElem = document.getElementById('date-picker-selected-date')
    expect(calendarElem).not.toBeNull()
    expect(calendarElem.nodeName.toLowerCase()).toBe('h4')
    expect(calendarElem.innerHTML).toBe('Tue, Nov 9')
  })

  it('should correctly change the selected day', async () => {
    const today = dayjs('2021-11-09')
    const onChange = jest.fn()

    render(
      <DatePicker
        minDate={minDate}
        maxDate={maxDate}
        selection={{ mode: 'single', selected: today }}
        onChange={onChange}
        orientation="portrait"
      />)

    const buttonAnotherDay = document.getElementById('button-calendar-day-2021-11-15')
    expect(buttonAnotherDay).not.toBeNull()
    buttonAnotherDay.click()

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0].format('YYYY-MM-DD')).toBe('2021-11-15')
  })

  it('should not select a date before the minDate', async () => {
    const today = dayjs('2021-11-09')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={today}
        maxDate={maxDate}
        onChange={onChange}
        orientation="portrait"
      />)

    const calendarElem = document.getElementById('calendar-month')
    Simulate.keyUp(calendarElem, { key: 'ArrowLeft' })
    expect(onChange).toHaveBeenCalledTimes(0)
  })

  it('should not select a date after the maxDate', async () => {
    const today = dayjs('2021-11-09')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={minDate}
        maxDate={today}
        onChange={onChange}
        orientation="portrait"
      />)

    const calendarElem = document.getElementById('calendar-month')
    Simulate.keyUp(calendarElem, { key: 'ArrowRight' })
    expect(onChange).toHaveBeenCalledTimes(0)
  })

  it('should refuse to change the current month before the minDate', async () => {
      const today = dayjs('2021-11-09')
      const onChange = jest.fn()

      render(
        <DatePicker
          selection={{ mode: 'single', selected: today }}
          minDate={dayjs('2021-11-03')}
          maxDate={minDate}
          onChange={onChange}
          orientation="portrait"
        />)

      const buttonPrevMonthElem = document.getElementById('calendar-header-button-prev-month')
      expect(buttonPrevMonthElem.getAttribute('disabled')).not.toBeNull()
      buttonPrevMonthElem.click()
      await waitTimeout(1)

      const prevMonthElem = document.getElementById('calendar-header-prev-month')
      expect(prevMonthElem).toBeNull()
    }
  )

  it('should refuse to change the current month after the maxDate', async () => {
    const today = dayjs('2021-11-09')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={minDate}
        maxDate={dayjs('2021-11-20')}
        onChange={onChange}
        orientation="portrait"
      />)

    let buttonNextMonthElem = document.getElementById('calendar-header-button-next-month')
    expect(buttonNextMonthElem).not.toBeNull()
    expect(buttonNextMonthElem.getAttribute('disabled')).not.toBeNull()
    buttonNextMonthElem.click()
    await waitTimeout(1)

    expect(onChange).toHaveBeenCalledTimes(0)
    buttonNextMonthElem = document.getElementById('calendar-header-next-month')
    expect(buttonNextMonthElem).toBeNull()
  })

  it('should allow to change the current year to a previous year', async () => {
    const today = dayjs('2021-11-09')
    const minDate = dayjs('2020-12-03')
    const maxDate = dayjs('2022-02-05')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        showToolbar
        orientation="landscape"
      />)

    const buttonYear = document.getElementById('date-picker-button-change-year')
    expect(buttonYear).not.toBeNull()
    expect(buttonYear.textContent).toBe('2021')

    buttonYear.click()
    await waitTimeout(1)

    const yearSelector = document.getElementById('year-selector')
    expect(yearSelector).not.toBeNull()
    expect(yearSelector.children.length).toBe(3)

    let yearElem = document.getElementById('year-2019')
    expect(yearElem).toBeNull()

    yearElem = document.getElementById('year-2020')
    expect(yearElem).not.toBeNull()
    expect(yearElem.getAttribute('aria-selected')).toBe('false')

    yearElem = document.getElementById('year-2021')
    expect(yearElem).not.toBeNull()
    expect(yearElem.getAttribute('aria-selected')).toBe('true')

    yearElem = document.getElementById('year-2022')
    expect(yearElem).not.toBeNull()
    expect(yearElem.getAttribute('aria-selected')).toBe('false')

    yearElem = document.getElementById('year-2023')
    expect(yearElem).toBeNull()

    yearElem = document.getElementById('year-2020')
    yearElem.click()
    await waitTimeout(1)

    let prevYearButton = document.getElementById('button-calendar-day-2020-12-03')
    expect(prevYearButton).not.toBeNull()
    expect(prevYearButton.getAttribute('disabled')).toBeNull()

    prevYearButton = document.getElementById('button-calendar-day-2020-12-02')
    expect(prevYearButton).not.toBeNull()
    expect(prevYearButton.getAttribute('disabled')).not.toBeNull()
  })

  it('should allow to change the current year to a next year', async () => {
    const today = dayjs('2021-11-09')
    const minDate = dayjs('2020-12-03')
    const maxDate = dayjs('2022-02-05')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        showToolbar
        orientation="landscape"
      />)

    const buttonYear = document.getElementById('date-picker-button-change-year')
    expect(buttonYear).not.toBeNull()
    buttonYear.click()
    await waitTimeout(1)

    const yearElem = document.getElementById('year-2022')
    expect(yearElem).not.toBeNull()
    yearElem.click()
    await waitTimeout(1)

    let nextYearButton = document.getElementById('button-calendar-day-2022-02-05')
    expect(nextYearButton).not.toBeNull()
    expect(nextYearButton.getAttribute('disabled')).toBeNull()

    nextYearButton = document.getElementById('button-calendar-day-2022-02-06')
    expect(nextYearButton).not.toBeNull()
    expect(nextYearButton.getAttribute('disabled')).not.toBeNull()
  })

  it('should change to the previous month when using arrow left key on first day of the month', async () => {
      const today = dayjs('2022-01-01')
      const onChange = jest.fn()

      render(
        <DatePicker
          selection={{ mode: 'single', selected: today }}
          minDate={minDate}
          maxDate={maxDate}
          onChange={onChange}
          orientation="landscape"
        />)

      const currentMonth = document.getElementById('calendar-header-current-month')
      expect(currentMonth).not.toBeNull()
      expect(currentMonth.innerHTML).toBe('January 2022')

      const calendarElem = document.getElementById('calendar-month')
      act(() => {
        Simulate.keyUp(calendarElem, { key: 'ArrowLeft' })
      })
      expect(onChange).toHaveBeenCalled()
      const newSelectedDay = onChange.mock.calls[0][0]
      expect(dayjs.isDayjs(newSelectedDay)).toBe(true)
      expect(newSelectedDay.format('YYYY-MM-DD')).toBe('2021-12-31')

      expect(document.getElementById('calendar-month-change-month-anim')).not.toBeNull()
      // Wait the anim end:
      await waitFor(() => expect(document.getElementById('calendar-month-change-month-anim')).toBeNull())
      const newMonth = document.getElementById('calendar-header-current-month')
      expect(newMonth).not.toBeNull()
      expect(newMonth.innerHTML).toBe('December 2021')
    }
  )

  it('should change to the next month when using arrow right key on last day of the month', async () => {
    const today = dayjs('2021-12-31')
    const onChange = jest.fn()

    render(
      <DatePicker
        selection={{ mode: 'single', selected: today }}
        minDate={minDate}
        maxDate={maxDate}
        onChange={onChange}
        orientation="landscape"
      />)

    const currentMonth = document.getElementById('calendar-header-current-month')
    expect(currentMonth).not.toBeNull()
    expect(currentMonth.innerHTML).toBe('December 2021')

    const calendarElem = document.getElementById('calendar-month')
    act(() => {
      Simulate.keyUp(calendarElem, { key: 'ArrowRight' })
    })
    expect(onChange).toHaveBeenCalled()
    const newSelectedDay = onChange.mock.calls[0][0]
    expect(dayjs.isDayjs(newSelectedDay)).toBe(true)
    expect(newSelectedDay.format('YYYY-MM-DD')).toBe('2022-01-01')

    expect(document.getElementById('calendar-month-change-month-anim')).not.toBeNull()
    // Wait the anim end:
    await waitFor(() => expect(document.getElementById('calendar-month-change-month-anim')).toBeNull())
    const newMonth = document.getElementById('calendar-header-current-month')
    expect(newMonth).not.toBeNull()
    expect(newMonth.innerHTML).toBe('January 2022')
  })
})
