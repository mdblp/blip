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

import { NightMode } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import {
  calculateWidth,
  drawImage,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import wizardService from 'medical-domain/dist/src/domains/repositories/medical/datum/wizard.service'

const D3_NIGHT_MODE_ID = 'nightMode'

type NightModeOptions = PlotOptions<NightMode>

const defaults: Partial<NightModeOptions> = {
  xScale: null
}

/**
 * Plot night mode events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The night mode plotting function
 */
export const plotNightMode = (pool: Pool<NightMode>, opts: Partial<NightModeOptions> = {}): PlotFunction<NightMode> => {
  const options = _.defaults(opts, defaults) as NightModeOptions

  const height = pool.height()
  const width = 40
  const offset = height / 4

  return (selection: PlotSelection<NightMode>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const imageXPos = (d: NightMode) => xPos(d, xScale) + calculateWidth(d, xScale) / 2 - width / 2
    const imageHeight = height / 2
    const imageWidth = () => width

    selection.each(function (this: SVGGElement) {
      const nightModeEvents = pool.filterDataForRender(options.tidelineData.medicalData.nightModes)
      const nightModeGroupSelector = `d3-${D3_NIGHT_MODE_ID}-group`

      if (nightModeEvents.length < 1) {
        d3.select(this).selectAll(`g.${nightModeGroupSelector}`).remove()
        return
      }

      // Select all night mode event groups and bind data
      const allNightModes = d3.select(this)
        .selectAll<SVGGElement, NightMode>(`g.d3-${D3_NIGHT_MODE_ID}`)
        .data(nightModeEvents, (d: NightMode) => d.id)

      // Using join pattern for enter/update/exit
      const nightModePlotPrefixId = `${D3_NIGHT_MODE_ID}_group`
      const nightModeGroup = allNightModes.join(
        enter => {
          const group = enter
            .append('g')
            .classed(nightModeGroupSelector, true)
            .attr('id', (d: NightMode) => `${nightModePlotPrefixId}_${d.id}`)
            .attr('data-testid', (d: NightMode) => `${nightModePlotPrefixId}_${d.guid}`)

          drawZoneRectangle(group, height, xScale, 'd3-rect-night d3-night')

          drawImage<NightMode>(group, imageXPos, offset, imageHeight, imageWidth, nightModeIcon)

          return group
        },
        update => {
          // Update existing elements
          update.select('rect.d3-rect-night')
            .attr('x', (d: NightMode) => xPos(d, xScale))
            .attr('width', (d: NightMode) => calculateWidth(d, xScale))

          update.select('image')
            .attr('x', imageXPos)

          return update
        },
        exit => exit.remove()
      )

      // Set up event handlers
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

