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
import type MedicalDataService from 'medical-domain'
import { DatumType, type Fill } from 'medical-domain'
import { plotPoolBackground } from './pool-background'
import { type Pool } from '../../../../models/plot-methods/pool.model'
import { type PlotSelection } from '../../../../models/plot-methods/plot-selection.model'

describe('plotPoolBackground', () => {
  const xScale = d3.scaleUtc().domain([new Date('2023-01-01T00:00:00Z'), new Date('2023-01-02T00:00:00Z')]).range([0, 2400])

  const buildPool = (): Pool<Fill> => ({
    id: jest.fn().mockReturnValue('poolBG'),
    xScale: jest.fn().mockReturnValue({ copy: () => xScale.copy() }),
    yScale: jest.fn(),
    height: jest.fn().mockReturnValue(300),
    filterDataForRender: jest.fn((data: Fill[]) => data),
    highlight: jest.fn().mockReturnValue({ on: jest.fn(), off: jest.fn() })
  })

  const buildFill = (normalTime: string, normalEnd: string, startsAtMidnight = false): Fill => ({
    id: normalTime,
    type: DatumType.Fill,
    normalTime,
    normalEnd,
    epoch: new Date(normalTime).valueOf(),
    epochEnd: new Date(normalEnd).valueOf(),
    startsAtMidnight
  }) as Fill

  const render = (pool: Pool<Fill>, fills: Fill[], onBackgroundClick?: (date: Date) => void): {
    plot: (selection: PlotSelection<Fill>) => void
    selection: PlotSelection<Fill>
    tidelineData: { fills: Fill[] }
  } => {
    const tidelineData = { fills }
    const svg = d3.select(document.body).append('svg')
    const selection = svg.append('g') as unknown as PlotSelection<Fill>
    const plot = plotPoolBackground(pool, { tidelineData: tidelineData as unknown as MedicalDataService, onBackgroundClick })
    plot(selection)
    return { plot, selection, tidelineData }
  }

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw one time slot per fill, with ids scoped to the pool', () => {
    render(buildPool(), [
      buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z', true),
      buildFill('2023-01-01T03:00:00.000Z', '2023-01-01T06:00:00.000Z')
    ])

    const midnightSlot = document.getElementById('poolBG_poolBackground_group_2023-01-01T00:00:00.000Z')
    const otherSlot = document.getElementById('poolBG_poolBackground_group_2023-01-01T03:00:00.000Z')
    expect(midnightSlot?.querySelector('rect.d3-fill-background')?.getAttribute('width')).toBe('300')
    expect(midnightSlot?.querySelectorAll('rect.d3-fill-hour')).toHaveLength(1)
    expect(midnightSlot?.querySelectorAll('rect.d3-fill-midnight')).toHaveLength(1)
    expect(otherSlot?.querySelector('rect.d3-fill-background')?.getAttribute('x')).toBe('300')
    expect(otherSlot?.querySelectorAll('rect.d3-fill-midnight')).toHaveLength(0)
  })

  it('should add or remove the midnight line when the fill of an existing slot changes', () => {
    const fillId = '2023-01-01T03:00:00.000Z'
    const { plot, selection, tidelineData } = render(buildPool(), [buildFill(fillId, '2023-01-01T06:00:00.000Z')])
    const getMidnightLines = (): NodeListOf<Element> => document.getElementById(`poolBG_poolBackground_group_${fillId}`)!.querySelectorAll('rect.d3-fill-midnight')
    expect(getMidnightLines()).toHaveLength(0)

    tidelineData.fills = [buildFill(fillId, '2023-01-01T06:00:00.000Z', true)]
    plot(selection)
    expect(getMidnightLines()).toHaveLength(1)

    tidelineData.fills = [buildFill(fillId, '2023-01-01T06:00:00.000Z')]
    plot(selection)
    expect(getMidnightLines()).toHaveLength(0)
  })

  it('should follow the pool height on each render', () => {
    const pool = buildPool()
    const { plot, selection } = render(pool, [buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z', true)])

    ;(pool.height as jest.Mock).mockReturnValue(150)
    plot(selection)

    document.querySelectorAll('rect.d3-rect-fill').forEach((rect) => {
      expect(rect.getAttribute('height')).toBe('150')
    })
  })

  it('should call onBackgroundClick with the date of the clicked position', () => {
    const onBackgroundClick = jest.fn()
    const { selection } = render(buildPool(), [buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z')], onBackgroundClick)

    const background = document.querySelector('rect.d3-fill-background')!
    // Without SVG matrices in JSDOM, d3.pointer falls back to the client coordinates
    background.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX: 150 }))

    expect(onBackgroundClick).toHaveBeenCalledWith(new Date('2023-01-01T01:30:00.000Z'))
    expect(selection.style('cursor')).toBe('cell')
  })

  it('should not be clickable without onBackgroundClick', () => {
    const { selection } = render(buildPool(), [buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z')])

    expect(selection.style('cursor')).toBe('')
  })

  it('should remove the time slots when there is no fill to render', () => {
    const { plot, selection, tidelineData } = render(buildPool(), [buildFill('2023-01-01T00:00:00.000Z', '2023-01-01T03:00:00.000Z')])

    tidelineData.fills = []
    plot(selection)

    expect(document.querySelectorAll('g.d3-poolBackground-group')).toHaveLength(0)
  })
})
