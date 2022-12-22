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
import { UnitsType } from '../../units/models/enums/units-type.enum'

export interface Alarms {
  timeSpentAwayFromTargetRate: number
  timeSpentAwayFromTargetActive: boolean
  frequencyOfSevereHypoglycemiaRate: number
  frequencyOfSevereHypoglycemiaActive: boolean
  nonDataTransmissionRate: number
  nonDataTransmissionActive: boolean
}

export interface Thresholds {
  minHighBg: number
  maxHighBg: number
  minVeryLowBg: number
  maxVeryLowBg: number
  minLowBg: number
  maxLowBg: number
}

export interface BgValues {
  bgUnitDefault?: UnitsType
  outOfRangeThresholdDefault?: number
  nonDataTxThresholdDefault?: number
  hypoThresholdDefault?: number
  veryLowBgDefault: number
  lowBgDefault: number
  highBgDefault: number
  reportingPeriodDefault?: number
}

export const DEFAULT_BG_VALUES: BgValues = {
  bgUnitDefault: UnitsType.MGDL,
  outOfRangeThresholdDefault: 50,
  nonDataTxThresholdDefault: 50,
  hypoThresholdDefault: 5,
  veryLowBgDefault: 54,
  lowBgDefault: 70,
  highBgDefault: 180,
  reportingPeriodDefault: 7 * 24
}
export const DEFAULT_THRESHOLDS_IN_MGDL: Thresholds = {
  minHighBg: 140,
  maxHighBg: 250,
  minVeryLowBg: 40,
  maxVeryLowBg: 90,
  minLowBg: 50,
  maxLowBg: 100
}
