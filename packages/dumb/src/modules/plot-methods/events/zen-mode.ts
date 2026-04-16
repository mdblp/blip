/*
 * Copyright (c) 2014-2026, Diabeloop
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

import _ from 'lodash'
import * as d3 from 'd3'

import { type ZenMode } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import {
  calculateWidth,
  drawCircle,
  drawText,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

const ZEN_MODE_TEXT = 'ZEN'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.ZenMode)

type ZenModeOptions = PlotOptions<ZenMode>

const defaults: Partial<ZenModeOptions> = {
  xScale: null,
}

/**
 * Plot zen mode events in the diabetes management timeline
 *
 * Zen mode events represent periods when the patient has activated zen mode on their
 * diabetes management device. Zen mode is designed for meditation, relaxation, or
 * situations requiring minimal device interaction:
 * - Notifications are minimized or silenced
 * - Non-critical alarms may be suppressed
 * - Device displays minimal information
 * - Reduced interruptions for the patient
 *
 * This visualization helps clinicians understand:
 * - When patients need uninterrupted periods
 * - Patterns of zen mode usage
 * - Alarm management preferences
 * - Patient lifestyle and device interaction patterns
 *
 * The visualization displays a zone rectangle with "ZEN" text in a circle.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders zen mode events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotZenMode(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotZenMode = (
  pool: Pool<ZenMode>,
  opts: Partial<ZenModeOptions> = {}
): PlotFunction<ZenMode> => {
  const options = _.defaults(opts, defaults) as ZenModeOptions

  return (selection: PlotSelection<ZenMode>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()
    const offset = height / 2

    // Helper functions using closure variables
    const getXPos = (d: ZenMode): number => xPos(d, xScale)
    const getWidth = (d: ZenMode): number => calculateWidth(d, xScale)
    const getCenterX = (d: ZenMode): number => getXPos(d) + getWidth(d) / 2

    /**
     * Create new zen mode visual elements
     */
    const createZenModeElements = (
      enter: d3.Selection<d3.EnterElement, ZenMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ZenMode, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: ZenMode) => idGen.testId(d))

      drawZoneRectangle(group, height, xScale, 'd3-rect-zen d3-zen')

      drawCircle(group, getCenterX, offset, 'd3-circle-zen', (d: ZenMode) => idGen.elementId(d, 'circle'))

      drawText(group, ZEN_MODE_TEXT, getCenterX, offset, 'd3-zen-text', (d: ZenMode) => idGen.elementId(d, 'text'))

      return group
    }

    /**
     * Update existing zen mode visual elements
     */
    const updateZenModeElements = (
      update: d3.Selection<SVGGElement, ZenMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ZenMode, SVGGElement, unknown> => {
      update.select('rect.d3-rect-zen')
        .attr('x', getXPos)
        .attr('width', getWidth)

      update.select('circle.d3-circle-zen')
        .attr('cx', getCenterX)

      update.select('text.d3-zen-text')
        .attr('x', getCenterX)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const zenEvents = pool.filterDataForRender(options.tidelineData.medicalData.zenModes)

      // Step 2: Early exit if no data
      if (zenEvents.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allZenModes = d3.select(this)
        .selectAll<SVGGElement, ZenMode>(`g.${idGen.groupSelector()}`)
        .data(zenEvents, (d: ZenMode) => d.id)

      const zenModeGroup = allZenModes.join(
        createZenModeElements,
        updateZenModeElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      zenModeGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: ZenMode) {
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement) {
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

