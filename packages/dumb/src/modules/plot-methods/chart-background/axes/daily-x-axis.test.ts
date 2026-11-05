/*
 * Copyright (c) 2026, Diabeloop
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

import * as d3 from 'd3'
import { DatumType, type Fill } from 'medical-domain'
import { plotDailyXAxis } from './daily-x-axis'
import { type Pool } from '../../../../models/pool.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'

describe('plotDailyXAxis', () => {
  const xScale = d3.scaleUtc().domain([new Date('2023-01-01T00:00:00Z'), new Date('2023-01-02T00:00:00Z')]).range([0, 2400])

  const buildPool = (): Pool<Fill> => ({
    id: jest.fn().mockReturnValue('poolXAxis'),
    xScale: jest.fn().mockReturnValue({ copy: () => xScale.copy() }),
    yScale: jest.fn(),
    height: jest.fn().mockReturnValue(60),
    filterDataForRender: jest.fn((data: Fill[]) => data),
    highlight: jest.fn().mockReturnValue({ on: jest.fn(), off: jest.fn() })
  })

  const buildFill = (normalTime: string, startsAtMidnight = false): Fill => ({
    id: `fill-${normalTime}`,
    type: DatumType.Fill,
    normalTime,
    epoch: new Date(normalTime).valueOf(),
    timezone: 'UTC',
    startsAtMidnight
  }) as Fill

  const render = (fills: Fill[]): {
    plot: (selection: PlotSelection<Fill>) => void
    selection: PlotSelection<Fill>
  } => {
    const svg = d3.select(document.body).append('svg')
    const selection = svg.append('g').datum(fills) as unknown as PlotSelection<Fill>
    const plot = plotDailyXAxis(buildPool())
    plot(selection)
    return { plot, selection }
  }

  const getTick = (fillId: string): HTMLElement => document.getElementById(`poolXAxis_dailyXAxis_group_${fillId}`)!

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw a tick and the hour of each time slot, with ids scoped to the pool', () => {
    render([buildFill('2023-01-01T03:00:00.000Z'), buildFill('2023-01-01T06:00:00.000Z')])

    const tick = getTick('fill-2023-01-01T03:00:00.000Z')
    expect(tick.getAttribute('class')).toBe('d3-dailyXAxis-group d3-axis')
    const line = tick.querySelector('line')!
    expect(line.getAttribute('x1')).toBe('300')
    expect(line.getAttribute('y1')).toBe('60')
    expect(line.getAttribute('y2')).toBe('45')
    const hourLabel = tick.querySelector('text.d3-hour-label')!
    expect(hourLabel.textContent).toBe('3:00 am')
    expect(hourLabel.getAttribute('x')).toBe('305')
    expect(hourLabel.getAttribute('y')).toBe('55')
    expect(tick.querySelector('text.d3-day-label')).toBeNull()
    expect(getTick('fill-2023-01-01T06:00:00.000Z').querySelector('text.d3-hour-label')?.textContent).toBe('6:00 am')
  })

  it('should draw a longer tick and the day label at midnight', () => {
    render([buildFill('2023-01-01T00:00:00.000Z', true)])

    const tick = getTick('fill-2023-01-01T00:00:00.000Z')
    expect(tick.querySelector('line')?.getAttribute('y2')).toBe('22.5')
    const dayLabel = tick.querySelector('text.d3-day-label')!
    expect(dayLabel.textContent).toBe('Sunday, January 1')
    expect(dayLabel.getAttribute('y')).toBe('22.5')
    expect(tick.textContent).toBe('12:00 amSunday, January 1')
  })

  it('should update the existing ticks on each render', () => {
    const { plot, selection } = render([buildFill('2023-01-01T00:00:00.000Z')])
    const tick = getTick('fill-2023-01-01T00:00:00.000Z')
    expect(tick.querySelector('text.d3-day-label')).toBeNull()

    selection.datum([buildFill('2023-01-01T00:00:00.000Z', true)])
    plot(selection)
    expect(tick.querySelector('line')?.getAttribute('y2')).toBe('22.5')
    expect(tick.querySelectorAll('text.d3-day-label')).toHaveLength(1)

    selection.datum([buildFill('2023-01-01T00:00:00.000Z')])
    plot(selection)
    expect(tick.querySelector('line')?.getAttribute('y2')).toBe('45')
    expect(tick.querySelector('text.d3-day-label')).toBeNull()
  })

  it('should remove the ticks of the time slots no longer rendered', () => {
    const { plot, selection } = render([buildFill('2023-01-01T00:00:00.000Z', true), buildFill('2023-01-01T03:00:00.000Z')])

    selection.datum([buildFill('2023-01-01T03:00:00.000Z')])
    plot(selection)

    expect(document.querySelectorAll('g.d3-dailyXAxis-group')).toHaveLength(1)
    expect(getTick('fill-2023-01-01T03:00:00.000Z')).not.toBeNull()
  })

  it('should display the hour in the timezone of the time slot', () => {
    render([{ ...buildFill('2023-01-01T00:00:00.000Z'), timezone: 'Europe/Paris' }])

    expect(getTick('fill-2023-01-01T00:00:00.000Z').querySelector('text.d3-hour-label')?.textContent).toBe('1:00 am')
  })

  it('should display the day in the timezone of the time slot, west of UTC', () => {
    render([{ ...buildFill('2023-01-01T01:00:00.000Z', true), timezone: 'US/Pacific' }])

    const tick = getTick('fill-2023-01-01T01:00:00.000Z')
    expect(tick.querySelector('text.d3-hour-label')?.textContent).toBe('5:00 pm')
    expect(tick.querySelector('text.d3-day-label')?.textContent).toBe('Saturday, December 31')
  })

  it('should apply the daylight saving time offset of the time slot', () => {
    render([{ ...buildFill('2023-04-01T01:00:00.000Z'), timezone: 'US/Pacific' }])

    expect(getTick('fill-2023-04-01T01:00:00.000Z').querySelector('text.d3-hour-label')?.textContent).toBe('6:00 pm')
  })
})
