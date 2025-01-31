/*
 * Copyright (c) 2025, Diabeloop
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



import { SecurityBasalConfig, SecurityBasalRate } from 'medical-domain'
import moment from 'moment-timezone'
import i18next from 'i18next'
import { SafetyBasalItem } from '../../models/safety-basal-item.model'

const MINUTES_IN_ONE_HOUR = 60
const TWENTY_FOUR_HOURS_IN_MINUTES = 24 * MINUTES_IN_ONE_HOUR

const t = i18next.t.bind(i18next)

const getRatesSortedByStartTime = (rates: SecurityBasalRate[]): SecurityBasalRate[] => {
  return rates.sort((a: SecurityBasalRate, b: SecurityBasalRate) => {
    if (a.start === b.start) {
      return 0
    }
    if (a.start > b.start) {
      return 1
    }
    return -1
  })
}

const getDisplayTime = (startInMinutes: number) => {
  const hours = Math.floor(startInMinutes / MINUTES_IN_ONE_HOUR)
  const minutes = startInMinutes % MINUTES_IN_ONE_HOUR

  return moment().hours(hours).minutes(minutes).format('LT')
}

const getRateLabel = (rateValue: number) => {
  return `${rateValue} ${t('basal-rate-unit')}`
}

export const getSafetyBasalItems = (safetyBasalConfig: SecurityBasalConfig): SafetyBasalItem[] => {
  const sortedRates = getRatesSortedByStartTime(safetyBasalConfig.rates)

  const items = sortedRates.map((rate: SecurityBasalRate) => ({
    rate: getRateLabel(rate.rate),
    startTime: getDisplayTime(rate.start),
    endTime: ''
  }))

  items.forEach((item, index) => {
    if (index === items.length - 1) {
      item.endTime = getDisplayTime(TWENTY_FOUR_HOURS_IN_MINUTES)
      return
    }
    item.endTime = items[index + 1].startTime
  })

  return items
}
