/*
 * Copyright (c) 2022-2023, Diabeloop
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

import { type DateTitle } from '../../components/tooltips/common/tooltip/tooltip'
import { type BaseDatum, Source, type TimePrefs } from 'medical-domain'
import { formatLocalizedFromUTC, getHourMinuteFormat, TIMEZONE_UTC } from '../datetime/datetime.util'
import moment from 'moment-timezone';

export const getDateTitle = (normalTime: string, data: BaseDatum, timePrefs: TimePrefs): DateTitle => {
  return {
    source: data.source ?? Source.Diabeloop,
    normalTime,
    timezone: data.timezone ?? TIMEZONE_UTC,
    timePrefs
  }
}

export const getDateTitleForBaseDatum = (data: BaseDatum, timePrefs: TimePrefs): DateTitle => {
  return getDateTitle(data.normalTime, data, timePrefs)
}

export const computeDateValue = (dateTitle?: DateTitle) => {
  if (!dateTitle) {
    return undefined
  }

  if (dateTitle.source === Source.Diabeloop) {
    // For Diabeloop devices, use the timezone of the object
    const timezoneName = dateTitle ? dateTitle?.timePrefs?.timezoneName : ''
    const { timezone: datumTimezone } = dateTitle
    const mNormalTime = moment.tz(dateTitle.normalTime, datumTimezone === TIMEZONE_UTC ? timezoneName : datumTimezone)
    return mNormalTime.format(getHourMinuteFormat())
  }

  return formatLocalizedFromUTC(dateTitle.normalTime, dateTitle.timePrefs, getHourMinuteFormat())
}
