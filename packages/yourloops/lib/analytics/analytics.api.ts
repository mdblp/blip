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

import HttpService from '../http/http.service'
import { type ClickEvent } from './models/click.model'
import { logError } from '../../utils/error.util'
import config from '../config/config'

const ANALYTICS_API_BASE_URL = `/analytics`
const HOVER_MIN_TIME_MS = 500

export enum ElementType {
  Button = 'button',
  Link = 'link',
  Toggle = 'toggle'
}

interface EventKey {
  name: string
  action: string
  elementType?: ElementType
}

interface HoverTracker {
  name: string
  startTime: number
  timeoutId: NodeJS.Timeout
}

export default class AnalyticsApi {
  private static readonly hoverTrackers: Map<string, HoverTracker> = new Map()

  private static getEventKey(event: EventKey): string {
    return `${event.action}:${event.name}:${event.elementType ?? ''}`
  }

  static trackClick(metricName: string, type: ElementType) {
    if (config.METRICS_CLICKODROME_ENABLED) {
      const tags = {
        "elementType": type
      }
      const payload = {
        name: metricName,
        value: 1,
        timestamp: new Date().toISOString(),
        action: 'click',
        tags
      }
      HttpService.post<void, ClickEvent>({
        url: `${ANALYTICS_API_BASE_URL}/v1/metrics`,
        payload
      }).catch((err) => {
        logError(`cannot send analytics: ${err}`, 'send-metrics')
      })
    }
  }

  static trackHover(metricName: string) {
    if (config.METRICS_CLICKODROME_ENABLED) {
      const eventKey = this.getEventKey({ name: metricName, action: 'hover' })
      // If the tracker is already existing, do nothing.
      // It's a duplicate (user hovered again before the previous tracker was sent)
      const tracker = this.hoverTrackers.get(eventKey)
      if (tracker) {
        return
      }

      // Set up a delayed tracking - only triggered after HOVER_MIN_TIME_MS
      const timeoutId = setTimeout(() => {
        const eventKey = this.getEventKey({ name: metricName, action: 'hover' })
        const payload = {
          name: metricName,
          value: 1,
          timestamp: new Date().toISOString(),
          action: 'hover',
          tags: {}
        }

        HttpService.post<void, ClickEvent>({
          url: `${ANALYTICS_API_BASE_URL}/v1/metrics`,
          payload
        }).catch((err) => {
          logError(`cannot send analytics: ${err}`, 'send-metrics')
        })
        this.hoverTrackers.delete(eventKey)
      }, HOVER_MIN_TIME_MS)

      // Store the tracker
      this.hoverTrackers.set(eventKey, {
        name: metricName,
        startTime: Date.now(),
        timeoutId
      })
    }
  }

  /* Cancel hover when leaving an element, will cancel only if the tracker
  was called before HOVER_MIN_TIME_MS (after this the tracker is already sent
   to the server) */
  static cancelHover(metricName: string) {
    const eventKey = this.getEventKey({ name: metricName, action: 'hover' })
    const tracker = this.hoverTrackers.get(eventKey)
    if (tracker) {
      clearTimeout(tracker.timeoutId)
      this.hoverTrackers.delete(eventKey)
    }
  }
}
