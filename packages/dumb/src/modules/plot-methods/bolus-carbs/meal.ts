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

import { type Wizard } from 'medical-domain'
import { Pool } from '../../../models/pool.model'
import {
  drawCircle,
  drawText,
  drawVerticalRectangle,
  getTooltipContainer
} from '../../../utils/daily-chart/daily-chart.util'
import { PlotFunction } from '../../../models/plot-function.model'
import { PlotSelection } from '../../../models/plot-selection.model'
import { PlotOptions } from '../../../models/plot-options.model'
import {
  getBolusFromInsulinEvent,
  getBolusType,
  getDelivered,
  getProgrammed,
  getRecommended,
  isMealWithDelivered,
  isMealWithOverride,
  isMealWithUndelivered,
  isMealWithUnderride
} from '../../../utils/bolus/bolus.util'
import { BolusType } from '../../../models/enums/bolus-type.enum'

const BOLUS_WIDTH = 12
const HALF_BOLUS_WIDTH = BOLUS_WIDTH / 2
const CARB_RADIUS = 14
const CARB_PADDING = 4
const MARKER_HEIGHT = 5
const TRIANGLE_HEIGHT = 4
const TRIANGLE_OFFSET = 4

type MealOptions = PlotOptions<Wizard> & {
  meals: Wizard[]
}

const defaults: Partial<MealOptions> = {
  xScale: null,
}

/**
 * Get the CSS class based on bolus type for wizard
 */
