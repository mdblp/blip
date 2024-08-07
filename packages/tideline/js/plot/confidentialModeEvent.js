/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2020, Diabeloop
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
import i18next from 'i18next'
import _ from 'lodash'

import lockIcon from 'lock.svg'
import utils from './util/utils'

/**
 * @typedef {import("../tidelinedata").default} MedicalDataService
 * @typedef {import("../tidelinedata").Datum} Datum
 * @typedef {import("../pool").default} Pool
 */

/**
 *
 * @param {Pool} pool
 * @param {{ tidelineData: MedicalDataService }} opts
 * @returns
 */
function plotConfidentialModeEvent(pool, opts) {
  const d3 = window.d3
  const t = i18next.t.bind(i18next)
  const height = pool.height() - 2
  const imageSize = 24
  // 3 hours max for the tooltip
  const maxSizeWithTooltip = 1000 * 60 * 60 * 3

  opts.xScale = pool.xScale().copy()
  const poolId = pool.id()

  const xPos = (d) => utils.xPos(d, opts)
  const calculateWidth = (d) => utils.calculateWidth(d, opts)
  const displayTooltip = (d) => (utils.getDuration(d).duration < maxSizeWithTooltip)

  function confidentialModeEvent(selection) {
    selection.each(function () {
      const confidentialEvents = pool.filterDataForRender(opts.tidelineData.medicalData.confidentialModes)

      if (confidentialEvents.length < 1) {
        d3.select(this).selectAll('g.d3-confidential-group').remove()
        return
      }

      const events = d3.select(this)
        .selectAll('g.d3-confidential-group')
        .data(confidentialEvents, (d) => d.id)

      const backGroup = events.enter()
        .append('g')
        .attr({
          'class': 'd3-confidential-group',
          'id': (d) => `${poolId}_confidential_group_${d.id}`,
          'data-testid': (d) => `${poolId}_confidential_group_${d.id}`
        })
      backGroup.append('rect')
        .attr({
          x: xPos,
          y: 1,
          width: calculateWidth,
          height,
          class: 'd3-back-confidential d3-confidential',
          id: (d) => `${poolId}_confidential_back_${d.id}`
        })
      backGroup.append('image')
        .attr({
          'x': (d) => xPos(d) + (calculateWidth(d) - imageSize) / 2,
          'y': (height - imageSize) / 2,
          'id': (d) => `${poolId}_confidential_lock_${d.id}`,
          'xlink:href': lockIcon
        })

      if (!opts.hideLabel) {
        // display the text when no tooltip
        backGroup.filter((d) => !displayTooltip(d))
          .append('text')
          .text(t('Confidential mode'))
          .attr({
            x: (d) => xPos(d) + (calculateWidth(d)) / 2,
            y: ((height - imageSize) / 2) + imageSize + 5,
            class: 'd3-confidential-text',
            id: (d) => `${poolId}_confidential_lock_${d.id}`
          })
      }

      events.exit().remove()

      // tooltips
      selection.selectAll('.d3-confidential-group').on('mouseover', function (d) {
        const {duration} = utils.getDuration(d)
        if ( duration < maxSizeWithTooltip) {
          confidentialModeEvent.addTooltip(d, utils.getTooltipContainer(this))
        }
      })

      selection.selectAll('.d3-confidential-group').on('mouseout', function (d) {
        confidentialModeEvent.remove(d)
      })
    })
  }

  confidentialModeEvent.addTooltip = function addTooltip(d, rect) {
    if (_.get(opts, 'onConfidentialHover', false)) {
      opts.onConfidentialHover({
        data: d,
        rect: rect
      })
    }
  }

  confidentialModeEvent.remove = function remove(d) {
    if (_.get(opts, 'onConfidentialOut', false)) {
      opts.onConfidentialOut({
        data: d
      })
    }
  }

  return confidentialModeEvent
}

export default plotConfidentialModeEvent
