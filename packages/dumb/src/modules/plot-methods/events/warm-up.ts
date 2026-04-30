/*
 * Copyright (c) 2021-2026, Diabeloop
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
import warmupIcon from 'warmup-icon.svg'

import { type WarmUp } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.WarmUp)

// Warm-up image dimensions
const WARM_UP_IMAGE_WIDTH = 40

type WarmUpOptions = PlotOptions<WarmUp> & {
  warmUps: WarmUp[]
}

const defaults: Partial<WarmUpOptions> = {
  xScale: null,
}

/**
 * Plot warm-up events in the diabetes management timeline
 *
 * Warm-up events represent the initialization period for continuous glucose monitoring
 * (CGM) sensors. During the warm-up period:
 * - The sensor is calibrating and stabilizing
 * - No glucose readings are available yet
 * - The sensor is not providing actionable data
 * - Typically lasts 2 hours for most CGM systems
 *
 * This visualization is critical for clinicians to understand:
 * - Gaps in glucose data due to sensor initialization
 * - Sensor change timing and frequency
 * - Data availability periods
 * - When to expect reliable glucose readings
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, warm-up data, and event handlers
 * @returns A function that renders warm-up events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotWarmUp(pool, {
 *   tidelineData,
 *   warmUps: medicalData.warmUps,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotWarmUp = (
  pool: Pool<WarmUp>,
  opts: Partial<WarmUpOptions> = {}
): PlotFunction<WarmUp> => {
  const options = _.defaults(opts, defaults) as WarmUpOptions

  return (selection: PlotSelection<WarmUp>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height() - PLOT_DIMENSIONS.DEFAULT_IMAGE_MARGIN

    // Helper functions using closure variables
    const getXPos = (d: WarmUp): number => xScale(d.epoch)
    const getImageY = (): number =>
      pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2

    /**
     * Create new warm-up visual elements
     */
    const createWarmUpElements = (
      enter: d3.Selection<d3.EnterElement, WarmUp, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, WarmUp, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: WarmUp) => idGen.testId(d))

      drawImage(group, getXPos, getImageY(), height, WARM_UP_IMAGE_WIDTH, warmupIcon)

      return group
    }

    /**
     * Update existing warm-up visual elements
     */
    const updateWarmUpElements = (
      update: d3.Selection<SVGGElement, WarmUp, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, WarmUp, SVGGElement, unknown> => {
      update
        .select('image')
        .attr('x', getXPos)
        .attr('y', getImageY())

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered warm-up data from pool
      const warmUpEvents = pool.filterDataForRender(options.warmUps)

      // Step 2: Early exit if no data
      if (warmUpEvents.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allWarmUps = d3.select(this)
        .selectAll<SVGGElement, WarmUp>(`g.${idGen.groupSelector()}`)
        .data(warmUpEvents, (d: WarmUp) => d.id)

      const warmUpGroup = allWarmUps.join(
        createWarmUpElements,
        updateWarmUpElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      warmUpGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: WarmUp) {
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

