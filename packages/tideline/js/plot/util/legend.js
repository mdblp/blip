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

const t = i18next.t.bind(i18next)

const rectLoopMode = 7
const BOLUS_RIDE_COLOR = 'white'
const BOLUS_RIDE_BORDER_COLOR = 'black'
const BOLUS_RIDE_BORDER_WIDTH = 0.5
const BOLUS_RIDE_X_LOCATION = -12

const BG_LEGEND_COMMON_CLASSES = 'd3-smbg d3-circle-smbg'
const BOLUS_LEGEND_COMMON_CLASSES = 'd3-bolus d3-rect-bolus-legend'

const ICON_TYPE_CIRCLE = 'circle'
const ICON_TYPE_SQUARE = 'rect'

const SHAPE_MARGIN = 3

const getLegendIcon = (iconType, customClasses, customWidthFactor = 1) => {
  const widthFactor = iconType === ICON_TYPE_SQUARE ? 1.5 : 1

  return {
    create: function (opts) {
      opts.widths.push(opts.SHAPE_WIDTH * customWidthFactor * widthFactor)
      return opts.selection.append(iconType)
        .classed(customClasses, true)
    },
    type: iconType
  }
}

const getMealWithoutCarbCountingLegendItems = (shouldDisplayEatingShortlyLegend) => {
  if (!shouldDisplayEatingShortlyLegend) {
    return []
  }

  return [
    getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-eating-shortly`),
    {
      create: (opts) => {
        return opts.selection.append('text')
          .classed('d3-pool-legend', true)
          .text(t('meal-without-carb-counting'))
          .each(function () {
            opts.widths.push(this.getBoundingClientRect().width - SHAPE_MARGIN)
            opts.textHeight = this.getBoundingClientRect().height
          })
      },
      type: 'text'
    }
  ]
}

const getLegend = (shouldDisplayEatingShortlyLegend) => {
  const shapeMargin = 3
  const shapeWidth = 15.5

  return {
    SHAPE_MARGIN: shapeMargin,
    SHAPE_WIDTH: shapeWidth,
    basal: [
      {
        create: (opts) => {
          opts.widths.push(4 * rectLoopMode + shapeMargin)
          const g = opts.selection
            .append('g')
            .classed('d3-basal d3-basal-loop-mode-off', true)
          g.append('rect')
            .classed('d3-basal-background', true)
            .attr('x', -rectLoopMode * 4)
            .attr('y', -rectLoopMode)
            .attr('width', rectLoopMode * 4)
            .attr('height', rectLoopMode * 2)
            .attr('rx', rectLoopMode / 2.0)
          g.append('text')
            .classed('d3-basal-label', true)
            .attr('transform', `translate(${-rectLoopMode * 2}, ${-rectLoopMode / 2.0})`)
            .text(t('M_Label'))
          return g
        },
        type: 'group'
      },
      {
        create: (opts) => {
          opts.widths.push(4 * rectLoopMode + shapeMargin)
          const g = opts.selection
            .append('g')
            .classed('d3-basal d3-basal-loop-mode', true)
          g
            .append('rect')
            .classed('d3-basal-background', true)
            .attr('x', -rectLoopMode * 4)
            .attr('y', -rectLoopMode)
            .attr('width', rectLoopMode * 4)
            .attr('height', rectLoopMode * 2)
            .attr('rx', rectLoopMode / 2.0)
          g
            .append('text')
            .classed('d3-basal-label', true)
            .attr('transform', `translate(${-rectLoopMode * 2}, ${-rectLoopMode / 2.0})`)
            .text(t('Loop mode'))
            .text(t('A_Label'))
          return g
        },
        type: 'group'
      },
      {
        create: (opts) => {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Loop mode status'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width + shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      }
    ],
    bg: [
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('high'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-very-high`),
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-high`),
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-target`),
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-tight-range`),
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-low`),
      getLegendIcon(ICON_TYPE_CIRCLE, `${BG_LEGEND_COMMON_CLASSES} d3-bg-very-low`),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend d3-pool-legend-space', true)
            .text(t('low') + ' ')
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width)
            })
        },
        type: 'text'
      },
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend d3-pool-legend-dexcom', true)
            .text('Dexcom CGM -')
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width)
            })
        },
        type: 'text'
      }
    ],
    bolus: [
      // Bolus Text
      {
        create: (opts) => {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Bolus Legend'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Meal Bolus
      getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-meal`),
      {
        create: (opts) => {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Meal Bolus'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Meal Bolus without carb counting
      ...getMealWithoutCarbCountingLegendItems(shouldDisplayEatingShortlyLegend),
      // Correction Bolus
      getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-correction`),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Correction'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Manual Bolus
      getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-manual`),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Manual Bolus'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Pen Bolus
      getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-pen`),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('bolus_pen'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Undelivered
      getLegendIcon(ICON_TYPE_SQUARE, `${BOLUS_LEGEND_COMMON_CLASSES} d3-bolus-undelivered`),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Undelivered'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      // Override (technically an Underride)
      {
        create: function (opts) {
          opts.widths.push(25)
          const g = opts.selection
            .append('g')
            .classed('d3-bolus d3-rect-bolus-legend', true)
          g.append('path')
            .attr('d', function () {
              const x = BOLUS_RIDE_X_LOCATION
              const y = -12
              return `M ${x} ${y} l 5 5 l -10 0 z`
            })
            .attr('fill', BOLUS_RIDE_COLOR)
            .attr('stroke', BOLUS_RIDE_BORDER_COLOR)
            .attr('stroke-width', BOLUS_RIDE_BORDER_WIDTH)

          g.append('path')
            .attr('d', function () {
              const x = BOLUS_RIDE_X_LOCATION
              const y = 0
              return `M ${x} ${y} l 5 -5 l -10 0 z`
            })
            .attr('fill', BOLUS_RIDE_COLOR)
            .attr('stroke', BOLUS_RIDE_BORDER_COLOR)
            .attr('stroke-width', BOLUS_RIDE_BORDER_WIDTH)
          return g
        },
        type: 'group'
      },
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Override'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width - shapeMargin)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      }
    ].reverse(),
    carbs: [
      getLegendIcon(ICON_TYPE_CIRCLE, 'd3-circle-carbs-legend'),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Carbs'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      },
      getLegendIcon(ICON_TYPE_CIRCLE, 'd3-circle-rescuecarbs-legend', 1.5),
      {
        create: function (opts) {
          return opts.selection.append('text')
            .classed('d3-pool-legend', true)
            .text(t('Rescuecarbs'))
            .each(function () {
              opts.widths.push(this.getBoundingClientRect().width)
              opts.textHeight = this.getBoundingClientRect().height
            })
        },
        type: 'text'
      }
    ].reverse(),
    cumWidth: function (a, i) {
      var b = a.slice()
      b.splice(i)
      return _.reduce(b, function (sum, num) {
        return sum + num
      })
    },
    draw: function (selection, type) {
      const opts = {
        selection: selection,
        widths: [],
        SHAPE_WIDTH: this.SHAPE_WIDTH
      }
      const typeFns = this[type]
      _.forEach(typeFns, _.bind(function (fn, i) {
        const created = fn.create(opts)
        if (fn.type === 'text' || fn.type === 'group') {
          if (opts.widths[i - 1]) {
            const w = this.cumWidth(opts.widths, i)
            if ((i === typeFns.length - 1) && (i !== 1)) {
              const s = shapeWidth - shapeMargin * 2
              created.attr('transform', 'translate(' + (-(w + s / 2)) + ',0)')
            } else {
              created.attr('transform', 'translate(' + (-w) + ',0)')
            }
          }
        } else if (fn.type === 'circle') {
          if (opts.widths[i - 1]) {
            const w = this.cumWidth(opts.widths, i)
            const r = (shapeWidth - shapeMargin * 2) / 2
            created
              .attr('cx', -(w + 2 * r))
              .attr('cy', -opts.textHeight / 4)
              .attr('r', r)
          }
        } else if (fn.type === 'rect') {
          const side = shapeWidth - shapeMargin * 2
          created
            .attr('width', side)
            .attr('height', side)
          if (opts.widths[i - 1]) {
            const w = this.cumWidth(opts.widths, i)
            created
              .attr('x', -w - shapeWidth)
          } else {
            created
              .attr('x', -side - 1.5)
          }
        }
      }, this))
      if (type !== 'bg') {
        // a y-attribute of 0 would put the top of the rects *at* the text baseline
        // so an upward (negative) shift of half the shape width works well
        var baselineShift = -(this.SHAPE_WIDTH / 2 + this.SHAPE_MARGIN)
        selection.selectAll('rect')
          .attr('y', baselineShift)
      }
      var w
      selection.each(function () {
        w = this.getBoundingClientRect()
      })
      return w
    }
  }
}

export const drawLegend = (selection, type, shouldDisplayEatingShortlyLegend) => {
  const legendWithToggle = getLegend(shouldDisplayEatingShortlyLegend)
  legendWithToggle.draw(selection, type)
}

