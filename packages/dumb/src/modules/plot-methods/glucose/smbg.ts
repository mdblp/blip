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

import { BgClass, BgClasses, BgUnit, ClassificationType, MGDL_UNITS, type Smbg } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { convertBgClassesToBgBounds, getBgClass } from '../../../utils/blood-glucose/blood-glucose.util'

type SmbgOptions = PlotOptions<Smbg> & {
  bgUnits: BgUnit
  bgClasses: BgClasses
}

const DEFAULT_SIZE = 16

const defaults: Partial<SmbgOptions> = {
  bgUnits: MGDL_UNITS,
  xScale: null
}

/**
 * Get CSS class name based on BG category
 */
const getBgCategoryClass = (bgClass: BgClass): string => {
  switch (bgClass) {
    case BgClass.VeryLow:
      return 'd3-bg-very-low'
    case BgClass.Low:
      return 'd3-bg-low'
    case BgClass.Target:
      return 'd3-bg-target'
    case BgClass.High:
      return 'd3-bg-high'
    case BgClass.VeryHigh:
      return 'd3-bg-very-high'
    default:
      return ''
  }
}

/**
 * Plot self-monitored blood glucose (SMBG) data points
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The SMBG plotting function
 */
export const plotSmbg = (
  pool: Pool<Smbg>,
  opts: Partial<SmbgOptions> = {}
): PlotFunction<Smbg> => {
  const options = _.defaults(opts, defaults) as SmbgOptions
  const bgUnits = options.bgUnits
  const bgClasses = options.bgClasses

  const bgBounds = convertBgClassesToBgBounds(bgClasses, bgUnits)

  const categorize = (d: Smbg): BgClass => {
    return getBgClass(bgBounds, d.value, ClassificationType.FiveWay)
  }

  const xPosition = (d: Smbg): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  const yPosition = (d: Smbg): number => {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  const radius = (): number => {
    // size is the total diameter of an smbg
    // radius is half that, minus one because of the 1px stroke for open circles
    return DEFAULT_SIZE / 2 - 1
  }

  return (selection: PlotSelection<Smbg>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      // Get the data bound to this element
      const currentData = d3.select(this).datum() as Smbg[]

      if (currentData.length < 1) {
        d3.select(this).selectAll('circle.d3-smbg').remove()
        return
      }

      const allSmbg = d3
        .select(this)
        .selectAll<SVGCircleElement, Smbg>('circle.d3-smbg')
        .data(currentData, (d: Smbg) => d.id)

      // Using join pattern for enter/update/exit
      const smbgCircles = allSmbg.join(
        enter => {
          const circles = enter
            .append('circle')
            .classed('d3-smbg', true)
            .attr('id', (d: Smbg) => `smbg_${d.id}`)
            .attr('data-testid', (d: Smbg) => `smbg_group_${d.id}`)
            .attr('cx', xPosition)
            .attr('cy', yPosition)
            .attr('r', radius())

          // Apply category classes
          circles.each(function (this: SVGCircleElement, d: Smbg) {
            const bgClass = categorize(d)
            const categoryClass = getBgCategoryClass(bgClass)
            d3.select(this).attr('class', `d3-circle-smbg ${categoryClass}`)
          })

          return circles
        },
        update => {
          // Update existing circles
          update
            .attr('cx', xPosition)
            .attr('cy', yPosition)
            .attr('r', radius())

          // Update category classes
          update.each(function (this: SVGCircleElement, d: Smbg) {
            const bgClass = categorize(d)
            const categoryClass = getBgCategoryClass(bgClass)
            d3.select(this).attr('class', `d3-smbg ${categoryClass}`)
          })

          return update
        },
        exit => exit.remove()
      )

      // Set up highlight behavior
      const highlight = pool.highlight(smbgCircles as any)

      // Set up tooltip event handlers
      smbgCircles
        .on('mouseover', function (this: SVGCircleElement, _event: MouseEvent, d: Smbg) {
          highlight.on(d3.select(this) as any)
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this as any as SVGGElement),
              class: categorize(d)
            })
          }
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

