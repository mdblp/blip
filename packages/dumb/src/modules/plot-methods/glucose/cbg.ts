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

import { BgClass, BgClasses, BgUnit, type Cbg, ClassificationType, MGDL_UNITS } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import { getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { convertBgClassesToBgBounds, getBgClass } from '../../../utils/blood-glucose/blood-glucose.util'

type CbgOptions = PlotOptions<Cbg> & {
  bgUnits: BgUnit
  bgClasses: BgClasses
}

const DEFAULT_RADIUS = 2.5

const defaults: Partial<CbgOptions> = {
  bgUnits: MGDL_UNITS,
  xScale: null
}

/**
 * Plot continuous blood glucose data points
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The CBG plotting function
 */
export const plotCbg = (
  pool: Pool<Cbg>,
  opts: Partial<CbgOptions> = {}
): PlotFunction<Cbg> => {
  const options = _.defaults(opts, defaults) as CbgOptions
  const bgUnits = options.bgUnits
  const bgClasses = options.bgClasses

  const bgBounds = convertBgClassesToBgBounds(bgClasses, bgUnits)

  const categorize = (d: Cbg): BgClass => {
    return getBgClass(bgBounds, d.value, ClassificationType.FiveWay)
  }

  const xPosition = (d: Cbg): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch)
  }

  const yPosition = (d: Cbg): number => {
    const yScale = pool.yScale()
    return yScale(d.value)
  }

  const addTooltip = (d: Cbg, rect: DOMRect): void => {
    if (options.onElementHover) {
      options.onElementHover({
        data: d,
        rect: rect,
        class: categorize(d)
      })
    }
  }

  return (selection: PlotSelection<Cbg>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      const medicalData = options.tidelineData.medicalData
      const cbgValues = pool.filterDataForRender(medicalData.cbg)

      const allCBG = d3
        .select(this)
        .selectAll<SVGCircleElement, Cbg>('circle.d3-cbg')
        .data(cbgValues, (d: Cbg) => d.id)

      // Using join pattern for enter/update/exit
      const cbgGroups = allCBG.join(
        enter =>
          enter
            .append('circle')
            .classed('d3-cbg', true)
            .attr('id', (d: Cbg) => `cbg_${d.id}`)
            .attr('data-testid', (d: Cbg) => `cbg_${d.id}`)
            .attr('cx', xPosition)
            .attr('cy', yPosition)
            .attr('r', DEFAULT_RADIUS),
        update =>
          update
            .attr('cx', xPosition)
            .attr('cy', yPosition)
            .attr('r', DEFAULT_RADIUS),
        exit => exit.remove()
      )

      // Filter and apply classes for different BG categories
      const cbgVeryLow = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.VeryLow)
      const cbgLow = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.Low)
      const cbgTarget = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.Target)
      const cbgHigh = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.High)
      const cbgVeryHigh = cbgGroups.filter((d: Cbg) => categorize(d) === BgClass.VeryHigh)

      cbgVeryLow.classed('d3-circle-cbg d3-bg-very-low', true)
      cbgLow.classed('d3-circle-cbg d3-bg-low', true)
      cbgTarget.classed('d3-circle-cbg d3-bg-target', true)
      cbgHigh.classed('d3-circle-cbg d3-bg-high', true)
      cbgVeryHigh.classed('d3-circle-cbg d3-bg-very-high', true)

      const highlight = pool.highlight(allCBG)

      // Set up mouseover and mouseout event handlers
      d3.select(this)
        .selectAll<SVGCircleElement, Cbg>('.d3-circle-cbg')
        .on('mouseover', function (this: SVGCircleElement, _event: MouseEvent, d: Cbg) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          d3Select.attr('r', DEFAULT_RADIUS + 1)

          const bgCategory = categorize(d)
          switch (bgCategory) {
            case BgClass.Low:
            case BgClass.VeryLow:
              d3Select.classed('d3-bg-low-focus', true)
              break
            case BgClass.Target:
              d3Select.classed('d3-bg-target-focus', true)
              break
            case BgClass.High:
            case BgClass.VeryHigh:
              d3Select.classed('d3-bg-high-focus', true)
              break
            default:
              break
          }

          addTooltip(d, getTooltipContainer(this as unknown as SVGGElement))
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          d3
            .select(this)
            .attr('r', DEFAULT_RADIUS)
            .classed('d3-bg-low-focus', false)
            .classed('d3-bg-target-focus', false)
            .classed('d3-bg-high-focus', false)

          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

