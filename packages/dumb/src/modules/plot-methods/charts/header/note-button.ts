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
import newNoteIcon from 'new-note.svg'

// Fixed position and size of the button in the labels layer, to the left of the timeline
const NEW_NOTE_BUTTON_POSITION = { x: 0, y: 71 } as const
const NEW_NOTE_BUTTON_SIZE = { width: 36, height: 29 } as const

const NEW_NOTE_ICON_CLASS = 'newNoteIcon'

export type NoteButtonContainer = d3.Selection<SVGGElement, unknown, HTMLElement, unknown>

export interface NoteButtonOptions {
  onNewNoteClick?: () => void
  onNewNoteHover?: (data: { element: SVGImageElement }) => void
  onElementOut?: () => void
}

/**
 * Plot the "create note" button in the diabetes management timeline
 *
 * The button is a single, fixed-position affordance (not tied to any data point)
 * that lets the user open the note creation flow. It is rendered once and kept
 * up to date on subsequent calls thanks to a singleton D3 data join.
 *
 * @param container - The selection to append the button to (the chart's labels layer)
 * @param opts - Event handlers for hover and click interactions
 *
 * @example
 * ```typescript
 * plotNoteButton(d3.select('#tidelineLabels'), {
 *   onNewNoteHover: (event) => showNewNoteTooltip(event.element),
 *   onElementOut: () => hideTooltip(),
 *   onNewNoteClick: () => openNoteCreation()
 * })
 * ```
 */
export const plotNoteButton = (
  container: NoteButtonContainer,
  opts: NoteButtonOptions = {}
): void => {
  const button = container
    .selectAll<SVGImageElement, null>(`image.${NEW_NOTE_ICON_CLASS}`)
    .data([null])
    .join('image')
    .classed(NEW_NOTE_ICON_CLASS, true)
    .attr('id', NEW_NOTE_ICON_CLASS)
    .attr('data-testid', 'new-note-button')
    .attr('href', newNoteIcon)
    .attr('x', NEW_NOTE_BUTTON_POSITION.x)
    .attr('y', NEW_NOTE_BUTTON_POSITION.y)
    .attr('width', NEW_NOTE_BUTTON_SIZE.width)
    .attr('height', NEW_NOTE_BUTTON_SIZE.height)
    .style('cursor', 'pointer')

  button
    .on('mouseover', function (this: SVGImageElement) {
      opts.onNewNoteHover?.({ element: this })
    })
    .on('mouseout', () => {
      opts.onElementOut?.()
    })
    .on('click', () => {
      opts.onNewNoteClick?.()
    })
}

