/*
 * Copyright (c) 2026, Diabeloop
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as d3 from 'd3'
import { t } from 'i18next'
import { CSS_CLASSES } from '../../../../models/constants/plot.constants'
import { PoolLegendType } from '../../../../models/enums/pool-legend-type.enum'
import { PoolLegend } from '../../../../models/plot-methods/pool-legend.model'

type LegendPool = {
  id: () => string
  yPosition: () => number
  width: () => number
  parent: () => d3.Selection<SVGElement, unknown, null, undefined>
}

type LegendGroup = d3.Selection<SVGGElement, unknown, null, undefined>

enum LegendItemType {
  Circle = 'circle',
  Group = 'group',
  Rect = 'rect',
  Text = 'text'
}

type LegendItem = {
  type: LegendItemType.Text
  className: string
  text: string
  /** Added to the measured text width to space it from the next item */
  widthAdjustment: number
} | {
  type: LegendItemType.Circle | LegendItemType.Rect
  className: string
  widthFactor: number
} | {
  type: LegendItemType.Group
  width: number
  draw: (legendGroup: LegendGroup) => LegendGroup
}

const SHAPE_MARGIN = 3
const SHAPE_WIDTH = 15.5
const SHAPE_SIDE = SHAPE_WIDTH - SHAPE_MARGIN * 2
const RECT_WIDTH_FACTOR = 1.5
// A y of 0 would put the top of the rects at the text baseline, so shift them up
const RECT_Y = -(SHAPE_WIDTH / 2 + SHAPE_MARGIN)

const BASAL_BADGE_SIZE = 7
const BOLUS_RIDE_X = -12
const BOLUS_RIDE_WIDTH = 25

const LEGEND_TEXT_CLASS = 'd3-pool-legend'
const BG_LEGEND_CLASSES = 'd3-smbg d3-circle-smbg'
const BOLUS_LEGEND_CLASSES = `${CSS_CLASSES.BOLUS} d3-rect-bolus-legend`

const text = (content: string, widthAdjustment = 0, className = LEGEND_TEXT_CLASS): LegendItem => ({
  type: LegendItemType.Text,
  className,
  text: content,
  widthAdjustment
})

const circle = (className: string, widthFactor = 1): LegendItem => ({ type: LegendItemType.Circle, className, widthFactor })

const rect = (className: string): LegendItem => ({ type: LegendItemType.Rect, className, widthFactor: RECT_WIDTH_FACTOR })

const basalBadge = (className: string, labelKey: string): LegendItem => ({
  type: LegendItemType.Group,
  width: 4 * BASAL_BADGE_SIZE + SHAPE_MARGIN,
  draw: (legendGroup) => {
    const badge = legendGroup.append('g').classed(`d3-basal ${className}`, true)
    badge.append('rect')
      .classed('d3-basal-background', true)
      .attr('x', -BASAL_BADGE_SIZE * 4)
      .attr('y', RECT_Y)
      .attr('width', BASAL_BADGE_SIZE * 4)
      .attr('height', BASAL_BADGE_SIZE * 2)
      .attr('rx', BASAL_BADGE_SIZE / 2)
    badge.append('text')
      .classed('d3-basal-label', true)
      .attr('transform', `translate(${-BASAL_BADGE_SIZE * 2}, ${-BASAL_BADGE_SIZE / 2})`)
      .text(t(labelKey))
    return badge
  }
})

const bolusRide: LegendItem = {
  type: LegendItemType.Group,
  width: BOLUS_RIDE_WIDTH,
  draw: (legendGroup) => {
    const ride = legendGroup.append('g').classed(BOLUS_LEGEND_CLASSES, true)
    const paths = [`M ${BOLUS_RIDE_X} -12 l 5 5 l -10 0 z`, `M ${BOLUS_RIDE_X} 0 l 5 -5 l -10 0 z`]
    paths.forEach((path) => {
      ride.append('path')
        .attr('d', path)
        .attr('fill', 'white')
        .attr('stroke', 'black')
        .attr('stroke-width', 0.5)
    })
    return ride
  }
}

