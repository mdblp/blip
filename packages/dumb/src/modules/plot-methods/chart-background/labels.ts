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

export interface LabelSpan {
  text: string
  className: string
}

export interface PoolLabel {
  spans: LabelSpan[]
  baseline: number
}

type LabelPool = {
  id: () => string
  yPosition: () => number
  parent: () => d3.Selection<SVGGElement, unknown, null, undefined>
}

/**
 * Plot the title label(s) of a daily chart pool (e.g. "Glucose (mg/dL)"), in the chart's
 * shared labels layer, left-aligned in the axis gutter at the pool's position.
 *
 * Unlike the other chart-background plot functions, this isn't data-driven: `labels` is a
 * static, pool-specific configuration set once and never updated, so this renders directly
 * rather than through a D3 enter/update/exit join.
 *
 * @param pool - The pool to draw the label(s) for
 * @param axisGutter - Width of the axis gutter, where labels are drawn
 * @param labels - The label(s) to draw, each as a list of styled spans
 *
 * @example
 * ```typescript
 * plotPoolLabel(pool, container.axisGutter(), labels)
 * ```
 */
export const plotPoolLabel = (pool: LabelPool, axisGutter: number, labels: PoolLabel[]): void => {
  if (!Array.isArray(labels) || labels.length < 1) {
    return
  }

  const container = pool.parent().select<SVGGElement>('#tidelineLabels')
  const poolId = pool.id()
  const y = pool.yPosition()

  labels.forEach((label, labelIndex) => {
    const textGroup = container.append('text')
      .classed('d3-pool-label', true)
      .attr('id', `${poolId}_label_${labelIndex}`)
      .attr('data-testid', `${poolId}-chart-label`)
      .attr('transform', `translate(${axisGutter},${y - label.baseline})`)

    label.spans.forEach((span, spanIndex) => {
      textGroup.append('tspan')
        .attr('class', span.className)
        .attr('id', `${poolId}_label_${labelIndex}_span_${spanIndex}`)
        .text(span.text)
    })
  })
}
