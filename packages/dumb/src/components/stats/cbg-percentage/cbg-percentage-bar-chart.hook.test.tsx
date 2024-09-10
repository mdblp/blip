/*
 * Copyright (c) 2022-2024, Diabeloop
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
import { type CBGPercentageBarChartHookProps, useCBGPercentageBarChartHook } from './cbg-percentage-bar-chart.hook'
import { waitFor } from '@testing-library/dom'
import { type CBGPercentageData, CBGStatType, StatLevel } from '../../../models/stats.model'
import { type TimeInRangeData } from 'tidepool-viz/src/types/utils/data'
import { DatumType } from 'medical-domain'

describe('CBGPercentageBarChart hook', () => {
  const veryHighStatValue = 100
  const highStatValue = 200
  const targetStatValue = 150
  const lowStatValue = 250
  const veryLowStatValue = 50
  const total = veryLowStatValue + lowStatValue + targetStatValue + highStatValue + veryHighStatValue
  const createCBGTimeData = (id: StatLevel, title: string, value: number): CBGPercentageData => {
    return { id, title, value }
  }
  const veryHighStat = createCBGTimeData(StatLevel.VeryHigh, 'Time Above Range', veryHighStatValue)
  const highStat = createCBGTimeData(StatLevel.High, 'Time Above Range', highStatValue)
  const targetStat = createCBGTimeData(StatLevel.Target, 'Time In Range', targetStatValue)
  const lowStat = createCBGTimeData(StatLevel.Low, 'Time Below Range', lowStatValue)
  const veryLowStat = createCBGTimeData(StatLevel.VeryLow, 'Time Below Range', veryLowStatValue)

  const data: TimeInRangeData = {
    veryHigh: veryHighStatValue,
    high: highStatValue,
    target: targetStatValue,
    low: lowStatValue,
    veryLow: veryLowStatValue,
    /*
    TODO waiting YLP-2141 (https://diabeloop.atlassian.net/browse/YLP-2141)
     This stat is not calculated correctly in blip code, need to fix this when we will migrate data calculation to yourloops
     Currently it's computed with sum of each bound
     */
    total: 1000
  }

  const defaultProps: CBGPercentageBarChartHookProps = {
    bgType: DatumType.Cbg,
    data,
    days: 2,
    type: CBGStatType.TimeInRange,
  }

  it('should return correct cbgStatsProps', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useCBGPercentageBarChartHook(props))
    expect(result.current.cbgStatsProps).toEqual({
      veryHighStat: {
        type: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.anything(),
        total,
        ...veryHighStat
      },
      highStat: {
        type: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.anything(),
        total,
        ...highStat
      },
      targetStat: {
        type: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.anything(),
        total,
        ...targetStat
      },
      lowStat: {
        type: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.anything(),
        total,
        ...lowStat
      },
      veryLowStat: {
        type: CBGStatType.TimeInRange,
        isDisabled: false,
        onMouseEnter: expect.anything(),
        total,
        ...veryLowStat
      }
    })
  })

  it('should compute the right title', () => {
    const { result: firstHook } = renderHook(() => useCBGPercentageBarChartHook({ ...defaultProps }))
    expect(firstHook.current.title).toEqual('Avg. Daily Time In Range')

    const { result: secondHook } = renderHook(() => useCBGPercentageBarChartHook({ ...defaultProps, days: 0 }))
    expect(secondHook.current.title).toEqual('Time In Range')

    const { result: thirdHook } = renderHook(() => useCBGPercentageBarChartHook({
      ...defaultProps,
      type: CBGStatType.ReadingsInRange
    }))
    expect(thirdHook.current.title).toEqual('Avg. Daily Readings In Range')

    const { result: fourthHook } = renderHook(() => useCBGPercentageBarChartHook({
      ...defaultProps,
      days: 0,
      type: CBGStatType.ReadingsInRange
    }))
    expect(fourthHook.current.title).toEqual('Readings In Range')

    const { result: fifthHook } = renderHook(() => useCBGPercentageBarChartHook({
      ...defaultProps,
      bgType: DatumType.Smbg
    }))
    expect(fifthHook.current.title).toEqual('Avg. Daily Time In Range')
  })

  it('should compute the right annotations', () => {
    const { result: firstHook } = renderHook(() => useCBGPercentageBarChartHook({ ...defaultProps }))
    expect(firstHook.current.annotations).toEqual(['**Time In Range:** Daily average of the time spent in range, based on CGM readings.', '**How we calculate this:**\n\n**(%)** is the number of readings in range divided by all readings for this time period.\n\n**(time)** is number of readings in range multiplied by the CGM sample frequency.'])

    const { result: secondHook } = renderHook(() => useCBGPercentageBarChartHook({ ...defaultProps, days: 0 }))
    expect(secondHook.current.annotations).toEqual(['**Time In Range:** Time spent in range, based on CGM readings.', '**How we calculate this:**\n\n**(%)** is the number of readings in range divided by all readings for this time period.\n\n**(time)** is 24 hours multiplied by % in range.'])

    const { result: thirdHook } = renderHook(() => useCBGPercentageBarChartHook({
      ...defaultProps,
      days: 0,
      type: CBGStatType.ReadingsInRange
    }))
    expect(thirdHook.current.annotations).toEqual(['**Readings In Range:** Number of BGM readings.'])

    const { result: fourthHook } = renderHook(() => useCBGPercentageBarChartHook({
      ...defaultProps,
      bgType: DatumType.Smbg
    }))
    expect(fourthHook.current.annotations).toEqual(['**Time In Range:** Daily average of the time spent in range, based on CGM readings.', '**How we calculate this:**\n\n**(%)** is the number of readings in range divided by all readings for this time period.\n\n**(time)** is number of readings in range multiplied by the CGM sample frequency.', 'Derived from _**1000**_ BGM readings.'])
  })

  it('onMouseOver and OnMouseLeave should return correct values', async () => {
    const props = { ...defaultProps }
    const defaultTitle = 'Avg. Daily Time In Range'
    const { result } = renderHook(() => useCBGPercentageBarChartHook(props))
    expect(result.current.hoveredStatId).toBeNull()
    expect(result.current.title).toEqual(defaultTitle)
    await act(async () => {
      result.current.cbgStatsProps.veryHighStat.onMouseEnter(veryHighStat.id, veryHighStat.title, true)
    })
    await waitFor(() => {
      expect(result.current.hoveredStatId).toEqual(veryHighStat.id)
    })
    expect(result.current.title).toEqual(veryHighStat.title)
    await act(async () => {
      result.current.onMouseLeave()
    })
    await waitFor(() => {
      expect(result.current.hoveredStatId).toBeNull()
    })
    expect(result.current.title).toEqual(defaultTitle)
  })
})
