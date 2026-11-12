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
import { type BolusPoolLegendOptions, type PoolLegendOptions } from '../../../../models/plot-methods/pool-legend.model'
import { type LabelsLayerPool } from '../../../../models/plot-methods/labels-layer-pool.model'

type LegendGroup = d3.Selection<SVGGElement, unknown, null, undefined>

/** Used to build the legend group id, e.g. `poolBG_legend_bg` */
enum LegendName {
  Basal = 'basal',
  Bg = 'bg',
  Bolus = 'bolus',
  Carbs = 'carbs'
}

enum LegendItemType {
  Circle = 'circle',
  Group = 'group',
  Rect = 'rect',
  Text = 'text'
}

interface TextLegendItem {
  type: LegendItemType.Text
  className: string
  text: string
  /** Added to the measured text width to space it from the next item */
  widthAdjustment: number
  /** The legend title is spaced a bit more from the items */
  isTitle: boolean
}

type LegendItem = TextLegendItem | {
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

const BG_LEGEND_CLASSES = `${CSS_CLASSES.SMBG} ${CSS_CLASSES.SMBG_CIRCLE}`
const BOLUS_LEGEND_CLASSES = `${CSS_CLASSES.BOLUS} ${CSS_CLASSES.BOLUS_LEGEND_RECT}`

const text = (content: string, widthAdjustment = 0, className: string = CSS_CLASSES.LEGEND_TEXT): TextLegendItem => ({
  type: LegendItemType.Text,
  className,
  text: content,
  widthAdjustment,
  isTitle: false
})

const title = (content: string, widthAdjustment = 0, className: string = CSS_CLASSES.LEGEND_TEXT): TextLegendItem => ({
  ...text(content, widthAdjustment, className),
  isTitle: true
})

const circle = (className: string, widthFactor = 1): LegendItem => ({ type: LegendItemType.Circle, className, widthFactor })

const rect = (className: string): LegendItem => ({ type: LegendItemType.Rect, className, widthFactor: RECT_WIDTH_FACTOR })

const loopModeBadge = (className: string, label: string): LegendItem => ({
  type: LegendItemType.Group,
  width: 4 * BASAL_BADGE_SIZE + SHAPE_MARGIN,
  draw: (legendGroup) => {
    const badge = legendGroup.append('g').classed(`${CSS_CLASSES.BASAL} ${className}`, true)
    badge.append('rect')
      .classed(CSS_CLASSES.BASAL_LOOP_MODE_BACKGROUND, true)
      .attr('x', -BASAL_BADGE_SIZE * 4)
      .attr('y', RECT_Y)
      .attr('width', BASAL_BADGE_SIZE * 4)
      .attr('height', BASAL_BADGE_SIZE * 2)
      .attr('rx', BASAL_BADGE_SIZE / 2)
    badge.append('text')
      .classed(CSS_CLASSES.BASAL_LOOP_MODE_LABEL, true)
      .attr('transform', `translate(${-BASAL_BADGE_SIZE * 2}, ${-BASAL_BADGE_SIZE / 2})`)
      .text(label)
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

// Items are listed in drawing order: from right to left, the legend title (if any) being the last one
const getBasalLegendItems = (): LegendItem[] => [
  loopModeBadge(CSS_CLASSES.BASAL_LOOP_MODE_OFF, t('M_Label')),
  loopModeBadge(CSS_CLASSES.BASAL_LOOP_MODE, t('A_Label')),
  title(t('Loop mode status'), SHAPE_MARGIN)
]

const getBgLegendItems = (): LegendItem[] => [
  text(t('high')),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_VERY_HIGH}`),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_HIGH}`),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_TARGET}`),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_TIGHT_RANGE}`),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_LOW}`),
  circle(`${BG_LEGEND_CLASSES} ${CSS_CLASSES.BG_VERY_LOW}`),
  text(`${t('low')} `, 0, `${CSS_CLASSES.LEGEND_TEXT} ${CSS_CLASSES.LEGEND_TEXT_SPACE}`),
  title('Dexcom CGM -', 0, `${CSS_CLASSES.LEGEND_TEXT} ${CSS_CLASSES.LEGEND_TEXT_DEXCOM}`)
]

const getBolusLegendItems = (shouldDisplayEatingShortly: boolean): LegendItem[] => [
  text(t('Override'), -SHAPE_MARGIN),
  bolusRide,
  text(t('Undelivered'), -SHAPE_MARGIN),
  rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_UNDELIVERED}`),
  text(t('bolus_pen'), -SHAPE_MARGIN),
  rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_PEN}`),
  text(t('Manual Bolus'), -SHAPE_MARGIN),
  rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_MANUAL}`),
  text(t('Correction'), -SHAPE_MARGIN),
  rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_CORRECTION}`),
  ...(shouldDisplayEatingShortly ? [
    text(t('meal-without-carb-counting'), -SHAPE_MARGIN),
    rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_EATING_SHORTLY}`)
  ] : []),
  text(t('Meal Bolus'), -SHAPE_MARGIN),
  rect(`${BOLUS_LEGEND_CLASSES} ${CSS_CLASSES.BOLUS_MEAL}`),
  title(t('Bolus Legend'), -SHAPE_MARGIN)
]

