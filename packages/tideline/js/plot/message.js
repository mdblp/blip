/*
 * == BSD2 LICENSE ==
 * Copyright (c) 2014, Tidepool Project
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the associated License, which is identical to the BSD 2-Clause
 * License as published by the Open Source Initiative at opensource.org.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the License for more details.
 *
 * You should have received a copy of the License along with this program; if
 * not, you can obtain one from Tidepool Project at tidepool.org.
 * == BSD2 LICENSE ==
 */

import bows from 'bows'
import * as d3 from 'd3'
import { getTooltipContainer } from 'dumb/dist/src/utils/daily-chart/daily-chart.util'
import _ from 'lodash'
import newNoteIcon from 'new-note.svg'
import noteIcon from 'note.svg'

function plotMessage(pool, opts = {}) {
  const NEW_NOTE_WIDTH = 36
  const NEW_NOTE_HEIGHT = 29
  const NEW_NOTE_X = 0
  const NEW_NOTE_Y = 71

  const defaults = {
    previewLength: 50,
    tooltipPadding: 20,
    highlightWidth: 4
  }

  const log = bows('TidelineMessage')

  _.defaults(opts, defaults)

  const mainGroup = pool.group()

  function message(selection) {
    opts.xScale = pool.xScale().copy()

    selection.each(function () {
      const medicalData = opts.tidelineData.medicalData
      const notes = pool.filterDataForRender(medicalData.messages)

      const messages = d3
        .select(this)
        .selectAll('g.d3-message-group')
        .data(notes, (d) => d.id)

      const messageGroups = messages
        .enter()
        .append('g')
        .classed('d3-message-group', true)
        .attr('id', function (d) {
          return 'message_' + d.id
        })
        .attr('data-testid', (d) => `note_group_${d.id}`)

      message.addMessageToPool(messageGroups)

      messages.exit().remove()
    })
  }

  message.addMessageToPool = function (selection) {
    opts.xScale = pool.xScale().copy()

    selection
      .append('image')
      .classed('d3-image d3-message', true)
      .attr('href', noteIcon) // updated from xlink:href to href
      .attr('x', message.xPosition)
      .attr('y', message.yPosition)
      .style('cursor', 'pointer')
      .attr('width', opts.size)
      .attr('height', opts.size)

    selection.on('mouseover', function (_event, d) {
      if (opts.onElementHover) {
        opts.onElementHover({
          data: d,
          rect: getTooltipContainer(this)
        })
      }
    })
    selection.on('mouseout', function () {
      if (opts.onElementOut) {
        opts.onElementOut()
      }
    })
    selection.on('click', function (event, datum) {
      event.stopPropagation() // silence the click-and-drag listener

      opts.emitter.emit('noteThread', datum.id)
    })
  }

  message.updateMessageInPool = function (selection) {
    opts.xScale = pool.xScale().copy()

    selection.select('image')
      .attr('x', message.xPosition)
  }

  message.setUpMessageCreation = function () {
    opts.emitter.on('clickToDate', function (date) {
      opts.emitter.emit('createMessage', date)
    })

    opts.emitter.on('messageCreated', function (d) {
      log.info('Adding message to the timeline', d)
      const messageGroup = mainGroup
        .select('#poolMessages_message')
        .append('g')
        .classed('d3-message-group', true)
        .attr('id', `message_${d.id}`)
        .attr('data-testid', (d) => `note_group_${d.id}`)
        .datum(d)
      message.addMessageToPool(messageGroup)
    })

    opts.emitter.on('messageEdited', function (obj) {
      var messageGroup = mainGroup.select('g#message_' + obj.id).datum(obj)
      message.updateMessageInPool(messageGroup)
    })
  }

  /**
   * Render the affordance for adding notes through blip
   */
  message.drawNewNoteIcon = _.once(function () {
    if (!d3.select('#tidelineLabels .newNoteIcon').empty()) {
      // do not draw twice!
      return
    }

    var newNote = d3
      .select('#tidelineLabels')
      .append('image')
      .classed('newNoteIcon', true)
      .attr('id', 'newNoteIcon')
      .attr('href', newNoteIcon)
      .attr('x', NEW_NOTE_X)
      .attr('y', NEW_NOTE_Y)
      .style('cursor', 'pointer')
      .attr('width', NEW_NOTE_WIDTH)
      .attr('height', NEW_NOTE_HEIGHT)

    message.addMessageToPool(newNote)

    newNote.on('mouseover', function () {
      if (opts.onNewNoteHover) {
        opts.onNewNoteHover({
          element: this
        })
      }
    })
    newNote.on('mouseout', function () {
      if (opts.onElementOut) {
        opts.onElementOut()
      }
    })

    newNote.on('click', function () {
      log.debug('newNode click')
      opts.emitter.emit('createMessage', null)
    })
  })

  message.highlightXPosition = (d) => {
    if (!d) {
      return
    }
    return opts.xScale(d.epoch) - opts.size / 2 - opts.highlightWidth
  }

  message.highlightYPosition = (/* d */) => {
    return pool.height() / 2 - opts.size / 2 - opts.highlightWidth
  }

  message.xPosition = (d) => {
    if (!d) {
      return
    }
    return opts.xScale(d.epoch) - opts.size / 2
  }

  message.yPosition = (/* d */) => {
    return pool.height() / 2 - opts.size / 2
  }

  message.xPositionCenter = (d) => {
    return opts.xScale(d.epoch)
  }

  message.yPositionCenter = (/* d */) => {
    return pool.height() / 2
  }

  message.setUpMessageCreation()
  message.drawNewNoteIcon()

  return message
}

export default plotMessage
