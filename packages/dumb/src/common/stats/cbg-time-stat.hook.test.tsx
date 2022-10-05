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
import { CBGTimeStatHookProps, useCBGTimeStat } from './cbg-time-stat.hook'

describe('CBGTimeStat hook', () => {
  const onMouseLeaveMock = jest.fn()
  const onMouseOverMock = jest.fn()
  const defaultProps = {
    hoveredStatId: null,
    id: 'fakeId',
    legendTitle: 'fakeLegendTitle',
    onMouseLeave: onMouseLeaveMock as Function,
    onMouseOver: onMouseOverMock as Function,
    title: 'fakeTitle',
    total: 1000,
    value: 200
  } as CBGTimeStatHookProps

  describe('handleMouseOver', () => {
    it('should not call onMouseOver when total is 0', () => {
      const props = { ...defaultProps, total: 0 }
      const { result } = renderHook(() => useCBGTimeStat(props))
      result.current.handleMouseOver()
      expect(onMouseOverMock).not.toBeCalled()
    })

    it('should not call onMouseOver when hoveredStatId is not equal to id', () => {
      const props = { ...defaultProps, hoveredStatId: 'unknownId' }
      const { result } = renderHook(() => useCBGTimeStat(props))
      result.current.handleMouseOver()
      expect(onMouseOverMock).not.toBeCalled()
    })

    it('should call onMouseOver', () => {
      const props = { ...defaultProps }
      const { result } = renderHook(() => useCBGTimeStat(props))
      result.current.handleMouseOver()
      expect(onMouseOverMock).toBeCalled()
    })
  })
})
