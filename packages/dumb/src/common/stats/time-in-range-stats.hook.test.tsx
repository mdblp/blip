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

import { act, renderHook } from '@testing-library/react-hooks/dom'
import { TimeInRangeStatsTitleHookProps, useTimeInRangeStatsHook } from './time-in-range-stats.hook'
import { CBGTimeData, StatLevel } from './time-in-range-stats'
import { waitFor } from '@testing-library/dom'

describe('TimeInRangeStat hook', () => {
  const total = 1000
  const createCbgStatProps = (id: StatLevel, legendTitle: string, title: string, value: number): CBGTimeData => {
    return { id, legendTitle, title, value }
  }
  const veryHighStat = createCbgStatProps(StatLevel.VeryHigh, 'fakeLegendTitle', 'fakeTitle', 100)
  const highStat = createCbgStatProps(StatLevel.High, 'fakeLegendTitle2', 'fakeTitle2', 200)
  const targetStat = createCbgStatProps(StatLevel.Target, 'fakeLegendTitle3', 'fakeTitle3', 150)
  const lowStat = createCbgStatProps(StatLevel.Low, 'fakeLegendTitle4', 'fakeTitle4', 250)
  const veryLowStat = createCbgStatProps(StatLevel.VeryLow, 'fakeLegendTitle5', 'fakeTitle5', 50)

  const defaultProps = {
    data: [veryHighStat, highStat, targetStat, lowStat, veryLowStat],
    titleKey: 'fakeTitleKey',
    total
  } as TimeInRangeStatsTitleHookProps

  it('should return correct cbgStatsProps', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useTimeInRangeStatsHook(props))
    expect(result.current.cbgStatsProps).toEqual({
      veryHighStat: {
        id: veryHighStat.id,
        isDisabled: false,
        onMouseOver: expect.any(Function),
        total: defaultProps.total,
        value: veryHighStat.value
      },
      highStat: {
        id: highStat.id,
        isDisabled: false,
        onMouseOver: expect.any(Function),
        total: defaultProps.total,
        value: highStat.value
      },
      targetStat: {
        id: targetStat.id,
        isDisabled: false,
        onMouseOver: expect.any(Function),
        total: defaultProps.total,
        value: targetStat.value
      },
      lowStat: {
        id: lowStat.id,
        isDisabled: false,
        onMouseOver: expect.any(Function),
        total: defaultProps.total,
        value: lowStat.value
      },
      veryLowStat: {
        id: veryLowStat.id,
        isDisabled: false,
        onMouseOver: expect.any(Function),
        total: defaultProps.total,
        value: veryLowStat.value
      }
    })
  })

  it('onMouseOver and OnMouseLeave should return correct values', async () => {
    const props = { ...defaultProps, total: 1000 }
    const defaultTitleProps = {
      legendTitle: '',
      showTooltipIcon: true,
      title: defaultProps.titleKey
    }
    const { result } = renderHook(() => useTimeInRangeStatsHook(props))
    expect(result.current.hoveredStatId).toBeNull()
    expect(result.current.titleProps).toEqual(defaultTitleProps)
    await act(async () => {
      result.current.cbgStatsProps.veryHighStat.onMouseOver()
      await waitFor(() => expect(result.current.hoveredStatId).toEqual(veryHighStat.id))
    })
    expect(result.current.titleProps).toEqual({
      legendTitle: veryHighStat.legendTitle,
      showTooltipIcon: false,
      title: veryHighStat.title
    })
    await act(async () => {
      result.current.onMouseLeave()
      await waitFor(() => expect(result.current.hoveredStatId).toBeNull())
    })
    expect(result.current.titleProps).toEqual(defaultTitleProps)
  })
})
