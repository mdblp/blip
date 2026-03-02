/*
 * Copyright (c) 2022-2026, Diabeloop
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
import { type BgValues, type Thresholds } from '../../lib/patient/models/monitoring-alerts.model'
import { DEFAULT_BG_BOUNDS, MGDL_UNITS, Unit } from 'medical-domain'

// TODO: ideally these defaults should come from the api.
export const DEFAULT_BG_VALUES: BgValues = {
  bgUnitDefault: Unit.MilligramPerDeciliter,
  outOfRangeThresholdDefault: 50,
  nonDataTxThresholdDefault: 50,
  hypoThresholdDefault: 5,
  hyperThresholdDefault: 15,
  veryLowBgDefault: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryLow,
  veryHighBgDefault: DEFAULT_BG_BOUNDS[MGDL_UNITS].veryHigh,
  lowBgDefault: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetLower,
  highBgDefault: DEFAULT_BG_BOUNDS[MGDL_UNITS].targetUpper,
  reportingPeriodDefault: 7 * 24
}
export const DEFAULT_THRESHOLDS_IN_MGDL: Thresholds = {
  minHighBg: 140,
  maxHighBg: 250,
  minVeryLowBg: 40,
  maxVeryLowBg: 90,
  minVeryHighBg: 180,
  maxVeryHighBg: 400,
  minLowBg: 50,
  maxLowBg: 100
}
