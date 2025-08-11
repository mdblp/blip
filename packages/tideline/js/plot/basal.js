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
import i18next from 'i18next'
import moment from 'moment-timezone'
import * as d3 from 'd3'

import * as constants from '../data/util/constants'
import format from '../data/util/format'

const defaults = {
  opacity: 0.6,
  opacityDelta: 0.2,
  pathStroke: 1.5,
  tooltipPadding: 20,
  defaultSource: 'default'
}

/**
 * Get the basal path group type
 * @param {Object} datum - Single basal datum
 * @returns {String} The path group type ('automated' or 'manual')
 */
function getBasalPathGroupType(datum) {
  return datum.deliveryType === 'automated' ? 'automated' : 'manual'
}

/**
 * Group basal segments by delivery type
 * @param {Array} basals - Array of preprocessed Tidepool basal objects
 * @returns {Array} Groups of alternating 'automated' and 'manual' datums
 */
function getBasalPathGroups(basals) {
  const basalPathGroups = []
  let currentPathType = ''
  _.forEach(basals, datum => {
    const pathType = getBasalPathGroupType(datum)
    if (pathType !== currentPathType) {
      currentPathType = pathType
      basalPathGroups.push([])
    }
    _.last(basalPathGroups).push(datum)
  })

  return basalPathGroups
}

/**
 * Plot basal insulin data
 * @param {Object} pool - The pool to render into
 * @param {Object} opts - Configuration options
 * @returns {Function} - The basal plotting function
 */
