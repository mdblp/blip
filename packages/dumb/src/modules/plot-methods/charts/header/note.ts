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
import _ from 'lodash'

import { type Note } from 'medical-domain'
import noteIcon from 'note.svg'
import { PLOT_DIMENSIONS } from '../../../../models/constants/plot.constants'
import { DailyPlotElement } from '../../../../models/enums/daily-plot-element.enum'
import { type PlotFunction } from '../../../../models/plot-function.model'
import { type PlotOptions } from '../../../../models/plot-options.model'
import { type PlotSelection } from '../../../../models/plot-selection.model'
import { type Pool } from '../../../../models/pool.model'
import { drawImage, getTooltipContainer } from '../../../../utils/daily-chart/daily-chart.util'
import { createIdGenerator } from '../../../../utils/id-generator/id-generator.util'

// ID generator for consistent element identification
const idGen = createIdGenerator(DailyPlotElement.Note)

type NoteOptions = PlotOptions<Note> & {
  onNoteClick: (data: { data: Note, rect: DOMRect, htmlEvent: MouseEvent }) => void
}

const defaults: Partial<NoteOptions> = {
  xScale: null
}

/**
 * Plot notes (messages left by patients or caregivers) in the diabetes management timeline
 *
 * A note is rendered as a clickable icon positioned at the time it was created.
 * Clicking a note opens its thread (the note itself plus any replies), while
 * hovering it shows a preview tooltip.
 *
 * @param pool - The rendering pool containing scale and dimensions
 * @param opts - Configuration options including scales, data, and event handlers
 * @returns A function that renders notes when called with a D3 selection
 *
 * @example
 * ```typescript
 * const plot = plotNote(pool, {
 *   tidelineData,
 *   onElementHover: (event) => showTooltip(event.data),
 *   onNoteClick: (event) => openNoteThread(event.data)
 * })
 * selection.call(plot)
 * ```
 */
export const plotNote = (
  pool: Pool<Note>,
  opts: Partial<NoteOptions> = {}
): PlotFunction<Note> => {
  const options = _.defaults(opts, defaults) as NoteOptions

  return (selection: PlotSelection<Note>): void => {
    // Initialize xScale from pool
    options.xScale = pool.xScale().copy()

    if (!options.xScale) {
      throw new Error('xScale is not initialized')
    }

    const xScale = options.xScale

    // Helper functions using closure variables
    const getImageX = (d: Note): number =>
      xScale(d.epoch) - PLOT_DIMENSIONS.DEFAULT_SIZE / 2
    const getImageY = (): number =>
      pool.height() / 2 - PLOT_DIMENSIONS.DEFAULT_SIZE / 2

    /**
     * Create new note visual elements
     */
    const createNoteElements = (
      enter: d3.Selection<d3.EnterElement, Note, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Note, SVGGElement, unknown> => {
      const group = enter
        .append('g')
        .classed(idGen.groupSelector(), true)
        .attr('id', idGen.groupId)
        .attr('data-testid', (d: Note) => idGen.testId(d))
        .style('cursor', 'pointer')

      drawImage<Note>(
        group,
        getImageX,
        getImageY(),
        PLOT_DIMENSIONS.DEFAULT_SIZE,
        PLOT_DIMENSIONS.DEFAULT_SIZE,
        noteIcon
      )

      return group
    }

    /**
     * Update existing note visual elements
     */
    const updateNoteElements = (
      update: d3.Selection<SVGGElement, Note, SVGGElement, unknown>
    ): d3.Selection<SVGGElement, Note, SVGGElement, unknown> => {
      update.select('image')
        .attr('x', getImageX)
        .attr('y', getImageY())

      return update
    }

    selection.each(function (this: SVGGElement) {
      // Step 1: Get filtered data from pool
      const notes = pool.filterDataForRender(options.tidelineData.medicalData.messages)

      // Step 2: Early exit if no data
      if (notes.length < 1) {
        d3.select(this).selectAll(`g.${idGen.groupSelector()}`).remove()
        return
      }

      // Step 3: Data join with enter/update/exit
      const allNotes = d3.select(this)
        .selectAll<SVGGElement, Note>(`g.${idGen.groupSelector()}`)
        .data(notes, (d: Note) => d.id)

      const noteGroup = allNotes.join(
        createNoteElements,
        updateNoteElements,
        exit => exit.remove()
      )

      // Step 4: Set up event handlers
      noteGroup
        .on('mouseover', function (this: SVGGElement, _event: MouseEvent, d: Note) {
          options.onElementHover({
            data: d,
            rect: getTooltipContainer(this)
          })
        })
        .on('mouseout', function (this: SVGGElement) {
          options.onElementOut()
        })
        .on('click', function (this: SVGGElement, event: MouseEvent, d: Note) {
          event.stopPropagation() // silence the click-and-drag listener
          options.onNoteClick({
            data: d,
            rect: getTooltipContainer(this),
            htmlEvent: event
          })
        })
    })
  }
}
