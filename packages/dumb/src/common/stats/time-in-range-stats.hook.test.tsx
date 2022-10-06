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
import { StatLevel, TimeInRangeData } from './time-in-range-stats'
import { waitFor } from '@testing-library/dom'

describe('TimeInRangeStat hook', () => {
  const createStat = (id: StatLevel, legendTitle: string, title: string, value: number): TimeInRangeData => {
    return { id, legendTitle, title, value }
  }
  const veryHighStat = createStat(StatLevel.VeryHigh, 'fakeLegendTitle', 'fakeTitle', 100)
  const highStat = createStat(StatLevel.High, 'fakeLegendTitle2', 'fakeTitle2', 200)
  const targetStat = createStat(StatLevel.Target, 'fakeLegendTitle3', 'fakeTitle3', 150)
  const lowStat = createStat(StatLevel.Low, 'fakeLegendTitle4', 'fakeTitle4', 250)
  const veryLowStat = createStat(StatLevel.VeryLow, 'fakeLegendTitle5', 'fakeTitle5', 50)

  const defaultProps = {
    data: [veryHighStat, highStat, targetStat, lowStat, veryLowStat],
    titleKey: 'fakeTitleKey',
    total: 1000
  } as TimeInRangeStatsTitleHookProps

  it('should return correct cbgStats', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useTimeInRangeStatsHook(props))
    expect(result.current.cbgStats).toEqual({
      veryHighStat, highStat, targetStat, lowStat, veryLowStat
    })
  })

  it('onMouseOver and OnMouseLeave should return correct values', async () => {
    const props = { ...defaultProps, total: 0 }
    const defaultTitleProps = {
      legendTitle: '',
      showTooltipIcon: true,
      title: defaultProps.titleKey
    }
    const { result } = renderHook(() => useTimeInRangeStatsHook(props))
    expect(result.current.hoveredStatId).toBeNull()
    expect(result.current.titleProps).toEqual(defaultTitleProps)
    await act(async () => {
      result.current.cbgStats.veryHighStat.onMouseOver(veryHighStat.id, veryHighStat.title, veryHighStat.legendTitle)
      await waitFor(() => expect(result.current.hoveredStatId).toEqual(veryHighStat.id))
    })
    expect(result.current.titleProps).toEqual({
      legendTitle: veryHighStat.legendTitle,
      showTooltipIcon: false,
      title: veryHighStat.title
    })
    await act(async () => {
      result.current.cbgStats.veryHighStat.onMouseLeave()
      await waitFor(() => expect(result.current.hoveredStatId).toBeNull())
    })
    expect(result.current.titleProps).toEqual(defaultTitleProps)
  })
})
