/*
 * Copyright (c) 2025-2026, Diabeloop
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

import i18next from 'i18next'
import moment from 'moment-timezone'
import { CGMName, type WarmUp } from 'medical-domain'
import { getHourMinuteFormat } from '../datetime/datetime.util'

const t = i18next.t.bind(i18next)

export interface WarmUpTooltipContent {
  title: string
  description: string
  endTime?: string
}

/**
 * `warmupSensorModel` is absent from records created before the backend returned it.
 * Those predate G7 support, so they are treated as G6.
 */
const isG6Sensor = (warmUp: WarmUp): boolean => {
  return warmUp.warmupSensorModel === undefined || warmUp.warmupSensorModel === CGMName.G6
}

/**
 * Only G6 sensors display the warm-up session end time. Later sensor generations
 * get their own title and a description with no value.
 */
export const getWarmUpTooltipContent = (warmUp: WarmUp): WarmUpTooltipContent => {
  if (isG6Sensor(warmUp)) {
    return {
      title: t('sensor-warmup'),
      description: t('sensor-warmup-session-end'),
      endTime: moment.tz(warmUp.epochEnd, warmUp.timezone).format(getHourMinuteFormat())
    }
  }
  return {
    title: t('sensor'),
    description: t('sensor-warmup')
  }
}

export const getWarmUpTitle = (warmUp: WarmUp): string => {
  return getWarmUpTooltipContent(warmUp).title
}

