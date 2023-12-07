/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2017, Tidepool Project
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
import * as bolusUtils from '../../utils/bolus'

/**
 * formatBolusRectPath
 * @param {Object} bolusEdges - object containing `left`, `right`, `top`, `bottom` edges
 *
 * @return {String} SVG path data string defining a bolus rectangle
 */
function formatBolusRectPath({ left, right, top, bottom }) {
  // PDFKit will not render path definitions with line breaks properly
  // do NOT forget to remove the newlines!
  return `
    M ${left},${bottom}
    L ${left},${top}
    L ${right},${top}
    L ${right},${bottom} Z
  `
}

/**
 * getBolusEdges
 * @param {Number} bolusWidth - width of a bolus (rendering-platform specific)
 * @param {Number} bolusCenter - scaled center of the bolus on the x (i.e., time) axis
 * @param {Number} bolusBottom - scaled bottom of the bolus on the y-axis
 * @param {Number} bolusHeight - scaled height of the bolus
 *
 * @return {Object} object containing `left`, `right`, `top`, `bottom` edges for a bolus rectangle
 */
export function getBolusEdges(bolusWidth, bolusCenter, bolusBottom, bolusHeight) {
  const halfWidth = bolusWidth / 2

  const leftX = bolusCenter - halfWidth
  const rightX = bolusCenter + halfWidth

  return {
    left: leftX,
    right: rightX,
    top: bolusHeight,
    bottom: bolusBottom
  }
}

/**
 * getBolusPaths
 * @param {Object} insulinEvent - a Tidepool wizard (with embedded bolus) or bolus datum
 * @param {Function} xScale - xScale preconfigured with domain & range
 * @param {Function} yScale - yScale preconfigured with domain & range
 * @param {Object} opts - bolus rendering options such as width
 *
 * @return {Array} paths - Array of Objects, each specifying component paths to draw a bolus
 */
export default function getBolusPaths(insulinEvent, xScale, yScale, {
  bolusWidth,
  interruptedLineThickness,
  triangleHeight
}) {
  const bolus = bolusUtils.getBolusFromInsulinEvent(insulinEvent)
  const paths = []

  const bolusBottom = yScale.range()[0]
  const bolusCenter = xScale(bolus.utc)

  const isNonTrivialUnderride = bolusUtils.isUnderride(insulinEvent) &&
    bolusUtils.getDelivered(insulinEvent)
  const isNonTrivialOverride = bolusUtils.isOverride(insulinEvent) &&
    bolusUtils.getDelivered(insulinEvent)

  // the backmost layer is any undelivered bolus insulin
  // (in the case of interruption/cancellation/suspension)
  // this is a (partial) port of tideline's js/plot/util/drawbolus.js: suspended
  if (bolusUtils.isInterruptedBolus(insulinEvent)) {
    const undeliveredY = yScale(bolusUtils.getMaxValue(insulinEvent))
    const edges = getBolusEdges(bolusWidth, bolusCenter, bolusBottom, undeliveredY)
    const { left, right } = edges
    const path = formatBolusRectPath(edges)

    paths.push({
      d: path,
      key: `undelivered-${bolus.id}`,
      type: 'undelivered'
    })

    const programmedY = yScale(bolusUtils.getProgrammed(insulinEvent))
    const deliveredY = yScale(bolusUtils.getDelivered(insulinEvent))
    // NB: JFC, Chrome uses a constant offset no matter the stroke-width :(((
    // TODO: test in different browsers and adjust
    const fractionStroke = 0.5

    // TODO: figure out how to make this agnostic to browser and render target
    paths.push({
      d: `
        M ${left + fractionStroke},${deliveredY}
        L ${left + fractionStroke},${programmedY + fractionStroke}
        L ${right - fractionStroke},${programmedY + fractionStroke}
        L ${right - fractionStroke},${deliveredY}
      `,
      key: `programmed-${bolus.id}`,
      type: 'programmed'
    })
  // the rectangle for undelivered includes an underride if the insulinEvent
  // was *both* an underride and interrupted/cancelled/suspended
  } else {
    // this is a (partial) port of tideline's js/plot/util/drawbolus.js: underride
    if (isNonTrivialUnderride) {
      const recommendedY = yScale(bolusUtils.getRecommended(insulinEvent))
      const path = formatBolusRectPath(
        getBolusEdges(bolusWidth, bolusCenter, bolusBottom, recommendedY)
      )

      paths.push({
        d: path,
        key: `underride-${insulinEvent.id}`,
        type: 'underride'
      })
    }
  }

  // this is a port of tideline's js/plot/util/drawbolus.js: bolus
  if (bolusUtils.getDelivered(insulinEvent) || bolusUtils.getProgrammed((insulinEvent))) {
    const maxY = yScale(bolusUtils.getDelivered(insulinEvent))
    const path = formatBolusRectPath(
      getBolusEdges(bolusWidth, bolusCenter, bolusBottom, maxY)
    )

    paths.push({
      d: path,
      key: `delivered-${bolus.id}`,
      type: 'delivered'
    })
  }

  // this is a (partial) port of tideline's js/plot/util/drawbolus.js: underride
  // it does the triangle for an underride of a calculator recommendation
  if (isNonTrivialUnderride) {
    const programmedY = yScale(bolusUtils.getProgrammed(insulinEvent))
    const edges = getBolusEdges(
      bolusWidth, bolusCenter, bolusBottom, programmedY,
    )
    const { left, right } = edges

    paths.push({
      d: `
        M ${left},${programmedY}
        L ${left + bolusWidth / 2},${programmedY + triangleHeight}
        L ${right},${programmedY} Z
      `,
      key: `underrideTriangle-${insulinEvent.id}`,
      type: 'underrideTriangle'
    })
  }

  // this is a (partial) port of tideline's js/plot/util/drawbolus.js: override
  // it does the triangle for an override of a calculator recommendation
  if (isNonTrivialOverride) {
    const recommendedY = yScale(bolusUtils.getRecommended(insulinEvent))
    const edges = getBolusEdges(
      bolusWidth, bolusCenter, bolusBottom, recommendedY,
    )
    const { left, right } = edges

    paths.push({
      d: `
        M ${left},${recommendedY}
        L ${left + bolusWidth / 2},${recommendedY - triangleHeight}
        L ${right},${recommendedY} Z
      `,
      key: `overrideTriangle-${insulinEvent.id}`,
      type: 'overrideTriangle'
    })
  }

  // the red line indicating interruption/cancellation/suspension appears on top
  // this is a (partial) port of tideline's js/plot/util/drawbolus.js: suspended
  if (bolusUtils.isInterruptedBolus(insulinEvent)) {
    const bottomOfInterruptedLine = yScale(bolusUtils.getDelivered(insulinEvent))
    const path = formatBolusRectPath(
      getBolusEdges(
        bolusWidth,
        bolusCenter,
        bottomOfInterruptedLine,
        bottomOfInterruptedLine + interruptedLineThickness,
      )
    )

    paths.push({
      d: path,
      key: `interrupted-${bolus.id}`,
      type: 'interrupted'
    })
  }

  const formattedPaths = _.forEach(paths, (path) => {
    const pathCopy = path
    pathCopy.d = path.d.replace(/\n/g, '').replace(/\s\s+/g, ' ')
    return pathCopy
  })

  return formattedPaths
}
