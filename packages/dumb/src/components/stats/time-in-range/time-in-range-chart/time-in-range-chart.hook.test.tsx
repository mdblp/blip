/*
 * Copyright (c) 2022-2026, Diabeloop
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

import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { Unit } from 'medical-domain'
import { type TimeInRangeData } from 'tidepool-viz/src/types/utils/data'
import { type CBGPercentageData, CBGStatType, StatLevel } from '../../../../models/stats.model'
import { type TimeInRangeChartHookProps, useTimeInRangeChartHook } from './time-in-range-chart.hook'

describe('Time in range chart hook', () => {
  const veryHighStatValue = 100
  const highStatValue = 200
  const targetStatValue = 150
  const lowStatValue = 250
  const veryLowStatValue = 50
  const total = 1000

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
    total: 1000
  }

  const defaultProps: TimeInRangeChartHookProps = {
    data,
    bgPrefs: {
      bgBounds: {
        veryHighThreshold: 250,
        targetUpperBound: 180,
        targetLowerBound: 70,
        veryLowThreshold: 54
      },
      bgUnits: Unit.MilligramPerDeciliter,
      bgClasses: {
        [StatLevel.VeryHigh]: 250,
        [StatLevel.High]: 180,
        [StatLevel.Target]: 70,
        [StatLevel.Low]: 54,
        [StatLevel.VeryLow]: 0
      }
    },
  }

  it('should return correct cbgStatsProps', () => {
    const props = { ...defaultProps }
    const { result } = renderHook(() => useTimeInRangeChartHook(props))

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
    const { result: firstHook } = renderHook(() => useTimeInRangeChartHook({ ...defaultProps }))
    expect(firstHook.current.title).toEqual('Time In Range')
  })

  it('should compute the right annotations', () => {
    const { result: firstHook } = renderHook(() => useTimeInRangeChartHook({ ...defaultProps }))
    expect(firstHook.current.annotations).toEqual(['**Time In Range:** Time spent in range, based on CGM readings.', '**How we calculate this:**\n\n**(%)** is the number of readings in range divided by all readings for this time period.\n\n**(time)** is 24 hours multiplied by % in range.'])
  })

  it('onMouseOver and OnMouseLeave should return correct values', async () => {
    const props = { ...defaultProps }
    const defaultTitle = 'Time In Range'
    const { result } = renderHook(() => useTimeInRangeChartHook(props))
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
