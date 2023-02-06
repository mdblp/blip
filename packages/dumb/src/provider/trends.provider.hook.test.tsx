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

import { act, renderHook } from '@testing-library/react-hooks/dom'
import { useTrendsProviderHook } from './trends.provider.hook'
import { DisplayFlag } from '../models/enums/display-flag.enum'

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
})