const getCarbsLegendItems = (): LegendItem[] => [
  text(t('Rescuecarbs')),
  circle(CSS_CLASSES.RESCUE_CARB_LEGEND_CIRCLE, 1.5),
  text(t('Carbs')),
  circle(CSS_CLASSES.CARB_LEGEND_CIRCLE)
]

/**
 * Lay out the legend items from right to left, each one shifted by the cumulated width
 * of the items drawn before it.
 */
const drawLegendItems = (legendGroup: LegendGroup, items: LegendItem[]): void => {
  const circles: d3.Selection<SVGCircleElement, unknown, null, undefined>[] = []
  let offset = 0
  let textHeight = 0

  items.forEach((item, index) => {
    switch (item.type) {
      case LegendItemType.Text: {
        const textElement = legendGroup.append('text')
          .classed(item.className, true)
          .text(item.text)
        const { width, height } = (textElement.node() as SVGTextElement).getBoundingClientRect()
        textHeight = Math.max(textHeight, height)
        if (index > 0) {
          const textOffset = item.isTitle ? offset + SHAPE_SIDE / 2 : offset
          textElement.attr('transform', `translate(${-textOffset},0)`)
        }
        offset += width + item.widthAdjustment
        break
      }
      case LegendItemType.Group: {
        const group = item.draw(legendGroup)
        if (index > 0) {
          group.attr('transform', `translate(${-offset},0)`)
        }
        offset += item.width
        break
      }
      case LegendItemType.Circle: {
        const radius = SHAPE_SIDE / 2
        circles.push(legendGroup.append('circle')
          .classed(item.className, true)
          .attr('cx', -(offset + 2 * radius))
          .attr('r', radius))
        offset += SHAPE_WIDTH * item.widthFactor
        break
      }
      case LegendItemType.Rect:
        legendGroup.append('rect')
          .classed(item.className, true)
          .attr('width', SHAPE_SIDE)
          .attr('height', SHAPE_SIDE)
          .attr('x', -offset - SHAPE_WIDTH)
          .attr('y', RECT_Y)
        offset += SHAPE_WIDTH * item.widthFactor
        break
    }
  })

  // Vertically center the circles on the legend texts, once all of them have been measured,
  // so that a circle does not depend on the texts drawn before it
  circles.forEach((circle) => circle.attr('cy', -textHeight / 4))
}

/**
 * Draw a legend in the chart's shared labels layer, right-aligned at the end of the pool
 * at the pool's position.
 *
 * Like the pool labels, a legend is static and drawn once, so this renders directly rather
 * than through a D3 enter/update/exit join.
 */
const drawLegend = (pool: LabelsLayerPool, axisGutter: number, name: LegendName, baseline: number, items: LegendItem[]): void => {
  const container = pool.parent().select<SVGGElement>('#tidelineLabels')
  const legendId = `${pool.id()}_legend_${name}`
  const x = pool.width() + axisGutter
  const y = pool.yPosition() - baseline

  const legendGroup = container.append('g')
    .attr('id', legendId)
    .attr('data-testid', legendId)
    .attr('transform', `translate(${x},${y})`)

  drawLegendItems(legendGroup, items)
}

/**
 * Plot the loop mode status legend (automated / manual mode badges) of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the legend for
 * @param axisGutter - Width of the axis gutter, on the left of the pool
 * @param options - The legend options
 *
 * @example
 * ```typescript
 * plotBasalLegend(poolBasal, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotBasalLegend = (pool: LabelsLayerPool, axisGutter: number, { baseline }: PoolLegendOptions): void => {
  drawLegend(pool, axisGutter, LegendName.Basal, baseline, getBasalLegendItems())
}

/**
 * Plot the glucose ranges legend of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the legend for
 * @param axisGutter - Width of the axis gutter, on the left of the pool
 * @param options - The legend options
 *
 * @example
 * ```typescript
 * plotBgLegend(poolBG, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotBgLegend = (pool: LabelsLayerPool, axisGutter: number, { baseline }: PoolLegendOptions): void => {
  drawLegend(pool, axisGutter, LegendName.Bg, baseline, getBgLegendItems())
}

/**
 * Plot the bolus types legend of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the legend for
 * @param axisGutter - Width of the axis gutter, on the left of the pool
 * @param options - The legend options
 *
 * @example
 * ```typescript
 * plotBolusLegend(poolBolus, chart.axisGutter(), { baseline: 4, shouldDisplayEatingShortly: true })
 * ```
 */
export const plotBolusLegend = (
  pool: LabelsLayerPool,
  axisGutter: number,
  { baseline, shouldDisplayEatingShortly = false }: BolusPoolLegendOptions
): void => {
  drawLegend(pool, axisGutter, LegendName.Bolus, baseline, getBolusLegendItems(shouldDisplayEatingShortly))
}

/**
 * Plot the carbs / rescue carbs legend of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the legend for
 * @param axisGutter - Width of the axis gutter, on the left of the pool
 * @param options - The legend options
 *
 * @example
 * ```typescript
 * plotCarbsLegend(poolBolus, chart.axisGutter(), { baseline: 22 })
 * ```
 */
export const plotCarbsLegend = (pool: LabelsLayerPool, axisGutter: number, { baseline }: PoolLegendOptions): void => {
  drawLegend(pool, axisGutter, LegendName.Carbs, baseline, getCarbsLegendItems())
}
