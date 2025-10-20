/*
 * Copyright (c) 2025, Diabeloop
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


import { Selection } from 'd3-selection'
import { ScaleLinear } from 'd3'
import rangeChartClasses from './range-visualization-chart.css'

export const drawHorizontalLine  = (g: Selection<SVGElement, unknown, null, undefined>, xPos1: number, xPos2: number, yPos: number, color: string) => {
  g.append('line')
    .attr('x1', xPos1)
    .attr('x2', xPos2)
    .attr('y1', yPos)
    .attr('y2', yPos)
    .attr('stroke', color)
    .attr('class', rangeChartClasses.horizontalLine)
}

export const drawInRangeBackgroundZone = (g: Selection<SVGElement, unknown, null, undefined>, xPos: number, yPos:number, width:number, height: number) => {
  // Draw the "In range" background zone (light blue)
  g.append('rect')
    .attr('x', xPos)
    .attr('y', yPos)
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'var(--info-color-10)')
}

export const drawChip = (g: Selection<SVGElement, unknown, null, undefined>, yPos: number, textLabel: string, color: string) => {
  // Measure actual text width using a temporary SVG text element
  const tempText = g.append('text')
    .attr('x', 0)
    .attr('y', 0)
    .attr('font-size', '11px')
    .attr('font-family', 'inherit')
    .attr('font-weight', 'normal')
    .text(textLabel)
  const textWidth = tempText.node()?.getBBox().width ?? (textLabel.length * 6.5)
  tempText.remove()

  const chipPadding = { horizontal: 10, vertical: 4 }
  const chipWidth = textWidth + chipPadding.horizontal * 2
  const chipHeight = 20

  // Draw chip background rectangle
  g.append('rect')
    .attr('x', -chipWidth)
    .attr('y', yPos - chipHeight / 2)
    .attr('width', chipWidth)
    .attr('height', chipHeight)
    .attr('rx', 10)
    .attr('ry', 10)
    .attr('fill', color)
    .attr('stroke', color)
    .attr('class', rangeChartClasses.chip)

  // Draw text
  g.append('text')
    .attr('x', -chipWidth / 2)
    .attr('y', yPos)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle')
    .attr('font-size', '11px')
    .attr('class', rangeChartClasses.chipLabel)
    .text(textLabel)
}

export const drawColoredDotsCurve = (g: Selection<SVGElement, unknown, null, undefined>, xScale: ScaleLinear<number, number>, yScale: ScaleLinear<number, number>, getColorForValue: (value: number) => string) => {
  // Generate data with FIXED values
  const curveData = []
  const fixedMin = 40
  const fixedMax = 255
  const fixedMid = (fixedMin + fixedMax) / 2
  const fixedAmplitude = (fixedMax - fixedMin) / 2

  for (let i = 0; i <= 100; i++) {
    const x = i
    const y = fixedMid + fixedAmplitude * Math.sin((x / 100) * Math.PI * 3)
    curveData.push({ x, y })
  }

  // Add dots on with zone colors
  g.selectAll('.dot-blue')
    .data(curveData.filter((_, i) => i % 2 === 0))
    .enter()
    .append('circle')
    .attr('class', 'dot-blue')
    .attr('cx', d => xScale(d.x))
    .attr('cy', d => yScale(d.y))
    .attr('r', 4)
    .attr('fill', d => getColorForValue(d.y))
}
