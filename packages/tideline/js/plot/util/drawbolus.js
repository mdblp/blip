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
import { BolusSubtype, DatumType, Prescriptor, WizardInputMealSource } from 'medical-domain'

const BolusTypes = {
  meal: 1,
  correction: 2,
  manual: 3,
  pen: 4,
  umm: 5
}

/**
 * @param {object} b The bolus or wizard
 * @returns {number} The type of bolus
 */
function bolusToLegend(b) {
  if (b.type === DatumType.Wizard) {
    if (b?.inputMeal?.source === WizardInputMealSource.Umm) {
      return BolusTypes.umm
    }
    return BolusTypes.meal
  }
  const bolus = commonbolus.getBolus(b)
  if (bolus.subType === BolusSubtype.Pen) {
    return BolusTypes.pen
  }
  if (bolus.prescriptor === Prescriptor.Manual) {
    return BolusTypes.manual
  }
  if (bolus.subType === BolusSubtype.Biphasic) {
    return BolusTypes.meal
  }
  return BolusTypes.correction
}

/**
 * @param {object} b The bolus or wizard
 * @param {string} baseClass default/prepend class
 * @return {string} The SVG class
 */
function bolusClass(b, baseClass) {
  switch (bolusToLegend(b)) {
    case BolusTypes.manual:
      return `${baseClass} d3-bolus-manual`
    case BolusTypes.meal:
      return `${baseClass} d3-bolus-meal`
    case BolusTypes.correction:
      return `${baseClass} d3-bolus-correction`
    case BolusTypes.pen:
      return `${baseClass} d3-bolus-pen`
  }
  return baseClass
}

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

  const triangleLeft = (x) => { return x + halfWidth - opts.triangleOffset }
  const triangleRight = (x) => { return x + halfWidth + opts.triangleOffset }
  const triangleMiddle = (x) => { return x + halfWidth }

  const underrideTriangle = (x, y) =>
    triangleLeft(x) + ',' + (y + opts.markerHeight/2) + ' ' +
    triangleMiddle(x) + ',' + (y + opts.markerHeight/2 + opts.triangleHeight) + ' ' +
    triangleRight(x) + ',' + (y + opts.markerHeight/2)

  const overrideTriangle = (x, y) =>
    triangleLeft(x) + ',' + (y + opts.markerHeight/2) + ' ' +
    triangleMiddle(x) + ',' + (y + opts.markerHeight/2 - opts.triangleHeight) + ' ' +
    triangleRight(x) + ',' + (y + opts.markerHeight/2)

  return {
    carb: function(carbs) {
      const xPos = (d) => xPosition(d) + halfWidth
      const yScaleCarbs = (ci) => opts.yScaleCarbs ? opts.yScaleCarbs(ci) : opts.r
      const yPos = (d) => {
        const r = yScaleCarbs(d.carbInput)
        const bolusValue = d.bolus ? commonbolus.getProgrammed(d) : 0
        return opts.yScale(bolusValue) - r - (bolusValue ? opts.carbPadding : 0)
      }
      const carbCircleClass = 'd3-circle-carbs d3-carbs'
      const carbTextClass = 'd3-carbs-text d3-carbs-text-meal'
      carbs.append('circle')
        .attr({
          'cx': xPos,
          'cy': yPos,
          'r': (d) => yScaleCarbs(d.carbInput),
          'stroke-width': 0,
          'data-testid': 'carbs-meals',
          'class': carbCircleClass,
          'id': (d) => `carbs_circle_${d.id}`
        })

      carbs.append('text')
        .text((d) => d.carbInput)
        .attr({
          x: xPos,
          y: yPos,
          class: carbTextClass,
          id: (d) => `carbs_text_${d.id}`
        })
    },
    bolus: function(boluses) {
      // delivered amount of bolus
      boluses.append('rect')
        .attr({
          x: (d) => xPosition(commonbolus.getBolus(d)),
          y: (d) => opts.yScale(commonbolus.getDelivered(d)),
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.correction) {
              return opts.width / 2
            }
            return opts.width
          },
          height: (d) => top - opts.yScale(commonbolus.getDelivered(d)),
          class: (b) => bolusClass(b, 'd3-bolus d3-rect-bolus'),
          id: (d) => `bolus_${commonbolus.getBolus(d).id}`
        })
    },
    undelivered: function(undelivered) {
      // draw color in the undelivered portion
      undelivered.append('rect')
        .attr({
          x: (d) => xPosition(commonbolus.getBolus(d)),
          y: (d) => opts.yScale(commonbolus.getProgrammed(d)),
          width: (d) => {
            if (bolusToLegend(d) === BolusTypes.correction) {
              return opts.width / 2
            }
            return opts.width
          },
          height: (b) => {
            const d = commonbolus.getDelivered(b)
            const m = commonbolus.getProgrammed(b)
            return opts.yScale(d) - opts.yScale(m)
          },
          class: 'd3-rect-undelivered d3-bolus',
          id: (b) => `${b.type}_undelivered_${b.id}`
        })
    },
    underride: function(underride) {
      underride.append('polygon')
        .attr({
          x: (d) => xPosition(commonbolus.getBolus(d)),
          y: (d) => opts.yScale(commonbolus.getProgrammed(d)),
          points: function(d) {
            const bolus = commonbolus.getBolus(d)
            return underrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getProgrammed(d)))
          },
          class: 'd3-polygon-ride d3-bolus',
          id: (d) => `bolus_ride_polygon_${commonbolus.getBolus(d).id}`
        })
    },
    override: function(override) {
      override.append('polygon')
        .attr({
          x: (d) => xPosition(commonbolus.getBolus(d)),
          y: function(d) {
            return opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight
          },
          points: function(d) {
            const bolus = commonbolus.getBolus(d)
            return overrideTriangle(xPosition(bolus), opts.yScale(commonbolus.getRecommended(d)) - opts.markerHeight)
          },
          class: 'd3-polygon-ride d3-bolus',
          id: (d) => `bolus_override_polygon_${commonbolus.getBolus(d).id}`
        })
    },
    tooltip: {
      add: function(d, rect) {
        if (_.get(opts, 'onBolusHover', false)) {
          opts.onBolusHover({
            data: d,
            rect: rect
          })
        }
      },
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
