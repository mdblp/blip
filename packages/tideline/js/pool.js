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

import { plotPoolLabel } from 'dumb'

import { drawLegend } from './plot/util/legend'

/**
 * @typedef {import('./tidelinedata').default} MedicalDataService
 * @typedef {import('./tidelinedata').Datum} Datum
 * @typedef {import("./oneday").OneDay} OneDay
 * @typedef {{ type: string; name: string; plot: function; pan: boolean; data: Datum[]; }} PlotType
 * @typedef { import('d3').ScaleContinuousNumeric<number, number> } ScaleContinuousNumeric
 *
 * @typedef {(tidelineData: MedicalDataService, pool: Pool) => { scale: ScaleContinuousNumeric }} AxisScaleFunc
 * @typedef {import('dumb').Guideline} Guideline
 * @typedef {(axisScale: ReturnType<AxisScaleFunc>) => Guideline[]} GuidelinesFn
 * @typedef {{ spans: { text: string; className: string; }[]; baseline: number}[]} Labels
 * @typedef {{ name: string; baseline: number }[]} Legends
 */

const guidelinesPlotName = 'guidelines'

/**
 * A pool: An horizontal graph for the daily view
 * @param {OneDay} container OneDay container
 * @param shouldDisplayEatingShortlyLegend Whether to display the "Meal without carb counting" legend
 */
