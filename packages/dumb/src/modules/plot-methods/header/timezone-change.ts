/*
 * Copyright (c) 2015-2026, Diabeloop
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
import timezoneChangeIcon from 'timezone-change.svg'

import { type TimeZoneChange } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { PLOT_DIMENSIONS, ELEMENT_IDS } from '../constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(ELEMENT_IDS.TIMEZONE_CHANGE)

// Custom test ID generator for timezone changes (includes timezone names)
const getTimezoneTestId = (d: TimeZoneChange): string =>
  `${ELEMENT_IDS.TIMEZONE_CHANGE}_${d.from.timeZoneName}_${d.to.timeZoneName}`

type TimeChangeOptions = PlotOptions<TimeZoneChange>

const defaults: Partial<TimeChangeOptions> = {
  xScale: null,
}

/**
 * Plot timezone change events in the diabetes management timeline
 *
 * Timezone changes represent when the patient's device timezone was modified,
 * which is important for accurate timestamp interpretation in medical data.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders timezone change events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotTimeZoneChange(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotTimeZoneChange = (
  pool: Pool<TimeZoneChange>,
  opts: Partial<TimeChangeOptions> = {}
): PlotFunction<TimeZoneChange> => {
  const options = _.defaults(opts, defaults) as TimeChangeOptions

  return (selection: PlotSelection<TimeZoneChange>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper functions using closure variables
    const getXPos = (d: TimeZoneChange): number =>
      xScale(d.epoch) - PLOT_DIMENSIONS.DEFAULT_SIZE / 2
    const getImageY = (): number =>
      pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2

    /**
     * Create new timezone change visual elements
     */
    const createTimeChangeElements = (
      enter: d3.Selection<d3.EnterElement, TimeZoneChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, TimeZoneChange, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed('d3-timechange-group', true)
        .attr('id', idGen.groupId)
        .attr('data-testid', getTimezoneTestId)

      drawImage<TimeZoneChange>(
        group,
        getXPos,
        getImageY(),
        PLOT_DIMENSIONS.DEFAULT_SIZE,
        PLOT_DIMENSIONS.DEFAULT_SIZE,
        timezoneChangeIcon
      )

      return group
    }

    /**
     * Update existing timezone change visual elements
     */
    const updateTimeChangeElements = (
      update: d3.Selection<SVGGElement, TimeZoneChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, TimeZoneChange, SVGGElement, unknown> => {
      update.select('image')
        .attr('x', getXPos)
        .attr('y', getImageY())
        .attr('width', PLOT_DIMENSIONS.DEFAULT_SIZE)
        .attr('height', PLOT_DIMENSIONS.DEFAULT_SIZE)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const medicalData = options.tidelineData.medicalData
      const timeZoneChanges = pool.filterDataForRender(medicalData.timezoneChanges)

      // Step 2: Early exit if no data
      if (timeZoneChanges.length < 1) {
        d3.select(this).selectAll('g.d3-timechange-group').remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allTimeChanges = d3.select(this)
        .selectAll<SVGGElement, TimeZoneChange>('g.d3-timechange-group')
        .data(timeZoneChanges, (d: TimeZoneChange) => d.id)

      const timeChangeGroup = allTimeChanges.join(
        createTimeChangeElements,
        updateTimeChangeElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      timeChangeGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: TimeZoneChange) {
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

