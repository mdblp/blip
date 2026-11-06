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
import { plotPoolLegend } from './legends'
import { PoolLegendType } from '../../../../models/enums/pool-legend-type.enum'
import { type PoolLegend } from '../../../../models/plot-methods/pool-legend.model'

describe('plotPoolLegend', () => {
  const TEXT_WIDTH = 50
  const TEXT_HEIGHT = 12

  const setup = (legends: PoolLegend[]): void => {
    const mainGroup = d3.select(document.body).append('svg').append('g')
    mainGroup.append('g').attr('id', 'tidelineLabels')

    const pool = {
      id: jest.fn().mockReturnValue('poolTest'),
      yPosition: jest.fn().mockReturnValue(100),
      width: jest.fn().mockReturnValue(800),
      parent: jest.fn().mockReturnValue(mainGroup)
    }

    plotPoolLegend(pool, 35, legends)
  }

  const getLegend = (type: PoolLegendType): HTMLElement => document.getElementById(`poolTest_legend_${type}`)!

  const getTransforms = (legend: HTMLElement, selector: string): (string | null)[] => {
    return Array.from(legend.querySelectorAll(selector)).map((element) => element.getAttribute('transform'))
  }

  beforeEach(() => {
    jest.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ width: TEXT_WIDTH, height: TEXT_HEIGHT } as DOMRect)
  })

  afterEach(() => {
    document.body.innerHTML = ''
    jest.restoreAllMocks()
  })

  it('should draw one group per legend, right-aligned at the end of the pool and following its own baseline', () => {
    setup([
      { type: PoolLegendType.Carbs, baseline: 22 },
      { type: PoolLegendType.Bolus, baseline: 4 }
    ])

    const carbsLegend = getLegend(PoolLegendType.Carbs)
    expect(carbsLegend.getAttribute('data-testid')).toBe('poolTest_legend_carbs')
    expect(carbsLegend.getAttribute('transform')).toBe('translate(835,78)')

    const bolusLegend = getLegend(PoolLegendType.Bolus)
    expect(bolusLegend.getAttribute('data-testid')).toBe('poolTest_legend_bolus')
    expect(bolusLegend.getAttribute('transform')).toBe('translate(835,96)')
  })

  it('should draw the glucose legend with one circle per range', () => {
    setup([{ type: PoolLegendType.Bg, baseline: 4 }])

    const legend = getLegend(PoolLegendType.Bg)
    expect(Array.from(legend.querySelectorAll('text')).map((text) => text.textContent)).toEqual(['high', 'low ', 'Dexcom CGM -'])
    expect(getTransforms(legend, 'text')).toEqual([null, 'translate(-143,0)', 'translate(-197.75,0)'])

    const circles = Array.from(legend.querySelectorAll('circle'))
    expect(circles.map((circle) => circle.getAttribute('class'))).toEqual([
      'd3-smbg d3-circle-smbg d3-bg-very-high',
      'd3-smbg d3-circle-smbg d3-bg-high',
      'd3-smbg d3-circle-smbg d3-bg-target',
      'd3-smbg d3-circle-smbg d3-bg-tight-range',
      'd3-smbg d3-circle-smbg d3-bg-low',
      'd3-smbg d3-circle-smbg d3-bg-very-low'
    ])
    expect(circles.map((circle) => circle.getAttribute('cx'))).toEqual(['-59.5', '-75', '-90.5', '-106', '-121.5', '-137'])
    expect(circles[0].getAttribute('cy')).toBe('-3')
    expect(circles[0].getAttribute('r')).toBe('4.75')
  })

  it('should draw the bolus legend without the meal without carb counting entry by default', () => {
    setup([{ type: PoolLegendType.Bolus, baseline: 4 }])

    const legend = getLegend(PoolLegendType.Bolus)
    expect(legend.textContent).not.toContain('Meal without carb counting')
    expect(legend.querySelectorAll('rect')).toHaveLength(5)
    expect(legend.querySelector('rect.d3-bolus-eating-shortly')).toBeNull()

    expect(getTransforms(legend, ':scope > text')).toEqual([
      null,
      'translate(-72,0)',
      'translate(-142.25,0)',
      'translate(-212.5,0)',
      'translate(-282.75,0)',
      'translate(-353,0)',
      // The legend title is spaced a bit more from the items
      'translate(-428,0)'
    ])

    const rects = Array.from(legend.querySelectorAll('rect'))
    expect(rects.map((rect) => rect.getAttribute('x'))).toEqual(['-134.5', '-204.75', '-275', '-345.25', '-415.5'])
    rects.forEach((rect) => {
      expect(rect.getAttribute('y')).toBe('-10.75')
      expect(rect.getAttribute('width')).toBe('9.5')
      expect(rect.getAttribute('height')).toBe('9.5')
    })

    const ride = legend.querySelector('g.d3-rect-bolus-legend')!
    expect(ride.getAttribute('transform')).toBe('translate(-47,0)')
    expect(ride.querySelectorAll('path')).toHaveLength(2)
  })

  it('should draw the meal without carb counting entry in the bolus legend when asked to', () => {
    setup([{ type: PoolLegendType.Bolus, baseline: 4, shouldDisplayEatingShortly: true }])

    const legend = getLegend(PoolLegendType.Bolus)
    expect(legend.textContent).toContain('Meal without carb counting')
    expect(legend.querySelector('rect.d3-bolus.d3-rect-bolus-legend.d3-bolus-eating-shortly')).not.toBeNull()
    expect(legend.querySelectorAll('rect')).toHaveLength(6)
  })

  it('should draw the carbs legend with the rescue carbs circle wider spaced', () => {
    setup([{ type: PoolLegendType.Carbs, baseline: 4 }])

    const legend = getLegend(PoolLegendType.Carbs)
    expect(getTransforms(legend, 'text')).toEqual([null, 'translate(-73.25,0)'])

    const rescueCarbs = legend.querySelector('circle.d3-circle-rescuecarbs-legend')!
    expect(rescueCarbs.getAttribute('cx')).toBe('-59.5')
    const carbs = legend.querySelector('circle.d3-circle-carbs-legend')!
    expect(carbs.getAttribute('cx')).toBe('-132.75')
  })

  it('should draw the basal legend with the automated and manual mode badges', () => {
    setup([{ type: PoolLegendType.Basal, baseline: 4 }])

    const legend = getLegend(PoolLegendType.Basal)
    const automated = legend.querySelector('g.d3-basal.d3-basal-loop-mode')!
    const manual = legend.querySelector('g.d3-basal.d3-basal-loop-mode-off')!
    // The manual mode badge is the rightmost one
    expect(manual.getAttribute('transform')).toBeNull()
    expect(manual.querySelector('text.d3-basal-label')!.textContent).toBe('OFF')
    expect(automated.getAttribute('transform')).toBe('translate(-31,0)')
    expect(automated.querySelector('text.d3-basal-label')!.textContent).toBe('ON')

    const background = automated.querySelector('rect.d3-basal-background')!
    expect(background.getAttribute('x')).toBe('-28')
    expect(background.getAttribute('y')).toBe('-10.75')

    expect(getTransforms(legend, ':scope > text')).toEqual(['translate(-66.75,0)'])
  })

  it('should not draw anything when legends is empty', () => {
    setup([])

    expect(document.getElementById('tidelineLabels')!.childElementCount).toBe(0)
  })

  it('should not draw anything when legends is undefined', () => {
    setup(undefined as unknown as PoolLegend[])

    expect(document.getElementById('tidelineLabels')!.childElementCount).toBe(0)
  })
})
