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

import React from 'react'
import ReactDOM from 'react-dom'
import { act } from 'react-dom/test-utils'
import dayjs from 'dayjs'

import MonthDayElements from '../../../../components/date-pickers/month-days-elements'
import initDayJS from '../../../../lib/dayjs'

describe('Month day element', () => {
  let container: HTMLDivElement | null = null

  beforeAll(() => {
    initDayJS()
  })

  beforeEach(() => {
    container = document.createElement('div')
    document.body.appendChild(container)
  })
  afterEach(() => {
    if (container) {
      ReactDOM.unmountComponentAtNode(container)
      document.body.removeChild(container)
      container = null
    }
  })

  it('should correctly render a month', async () => {
    const today = dayjs('2021-11-01T12:00:00Z') // Monday
    const yesterday = today.subtract(1, 'day')
    const tomorrow = today.add(1, 'day')
    const days = today.getWeekArray()
    const onChange = jest.fn()
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <MonthDayElements
            daysArray={days}
            currentMonth={today.month()}
            onChange={onChange}
            selection={{ mode: 'single', selected: today }}
            minDate={yesterday}
            maxDate={tomorrow}
          />, container, resolve)
      })
    })

    const todayElem = document.getElementById('button-calendar-day-2021-11-01')
    const yesterdayElem = document.getElementById('button-calendar-day-2021-10-31')
    const tomorrowElem = document.getElementById('button-calendar-day-2021-11-02')
    const afterTomorrowElem = document.getElementById('button-calendar-day-2021-11-03')

    expect(todayElem).not.toBeNull()
    expect(todayElem.getAttribute('disabled')).toBeNull()
    expect(todayElem.getAttribute('aria-selected')).toBe('true')
    expect(todayElem.className).toContain('date-pickers-day-selected')
    expect(todayElem.textContent).toBe('1')
    todayElem.click()
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(today.isSame(onChange.mock.calls[0][0], 'day')).toBe(true)

    expect(yesterdayElem).not.toBeNull()
    expect(typeof yesterdayElem.getAttribute('disabled')).toBe('string')
    expect(yesterdayElem.innerHTML).toBe('31')

    expect(tomorrowElem).not.toBeNull()
    expect(tomorrowElem.getAttribute('disabled')).toBeNull()
    expect(tomorrowElem.textContent).toBe('2')
    tomorrowElem.click()
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(tomorrow.isSame(onChange.mock.calls[1][0], 'day')).toBe(true)

    expect(afterTomorrowElem).not.toBeNull()
    expect(typeof afterTomorrowElem.getAttribute('disabled')).toBe('string')
    expect(afterTomorrowElem.innerHTML).toBe('3')
  })
})
