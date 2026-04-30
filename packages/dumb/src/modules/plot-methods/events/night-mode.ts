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
import nightModeIcon from 'night-mode.svg'

import { type NightMode } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import {
  calculateWidth,
  drawImage,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.NightMode)

// Night mode image dimensions
const NIGHT_MODE_IMAGE_WIDTH = 40
const NIGHT_MODE_IMAGE_HEIGHT_DIVISOR = 2
const NIGHT_MODE_OFFSET_DIVISOR = 4

type NightModeOptions = PlotOptions<NightMode>

const defaults: Partial<NightModeOptions> = {
  xScale: null
}

/**
 * Plot night mode events in the diabetes management timeline
 *
 * Night mode events represent periods when the patient has activated night mode
 * on their diabetes management device. During night mode:
 * - Alarms may be suppressed or muted
 * - Target glucose ranges may be adjusted
 * - Display brightness is reduced
 * - Vibration alerts may replace audible alarms
 *
 * This visualization helps clinicians understand when patients are sleeping and
 * how device behavior is modified during these periods, which is important for
 * analyzing glucose patterns and alarm management.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders night mode events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotNightMode(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotNightMode = (pool: Pool<NightMode>, opts: Partial<NightModeOptions> = {}): PlotFunction<NightMode> => {
  const options = _.defaults(opts, defaults) as NightModeOptions

  return (selection: PlotSelection<NightMode>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()
    const offset = height / NIGHT_MODE_OFFSET_DIVISOR

    // Helper functions using closure variables
    const imageXPos = (d: NightMode): number =>
      xPos(d, xScale) + calculateWidth(d, xScale) / 2 - NIGHT_MODE_IMAGE_WIDTH / 2
    const imageHeight = height / NIGHT_MODE_IMAGE_HEIGHT_DIVISOR
    const imageWidth = (): number => NIGHT_MODE_IMAGE_WIDTH

    /**
     * Create new night mode visual elements
     */
    const createNightModeElements = (
      enter: d3.Selection<d3.EnterElement, NightMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, NightMode, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: NightMode) => idGen.testId(d))

      drawZoneRectangle(group, height, xScale, 'd3-rect-night d3-night')

      drawImage<NightMode>(group, imageXPos, offset, imageHeight, imageWidth, nightModeIcon)

      return group
    }

    /**
     * Update existing night mode visual elements
     */
    const updateNightModeElements = (
      update: d3.Selection<SVGGElement, NightMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, NightMode, SVGGElement, unknown> => {
      update.select('rect.d3-rect-night')
        .attr('x', (d: NightMode) => xPos(d, xScale))
        .attr('width', (d: NightMode) => calculateWidth(d, xScale))

      update.select('image')
        .attr('x', imageXPos)
        .attr('y', offset)
        .attr('height', imageHeight)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const nightModeEvents = pool.filterDataForRender(options.tidelineData.medicalData.nightModes)

      // Step 2: Early exit if no data
      if (nightModeEvents.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allNightModes = d3.select(this)
        .selectAll<SVGGElement, NightMode>(`g.${idGen.groupSelector()}`)
        .data(nightModeEvents, (d: NightMode) => d.id)

      const nightModeGroup = allNightModes.join(
        createNightModeElements,
        updateNightModeElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      nightModeGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: NightMode) {
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

