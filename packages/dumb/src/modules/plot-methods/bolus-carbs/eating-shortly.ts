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
import eatingShortlyIcon from 'eating-shortly.svg'

import { type EatingShortlyEvent } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import {
  drawCircle,
  drawImage,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.EatingShortly)

// Image dimensions for eating shortly icon
const IMAGE_WIDTH = 24
const IMAGE_HEIGHT = 24
const IMAGE_CENTER_Y = 6

type EatingShortlyOptions = PlotOptions<EatingShortlyEvent>

const defaults: Partial<EatingShortlyOptions> = {
  xScale: null
}

/**
 * Plot eating shortly events in the diabetes management timeline
 *
 * Eating shortly events represent occasions when the patient indicated they would be eating soon
 * but did not specify carbohydrate amounts. These are displayed as icons with surrounding circles.
 *
 * Visual Features:
 * - Circle background for visibility
 * - Icon overlay showing eating shortly symbol
 * - Positioned on timeline based on event timestamp
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders eating shortly events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotEatingShortly(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotEatingShortly = (
  pool: Pool<EatingShortlyEvent>,
  opts: Partial<EatingShortlyOptions> = {}
): PlotFunction<EatingShortlyEvent> => {
  const options = _.defaults(opts, defaults) as EatingShortlyOptions

  return (selection: PlotSelection<EatingShortlyEvent>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yPos = PLOT_DIMENSIONS.COMMON_RADIUS + PLOT_DIMENSIONS.COMMON_PADDING

    // Helper functions using closure variables
    const getXPos = (d: EatingShortlyEvent): number => xPos(d, xScale)
    const getImageX = (d: EatingShortlyEvent): number => getXPos(d) - IMAGE_WIDTH / 2

    // Enter callback: create new elements
    const createEatingShortlyElements = (
      enter: d3.Selection<d3.EnterElement, EatingShortlyEvent, SVGGElement, unknown>,
      eatingShortlyGroupSelector: string
    ): d3.Selection<SVGGElement, EatingShortlyEvent, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(eatingShortlyGroupSelector, true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: EatingShortlyEvent) => idGen.testId(d))

      // Draw background circle for visibility
      drawCircle<EatingShortlyEvent>(
        group,
        getXPos,
        yPos,
        'd3-circle-eating-shortly',
        (d: EatingShortlyEvent) => idGen.elementId(d, 'circle')
      )

      // Draw eating shortly icon
      drawImage<EatingShortlyEvent>(
        group,
        getImageX,
        IMAGE_CENTER_Y,
        IMAGE_HEIGHT,
        IMAGE_WIDTH,
        eatingShortlyIcon
      )

      return group
    }

    // Update callback: update existing elements
    const updateEatingShortlyElements = (
      update: d3.Selection<SVGGElement, EatingShortlyEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, EatingShortlyEvent, SVGGElement, unknown> => {
      // Update circle position and size
      update.select('circle')
        .attr('cx', getXPos)
        .attr('cy', yPos)
        .attr('r', PLOT_DIMENSIONS.COMMON_RADIUS)

      // Update image position
      update.select('image')
        .attr('x', getImageX)
        .attr('y', IMAGE_CENTER_Y)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const eatingShortlyEvents = pool.filterDataForRender(
        options.tidelineData.medicalData.eatingShortlyEvents
      )
      const eatingShortlyGroupSelector = `d3-${DailyPlotElement.EatingShortly}-group`

      // Step 2: Early exit if no data
      if (eatingShortlyEvents.length < 1) {
        d3.select(this).selectAll(`g.${eatingShortlyGroupSelector}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit pattern
      const allEatingShortlyEvents = d3.select(this)
        .selectAll<SVGGElement, EatingShortlyEvent>(`g.${eatingShortlyGroupSelector}`)
        .data(eatingShortlyEvents, (d: EatingShortlyEvent) => d.id)

      const eatingShortlyGroup = allEatingShortlyEvents.join(
        enter => createEatingShortlyElements(enter, eatingShortlyGroupSelector),
        update => updateEatingShortlyElements(update),
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      eatingShortlyGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: EatingShortlyEvent) {
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

