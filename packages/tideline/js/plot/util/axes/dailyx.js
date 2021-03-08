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
import moment from 'moment-timezone';

import dt from '../../../data/util/datetime';
import format from '../../../data/util/format';

function axesDaily(pool, opts = {}) {
  const defaults = {
    textShiftX: 5,
    textShiftY: 5,
    tickLength: 15,
    longTickMultiplier: 2.5,
    timePrefs: {
      timezoneName: 'UTC',
    }
  };

  _.defaults(opts, defaults);

  let mainGroup = pool.parent();
  let stickyLabel = mainGroup.select('#tidelineLabels')
    .append('g')
    .attr('class', 'd3-axis')
    .append('text')
    .attr({
      'class': 'd3-day-label',
      x: opts.leftEdge,
      // this is the same as dailyx.dayYPosition
      // we just don't have a datum to pass here
      y: pool.height() - opts.tickLength * opts.longTickMultiplier
    });

  /**
   * While 'inTransition' there is a lots of 'zoomstart' / 'zoomend' events
   * Use an accumulator for that
   */
  let transitionAccumulator = 0;
  /**
   * @param {boolean} value true if in transition
   */
  function onTransition(value) {
    transitionAccumulator += value ? 1 : -1;
    if (transitionAccumulator > 0) {
      stickyLabel.attr('opacity', '0.2');
    } else {
      stickyLabel.attr('opacity', '1.0');
    }
  }

  /**
   * Update the sticky label text
   * @param {number} date MS since epoch
   */
  function updateStickyLabel(date) {
    const startDate = moment.tz(date, opts.timePrefs.timezoneName);
    if (startDate.isValid()) {
      const dateHours = startDate.hours();

      // When we're close to midnight (where close = five hours on either side)
      // remove the sticky label so it doesn't overlap with the midnight-anchored day label
      let text = '';
      if (4 < dateHours && dateHours < 19) {
        text = format.xAxisDayText(startDate);
      }
      stickyLabel.text(text);
    } else {
      // Don't bother create a bows() log for this one,
      // should not happend outside buggy dev process anyway.
      console.warn('axesDaily.updateStickyLabel: invalid date', date, opts.timePrefs.timezoneName);
    }
  }

  // ** Events listeners **
  opts.emitter.on('inTransition', onTransition);
  opts.emitter.on('zoomstart', () => onTransition(true));
  opts.emitter.on('zoomend', () => onTransition(false));
  opts.emitter.on('dailyx-navigated', updateStickyLabel);

  function dailyx(selection) {

    opts.xScale = pool.xScale().copy();

    selection.each(function(currentData) {
      var ticks = selection.selectAll('g.d3-axis.' + opts['class'])
        .data(currentData, function(d) {
          return d.id;
        });

      var tickGroups = ticks.enter()
        .append('g')
        .attr({
          'class': 'd3-axis ' + opts['class']
        });

      tickGroups.append('line')
        .attr({
          x1: dailyx.xPosition,
          x2: dailyx.xPosition,
          y1: pool.height(),
          y2: dailyx.tickLength
        });

      tickGroups.append('text')
        .attr({
          x: dailyx.textXPosition,
          y: pool.height() - opts.textShiftY
        })
        .text(function(d) {
          return format.xAxisTickText(moment.tz(d.epoch, d.timezone));
        });

      tickGroups.filter(function(d) {
        var date = new Date(d.normalTime);
        date = new Date(dt.applyOffset(date, d.displayOffset));
        if (date.getUTCHours() === 0) {
          return d;
        }
      })
        .append('text')
        .attr({
          'class': 'd3-day-label',
          x: dailyx.textXPosition,
          y: dailyx.dayYPosition
        })
        .text((d) => format.xAxisDayText(moment.tz(d.epoch, d.timezone)));

      ticks.exit().remove();
    });
  }

  dailyx.xPosition = function(d) {
    return opts.xScale(Date.parse(d.normalTime));
  };

  dailyx.textXPosition = function(d) {
    return dailyx.xPosition(d) + opts.textShiftX;
  };

  dailyx.dayYPosition = function(d) {
    return dailyx.tickLength(d);
  };

  dailyx.tickLength = function(d) {
    var date = new Date(d.normalTime);
    date = new Date(dt.applyOffset(date, d.displayOffset));
    if (date.getUTCHours() === 0) {
      return pool.height() - opts.tickLength * opts.longTickMultiplier;
    }
    else return pool.height() - opts.tickLength;
  };

  dailyx.destroy = function() {
    opts = null;
    pool = null;
    mainGroup = null;
    stickyLabel = null;
  };

  return dailyx;
}

export default axesDaily;
