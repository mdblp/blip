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
 * getBasalPathGroupType
 * @param {Object} basal - single basal datum
 * @return {String} the path group type
 */
function getBasalPathGroupType(datum) {
  return datum.deliveryType === 'automated' ? 'automated' : 'manual'
}

/**
 * getBasalPathGroups
 * @param {Array} basals - Array of preprocessed Tidepool basal objects
 * @return {Array} groups of alternating 'automated' and 'manual' datums
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



function plotBasal(pool, opts = defaults) {
  const d3 = window.d3

  const t = i18next.t.bind(i18next)

  opts = _.defaults(opts, defaults)

  const mainGroup = pool.parent()

  function getDeliverySuppressed(supp) {
    if (_.includes(['scheduled', 'automated'], supp.deliveryType)) {
      return supp
    } else if (supp.suppressed) {
      return getDeliverySuppressed(supp.suppressed)
    }
    return undefined
  }

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

      const basalSegments = d3.select(this)
        .selectAll('.d3-basal-group')
        .data(currentData, (d) => d.id)

      const basalSegmentGroups = basalSegments.enter()
        .append('g')
        .attr({
          class: 'd3-basal-group',
          id: (d) => `basal_group_${d.id}`
        })

      const nonZero = basalSegmentGroups.filter((d) => d.rate > 0)
      basal.addRectToPool(nonZero)

      // add invisible rects as hover targets for all basals
      basal.addRectToPool(basalSegmentGroups, true)

      // split data into groups when delivery type changes to generate unique path elements for each group
      const basalPathGroups = getBasalPathGroups(currentData)
      const renderGroupMarkers = basalPathGroups.length > 1

      const basalPathsGroup = selection
        .selectAll('.d3-basal-path-group')
        .data(['d3-basal-path-group'])

      basalPathsGroup
        .enter()
        .append('g')
        .attr('class', 'd3-basal-path-group')

      _.forEach(basalPathGroups, (data /*, index */) => {
        const id = data[0].id
        const pathType = getBasalPathGroupType(data[0])

        const paths = basalPathsGroup
          .selectAll(`.d3-basal.d3-path-basal.d3-path-basal-${pathType}-${id}`)
          .data([`d3-basal d3-path-basal d3-path-basal-${pathType}-${id}`])

        paths
          .enter()
          .append('path')
          .attr({
            class: (d) => d
          })

        paths.exit().remove()

        // d3.selects are OK here because `paths` is a chained selection
        const path = d3.select(paths[0][0])
        basal.updatePath(path, data)
      })

      const undeliveredPaths = basalPathsGroup
        .selectAll('.d3-basal.d3-path-basal.d3-path-basal-undelivered')
        .data(['d3-basal d3-path-basal d3-path-basal-undelivered'])

      undeliveredPaths
        .enter()
        .append('path')
        .attr({
          class: (d) => d
        })

      const undeliveredPath = d3.select(undeliveredPaths[0][0])
      basal.updatePath(undeliveredPath, getUndelivereds(currentData), true)

      basalSegments.exit().remove()

      // tooltips
      basalSegmentGroups.on('mouseover', function() {
        basal.addTooltip(d3.select(this).datum(), renderGroupMarkers)
        d3.select(this).selectAll('.d3-basal.d3-rect-basal').attr('opacity', opts.opacity + opts.opacityDelta)
      })
      basalSegmentGroups.on('mouseout', function() {
        const id = d3.select(this).attr('id').replace('basal_group_', 'tooltip_')
        mainGroup.select(`#${id}`).remove()
        const datum = d3.select(this).datum()
        if (datum.deliveryType === 'temp' && datum.rate > 0) {
          d3.select(this).selectAll('.d3-basal.d3-rect-basal').attr('opacity', opts.opacity - opts.opacityDelta)
        } else {
          d3.select(this).selectAll('.d3-basal.d3-rect-basal').attr('opacity', opts.opacity)
        }
      })
    })
  }

  basal.addRectToPool = function(selection, invisible) {
    opts.xScale = pool.xScale().copy()

    var heightFn = invisible ? basal.invisibleRectHeight : basal.height
    var yPosFn = invisible ? basal.invisibleRectYPosition : basal.yPosition

    selection.append('rect')
      .attr({
        id: (d) => `basal_element_${invisible ? 'invisible' : 'visible'}_${d.id}`,
        x: basal.xPosition,
        y: yPosFn,
        opacity: (d) => {
          if (invisible) {
            return null
          }
          if (d.deliveryType === 'temp' && d.rate > 0) {
            return opts.opacity - opts.opacityDelta
          }
          return opts.opacity
        },
        width: basal.width,
        height: heightFn,
        class: (d) => invisible ? 'd3-basal d3-basal-invisible' : `d3-basal d3-rect-basal d3-basal-${d.deliveryType}`
      })
  }

  basal.updatePath = function(selection, data, isUndelivered) {
    opts.xScale = pool.xScale().copy()

    var pathDef = basal.pathData(data, isUndelivered)

    if (pathDef !== '') {
      selection.attr({
        d: pathDef
      })
    }
  }

  basal.pathData = function(data, isUndelivered) {
    opts.xScale = pool.xScale().copy()

    function stringCoords(datum) {
      return basal.xPosition(datum) + ',' + basal.pathYPosition(datum) + ' '
    }

    var d = ''
    for (var i = 0; i < data.length; ++i) {
      if (i === 0) {
        // start with a moveto command
        d += 'M' + stringCoords(data[i])
      }
      else if (isUndelivered && data[i].deliveryType === 'automated') {
        // For automated suppressed delivery, we always render at the baseline
        var suppressed = _.clone(data[i])
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

  basal.xPosition = function(d) {
    return opts.xScale(d.epoch)
  }

  basal.segmentEndXPosition = function(d) {
    return opts.xScale(d.epochEnd)
  }

  basal.tooltipXPosition = function(d) {
    return basal.xPosition(d) + (basal.segmentEndXPosition(d) - basal.xPosition(d))/2
  }

  basal.yPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.rate)
  }

  basal.pathYPosition = function(d) {
    const yScale = pool.yScale()
    return yScale(d.rate) - opts.pathStroke/2
  }

  basal.invisibleRectYPosition = _.constant(0)

  basal.width = function(d) {
    return opts.xScale(d.epochEnd) - opts.xScale(d.epoch)
  }

  basal.height = function(d) {
    const yScale = pool.yScale()
    return pool.height() - yScale(d.rate)
  }

  basal.invisibleRectHeight = function(/* d */) {
    return pool.height()
  }

  basal.rateString = function(d, cssClass) {
    return format.tooltipValue(d.rate) + ` <span class="${cssClass}">${t('U/hr')}</span>`
  }

  basal.tempPercentage = function(d) {
    if (typeof d.percent === 'number') {
      return format.percentage(d.percent)
    }
    return format.tooltipValue(d.rate) + ` <span class="plain">${t('U/hr')}</span>`
  }

  basal.tooltipHtml = function(group, datum, showSheduledLabel) {
    const { AUTOMATED_BASAL_LABELS, SCHEDULED_BASAL_LABELS } = constants
    const H_MM_A_FORMAT = constants.dateTimeFormats.H_MM_A_FORMAT
    /** @type {string} */
    const source = _.get(datum, 'source', opts.defaultSource)
    switch (datum.deliveryType) {
      case 'temp':
        group.append('p')
          .append('span')
          .html(`<span class="plain">${t('Temp basal of')}</span> ` + basal.tempPercentage(datum))
        if (datum.suppressed) {
          group.append('p')
            .append('span')
            .attr('class', 'secondary')
            .html(basal.rateString(getDeliverySuppressed(datum.suppressed), 'secondary') + ' '+ t('scheduled'))
        }
        break
      case 'suspend':
        group.append('p')
          .append('span')
          .html('<span class="plain">Pump suspended</span>')
        if (datum.suppressed) {
          group.append('p')
            .append('span')
            .attr('class', 'secondary')
            .html(basal.rateString(getDeliverySuppressed(datum.suppressed), 'secondary') + ' '+ t('scheduled'))
        }
        break
      case 'automated':
        group.append('p')
          .append('span')
          .html('<span class="plain muted">' + _.get(AUTOMATED_BASAL_LABELS, source, AUTOMATED_BASAL_LABELS.default) + ':</span> ' +
          basal.rateString(datum, 'plain'))
        break
      default: {
        const label = showSheduledLabel ? '<span class="plain muted">' + _.get(SCHEDULED_BASAL_LABELS, source, SCHEDULED_BASAL_LABELS.default) + ':</span> ' : ''
        group.append('p')
          .append('span')
          .html(label + basal.rateString(datum, 'plain'))
      }}

    const mBegin = moment.tz(datum.epoch, datum.timezone)
    const begin = mBegin.format(H_MM_A_FORMAT)
    const end = moment.tz(datum.epochEnd, datum.timezone).format(H_MM_A_FORMAT)
    const html = `<span class="fromto">${t('from')}</span> ${begin} <span class="fromto">${t('to')}</span> ${end}`
    group.append('p')
      .append('span')
      .attr('class', 'secondary')
      .html(html)
  }

  basal.addTooltip = function(d, showSheduledLabel) {
    var datum = _.clone(d)
    datum.type = 'basal'
    var tooltips = pool.tooltips()
    var cssClass = (d.deliveryType === 'temp' || d.deliveryType === 'suspend') ? 'd3-basal-undelivered' : ''
    var res = tooltips.addForeignObjTooltip({
      cssClass: cssClass,
      datum: datum,
      shape: 'basal',
      xPosition: basal.tooltipXPosition,
      yPosition: _.constant(0)
    })
    var foGroup = res.foGroup
    basal.tooltipHtml(foGroup, d, showSheduledLabel)
    var dims = tooltips.foreignObjDimensions(foGroup)
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
