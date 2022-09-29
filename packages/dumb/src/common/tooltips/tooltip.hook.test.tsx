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

  describe('calculateOffset', () => {
    const height = 100
    const width = 20
    const offsetTop = 1100
    const offsetLeft = 2300
    const offsetHorizontal = 3500
    const mainDivLeft = 1
    const mainDivTop = 3
    const tailDivTop = 4
    const tailDivLeft = 4
    const offset = { top: offsetTop, left: offsetLeft, horizontal: offsetHorizontal }
    const mainDiv = {
      getBoundingClientRect: () => ({
        top: mainDivTop,
        left: mainDivLeft,
        width,
        height
      })
    } as HTMLDivElement
    const tailDiv = {
      getBoundingClientRect: () => ({
        top: tailDivTop,
        left: tailDivLeft,
        width,
        height
      })
    } as HTMLDivElement

    it('should return default values when mainDiv is null', () => {
      const props = { ...defaultProps, offset }
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(null, null)
      expect(top).toBe(0)
      expect(left).toBe(0)
    })

    it('should return correct values when side is left and tailDiv is null', () => {
      const props = { ...defaultProps, offset, side: 'left' } as TooltipHookProps
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(mainDiv, null)
      expect(top).toBe(offsetTop - height / 2)
      expect(left).toBe(-offsetLeft - width)
    })

    it('should return correct values when side is top and tailDiv is null', () => {
      const props = { ...defaultProps, offset, side: 'top' } as TooltipHookProps
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(mainDiv, null)
      expect(top).toBe(offsetTop - height)
      expect(left).toBe(-width / 2 + offsetLeft)
    })

    it('should return correct values when side is right and tailDiv is null', () => {
      const props = { ...defaultProps, offset, side: 'right' } as TooltipHookProps
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(mainDiv, null)
      expect(top).toBe(offsetTop - height / 2)
      expect(left).toBe(offsetLeft)
    })

    it('should return correct values when side is bottom and tailDiv is null', () => {
      const props = { ...defaultProps, side: 'bottom' } as TooltipHookProps
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(mainDiv, null)
      expect(top).toBe(0)
      expect(left).toBe(-width / 2)
    })

    it('should return correct values when side tailDiv is not null', () => {
      const props = { ...defaultProps, side: 'bottom' } as TooltipHookProps
      const { result } = renderHook(() => useTooltip(props))
      const { top, left } = result.current.calculateOffset(mainDiv, tailDiv)
      expect(top).toBe(-(tailDivTop + (height / 2)) + mainDivTop)
      expect(left).toBe(-(tailDivLeft + (width / 2)) + mainDivLeft)
    })
  })

  describe('computeDateValue', () => {
    const defaultDateTitle: DateTitle = {
      normalTime: 'TBD',
      timezone: 'Europe/Paris',
      source: 'not Diabeloop',
      timePrefs: {
        timezoneAware: true,
        timezoneName: 'Europe/Paris'
      }
    }
    it('should return undefined when dateTitle is undefined', () => {
      const props = { ...defaultProps, dateTitle: undefined }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBeUndefined()
    })

    it('should return correct value when source is not "Diabeloop"', () => {
      const date = '2020-01-13T'
      const dateTitle = { ...defaultDateTitle, normalTime: `${date}22:00:00.000Z` }
      const props = { ...defaultProps, dateTitle }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBe(`${date}23:00:00+01:00`)
    })

    it('should return correct value when source is "Diabeloop"', () => {
      const date = '2020-01-13T'
      const dateTitle = { ...defaultDateTitle, normalTime: `${date}22:00:00.000Z`, source: 'Diabeloop' }
      const props = { ...defaultProps, dateTitle }
      const { result } = renderHook(() => useTooltip(props))
      const dateValue = result.current.computeDateValue()
      expect(dateValue).toBe(`${date}23:00:00+01:00`)
    })
  })

  describe('computeTailData', () => {
    let props = {
      ...defaultProps,
      dateTitle: undefined,
      tailWidth: 50,
      borderWidth: 20
    } as TooltipHookProps
    it('should return correct value when side is left', () => {
      props = { ...props, side: 'left' }
      const expectedMarginOuterValue = `calc(10px + ${props.borderWidth}px)`
      const { result } = renderHook(() => useTooltip(props))
      const { marginOuterValue, borderSide } = result.current.computeTailData()
      expect(marginOuterValue).toEqual(expectedMarginOuterValue)
      expect(borderSide).toEqual(props.side)
    })

    it('should return correct value when side is right', () => {
      props = { ...props, side: 'left' }
      const expectedMarginOuterValue = `calc(-100% - (4 * ${props.tailWidth}px - 10px)`
      const { result } = renderHook(() => useTooltip(props))
      const { marginOuterValue, borderSide } = result.current.computeTailData()
      expect(marginOuterValue).toEqual(expectedMarginOuterValue)
      expect(borderSide).toEqual(props.side)
    })

    it('should return correct value when side is top', () => {
      props = { ...props, side: 'top' }
      const expectedMarginOuterValue = `calc(-100% - (4 * ${props.tailWidth}px - 10px)`
      const { result } = renderHook(() => useTooltip(props))
      const { marginOuterValue, borderSide } = result.current.computeTailData()
      expect(marginOuterValue).toEqual(expectedMarginOuterValue)
      expect(borderSide).toEqual('right')
    })

    it('should return correct value when side is bottom', () => {
      props = { ...props, side: 'bottom' }
      const expectedMarginOuterValue = `calc(-100% - (4 * ${props.tailWidth}px - 10px)`
      const { result } = renderHook(() => useTooltip(props))
      const { marginOuterValue, borderSide } = result.current.computeTailData()
      expect(marginOuterValue).toEqual(expectedMarginOuterValue)
      expect(borderSide).toEqual('right')
    })
  })
})
