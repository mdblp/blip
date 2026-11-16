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

import { t } from 'i18next'
import { type BgUnit } from 'medical-domain'
import { CSS_CLASSES } from '../../../../models/constants/plot.constants'
import { type BgPoolLabelOptions, type PoolLabelOptions } from '../../../../models/plot-methods/pool-label.model'
import { type LabelsLayerPool } from '../../../../models/plot-methods/labels-layer-pool.model'

type LabelPool = Omit<LabelsLayerPool, 'width'>

interface PoolLabelSpan {
  text: string
  className: string
}

const main = (text: string): PoolLabelSpan => ({ text, className: CSS_CLASSES.POOL_LABEL_MAIN })

const light = (text: string): PoolLabelSpan => ({ text, className: CSS_CLASSES.POOL_LABEL_LIGHT })

const getEventsLabelSpans = (): PoolLabelSpan[] => [
  main(t('Events'))
]

const getBgLabelSpans = (bgUnits: BgUnit): PoolLabelSpan[] => [
  main(t('Glucose')),
  light(` (${t(bgUnits)})`)
]

const getBolusLabelSpans = (): PoolLabelSpan[] => [
  main(t('Bolus')),
  light(` (${t('U')})`),
  main(` & ${t('Carbohydrates')}`),
  light(` (${t('g')})`)
]

const getBasalLabelSpans = (): PoolLabelSpan[] => [
  main(t('Basal Rates')),
  light(` (${t('U')}/${t('abbrev_duration_hour')})`)
]

const getIobLabelSpans = (): PoolLabelSpan[] => [
  main(t('active-insulin')),
  light(` (${t('U')})`)
]

/**
 * Draw the title label of a pool in the chart's shared labels layer, left-aligned in the
 * axis gutter at the pool's position.
 *
 * A label is static and drawn once, so this renders directly rather than through a
 * D3 enter/update/exit join.
 */
const drawLabel = (pool: LabelPool, axisGutter: number, baseline: number, spans: PoolLabelSpan[]): void => {
  const container = pool.parent().select<SVGGElement>('#tidelineLabels')
  const poolId = pool.id()
  const labelId = `${poolId}_label`
  const y = pool.yPosition() - baseline

  const textGroup = container.append('text')
    .classed(CSS_CLASSES.POOL_LABEL, true)
    .attr('id', labelId)
    .attr('data-testid', `${poolId}-chart-label`)
    .attr('transform', `translate(${axisGutter},${y})`)

  spans.forEach((span, spanIndex) => {
    textGroup.append('tspan')
      .attr('class', span.className)
      .attr('id', `${labelId}_span_${spanIndex}`)
      .text(span.text)
  })
}

/**
 * Plot the "Events" title label of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the label for
 * @param axisGutter - Width of the axis gutter, where the label is drawn
 * @param options - The label options
 *
 * @example
 * ```typescript
 * plotEventsLabel(poolEvents, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotEventsLabel = (pool: LabelPool, axisGutter: number, { baseline }: PoolLabelOptions): void => {
  drawLabel(pool, axisGutter, baseline, getEventsLabelSpans())
}

/**
 * Plot the "Glucose (unit)" title label of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the label for
 * @param axisGutter - Width of the axis gutter, where the label is drawn
 * @param options - The label options
 *
 * @example
 * ```typescript
 * plotBgLabel(poolBG, chart.axisGutter(), { baseline: 4, bgUnits: MGDL_UNITS })
 * ```
 */
export const plotBgLabel = (pool: LabelPool, axisGutter: number, { baseline, bgUnits }: BgPoolLabelOptions): void => {
  drawLabel(pool, axisGutter, baseline, getBgLabelSpans(bgUnits))
}

/**
 * Plot the "Bolus (U) & Carbohydrates (g)" title label of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the label for
 * @param axisGutter - Width of the axis gutter, where the label is drawn
 * @param options - The label options
 *
 * @example
 * ```typescript
 * plotBolusLabel(poolBolus, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotBolusLabel = (pool: LabelPool, axisGutter: number, { baseline }: PoolLabelOptions): void => {
  drawLabel(pool, axisGutter, baseline, getBolusLabelSpans())
}

/**
 * Plot the "Basal Rates (U/h)" title label of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the label for
 * @param axisGutter - Width of the axis gutter, where the label is drawn
 * @param options - The label options
 *
 * @example
 * ```typescript
 * plotBasalLabel(poolBasal, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotBasalLabel = (pool: LabelPool, axisGutter: number, { baseline }: PoolLabelOptions): void => {
  drawLabel(pool, axisGutter, baseline, getBasalLabelSpans())
}

/**
 * Plot the "Active insulin (U)" title label of a daily chart pool.
 * The pool must be laid out (`arrangePools()`) before calling this.
 *
 * @param pool - The pool to draw the label for
 * @param axisGutter - Width of the axis gutter, where the label is drawn
 * @param options - The label options
 *
 * @example
 * ```typescript
 * plotIobLabel(poolIob, chart.axisGutter(), { baseline: 4 })
 * ```
 */
export const plotIobLabel = (pool: LabelPool, axisGutter: number, { baseline }: PoolLabelOptions): void => {
  drawLabel(pool, axisGutter, baseline, getIobLabelSpans())
}