const getBolusClass = (wizard: Wizard, baseClass: string): string => {
  const bolus = getBolusFromInsulinEvent(wizard)
  if (!bolus) {
    return baseClass
  }

  const bolusType = getBolusType(wizard)

  switch (bolusType) {
    case BolusType.Manual:
      return `${baseClass} d3-bolus-manual`
    case BolusType.Meal:
    case BolusType.Umm:
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
 * Get the maximum value for sorting (considers both recommended and programmed)
 */
const getMaxValue = (wizard: Wizard): number => {
  const bolus = getBolusFromInsulinEvent(wizard)
  if (!bolus) {
    return Number.NaN
  }

  const programmed = getProgrammed(bolus) ?? 0
  if (Number.isNaN(programmed)) {
    return Number.NaN
  }

  const recommended = getRecommended(wizard)
  if (Number.isNaN(recommended)) {
    return programmed
  }

  return Math.max(recommended, programmed)
}

/**
 * Plot wizard/meal data (boluses with carb input and recommendations)
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The meal plotting function
 */
export const plotMeal = (
  pool: Pool<Wizard>,
  opts: Partial<MealOptions> = {}
): PlotFunction<Wizard> => {
  const options = _.defaults(opts, defaults) as MealOptions

  const yScale = pool.yScale()
  const top = yScale.range()[0]

  const xPosition = (d: Wizard): number => {
    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }
    return options.xScale(d.epoch) - HALF_BOLUS_WIDTH
  }

  const yPosition = (d: Wizard): number => {
    const bolus = getBolusFromInsulinEvent(d)
    if (!bolus) {
      return 0
    }
    return yScale(getDelivered(bolus))
  }

  const bolusWidth = (d: Wizard): number => {
    const bolusType = getBolusType(d)
    if (bolusType === BolusType.Correction) {
      return BOLUS_WIDTH / 2
    }
    return BOLUS_WIDTH
  }

  const bolusHeight = (d: Wizard): number => {
    const bolus = getBolusFromInsulinEvent(d)
    if (!bolus) {
      return 0
    }
    return top - yScale(getDelivered(bolus))
  }

  // Carb circle positioning
  const carbXPos = (d: Wizard): number => xPosition(d) + HALF_BOLUS_WIDTH

  const carbYScale = CARB_RADIUS

  const carbYPos = CARB_RADIUS + CARB_PADDING

  // Triangle helpers
  const triangleLeft = (x: number): number => x + HALF_BOLUS_WIDTH - TRIANGLE_OFFSET
  const triangleRight = (x: number): number => x + HALF_BOLUS_WIDTH + TRIANGLE_OFFSET
  const triangleMiddle = (x: number): number => x + HALF_BOLUS_WIDTH

  const underrideTriangle = (x: number, y: number): string => {
    return `${triangleLeft(x)},${y + MARKER_HEIGHT/2} ` +
      `${triangleMiddle(x)},${y + MARKER_HEIGHT/2 + TRIANGLE_HEIGHT} ` +
      `${triangleRight(x)},${y + MARKER_HEIGHT/2}`
  }

  const overrideTriangle = (x: number, y: number): string => {
    return `${triangleLeft(x)},${y + MARKER_HEIGHT/2} ` +
      `${triangleMiddle(x)},${y + MARKER_HEIGHT/2 - TRIANGLE_HEIGHT} ` +
      `${triangleRight(x)},${y + MARKER_HEIGHT/2}`
  }

  return (selection: PlotSelection<Wizard>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const getCarbId = (d: Wizard) => `carbs_circle_${d.id}`
    const getCarbText = (d: Wizard) => d.carbInput.toString()
    const getCarbTextId = (d: Wizard) => `carbs_text_${d.id}`
    const getBolusId = (d: Wizard) => `bolus_${d.id}`
    const getRectangleClasses = (d: Wizard) => getBolusClass(d, 'd3-bolus d3-rect-bolus')
    const getUndeliveredYPosition = (d: Wizard) => {
      const bolus = getBolusFromInsulinEvent(d)
      if (!bolus) return 0
      return yScale(getProgrammed(bolus) ?? 0)
    }
    const getUndeliveredHeight = (d: Wizard) => {
      const bolus = getBolusFromInsulinEvent(d)
      if (!bolus) return 0
      const delivered = getDelivered(bolus)
      const programmed = getProgrammed(bolus) ?? 0
      return yScale(delivered) - yScale(programmed)
    }
    const getUndeliveredId = (d: Wizard) => `wizard_undelivered_${d.id}`

    selection.each(function (this: SVGGElement) {
      // Get the data bound to this element
      const currentData = d3.select(this).datum() as Wizard[]

      if (currentData.length < 1) {
        d3.select(this).selectAll('g.d3-wizard-group').remove()
        return
      }

      const allMeals = d3
        .select(this)
        .selectAll<SVGGElement, Wizard>('g.d3-wizard-group')
        .data(currentData, (d: Wizard) => d.id)

      // Using join pattern for enter/update/exit
      const mealGroup = allMeals.join(
        enter => {
          const group = enter
            .append('g')
            .classed('d3-wizard-group', true)
            .attr('id', (d: Wizard) => `wizard_group_${d.id}`)
            .attr('data-testid', (d: Wizard) => `wizard_group_${d.id}`)
            .sort((a: Wizard, b: Wizard) => {
              // Sort by size so smaller boluses are drawn last
              return d3.descending(getMaxValue(a), getMaxValue(b))
            })

          // Draw carbs for wizards with carb input
          const carbGroups = group.filter((d: Wizard) => d.carbInput > 0)
          drawCircle(carbGroups, carbXPos, carbYPos, 'd3-circle-carbs d3-carbs', getCarbId)
          drawText(carbGroups, getCarbText, carbXPos, carbYPos, 'd3-carbs-text d3-carbs-text-meal', getCarbTextId)

          // Draw the delivered bolus rectangle for wizards with bolus
          const bolusGroups = group.filter(isMealWithDelivered)
          drawVerticalRectangle(bolusGroups, xPosition, yPosition, bolusHeight, bolusWidth, getRectangleClasses, getBolusId)

          // Draw undelivered portion
          const undeliveredGroups = group.filter(isMealWithUndelivered)
          drawVerticalRectangle(undeliveredGroups, xPosition, getUndeliveredYPosition, getUndeliveredHeight, bolusWidth, 'd3-rect-undelivered d3-bolus', getUndeliveredId)

          // Draw underride triangles (recommended > programmed)
          const underrideGroups = group.filter(isMealWithUnderride)

          underrideGroups.append('polygon')
            .attr('x', xPosition)
            .attr('y', (d: Wizard) => {
              const bolus = getBolusFromInsulinEvent(d)
              if (!bolus) return 0
              return yScale(getProgrammed(bolus) ?? 0)
            })
            .attr('points', (d: Wizard) => {
              const x = xPosition(d)
              const bolus = getBolusFromInsulinEvent(d)
              if (!bolus) return ''
              const y = yScale(getProgrammed(bolus) ?? 0)
              return underrideTriangle(x, y)
            })
            .attr('id', (d: Wizard) => `wizard_underride_polygon_${d.id}`)
            .attr('class', 'd3-polygon-ride d3-bolus')

          // Draw override triangles (programmed > recommended)
          const overrideGroups = group.filter(isMealWithOverride)

          overrideGroups.append('polygon')
            .attr('x', xPosition)
            .attr('y', (d: Wizard) => {
              const recommended = getRecommended(d)
              return yScale(recommended) - MARKER_HEIGHT
            })
            .attr('points', (d: Wizard) => {
              const x = xPosition(d)
              const recommended = getRecommended(d)
              const y = yScale(recommended) - MARKER_HEIGHT
              return overrideTriangle(x, y)
            })
            .attr('id', (d: Wizard) => `wizard_override_polygon_${d.id}`)
            .attr('class', 'd3-polygon-ride d3-bolus')

          return group
        },
        update => {
          // Update existing elements
          update.sort((a: Wizard, b: Wizard) => {
            return d3.descending(getMaxValue(a), getMaxValue(b))
          })

          // Update carbs
          update
            .select('circle.d3-circle-carbs')
            .attr('cx', carbXPos)
            .attr('cy', carbYPos)
            .attr('r', carbYScale)

          update
            .select('text.d3-carbs-text')
            .text((d: Wizard) => d.carbInput)
            .attr('x', carbXPos)
            .attr('y', carbYPos)

          // Update bolus rectangles
          update
            .select('rect.d3-rect-bolus')
            .attr('x', xPosition)
            .attr('y', yPosition)
            .attr('width', bolusWidth)
            .attr('height', bolusHeight)
            .attr('class', (d: Wizard) => getBolusClass(d, 'd3-bolus d3-rect-bolus'))

          // Update undelivered rectangles
          update
            .select('rect.d3-rect-undelivered')
            .attr('x', xPosition)
            .attr('y', (d: Wizard) => {
              const bolus = getBolusFromInsulinEvent(d)
              if (!bolus) return 0
              return yScale(getProgrammed(bolus) ?? 0)
            })
            .attr('width', bolusWidth)
            .attr('height', (d: Wizard) => {
              const bolus = getBolusFromInsulinEvent(d)
              if (!bolus) return 0
              const delivered = getDelivered(bolus)
              const programmed = getProgrammed(bolus) ?? 0
              return yScale(delivered) - yScale(programmed)
            })

          // Update triangles
          update
            .select('polygon.d3-polygon-ride')
            .attr('points', (d: Wizard) => {
              const x = xPosition(d)
              const bolus = getBolusFromInsulinEvent(d)
              if (!bolus) return ''
              const recommended = getRecommended(d)
              const programmed = getProgrammed(bolus) ?? 0

              if (programmed < recommended) {
                const y = yScale(programmed)
                return underrideTriangle(x, y)
              } else {
                const y = yScale(recommended) - MARKER_HEIGHT
                return overrideTriangle(x, y)
              }
            })

          return update
        },
        exit => exit.remove()
      )

      // Set up highlight behavior with selector string for both wizard and bolus groups
      const highlight = pool.highlight('.d3-wizard-group, .d3-bolus-group')

      // Set up tooltip event handlers
      mealGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Wizard) {
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

