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

import i18next from 'i18next';
import _ from 'lodash';
import { EventEmitter } from 'events';

import { MGDL_UNITS } from '../../js/data/util/constants';

import oneDay from '../../js/oneday';
import fill from '../../js/plot/util/fill';
import scalesutil from '../../js/plot/util/scales';
import axesDailyx from '../../js/plot/util/axes/dailyx';
import plotZenModeEvent from '../../js/plot/zenModeEvent';
import plotPhysicalActivity from '../../js/plot/physicalActivity';
import plotReservoirChange from '../../js/plot/reservoir';
import plotDeviceParameterChange from '../../js/plot/deviceParameterChange';
import plotConfidentialModeEvent from '../../js/plot/confidentialModeEvent';
import plotCbg from '../../js/plot/cbg';
import plotSmbg from '../../js/plot/smbg';
import plotWizard from '../../js/plot/wizard';
import plotCarb from '../../js/plot/carb';
import plotQuickbolus from '../../js/plot/quickbolus';
import plotBasal from '../../js/plot/basal';
import plotSuspend from '../../js/plot/suspend';
import plotMessage from '../../js/plot/message';
import plotTimeChange from '../../js/plot/timechange';

/**
 * @typedef {import('../../js/tidelinedata').default } TidelineData
 */

/**
 * Create a 'One Day' chart object that is a wrapper around Tideline components
 * @param {HTMLElement} parentElement The div parent element
 * @param {TidelineData} tidelineData
 * @param {object} options
 * @returns {function}
 */
