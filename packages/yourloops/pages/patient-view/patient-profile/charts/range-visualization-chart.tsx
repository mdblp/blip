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
import { useTranslation } from 'react-i18next'
import {
  drawChip,
  drawColoredDotsCurve,
  drawHorizontalLine,
  drawInRangeBackgroundZone
} from './range-visualization-plot'
import type { BgBounds, BgUnit } from 'medical-domain'

interface RangeVisualizationChartProps {
  bgBounds: BgBounds
  displayedUnit: BgUnit
}

const Y_PADDING_RATIO = 0.05

export const RangeVisualizationChart: FC<RangeVisualizationChartProps> = (props) => {
  const { bgBounds, displayedUnit } = props

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
    // allow some margin for labels
    const margin = { top: 20, right: 0, bottom: 20, left: 70 }
    // Calculate chart area dimensions taking margins into account
    // make the chart area smaller to accommodate for labels
    const chartWidth = width - margin.left - margin.right
    const chartHeight = height - margin.top - margin.bottom

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)

    //
    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Y scale
    const yPadding = (bgBounds.veryHighThreshold - bgBounds.veryLowThreshold) * Y_PADDING_RATIO
    const yMin = bgBounds.veryLowThreshold - yPadding
    const yMax = bgBounds.veryHighThreshold + yPadding

    const yScale = d3.scaleLog()
      .domain([yMin, yMax])
      .range([chartHeight, 0])

    // X scale (for curve)
    const xScale = d3.scaleLinear()
      .domain([0, 100])       // means " I want to draw something that progresses from start (0%) to finish (100%)
      .range([0, chartWidth]) // across the full width of my chart. "

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

    const inRangeHeight = yScale(bgBounds.targetLowerBound) - yScale(bgBounds.targetUpperBound)
    drawInRangeBackgroundZone(g, 0, yScale(bgBounds.targetUpperBound), chartWidth, inRangeHeight)

    // Draw threshold lines with labels
    const thresholds = [
      {
        id:"very-high",
        value: bgBounds.veryHighThreshold,
        color: 'var(--bg-very-high)',
      },
      {
        id: "high",
        value: bgBounds.targetUpperBound,
        color: 'var(--bg-high)',
      },
      {
        id: "low",
        value: bgBounds.targetLowerBound,
        color: 'var(--bg-low)',
      },
      {
        id: "very-low",
        value: bgBounds.veryLowThreshold,
        color: 'var(--bg-very-low)',
      }
    ]

    thresholds.forEach(threshold => {
      const yPos = yScale(threshold.value)
      drawHorizontalLine(g, 0, chartWidth, yPos, threshold.color)
      drawChip(g, threshold.id, yPos, threshold.value.toString(), threshold.color)
    })

    drawColoredDotsCurve(g, xScale, yScale, displayedUnit, getColorForValue)

  }, [bgBounds, displayedUnit, t])

  return (
    <svg ref={svgRef} data-testid="range-visualization-chart" />
  )
}
