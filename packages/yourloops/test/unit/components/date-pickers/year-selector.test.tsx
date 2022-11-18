/*
 * Copyright (c) 2021-2022, Diabeloop
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
import { act, Simulate } from 'react-dom/test-utils'

import { MAX_YEAR, MIN_YEAR } from '../../../../components/date-pickers/models'
import YearSelector from '../../../../components/date-pickers/year-selector'

describe('Year selector', () => {
  let container: HTMLDivElement | null = null

  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = () => {
      // This is a stub
    }
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

  it('should correctly render the default list of years', async () => {
    const onSelectYear = jest.fn()
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <YearSelector
            minYear={1900}
            maxYear={2100}
            selectedYear={2021}
            onSelectYear={onSelectYear}
          />, container, resolve)
      })
    })

    const yearSelector = document.getElementById('year-selector')
    expect(yearSelector).not.toBeNull()
    expect(yearSelector.children.length).toBe(MAX_YEAR - MIN_YEAR + 1)
  })

  it('should select the previous year with the arrow up key', async () => {
    const onSelectYear = jest.fn()
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <YearSelector
            selectedYear={2021}
            maxYear={2024}
            minYear={2017}
            onSelectYear={onSelectYear}
          />, container, resolve)
      })
    })

    const yearSelector = document.getElementById('year-selector')
    const year2020 = document.getElementById('year-2020')
    const year2021 = document.getElementById('year-2021')

    expect(year2020.getAttribute('aria-selected')).toBe('false')
    expect(year2021.getAttribute('aria-selected')).toBe('true')

    Simulate.keyUp(yearSelector, { key: 'ArrowUp' })

    expect(year2020.getAttribute('aria-selected')).toBe('true')
    expect(year2021.getAttribute('aria-selected')).toBe('false')

    Simulate.keyUp(yearSelector, { key: 'Enter' })
    expect(onSelectYear).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line no-magic-numbers
    expect(onSelectYear.mock.calls[0][0]).toBe(2020)
  })

  it('should select the next year with the arrow down key', async () => {
    const onSelectYear = jest.fn()
    await act(() => {
      return new Promise((resolve) => {
        ReactDOM.render(
          <YearSelector
            selectedYear={2021}
            maxYear={2024}
            minYear={2017}
            onSelectYear={onSelectYear}
          />, container, resolve)
      })
    })

    const yearSelector = document.getElementById('year-selector')
    const year2021 = document.getElementById('year-2021')
    const year2022 = document.getElementById('year-2022')

    expect(year2021.getAttribute('aria-selected')).toBe('true')
    expect(year2022.getAttribute('aria-selected')).toBe('false')

    Simulate.keyUp(yearSelector, { key: 'ArrowDown' })

    expect(year2021.getAttribute('aria-selected')).toBe('false')
    expect(year2022.getAttribute('aria-selected')).toBe('true')

    Simulate.keyUp(yearSelector, { key: ' ' })
    expect(onSelectYear).toHaveBeenCalledTimes(1)
    // eslint-disable-next-line no-magic-numbers
    expect(onSelectYear.mock.calls[0][0]).toBe(2022)
  })
})
