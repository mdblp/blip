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

import { type ReservoirChange } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { getReservoirChangeIcon } from '../../../utils/reservoir-change/reservoir-change.util'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.ReservoirChange)

// Reservoir/cartridge change image dimensions
const RESERVOIR_CHANGE_IMAGE_WIDTH = 40

type ReservoirChangeOptions = PlotOptions<ReservoirChange> & {
  reservoirChanges: ReservoirChange[]
}

const defaults: Partial<ReservoirChangeOptions> = {
  xScale: null,
}

/**
 * Plot cartridge/reservoir change events in the diabetes management timeline
 *
 * Reservoir (cartridge) changes represent when a patient replaces the insulin
 * reservoir/cartridge in their insulin pump. These events are important because:
 * - They indicate insulin supply replenishment
 * - Frequent changes may indicate pump issues or high insulin usage
 * - Infrequent changes may indicate pump site problems
 * - They help track pump maintenance compliance
 *
 * Each pump manufacturer has a specific cartridge icon to help identify the
 * device type being used.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, reservoir changes data, and event handlers
 * @returns A function that renders reservoir change events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotReservoirChange(pool, {
 *   tidelineData,
 *   reservoirChanges: medicalData.reservoirChanges,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotReservoirChange = (
  pool: Pool<ReservoirChange>,
  opts: Partial<ReservoirChangeOptions> = {}
): PlotFunction<ReservoirChange> => {
  const options = _.defaults(opts, defaults) as ReservoirChangeOptions

  return (selection: PlotSelection<ReservoirChange>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height() - PLOT_DIMENSIONS.DEFAULT_IMAGE_MARGIN

    // Helper functions using closure variables
    const getXPos = (d: ReservoirChange): number =>
      xScale(d.epoch) - RESERVOIR_CHANGE_IMAGE_WIDTH / 2
    const getImageY = (): number =>
      pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2
    const getPumpIcon = (d: ReservoirChange): string =>
      getReservoirChangeIcon(d.pump.manufacturer)

    /**
     * Create new reservoir change visual elements
     */
    const createReservoirChangeElements = (
      enter: d3.Selection<d3.EnterElement, ReservoirChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ReservoirChange, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: ReservoirChange) => idGen.testId(d))

      drawImage(group, getXPos, getImageY(), height, RESERVOIR_CHANGE_IMAGE_WIDTH, getPumpIcon)

      return group
    }

    /**
     * Update existing reservoir change visual elements
     */
    const updateReservoirChangeElements = (
      update: d3.Selection<SVGGElement, ReservoirChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ReservoirChange, SVGGElement, unknown> => {
      update
        .select('image')
        .attr('x', getXPos)
        .attr('y', getImageY())
        .attr('href', getPumpIcon)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get reservoir change data from options
      const filteredData = options.reservoirChanges

      // Step 2: Early exit if no data
      if (filteredData.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allReservoirs = d3.select(this)
        .selectAll<SVGGElement, ReservoirChange>(`g.${idGen.groupSelector()}`)
        .data(filteredData, (d: ReservoirChange) => d.id)

      const reservoirGroup = allReservoirs.join(
        createReservoirChangeElements,
        updateReservoirChangeElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      reservoirGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: ReservoirChange) {
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