function Pool(container, shouldDisplayEatingShortlyLegend = false) {
  const minHeight = 20
  const maxHeight = 300

  let mainSVG = d3.select('#' + container.id())
  // The container-wide group hosting the guideline chips of every pool (see Pool#chipGroup).
  // Resolved once here since #tidelineChips is created by the OneDay container before any pool
  // is constructed, and cached rather than re-queried by DOM id on every render.
  let chipsContainer = mainSVG.select('#tidelineChips')
  let id = ''
  let dataTestId = ''
  let yPosition = 0
  let gutterWeight = 0
  /** @type {Labels} Chart name for the user */
  let labels = null
  /** @type {Legends} */
  let legends = null
  let heightRatio = 0
  let hidden = false
  let group = null

  let height = minHeight
  /** @type {ScaleContinuousNumeric} */
  let xScale = null
  let yScale = null
  /** @type {PlotType[]} */
  let plotTypes = []
  /** @type {AxisScaleFunc} */
  let defaultAxisScaleFn = null
  /** @type {ReturnType<AxisScaleFunc>} */
  let axisScale = null
  /** @type {GuidelinesFn} */
  let defaultGuidelinesFn = null
  /** @type {Guideline[]} */
  let guidelines = []
  let guidelinesPlot = null

  const updateGuidelines = () => {
    guidelines = _.isFunction(defaultGuidelinesFn) && axisScale ? defaultGuidelinesFn(axisScale) : []
  }

  const rebuildAxisScale = () => {
    axisScale = defaultAxisScaleFn(container.tidelineData, this)
    yScale = axisScale.scale
    updateGuidelines()
  }

  this.destroy = function() {
    plotTypes.forEach((plotType) => {
      if (typeof plotType.plot.destroy === 'function') {
        plotType.plot.destroy()
      }
    })
    mainSVG = null
    chipsContainer = null
    labels = null
    legends = null
    group = null
    xScale = null
    yScale = null
    plotTypes = null
    defaultAxisScaleFn = null
    axisScale = null
    defaultGuidelinesFn = null
    guidelines = []
    guidelinesPlot = null
    container = null
  }

  /**
   * Render the daily view elements
   * @param {Datum[]} poolData The data to render
   * @param {boolean} updateScale true to rebuild the scales
   */
  this.render = function(poolData, updateScale = false) {
    if (updateScale && _.isFunction(defaultAxisScaleFn)) {
      rebuildAxisScale()
    }

    const poolDataByType = _.groupBy(poolData, 'type')
    plotTypes.forEach((plotType) => {
      const { type, name } = plotType
      if (type in container.dataFill) {
        const data = poolDataByType[type] ?? []
        const dataGroup = group.selectAll(`#${id}_${name}`).data([data])
        const dataGroupWithId = dataGroup.join('g').attr('id', `${id}_${name}`)
        dataGroupWithId.call(plotType.plot)
      } else {
        console.warn(`Pool: ${type} not in dataFill`, { type, name, dataFill: container.dataFill })
      }
    })

    this.drawLegend()
  }

  this.clear = function() {
    plotTypes.forEach(({ type, name }) => {
      if (container.dataFill[type]) {
        group.select(`#${id}_${name}`).remove()
      }
    })
    // Chips are not in the pool's own group, see Pool#chipGroup
    chipsContainer.select(`#${id}_guideline_chips`).remove()
  }

  /**
   * Rebuild the Y scale and the guidelines from the current data, then redraw the guidelines.
   * To call when an input of the GuidelinesFn other than the data (e.g. the target value) changes.
   */
  this.refreshGuidelines = function() {
    if (!_.isFunction(defaultAxisScaleFn)) {
      return
    }

    rebuildAxisScale()

    const plotGroup = group.select(`#${id}_${guidelinesPlotName}`)
    // Not rendered yet: the first render draws them
    if (!plotGroup.empty()) {
      plotGroup.call(guidelinesPlot)
    }
  }

  // non-chainable methods
  this.pan = function(translateX) {
    plotTypes.forEach(({ pan, name }) => {
      if (pan) {
        mainSVG.select(`#${id}_${name}`).attr('transform', `translate(${translateX},0)`)
      }
    })
  }

  // getters only
  this.group = function() {
    return group
  }

  this.parent = function() {
    return mainSVG
  }

  /**
   * The group hosting the guideline chips of this pool, at the pool position.
   * It sits outside the pools' clip path so chips can be drawn in the axis gutter.
   */
  this.chipGroup = function() {
    const chipGroupId = `${id}_guideline_chips`
    return chipsContainer.selectAll(`#${chipGroupId}`)
      .data([null])
      .join('g')
      .attr('id', chipGroupId)
      .attr('data-testid', chipGroupId)
      .attr('transform', `translate(0,${yPosition})`)
  }

  /**
   * The guidelines computed by the GuidelinesFn from the current axis scale
   * @returns {Guideline[]}
   */
  this.guidelines = function() {
    return guidelines
  }

  this.width = function() {
    return container.width() - container.axisGutter()
  }

  // only once methods
  this.drawLegend = _.once(function() {
    if (!Array.isArray(legends) || legends.length < 1) {
      return
    }
    legends.forEach((legend) => {
      const x = (this.width() + container.axisGutter()).toString(10)
      const y = (yPosition - legend.baseline).toString(10)
      const legendGroup = mainSVG.select('#tidelineLabels')
        .append('g')
        .attr('id', `${id}_legend_${legend.name}`)
        .attr('data-testid', `${id}_legend_${legend.name}`)
        .attr('transform', `translate(${x},${y})`)

      drawLegend(legendGroup, legend.name, shouldDisplayEatingShortlyLegend)
    })
  })

  // getters & setters
  this.id = function(x, selection) {
    if (!arguments.length) return id
    id = x
    group = selection.append('g').attr('id', id)
    return this
  }

  this.dataTestId = function(x, id) {
    if (!arguments.length) return dataTestId
    dataTestId = x
    const group = mainSVG.select(`#${id}`)
    group.attr('data-testid', dataTestId)
    return this
  }

  this.labels = function(/** @type {Labels} */ l) {
    if (!arguments.length) return labels
    labels = l
    return this
  }

  this.legends = function(a) {
    if (!arguments.length) return legends
    legends = a
    return this
  }

  this.heightRatio = function(x) {
    if (!arguments.length) return heightRatio
    heightRatio = x
    return this
  }

  this.height = function(x) {
    if (!arguments.length) return height
    x = x * this.heightRatio()
    if (x <= maxHeight) {
      if (x >= minHeight) {
        height = x
      }
      else {
        height = minHeight
      }
    }
    else {
      height = maxHeight
    }
    return this
  }

  this.gutterWeight = function(x) {
    if (!arguments.length) return gutterWeight
    gutterWeight = x
    return this
  }

  this.hidden = function(x) {
    if (!arguments.length) return hidden
    if (x === true) {
      hidden = true
    }
    return this
  }

  this.yPosition = function(x) {
    if (!arguments.length) return yPosition
    yPosition = x
    plotPoolLabel(this, container.axisGutter(), labels)
    return this
  }


  /**
   * @param {ScaleContinuousNumeric} scale
   * @returns {ScaleContinuousNumeric}
   */
  this.xScale = (scale = null) => {
    if (scale !== null) {
      xScale = scale
    }
    return xScale
  }

  /**
   * Default pool scaling. Most (all) of them have only
   * one main scaling (outide fixed size, like pool height)
   * @returns {ScaleContinuousNumeric}
   */
  this.yScale = () => {
    if (yScale === null) {
      throw new Error(`yScale === null (${id})`)
    }
    return yScale
  }

  /**
   * Registers the Y axis scale function and (re)builds the scale and the guidelines with it
   * @param {AxisScaleFunc} [fn] Omit to use this as a getter for the currently registered fn.
   * @returns {AxisScaleFunc}
   */
  this.axisScaleFn = function(fn) {
    // Called as a getter (no fn, e.g. a bare axisScaleFn()): return the currently registered
    // one instead of throwing by calling a non-function below.
    if (typeof fn !== 'function') {
      return defaultAxisScaleFn
    }

    defaultAxisScaleFn = fn
    rebuildAxisScale()
    return defaultAxisScaleFn
  }

  /**
   * Registers how to compute this pool's guidelines from the axisScale object produced by its
   * axisScaleFn. They are recomputed every time the scale is rebuilt, so they stay derived
   * from the same (fresh) data as the scale they're drawn against.
   * @param {GuidelinesFn} fn
   * @returns {GuidelinesFn}
   */
  this.guidelinesFn = function(fn) {
    defaultGuidelinesFn = fn
    updateGuidelines()
    return defaultGuidelinesFn
  }

  /**
   * Add the plot drawing the guidelines computed by the GuidelinesFn. They span the whole
   * visible width, so they are not panned with the data.
   * @param { (pool: Pool, opts?: object) => () => void } plotFunction
   */
  this.addGuidelinesPlotType = function(plotFunction) {
    guidelinesPlot = plotFunction
    this.addPlotType({ type: 'fill', name: guidelinesPlotName, pan: false }, plotFunction)
  }

  /**
   * @param {{ type: string; name?: string; dataFill?: boolean; pan?: boolean;}} plotOptions
   * by default the plot name is the data type. pan & dataFill set to true
   * @param { (pool: Pool, opts?: object) => () => void } plotFunction
   */
  this.addPlotType = function addPlotType({ type, name, dataFill = true, pan = true }, plotFunction) {
    plotTypes.push({
      type,
      name: name ?? type,
      plot: plotFunction,
      pan
    })
    if (dataFill) {
      container.dataFill[type] = true
    }
  }

  this.highlight = function(background, opts) {
    opts = _.defaults(opts || {}, {
      subdueOpacity: 0.6
    })

    return {
      on: function(el) {
        if(_.isString(background)) {
          background = mainSVG.selectAll(background)
        }

        background.attr('opacity', opts.subdueOpacity)
        el.attr('opacity', 1)
      },
      off: function() {
        if(_.isString(background)) {
          background = mainSVG.selectAll(background)
        }

        background.attr('opacity', 1)
      }
    }
  }

  /**
   * Filter for special data. Do like updateRenderedData().
   * Used for zenMode, physicalActivities...
   * @param {Datum[]} data Array of tideline datum
   * @returns {Datum[]} A filtered array of datum to be displayed
   */
  this.filterDataForRender = function filterDataForRender(data) {
    return container.filterDataForRender(data)
  }

  return this
}

export default Pool
