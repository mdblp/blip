/*
 * Copyright (c) 2014-2026, Diabeloop
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
import _ from 'lodash'
import * as d3 from 'd3'
import lockIcon from 'lock.svg'

import { type ConfidentialMode } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import {
  calculateWidth,
  drawImage,
  drawText,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.ConfidentialMode)

// Confidential mode specific constants
const CONFIDENTIAL_MODE_IMAGE_SIZE = 24
const CONFIDENTIAL_MODE_TEXT_OFFSET = 5
// 3 hours max for the tooltip (events longer than this show label instead of tooltip)
const MAX_DURATION_WITH_TOOLTIP_MS = 1000 * 60 * 60 * 3

/**
 * Calculate duration for a confidential mode event in milliseconds
 */
const getDuration = (d: ConfidentialMode): number => {
  if (!d.normalEnd) {
    return 0
  }
  return new Date(d.normalEnd).getTime() - new Date(d.normalTime).getTime()
}

/**
 * Determine if the event should display a tooltip (duration < 3 hours)
 * For longer events, a label is displayed instead of a tooltip
 */
const shouldDisplayTooltip = (d: ConfidentialMode): boolean => {
  return getDuration(d) < MAX_DURATION_WITH_TOOLTIP_MS
}

type ConfidentialModeOptions = PlotOptions<ConfidentialMode> & {
  hideLabel?: boolean
}

const defaults: Partial<ConfidentialModeOptions> = {
  xScale: null,
  hideLabel: false
}

/**
 * Plot confidential mode events in the diabetes management timeline
 *
 * Confidential mode events represent periods when patient data is hidden or masked
 * for privacy reasons. This is used when:
 * - Patients want to keep certain periods private from caregivers
 * - Sensitive medical data needs to be protected
 * - Patient privacy preferences need to be respected
 * - Data sharing needs to be controlled
 *
 * The visualization shows:
 * - A zone rectangle indicating the confidential period
 * - A lock icon for visual identification
 * - "Confidential mode" text label for longer periods (> 3 hours)
 * - Tooltip for shorter periods (≤ 3 hours)
 *
 * This helps clinicians understand:
 * - When data is hidden for privacy
 * - Patient privacy preferences
 * - Gaps in visible medical data
 * - Periods requiring additional patient discussion
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, hideLabel option, and event handlers
 * @returns A function that renders confidential mode events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotConfidentialMode(pool, {
 *   tidelineData,
 *   hideLabel: false,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotConfidentialMode = (
  pool: Pool<ConfidentialMode>,
  opts: Partial<ConfidentialModeOptions> = {}
): PlotFunction<ConfidentialMode> => {
  const options = _.defaults(opts, defaults) as ConfidentialModeOptions

  return (selection: PlotSelection<ConfidentialMode>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height()
    const poolId = pool.id()

    // Helper functions using closure variables
    const getXPos = (d: ConfidentialMode): number => xPos(d, xScale)
    const getWidth = (d: ConfidentialMode): number => calculateWidth(d, xScale)
    const getImageX = (d: ConfidentialMode): number =>
      getXPos(d) + (getWidth(d) - CONFIDENTIAL_MODE_IMAGE_SIZE) / 2
    const getImageY = (): number =>
      (height - CONFIDENTIAL_MODE_IMAGE_SIZE) / 2
    const getTextX = (d: ConfidentialMode): number =>
      getXPos(d) + getWidth(d) / 2
    const getTextY = (): number =>
      getImageY() + CONFIDENTIAL_MODE_IMAGE_SIZE + CONFIDENTIAL_MODE_TEXT_OFFSET

    /**
     * Create new confidential mode visual elements
     */
    const createConfidentialModeElements = (
      enter: d3.Selection<d3.EnterElement, ConfidentialMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ConfidentialMode, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', (d: ConfidentialMode) => `${poolId}_${idGen.groupId(d)}`)
        .attr('data-testid', (d: ConfidentialMode) => `${poolId}_${idGen.groupId(d)}`)

      drawZoneRectangle(group, height, xScale, 'd3-back-confidential d3-confidential')

      drawImage(group, getImageX, getImageY, CONFIDENTIAL_MODE_IMAGE_SIZE, CONFIDENTIAL_MODE_IMAGE_SIZE, lockIcon)

      // Add text label only for events longer than 3 hours (if labels not hidden)
      if (!options.hideLabel) {
        const confidentialModeWithTextGroup = group.filter((d: ConfidentialMode) => !shouldDisplayTooltip(d))
        drawText(
          confidentialModeWithTextGroup,
          t('Confidential mode'),
          getTextX,
          getTextY,
          'd3-confidential-text',
          (d: ConfidentialMode) => `${poolId}_${idGen.elementId(d, 'text')}`
        )
      }

      return group
    }

    /**
     * Update existing confidential mode visual elements
     */
    const updateConfidentialModeElements = (
      update: d3.Selection<SVGGElement, ConfidentialMode, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, ConfidentialMode, SVGGElement, unknown> => {
      update.select('rect.d3-back-confidential')
        .attr('x', getXPos)
        .attr('width', getWidth)

      update.select('image')
        .attr('x', getImageX)

      if (!options.hideLabel) {
        update.select('text.d3-confidential-text')
          .attr('x', getTextX)
      }

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const confidentialEvents = pool.filterDataForRender(options.tidelineData.medicalData.confidentialModes)

      // Step 2: Early exit if no data
      if (confidentialEvents.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allConfidentialModes = d3.select(this)
        .selectAll<SVGGElement, ConfidentialMode>(`g.${idGen.groupSelector()}`)
        .data(confidentialEvents, (d: ConfidentialMode) => d.id)

      const confidentialModeGroup = allConfidentialModes.join(
        createConfidentialModeElements,
        updateConfidentialModeElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers - only show tooltip for events with duration < 3 hours
      confidentialModeGroup
        .filter((d: ConfidentialMode) => shouldDisplayTooltip(d))
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: ConfidentialMode) {
          if (options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement) {
          if (options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

