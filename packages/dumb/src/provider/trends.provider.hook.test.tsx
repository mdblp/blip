/*
 * Copyright (c) 2023, Diabeloop
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

import { act, renderHook } from '@testing-library/react'
import { useTrendsProviderHook } from './trends.provider.hook'
import { DisplayFlag } from '../models/enums/display-flag.enum'
import { RangeSegmentSlice } from '../models/enums/range-segment.enum'

describe('Trends provider hook', () => {
  describe('toggleCbgSegments', () => {
    it('should compute display flags properly', async () => {
      const { result } = renderHook(() => useTrendsProviderHook())

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: true,
        cbg80Enabled: true,
        cbg100Enabled: true,
        cbgMedianEnabled: true
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.CbgMedianEnabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: true,
        cbg80Enabled: true,
        cbg100Enabled: true,
        cbgMedianEnabled: false
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg100Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: true,
        cbg80Enabled: true,
        cbg100Enabled: false,
        cbgMedianEnabled: false
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg80Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: true,
        cbg80Enabled: false,
        cbg100Enabled: false,
        cbgMedianEnabled: false
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg50Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: false,
        cbg80Enabled: false,
        cbg100Enabled: false,
        cbgMedianEnabled: false
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.CbgMedianEnabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: false,
        cbg80Enabled: false,
        cbg100Enabled: false,
        cbgMedianEnabled: true
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg100Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: false,
        cbg80Enabled: false,
        cbg100Enabled: true,
        cbgMedianEnabled: true
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg80Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: false,
        cbg80Enabled: true,
        cbg100Enabled: true,
        cbgMedianEnabled: true
      })

      act(() => {
        result.current.toggleCbgSegments(DisplayFlag.Cbg50Enabled)
      })

      expect(result.current.displayFlags).toEqual({
        cbg50Enabled: true,
        cbg80Enabled: true,
        cbg100Enabled: true,
        cbgMedianEnabled: true
      })
    })

    it('should throw error when given display flags is incorrect', async () => {
      const { result } = renderHook(() => useTrendsProviderHook())

      expect(() => {
        result.current.toggleCbgSegments('incorrect display flag' as DisplayFlag)
      }).toThrow('Display flag field "incorrect display flag" is unknown')
    })
  })

  describe('focusCbgSlice and unfocusCbgSlice', () => {
    it('should set and unset the focused cbg slice', () => {
      jest.useFakeTimers()

      const cbgSlice = {
        id: '65700000',
        [RangeSegmentSlice.FirstQuartile]: 133,
        [RangeSegmentSlice.Max]: 384,
        [RangeSegmentSlice.Median]: 202,
        [RangeSegmentSlice.Min]: 97,
        msFrom: 64800000,
        msTo: 66600000,
        msX: 65700000,
        [RangeSegmentSlice.NinetiethQuantile]: 277,
        [RangeSegmentSlice.TenthQuantile]: 126,
        [RangeSegmentSlice.ThirdQuartile]: 243
      }

      const cbgSlicePosition = {
        left: 727.8125,
        tooltipLeft: true,
        yPositions: {
          [RangeSegmentSlice.FirstQuartile]: 380.8450704225352,
          [RangeSegmentSlice.Max]: 98.02816901408453,
          [RangeSegmentSlice.Median]: 303.09859154929575,
          [RangeSegmentSlice.Min]: 421.40845070422534,
          [RangeSegmentSlice.NinetiethQuantile]: 218.59154929577466,
          [RangeSegmentSlice.TenthQuantile]: 388.7323943661972,
          [RangeSegmentSlice.ThirdQuartile]: 256.9014084507042,
          topMargin: 30
        }
      }

      const cbgSliceKeys = [RangeSegmentSlice.NinetiethQuantile, RangeSegmentSlice.Max]

      const cbgDateTrace = {
        epoch: 1668097800000,
        id: 'cbg_c437da0c3215_2022-11-10_198',
        localDate: '2022-11-10',
        msPer24: 63000000,
        value: 402
      }

      const cbgDateTracePosition = {
        left: 699.875,
        yPositions: { top: 80, topMargin: 30 }
      }

      const { result } = renderHook(() => useTrendsProviderHook())

      act(() => {
        result.current.focusCbgSlice(cbgSlice, cbgSlicePosition, cbgSliceKeys)
        jest.runAllTimers()
        result.current.focusCbgDateTrace(cbgDateTrace, cbgDateTracePosition)
      })

      expect(result.current.focusedCbgSlice).toEqual({
        data: cbgSlice,
        position: cbgSlicePosition,
        keys: cbgSliceKeys
      })
      expect(result.current.showCbgDateTraces).toEqual(true)
      expect(result.current.focusedCbgDateTrace).toEqual({
        data: cbgDateTrace,
        position: cbgDateTracePosition
      })

      act(() => {
        result.current.unfocusCbgSlice()
      })

      expect(result.current.focusedCbgSlice).toEqual(undefined)
      expect(result.current.showCbgDateTraces).toEqual(false)
      expect(result.current.focusedCbgDateTrace).toEqual(undefined)
    })
  })
})
