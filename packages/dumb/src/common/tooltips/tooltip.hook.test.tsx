/**
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

import { renderHook } from '@testing-library/react-hooks/dom'
import useTooltip, { TooltipHookProps } from './tooltip.hook'
import { DateTitle } from './tooltip'

describe('Tooltip hook', () => {
  const defaultProps = { offset: { top: 0 }, position: { top: 0, left: 0 } } as TooltipHookProps
  describe('computeDateValue', () => {
    it('should return undefined when dateTitle is undefined', () => {
      const props = { ...defaultProps, dateTitle: undefined }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBeUndefined()
    })

    it('should return correct value when source is not "Diabeloop"', () => {
      const date = '2020-01-13T'
      const dateTitle: DateTitle = {
        normalTime: `${date}22:00:00.000Z`,
        timezone: 'fakeTimezone',
        source: 'not Diabeloop',
        timePrefs: {
          timezoneAware: true,
          timezoneName: 'Europe/Paris'
        }
      }
      const props = { ...defaultProps, dateTitle }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBe(`${date}23:00:00+01:00`)
    })

    it('should return correct value when source is "Diabeloop"', () => {
      const date = '2020-01-13T22:00:00'
      const dateTitle: DateTitle = {
        normalTime: `${date}.000Z`,
        timezone: 'fakeTimezone',
        source: 'Diabeloop',
        timePrefs: {
          timezoneAware: true,
          timezoneName: 'Europe/Paris'
        }
      }
      const props = { ...defaultProps, dateTitle }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBe(`${date}Z`)
    })
  })
})
