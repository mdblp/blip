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

/**
 * @typedef {import('./tidelinedata').Datum} Datum
 */

import _ from 'lodash';
import bows from 'bows';
import moment from 'moment-timezone';

import { MS_IN_DAY } from './data/util/constants';
import Pool from './pool';
import annotation from './plot/util/annotations/annotation';
import Tooltips from './plot/util/tooltips/tooltip';
import dt from './data/util/datetime';
import TidelineData from './tidelinedata';

function oneDay(emitter /*, opts = {} */) {
  const d3 = window.d3;
  /** @type {Console} */
  const log = bows('OneDay');

  // basic attributes
  const nav = {
    scrollNav: true,
    scrollNavHeight: 50,
    scrollGutterHeight: 20,
    scrollThumbRadius: 24,
    currentTranslation: 0,
    latestTranslation: 0,
    pan: null,
  };
  /** How much time a click on pan back/forward takes (in ms): For 1 day */
  const transitionDelayFast = 500;
  /** How much time a click on pan back/forward takes (in ms): For more than 1 day */
  const transitionDelaySlow = 1000;
  /** How much time we delay the update of the date title + viz widgets (in ms) */
  const navigatedDelay = 200;
  const minHeight = 400;
  const minWidth = 300;
  const axisGutter = 40;
  const minRenderDaysBuffer = 2;
  /** @type {function} */
  const xScale = d3.time.scale.utc();

  const pools = [];

  /** @type {Datum[]} The currently rendered data */
  let renderedData = [];
  /** True if we can't go forward more -> we display the most recent data */
  let mostRecent = false;
  /** true when click on pan back/forward a day, during the translation */
  let inTransition = false;
  let width = minWidth;
  let height = minHeight;
  var id,
    poolScaleHeight,
    gutter = 40,
    poolGroup,
    mainSVG, mainGroup,
    scrollNav, scrollHandleTrigger = true, annotations, tooltips;

  let renderDaysBuffer = minRenderDaysBuffer;
  /** @type {TidelineData} */
  let tidelineData = null;

  // Throttle the navigated event, we do not need so much updates
  // It also slow everything too much
  const throttleEmitNavigated = _.debounce(() => {
    const domain = container.getCurrentDomain();
    // log.debug('emit navigated (debounce)', { inTransition, domain });
    emitter.emit('navigated', domain);
  }, navigatedDelay);

  emitter.on('clickInPool', function({ offsetX /*, datum */ }) {
    // Event use when we want to add a message (note)
    // const timezone = _.get(opts, 'timePrefs.timezoneName', 'UTC');
    /** @type {Date} */
    const date = xScale.invert(offsetX - axisGutter);
    // For some reason, d3 seems to apply the current locale date offset
    // to this date, so we need to substract it.
    const now = new Date();
    const m = moment.utc(date).subtract(now.getTimezoneOffset(), 'minutes');
    // log.debug('clickInPool', { offsetX, axisGutter, date, m, datum, offset: date.getTimezoneOffset(), iso: date.toISOString() });
    emitter.emit('clickToDate', m);
  });

  function container(selection) {
    mainSVG = selection.append('svg');

    mainGroup = mainSVG.append('g').attr('id', 'tidelineMainSVG');

    // update SVG dimenions and ID
    mainSVG.attr({
      'id': id,
      'width': width,
      'height': height
    });

    poolGroup = mainGroup.append('g').attr('id', 'tidelinePools').attr('clip-path', 'url(#mainClipPath)');

    mainGroup.append('g')
      .attr('id', 'tidelineLabels');

    mainGroup.append('g')
      .attr('id', 'tidelineYAxes');

    if (nav.scrollNav) {
      scrollNav = mainGroup.append('g')
        .attr('class', 'x scroll')
        .attr('id', 'tidelineScrollNav');
    }

    mainSVG.insert('clipPath', '#tidelineMainSVG')
      .attr('id', 'mainClipPath')
      .append('rect')
      .attr({
        'x': container.axisGutter(),
        'y': 0,
        'width': container.width() - container.axisGutter(),
        'height': container.height()
      });
  }

  /** @type {Date[]} */
  container.endpoints = [];
  /** @type {Date[]} */
  container.initialEndpoints = [];
  container.dataFill = {};

  /**
   * Use to disable the ← → buttons
   * @param {boolean} value true if in transition
   */
  container.inTransition = (value) => {
    inTransition = value;
    emitter.emit('inTransition', value);
  };

  /**
   * Scroll the daily view to a specific date
   * @param {Date} date The date to translate
   * @param {number} transitionDelay In ms the time to do the translation
   */
  container.pantoDate = function pantoDate(date, transitionDelay = transitionDelayFast) {
    const domain = container.getCurrentDomain();
    const nDays = Math.round(10 * (date.valueOf() - domain.center.valueOf()) / MS_IN_DAY) / 10.0;
    log.info(`panDays: Jumped ${nDays > 0 ? 'forward': 'back'} ${Math.abs(nDays)} days to ${date.toISOString()}.`);

    const currentPosition = xScale(domain.center);
    const wantedPosition = xScale(date);
    const amountInPixel = wantedPosition - currentPosition;

    let nUgly = 0;
    nav.currentTranslation -= amountInPixel;
    container.inTransition(true);
    mainGroup.transition()
      .duration(transitionDelay)
      .tween('zoom', () => {
        const ix = d3.interpolate(nav.currentTranslation + amountInPixel, nav.currentTranslation);
        return (t) => {
          nav.pan.translate([ix(t), 0]);
          nav.pan.event(mainGroup);
        };
      })
      .each(() => ++nUgly)
      .each('end', () => {
        // this ugly solution courtesy of the man himself:
        // https://groups.google.com/forum/#!msg/d3-js/WC_7Xi6VV50/j1HK0vIWI-EJ
        if (!--nUgly) {
          container.navString(true);
          container.inTransition(false);
        }
      });
  };

  container.panForward = function() {
    const domain = container.getCurrentDomain();
    container.pantoDate(new Date(domain.center.valueOf() + MS_IN_DAY));
  };

  container.panBack = function() {
    const domain = container.getCurrentDomain();
    container.pantoDate(new Date(domain.center.valueOf() - MS_IN_DAY));
  };

  container.newPool = function() {
    var p = new Pool(container);
    pools.push(p);
    return p;
  };

  container.poolScaleHeight = function(pools) {
    if (!arguments.length) return poolScaleHeight;
    var cumHeightRatio = 0, cumGutterWeight = 0;
    pools.forEach(function(pool) {
      cumHeightRatio += pool.heightRatio();
      cumGutterWeight += pool.gutterWeight();
    });
    gutter = 0.25 * (container.height() / cumHeightRatio);
    var totalPoolsHeight =
      container.height() - nav.scrollNavHeight - (cumGutterWeight * gutter);
    poolScaleHeight = totalPoolsHeight/cumHeightRatio;
    return container;
  };

  container.arrangePools = function() {
    var visiblePools = _.reject(pools, function(pool) {
      return pool.hidden();
    });
    container.poolScaleHeight(visiblePools);
    visiblePools.forEach(function(pool) {
      pool.height(poolScaleHeight);
    });
    var currentYPosition = 0;
    visiblePools.forEach(function(pool) {
      currentYPosition += gutter * pool.gutterWeight();
      pool.yPosition(currentYPosition);
      currentYPosition += pool.height();
      pool.group().attr('transform', 'translate(0,' + pool.yPosition() + ')');
      if (pool.hidden()) {
        pool.group().attr('display', 'none');
      }
    });
  };

  container.getCurrentDomain = function() {
    /** @type {Date[]} */
    const currentDomain = xScale.domain();
    const start = currentDomain[0];
    const end = currentDomain[1];
    const center = new Date(start);
    center.setUTCHours(start.getUTCHours() + 12);
    return { start, end, center };
  };

  /**
   * Update the navigation datetime & button back/forth day
   * in blip daily view
   */
  container.navString = function navString(direct = false) {
    const prevMostRecent = mostRecent;
    const domain = container.getCurrentDomain();

    if (direct) {
      // At the end of panBack / panForward a day only
      // log.debug('emit navigated (direct)', { inTransition, domain });
      emitter.emit('navigated', domain);
    } else {
      // Manual scrolling with the bar
      throttleEmitNavigated();
    }

    mostRecent = domain.end.valueOf() === container.endpoints[1].valueOf();
    if (prevMostRecent !== mostRecent) {
      // log.debug('emit mostRecent', { mostRecent, prevMostRecent });
      emitter.emit('mostRecent', mostRecent);
    }
  };

  // getters only
  container.svg = function() {
    return mainSVG;
  };

  container.pools = function() {
    return pools;
  };

  container.poolGroup = function() {
    return poolGroup;
  };

  container.annotations = function() {
    return annotations;
  };

  container.tooltips = function() {
    return tooltips;
  };

  container.axisGutter = function() {
    return axisGutter;
  };

  container.dateAtCenter = function() {
    const domain = container.getCurrentDomain();
    return dt.toISODateString(domain.center);
  };

  container.isUpdateRenderedDataRangeNeeded = function() {
    if (renderedData.length > 0) {
      /** @type {Date[]} */
      const displayedDomain = xScale.domain();
      const startDisplayDate = displayedDomain[0].valueOf();
      const endDisplayDate = displayedDomain[1].valueOf();
      const startDataDate = renderedData[0].epoch;
      const endDataDate = renderedData[renderedData.length - 1].epoch;

      const isNeeded = startDataDate > startDisplayDate || startDisplayDate > endDataDate || startDataDate > endDisplayDate || endDisplayDate > endDataDate;
      // log.debug("isUpdateRenderedDataRangeNeeded", {startDisplayDate, endDisplayDate, startDataDate, endDataDate, isNeeded});
      return isNeeded;
    }
    // log.debug("isUpdateRenderedDataRangeNeeded: No data!");
    return true;
  };

  // chainable methods
  container.setAxes = function() {
    // set the domain and range for the main tideline x-scale
    xScale.domain([container.initialEndpoints[0], container.initialEndpoints[1]])
      .range([axisGutter, width]);

    if (nav.scrollNav) {
      nav.scrollScale = d3.time.scale.utc()
        .domain([container.endpoints[0], container.initialEndpoints[0]])
        .range([axisGutter + nav.scrollThumbRadius, width - nav.scrollThumbRadius]);
    }

    pools.forEach(function(pool) {
      pool.xScale(xScale.copy());
    });

    return container;
  };

  container.setNav = function() {
    const maxTranslation = -xScale(container.endpoints[0]) + axisGutter;
    const minTranslation = -xScale(container.endpoints[1]) + width;
    nav.pan = d3.behavior.zoom()
      .scaleExtent([1, 1])
      .x(xScale)
      .on('zoomstart', function() {
        emitter.emit('zoomstart');
      })
      .on('zoom', function() {
        if (container.isUpdateRenderedDataRangeNeeded()) {
          // log.debug("redraw", { mostRecent });
          container.renderedData(xScale.domain());
          if (renderedData.length > 0) {
            for (let i = 0; i < pools.length; i++) {
              pools[i].render(poolGroup, renderedData);
            }
          }
        }
        const e = d3.event;
        if (e.translate[0] < minTranslation) {
          e.translate[0] = minTranslation;
        } else if (e.translate[0] > maxTranslation) {
          e.translate[0] = maxTranslation;
        }
        nav.pan.translate([e.translate[0], 0]);
        for (let i = 0; i < pools.length; i++) {
          pools[i].pan(e);
        }
        mainGroup.select('#tidelineTooltips').attr('transform', 'translate(' + e.translate[0] + ',0)');
        mainGroup.select('#tidelineAnnotations').attr('transform', 'translate(' + e.translate[0] + ',0)');
        if (scrollHandleTrigger) {
          mainGroup.select('.scrollThumb').transition().ease('linear').attr('x', (d) => {
            d.x = nav.scrollScale(xScale.domain()[0]);
            return d.x - nav.scrollThumbRadius;
          });
        } else {
          mainGroup.select('.scrollThumb').attr('x', (d) => {
            d.x = nav.scrollScale(xScale.domain()[0]);
            return d.x - nav.scrollThumbRadius;
          });
        }
      })
      .on('zoomend', function() {
        emitter.emit('zoomend');
        container.currentTranslation(nav.latestTranslation);
        if (!inTransition) {
          // Pan back/forward in progress.
          // It will be done at the end (see panADay), we do not want
          // to do it here, because is slow the scrolling too much
          container.navString();
        }
        if (!scrollHandleTrigger) {
          mainGroup.select('.scrollThumb').attr('x', function (/* d */) {
            return nav.scrollScale(xScale.domain()[0]) - nav.scrollThumbRadius;
          });
        }
        scrollHandleTrigger = true;
      });

    mainGroup.call(nav.pan);

    return container;
  };

  container.setScrollNav = function() {
    var translationAdjustment = axisGutter;
    scrollNav.selectAll('line').remove();
    scrollNav.attr('transform', 'translate(0,' + (height - (nav.scrollNavHeight * 2/5)) + ')')
      .insert('line', '.scrollThumb')
      .attr({
        'stroke-width': nav.scrollGutterHeight,
        // add and subtract 1/2 of scrollGutterHeight because radius of linecap is 1/2 of stroke-width
        'x1': axisGutter + nav.scrollGutterHeight/2,
        'x2': width - nav.scrollGutterHeight/2,
        'y1': 0,
        'y2': 0
      });

    var dxRightest = nav.scrollScale.range()[1];
    var dxLeftest = nav.scrollScale.range()[0];

    var drag = d3.behavior.drag()
      .origin(function(d) {
        return d;
      })
      .on('dragstart', function() {
        d3.event.sourceEvent.stopPropagation(); // silence the click-and-drag listener
      })
      .on('drag', function(d) {
        d.x += d3.event.dx;
        if (d.x > dxRightest) {
          d.x = dxRightest;
        }
        else if (d.x < dxLeftest) {
          d.x = dxLeftest;
        }
        d3.select(this).attr('x', function(d) { return d.x - nav.scrollThumbRadius; });
        var date = nav.scrollScale.invert(d.x);
        nav.currentTranslation += -xScale(date) + translationAdjustment;
        scrollHandleTrigger = false;
        nav.pan.translate([nav.currentTranslation, 0]);
        nav.pan.event(mainGroup);
      });

    scrollNav.selectAll('rect')
      .data([{'x': nav.scrollScale(container.initialEndpoints[0]), 'y': 0}])
      .enter()
      .append('rect')
      .attr({
        'x': function(d) {
          return d.x - nav.scrollThumbRadius;
        },
        'y': -nav.scrollThumbRadius/3,
        'width': nav.scrollThumbRadius * 2,
        'height': nav.scrollThumbRadius/3 * 2,
        'rx': nav.scrollThumbRadius/3,
        'class': 'scrollThumb'
      })
      .call(drag);

    return container;
  };

  container.setAnnotation = function() {
    var annotationGroup = mainGroup.append('g')
      .attr({
        id: 'tidelineAnnotationsOuter',
        'clip-path': 'url(#mainClipPath)'
      })
      .append('g')
      .attr('id', 'tidelineAnnotations');

    annotations = annotation(container, annotationGroup).id(annotationGroup.attr('id'));
    pools.forEach(function(pool) {
      pool.annotations(annotations);
    });
    return container;
  };

  container.setTooltip = function() {
    var tooltipGroup = mainGroup.append('g')
      .attr('id', 'tidelineTooltips');
    tooltips = new Tooltips(container, tooltipGroup).id(tooltipGroup.attr('id'));
    return container;
  };

  /**
   *
   * @param {Date | null} date The date to display
   * @param {boolean} toMostRecent true if we want to jump to the most recent date
   * @returns {typeof container} this for chaining
   */
  container.setAtDate = function setAtDate(date, toMostRecent = false) {
    log.debug('setAtDate', { date, toMostRecent });
    scrollHandleTrigger = toMostRecent;
    if (toMostRecent) {
      if (date === null) {
        // Click on the most recent button
        // do a smooth
        const domain = container.getCurrentDomain();
        const newDateMS = container.initialEndpoints[1].valueOf() - MS_IN_DAY / 2;
        const transitionDelay = Math.abs(domain.center.valueOf() - newDateMS) > MS_IN_DAY ? transitionDelaySlow : transitionDelayFast;
        container.pantoDate(new Date(newDateMS), transitionDelay);
      } else {
        nav.pan.translate([0,0]);
        nav.pan.event(mainGroup);
      }
    } else {
      container.currentTranslation(-xScale(date) + axisGutter);
      nav.pan.translate([nav.currentTranslation, 0]);
      nav.pan.event(mainGroup);
    }

    return container;
  };

  container.destroy = function() {
    emitter.removeAllListeners();
    mainSVG.remove();

    return container;
  };

  // getters and setters
  container.id = function(x) {
    if (!arguments.length) return id;
    if (x.search('tideline') !== -1) {
      id = x.replace('tideline', 'tidelineSVGOneDay');
    }
    else {
      id = 'tidelineSVGOneDay';
    }
    return container;
  };

  container.width = function(x) {
    if (!arguments.length) return width;
    if (x >= minWidth) {
      width = x;
    }
    else {
      width = minWidth;
    }
    return container;
  };

  container.height = function(x) {
    if (!arguments.length) return height;
    var totalHeight = x;
    if (nav.scrollNav) {
      totalHeight += nav.scrollNavHeight;
    }
    if (totalHeight >= minHeight) {
      height = x;
    }
    else {
      height = minHeight;
    }
    return container;
  };

  container.latestTranslation = function(x) {
    if (!arguments.length) return nav.latestTranslation;
    nav.latestTranslation = x;
    return container;
  };

  container.currentTranslation = function(x) {
    if (!arguments.length) return nav.currentTranslation;
    nav.currentTranslation = x;
    return container;
  };

  // FIXME: Delete me: not use
  container.buffer = function(x) {
    if (!arguments.length) return renderDaysBuffer;
    renderDaysBuffer = x;
    return container;
  };

  container.data = function(/** @type {TidelineData} */ td) {
    if (td instanceof TidelineData) {
      tidelineData = td;
    } else if (tidelineData === null) {
      return [];
    } else {
      return tidelineData.data;
    }

    if (_.isEmpty(td.data)) {
      throw new Error("Sorry, I can't render anything without /some/ data.");
    } else if (td.data.length < 2) {
      throw new Error("Sorry, I can't render anything with only *one* datapoint.");
    }

    renderDaysBuffer = Math.max(minRenderDaysBuffer, Math.ceil(td.maxDuration / dt.MS_IN_24));
    if (!Number.isSafeInteger(renderDaysBuffer)) {
      renderDaysBuffer = minRenderDaysBuffer; // Safe guard
    }

    log.debug('renderDaysBuffer', renderDaysBuffer);

    const lastTimezone = tidelineData.getLastTimezone();
    const first = moment.utc(tidelineData.opts.dataRange[0]);
    const last = moment.utc(tidelineData.endpoints[1]);

    if (last.valueOf() - first.valueOf() < dt.MS_IN_24) {
      log.error("The endpoints of your data are less than 24 hours apart.");
    }

    const minusOne = moment.utc(last).tz(lastTimezone);
    minusOne.subtract(1, 'day');
    // initialEndpoints ~= set the zoom (time axis) value of the displayed chart
    container.initialEndpoints = [minusOne.toDate(), last.toDate()];
    container.endpoints = [first.toDate(), last.toDate()];

    return container;
  };

  container.renderedData = function rData(/** string[] */ a = null) {
    if (a === null) {
      return renderedData;
    }

    const start = moment.utc(a[0]).subtract(renderDaysBuffer, 'day').toISOString();
    const end = moment.utc(a[1]).add(renderDaysBuffer, 'day').toISOString();
    const filtered = tidelineData.dataByDate.filter([start, end]);
    renderedData = filtered.top(Infinity).reverse();

    return renderedData;
  };

  return container;
}

export default oneDay;
