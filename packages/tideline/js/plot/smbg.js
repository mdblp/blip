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

import _ from 'lodash';

import utils from './util/utils';
import bgBoundaryClass from './util/bgboundary';
import categorizer from '../data/util/categorize';
import { MGDL_UNITS, DEFAULT_BG_BOUNDS } from '../data/util/constants';

function plotSmbg(pool, opts = {}) {
  const d3 = window.d3;
  const defaults = {
    bgUnits: MGDL_UNITS,
    classes: {
      'very-low': { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryLow },
      low: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower },
      target: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper },
      high: { boundary: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh },
    },
    size: 16,
    timezoneAware: false,
    tooltipPadding: 20
  };

  _.defaults(opts, defaults);

  var mainGroup = pool.parent();
  var getBgBoundaryClass = bgBoundaryClass(opts.classes, opts.bgUnits);

  function smbg(selection) {
    opts.xScale = pool.xScale().copy();
    selection.each(function(currentData) {

      smbg.addAnnotations(_.filter(currentData, 'annotations'));

      var circles = d3.select(this)
        .selectAll('circle.d3-smbg')
        .data(currentData, function(d) {
          return d.id;
        });
      circles.enter()
        .append('circle')
        .attr({
          cx: smbg.xPosition,
          cy: smbg.yPosition,
          r: smbg.radius,
          id: smbg.id,
          'class': getBgBoundaryClass
        })
        .classed({'d3-smbg': true, 'd3-circle-smbg': true});

      circles.exit().remove();

      var highlight = pool.highlight(circles);

      // tooltips
      selection.selectAll('.d3-circle-smbg').on('mouseover', function() {
        highlight.on(d3.select(this));
        smbg.addTooltip(d3.select(this).datum(), utils.getTooltipContainer(this));
      });
      selection.selectAll('.d3-circle-smbg').on('mouseout', function() {
        highlight.off();
        if (_.get(opts, 'onSMBGOut', false)){
          opts.onSMBGOut();
        }
      });
    });
  }

  smbg.radius = function() {
    // size is the total diameter of an smbg
    // radius is half that, minus one because of the 1px stroke for open circles
    return opts.size/2 - 1;
  };

  smbg.xPosition = function(d) {
    return opts.xScale(d.epoch);
  };

  smbg.yPosition = function(d) {
    return opts.yScale(d.value);
  };

  smbg.id = function(d) {
    return 'smbg_' + d.id;
  };

  smbg.addTooltip = function(d, rect) {
    if (_.get(opts, 'onSMBGHover', false)) {
      opts.onSMBGHover({
        data: d,
        rect: rect,
        class: categorizer(opts.classes, opts.bgUnits)(d)
      });
    }
  };

  smbg.addAnnotations = function(data) {
    for (var i = 0; i < data.length; ++i) {
      var d = data[i];
      var annotationOpts = {
        x: smbg.xPosition(d),
        y: opts.yScale(d.value),
        xMultiplier: 0,
        yMultiplier: 2,
        orientation: {
          down: true
        },
        d: d
      };
      if (mainGroup.select('#annotation_for_' + d.id)[0][0] == null) {
        mainGroup.select('#tidelineAnnotations_smbg')
          .call(pool.annotations(), annotationOpts);
      }
    }
  };

  return smbg;
}

export default plotSmbg;
