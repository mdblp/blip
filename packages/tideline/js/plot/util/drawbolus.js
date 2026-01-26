/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import _ from 'lodash'
import commonbolus from './commonbolus'
import { BolusSubtype, DatumType, Prescriptor } from 'medical-domain'

const BolusType = {
  meal: 1,
  correction: 2,
  manual: 3,
  pen: 4,
  eatingShortly: 5
}

/**
 * @param {object} b The bolus or wizard
 * @returns {number} The type of bolus
 */
function bolusToLegend(b) {
  if (b.type === DatumType.Wizard) {
    return BolusType.meal
  }

  const bolus = commonbolus.getBolus(b)
  if (bolus.subType === BolusSubtype.Pen) {
    return BolusType.pen
  }
  if (bolus.prescriptor === Prescriptor.Manual) {
    return BolusType.manual
  }
  if (bolus.prescriptor === Prescriptor.EatingShortlyManagement) {
    return BolusType.eatingShortly
  }
  if (bolus.subType === BolusSubtype.Biphasic) {
    return BolusType.meal
  }
  return BolusType.correction
}

/**
 * @param {object} b The bolus or wizard
 * @param {string} baseClass default/prepend class
 * @return {string} The SVG class
 */
function bolusClass(b, baseClass) {
  switch (bolusToLegend(b)) {
    case BolusType.manual:
      return `${baseClass} d3-bolus-manual`
    case BolusType.meal:
      return `${baseClass} d3-bolus-meal`
    case BolusType.correction:
      return `${baseClass} d3-bolus-correction`
    case BolusType.pen:
      return `${baseClass} d3-bolus-pen`
    case BolusType.eatingShortly:
      return `${baseClass} d3-bolus-eating-shortly`
    default:
      return baseClass
  }
}

/**
 * Creates bolus drawing utilities
 * @param {object} pool - The pool to render into
 * @param {object} opts - Configuration options
 * @returns {object} - Collection of bolus drawing functions
 */
