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

import _ from 'lodash'
import i18next from 'i18next'
import bows from 'bows'
import moment from 'moment-timezone'
import * as d3 from 'd3'

import format from '../data/util/format'
import postItImage from '../../img/message/post_it.svg'
import newNoteImg from '../../img/message/new.png'

const getDateAndTime = (epoch, timezone) => {
  const mTime = moment.utc(epoch).tz(timezone)
  const msgDate = format.datestamp(mTime)
  const msgTime = format.timestamp(mTime)
  return { msgDate, msgTime }
}

function plotMessage(pool, opts = {}) {
  const NEW_NOTE_WIDTH = 36
  const NEW_NOTE_HEIGHT = 29
  const NEW_NOTE_X = 0
  const NEW_NOTE_Y = 45

  const t = i18next.t.bind(i18next)
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

    selection.each(function (currentData) {
      const messages = d3
        .select(this)
        .selectAll('g.d3-message-group')
        .data(currentData, (d) => d.id)

      const messageGroups = messages
        .enter()
        .append('g')
        .classed('d3-message-group', true)
        .attr('id', function (d) {
          return 'message_' + d.id
        })
        .attr('data-testid', (d) => {
          const { msgDate, msgTime } = getDateAndTime(d.epoch, d.timezone)
          return `message-${msgDate}-${msgTime}`
        })

      message.addMessageToPool(messageGroups)

      messages.exit().remove()
    })
  }

  message.addMessageToPool = function (selection) {
    opts.xScale = pool.xScale().copy()

    selection
      .append('rect')
      .classed('d3-rect-message hidden', true)
      .attr('x', message.highlightXPosition)
      .attr('y', message.highlightYPosition)
      .attr('width', opts.size + opts.highlightWidth * 2)
      .attr('height', opts.size + opts.highlightWidth * 2)

    selection
      .append('image')
      .classed('d3-image d3-message', true)
      .attr('href', postItImage) // updated from xlink:href to href
      .attr('x', message.xPosition)
      .attr('y', message.yPosition)
      .style('cursor', 'pointer')
      .attr('width', opts.size)
      .attr('height', opts.size)

    selection.on('mouseover', message.displayTooltip)
    selection.on('mouseout', message.removeTooltip)
    selection.on('click', function (event, datum) {
      log.debug('Message clicked!', datum)
      event.stopPropagation() // silence the click-and-drag listener
      opts.emitter.emit('messageThread', datum.id)
      d3.select(this).selectAll('.d3-rect-message').classed('hidden', false)
    })
  }

  message.displayTooltip = (event, datum) => {
    const tooltips = pool.tooltips()

    const tooltip = tooltips.addForeignObjTooltip({
      cssClass: 'svg-tooltip-message',
      datum: { ...datum, type: 'message' },
      shape: 'generic',
      xPosition: message.xPositionCenter,
      yPosition: message.yPositionCenter
    })

    const foGroup = tooltip.foGroup
    const { msgDate, msgTime } = getDateAndTime(datum.epoch, datum.timezone)

    const htmlDateTime = `<span data-testid="message-from-to" class="message-from-to">${t('{{date}} - {{time}}', { date: msgDate, time: msgTime })}</span>`
    const htmlName = `<span data-testid="message-author" class="message-author">${format.nameForDisplay(datum.user)}:</span>`
    const htmlValue = `<br><span data-testid="message-text" class="message-text">${format.textPreview(datum.messageText)}</span>`

    foGroup
      .append('p')
      .classed('messageTooltip', true)
      .append('span')
      .classed('secondary', true)
      .html(htmlDateTime)

    foGroup
      .append('p')
      .classed('messageTooltip', true)
      .append('span')
      .classed('secondary', true)
      .html(htmlName + htmlValue)

    const dims = tooltips.foreignObjDimensions(foGroup)

    const foreignObj = d3.select(foGroup.node().parentNode)

    tooltips.anchorForeignObj(foreignObj, {
      w: dims.width + opts.tooltipPadding,
      h: dims.height,
      x: message.xPositionCenter(datum),
      y: -dims.height,
      orientation: {
        default: 'leftAndDown',
        leftEdge: 'rightAndDown',
        rightEdge: 'leftAndDown'
      },
      shape: 'generic',
      edge: tooltip.edge
    })
  }

  message.removeTooltip = (event, d) => {
    d3.select('#tooltip_' + d.id).remove()
  }

  message.updateMessageInPool = function (selection) {
    opts.xScale = pool.xScale().copy()

    selection.select('rect.d3-rect-message')
      .attr('x', message.highlightXPosition)

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
        .attr('data-testid', () => {
          const { msgDate, msgTime } = getDateAndTime(d.epoch, d.timezone)
          return `message-${msgDate}-${msgTime}`
        })
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
      .attr('href', newNoteImg)
      .attr('x', NEW_NOTE_X)
      .attr('y', NEW_NOTE_Y)
      .style('cursor', 'pointer')
      .attr('width', NEW_NOTE_WIDTH)
      .attr('height', NEW_NOTE_HEIGHT)

    message.addMessageToPool(newNote)

    newNote.on('mouseover', function () {
      d3.select('#tidelineLabels')
        .append('text')
        .classed('newNoteText', true)
        .attr('x', NEW_NOTE_X + 1)
        .attr('y', NEW_NOTE_Y + 43)
        .text(t('New'))

      d3.select('#tidelineLabels')
        .append('text')
        .classed('newNoteText', true)
        .attr('x', NEW_NOTE_X + 1)
        .attr('y', NEW_NOTE_Y + 56)
        .text(t('note'))
    })
    newNote.on('mouseout', function () {
      d3.selectAll('#tidelineLabels .newNoteText').remove()
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
