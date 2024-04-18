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

import i18next from 'i18next'
import _ from 'lodash'
import { EventEmitter } from 'events'

import { MGDL_UNITS } from 'medical-domain'

import Pool from '../../js/pool'
import oneDay from '../../js/oneday'
import fill from '../../js/plot/util/fill'
import { createYAxisBasal, createYAxisBG, createYAxisBolus } from '../../js/plot/util/scales'
import axesDailyx from '../../js/plot/util/axes/dailyx'
import plotZenModeEvent from '../../js/plot/zenModeEvent'
import plotPhysicalActivity from '../../js/plot/physicalActivity'
import plotReservoirChange from '../../js/plot/reservoir'
import plotDeviceParameterChange from '../../js/plot/deviceParameterChange'
import plotConfidentialModeEvent from '../../js/plot/confidentialModeEvent'
import plotWarmUp from '../../js/plot/warmup'
import plotAlarmEvent from '../../js/plot/alarmEvent'
import plotCbg from '../../js/plot/cbg'
import plotSmbg from '../../js/plot/smbg'
import plotWizard from '../../js/plot/wizard'
import plotCarb from '../../js/plot/carb'
import plotQuickbolus from '../../js/plot/quickbolus'
import plotBasal from '../../js/plot/basal'
import plotMessage from '../../js/plot/message'
import plotTimeChange from '../../js/plot/timechange'

/**
 * @typedef {import('../../js/tidelinedata').default } MedicalDataService
 * @typedef {import('../../js/pool').default } Pool
 */


/**
 * Create a 'One Day' chart object that is a wrapper around Tideline components
 * @param {HTMLElement} parentElement The div parent element
 * @param {MedicalDataService} tidelineData
 * @param {object} options
 * @returns {function}
 */
