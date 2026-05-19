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
import parameterIcon from 'parameter-change.png'

import { type DeviceParameterChange } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.DeviceParameterChange)

// Device parameter image dimensions
const DEVICE_PARAMETER_IMAGE_WIDTH = 40

type DeviceParameterChangeOptions = PlotOptions<DeviceParameterChange> & {
  parameterChanges: DeviceParameterChange[]
}

const defaults: Partial<DeviceParameterChangeOptions> = {
  xScale: null,
}

/**
 * Plot device parameter change events in the diabetes management timeline
 *
 * Device parameter changes represent modifications to diabetes device settings such as:
 * - Basal rate adjustments
 * - Insulin-to-carb ratio changes
 * - Correction factor updates
 * - Target glucose range modifications
 * - Insulin sensitivity factor changes
 *
 * These events are important for understanding therapy adjustments and their impact
 * on glucose control. Each parameter change is visualized with an icon to help
 * patients and caregivers track device configuration history.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, parameter changes data, and event handlers
 * @returns A function that renders device parameter change events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotDeviceParameterChange(pool, {
 *   tidelineData,
 *   parameterChanges: medicalData.deviceParametersChanges,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotDeviceParameterChange = (
  pool: Pool<DeviceParameterChange>,
  opts: Partial<DeviceParameterChangeOptions> = {}
): PlotFunction<DeviceParameterChange> => {
  const options = _.defaults(opts, defaults) as DeviceParameterChangeOptions

  return (selection: PlotSelection<DeviceParameterChange>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height() - PLOT_DIMENSIONS.DEFAULT_IMAGE_MARGIN

    // Helper functions using closure variables
    const getXPos = (d: DeviceParameterChange): number =>
      xScale(d.epoch) - DEVICE_PARAMETER_IMAGE_WIDTH / 2
    const getImageY = (): number =>
      pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2

    /**
     * Create new device parameter change visual elements
     */
    const createParameterElements = (
      enter: d3.Selection<d3.EnterElement, DeviceParameterChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, DeviceParameterChange, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: DeviceParameterChange) => idGen.testId(d))

      drawImage(group, getXPos, getImageY(), height, DEVICE_PARAMETER_IMAGE_WIDTH, parameterIcon)

      return group
    }

    /**
     * Update existing device parameter change visual elements
     */
    const updateParameterElements = (
      update: d3.Selection<SVGGElement, DeviceParameterChange, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, DeviceParameterChange, SVGGElement, unknown> => {
      update
        .select('image')
        .attr('x', getXPos)
        .attr('y', getImageY())

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Always clean param-group because of multiple rendering when navigating between days
      d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()

      // Step 1: Get filtered data from pool
      const deviceParameters = pool.filterDataForRender(options.parameterChanges)

      // Step 2: Early exit if no data
      if (deviceParameters.length < 1) {
        return
      }

      // Step 3: Data join with enter/update/exit
      const allParameters = d3.select(this)
        .selectAll<SVGGElement, DeviceParameterChange>(`g.${idGen.groupSelector()}`)
        .data(deviceParameters, (d: DeviceParameterChange) => d.id)

      const parameterGroup = allParameters.join(
        createParameterElements,
        updateParameterElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      parameterGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: DeviceParameterChange) {
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

