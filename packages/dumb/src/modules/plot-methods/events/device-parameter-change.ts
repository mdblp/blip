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

const D3_PARAMETER_ID = 'param'
const DEFAULT_OPTIONS_SIZE = 30
const DEFAULT_IMAGE_MARGIN = 8

// Helper functions to reduce nesting
const getGroupId = (d: DeviceParameterChange): string => `${D3_PARAMETER_ID}_group_${d.id}`

type DeviceParameterChangeOptions = PlotOptions<DeviceParameterChange> & {
  parameterChanges: DeviceParameterChange[]
}

const defaults: Partial<DeviceParameterChangeOptions> = {
  xScale: null,
}

/**
 * Plot device parameter change events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The device parameter change plotting function
 */
export const plotDeviceParameterChange = (
  pool: Pool<DeviceParameterChange>,
  opts: Partial<DeviceParameterChangeOptions> = {}
): PlotFunction<DeviceParameterChange> => {
  const options = _.defaults(opts, defaults) as DeviceParameterChangeOptions

  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  return (selection: PlotSelection<DeviceParameterChange>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper function that uses xScale from closure
    const getXPos = (d: DeviceParameterChange): number => xScale(d.epoch) - width / 2
    const getImageY = (): number => pool.height() / 2 - DEFAULT_OPTIONS_SIZE / 2

    selection.each(function (this: SVGGElement) {
      // Always clean param-group because of multiple rendering when navigating between days
      d3.select(this).selectAll('g.d3-param-group').remove()

      const deviceParameters = pool.filterDataForRender(options.parameterChanges)
      const parameterGroupSelector = 'd3-param-group'

      if (deviceParameters.length < 1) {
        return
      }

      // Select all parameter change event groups and bind data
      const allParameters = d3.select(this)
        .selectAll<SVGGElement, DeviceParameterChange>(`g.${parameterGroupSelector}`)
        .data(deviceParameters, (d: DeviceParameterChange) => d.id)

      // Using join pattern for enter/update/exit
      const parameterGroup = allParameters.join(
        enter => {
          const group = enter
            .append('g')
            .classed(parameterGroupSelector, true)
            .attr('id', getGroupId)
            .attr('data-testid', getGroupId)

          drawImage(group, getXPos, getImageY, height, width, parameterIcon)

          return group
        },
        update => {
          // Update existing elements
          update
            .select('image')
            .attr('x', getXPos)
            .attr('y', getImageY)

          return update
        },
        exit => exit.remove()
      )

      // Set up event handlers
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