function chartDailyFactory(parentElement, tidelineData, options = {}) {
  const d3 = window.d3
  const t = i18next.t.bind(i18next)

  const defaults = {
    bgUnits: MGDL_UNITS,
    labelBaseline: 4,
    timePrefs: {
      timezoneAware: false,
      timezoneName: 'UTC'
    },
    trackMetric: _.noop
  }
  _.defaults(options, defaults)

  if (!(parentElement instanceof HTMLElement)) {
    throw new Error('Sorry, you must provide a DOM element! :(')
  }

  const width = Math.max(640, parentElement.offsetWidth)
  const height = Math.max(480, parentElement.offsetHeight)
  const emitter = new EventEmitter()
  const chart = oneDay(emitter, options)

  // ***
  // Basic chart set up
  // ***

  chart.id(parentElement.id).width(width).height(height)
  d3.select(parentElement).call(chart)
  // ***
  // Setup Pools
  // ***

  // top x-axis pool
  /** @type {Pool} */
  const poolXAxis = new Pool(chart)
  chart.addPool(poolXAxis)
  poolXAxis.id('poolXAxis', chart.poolGroup)
    .heightRatio(0.65)
    .gutterWeight(0.0)

  // messages pool
  /** @type {Pool} */
  const poolMessages = new Pool(chart)
  chart.addPool(poolMessages)
  const poolMessagesId = 'poolMessages'
  poolMessages
    .id('poolMessages', chart.poolGroup)
    .dataTestId('messages-section', poolMessagesId)
    .heightRatio(0.5)
    .gutterWeight(0.0)

  // blood glucose data pool
  /** @type {Pool} */
  const poolBG = new Pool(chart)
  chart.addPool(poolBG)
  const poolBGId = 'poolBG'
  poolBG
    .id('poolBG', chart.poolGroup)
    .dataTestId('bg-section', poolBGId)
    .labels([{
      spans: [{
        text: t('Glucose'),
        className: 'label-main'
      }, {
        text: ` (${t(chart.options.bgUnits)})`,
        className: 'label-light'
      }],
      baseline: options.labelBaseline
    }])
    .legends([{ name: 'bg', baseline: options.labelBaseline }])
    .heightRatio(2.15)
    .gutterWeight(1.0)

  // Events data pool
  /** @type {Pool} */
  const poolEvents = new Pool(chart)
  chart.addPool(poolEvents)
  const poolEventsId = 'poolEvents'
  poolEvents
    .id('poolEvents', chart.poolGroup)
    .dataTestId('events-section', poolEventsId)
    .labels([{
      spans: [{
        text: t('Events'),
        className: 'label-main'
      }],
      baseline: options.labelBaseline
    }])
    .heightRatio(0.5)
    .gutterWeight(1.0)

  // carbs and boluses data pool
  /** @type {Pool} */
  const poolBolus = new Pool(chart)
  chart.addPool(poolBolus)
  const poolBolusId = 'poolBolus'
  poolBolus
    .id('poolBolus', chart.poolGroup)
    .dataTestId('bolus-section', poolBolusId)
    .labels([{
      spans: [{
        text: t('Bolus'),
        className: 'label-main'
      }, {
        text: ` (${t('U')})`,
        className: 'label-light'
      }, {
        text: ` & ${t('Carbohydrates')}`,
        className: 'label-main'
      }, {
        text: ` (${t('g')})`,
        className: 'label-light'
      }],
      baseline: options.labelBaseline
    }])
    .legends([{
      name: 'carbs',
      baseline: options.labelBaseline + 18
    }, {
      name: 'bolus',
      baseline: options.labelBaseline
    }])
    .heightRatio(1.5)
    .gutterWeight(1.5)

  // basal data pool
  /** @type {Pool} */
  const poolBasal = new Pool(chart)
  chart.addPool(poolBasal)
  const poolBasalId = 'poolBasal'
  poolBasal
    .id('poolBasal', chart.poolGroup)
    .dataTestId('basal-section', poolBasalId)
    .labels([{
      main: t('Basal Rates'),
      light: ` (${t('U')}/${t('abbrev_duration_hour')})`,
      spans: [{
        text: t('Basal Rates'),
        className: 'label-main'
      }, {
        text: ` (${t('U')}/${t('abbrev_duration_hour')})`,
        className: 'label-light'
      }],
      baseline: options.labelBaseline
    }])
    .legends([{ name: 'basal', baseline: options.labelBaseline }])
    .heightRatio(1.0)
    .gutterWeight(1.0)

  chart.arrangePools()
  chart.setTooltip()

  // add tooltips
  chart.tooltips.addGroup(poolMessages, {
    type: 'deviceEvent',
    shape: 'generic'
  })
  chart.tooltips.addGroup(poolMessages, {
    type: 'message',
    shape: 'generic'
  })
  chart.tooltips.addGroup(poolEvents, {
    type: 'event',
    shape: 'generic'
  })
  chart.tooltips.addGroup(poolBG, {
    type: 'cbg',
    classes: ['d3-bg-low', 'd3-bg-target', 'd3-bg-high']
  })
  chart.tooltips.addGroup(poolBG, {
    type: 'smbg'
  })
  chart.tooltips.addGroup(poolBolus, {
    type: 'wizard',
    shape: 'generic'
  })
  chart.tooltips.addGroup(poolBolus, {
    type: 'bolus',
    shape: 'generic'
  })
  chart.tooltips.addGroup(poolBasal, {
    type: 'basal'
  })

  // ***
  // Initialize chart with data
  // ***
  chart.data(tidelineData).setAxes().setNav().setScrollNav()

  // x-axis pools
  // add ticks to top x-axis pool
  poolXAxis.addPlotType({ type: 'fill' }, axesDailyx(poolXAxis, {
    class: 'd3-top',
    emitter,
    leftEdge: chart.axisGutter(),
    timePrefs: chart.options.timePrefs,
    tidelineData
  }))

  // setup axis & main y scale
  poolBG.axisScaleFn(createYAxisBG)
  // add background fill rectangles to BG pool
  poolBG.addPlotType({ type: 'fill' }, fill(poolBG, {
    endpoints: chart.endpoints,
    isDaily: true,
    guidelines: [
      {
        class: 'd3-line-bg-threshold-low',
        height: chart.options.bgClasses.low
      },
      {
        class: 'd3-line-bg-threshold-high',
        height: chart.options.bgClasses.target
      }
    ]
  }))

  poolEvents.addPlotType({ type: 'fill' }, fill(poolEvents, {
    emitter,
    isDaily: true,
    cursor: 'cell'
  }))

  poolEvents.addPlotType({ type: 'deviceEvent' }, plotZenModeEvent(poolEvents, {
    tidelineData
  }))

  poolEvents.addPlotType({ type: 'physicalActivity' }, plotPhysicalActivity(poolEvents, {
    onPhysicalHover: options.onPhysicalHover,
    onPhysicalOut: options.onTooltipOut,
    tidelineData
  }))

  poolEvents.addPlotType({ type: 'deviceEvent' }, plotReservoirChange(poolEvents, {
    onReservoirHover: options.onReservoirHover,
    onReservoirOut: options.onTooltipOut
  }))

  poolEvents.addPlotType({ type: 'deviceEvent' }, plotDeviceParameterChange(poolEvents, {
    tidelineData,
    onParameterHover: options.onParameterHover,
    onParameterOut: options.onTooltipOut
  }))

  poolEvents.addPlotType({ type: 'deviceEvent' }, plotWarmUp(poolEvents, {
    tidelineData,
    onWarmUpHover: options.onWarmUpHover,
    onWarmUpOut: options.onTooltipOut
  }))

  poolEvents.addPlotType({ type: 'deviceEvent' }, plotAlarmEvent(poolEvents, {
    tidelineData,
    onAlarmEventHover: options.onAlarmEventHover,
    onAlarmEventOut: options.onTooltipOut
  }))

  // Add confidential mode to Events pool: Must be the last in the pool to mask stuff below
  poolEvents.addPlotType({ type: 'deviceEvent', name: 'confidential' }, plotConfidentialModeEvent(poolEvents, {
    tidelineData,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onTooltipOut
  }))

  // add CBG data to BG pool
  poolBG.addPlotType({ type: 'cbg' }, plotCbg(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onCBGHover: options.onCBGHover,
    onCBGOut: options.onTooltipOut
  }))

  // add SMBG data to BG pool
  poolBG.addPlotType({ type: 'smbg' }, plotSmbg(poolBG, {
    bgUnits: chart.options.bgUnits,
    classes: chart.options.bgClasses,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onSMBGHover: options.onSMBGHover,
    onSMBGOut: options.onTooltipOut
  }))

  // Add confidential mode to BG pool: Must be the last in the pool to mask stuff below
  poolBG.addPlotType({ type: 'deviceEvent', name: 'confidential' }, plotConfidentialModeEvent(poolBG, {
    tidelineData,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onTooltipOut
  }))

  // setup axis & main y scale
  poolBolus.axisScaleFn(createYAxisBolus)
  // add background fill rectangles to bolus pool
  poolBolus.addPlotType({ type: 'fill' }, fill(poolBolus, {
    endpoints: chart.endpoints,
    isDaily: true
  }))

  // add wizard data to wizard pool
  poolBolus.addPlotType({ type: 'wizard' }, plotWizard(poolBolus, {
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onBolusHover: options.onBolusHover,
    onBolusOut: options.onTooltipOut
  }))

  poolBolus.addPlotType({ type: 'food' }, plotCarb(poolBolus, {
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onCarbHover: options.onCarbHover,
    onCarbOut: options.onTooltipOut
  }))

  // quick bolus data to wizard pool
  poolBolus.addPlotType({ type: 'bolus' }, plotQuickbolus(poolBolus, {
    subdueOpacity: 0.4,
    timezoneAware: chart.options.timePrefs.timezoneAware,
    onBolusHover: options.onBolusHover,
    onBolusOut: options.onTooltipOut
  }))

  // Add confidential mode to Bolus pool: Must be the last in the pool to mask stuff below
  poolBolus.addPlotType({ type: 'deviceEvent', name: 'confidential' }, plotConfidentialModeEvent(poolBolus, {
    tidelineData,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onTooltipOut
  }))

  // setup axis & main y scale
  poolBasal.axisScaleFn(createYAxisBasal)
  // add background fill rectangles to basal pool
  poolBasal.addPlotType({ type: 'fill' }, fill(poolBasal, {endpoints: chart.endpoints, isDaily: true}))

  // add basal data to basal pool
  poolBasal.addPlotType({ type: 'basal' }, plotBasal(poolBasal, {
    defaultSource: tidelineData.opts.defaultSource
  }))

  // Add confidential mode to Basal pool: Must be the last in the pool to mask stuff below
  poolBasal.addPlotType({ type: 'deviceEvent', name: 'confidential' }, plotConfidentialModeEvent(poolBasal, {
    tidelineData,
    onConfidentialHover: options.onConfidentialHover,
    onConfidentialOut: options.onTooltipOut
  }))

  // messages pool
  // add background fill rectangles to messages pool
  poolMessages.addPlotType({ type: 'fill' }, fill(poolMessages, {
    emitter,
    isDaily: true,
    cursor: 'cell'
  }))

  // add message images to messages pool
  poolMessages.addPlotType({ type: 'message' }, plotMessage(poolMessages, {
    size: 30,
    emitter
  }))

  // add timechange images to messages pool
  poolMessages.addPlotType({ type: 'deviceEvent' }, plotTimeChange(poolMessages, {
    size: 30
  }))

  return chart
}

export default chartDailyFactory
