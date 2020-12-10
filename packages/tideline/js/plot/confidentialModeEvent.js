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
// @ts-nocheck

const d3 = require('d3');
const _ = require('lodash');

const dt = require('../data/util/datetime');
const lockIcon = require('lock.svg');

module.exports = function (pool, options = {}) {
  const height = pool.height() - 2;
  const imageSize = 24;

  const opts = _.cloneDeep(options);
  opts.xScale = pool.xScale().copy();
  const poolId = pool.id();

  const xPos = (d) => opts.xScale(Date.parse(d.normalTime)) + 1;

  const calculateWidth = (d) => {
    const s = Date.parse(d.normalTime);
    const units = d.duration.units;
    let msfactor = 1000;
    switch (units) {
    case 'minutes':
      msfactor *= 60;
      break;
    case 'hours':
      msfactor *= 60 * 60;
      break;
    }
    const e = Date.parse(dt.addDuration(s, d.duration.value * msfactor));
    return opts.xScale(e) - opts.xScale(s) - 1;
  };

  function confidentialModeEvent(selection) {
    selection.each(function () {
      const currentData = opts.data;
      const events = d3.select(this)
        .selectAll('g.d3-confidential-group')
        .data(currentData, (d) => d.id);

      const backGroup = events.enter()
        .append('g')
        .attr({
          'class': 'd3-confidential-group',
          id: (d) => `${poolId}_confidential_group_${d.id}`,
        });
      backGroup.append('rect')
        .attr({
          x: xPos,
          y: 1,
          width: calculateWidth,
          height,
          class: 'd3-back-confidential d3-confidential',
          id: (d) => `${poolId}_confidential_back_${d.id}`,
        });
      backGroup.append('image')
        .attr({
          x: (d) => xPos(d) + (calculateWidth(d) - imageSize) / 2,
          y: (height - imageSize) / 2,
          id: (d) => `${poolId}_confidential_lock_${d.id}`,
          'xlink:href': lockIcon,
        });

      events.exit().remove();

      // tooltips
      selection.selectAll('.d3-confidential-group').on('mouseover', function (d) {
        const parentContainer = document.getElementsByClassName('patient-data')[0].getBoundingClientRect();
        const container = this.getBoundingClientRect();
        container.y = container.top - parentContainer.top;
        confidentialModeEvent.addTooltip(d, container);
      });

      selection.selectAll('.d3-confidential-group').on('mouseout', function (d) {
        confidentialModeEvent.remove(d);
      });
    });
  }

  confidentialModeEvent.addTooltip = function addTooltip(d, rect) {
    if (_.get(opts, 'onConfidentialHover', false)) {
      opts.onConfidentialHover({
        data: d,
        rect: rect
      });
    }
  };

  confidentialModeEvent.remove = function remove(d) {
    if (_.get(opts, 'onConfidentialOut', false)) {
      opts.onConfidentialOut({
        data: d
      });
    }
  };

  return confidentialModeEvent;
};
