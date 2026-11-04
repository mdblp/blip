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
import { DailyPlotElement } from '../../../../models/enums/daily-plot-element.enum'
import { type PlotFunction } from '../../../../models/plot-function.model'
import { type PlotOptions } from '../../../../models/plot-options.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'
import { type Guideline } from '../../../../models/guideline.model'
import { type Pool } from '../../../../models/pool.model'
import { createIdGenerator } from '../../../../utils/id-generator/id-generator.util'

/** Space between a chip's right edge and the chart's left edge, in pixels */
const CHIP_GAP = 4
const CHIP_PADDING = { x: 6, y: 4 }
const CHIP_BORDER_RADIUS = 8

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Guidelines)

type GuidelinesPool = Pool<Fill> & {
  /** Group of the pool chips, outside the pools' clip path, at the pool position */
  chipGroup: () => d3.Selection<SVGGElement, unknown, HTMLElement, unknown>
  guidelines: () => Guideline[]
}

type GuidelinesOptions = Pick<PlotOptions<Fill>, 'xScale'>

const defaults: Partial<GuidelinesOptions> = {
  xScale: null
}

// Neither the class nor the height is unique on its own: neutral guidelines share a class,
// and the target can have the same height as a low/high threshold
const getGuidelineKey = (d: Guideline): string => `${d.class}_${d.height}`

/**
 * Plot the horizontal guidelines of a daily chart pool, across the whole visible width
 *
 * Lines are drawn in the pool. Chips are drawn in the axis gutter, which is outside the
 * pools' clip path, so they go into `pool.chipGroup()`.
 * Guidelines are read from `pool.guidelines()` on each render, so they follow the pool's
 * Y scale when new data is loaded or when the target value changes.
 *
 * @param pool - The rendering pool containing scales, dimensions and guidelines
 * @param opts - Configuration options
 * @returns A function that renders the guidelines when called with a D3 selection
 *
 * @example
 * ```typescript
 * pool.addGuidelinesPlotType(plotGuidelines(pool))
 * ```
 */
export const plotGuidelines = (
  pool: GuidelinesPool,
  opts: Partial<GuidelinesOptions> = {}
): PlotFunction<Fill> => {
  const options = { ...defaults, ...opts } as GuidelinesOptions

  return (selection: PlotSelection<Fill>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const [xStart, xEnd] = options.xScale.range()
    const yScale = pool.yScale()
    const guidelines = pool.guidelines()
    const chipGuidelines = guidelines.filter((guideline: Guideline) => guideline.chip)

    const getY = (d: Guideline): number => yScale(d.height)
    const getTestId = (d: Guideline, elementType: string): string => `${pool.id()}_${idGen.testId({ id: getGuidelineKey(d) }, elementType)}`

    /**
     * Create new chip visual elements
     *
     * The label only depends on the guideline key, so the background is sized once, here
     */
    const createChipElements = (
      enter: d3.Selection<d3.EnterElement, Guideline, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Guideline, SVGGElement, unknown> => {
      const chip = enter
        .append('g')
        .attr('class', (d: Guideline) => `d3-line-guide-chip ${d.chip?.class ?? ''}`)
        .attr('data-testid', (d: Guideline) => getTestId(d, 'chip'))

      // Background first so it is drawn behind the label
      chip.append('rect')
        .classed('d3-line-guide-chip-bg', true)
        .attr('rx', CHIP_BORDER_RADIUS)

      chip.append('text')
        .classed('d3-line-guide-chip-label', true)
        .attr('dy', '0.35em')
        .text((d: Guideline) => d.chip?.label ?? '')

      // Size the background from the rendered label (right-anchored, see .d3-line-guide-chip-label)
      chip.each(function (this: SVGGElement) {
        const chipElement = d3.select(this)
        const bbox = chipElement.select<SVGTextElement>('text').node()!.getBBox()

        chipElement.select('rect')
          .attr('x', bbox.x - CHIP_PADDING.x)
          .attr('y', bbox.y - CHIP_PADDING.y)
          .attr('width', bbox.width + CHIP_PADDING.x * 2)
          .attr('height', bbox.height + CHIP_PADDING.y * 2)
      })

      return chip
    }

    selection.each(function (this: SVGGElement) {
      d3.select(this)
        .selectAll<SVGLineElement, Guideline>('line.d3-line-guide')
        .data(guidelines, getGuidelineKey)
        .join('line')
        .attr('class', (d: Guideline) => `d3-line-guide ${d.class}`)
        .attr('data-testid', (d: Guideline) => getTestId(d, 'line'))
        .attr('x1', xStart)
        .attr('x2', xEnd)
        .attr('y1', getY)
        .attr('y2', getY)
    })

    // The chip's right edge ends up CHIP_GAP left of the chart's left edge, in the axis gutter
    const chipX = xStart - CHIP_GAP - CHIP_PADDING.x

    pool.chipGroup()
      .selectAll<SVGGElement, Guideline>('g.d3-line-guide-chip')
      .data(chipGuidelines, getGuidelineKey)
      .join(createChipElements)
      .attr('transform', (d: Guideline) => `translate(${chipX},${getY(d)})`)
  }
}
