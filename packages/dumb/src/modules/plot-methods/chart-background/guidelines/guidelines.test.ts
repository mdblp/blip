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
import { type Fill } from 'medical-domain'
import { plotGuidelines } from './guidelines'
import { type Guideline } from '../../../../models/guideline.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'

describe('plotGuidelines', () => {
  const xScale = d3.scaleUtc().domain([new Date('2023-01-01T00:00:00Z'), new Date('2023-01-02T00:00:00Z')]).range([35, 1035])
  const yScale = d3.scaleLinear().domain([0, 400]).range([400, 0])

  const neutralGuideline = (height: number): Guideline => ({
    class: 'd3-line-neutral-threshold',
    height,
    chip: { label: height.toString(), class: 'd3-line-neutral-chip' }
  })

  const setup = (guidelines: Guideline[]): {
    plot: (selection: PlotSelection<Fill>) => void
    selection: PlotSelection<Fill>
    setGuidelines: (newGuidelines: Guideline[]) => void
  } => {
    let currentGuidelines = guidelines
    const svg = d3.select(document.body).append('svg')
    const selection = svg.append('g') as unknown as PlotSelection<Fill>
    const chipGroup = svg.append('g').attr('data-testid', 'poolBolus_guideline_chips') as unknown as d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
    const pool = {
      id: jest.fn().mockReturnValue('poolBolus'),
      xScale: jest.fn().mockReturnValue({ copy: () => xScale.copy() }),
      yScale: jest.fn().mockReturnValue(yScale),
      height: jest.fn().mockReturnValue(400),
      chipGroup: jest.fn().mockReturnValue(chipGroup),
      guidelines: jest.fn(() => currentGuidelines),
      filterDataForRender: jest.fn((data: Fill[]) => data),
      highlight: jest.fn().mockReturnValue({ on: jest.fn(), off: jest.fn() })
    }
    const plot = plotGuidelines(pool)
    plot(selection)
    return { plot, selection, setGuidelines: (newGuidelines) => { currentGuidelines = newGuidelines } }
  }

  beforeAll(() => {
    // Not implemented by JSDOM
    Object.defineProperty(SVGElement.prototype, 'getBBox', {
      configurable: true,
      value: () => ({ x: -10, y: -6, width: 10, height: 12 })
    })
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('should draw a line across the whole width for each guideline sharing a class', () => {
    const { selection } = setup([neutralGuideline(1), neutralGuideline(5)])

    const lines = selection.selectAll('line.d3-line-guide').nodes() as SVGLineElement[]
    expect(lines).toHaveLength(2)
    expect(lines[1].getAttribute('class')).toBe('d3-line-guide d3-line-neutral-threshold')
    expect(lines[1].getAttribute('data-testid')).toBe('poolBolus_guidelines_line_d3-line-neutral-threshold_5')
    expect(lines[1].getAttribute('x1')).toBe('35')
    expect(lines[1].getAttribute('x2')).toBe('1035')
    expect(lines[1].getAttribute('y1')).toBe(String(yScale(5)))
  })

  it('should draw the chips in the chip group of the pool, left of the chart', () => {
    setup([neutralGuideline(1), { class: 'd3-line-no-chip', height: 3 }])

    const chipsGroup = document.querySelector('[data-testid="poolBolus_guideline_chips"]')!
    expect(chipsGroup.textContent).toBe('1')

    const chips = chipsGroup.querySelectorAll('g.d3-line-guide-chip')
    expect(chips).toHaveLength(1)
    expect(chips[0].getAttribute('class')).toBe('d3-line-guide-chip d3-line-neutral-chip')
    // Right edge 4px left of the chart, minus the label padding
    expect(chips[0].getAttribute('transform')).toBe(`translate(25,${yScale(1)})`)
    // Background sized from the label, with padding
    const background = chips[0].querySelector('rect.d3-line-guide-chip-bg')!
    expect(background.getAttribute('x')).toBe('-16')
    expect(background.getAttribute('width')).toBe('22')
    expect(background.getAttribute('height')).toBe('20')
  })

  it('should follow the guidelines of the pool on each render', () => {
    const { plot, selection, setGuidelines } = setup([neutralGuideline(1), neutralGuideline(5)])

    setGuidelines([neutralGuideline(1), neutralGuideline(10)])
    plot(selection)

    expect(selection.selectAll('line.d3-line-guide').size()).toBe(2)
    expect(document.querySelector('[data-testid="poolBolus_guidelines_line_d3-line-neutral-threshold_5"]')).toBeNull()
    expect(document.querySelector('[data-testid="poolBolus_guideline_chips"]')?.textContent).toBe('110')
  })
})
