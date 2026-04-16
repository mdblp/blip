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

import { type AlarmEvent } from 'medical-domain'
import { type Pool } from '../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../utils/daily-chart/daily-chart.util'
import { type PlotFunction } from '../../../models/plot-function.model'
import { type PlotSelection } from '../../../models/plot-selection.model'
import { type PlotOptions } from '../../../models/plot-options.model'
import { getAlarmEventIcon } from '../../../utils/alarm-event/alarm-event.util'
import { createIdGenerator } from '../../../utils/id-generator/id-generator.util'
import { DailyPlotElement } from '../../../models/enums/daily-plot-element.enum'
import { PLOT_DIMENSIONS } from '../../../models/constants/plot.constants'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.AlarmEvent)

// Alarm event image dimensions
const ALARM_EVENT_IMAGE_WIDTH = 40

type AlarmEventOptions = PlotOptions<AlarmEvent> & {
  alarmEvents: AlarmEvent[]
}

const defaults: Partial<AlarmEventOptions> = {
  xScale: null
}

/**
 * Plot alarm events in the diabetes management timeline
 *
 * Alarm events represent critical alerts from diabetes management devices such as:
 * - Hypoglycemia alarms (low blood glucose)
 * - Hyperglycemia alarms (high blood glucose)
 * - Device malfunctions or errors
 * - Sensor failures
 *
 * Each alarm type is visualized with a specific icon to help patients and caregivers
 * quickly identify the nature of the alarm.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, alarm events data, and event handlers
 * @returns A function that renders alarm events when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotAlarmEvent(pool, {
 *   tidelineData,
 *   alarmEvents: medicalData.alarmEvents,
 *   onElementHover: (event) => showTooltip(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotAlarmEvent = (
  pool: Pool<AlarmEvent>,
  opts: Partial<AlarmEventOptions> = {}
): PlotFunction<AlarmEvent> => {
  const options = _.defaults(opts, defaults) as AlarmEventOptions

  return (selection: PlotSelection<AlarmEvent>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale
    const height = pool.height() - PLOT_DIMENSIONS.DEFAULT_IMAGE_MARGIN

    // Helper functions using closure variables
    const xPos = (d: AlarmEvent): number => xScale(d.epoch)
    const imageX = (d: AlarmEvent): number => xPos(d) - ALARM_EVENT_IMAGE_WIDTH / 2
    const imageY = (): number => pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2

    /**
     * Create new alarm event visual elements
     */
    const createAlarmEventElements = (
      enter: d3.Selection<d3.EnterElement, AlarmEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, AlarmEvent, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: AlarmEvent) => idGen.testId(d))

      const imageHref = (alarmEvent: AlarmEvent): string => getAlarmEventIcon(alarmEvent.alarmEventType)

      drawImage(group, imageX, imageY(), height, ALARM_EVENT_IMAGE_WIDTH, imageHref)

      return group
    }

    /**
     * Update existing alarm event visual elements
     */
    const updateAlarmEventElements = (
      update: d3.Selection<SVGGElement, AlarmEvent, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, AlarmEvent, SVGGElement, unknown> => {
      update
        .select('image')
        .attr('x', imageX)
        .attr('href', (alarmEvent: AlarmEvent) => getAlarmEventIcon(alarmEvent.alarmEventType))

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const alarmEvents = pool.filterDataForRender(options.alarmEvents)

      // Step 2: Early exit if no data
      if (alarmEvents.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allAlarmEvents = d3.select(this)
        .selectAll<SVGGElement, AlarmEvent>(`g.${idGen.groupSelector()}`)
        .data(alarmEvents, (data: AlarmEvent) => data.id)

      const alarmEventGroup = allAlarmEvents.join(
        createAlarmEventElements,
        updateAlarmEventElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      alarmEventGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: AlarmEvent) {
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

