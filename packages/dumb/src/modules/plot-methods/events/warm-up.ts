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

const D3_WARMUP_ID = 'warmup'
const DEFAULT_OPTIONS_SIZE = 30
const DEFAULT_IMAGE_MARGIN = 8

// Helper functions to reduce nesting
const getGroupId = (d: WarmUp): string => `${D3_WARMUP_ID}_group_${d.id}`
const getTestId = (d: WarmUp): string => `${D3_WARMUP_ID}_group_${d.guid}`

type WarmUpOptions = PlotOptions<WarmUp> & {
  warmUps: WarmUp[]
}

const defaults: Partial<WarmUpOptions> = {
  xScale: null,
}

/**
 * Plot warm-up events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The warm-up plotting function
 */
export const plotWarmUp = (
  pool: Pool<WarmUp>,
  opts: Partial<WarmUpOptions> = {}
): PlotFunction<WarmUp> => {
  const options = _.defaults(opts, defaults) as WarmUpOptions

  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  return (selection: PlotSelection<WarmUp>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper function that uses xScale from closure
    const getXPos = (d: WarmUp): number => xScale(d.epoch)
    const getImageY = (): number => pool.height() / 2 - DEFAULT_OPTIONS_SIZE / 2

    selection.each(function (this: SVGGElement) {
      const warmUpEvents = pool.filterDataForRender(options.warmUps)
      const warmUpGroupSelector = `d3-${D3_WARMUP_ID}-group`

      if (warmUpEvents.length < 1) {
        d3.select(this).selectAll(`g.${warmUpGroupSelector}`).remove()
        return
      }

      // Select all warm-up event groups and bind data
      const allWarmUps = d3.select(this)
        .selectAll<SVGGElement, WarmUp>(`g.${warmUpGroupSelector}`)
        .data(warmUpEvents, (d: WarmUp) => d.id)

      // Using join pattern for enter/update/exit
      const warmUpGroup = allWarmUps.join(
        enter => {
          const group = enter
            .append('g')
            .classed(warmUpGroupSelector, true)
            .attr('id', getGroupId)
            .attr('data-testid', getTestId)

          drawImage(group, getXPos, getImageY, height, width, warmupIcon)

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

