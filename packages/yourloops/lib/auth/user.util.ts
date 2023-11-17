/*
 * Copyright (c) 2023, Diabeloop
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
import { Unit } from 'medical-domain'
import { zendeskLogout } from '../zendesk'
import metrics from '../metrics'

const t = i18next.t.bind(i18next)

const DEFAULT_BG_UNIT = Unit.MilligramPerDeciliter

export const getUserName = (firstName: string, lastName: string, fullName: string): string => {
  return firstName && lastName ? t('user-name', { firstName, lastName }) : fullName
}

export const sanitizeBgUnit = (bgUnit: string): Unit.MilligramPerDeciliter | Unit.MmolPerLiter => {
  const allowedBgUnits: Array< Unit.MilligramPerDeciliter | Unit.MmolPerLiter> = [Unit.MilligramPerDeciliter, Unit.MmolPerLiter]
  const sanitizedUnit = allowedBgUnits.find((unit) => unit.toLocaleLowerCase() === bgUnit?.toLowerCase())
  return sanitizedUnit ?? DEFAULT_BG_UNIT
}
