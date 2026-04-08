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
  calculateWidth, drawCircle, drawText,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'

const D3_ZEN_MODE_ID = 'event'

// Helper functions to reduce nesting
const getGroupId = (d: ZenMode): string => `${D3_ZEN_MODE_ID}_group_${d.id}`
// const getRectId = (d: ZenMode): string => `zen_${d.id}`
const getCircleId = (d: ZenMode): string => `zen_circle_${d.id}`
const getTextId = (d: ZenMode): string => `zen_text_${d.id}`

type ZenModeOptions = PlotOptions<ZenMode>

const defaults: Partial<ZenModeOptions> = {
  xScale: null,
}

/**
 * Plot zen mode events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The zen mode plotting function
 */
export const plotZenMode = (
  pool: Pool<ZenMode>,
  opts: Partial<ZenModeOptions> = {}
): PlotFunction<ZenMode> => {
  const options = _.defaults(opts, defaults) as ZenModeOptions

  const height = pool.height()
  const offset = height / 2

  return (selection: PlotSelection<ZenMode>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper functions that use xScale from closure
    const getXPos = (d: ZenMode): number => xPos(d, xScale)
    const getWidth = (d: ZenMode): number => calculateWidth(d, xScale)
    const getCenterX = (d: ZenMode): number => getXPos(d) + getWidth(d) / 2

    // Enter callback: create new elements
    const createZenModeElements = (
      enter: d3.Selection<d3.EnterElement, ZenMode, SVGGElement, unknown>,
      zenModeGroupSelector: string
    ): d3.Selection<SVGGElement, ZenMode, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(zenModeGroupSelector, true)
        .attr('id', getGroupId)
        .attr('data-testid', getGroupId)

      drawZoneRectangle(group, height, xScale, 'd3-rect-zen d3-zen')

      drawCircle(group, getCenterX, offset, 'd3-circle-zen', getCircleId)

      drawText(group, 'ZEN', getCenterX, offset, 'd3-zen-text', getTextId)

      return group
    }

    // Update callback: update existing elements
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
      const zenEvents = pool.filterDataForRender(options.tidelineData.medicalData.zenModes)
      const zenModeGroupSelector = `d3-${D3_ZEN_MODE_ID}-group`

      if (zenEvents.length < 1) {
        d3.select(this).selectAll(`g.${zenModeGroupSelector}`).remove()
        return
      }

      // Select all zen mode event groups and bind data
      const allZenModes = d3.select(this)
        .selectAll<SVGGElement, ZenMode>(`g.${zenModeGroupSelector}`)
        .data(zenEvents, (d: ZenMode) => d.id)

      // Using join pattern for enter/update/exit
      const zenModeGroup = allZenModes.join(
        enter => createZenModeElements(enter, zenModeGroupSelector),
        update => updateZenModeElements(update),
        exit => exit.remove()
      )

      // Set up event handlers
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

