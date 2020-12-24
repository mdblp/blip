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

/* jshint esversion:6 */

var d3 = require('d3');
var _ = require('lodash');

const { SITE_CHANGE_BY_MANUFACTURER, CARTRIDGE_CHANGE, INFUSION_SITE_CHANGE, DEFAULT_MANUFACTURER } = require('../../plugins/blip/basics/logic/constants');

module.exports = function(pool, opts) {
  var defaults = {
    r: 14,
    padding: 4
  };

  _.defaults(opts, defaults);

  var picto = require('../../img/sitechange-diabeloop.png');
  var height = pool.height();
  var offset = height / 5 ;
  var width = 40;

  const xPos = (d) => opts.xScale(Date.parse(d.normalTime));
  const isTypeOfChange = (d, value) => {
    const change = _.get(SITE_CHANGE_BY_MANUFACTURER, _.get(d, 'pump.manufacturer', DEFAULT_MANUFACTURER), SITE_CHANGE_BY_MANUFACTURER[DEFAULT_MANUFACTURER]);
    return change === value;
  };

  function reservoir(selection) {
    const yPos = opts.r + opts.padding;
    opts.xScale = pool.xScale().copy();

    selection.each(function(currentData) {
      var filteredData = _.filter(currentData, {
          subType: 'reservoirChange'
        });

      var allReservoirs = d3
        .select(this)
        .selectAll('circle.d3-reservoir-only')
        .data(filteredData, (d) => d.id);

      var reservoirGroup = allReservoirs.enter()
        .append('g')
        .attr({
          'class': 'd3-reservoir-group',
          id: (d) => 'reservoir_group_' + d.id,
        });
      // Infusion Site 
      reservoirGroup.filter((d) => isTypeOfChange(d, INFUSION_SITE_CHANGE))
        .append('image')
        .attr({
          x: (d) => xPos(d) - (width / 2) ,
          y: 0,
          width, 
          height: offset,
          'xlink:href': picto,
        });
        
      // Cartridge Change 
      reservoirGroup.filter((d) => isTypeOfChange(d, CARTRIDGE_CHANGE))
        .append('circle').attr({
          cx: xPos,
          cy: yPos,
          r: opts.r,
          'stroke-width': 0,
          class: 'd3-circle-reservoir',
          id: (d) => `reservoir_circle_${d.id}`,
        })
        reservoirGroup.filter((d) => isTypeOfChange(d, CARTRIDGE_CHANGE))
        .append('text')
        .text('C')
        .attr({
          x: xPos,
          y: yPos,
          class: 'd3-circle-reservoir-text',
          id: (d) => `reservoir_text_${d.id}`,
        });
  
      allReservoirs.exit().remove();

      // tooltips
      selection.selectAll('.d3-reservoir-group').on('mouseover', function() {        
        var parentContainer = document
          .getElementsByClassName('patient-data')[0]
          .getBoundingClientRect();
        var container = this.getBoundingClientRect();
        container.y = container.top - parentContainer.top;

        reservoir.addTooltip(d3.select(this).datum(), container);
      });

      selection.selectAll('.d3-reservoir-group').on('mouseout', function() {
        if (_.get(opts, 'onReservoirOut', false)) {
          opts.onReservoirOut();
        }
      });
    });
  }

  reservoir.addTooltip = function(d, rect) {
    if (_.get(opts, 'onReservoirHover', false)) {
      opts.onReservoirHover({
        data: d,
        rect: rect
      });
    }
  };

  return reservoir;
};
