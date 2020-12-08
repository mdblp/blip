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

var d3 = require('d3');
var _ = require('lodash');
var dt = require('../data/util/datetime');

var picto = require('../../img/lock.png');

module.exports = function(pool, opts) {
  opts = opts || {};

  var defaults = {
    width: 20,
    r: 14,
  };

  var mainGroup = pool.parent();

  _.defaults(opts, defaults);

  var xPos = function(d) {
    return opts.xScale(Date.parse(d.normalTime));
  };
  var calculateWidth = function(d) {
    var s = Date.parse(d.normalTime);
    var units = d.duration.units;
    var msfactor = 1000;
    switch (units) {
      case 'minutes': 
        msfactor = msfactor * 60;
        break;
      case 'hours':
        msfactor = msfactor * 60 * 60;
        break;
    }
    var e = Date.parse(dt.addDuration(s, d.duration.value * msfactor)); 
    return opts.xScale(e) - opts.xScale(s);
  };
  var height = pool.height();
  var offset = 20;

  function confidentialModeEvent(selection) {
    opts.xScale = pool.xScale().copy();

    selection.each(function() {
      var currentData = opts.data;
      var confidentialModeEvent = d3.select(this)
        .selectAll('g.d3-confidential-group')
        .data(currentData, function(d) {
          return d.id;
        });
        

      var groups = confidentialModeEvent.enter()
        .append('g')
        .attr({
          'class': 'd3-confidential-group',
          id: function(d) {
            return 'event_group_' + d.id;
          }
        });

      groups.append('rect')
      .attr({
        x: function(d) {
          return xPos(d);
        },
        y: function(d) {
          return 0;
        },
        width: function(d) {
          return calculateWidth(d);
        }, 
        height: function() {
          return (height-offset)/2;
        },
        class: 'd3-rect-confidential d3-confidential',
        id: function(d) {
          return 'confidential_' + d.id;
        }
      });

      groups.append('rect').attr({
        x: function(d) {
          return xPos(d);
        },
        y: function(d) {
          return (height-offset)/2;
        },
        width: function(d) {
          return calculateWidth(d);
        }, 
        height: function() {
          return offset;
        },
        'stroke-width': 0,
        class: 'd3-rect-confidential d3-confidential',
        id: function(d) {
          return 'confidential_' + d.id;
        }
      });
      groups.append('image')
      .attr({
        x: function(d) {
          return xPos(d);
        },
        y: function(d) {
          return (height-offset)/2;
        },
        width: function(d) {
          return calculateWidth(d);
        }, 
        height: function() {
          return offset;
        },
        'xlink:href' : picto,
      });
  
      groups.append('rect')
        .attr({
          x: function(d) {
            return xPos(d);
          },
          y: function(d) {
            return ((height-offset)/2) + offset;
          },
          width: function(d) {
            return calculateWidth(d);
          }, 
          height: function() {
            return (height-offset)/2;
          },
          class: 'd3-rect-confidential d3-confidential',
          id: function(d) {
            return 'confidential_' + d.id;
          }
        });
        confidentialModeEvent.exit().remove();
    });
  };

  return confidentialModeEvent;
};
