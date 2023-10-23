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

import DialogRangeDatePicker from '../../../../components/date-pickers/dialog-range-date-picker'
import i18n from '../../../../lib/language'
import initDayJS from '../../../../lib/dayjs'

import { render } from '@testing-library/react'

describe('Dialog range date picker', () => {
  const handleResultStub = jest.fn()
  const handleSelectedDateChange = jest.fn()

  beforeAll(() => {
    initDayJS()
    i18n.addResourceBundle('en', 'yourloops', {
      'date-picker-header-date-format': 'MMMM YYYY',
      'date-picker-toolbar-date-format': 'ddd, MMM D'
    })
  })

  beforeEach(() => {
    handleResultStub.mockReset()
    handleSelectedDateChange.mockReset()
  })

  it('should render the calendar when using the enter key on the button', () => {
      render(
        <DialogRangeDatePicker
          onResult={handleResultStub}
          onSelectedDateChange={handleSelectedDateChange}
        />)

      const calendarElem = document.getElementById('calendar-box-first')
      expect(calendarElem).not.toBeNull()
      expect(handleResultStub).toHaveBeenCalledTimes(0)
      expect(handleSelectedDateChange).toHaveBeenCalledTimes(1)
    }
  )

  it('should render the calendar when using the space key on the button', () => {
      render(
        <DialogRangeDatePicker
          onResult={handleResultStub}
          onSelectedDateChange={handleSelectedDateChange}
        />)

      const calendarElem = document.getElementById('calendar-box-first')
      expect(calendarElem).not.toBeNull()
      expect(handleResultStub).toHaveBeenCalledTimes(0)
      expect(handleSelectedDateChange).toHaveBeenCalledTimes(1)
    }
  )

  it('should tell when the calendar is closed using the cancel button', () => {
      render(<DialogRangeDatePicker onResult={handleResultStub} />)

      const buttonCancel = document.getElementById('date-picker-button-cancel')
      expect(buttonCancel).not.toBeNull()
      buttonCancel.click()

      expect(handleResultStub).toHaveBeenCalledTimes(1)
      expect(handleResultStub.mock.calls[0]).toHaveLength(0)

      expect(handleResultStub.mock.calls[0]).toHaveLength(0)
    }
  )

  it('should restrict selected date to min/max dates', () => {
    render(
      <DialogRangeDatePicker
        onResult={handleResultStub}
        onSelectedDateChange={handleSelectedDateChange}
        start="2021-01-01"
        end="2022-12-01"
        minDate="2022-01-01"
        maxDate="2022-01-30"
      />)

    expect(handleSelectedDateChange).toHaveBeenCalledTimes(1)
    expect(handleSelectedDateChange.mock.calls[0]).toEqual(['2022-01-01', '2022-01-30'])

    const buttonCancel = document.getElementById('date-picker-button-cancel')
    expect(buttonCancel).not.toBeNull()
    buttonCancel.click()
    expect(handleResultStub).toHaveBeenCalledTimes(1)
  })

  it('should handle wrong dates inputs', () => {
    render(
      <DialogRangeDatePicker
        onResult={handleResultStub}
        start="2022-12-01"
        end="2021-01-01"
        minDate="2022-01-30"
        maxDate="2022-01-01"
      />)

    const buttonOk = document.getElementById('date-picker-button-ok')
    expect(buttonOk).not.toBeNull()
    buttonOk.click()
    expect(handleResultStub).toHaveBeenCalledTimes(1)
    expect(handleResultStub.mock.calls[0]).toEqual(['2022-01-01', '2022-01-30'])
  })
})