function drawBolus(pool, opts = {}) {
  const defaults = {
    width: 12,
    r: 14,
    suspendMarkerWidth: 5,
    markerHeight: 5,
    triangleHeight: 4,
    triangleOffset: 4,
    bolusStroke: 2,
    triangleSize: 6,
    carbPadding: 4,
    timezoneAware: false,
    tooltipHeightAddition: 3,
    tooltipPadding: 20
  }

  _.defaults(opts, defaults)

  const halfWidth = opts.width / 2
  const top = opts.yScale.range()[0]

  const xPosition = (d) => opts.xScale(d.epoch) - halfWidth

  const triangleLeft = (x) => x + halfWidth - opts.triangleOffset
  const triangleRight = (x) => x + halfWidth + opts.triangleOffset
  const triangleMiddle = (x) => x + halfWidth

  const underrideTriangle = (x, y) =>
    `${triangleLeft(x)},${y + opts.markerHeight/2} ` +
    `${triangleMiddle(x)},${y + opts.markerHeight/2 + opts.triangleHeight} ` +
    `${triangleRight(x)},${y + opts.markerHeight/2}`

  const overrideTriangle = (x, y) =>
    `${triangleLeft(x)},${y + opts.markerHeight/2} ` +
    `${triangleMiddle(x)},${y + opts.markerHeight/2 - opts.triangleHeight} ` +
    `${triangleRight(x)},${y + opts.markerHeight/2}`

  return {
    /**
     * Draw carbohydrate circles
     * @param {d3.Selection} carbs - D3 selection of carb elements
     */
    carb: function(carbs) {
      const xPos = (d) => xPosition(d) + halfWidth
      const yScaleCarbs = (ci) => opts.yScaleCarbs ? opts.yScaleCarbs(ci) : opts.r
      const yPos = opts.r + opts.carbPadding

      carbs.append('circle')
        .attr('cx', xPos)
        .attr('cy', yPos)
        .attr('r', (d) => yScaleCarbs(d.carbInput))
        .attr('stroke-width', 0)
        .attr('data-testid', 'carbs-meals')
        .attr('id', (d) => `carbs_circle_${d.id}`)
        .attr('class', 'd3-circle-carbs d3-carbs')

      carbs.append('text')
        .text((d) => d.carbInput)
        .attr('x', xPos)
        .attr('y', yPos)
        .attr('id', (d) => `carbs_text_${d.id}`)
        .attr('class', 'd3-carbs-text d3-carbs-text-meal')
    },

    /**
     * Draw bolus rectangles
     * @param {d3.Selection} boluses - D3 selection of bolus elements
     */
    bolus: function(boluses) {
      // delivered amount of bolus
      boluses.append('rect')
        .attr('x', (d) => xPosition(commonbolus.getBolus(d)))
        .attr('y', (d) => opts.yScale(commonbolus.getDelivered(d)))
        .attr('width', (d) => {
          if (bolusToLegend(d) === BolusType.correction) {
            return opts.width / 2
          }
          return opts.width
        })
        .attr('height', (d) => top - opts.yScale(commonbolus.getDelivered(d)))
        .attr('id', (d) => `bolus_${commonbolus.getBolus(d).id}`)
        .attr('class', (b) => bolusClass(b, 'd3-bolus d3-rect-bolus'))
    },

    /**
     * Draw undelivered bolus portions
     * @param {d3.Selection} undelivered - D3 selection of undelivered elements
     */
    undelivered: function(undelivered) {
      // draw color in the undelivered portion
      undelivered.append('rect')
        .attr('x', (d) => xPosition(commonbolus.getBolus(d)))
        .attr('y', (d) => opts.yScale(commonbolus.getProgrammed(d)))
        .attr('width', (d) => {
          if (bolusToLegend(d) === BolusType.correction) {
            return opts.width / 2
          }
          return opts.width
        })
        .attr('height', (b) => {
          const d = commonbolus.getDelivered(b)
          const m = commonbolus.getProgrammed(b)
          return opts.yScale(d) - opts.yScale(m)
        })
        .attr('id', (b) => `${b.type}_undelivered_${b.id}`)
        .attr('class', 'd3-rect-undelivered d3-bolus')
    },

    /**
     * Draw underride triangles
     * @param {d3.Selection} underride - D3 selection of underride elements
     */
    underride: function(underride) {
      underride.append('polygon')
        .attr('x', (d) => xPosition(commonbolus.getBolus(d)))
        .attr('y', (d) => opts.yScale(commonbolus.getProgrammed(d)))
        .attr('points', function(d) {
          const bolus = commonbolus.getBolus(d)
          return underrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getProgrammed(d)))
        })
        .attr('id', (d) => `bolus_ride_polygon_${commonbolus.getBolus(d).id}`)
        .attr('class', 'd3-polygon-ride d3-bolus')
    },

    /**
     * Draw override triangles
     * @param {d3.Selection} override - D3 selection of override elements
     */
    override: function(override) {
      override.append('polygon')
        .attr('x', (d) => xPosition(commonbolus.getBolus(d)))
        .attr('y', (d) => opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight)
        .attr('points', (d) => {
          const bolus = commonbolus.getBolus(d)
          return overrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight)
        })
        .attr('id', (d) => `bolus_override_polygon_${commonbolus.getBolus(d).id}`)
        .attr('class', 'd3-polygon-ride d3-bolus')
    },

    /**
     * Tooltip handling functions
     */
    tooltip: {
      /**
       * Add tooltip for bolus
       * @param {object} d - The data point
       * @param {HTMLElement} rect - The container element
       */
      add: function(d, rect) {
        if (_.get(opts, 'onBolusHover', false)) {
          opts.onBolusHover({
            data: d,
            rect: rect
          })
        }
      },

      /**
       * Remove tooltip for bolus
       * @param {object} d - The data point
       */
      remove: function(d) {
        if (_.get(opts, 'onBolusOut', false)) {
          opts.onBolusOut({
            data: d
          })
        }
      }
    }
  }
}

export default drawBolus
