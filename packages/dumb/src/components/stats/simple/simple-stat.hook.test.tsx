/*
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
import { SimpleStatHookProps, useSimpleStatHook } from './simple-stat.hook'
import { StatFormats } from '../../../models/stats.model'

describe('SimpleStat hook', () => {
  it('should return correct ChartSummaryProps when format is cv and value > 0', () => {
    const props: SimpleStatHookProps = { summaryFormat: StatFormats.cv, total: 10, value: 5.265 }
    const { result } = renderHook(() => useSimpleStatHook(props))
    expect(result.current.chartSummaryProps).toEqual({ className: undefined, suffix: '%', value: '5' })
  })

  it('should return correct ChartSummaryProps when format is gmi and value > 0', () => {
    const props: SimpleStatHookProps = { summaryFormat: StatFormats.cv, total: 10, value: 38.63 }
    const { result } = renderHook(() => useSimpleStatHook(props))
    expect(result.current.chartSummaryProps).toEqual({ className: undefined, suffix: '%', value: '39' })
  })

  it('should return correct ChartSummaryProps when format is percentage and total > 0', () => {
    const props: SimpleStatHookProps = { summaryFormat: StatFormats.percentage, total: 10, value: 4.56 }
    const { result } = renderHook(() => useSimpleStatHook(props))
    expect(result.current.chartSummaryProps).toEqual({ className: undefined, suffix: '%', value: '46' })
  })

  it('should return correct ChartSummaryProps when format is unknown', () => {
    const props: SimpleStatHookProps = { summaryFormat: StatFormats.units, total: 10, value: 4.56 }
    const { result } = renderHook(() => useSimpleStatHook(props))
    expect(result.current.chartSummaryProps).toEqual({ className: undefined, suffix: '', value: '--' })
  })
})
