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

import i18next from 'i18next'
import {
  DurationUnit,
  type DurationValue,
  type PhysicalActivity,
  PhysicalActivityName,
  type TimePrefs
} from 'medical-domain'
import { type DailyDatumInfo, type DailyDatumLine } from '../../models/daily-datum-info.model'
import { convertValueToMinutes } from '../datetime/datetime.util'
import { formatInputTime } from '../format/format.util'

const t = i18next.t.bind(i18next)

const getPhysicalActivityDurationInMinutes = (physicalActivity: PhysicalActivity): DurationValue => {
  const units = physicalActivity.duration.units
  const duration = physicalActivity.duration.value
  const value = convertValueToMinutes(duration, units)

  return {
    units: DurationUnit.Minutes,
    value
  }
}

const getPhysicalActivityDisplayName = (name: string): string => {
  const nameUppercase = name.toUpperCase()
  if (name && Object.values(PhysicalActivityName).includes(nameUppercase as PhysicalActivityName)) {
    return t(`params|${nameUppercase}`)
  }
  return t(`params|${PhysicalActivityName.AerobicDefault}`)
}

export const getPhysicalActivityInfo = (physicalActivity: PhysicalActivity, timePrefs: TimePrefs): DailyDatumInfo => {
  const duration = getPhysicalActivityDurationInMinutes(physicalActivity)
  const lines: DailyDatumLine[] = []

  if (physicalActivity.name && physicalActivity.name !== "") {
    lines.push({ label: t('Name'), value: getPhysicalActivityDisplayName(physicalActivity.name) })
  }
  lines.push(
    { label: t('Intensity'), value: t(`${physicalActivity.reportedIntensity}-pa`) },
    { label: t('Duration'), value: `${duration.value} ${t(duration.units)}` }
  )
  if (physicalActivity.inputTime) {
    lines.push({ label: t('Entered at'), value: formatInputTime(physicalActivity.inputTime, timePrefs) })
  }
  if (physicalActivity.updateTime && physicalActivity.updateTime != physicalActivity.inputTime) {
    lines.push({ label: t('Updated at'), value: formatInputTime(physicalActivity.updateTime, timePrefs) })
  }

  return {
    title: t('Physical Activity'),
    lines
  }
}
