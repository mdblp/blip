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
// const LockIcon = require('@material-ui/icons/Lock');

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
      var events = d3.select(this)
        .selectAll('g.d3-confidential-group')
        .data(currentData, function(d) {
          return d.id;
      });
        
      var back = events.enter()
      .append('g')
      .attr({
        'class': 'd3-confidential-back',
        id: function(d) {
          return 'event_back_' + d.id;
        }
      });
      back.append('rect')
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
          return height;
        },
        class: 'd3-back-confidential d3-confidential',
        id: function(d) {
          return 'confidential_' + d.id;
        }
      });
      
      var groups = events.enter()
        .append('g')
        .attr({
          'class': 'd3-confidential-group',
          id: function(d) {
            return 'event_group_' + d.id;
          }
        });
      
      // 1st block at the top
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
          return (height-offset)/2 + 2;
        },
        class: 'd3-rect-confidential d3-confidential',
        id: function(d) {
          return 'confidential_' + d.id;
        }
      });

      // 2nd block with logo in th emiddle
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
          return offset + 2;
        },
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
  
      //   }).append('svg').append('path').attr({
      //     'd': 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z'}
      // );

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
      events.exit().remove();

      // tooltips
      selection.selectAll('.d3-confidential-group').on('mouseover', function(d) {
        console.log('mouseover');
        var parentContainer = document.getElementsByClassName('patient-data')[0].getBoundingClientRect();
        var container = this.getBoundingClientRect();
        container.y = container.top - parentContainer.top;
        confidentialModeEvent.addTooltip(d, container);
      });

      selection.selectAll('.d3-confidential-group').on('mouseout', function(d) {
        confidentialModeEvent.remove(d);
      });
    });
  };

  confidentialModeEvent.addTooltip = function(d, rect) {
    if (_.get(opts, 'onConfidentialHover', false)) {
      opts.onConfidentialHover({
        data: d, 
        rect: rect
      });
    }
  };

  confidentialModeEvent.remove = function(d) {
    if (_.get(opts, 'onConfidentialOut', false)){
      opts.onConfidentialOut({
        data: d
      });
    }
  };
  return confidentialModeEvent;
};