function chartDailyFactory(parentElement, tidelineData, options = {}) {
  const d3 = window.d3;
  const t = i18next.t.bind(i18next);

  const defaults = {
    bgUnits: MGDL_UNITS,
    labelBaseline: 4,
    timePrefs: {
      timezoneAware: false,
      timezoneName: 'UTC',
    },
    trackMetric: _.noop,
  };
  _.defaults(options, defaults);

  if (!(parentElement instanceof HTMLElement)) {
    throw new Error('Sorry, you must provide a DOM element! :(');
  }

  const width = Math.max(640, parentElement.offsetWidth);
  const height = Math.max(480, parentElement.offsetHeight);
  const scales = scalesutil(options);
  const emitter = new EventEmitter();
  const chart = oneDay(emitter, options);
  const SMBG_SIZE = 16;

  // ***
  // Basic chart set up
  // ***

  chart.id(parentElement.id).width(width).height(height);
  d3.select(parentElement).call(chart);

  // ***
  // Setup Pools
  // ***

  // top x-axis pool
  const poolXAxis = chart.newPool()
    .id('poolXAxis', chart.poolGroup)
    .label('')
    .labelBaseline(options.labelBaseline);
  poolXAxis.index(chart.pools.indexOf(poolXAxis))
    .heightRatio(0.65)
    .gutterWeight(0.0);

  // messages pool
  const poolMessages = chart.newPool()
    .id('poolMessages', chart.poolGroup)
    .label('')
    .labelBaseline(options.labelBaseline);
  poolMessages.index(chart.pools.indexOf(poolMessages))
    .heightRatio(0.5)
    .gutterWeight(0.0);

  // blood glucose data pool
  const poolBG = chart.newPool()
    .id('poolBG', chart.poolGroup)
    .label([{
      'main': t('Glucose'),
      'light': ` (${t(chart.options.bgUnits)})`
    },
    {
      'main': ` & ${t('Events')}`
    }])
    .labelBaseline(options.labelBaseline)
    .legend(['bg']);
  poolBG.index(chart.pools.indexOf(poolBG))
    .heightRatio(2.15)
    .gutterWeight(1.0);

  // carbs and boluses data pool
  const poolBolus = chart.newPool()
    .id('poolBolus', chart.poolGroup)
    .label([{
      'main': t('Bolus'),
      'light': ` (${t('U')})`
    },
    {
      'main': ` & ${t('Carbohydrates')}`,
      'light': ` (${t('g')})`
    }])
    .labelBaseline(options.labelBaseline)
    .legend(['rescuecarbs', 'carbs', 'bolus']);
  poolBolus.index(chart.pools.indexOf(poolBolus))
    .heightRatio(1.35)
    .gutterWeight(1.0);

  // basal data pool
  const poolBasal = chart.newPool()
    .id('poolBasal', chart.poolGroup)
    .label([{
      main: t('Basal Rates'),
      light: ` (${t('U')}/${t('hr')})`
    }])
    .labelBaseline(options.labelBaseline)
    .legend(['basal']);
  poolBasal.index(chart.pools.indexOf(poolBasal))
    .heightRatio(1.0)
    .gutterWeight(1.0);

  chart.arrangePools();
  chart.setAnnotation().setTooltip();

  // add annotations
  chart.annotations.addGroup(chart.svg().select('#' + poolBG.id()), 'smbg');
  chart.annotations.addGroup(chart.svg().select('#' + poolBolus.id()), 'bolus');
  chart.annotations.addGroup(chart.svg().select('#' + poolBolus.id()), 'wizard');
  chart.annotations.addGroup(chart.svg().select('#' + poolBasal.id()), 'basal');

  // add tooltips
  chart.tooltips.addGroup(poolMessages, {
    type: 'deviceEvent',
    shape: 'generic'
  });
  chart.tooltips.addGroup(poolMessages, {
    type: 'message',
    shape: 'generic'
  });
  chart.tooltips.addGroup(poolBG, {
    type: 'cbg',
    classes: ['d3-bg-low', 'd3-bg-target', 'd3-bg-high']
  });
  chart.tooltips.addGroup(poolBG, {
    type: 'smbg'
  });
  chart.tooltips.addGroup(poolBolus, {
    type: 'wizard',
    shape: 'generic'
  });
  chart.tooltips.addGroup(poolBolus, {
    type: 'bolus',
    shape: 'generic'
  });
  chart.tooltips.addGroup(poolBasal, {
    type: 'basal'
  });

  // ***
  // Initialize chart with data
  // ***
  chart.data(tidelineData).setAxes().setNav().setScrollNav();

  // x-axis pools
  // add ticks to top x-axis pool
  poolXAxis.addPlotType('fill', axesDailyx(poolXAxis, {
    'class': 'd3-top',
    emitter,
    leftEdge: chart.axisGutter(),
    timePrefs: chart.options.timePrefs
  }), true, true);

  // BG pool
  const allBG = _.filter(tidelineData.data, function(d) {
    if ((d.type === 'cbg') || (d.type === 'smbg')) {
      return d;
    }
  });
  const scaleBG = scales.bg(allBG, poolBG, SMBG_SIZE/2);
  const bgTickFormat = options.bgUnits === MGDL_UNITS ? 'd' : '.1f';

  // set up y-axis
  poolBG.yAxis(d3.svg.axis()
    .scale(scaleBG)
    .orient('left')
    .outerTickSize(0)
    .tickValues(scales.bgTicks(allBG))
    .tickFormat(d3.format(bgTickFormat)));
  // add background fill rectangles to BG pool
  poolBG.addPlotType('fill', fill(poolBG, {
    endpoints: chart.endpoints,
    isDaily: true,
    guidelines: [
      {
        'class': 'd3-line-bg-threshold',
        'height': chart.options.bgClasses.low.boundary
      },
      {
        'class': 'd3-line-bg-threshold',
        'height': chart.options.bgClasses.target.boundary
      }
    ],
    yScale: scaleBG
  }), true, true);

  // add background fill rectangles to BG pool
  const scaleHeightBG = d3.scale.linear()
    .domain([0, poolBG.height()])
    .range([0, poolBG.height()]);

  poolBG.addPlotType('fill', fill(poolBG, {
    endpoints: chart.endpoints,
    isDaily: true,
    yScale: scaleHeightBG
  }), true, true);

  poolBG.addPlotType('deviceEvent', plotZenModeEvent(poolBG, {
    yScale: scaleBG,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    data: tidelineData.zenEvents,
  }), false, true);

  poolBG.addPlotType('physicalActivity', plotPhysicalActivity(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    yScale: scaleBG,
    emitter,
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onPhysicalHover: options.onPhysicalHover,
    onPhysicalOut: options.onPhysicalOut,
    data: tidelineData.physicalActivities,
  }), true, true);

  poolBG.addPlotType('deviceEvent', plotReservoirChange(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    yScale: scaleBG,
    emitter,
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onReservoirHover: options.onReservoirHover,
    onReservoirOut: options.onReservoirOut,
  }), true, true);

  poolBG.addPlotType('deviceEvent', plotDeviceParameterChange(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    yScale: scaleBG,
    emitter,
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onParameterHover: options.onParameterHover,
    onParameterOut: options.onParameterOut,
    data: tidelineData.deviceParameters,
  }), true, true);

  // add confidential mode to BG pool
  poolBG.addPlotType('deviceEvent', plotConfidentialModeEvent(poolBG, {
    yScale: scaleBG,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    data: tidelineData.confidentialEvents,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onConfidentialOut,
  }), true, true);

  // add CBG data to BG pool
  poolBG.addPlotType('cbg', plotCbg(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    yScale: scaleBG,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onCBGHover: options.onCBGHover,
    onCBGOut: options.onCBGOut,
  }), true, true);

  // add SMBG data to BG pool
  poolBG.addPlotType('smbg', plotSmbg(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    yScale: scaleBG,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onSMBGHover: options.onSMBGHover,
    onSMBGOut: options.onSMBGOut,
  }), true, true);

  // bolus & carbs pool (FIXME on new data loaded)
  const scaleBolus = scales.bolus(tidelineData.grouped.bolus.concat(tidelineData.grouped.wizard), poolBolus);
  // set up y-axis for bolus
  const bolusTickValues = [0, 1, 5, 10];
  const maxBolusValue = scaleBolus.domain()[1];
  // Add additional legends
  while (maxBolusValue > bolusTickValues[bolusTickValues.length - 1] && bolusTickValues.length < 7) {
    const currentMax = bolusTickValues[bolusTickValues.length - 1];
    const bolusTick = currentMax < 20 ? 5 : 10;
    // [0, 5, 10, 15, 20, 30, 40]
    bolusTickValues.push(currentMax + bolusTick);
  }

  poolBolus.yAxis(d3.svg.axis()
    .scale(scaleBolus)
    .orient('left')
    .outerTickSize(0)
    .ticks(2)
    .tickValues(bolusTickValues));

  // add background fill rectangles to bolus pool
  const poolBolusHeight = [0, poolBolus.height()];
  const scaleHeight = d3.scale.log()
    .domain(poolBolusHeight)
    .range(poolBolusHeight);

  poolBolus.addPlotType('fill', fill(poolBolus, {
    endpoints: chart.endpoints,
    isDaily: true,
    yScale: scaleHeight
  }), true, true);

  // add wizard data to wizard pool
  poolBolus.addPlotType('wizard', plotWizard(poolBolus, {
    yScale: scaleBolus,
    emitter,
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onBolusHover: options.onBolusHover,
    onBolusOut: options.onBolusOut,
  }), true, true);

  poolBolus.addPlotType('food', plotCarb(poolBolus, {
    emitter,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onCarbHover: options.onCarbHover,
    onCarbOut: options.onCarbOut,
  }), true, true);

  // quick bolus data to wizard pool
  poolBolus.addPlotType('bolus', plotQuickbolus(poolBolus, {
    yScale: scaleBolus,
    emitter,
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onBolusHover: options.onBolusHover,
    onBolusOut: options.onBolusOut,
  }), true, true);

  // add confidential mode to Bolus pool
  poolBolus.addPlotType('deviceEvent', plotConfidentialModeEvent(poolBolus, {
    yScale: scaleBolus,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    data: tidelineData.confidentialEvents,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onConfidentialOut,
  }), false, true);

  // basal pool
  const scaleBasal = scales.basal(tidelineData.grouped.basal, poolBasal);
  // set up y-axis
  poolBasal.yAxis(d3.svg.axis()
    .scale(scaleBasal)
    .orient('left')
    .outerTickSize(0)
    .ticks(2));
  // add background fill rectangles to basal pool
  poolBasal.addPlotType('fill', fill(poolBasal, {endpoints: chart.endpoints, isDaily: true}), true, true);

  // add basal data to basal pool
  poolBasal.addPlotType('basal', plotBasal(poolBasal, {
    yScale: scaleBasal,
    emitter,
    data: tidelineData.grouped.basal,
    ...tidelineData.opts.timePrefs,
  }), true, true);

  // add device suspend data to basal pool
  poolBasal.addPlotType('deviceEvent', plotSuspend(poolBasal, {
    yScale: scaleBasal,
    emitter,
    data: tidelineData.grouped.deviceEvent,
    timezoneAware: chart.options.timePrefs.timezoneAware
  }), true, true);

  // add confidential mode to Basal pool
  poolBasal.addPlotType('deviceEvent', plotConfidentialModeEvent(poolBasal, {
    yScale: scaleBolus,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    data: tidelineData.confidentialEvents,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onConfidentialOut,
  }), false, true);

  // messages pool
  // add background fill rectangles to messages pool
  poolMessages.addPlotType('fill', fill(poolMessages, {
    emitter,
    isDaily: true,
    cursor: 'cell'
  }), true, true);

  // add message images to messages pool
  poolMessages.addPlotType('message', plotMessage(poolMessages, {
    size: 30,
    emitter,
    timezoneAware: chart.options.timePrefs.timezoneAware,
  }), true, true);

  // add timechange images to messages pool
  poolMessages.addPlotType('deviceEvent', plotTimeChange(poolMessages, {
    size: 30,
    emitter,
    timezone: chart.options.timePrefs.timezoneName,
  }), true, true);

  // Initial chart render
  chart.renderPoolsData();

  return chart;
}

export default chartDailyFactory;
