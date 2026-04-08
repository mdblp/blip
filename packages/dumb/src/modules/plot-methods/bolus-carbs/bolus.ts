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

import { type Bolus, BolusSubtype, Prescriptor } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import { drawVerticalRectangle, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import { getBolusType, isBolusWithDelivered, isBolusWithUndelivered } from '../../../utils/bolus/bolus.util'
import { BolusType } from '../../../models/enums/bolus-type.enum'

const BOLUS_WIDTH = 12
const HALF_BOLUS_WIDTH = BOLUS_WIDTH / 2

type BolusPlotOptions = PlotOptions<Bolus>

const defaults: Partial<BolusPlotOptions> = {
  xScale: null
}

/**
 * Get the data-testid attribute value based on bolus type
 */
const getDataTestId = (d: Bolus): string => {
  if (d.subType === BolusSubtype.Pen) {
    return `bolus_pen_${d.id}`
  }
  if (d.prescriptor === Prescriptor.Manual) {
    return `bolus_manual_${d.id}`
  }
  if (d.prescriptor === Prescriptor.EatingShortlyManagement) {
    return `bolus_eating_shortly_${d.id}`
  }
  return `bolus_group_${d.id}`
}

/**
 * Get the CSS class based on bolus type
 */
const getBolusClass = (bolus: Bolus, baseClass: string): string => {
  const bolusType = getBolusType(bolus)

  switch (bolusType) {
    case BolusType.Manual:
      return `${baseClass} d3-bolus-manual`
    case BolusType.Meal:
      return `${baseClass} d3-bolus-meal`
    case BolusType.Correction:
      return `${baseClass} d3-bolus-correction`
    case BolusType.Pen:
      return `${baseClass} d3-bolus-pen`
    case BolusType.EatingShortly:
      return `${baseClass} d3-bolus-eating-shortly`
    default:
      return baseClass
  }
}

/**
 * Get the delivered amount from a bolus
 */
const getDelivered = (bolus: Bolus): number => {
  if (Number.isFinite(bolus.normal)) {
    return bolus.normal
  }
  return Number.NaN
}

/**
 * Get the programmed amount from a bolus
 */
const getProgrammed = (bolus: Bolus): number => {
  const expectedNormal = Number.isFinite(bolus.expectedNormal) ? (bolus.expectedNormal ?? 0) : 0
  const normal = Number.isFinite(bolus.normal) ? bolus.normal : 0
  return Math.max(expectedNormal, normal)
}

/**
 * Get the maximum value for sorting
 */
const getMaxValue = (bolus: Bolus): number => {
  const programmed = getProgrammed(bolus)
  if (Number.isNaN(programmed)) {
    return Number.NaN
  }
  return programmed
}

/**
 * Plot bolus data (quick boluses without wizard data)
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The bolus plotting function
 */
export const plotBolus = (
  pool: Pool<Bolus>,
  opts: Partial<BolusPlotOptions> = {}
): PlotFunction<Bolus> => {
  const options = _.defaults(opts, defaults) as BolusPlotOptions

  const yScale = pool.yScale()
  const top = yScale.range()[0]

  const xPosition = (d: Bolus): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch) - HALF_BOLUS_WIDTH
  }

  const yPosition = (d: Bolus): number => {
    return yScale(getDelivered(d))
  }

  const bolusWidth = (d: Bolus): number => {
    const bolusType = getBolusType(d)
    if (bolusType === BolusType.Correction) {
      return BOLUS_WIDTH / 2
    }
    return BOLUS_WIDTH
  }

  const bolusHeight = (d: Bolus): number => {
    return top - yScale(getDelivered(d))
  }

  const getDeliveredClassNames = (d: Bolus) => getBolusClass(d, 'd3-bolus d3-rect-bolus')
  const getBolusId = (d: Bolus) => `bolus_${d.id}`
  const getUndeliveredYPosition = (d: Bolus) => yScale(getProgrammed(d))
  const getUndeliveredHeight = (d: Bolus) => {
    const delivered = getDelivered(d)
    const programmed = getProgrammed(d)
    return yScale(delivered) - yScale(programmed)
  }
  const getUndeliveredId = (d: Bolus) => `bolus_undelivered_${d.id}`

  return (selection: PlotSelection<Bolus>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    selection.each(function (this: SVGGElement) {
      // Get the data bound to this element
      const data = d3.select(this).datum() as Bolus[]

      // Filter out boluses with wizard
      const currentData = _.filter(data, (d: Bolus) => _.isEmpty(d.wizard))

      if (currentData.length < 1) {
        d3.select(this).selectAll('g.d3-bolus-group').remove()
        return
      }

      const allBoluses = d3
        .select(this)
        .selectAll<SVGGElement, Bolus>('g.d3-bolus-group')
        .data(currentData, (d: Bolus) => d.id)

      // Using join pattern for enter/update/exit
      const bolusGroup = allBoluses.join(
        enter => {
          const group = enter
            .append('g')
            .classed('d3-bolus-group', true)
            .attr('id', (d: Bolus) => `bolus_group_${d.id}`)
            .attr('data-testid', getDataTestId)
            .sort((a: Bolus, b: Bolus) => {
              // Sort by size so smaller boluses are drawn last
              return d3.descending(getMaxValue(a), getMaxValue(b))
            })

          // Draw the delivered bolus rectangle
          const deliveredGroup = group.filter(isBolusWithDelivered)
          drawVerticalRectangle(deliveredGroup, xPosition, yPosition, bolusHeight, bolusWidth, getDeliveredClassNames, getBolusId)

          // Draw undelivered portion
          const undeliveredGroup = group.filter(isBolusWithUndelivered)
          drawVerticalRectangle(undeliveredGroup, xPosition, getUndeliveredYPosition, getUndeliveredHeight, bolusWidth, 'd3-rect-undelivered d3-bolus', getUndeliveredId)

          return group
        },
        update => {
          // Update existing elements
          update
            .sort((a: Bolus, b: Bolus) => {
              return d3.descending(getMaxValue(a), getMaxValue(b))
            })

          update
            .select('rect.d3-rect-bolus')
            .attr('x', xPosition)
            .attr('y', yPosition)
            .attr('width', bolusWidth)
            .attr('height', bolusHeight)
            .attr('class', (d: Bolus) => getBolusClass(d, 'd3-bolus d3-rect-bolus'))

          update
            .select('rect.d3-rect-undelivered')
            .attr('x', xPosition)
            .attr('y', (d: Bolus) => yScale(getProgrammed(d)))
            .attr('width', bolusWidth)
            .attr('height', (d: Bolus) => {
              const delivered = getDelivered(d)
              const programmed = getProgrammed(d)
              return yScale(delivered) - yScale(programmed)
            })

          return update
        },
        exit => exit.remove()
      )

      // Set up highlight behavior with selector string for both wizard and bolus groups
      const highlight = pool.highlight('.d3-wizard-group, .d3-bolus-group' as any)

      // Set up tooltip event handlers
      bolusGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Bolus) {
          highlight.on(d3.select(this) as any)
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement) {
          highlight.off()
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

