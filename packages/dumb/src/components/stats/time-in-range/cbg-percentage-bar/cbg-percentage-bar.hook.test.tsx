/*
 * Copyright (c) 2022-2025, Diabeloop
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

import { renderHook } from '@testing-library/react'
import { CBGStatType } from '../../../../models/stats.model'
import { type CBGPercentageBarHookProps, useCBGPercentageBar } from './cbg-percentage-bar.hook'

describe('CBGPercentageBar hook', () => {
  const onMouseLeaveMock = jest.fn()
  const onMouseOverMock = jest.fn()
  const defaultProps = {
    type: CBGStatType.TimeInRange,
    id: 'fakeId',
    isDisabled: false,
    legendTitle: 'fakeLegendTitle',
    onMouseLeave: onMouseLeaveMock,
    onMouseOver: onMouseOverMock,
    title: 'fakeTitle',
    total: 1000,
    value: 200
  } as CBGPercentageBarHookProps

  it('should return correct percentage', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useCBGPercentageBar(props))
    expect(result.current.percentage).toBe(20)
  })

  it('should return hasValues as true when total is not 0', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useCBGPercentageBar(props))
    expect(result.current.hasValues).toBeTruthy()
  })

  it('should return hasValues as false when total is 0', () => {
    const props = { ...defaultProps, total: 0 }
    const { result } = renderHook(() => useCBGPercentageBar(props))
    expect(result.current.hasValues).toBeFalsy()
  })

  it('should return barValue equals value when CBGStatType is ReadingsInRange', () => {
    const props = { ...defaultProps, type: CBGStatType.ReadingsInRange }
    const { result } = renderHook(() => useCBGPercentageBar(props))
    expect(result.current.barValue).toBe(defaultProps.value.toString())
  })
})
