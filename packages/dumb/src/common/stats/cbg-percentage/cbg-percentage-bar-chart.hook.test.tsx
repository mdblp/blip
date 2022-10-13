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
import { CBGPercentageBarChartHookProps, useCbgPercentageBarChartHook } from './cbg-percentage-bar-chart.hook'
import { waitFor } from '@testing-library/dom'
import { CBGPercentageData, CBGStatType, StatLevel } from '../models'

describe('CBGPercentageBarChart hook', () => {
  const total = 1000
  const createCBGTimeData = (id: StatLevel, legendTitle: string, title: string, value: number): CBGPercentageData => {
    return { id, legendTitle, title, value }
  }
  const veryHighStat = createCBGTimeData(StatLevel.VeryHigh, 'fakeLegendTitle', 'fakeTitle', 100)
  const highStat = createCBGTimeData(StatLevel.High, 'fakeLegendTitle2', 'fakeTitle2', 200)
  const targetStat = createCBGTimeData(StatLevel.Target, 'fakeLegendTitle3', 'fakeTitle3', 150)
  const lowStat = createCBGTimeData(StatLevel.Low, 'fakeLegendTitle4', 'fakeTitle4', 250)
  const veryLowStat = createCBGTimeData(StatLevel.VeryLow, 'fakeLegendTitle5', 'fakeTitle5', 50)

  const defaultProps: CBGPercentageBarChartHookProps = {
    cbgStatType: CBGStatType.TimeInRange,
    data: [veryHighStat, highStat, targetStat, lowStat, veryLowStat],
    hideTooltip: false,
    titleKey: 'fakeTitleKey',
    total
  }

  it('should return correct cbgStatsProps', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useCbgPercentageBarChartHook(props))
    expect(result.current.cbgStatsProps).toEqual({
      veryHighStat: {
        cbgStatType: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.any(Function),
        total: defaultProps.total,
        ...veryHighStat
      },
      highStat: {
        cbgStatType: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.any(Function),
        total: defaultProps.total,
        ...highStat
      },
      targetStat: {
        cbgStatType: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.any(Function),
        total: defaultProps.total,
        ...targetStat
      },
      lowStat: {
        cbgStatType: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.any(Function),
        total: defaultProps.total,
        ...lowStat
      },
      veryLowStat: {
        cbgStatType: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.any(Function),
        total: defaultProps.total,
        ...veryLowStat
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
    const { result } = renderHook(() => useCbgPercentageBarChartHook(props))
    expect(result.current.hoveredStatId).toBeNull()
    expect(result.current.titleProps).toEqual(defaultTitleProps)
    await act(async () => {
      result.current.cbgStatsProps.veryHighStat.onMouseEnter(veryHighStat.id, veryHighStat.title, veryHighStat.legendTitle, true)
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
