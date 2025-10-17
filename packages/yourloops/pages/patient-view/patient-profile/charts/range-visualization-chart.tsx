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

import React, { type FC, useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { type BgBounds } from 'medical-domain'
import { useTranslation } from 'react-i18next'

interface RangeVisualizationChartProps {
  bgBounds: BgBounds
  bgUnits: string
}

export const RangeVisualizationChart: FC<RangeVisualizationChartProps> = (props) => {
  const { bgBounds, bgUnits } = props
  const { t } = useTranslation('yourloops')
  // use a ref to attach the svg to the DOM
  const svgRef = useRef<SVGSVGElement>(null)

  // run d3 code when the component is mounted or when bgBounds/bgUnits change
  useEffect(() => {
    if (!svgRef.current) return

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Chart dimensions
    const width = 450
    const height = 360
    const margin = { top: 20, right: 0, bottom: 20, left: 70 }
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Y scale
    const yMin = bgBounds.veryLowThreshold - 10
    const yMax = bgBounds.veryHighThreshold + 10

    const yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([chartHeight, 0])

    // X scale (for curve)
    const xScale = d3.scaleLinear()
      .domain([0, 100])
      .range([0, chartWidth])

    // Function to get color based on glucose value
    const getColorForValue = (value: number): string => {
      if (value >= bgBounds.veryHighThreshold) {
        return 'var(--bg-very-high)' // Severe hyperglycemia
      } else if (value >= bgBounds.targetUpperBound) {
        return 'var(--bg-high)' // Hyperglycemia
      } else if (value >= bgBounds.targetLowerBound) {
        return 'var(--bg-target)' // In range (blue)
      } else if (value >= bgBounds.veryLowThreshold) {
        return 'var(--bg-low)' // Hypoglycemia
      } else {
        return 'var(--bg-very-low)' // Severe hypoglycemia
      }
    }

    // Draw the "In range" background zone (light blue)
    g.append('rect')
      .attr('x', 0)
      .attr('y', yScale(bgBounds.targetUpperBound))
      .attr('width', chartWidth)
      .attr('height', yScale(bgBounds.targetLowerBound) - yScale(bgBounds.targetUpperBound))
      .attr('fill', '#E3F2FD')

    // Draw threshold lines with labels
    const thresholds = [
      {
        value: bgBounds.veryHighThreshold,
        color: 'var(--bg-very-high)',
        textLabel: 'Hyper L2'
      },
      {
        value: bgBounds.targetUpperBound,
        color: 'var(--bg-high)',
        textLabel: 'Hyper L1'
      },
      {
        value: bgBounds.targetLowerBound,
        color: 'var(--bg-low)',
        textLabel: 'Hypo L1'
      },
      {
        value: bgBounds.veryLowThreshold,
        color: 'var(--bg-very-low)',
        textLabel: 'Hypo L2'
      }
    ]

    thresholds.forEach(threshold => {
      const yPos = yScale(threshold.value)
      const chipPadding = { horizontal: 10, vertical: 4 }
      const textWidth = threshold.textLabel.length * 6.5
      const chipWidth = textWidth + chipPadding.horizontal * 2
      const chipHeight = 20

      // Horizontal line
      g.append('line')
        .attr('x1', 0)
        .attr('x2', chartWidth)
        .attr('y1', yPos)
        .attr('y2', yPos)
        .attr('stroke', threshold.color)
        .attr('stroke-width', 2)

      // Draw chip background
      g.append('rect')
        .attr('x', -chipWidth)
        .attr('y', yPos - chipHeight / 2)
        .attr('width', chipWidth)
        .attr('height', chipHeight)
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('fill', threshold.color)
        .attr('fill-opacity', 0.3)
        .attr('stroke', threshold.color)
        .attr('stroke-width', 1)

      // Draw text
      g.append('text')
        .attr('x', -chipWidth / 2)
        .attr('y', yPos)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        //.attr('fill', threshold.color)
        .attr('font-size', '11px')
        //.attr('font-weight', '500')
        .text(threshold.textLabel) // todo add translations
    })

    // "In range" chip label
    const inRangeMidpoint = (yScale(bgBounds.targetUpperBound) + yScale(bgBounds.targetLowerBound)) / 2
    const chipPadding = { horizontal: 10, vertical: 4 }
    const inRangeText = t('in-range')
    const textWidth = inRangeText.length * 6.5
    const chipWidth = textWidth + chipPadding.horizontal * 2
    const chipHeight = 20

    // Draw chip background for "In range"
    g.append('rect')
      .attr('x', -chipWidth)
      .attr('y', inRangeMidpoint - chipHeight / 2)
      .attr('width', chipWidth)
      .attr('height', chipHeight)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('fill', 'var(--bg-target)')
      .attr('fill-opacity', 0.3)
      .attr('stroke', 'var(--bg-target)')
      .attr('stroke-width', 1)

    // Draw text for "In range"
    g.append('text')
      .attr('x', -chipWidth / 2)
      .attr('y', inRangeMidpoint)
      .attr('dy', '0.35em')
      .attr('text-anchor', 'middle')
      //.attr('fill', 'var(--bg-target)')
      .attr('font-size', '11px')
      //.attr('font-weight', '500')
      .text(inRangeText)

    // Generate blue curve data with FIXED values
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

    // Add dots on the blue curve with zone colors
    g.selectAll('.dot-blue')
      .data(curveData.filter((_, i) => i % 2 === 0))
      .enter()
      .append('circle')
      .attr('class', 'dot-blue')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 4)
      .attr('fill', d => getColorForValue(d.y))

  }, [bgBounds, bgUnits, t])

  return (
    <svg ref={svgRef} data-testid="range-visualization-chart" />
  )
}
