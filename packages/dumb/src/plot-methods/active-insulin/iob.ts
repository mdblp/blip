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

import { BgClasses, type BgUnit, DblParameter, DEFAULT_BG_BOUNDS, Iob, MedicalData, MGDL_UNITS } from 'medical-domain'
import { Pool } from '../../models/pool.model'
import { getTooltipContainer } from '../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../models/plot-function.model'
import { PlotSelection } from '../../models/plot-selection.model'
import { PlotOptions } from '../../models/plot-options.model'


const DEFAULT_MAX_IOB_VALUE_U = 45

export const getMaxIobValue = (medicalData: MedicalData) => {
  if (!medicalData.pumpSettings || medicalData.pumpSettings.length === 0) {
    return DEFAULT_MAX_IOB_VALUE_U
  }

  const totalDailyInsulinParameter = medicalData.pumpSettings[0]?.payload?.parameters?.find((parameter) => parameter.name === DblParameter.TotalDailyInsulin)
  const totalDailyInsulinValue = totalDailyInsulinParameter && Number.parseFloat(totalDailyInsulinParameter.value)

  // The max IOB value is set to half of the total daily insulin, or a default max if that value is not available
  return totalDailyInsulinValue && Number.isFinite(totalDailyInsulinValue) ? totalDailyInsulinValue / 2 : DEFAULT_MAX_IOB_VALUE_U
}

type IobOptions = PlotOptions<Iob> & {
  bgUnits: BgUnit
  classes: Partial<BgClasses>
  radius: number
}

type IobPlotFunction = PlotFunction & {
  xPosition: (d: Iob) => number
  yPosition: (d: Iob) => number
}

const defaults: Partial<IobOptions> = {
  bgUnits: MGDL_UNITS,
  classes: {
    low: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower,
    target: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper,
    high: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh
  },
  radius: 2.5,
  xScale: null
}

/**
 * Plot Insulin On Board (IOB) points
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The IOB plotting function
 */
export const plotIob = (pool: Pool<Iob>, opts: Partial<IobOptions> = {}): IobPlotFunction => {
  const options = _.defaults(opts, defaults) as IobOptions

  const iob = (selection: PlotSelection): void => {
    options.xScale = pool.xScale().copy()

    selection.each(function (this: SVGGElement) {
      const medicalData = options.tidelineData.medicalData
      const iobValues = pool.filterDataForRender(medicalData.iob)

      const maxIobValue = getMaxIobValue(medicalData)

      const filteredIobValues = iobValues.filter(d => d.value <= maxIobValue)

      const allIobPoints = d3.select(this)
        .selectAll<SVGCircleElement, Iob>('circle.d3-iob')
        .data(filteredIobValues, (d: Iob) => d.id)

      // Using join pattern for enter/update/exit
      allIobPoints.join(
        enter => enter.append('circle')
          .attr('id', (d: Iob) => `iob_${d.id}`)
          .attr('data-testid', (d: Iob) => `iob_${d.id}`)
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', options.radius)
          .classed('d3-iob', true),
        update => update
          .attr('cx', iob.xPosition)
          .attr('cy', iob.yPosition)
          .attr('r', options.radius),
        exit => exit.remove()
      )

      const highlight = pool.highlight(allIobPoints)

      // Set up mouseover and mouseout event handlers
      selection.selectAll<SVGCircleElement, Iob>('.d3-iob')
        .on('mouseover', function (this: SVGCircleElement, event: MouseEvent, d: Iob) {
          const d3Select = d3.select(this)
          highlight.on(d3Select)
          d3Select.attr('r', options.radius + 1)

          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGCircleElement) {
          highlight.off()
          d3.select(this)
            .attr('r', options.radius)

          if (_.get(options, 'onIobOut', false)) {
            options.onElementOut?.()
          }
        })
    })
  }

  iob.xPosition = (datum: Iob): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(datum.epoch)
  }

  iob.yPosition = (datum: Iob): number => {
    const yScale = pool.yScale()
    return yScale(datum.value)
  }

  return iob
}
