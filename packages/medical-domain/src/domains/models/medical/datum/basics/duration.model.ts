/*
 * Copyright (c) 2022, Diabeloop
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

import { isRecord } from '../../../../utils/typeguard.utils'
import DurationUnit from '../enums/duration-unit.enum'

interface Duration {
  duration: DurationValue
  normalEnd: string
  epochEnd: number
}

interface DurationValue {
  units: DurationUnit
  value: number
}

function isDuration(value: unknown): value is Duration {
  if (!isRecord(value)) {
    return false
  }
  if (!isRecord(value.duration)) {
    return false
  }
  if (typeof value.duration.units !== 'string') {
    return false
  }
  if (!(Object.values(DurationUnit).includes(value.duration.units as DurationUnit))) {
    return false
  }
  if (typeof value.duration.value !== 'number') {
    return false
  }
  if (typeof value.normalEnd !== 'string') {
    return false
  }
  return typeof value.epochEnd === 'number'
}

export default Duration
export type { DurationValue }
export { isDuration }
