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

import _ from 'lodash'
import * as d3 from 'd3'
import physicalActivityIcon from 'physical-activity.png'

import { type PhysicalActivity } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import {
  calculateWidth, drawImage,
  drawZoneRectangle,
  getTooltipContainer,
  xPos
} from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'

const D3_PHYSICAL_ACTIVITY_ID = 'pa'
const DEFAULT_IMAGE_MARGIN = 8
const DEFAULT_OPTIONS_SIZE = 30

// Helper functions to reduce nesting
const getGroupId = (d: PhysicalActivity): string => `${D3_PHYSICAL_ACTIVITY_ID}_group_${d.id}`
const getImageId = (d: PhysicalActivity): string => `${D3_PHYSICAL_ACTIVITY_ID}_img_${d.id}`
const getRectId = (d: PhysicalActivity): string => `${D3_PHYSICAL_ACTIVITY_ID}_rect_${d.id}`

type PhysicalActivityOptions = PlotOptions<PhysicalActivity>

const defaults: Partial<PhysicalActivityOptions> = {
  xScale: null
}

/**
 * Plot physical activity events in the diabetes management timeline
 * @param pool - The pool to render into
 * @param opts - Configuration options
 * @returns The physical activity plotting function
 */
export const plotPhysicalActivity = (
  pool: Pool<PhysicalActivity>,
  opts: Partial<PhysicalActivityOptions> = {}
): PlotFunction<PhysicalActivity> => {
  const options = _.defaults(opts, defaults) as PhysicalActivityOptions

  const height = pool.height()

  return (selection: PlotSelection<PhysicalActivity>): void => {
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper functions that use xScale from closure
    const getXPos = (d: PhysicalActivity): number => xPos(d, xScale)
    const getWidth = (d: PhysicalActivity): number => calculateWidth(d, xScale)
    const getImageY = (): number => height / 2 - DEFAULT_OPTIONS_SIZE / 2
    const getImageHeight = (): number => height - DEFAULT_IMAGE_MARGIN

    // Enter callback: create new elements
    const createPhysicalActivityElements = (
      enter: d3.Selection<d3.EnterElement, PhysicalActivity, SVGGElement, unknown>,
      physicalActivityGroupSelector: string
    ): d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(physicalActivityGroupSelector, true)
        .attr('id', getGroupId)
        .attr('data-testid', getGroupId)

      drawZoneRectangle(group, height, xScale, 'd3-rect-pa d3-pa')

      drawImage<PhysicalActivity>(group, getXPos, getImageY(), getImageHeight(), getWidth, physicalActivityIcon)

      return group
    }

    // Update callback: update existing elements
    const updatePhysicalActivityElements = (
      update: d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, PhysicalActivity, SVGGElement, unknown> => {
      update.selectAll<SVGRectElement, PhysicalActivity>('rect.d3-rect-pa')
        .attr('x', getXPos)
        .attr('width', getWidth)

      update.select('image')
        .attr('x', getXPos)
        .attr('width', getWidth)

      return update
    }

    selection.each(function (this: SVGGElement) {
      const physicalActivities = pool.filterDataForRender(options.tidelineData.medicalData.physicalActivities)
      const physicalActivityGroupSelector = `d3-${D3_PHYSICAL_ACTIVITY_ID}-group`

      if (physicalActivities.length < 1) {
        d3.select(this).selectAll(`g.${physicalActivityGroupSelector}`).remove()
        return
      }

      // Filter for activities with reported intensity
      const activitiesWithIntensity = physicalActivities.filter(
        (d: PhysicalActivity) => !_.isEmpty(d.reportedIntensity)
      )

      if (activitiesWithIntensity.length < 1) {
        d3.select(this).selectAll(`g.${physicalActivityGroupSelector}`).remove()
        return
      }

      // Select all physical activity groups and bind data
      const allPhysicalActivities = d3.select(this)
        .selectAll<SVGGElement, PhysicalActivity>(`g.${physicalActivityGroupSelector}`)
        .data(activitiesWithIntensity, (d: PhysicalActivity) => d.id)

      // Using join pattern for enter/update/exit
      const physicalActivityGroup = allPhysicalActivities.join(
        enter => createPhysicalActivityElements(enter, physicalActivityGroupSelector),
        update => updatePhysicalActivityElements(update),
        exit => exit.remove()
      )

      // Set up event handlers - only for activities with reported intensity
      physicalActivityGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: PhysicalActivity) {
          if (d.reportedIntensity && options.onElementHover) {
            options.onElementHover({
              data: d,
              rect: getTooltipContainer(this)
            })
          }
        })
        .on('mouseout', function (this: SVGGElement, _event: MouseEvent, d: PhysicalActivity) {
          if (d.reportedIntensity && options.onElementOut) {
            options.onElementOut()
          }
        })
    })
  }
}

