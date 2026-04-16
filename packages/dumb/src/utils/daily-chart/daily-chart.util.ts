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
import { COMMON_RADIUS } from '../../modules/plot-methods/common-display-values'

export const getTooltipContainer = (element: SVGGElement): DOMRect => {
  const parentContainer = document.getElementById('tidelineMain')!.getBoundingClientRect()
  const container = element.getBoundingClientRect()
  container.y = container.top - parentContainer.top
  container.x = container.left - parentContainer.left
  return container
}

/**
 * Type guard to check if a datum has a normalEnd property (is a Duration-based datum)
 */
const hasDuration = <T extends { normalTime: string }>(datum: T): datum is T & { normalEnd: string; epochEnd: number } => {
  return 'normalEnd' in datum && typeof datum.normalEnd === 'string'
}

export const drawZoneRectangle = <T extends { normalTime: string }>(
  group: d3.Selection<SVGGElement, T, SVGElement, unknown>,
  height: number,
  xScale: d3.ScaleTime<number, number>,
  classNames: string
): void => {
  group.append('rect')
    .classed(classNames, true)
    .attr('x', (d: T) => xPos(d, xScale))
    .attr('y', 0)
    .attr('width', (d: T) => calculateWidth(d, xScale))
    .attr('height', height)
}

export const drawImage = <T extends { normalTime: string }>(
  group: d3.Selection<SVGGElement, T, SVGElement, unknown>,
  x: (d: T) => number,
  y: number | ((d: T) => number),
  height: number,
  width: number | ((d: T) => number),
  iconHref: string | ((d: T) => string),
): void => {
  group.append('image')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('href', iconHref)
}

export const drawCircle = <T extends { normalTime: string }>(
  group: d3.Selection<SVGGElement, T, SVGElement, unknown>,
  cx: (d: T) => number,
  cy: number | ((d: T) => number),
  classNames: string | ((d: T) => string),
  id: (d: T) => string | null
): void => {
  group
    .append('circle')
    .attr('id', id)
    .attr('cx', cx)
    .attr('cy', cy)
    .attr('r', COMMON_RADIUS)
    .attr('stroke-width', 0)
    .attr('class', classNames)
}

export const drawText = <T extends { normalTime: string }>(
  group: d3.Selection<SVGGElement, T, SVGElement, unknown>,
  text: string | ((d: T) => string),
  x: (d: T) => number,
  y: number | ((d: T) => number),
  classNames: string | ((d: T) => string),
  id: (d: T) => string
): void => {
  group
    .append('text')
    .text(text)
    .attr('id', id)
    .attr('x', x)
    .attr('y', y)
    .attr('class', classNames)
}

export const drawVerticalRectangle = <T extends { normalTime: string }>(
  group: d3.Selection<SVGGElement, T, SVGElement, unknown>,
  x: (d: T) => number,
  y: number | ((d: T) => number),
  height: number | ((d: T) => number),
  width: number | ((d: T) => number),
  classNames: string | ((d: T) => string),
  id: (d: T) => string
): void => {
  group.append('rect')
    .attr('x', x)
    .attr('y', y)
    .attr('width', width)
    .attr('height', height)
    .attr('id', id)
    .attr('class', classNames)
}

export const xPos = <T extends { normalTime: string }>(d: T, xScale: d3.ScaleTime<number, number>): number => {
  return xScale(new Date(d.normalTime))
}

export const calculateWidth = <T extends { normalTime: string }>(d: T, xScale: d3.ScaleTime<number, number>): number => {
  if (!hasDuration(d)) {
    return 0
  }
  return xScale(new Date(d.normalEnd)) - xScale(new Date(d.normalTime))
}
