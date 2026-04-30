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
import { type Pool } from '../../../models/pool.model'
import { drawVerticalRectangle, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { getBolusType, isBolusWithDelivered, isBolusWithUndelivered } from '../../../utils/bolus/bolus.util'
import { BolusType } from '../../../models/enums/bolus-type.enum'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { CSS_CLASSES, PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Bolus)

// Bolus rectangle dimensions
const HALF_BOLUS_WIDTH = PLOT_DIMENSIONS.BOLUS_WIDTH / 2

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
  return 'd3-bolus-group'
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
 * Plot bolus insulin delivery data (boluses without wizard/meal data)
 *
 * Boluses represent insulin delivery events. This plotter handles "quick boluses"
 * that were delivered without using the bolus calculator (wizard). Different bolus
 * types are visualized with different colors:
 *
 * Bolus Types:
 * - **Manual**: User-initiated bolus without meal data
 * - **Meal**: Bolus for carbohydrate coverage (blue)
 * - **Correction**: Bolus to correct high blood glucose (orange, half width)
 * - **Pen**: Insulin delivered via injection pen
 * - **Eating Shortly**: Bolus for imminent carbohydrate intake
 *
 * Visual Features:
 * - Delivered insulin shown as solid colored rectangle
 * - Undelivered insulin (interruptions) shown as hatched rectangle above
 * - Rectangle height proportional to insulin amount
 * - Larger boluses drawn first to prevent occlusion of smaller ones
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders bolus data when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotBolus(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotBolus = (
  pool: Pool<Bolus>,
  opts: Partial<BolusPlotOptions> = {}
): PlotFunction<Bolus> => {
  const options = _.defaults(opts, defaults) as BolusPlotOptions

  return (selection: PlotSelection<Bolus>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const yScale = pool.yScale()
    const top = yScale.range()[0]

    // Helper functions using closure variables
    const xPosition = (d: Bolus): number => xScale(d.epoch) - HALF_BOLUS_WIDTH

    const yPosition = (d: Bolus): number => yScale(getDelivered(d))

    const bolusWidth = (d: Bolus): number => {
      const bolusType = getBolusType(d)
      if (bolusType === BolusType.Correction) {
        return PLOT_DIMENSIONS.BOLUS_WIDTH / 2
      }
      return PLOT_DIMENSIONS.BOLUS_WIDTH
    }

    const bolusHeight = (d: Bolus): number => top - yScale(getDelivered(d))

    const getDeliveredClassNames = (d: Bolus): string =>
      getBolusClass(d, `${CSS_CLASSES.BOLUS} ${CSS_CLASSES.BOLUS_RECT}`)

    const getBolusId = (d: Bolus): string => idGen.elementId(d, 'rect')

    const getUndeliveredYPosition = (d: Bolus): number => yScale(getProgrammed(d))

    const getUndeliveredHeight = (d: Bolus): number => {
      const delivered = getDelivered(d)
      const programmed = getProgrammed(d)
      return yScale(delivered) - yScale(programmed)
    }

    const getUndeliveredId = (d: Bolus): string => idGen.elementId(d, 'undelivered')

    /**
     * Create new bolus visual elements
     */
    const createBolusElements = (
      enter: d3.Selection<d3.EnterElement, Bolus, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Bolus, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(CSS_CLASSES.BOLUS_GROUP, true)
        .attr('id', idGen.groupId)
        .attr('data-testid', getDataTestId)
        .sort((a: Bolus, b: Bolus) => {
          // Sort by size so smaller boluses are drawn last (on top)
          return d3.descending(getMaxValue(a), getMaxValue(b))
        })

      // Draw the delivered bolus rectangle
      const deliveredGroup = group.filter(isBolusWithDelivered)
      drawVerticalRectangle(deliveredGroup, xPosition, yPosition, bolusHeight, bolusWidth, getDeliveredClassNames, getBolusId)

      // Draw undelivered portion (interrupted boluses)
      const undeliveredGroup = group.filter(isBolusWithUndelivered)
      drawVerticalRectangle(undeliveredGroup, xPosition, getUndeliveredYPosition, getUndeliveredHeight, bolusWidth, `${CSS_CLASSES.BOLUS} d3-rect-undelivered`, getUndeliveredId)

      return group
    }

    /**
     * Update existing bolus visual elements
     */
    const updateBolusElements = (
      update: d3.Selection<SVGGElement, Bolus, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Bolus, SVGGElement, unknown> => {
      update.sort((a: Bolus, b: Bolus) => {
        return d3.descending(getMaxValue(a), getMaxValue(b))
      })

      update
        .select(`rect.${CSS_CLASSES.BOLUS_RECT}`)
        .attr('x', xPosition)
        .attr('y', yPosition)
        .attr('width', bolusWidth)
        .attr('height', bolusHeight)
        .attr('class', (d: Bolus) => getBolusClass(d, `${CSS_CLASSES.BOLUS} ${CSS_CLASSES.BOLUS_RECT}`))

      update
        .select('rect.d3-rect-undelivered')
        .attr('x', xPosition)
        .attr('y', getUndeliveredYPosition)
        .attr('width', bolusWidth)
        .attr('height', getUndeliveredHeight)

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get the data bound to this element
      const data = d3.select(this).datum() as Bolus[]

      // Step 2: Filter out boluses with wizard (those are plotted separately)
      const currentData = _.filter(data, (d: Bolus) => _.isEmpty(d.wizard))

      // Step 3: Early exit if no data
      if (currentData.length < 1) {
        d3.select(this).selectAll(`g.${CSS_CLASSES.BOLUS_GROUP}`).remove()
        return
      }

      // Step 4: Data join with enter/update/exit
      const allBoluses = d3.select(this)
        .selectAll<SVGGElement, Bolus>(`g.${CSS_CLASSES.BOLUS_GROUP}`)
        .data(currentData, (d: Bolus) => d.id)

      const bolusGroup = allBoluses.join(
        createBolusElements,
        updateBolusElements,
        exit => exit.remove()
      )

      // Step 5: Set up highlight behavior (includes wizard groups for coordinated highlighting)
      // Note: Using selector string to highlight all bolus and wizard groups together
      const highlight = pool.highlight('.d3-wizard-group, .d3-bolus-group')

      // Step 6: Set up event handlers
      bolusGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Bolus) {
          highlight.on(d3.select(this))
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

