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
  calculateWidth, drawImage, drawText,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'

const D3_CONFIDENTIAL_MODE_ID = 'confidential'
const IMAGE_SIZE = 24
// 3 hours max for the tooltip
const MAX_SIZE_WITH_TOOLTIP = 1000 * 60 * 60 * 3

/**
 * Calculate duration for an event in milliseconds
 */
const getDuration = (d: ConfidentialMode): number => {
  if (!d.normalEnd) {
    return 0
  }
  return new Date(d.normalEnd).getTime() - new Date(d.normalTime).getTime()
}

/**
 * Determine if the event should display a tooltip (duration < 3 hours)
 */
const displayTooltip = (d: ConfidentialMode): boolean => {
  return getDuration(d) < MAX_SIZE_WITH_TOOLTIP
}

// Helper functions to reduce nesting
const getConfidentialGroupId = (d: ConfidentialMode, poolId: string): string =>
  `${poolId}_${D3_CONFIDENTIAL_MODE_ID}_group_${d.id}`

// const getConfidentialBackId = (d: ConfidentialMode, poolId: string): string =>
//   `${poolId}_${D3_CONFIDENTIAL_MODE_ID}_back_${d.id}`

const getConfidentialLockId = (d: ConfidentialMode, poolId: string): string =>
  `${poolId}_${D3_CONFIDENTIAL_MODE_ID}_lock_${d.id}`

type ConfidentialModeOptions = PlotOptions<ConfidentialMode> & {
  hideLabel?: boolean
}

const defaults: Partial<ConfidentialModeOptions> = {
  xScale: null,
  hideLabel: false
}

/**
 * Plot confidential mode events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The confidential mode plotting function
 */
export const plotConfidentialMode = (
  pool: Pool<ConfidentialMode>,
  opts: Partial<ConfidentialModeOptions> = {}
): PlotFunction<ConfidentialMode> => {
  const options = _.defaults(opts, defaults) as ConfidentialModeOptions

  const height = pool.height()
  const poolId = pool.id()

  return (selection: PlotSelection<ConfidentialMode>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper functions that use xScale and poolId from closure
    const getGroupId = (d: ConfidentialMode): string => getConfidentialGroupId(d, poolId)
    // const getBackId = (d: ConfidentialMode): string => getConfidentialBackId(d, poolId)
    const getLockId = (d: ConfidentialMode): string => getConfidentialLockId(d, poolId)
    const getXPos = (d: ConfidentialMode): number => xPos(d, xScale)
    const getWidth = (d: ConfidentialMode): number => calculateWidth(d, xScale)
    const getImageX = (d: ConfidentialMode): number => getXPos(d) + (getWidth(d) - IMAGE_SIZE) / 2
    const getImageY = (): number => (height - IMAGE_SIZE) / 2
    const getTextX = (d: ConfidentialMode): number => getXPos(d) + getWidth(d) / 2
    const getTextY = (): number => getImageY() + IMAGE_SIZE + 5

    // Enter callback: create new elements
    const createConfidentialModeElements = (
      enter: d3.Selection<d3.EnterElement, ConfidentialMode, SVGGElement, unknown>,
      confidentialModeGroupSelector: string
    ): d3.Selection<SVGGElement, ConfidentialMode, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(confidentialModeGroupSelector, true)
        .attr('id', getGroupId)
        .attr('data-testid', getGroupId)

      drawZoneRectangle(group, height, xScale, 'd3-back-confidential d3-confidential')
      drawImage(group, getImageX, getImageY, IMAGE_SIZE, IMAGE_SIZE, lockIcon)

      if (!options.hideLabel) {
        const confidentialModeWithTextGroup = group.filter((d: ConfidentialMode) => !displayTooltip(d))
        drawText(confidentialModeWithTextGroup, t('Confidential mode'), getTextX, getTextY, 'd3-confidential-text', getLockId)
      }

      return group
    }

    // Update callback: update existing elements
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
      const confidentialEvents = pool.filterDataForRender(options.tidelineData.medicalData.confidentialModes)
      const confidentialModeGroupSelector = `d3-${D3_CONFIDENTIAL_MODE_ID}-group`

      if (confidentialEvents.length < 1) {
        d3.select(this).selectAll(`g.${confidentialModeGroupSelector}`).remove()
        return
      }

      const allConfidentialModes = d3.select(this)
        .selectAll<SVGGElement, ConfidentialMode>(`g.${confidentialModeGroupSelector}`)
        .data(confidentialEvents, (d: ConfidentialMode) => d.id)

      const confidentialModeGroup = allConfidentialModes.join(
        enter => createConfidentialModeElements(enter, confidentialModeGroupSelector),
        update => updateConfidentialModeElements(update),
        exit => exit.remove()
      )

      // Set up event handlers - only show tooltip for events with duration < 3 hours
      confidentialModeGroup
        .filter((d: ConfidentialMode) => displayTooltip(d))
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

