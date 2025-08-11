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
import * as d3 from 'd3'

import utils from './util/utils'
import { PumpManufacturer } from 'medical-domain'
import danaPumpIcon from 'dana-pump.svg'
import insightPumpIcon from 'insight-pump.svg'
import kaleidoPumpIcon from 'kaleido-pump.svg'
import medisafePumpIcon from 'medisafe-pump.svg'
import { DEFAULT_IMAGE_MARGIN, DEFAULT_OPTIONS_SIZE } from './util/eventsConstants'

const getReservoirChangeIcon = (pumpManufacturer) => {
  const manufacturerUpperCase = pumpManufacturer.toUpperCase()
  switch (manufacturerUpperCase) {
    case PumpManufacturer.Sooil:
      return danaPumpIcon
    case PumpManufacturer.Roche:
      return insightPumpIcon
    case PumpManufacturer.Terumo:
      return medisafePumpIcon
    case PumpManufacturer.Vicentra:
    default:
      return kaleidoPumpIcon
  }
}

function plotReservoirChange(pool, opts) {
  const height = pool.height() - DEFAULT_IMAGE_MARGIN
  const width = 40

  const xPos = (d) => opts.xScale(d.epoch)

  opts.size = opts.size ?? DEFAULT_OPTIONS_SIZE

  function reservoir(selection) {
    opts.xScale = pool.xScale().copy()

    selection.each(function(currentData) {
      const filteredData = _.filter(currentData, {
        subType: 'reservoirChange'
      })

      if (filteredData.length < 1) {
        // Remove previous data
        d3.select(this).selectAll('g.d3-reservoir-group').remove()
        return
      }

      const allReservoirs = d3
        .select(this)
        .selectAll('circle.d3-reservoir-only')
        .data(filteredData, (d) => d.id)

      const reservoirGroup = allReservoirs.enter()
        .append('g')
        .classed('d3-reservoir-group', true)
        .attr('id', (d) => `reservoir_group_${d.id}`)
        .attr('data-testid', (d) => `reservoir_group_${d.id}`)
      reservoirGroup
        .append('image')
        .attr('x', (d) => xPos(d) - (width / 2))
        .attr('y', pool.height() / 2 - opts.size / 2)
        .attr('width', width)
        .attr('height', height)
        .attr('xlink:href', (reservoirChange) => getReservoirChangeIcon(reservoirChange.pump.manufacturer))

      allReservoirs.exit().remove()

      // tooltips
      selection.selectAll('.d3-reservoir-group').on('mouseover', function() {
        reservoir.addTooltip(d3.select(this).datum(), utils.getTooltipContainer(this))
      })

      selection.selectAll('.d3-reservoir-group').on('mouseout', function() {
        if (_.get(opts, 'onReservoirOut', false)) {
          opts.onReservoirOut()
        }
      })
    })
  }

  reservoir.addTooltip = function(d, rect) {
    if (_.get(opts, 'onReservoirHover', false)) {
      opts.onReservoirHover({
        data: d,
        rect: rect
      })
    }
  }

  return reservoir
}

export default plotReservoirChange