// Items are listed in drawing order: from right to left, the legend title being the last one
const getLegendItems = (legend: PoolLegend): LegendItem[] => {
  switch (legend.type) {
    case PoolLegendType.Basal:
      return [
        basalBadge('d3-basal-loop-mode-off', 'M_Label'),
        basalBadge('d3-basal-loop-mode', 'A_Label'),
        text(t('Loop mode status'), SHAPE_MARGIN)
      ]
    case PoolLegendType.Bg:
      return [
        text(t('high')),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_VERY_HIGH}`),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_HIGH}`),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_TARGET}`),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_TIGHT_RANGE}`),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_LOW}`),
        circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_VERY_LOW}`),
        text(`${t('low')} `, 0, `${LEGEND_TEXT_CLASS} d3-pool-legend-space`),
        text('Dexcom CGM -', 0, `${LEGEND_TEXT_CLASS} d3-pool-legend-dexcom`)
      ]
    case PoolLegendType.Bolus:
      return [
        text(t('Override'), -SHAPE_MARGIN),
        bolusRide,
        text(t('Undelivered'), -SHAPE_MARGIN),
        rect(`${BOLUS_LEGEND_CLASSES} d3-bolus-undelivered`),
        text(t('bolus_pen'), -SHAPE_MARGIN),
        rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_PEN}`),
        text(t('Manual Bolus'), -SHAPE_MARGIN),
        rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_MANUAL}`),
        text(t('Correction'), -SHAPE_MARGIN),
        rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_CORRECTION}`),
        ...(legend.shouldDisplayEatingShortly ? [
          text(t('meal-without-carb-counting'), -SHAPE_MARGIN),
          rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_EATING_SHORTLY}`)
        ] : []),
        text(t('Meal Bolus'), -SHAPE_MARGIN),
        rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_MEAL}`),
        text(t('Bolus Legend'), -SHAPE_MARGIN)
      ]
    case PoolLegendType.Carbs:
      return [
        text(t('Rescuecarbs')),
        circle('d3-circle-rescuecarbs-legend', 1.5),
        text(t('Carbs')),
        circle('d3-circle-carbs-legend')
      ]
    default:
      return []
  }
}

/**
 * Lay out the legend items from right to left, each one shifted by the cumulated width
 * of the items drawn before it.
 */
const drawLegendItems = (legendGroup: LegendGroup, items: LegendItem[]): void => {
  const widths: number[] = []
  let textHeight = 0

  items.forEach((item, index) => {
    const offset = widths.reduce((sum, width) => sum + width, 0)
    // The legend title is spaced a bit more from the items
    const textOffset = index === items.length - 1 ? offset + SHAPE_SIDE / 2 : offset

    switch (item.type) {
      case LegendItemType.Text: {
        const textElement = legendGroup.append('text')
          .classed(item.className, true)
          .text(item.text)
        const { width, height } = (textElement.node() as SVGTextElement).getBoundingClientRect()
        widths.push(width + item.widthAdjustment)
        textHeight = height
        if (index > 0) {
          textElement.attr('transform', `translate(${-textOffset},0)`)
        }
        break
      }
      case LegendItemType.Group: {
        const group = item.draw(legendGroup)
        widths.push(item.width)
        if (index > 0) {
          group.attr('transform', `translate(${-textOffset},0)`)
        }
        break
      }
      case LegendItemType.Circle: {
        const radius = SHAPE_SIDE / 2
        widths.push(SHAPE_WIDTH * item.widthFactor)
        legendGroup.append('circle')
          .classed(item.className, true)
          .attr('cx', -(offset + 2 * radius))
          .attr('cy', -textHeight / 4)
          .attr('r', radius)
        break
      }
      case LegendItemType.Rect:
        widths.push(SHAPE_WIDTH * item.widthFactor)
        legendGroup.append('rect')
          .classed(item.className, true)
          .attr('width', SHAPE_SIDE)
          .attr('height', SHAPE_SIDE)
          .attr('x', -offset - SHAPE_WIDTH)
          .attr('y', RECT_Y)
        break
    }
  })
}

/**
 * Plot the legend(s) of a daily chart pool (e.g. the glucose ranges), in the chart's
 * shared labels layer, right-aligned at the end of the pool at the pool's position.
 *
 * Like the pool labels, `legends` is a static, pool-specific configuration set once and
 * never updated, so this renders directly rather than through a D3 enter/update/exit join.
 *
 * @param pool - The pool to draw the legend(s) for
 * @param axisGutter - Width of the axis gutter, on the left of the pool
 * @param legends - The legend(s) to draw
 *
 * @example
 * ```typescript
 * plotPoolLegend(pool, container.axisGutter(), [{ type: PoolLegendType.Bg, baseline: 4 }])
 * ```
 */
export const plotPoolLegend = (pool: LegendPool, axisGutter: number, legends: PoolLegend[]): void => {
  if (!Array.isArray(legends) || legends.length < 1) {
    return
  }

  const container = pool.parent().select<SVGGElement>('#tidelineLabels')
  const poolId = pool.id()
  const x = pool.width() + axisGutter
  const y = pool.yPosition()

  legends.forEach((legend) => {
    const legendId = `${poolId}_legend_${legend.type}`
    const legendGroup = container.append('g')
      .attr('id', legendId)
      .attr('data-testid', legendId)
      .attr('transform', `translate(${x},${y - legend.baseline})`)

    drawLegendItems(legendGroup, getLegendItems(legend))
  })
}
