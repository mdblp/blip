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

const D3_RESERVOIR_ID = 'reservoir'
const DEFAULT_OPTIONS_SIZE = 30
const DEFAULT_IMAGE_MARGIN = 8

// Helper functions to reduce nesting
const getGroupId = (d: ReservoirChange): string => `${D3_RESERVOIR_ID}_group_${d.id}`
const getPumpIcon = (d: ReservoirChange): string => getReservoirChangeIcon(d.pump.manufacturer)

type ReservoirChangeOptions = PlotOptions<ReservoirChange> & {
  reservoirChanges: ReservoirChange[]
}

const defaults: Partial<ReservoirChangeOptions> = {
  xScale: null,
}

/**
 * Plot cartridge/reservoir change events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The cartridge change plotting function
 */
export const plotReservoirChange = (
  pool: Pool<ReservoirChange>,
  opts: Partial<ReservoirChangeOptions> = {}
): PlotFunction<ReservoirChange> => {
  const options = _.defaults(opts, defaults) as ReservoirChangeOptions

  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  return (selection: PlotSelection<ReservoirChange>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper function that uses xScale from closure
    const getXPos = (d: ReservoirChange): number => xScale(d.epoch) - width / 2
    const getImageY = (): number => pool.height() / 2 - DEFAULT_OPTIONS_SIZE / 2

    selection.each(function (this: SVGGElement) {
      const filteredData = options.reservoirChanges
      const reservoirGroupSelector = `d3-${D3_RESERVOIR_ID}-group`

      if (filteredData.length < 1) {
        d3.select(this).selectAll(`g.${reservoirGroupSelector}`).remove()
        return
      }

      // Select all reservoir change event groups and bind data
      const allReservoirs = d3.select(this)
        .selectAll<SVGGElement, ReservoirChange>(`g.${reservoirGroupSelector}`)
        .data(filteredData, (d: ReservoirChange) => d.id)

      // Using join pattern for enter/update/exit
      const reservoirGroup = allReservoirs.join(
        enter => {
          const group = enter
            .append('g')
            .classed(reservoirGroupSelector, true)
            .attr('id', getGroupId)
            .attr('data-testid', getGroupId)

          drawImage(group, getXPos, getImageY, height, width, getPumpIcon)

          return group
        },
        update => {
          // Update existing elements
          update
            .select('image')
            .attr('x', getXPos)
            .attr('y', getImageY)
            .attr('href', getPumpIcon)

          return update
        },
        exit => exit.remove()
      )

      // Set up event handlers
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

