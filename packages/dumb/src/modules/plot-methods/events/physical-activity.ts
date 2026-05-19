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
import physicalActivityIcon from 'physical-activity.png'

import { type PhysicalActivity } from 'medical-domain'
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
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.PhysicalActivity)

type PhysicalActivityOptions = PlotOptions<PhysicalActivity>

const defaults: Partial<PhysicalActivityOptions> = {
  xScale: null
}

/**
 * Plot physical activity events in the diabetes management timeline
 *
 * Physical activity events represent periods when the patient has engaged in exercise
 * or physical activity. This information is critical for diabetes management because:
 * - Exercise affects insulin sensitivity
 * - Physical activity can lower blood glucose levels
 * - Activity timing impacts insulin dosing decisions
 * - Intensity affects glucose response
 *
 * The visualization shows:
 * - Activity duration (zone rectangle)
 * - Activity icon for visual identification
 * - Reported intensity level (when available)
 *
 * This helps clinicians understand how exercise patterns correlate with glucose
 * fluctuations and insulin requirements.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders physical activity events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotPhysicalActivity(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotPhysicalActivity = (
  pool: Pool<PhysicalActivity>,
  opts: Partial<PhysicalActivityOptions> = {}
): PlotFunction<PhysicalActivity> => {
  const options = _.defaults(opts, defaults) as PhysicalActivityOptions

  return (selection: PlotSelection<PhysicalActivity>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()

    // Helper functions using closure variables
    const getXPos = (d: PhysicalActivity): number => xPos(d, xScale)
    const getWidth = (d: PhysicalActivity): number => calculateWidth(d, xScale)
    const getImageY = (): number => height / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2
    const getImageHeight = (): number => height - PLOT_DIMENSIONS.DEFAULT_IMAGE_MARGIN

    /**
     * Create new physical activity visual elements
     */
    const createPhysicalActivityElements = (
      enter: d3.Selection<d3.EnterElement, PhysicalActivity, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', idGen.groupId)

      drawZoneRectangle(group, height, xScale, 'd3-rect-pa d3-pa')

      drawImage<PhysicalActivity>(group, getXPos, getImageY(), getImageHeight(), getWidth, physicalActivityIcon)

      return group
    }

    /**
     * Update existing physical activity visual elements
     */
    const updatePhysicalActivityElements = (
      update: d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown> => {
      update.selectAll<SVGRectElement, PhysicalActivity>('rect.d3-rect-pa')
        .attr('x', getXPos)
        .attr('width', getWidth)

      update.select('image')
        .attr('x', getXPos)
        .attr('width', getWidth)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const physicalActivities = pool.filterDataForRender(options.tidelineData.medicalData.physicalActivities)

      // Step 2: Filter for activities with reported intensity (only these are displayed)
      const activitiesWithIntensity = physicalActivities.filter(
        (d: PhysicalActivity) => !_.isEmpty(d.reportedIntensity)
      )

      // Step 3: Early exit if no data
      if (activitiesWithIntensity.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 4: Data join with enter/update/exit
      const allPhysicalActivities = d3.select(this)
        .selectAll<SVGGElement, PhysicalActivity>(`g.${idGen.groupSelector()}`)
        .data(activitiesWithIntensity, (d: PhysicalActivity) => d.id)

      const physicalActivityGroup = allPhysicalActivities.join(
        createPhysicalActivityElements,
        updatePhysicalActivityElements,
        exit => exit.remove()
      )

      // Step 5: Set up event handlers
      physicalActivityGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: PhysicalActivity) {
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

