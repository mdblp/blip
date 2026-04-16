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
import { COMMON_PADDING, COMMON_RADIUS } from '../common-display-values'

const D3_EATING_SHORTLY_ID = 'eating_shortly'
const IMAGE_WIDTH = 24
const IMAGE_HEIGHT = 24
const IMAGE_CENTER_Y = 6

// Helper functions to reduce nesting
const getGroupId = (d: EatingShortlyEvent): string => `${D3_EATING_SHORTLY_ID}_event_${d.id}`
const getCircleId = (d: EatingShortlyEvent): string => `${D3_EATING_SHORTLY_ID}_circle_${d.id}`

type EatingShortlyOptions = PlotOptions<EatingShortlyEvent>

const defaults: Partial<EatingShortlyOptions> = {
  xScale: null
}

/**
 * Plot eating shortly events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The eating shortly event plotting function
 */
export const plotEatingShortly = (
  pool: Pool<EatingShortlyEvent>,
  opts: Partial<EatingShortlyOptions> = {}
): PlotFunction<EatingShortlyEvent> => {
  const options = _.defaults(opts, defaults) as EatingShortlyOptions

  return (selection: PlotSelection<EatingShortlyEvent>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yPos = COMMON_RADIUS + COMMON_PADDING

    // Helper functions that use xScale from closure
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
        .attr('id', getGroupId)
        .attr('data-testid', getGroupId)

      drawCircle<EatingShortlyEvent>(group, getXPos, yPos, 'd3-circle-eating-shortly', getCircleId)

      drawImage<EatingShortlyEvent>(group, getImageX, IMAGE_CENTER_Y, IMAGE_HEIGHT, IMAGE_WIDTH, eatingShortlyIcon)

      return group
    }

    // Update callback: update existing elements
    const updateEatingShortlyElements = (
      update: d3.Selection<SVGGElement, EatingShortlyEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, EatingShortlyEvent, SVGGElement, unknown> => {
      update.select('circle')
        .attr('cx', getXPos)
        .attr('cy', yPos)
        .attr('r', COMMON_RADIUS)

      update.select('image')
        .attr('x', getImageX)
        .attr('y', IMAGE_CENTER_Y)

      return update
    }

    selection.each(function (this: SVGGElement) {
      const eatingShortlyEvents = pool.filterDataForRender(
        options.tidelineData.medicalData.eatingShortlyEvents
      )
      const eatingShortlyGroupSelector = `d3-${D3_EATING_SHORTLY_ID}-group`

      if (eatingShortlyEvents.length < 1) {
        d3.select(this).selectAll(`g.${eatingShortlyGroupSelector}`).remove()
        return
      }

      // Select all eating shortly event groups and bind data
      const allEatingShortlyEvents = d3.select(this)
        .selectAll<SVGGElement, EatingShortlyEvent>(`g.${eatingShortlyGroupSelector}`)
        .data(eatingShortlyEvents, (d: EatingShortlyEvent) => d.id)

      // Using join pattern for enter/update/exit
      const eatingShortlyGroup = allEatingShortlyEvents.join(
        enter => createEatingShortlyElements(enter, eatingShortlyGroupSelector),
        update => updateEatingShortlyElements(update),
        exit => exit.remove()
      )

      // Set up event handlers
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