function plotBasal(pool, opts = defaults) {
  const t = i18next.t.bind(i18next)

  opts = _.defaults(opts, defaults)

  const mainGroup = pool.parent()

  /**
   * Get the scheduled or automated delivery that was suppressed
   * @param {Object} supp - The suppressed data
   * @returns {Object|undefined} The suppressed scheduled or automated delivery
   */
  function getDeliverySuppressed(supp) {
    if (_.includes(['scheduled', 'automated'], supp.deliveryType)) {
      return supp
    } else if (supp.suppressed) {
      return getDeliverySuppressed(supp.suppressed)
    }
    return undefined
  }

  /**
   * Get undelivered basal segments
   * @param {Array} data - Array of basal data
   * @returns {Array} Undelivered segments
   */
  function getUndelivereds(data) {
    const undelivereds = []

    for (let i = 0; i < data.length; ++i) {
      const d = data[i]
      if (d.suppressed) {
        const scheduled = getDeliverySuppressed(d.suppressed)
        if (scheduled) {
          undelivereds.push(scheduled)
        }
      }
    }
    return undelivereds
  }

  function basal(selection) {
    opts.xScale = pool.xScale().copy()

    selection.each(function(data) {
      const currentData = _.filter(data, (d) => d.type === 'basal' && d.duration > 0)
      d3.select(this).selectAll('g.d3-basal-path-group').remove()
      if (currentData.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-basal-group').remove()
        return
      }

      // Select all basal groups and bind data
      const basalSegments = d3.select(this)
        .selectAll('.d3-basal-group')
        .data(currentData, (d) => d.id)

      // Handle exit selection first
      basalSegments.exit().remove()

      // Create new basal groups for entering data
      const basalSegmentGroups = basalSegments.enter()
        .append('g')
        .classed('d3-basal-group', true)
        .attr('id', (d) => `basal_group_${d.id}`)

      // Add rectangles to non-zero rate basal segments
      const nonZero = basalSegmentGroups.filter((d) => d.rate > 0)
      basal.addRectToPool(nonZero)

      // Add invisible hover target rectangles for all basal segments
      basal.addRectToPool(basalSegmentGroups, true)

      // Split data into groups by delivery type for path generation
      const basalPathGroups = getBasalPathGroups(currentData)
      const renderGroupMarkers = basalPathGroups.length > 1

      // Create or select the path group container
      const basalPathsGroup = selection
        .selectAll('.d3-basal-path-group')
        .data(['d3-basal-path-group'])
        .join('g')
        .attr('class', 'd3-basal-path-group')

      // Create paths for each delivery type group
      _.forEach(basalPathGroups, (data) => {
        const id = data[0].id
        const pathType = getBasalPathGroupType(data[0])
        const pathClass = `d3-basal d3-path-basal d3-path-basal-${pathType}-${id}`

        const path = basalPathsGroup
          .selectAll(`.${pathClass.replace(/ /g, '.')}`)
          .data([pathClass])
          .join('path')
          .attr('class', d => d)

        // Update path data
        basal.updatePath(path, data)
      })

      // Handle undelivered path separately
      const undeliveredPathClass = 'd3-basal d3-path-basal d3-path-basal-undelivered'
      const undeliveredPath = basalPathsGroup
        .selectAll(`.${undeliveredPathClass.replace(/ /g, '.')}`)
        .data([undeliveredPathClass])
        .join('path')
        .attr('class', d => d)

      // Update undelivered path data
      basal.updatePath(undeliveredPath, getUndelivereds(currentData), true)

      // Set up tooltip event handlers
      basalSegmentGroups
        .on('mouseover', function(event, d) {
          basal.addTooltip(d, renderGroupMarkers)
          d3.select(this).selectAll('.d3-basal.d3-rect-basal')
            .attr('opacity', opts.opacity + opts.opacityDelta)
        })
        .on('mouseout', function(event, d) {
          const id = d3.select(this).attr('id').replace('basal_group_', 'tooltip_')
          mainGroup.select(`#${id}`).remove()

          if (d.deliveryType === 'temp' && d.rate > 0) {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', opts.opacity - opts.opacityDelta)
          } else {
            d3.select(this).selectAll('.d3-basal.d3-rect-basal')
              .attr('opacity', opts.opacity)
          }
        })
    })
  }

  /**
   * Add rectangle to pool
   * @param {d3.Selection} selection - The D3 selection to add rectangles to
   * @param {boolean} invisible - Whether to create invisible hover target rectangles
   */
  basal.addRectToPool = function(selection, invisible) {
    opts.xScale = pool.xScale().copy()

    const heightFn = invisible ? basal.invisibleRectHeight : basal.height
    const yPosFn = invisible ? basal.invisibleRectYPosition : basal.yPosition

    selection.append('rect')
      .attr('id', (d) => `basal_element_${invisible ? 'invisible' : 'visible'}_${d.id}`)
      .attr('x', basal.xPosition)
      .attr('y', yPosFn)
      .attr('opacity', (d) => {
        if (invisible) {
          return null
        }
        if (d.deliveryType === 'temp' && d.rate > 0) {
          return opts.opacity - opts.opacityDelta
        }
        return opts.opacity
      })
      .attr('width', basal.width)
      .attr('height', heightFn)
      .attr('class', (d) => invisible ?
        'd3-basal d3-basal-invisible' :
        `d3-basal d3-rect-basal d3-basal-${d.deliveryType}`)
  }

  /**
   * Update path with new data
   * @param {d3.Selection} selection - The path selection to update
   * @param {Array} data - The data to visualize
   * @param {boolean} isUndelivered - Whether this is undelivered data
   */
  basal.updatePath = function(selection, data, isUndelivered) {
    opts.xScale = pool.xScale().copy()

    const pathDef = basal.pathData(data, isUndelivered)

    if (pathDef !== '') {
      selection.attr('d', pathDef)
    }
  }

  /**
   * Generate SVG path data string
   * @param {Array} data - The data to visualize
   * @param {boolean} isUndelivered - Whether this is undelivered data
   * @returns {string} The SVG path data string
   */
  basal.pathData = function(data, isUndelivered) {
    opts.xScale = pool.xScale().copy()

    function stringCoords(datum) {
      return basal.xPosition(datum) + ',' + basal.pathYPosition(datum) + ' '
    }

    let d = ''
    for (let i = 0; i < data.length; ++i) {
      if (i === 0) {
        // start with a moveto command
        d += 'M' + stringCoords(data[i])
      }
      else if (isUndelivered && data[i].deliveryType === 'automated') {
        // For automated suppressed delivery, we always render at the baseline
        const suppressed = _.clone(data[i])
        suppressed.rate = 0
        d += 'M' + stringCoords(suppressed)
      }
      else if (data[i].normalTime === data[i - 1].normalEnd) {
        // if segment is contiguous with previous, draw a vertical line connecting their values
        d += 'V' + basal.pathYPosition(data[i]) + ' '
      }
      // TODO: maybe a robust check for a gap in time here instead of just !==?
      else if (data[i].normalTime !== data[i - 1].normalEnd) {
        // if segment is not contiguous with previous, skip to beginning of segment
        d += 'M' + stringCoords(data[i])
      }
      // always add a horizontal line corresponding to current segment
      d += 'H' + basal.segmentEndXPosition(data[i]) + ' '
    }
    return d
  }

  /**
   * Calculate x position for a data point
   * @param {Object} d - The data point
   * @returns {number} The x position
   */
  basal.xPosition = function(d) {
    return opts.xScale(d.epoch)
  }

  /**
   * Calculate end x position for a segment
   * @param {Object} d - The data point
   * @returns {number} The end x position
   */
  basal.segmentEndXPosition = function(d) {
    return opts.xScale(d.epochEnd)
  }

  /**
   * Calculate tooltip x position (centered in segment)
   * @param {Object} d - The data point
   * @returns {number} The tooltip x position
   */
  basal.tooltipXPosition = function(d) {
    return basal.xPosition(d) + (basal.segmentEndXPosition(d) - basal.xPosition(d))/2
  }

  /**
   * Calculate y position for a data point
   * @param {Object} d - The data point
   * @returns {number} The y position
   */
  basal.yPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.rate)
  }

  /**
   * Calculate path y position (adjusted for stroke width)
   * @param {Object} d - The data point
   * @returns {number} The path y position
   */
  basal.pathYPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.rate) - opts.pathStroke/2
  }

  /**
   * Calculate y position for invisible rectangles
   * @returns {number} The y position
   */
  basal.invisibleRectYPosition = _.constant(0)

  /**
   * Calculate width for a segment
   * @param {Object} d - The data point
   * @returns {number} The width
   */
  basal.width = function(d) {
    return opts.xScale(d.epochEnd) - opts.xScale(d.epoch)
  }

  /**
   * Calculate height for a segment
   * @param {Object} d - The data point
   * @returns {number} The height
   */
  basal.height = function(d) {
    const yScale = pool.yScale()
    return pool.height() - yScale(d.rate)
  }

  /**
   * Calculate height for invisible rectangles
   * @returns {number} The height
   */
  basal.invisibleRectHeight = function(/* d */) {
    return pool.height()
  }

  /**
   * Format rate string for tooltip
   * @param {Object} d - The data point
   * @param {string} cssClass - CSS class for units
   * @returns {string} Formatted rate string
   */
  basal.rateString = function(d, cssClass) {
    return format.tooltipValue(d.rate) + ` <span class="${cssClass}">${t('U/hr')}</span>`
  }

  /**
   * Format temp percentage for tooltip
   * @param {Object} d - The data point
   * @returns {string} Formatted percentage or rate
   */
  basal.tempPercentage = function(d) {
    if (typeof d.percent === 'number') {
      return format.percentage(d.percent)
    }
    return format.tooltipValue(d.rate) + ` <span class="plain">${t('U/hr')}</span>`
  }

  /**
   * Generate tooltip HTML content
   * @param {d3.Selection} group - The tooltip group
   * @param {Object} datum - The data point
   * @param {boolean} showScheduledLabel - Whether to show scheduled label
   */
  basal.tooltipHtml = function(group, datum, showScheduledLabel) {
    const { AUTOMATED_BASAL_LABELS, SCHEDULED_BASAL_LABELS } = constants
    const H_MM_A_FORMAT = constants.dateTimeFormats.H_MM_A_FORMAT
    /** @type {string} */
    const source = _.get(datum, 'source', opts.defaultSource)

    // Clear any existing content
    group.selectAll('*').remove()

    switch (datum.deliveryType) {
      case 'temp':
        group.append('p')
          .append('span')
          .html(`<span class="plain">${t('Temp basal of')}</span> ` + basal.tempPercentage(datum))

        if (datum.suppressed) {
          const suppressedDelivery = getDeliverySuppressed(datum.suppressed)
          if (suppressedDelivery) {
            group.append('p')
              .append('span')
              .attr('class', 'secondary')
              .html(basal.rateString(suppressedDelivery, 'secondary') + ' ' + t('scheduled'))
          }
        }
        break

      case 'suspend':
        group.append('p')
          .append('span')
          .html('<span class="plain">Pump suspended</span>')

        if (datum.suppressed) {
          const suppressedDelivery = getDeliverySuppressed(datum.suppressed)
          if (suppressedDelivery) {
            group.append('p')
              .append('span')
              .attr('class', 'secondary')
              .html(basal.rateString(suppressedDelivery, 'secondary') + ' ' + t('scheduled'))
          }
        }
        break

      case 'automated':
        // eslint-disable-next-line no-case-declarations
        const automatedLabel = _.get(AUTOMATED_BASAL_LABELS, source, AUTOMATED_BASAL_LABELS.default)
        group.append('p')
          .append('span')
          .html(`<span class="plain muted">${automatedLabel}:</span> ` + basal.rateString(datum, 'plain'))
        break

      default: {
        const scheduledLabel = showScheduledLabel
          ? `<span class="plain muted">${_.get(SCHEDULED_BASAL_LABELS, source, SCHEDULED_BASAL_LABELS.default)}:</span> `
          : ''
        group.append('p')
          .append('span')
          .html(scheduledLabel + basal.rateString(datum, 'plain'))
        break
      }
    }

    // Add time range information
    const mBegin = moment.tz(datum.epoch, datum.timezone)
    const begin = mBegin.format(H_MM_A_FORMAT)
    const end = moment.tz(datum.epochEnd, datum.timezone).format(H_MM_A_FORMAT)
    const timeRangeHtml = `<span class="fromto">${t('from')}</span> ${begin} <span class="fromto">${t('to')}</span> ${end}`

    group.append('p')
      .append('span')
      .attr('class', 'secondary')
      .html(timeRangeHtml)
  }

  /**
   * Add tooltip to display basal information
   * @param {Object} d - The data point
   * @param {boolean} showSheduledLabel - Whether to show scheduled label
   */
  basal.addTooltip = function(d, showSheduledLabel) {
    const datum = _.clone(d)
    datum.type = 'basal'
    const tooltips = pool.tooltips()
    const cssClass = (d.deliveryType === 'temp' || d.deliveryType === 'suspend') ? 'd3-basal-undelivered' : ''

    const res = tooltips.addForeignObjTooltip({
      cssClass: cssClass,
      datum: datum,
      shape: 'basal',
      xPosition: basal.tooltipXPosition,
      yPosition: _.constant(0)
    })

    const foGroup = res.foGroup
    basal.tooltipHtml(foGroup, d, showSheduledLabel)

    const dims = tooltips.foreignObjDimensions(foGroup)
    // foGroup.node().parentNode is the <foreignObject> itself
    // because foGroup is actually the top-level <xhtml:div> element
    tooltips.anchorForeignObj(d3.select(foGroup.node().parentNode), {
      w: dims.width + opts.tooltipPadding,
      h: dims.height,
      shape: 'basal',
      edge: res.edge
    })
  }

  return basal
}

export default plotBasal
